var express = require('express'); // Web Framework
var app = express();
var sql = require('mssql'); // MS Sql Server client
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const PDFParser = require('pdf-parse');
const fileupload = require('express-fileupload')
var bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');

// parse application/json
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
  let qu = `INSERT INTO dbo.[User](username,password) 
               VALUES ('` + req.body.email+ `', '`+ req.body.password + `')`;

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
    console.log()
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


