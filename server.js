var express = require('express'); // Web Framework
var app = express();
var sql = require('mssql'); // MS Sql Server client
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const PDFParser = require('pdf-parse');
const fileupload = require('express-fileupload')

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

// Start server and listen on http://localhost:8081/
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at %s", port)
});


// add new user
app.post('/signUp', (req, res) => {
  let newUser = req.body;
  console.log('body' + req.body.email);
  sql.connect(sqlConfig, function() {
  console.log("into db");
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
});