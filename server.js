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
app.post('/signUp', (req, res) => {
	let newUser = req.body;
	console.log('body' + req.body.email);
	sql.connect(sqlConfig, function() {
		var request = new sql.Request();
		let qu = `INSERT INTO dbo.[user_test1](email, password, firstName, lastName) 
				   VALUES ('` + req.body.email+ `', '`+ req.body.password + `', '`+ req.body.firstName + `', '`+ req.body.lastName + `')`;

		request.query(qu, function(err, recordset) {
			if(err)
			{
				console.log("error occured");
			    res.send({
					"code":400,
					"failed":"error ocurred"
			    });
				
			}
			else
			{
				res.send({
					"code":200,
					"success": 'register user success'
				});
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
 
  let qu = `SELECT * FROM dbo.[user_test1]
          WHERE email= '` + req.body.email + `'`;
 
  request.query(qu, async function (error, results, fields) {
    if (error)
    {
       console.log("error occured");
	   res.send({
        "code":400,
        "failed":"error ocurred"
       });
    }
    else
    {
      if(results.recordset && results.recordset.length >0)
      {
        //const comparision = await bcrypt.compare(password, results.recordset[0].password //ToDO - encrypt the password
		const comparision = (password == results.recordset[0].password)
		console.log('comparison' + comparision)
        if(comparision)
        {
           console.log("login successful")
		    res.send({
              "code":200,
              "success":"login successfull"
            })
        }
        else
        {
          console.log("Email and password does not match")
		  res.send({
               "code":204,
               "success":"Email and password does not match"
          });
        }
      }
      else
      {
         console.log("Email does not exits")
		 res.send({
          "code":206,
          "success":"Email does not exits"
         });
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
			   res.send({
				"code":400,
				"failed":"error ocurred"
			   });
			}
			else 
			{
				res.send({
				  "code":200,
				  "banks":results.recordset,
				})
			}
        });
    });
})

//choose bank


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
			   res.send({
				"code":400,
				"failed":"The bank id is invalid or error occured"
			   });
			}
			else 
			{
				res.send({
				  "code":200,
				  "account":results.recordset,
				})
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
	console.log("enter retrieve user id function");
	sql.connect(sqlConfig, function() {
	var request = new sql.Request();
	let qu = `SELECT * FROM dbo.[user_test1]
          WHERE email= '` + email + `'`;
		  
	console.log('query' + qu)
 
    request.query(qu, function (error, results, fields) {
		if (error)
		{
		   console.log("error occured");
		   return 0;
		}
		else
		{
		  if(results.recordset && results.recordset.length >0)
		  {
			  console.log(results.recordset[0].userId);
			  return results.recordset[0].userId;
		  }
		  else 
		  {
			  console.log("user not present")
			  return 0;
		  }
		}
	  
	});
	});
}


//To Do Check why error in retrieval 
function retrieveUserAccountCombination(userId, accountTypeId, bankId)
{
	sql.connect(sqlConfig, function() {
	var request = new sql.Request();
	let qu = `SELECT * FROM dbo.[userBankAccountDetails]
          WHERE userId= '` + userId + `'
		  AND accountTypeId = '` + accountTypeId + `'
		  AND bankId = '` + accountTypeId + `'`;
 
    request.query(qu, async function (error, results, fields) {
		if (error)
		{
		   console.log("error occured");
		   return 0;
		}
		else
		{
		  if(results.recordset && results.recordset.length >0)
		  {
			  return 1;
		  }
		  else 
		  {
			  console.log("user not present")
			  return 0;
		  }
		}
	  
	});
	});
}

//Receive bank id, acount type id, and bank statement
app.post('/updateUserDetails', upload.single('file'),(req, res) => {

	sql.connect(sqlConfig, function() {
		var request = new sql.Request();


		//userId =  retrieveUserId();
		//console.log('userid' + userId)
		//check if the user id, bank id, account id combination exist.  

		userId = 1; //check if the user exist. retrieve userId

		let qu = `INSERT INTO dbo.[userBankAccountDetails](userId, bankId, accountTypeId, status) 
			   VALUES ('` + userId + `', '`+ req.body.bankId + `', '`+ req.body.accountTypeId + `', 1)`;

				 
		request.query(qu, function(err, recordset) {
		if(err){
			res.send({
				"code":400,
			})
		}
		else 
		{
			analyzeBankStatement(req.file.originalname, req.body.accountTypeId);
			res.send({
				"code":200,
				"filedetails":req.file,
			})
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


function parseStatement(accountTypeId)
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




