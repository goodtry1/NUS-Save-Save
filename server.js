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

	let dataBuffer = fs.readFileSync('./uploads/' + req.file.originalname);
	const options = {
	pagerender: render_page,
	version: 'v1.10.100'
	};                                                

	PDFParser(dataBuffer, options).then(async function (data) {
		fs.writeFileSync('./uploads/result.txt', data.text);
		result  = await parseStatement(req.body.accountTypeId);
		console.log(result);
		deleteFile("./uploads/")
		res.status(200).send()
	});
  
    var dateAnalysed = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
	//Update the Bank acocunt details table
	
	sql.connect(sqlConfig,  function() {
	var request = new sql.Request();

	let qu = `INSERT INTO dbo.[parsedBankStatementData](dateAnalysed, userId, accountTypeId, previousMonthBalance, statementDate, salary, currentMonthBalance, totalWithdrawal, totalDeposit,  totalInterest, averageDailyBalance) 
		   VALUES ( '`+ dateAnalysed + `', '` + req.body.userId + `', '`+ req.body.accountTypeId + `', '`+ result['previousMonthBalance'] + `' , '`+ result['date'] + `' , '`+ result['salary'] + `' , '`+ result['currentMonthBalance'] + `' , '`+ result['totalWithdrawals'] + `' , '`+ result['totalDeposits'] + `' , '`+ result['totalInterests'] + `' , '`+ result['averageDailyBalance'] + `')`;

			 
	request.query(qu, function(error, recordset) {
	if(error){
		res.status(400).send()
	}
	else 
	{
		res.status(200).send()
	}
	});

	});
	
	
	
	
})


//get recommendations for the userid and accounttypeid
app.post('/fetchrecommendations', (req, res) =>  {
    userId = req.body.userId;
    console.log('userId' + userId)
    accountTypeid = req.body.accountTypeid;
    console.log('userId' + accountTypeid)    
    sql.connect(sqlConfig, function() {
        console.log("into db");
        var request = new sql.Request();
        query_str = "DECLARE @ROUTPUT VARCHAR(8000); exec [dbo].[usp_getRecommendation] "+ userId + ", " +accountTypeid+ ", " + "@Routput OUTPUT; SELECT @Routput";
        console.log(query_str)
        request.query(query_str, function(err,results){
            if (err)
            {
               console.log("error occured");
               res.status(400).send()
               
            }
            else 
            {
                res.status(200).send({"recommendation":results.recordset})
            }
        });
    });
})


// default render callback
function render_page(pageData) {
  let render_options = {
    normalizeWhitespace: true,
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
	
  return new promise(function(resolve, reject) {
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
      indexMap.set('previousMonthBalance', lineIndex - 1);
      result['previousMonthBalance'] = parseFloat(textMap.get(lineIndex - 1).replace(/\s|,|/g, ''));
	  
	  indexMap.set('date', lineIndex - 2);
      result['date'] = textMap.get(lineIndex - 2);
    }

    // get current month balance and current month
    if (line === 'BALANCE C/F') {
      indexMap.set('currentMonthBalance', lineIndex - 1);
      result['currentMonthBalance'] = parseFloat(textMap.get(lineIndex - 1).replace(/\s|,|/g, ''));
    }

    // get the indexes of the lines for this month's total withdraws/deposits, total interests this year and this month's average daily balance
    if (line === 'Total Withdrawals/Deposits') {
      indexMap.set('totalWithdrawalsDeposits', lineIndex + 3);
    }
    if (line === 'Total Interest Paid This Year') {
      indexMap.set('totalInterests', lineIndex + 3);
    }
    if (line === 'Average Balance') {
      indexMap.set('averageDailyBalance', lineIndex + 3);
    }

    // try to find salary credit
    if (line === 'GIRO - SALARY') {
      indexMap.set('salary', lineIndex - 1);
      result['salary'] = parseFloat(textMap.get(lineIndex - 1).trim().split(/\s+/)[2].replace(/\s|,|/g, ''));
    }

    // try to find credit card payment
    if (line === 'BILL PAYMENT     INB') {
      indexMap.set('creditCardSpend', lineIndex - 1);
      result['creditCardSpend'] = parseFloat(textMap.get(lineIndex - 1).trim().split(/\s+/)[2].replace(/\s|,|/g, ''));
    }

    lineIndex++;
  });


  readInterface.on('close', function () {
    // set this month's total withdraws/deposits, total interests this year and this month's average daily balance
    let array = textMap.get(indexMap.get('totalWithdrawalsDeposits')).trim().split(/\s+/);
    result['totalWithdrawals'] = parseFloat(array[1].replace(/\s|,|/g, ''));
    result['totalDeposits'] = parseFloat(array[0].replace(/\s|,|/g, ''));
    result['totalInterests'] = parseFloat(textMap.get(indexMap.get('totalInterests')).replace(/\s|,|/g, ''));
    result['averageDailyBalance'] = parseFloat(textMap.get(indexMap.get('averageDailyBalance')).replace(/\s|,|/g, ''));

    // send the final result for this month
   // console.log(result);
	resolve (result)
	
  });
  
  });

}



function recommendationEngine(userid,accountTypeid)
{



    sql.connect(sqlConfig, function(i) {
        console.log("into db: " + i);
        for (i=19;i<24;i++){

            var request = new sql.Request();
            query_str = "exec [dbo].[usp_OCBCRecommendation] " + userid + ", " +accountTypeid+ ", " + 23 ;
            console.log(query_str);
            request.query(query_str, function(err,rows){
            if(err) throw err;
            //console.log(rows);
            });
        }

    });

}