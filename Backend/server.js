var express = require('express'); // Web Framework
var app = express();
var sql = require('mssql'); // MS Sql Server client
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const PDFParser = require('pdf-parse');
var bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
var multer = require('multer');
var promise = require('promise');
const DATE_FORMATER = require( 'dateformat' );

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

app.use(bodyParser.json())

// Connection string parameters.
var sqlConfig = {
    user: 'fintechlab',
    password: 'InformationSystems88DISA!',
    server: 'fintechlab.database.windows.net',
    database: 'SaveSave'
}

// Start server and listen on http://localhost:5001/
var server = app.listen(5001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at %s", port)
});


// add new user
app.post('/signUp', async (req, res) => {
  let newUser = req.body;
  console.log('body' + req.body.email);
  const userId =  await retrieveUserId(req.body.email); //ToDo : if this value is 0, send an error message stating the user already present.
  
  sql.connect(sqlConfig, function() {
    var request = new sql.Request();
    
    var joiningDate = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );

    let qu = `INSERT INTO dbo.[User](email, password, firstName, lastName, joiningDate) 
           VALUES ('` + req.body.email+ `', '`+ req.body.password + `', '`+ req.body.firstName + `', '`+ req.body.lastName + `' , '`+ joiningDate + `')`;

    request.query(qu, function(error, recordset) {
      if(error)
      {
        console.log("error occured");
          res.status(400).send()
        
      }
      else
      {
        res.status(200).send()
      }   
    });
  });
})

// signin
app.post('/signin', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log('body' + req.body.email + req.body.password);
  sql.connect(sqlConfig, function() {
  var request = new sql.Request();
 
  let qu = `SELECT * FROM dbo.[User]
          WHERE email= '` + req.body.email + `'`;
 
  request.query(qu, async function (error, results, fields) {
    if (error)
    {
       console.log("error occured");
     res.status(400).send()
    }
    else
    {
      if(results.recordset && results.recordset.length >0)
      {
        //const comparision = await bcrypt.compare(password, results.recordset[0].password //ToDO - encrypt the password
    const comparision = (password == results.recordset[0].password)
        if(comparision)
        {
           console.log("login successful")
       res.status(200).send({"userDetails" : results.recordset[0]})

        }
        else
        {
          console.log("Email and password does not match")
      res.status(204).send()
        }
      }
      else
      {
         console.log("Email does not exits")
     res.status(206).send()
      }
    }
  });
  });
}); 

//get banks
app.get('/bankdetails', function (req, res) {
    sql.connect(sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from dbo.bank', function(error, results) {
      if (error)
      {
         console.log("error occured");
         res.status(400).send()
      }
      else 
      {
        res.status(200).send({"banks":results.recordset})
      }
        });
    });
})


//get user bank account details
app.post('/userBankAccountDetails', function (req, res) {
  userId = req.body.userId;
  
    sql.connect(sqlConfig, function() {
        var request = new sql.Request();
    let qu = `SELECT userAccount.userBankAccountId, userAccount.userId, userAccount.accountTypeId, account.accountTypeName, account.bankId, account.baseInterestRate, userAccount.date, userAccount.status
        FROM userAccount
        INNER JOIN account ON userAccount.accountTypeId = account.accountTypeId
        AND userAccount.userId = '` + userId + `'`;
        request.query(qu, function(error, results) {
      if (error)
      {
         console.log("error occured");
         res.status(400).send()
      }
      else 
      {
        res.status(200).send({"userBankAccountDetails":results.recordset})
      }
        });
    });
})


//add Bank Account for a particular user.
app.post('/addBankAccount', (req, res) =>  {

    sql.connect(sqlConfig, function() {
        var request = new sql.Request();
    
    var dateNow = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
  
    let qu = `INSERT INTO dbo.[userAccount](userId, accountTypeId, status, date) 
         VALUES ('` + req.body.userId + `', '`+ req.body.accountTypeId + `', 1 , '`+ dateNow + `')`;

    console.log(qu)
         
    request.query(qu, function(err, recordset) {
    if(err){
      res.status(400).send()
    }
    else 
    {
      res.status(200).send()
    }
    });
    });
})



//get account type based on bank id
app.post('/fetchAccountType', (req, res) =>  {
  bank_id = req.body.bankid;
  console.log('bankid' + bank_id)
    sql.connect(sqlConfig, function() {
        var request = new sql.Request();
      let qu = `SELECT * FROM dbo.account
                   WHERE bankId= '` + req.body.bankid + `'`;
        console.log(qu)
        request.query(qu, function(error, results) {
      if (error)
      {
         console.log("error occured");
         res.status(400).send()
         
      }
      else 
      {
        res.status(200).send({"account":results.recordset})
      }
        });
    });
})

//Deletes files in the folder.
function deleteFile(path)
{
  const fsExtra = require('fs-extra')
  fsExtra.emptyDirSync(path)
}

// setting for url encoding
app.use(bodyParser.urlencoded({ extended: false })) 

 
function retrieveUserId(email)
{
  return new promise(function(resolve, reject) {
  console.log("enter retrieve user id function");
  sql.connect(sqlConfig, function() {
  var request = new sql.Request();
  let qu = `SELECT * FROM dbo.[User]
          WHERE email= '` + email + `'`;
      
    request.query(qu, function (error, results, fields) {
    if (error)
    {
       console.log("error occured");
       resolve( 0);
    }
    else
    {
      if(results.recordset && results.recordset.length >0)
      {
        console.log(results.recordset[0].userId);
        resolve(results.recordset[0].userId);
      }
      else 
      {
        console.log("user not present")
        resolve(0);
      }
    }
    
  });
  });
  });
}

//upload bank account statement client passes userId and accountTypeId
app.post('/uploadBankStatement', upload.single('file'), async(req, res) => {
  
  analyzeBankStatement(req.file.originalname, req.body.accountTypeId);
  res.status(200).send()
  //parse and update the Bank acocunt details table
})

//Receive bank id, acount type id, and bank statement
app.post('/updateUserDetails', upload.single('file'), async(req, res) => {
  
  const userId =  await retrieveUserId(req.body.email);
    console.log('userid' + userId)
    //check if the user id, bank id, account id combination exist.  
    
    
  sql.connect(sqlConfig,  function() {
    var request = new sql.Request();

    let qu = `INSERT INTO dbo.[userAccount](userId, accountTypeId, status, date) 
         VALUES ('` + userId + `', '`+ req.body.bankId + `', '`+ req.body.accountTypeId + `', 1, '`+ req.body.date + `')`;

    console.log(qu)
         
    request.query(qu, function(error, recordset) {
    if(error){
      res.status(400).send()
    }
    else 
    {
      analyzeBankStatement(req.file.originalname, req.body.accountTypeId);
      res.status(200).send()
    }
    });

    });
})




function analyzeBankStatement(filename, accountTypeId)
{
  let dataBuffer = fs.readFileSync('./uploads/' + filename);
  const options = {
  pagerender: render_page,
  version: 'v1.10.100'
  };                                                

  PDFParser(dataBuffer, options).then(function (data) {
    fs.writeFileSync('./uploads/result.txt', data.text);
  //if(accountTypeId == 1)
    parseStatement(accountTypeId);
  deleteFile("./uploads/")
  });
}


// default render callback
function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: true,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false
  }

  return pageData.getTextContent(render_options)
    .then(function (textContent) {
      let lastY, text = '';
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          text += item.str;
        } else {
          text += '\n' + item.str;
        }
        lastY = item.transform[5];
      }
      return text;
    });
}


function parseStatement(parsestatement)
{
  // record the index of each line in raw text data
  let lineIndex = 1;

  // map and index map
  let textMap = new Map();
  let indexMap = new Map();

  // extracted information
  let result = {};

  let readInterface = readline.createInterface({
    input: fs.createReadStream('./uploads/result.txt')
  });

  readInterface.on('line', function (line) {
    textMap.set(lineIndex, line);
    // get previous month balance
    if (line === 'BALANCE B/F') {
      indexMap.set('previous_month_balance', lineIndex - 1);
      result['previous_month_balance'] = parseFloat(textMap.get(lineIndex - 1).replace(/\s|,|/g, ''));
    
    indexMap.set('current_month', lineIndex - 2);
      result['current_month'] = textMap.get(lineIndex - 2);
    }

    // get current month balance and current month
    if (line === 'BALANCE C/F') {
      indexMap.set('current_month_balance', lineIndex - 1);
      result['current_month_balance'] = parseFloat(textMap.get(lineIndex - 1).replace(/\s|,|/g, ''));
    }

    // get the indexes of the lines for this month's total withdraws/deposits, total interests this year and this month's average daily balance
    if (line === 'Total Withdrawals/Deposits') {
      indexMap.set('total_withdrawals_deposits', lineIndex + 3);
    }
    if (line === 'Total Interest Paid This Year') {
      indexMap.set('total_interests', lineIndex + 3);
    }
    if (line === 'Average Balance') {
      indexMap.set('average_daily_balance', lineIndex + 3);
    }

    // try to find salary credit
    if (line === 'GIRO - SALARY') {
      indexMap.set('salary', lineIndex - 1);
      result['salary'] = parseFloat(textMap.get(lineIndex - 1).trim().split(/\s+/)[2].replace(/\s|,|/g, ''));
    }

    // try to find credit card payment
    if (line === 'BILL PAYMENT     INB') {
      indexMap.set('credit_card_spend', lineIndex - 1);
      result['credit_card_spend'] = parseFloat(textMap.get(lineIndex - 1).trim().split(/\s+/)[2].replace(/\s|,|/g, ''));
    }

    lineIndex++;
  });


  readInterface.on('close', function () {
    // set this month's total withdraws/deposits, total interests this year and this month's average daily balance
    let array = textMap.get(indexMap.get('total_withdrawals_deposits')).trim().split(/\s+/);
    result['total_withdrawals'] = parseFloat(array[1].replace(/\s|,|/g, ''));
    result['total_deposits'] = parseFloat(array[0].replace(/\s|,|/g, ''));
    result['total_interests'] = parseFloat(textMap.get(indexMap.get('total_interests')).replace(/\s|,|/g, ''));
    result['average_daily_balance'] = parseFloat(textMap.get(indexMap.get('average_daily_balance')).replace(/\s|,|/g, ''));

    // send the final result for this month
    console.log(result);
  
  });
}




