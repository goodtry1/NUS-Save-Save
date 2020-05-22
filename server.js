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
var upload = multer({dest:'uploads/'});

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
  let qu = `INSERT INTO dbo.[User](username,password, bankId, accountTypeId) 
               VALUES ('` + req.body.email+ `', '`+ req.body.password + `', NULL, NULL)`;

  request.query(qu, function(err, recordset) {
        if(err) console.log(err);
        });
  
  });
  
  res.send({
    result: 'register user success'
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
          WHERE username= '` + req.body.email + `'`;
 
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
              "success":"login sucessfull"
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

//Deletes files in the folder. To-DO : add this after analyse result api
function deleteFile(path)
{
	const fsExtra = require('fs-extra')
	fsExtra.emptyDirSync(path)
}



// setting for url encoding
app.use(bodyParser.urlencoded({ extended: false })) 


//Receive bank id, acount type id, and bank statement
app.post('/updateUserDetails', upload.single('file'),(req, res) => {

  sql.connect(sqlConfig, function() {
  var request = new sql.Request();

  let qu  = `UPDATE dbo.[User]
			SET bankId = '` + req.body.bankId + `', accountTypeId = '` + req.body.accountTypeId + `'
			WHERE username = '`+ req.body.username +`'`
			
  console.log(qu)
			 
  request.query(qu, function(err, recordset) {
	if(err){
		res.send({
			"code":400,
		})
	}
	else 
	{
		res.send({
			"code":200,
			"filedetails":req.file,
		})
	}
	});

  });
})



function retrieve_userdetails(user)
{
	sql.connect(sqlConfig, function() {
	var request = new sql.Request();
	let qu = `SELECT * FROM dbo.[User]
          WHERE username= '` + user + `'`;
 
    request.query(qu, async function (error, results, fields) {
		if (error)
		{
		   console.log("error occured");
		   return null;
		}
		else
		{
		  if(results.recordset && results.recordset.length >0)
		  {
			  console.log(results.recordset)
			  return results.recordset;
		  }
		  else 
		  {
			  console.log("user not present")
			  return null
		  }
		}
	  
	});
	});
}




