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
const DATE_FORMATER = require('dateformat');
var nodemailer = require('nodemailer');
var randomize = require('randomatic');

//cors
var cors = require('cors');
app.use(cors());

var parser = require("./parser")

// Configuration for file uploads
var storage = multer.diskStorage({
	destination: function (req, files, cb) {
		cb(null, 'uploads')
	},
	filename: function (req, files, cb) {
		cb(null, files.originalname)
	}
})

var upload = multer({ storage: storage })

app.use(bodyParser.json())

// Configuration for sql connection
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

// NOTE: This code is only used at the start when we changed from plaintext pw to hash. No longer needed. Delete as required.
/* function updateUserTable() {
	console.log("updateUserTable called :D ")
	sql.connect(sqlConfig, function () {

		var request = new sql.Request();
		//var joiningDate = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");
		let qu = `SELECT * FROM dbo.[User]
				  WHERE hashedPw  IS NULL `;

		request.query(qu, function (error, results) {
			if (error) {
				console.log("error occured");
				console.log(error)
				
			}
			else {
				console.log(results.recordset.length);
				let record = results.recordset;
				let size = results.recordset.length;
				let rounds = 10;
				//results.recordset[0].password
				//for ( i = 0; i < 1; i++  ) {
					var pw = record[0].password;
				//	var uId = record[i].userId;
				//	console.log(record[i].firstName)

					bcrypt.hash(pw, rounds).then(function(hash) {
						if (hash == false) {
							console.log(err);
							res.status(400).send()
						}
						console.log(hash)
						console.log("updating for user: " + record[0].firstName + "uid: " + record[0].userId)
						let newQu = `UPDATE dbo.[User] 
									SET hashedPw = '` + hash + `'
									WHERE userId = '` + 44 + `'`;


						request.query(newQu, function (error,results) {
							if (error) {
								console.log("db error. cannot update.") 
								console.log(error) 
							} else {
								console.log("success!")
								//console.log(results)  
							}
						})
					})
				//}




			} 
		});

	});
} */


//two factor authentication email configuration
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'savesave462@gmail.com',
		pass: 'SaveSave123$'
	}
});

// upon enter.. just to test app is working.
app.get('/', (req, res) => {
	res.send("App is working fine but you are not supposed to enter here.... :D.")
})

// two factor authentication for signup
app.post('/twoFactorAuthenticate', async (req, res) => {

	let action = req.body.action;
	const userId = await retrieveUserId(req.body.email);
	console.log('userId' + userId)
	if (action == "signUp" && userId != 0) {
		console.log('user already exist')
		res.status(206).send()
	}
	else if (action == "signIn" && userId == 0) {
		console.log('user does not exist')
		res.status(206).send()
	}
	else {
		var otp = randomize('0', 6)
		var otpDate = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");
		var mailOptions = {
			from: 'savesave462@gmail.com',
			to: req.body.email,
			subject: 'Save Save - One Time Password',
			text: `Dear User,
		  	        
	Your Login OTP is ${otp}.
	This OTP is generated at ${otpDate}.
	The OTP is confidential and for security reasons, DO NOT share the OTP with anyone.`
		}

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log('error')
				res.status(400).send()
			}
			else {
				res.status(200).send({ "otp": otp })
			}
		});

	}
})

// signUp using bCrypt.
app.post('/signUp', async (req, res) => {
	console.log('bcrypt called.');
	let newUser = req.body;
	console.log('body' + req.body.email);
	const userId = await retrieveUserId(req.body.email);
	console.log('userId' + userId);

	if (userId != 0) {
		console.log('user already exist')
		res.status(206).send()
	}
	else {
		var rounds = 10; // cost factor of 10 rounds. meaning calculation is done 2^10 times  to get final hash.  
		var plainTextPw = req.body.password;
		bcrypt.hash(plainTextPw, rounds).then(function(hash) {
			if (hash == false) {
				console.log(err);
				res.status(400).send()
			}
			console.log(hash)
			sql.connect(sqlConfig, function () {
				var request = new sql.Request();
				var joiningDate = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");
				let qu = `INSERT INTO dbo.[User](email, password, hashedPw, firstName, lastName, joiningDate, contactNumber) 
						   VALUES ('` + req.body.email + `', '` + 12345 + `', '` + hash + `', '` + req.body.firstName + `', '` + req.body.lastName + `' , '` + joiningDate + `' , '` + req.body.contactNumber + `')`;

				request.query(qu, function (error, recordset) {
					if (error) {
						console.log("error occured");
						console.log(error)
						res.status(400).send()
					}
					else {
						res.status(200).send()
					}
				});
			});

		})
	}
})

// signin with Hash
app.post('/signin', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	console.log('body ' + req.body.email + " " + req.body.password);
	sql.connect(sqlConfig, function () {
		var request = new sql.Request();
		let qu = `SELECT * FROM dbo.[User]
		  WHERE email= '` + req.body.email + `'`;

		request.query(qu, async function (error, results, fields) {
			if (error) {
				console.log("error occured");
				res.status(400).send()
			}
			else {
				if (results.recordset && results.recordset.length > 0) {
					//const comparision = 
					console.log(results.recordset[0].hashedPw)
					console.log("input pw: " + password)
					bcrypt.compare(password, results.recordset[0].hashedPw).then(function(result) {
						if (result == false) {
							console.log("Email and password does not match")
							res.status(204).send()
						}
						else {
							console.log("login successful")
							res.status(200).send({ "userDetails": results.recordset[0] })
						}
					})

				}
				else {
					console.log("Email does not exits")
					res.status(206).send()
				}
			}
		});
	});
});

//get banks
app.get('/bankdetails', function (req, res) {
	sql.connect(sqlConfig, function () {
		var request = new sql.Request();
		request.query('select * from dbo.bank where bankId = 2', function (error, results) {
			if (error) {
				console.log("error occured");
				res.status(400).send()
			}
			else {
				res.status(200).send({ "banks": results.recordset })
			}
		});
	});
})


//get user bank account details
app.post('/userBankAccountDetails', function (req, res) {
	userId = req.body.userId;

	sql.connect(sqlConfig, function () {
		var request = new sql.Request();
		let qu = `SELECT userAccount.userBankAccountId, userAccount.userId, userAccount.accountTypeId, account.accountTypeName, account.bankId, account.baseInterestRate, userAccount.date, userAccount.status
				FROM userAccount
				INNER JOIN account ON userAccount.accountTypeId = account.accountTypeId
				AND userAccount.userId = '` + userId + `'`;
		request.query(qu, function (error, results) {
			if (error) {
				console.log("error occured");
				res.status(400).send()
			}
			else {
				res.status(200).send({ "userBankAccountDetails": results.recordset })
			}
		});
	});
})


//add Bank Account for a particular user.
app.post('/addBankAccount', (req, res) => {

	sql.connect(sqlConfig, function () {
		var request = new sql.Request();

		var dateNow = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");

		let qu = `INSERT INTO dbo.[userAccount](userId, accountTypeId, status, date) 
			   VALUES ('` + req.body.userId + `', '` + req.body.accountTypeId + `', 1 , '` + dateNow + `')`;

		console.log(qu)

		request.query(qu, function (err, recordset) {
			if (err) {
				res.status(400).send()
			}
			else {
				res.status(200).send()
			}
		});
	});
})


//Edit profile for a particular user.
app.post('/editProfile', (req, res) => {

	sql.connect(sqlConfig, function () {
		var request = new sql.Request();

		let qu = `UPDATE dbo.[User] 
				SET email = '` + req.body.email + `', firstName = '` + req.body.firstName + `', lastName = '` + req.body.lastName + `', contactNumber = '` + req.body.contactNumber + `',twoFactorAuth = '` + req.body.twoFactorAuth + `'
				WHERE userId = '` + req.body.userId + `'`;

		request.query(qu, function (err, recordset) {
			if (err) {
				res.status(400).send()
			}
			else {
				res.status(200).send()
			}
		});
	});
})

// change password for a particular user for HASHed verison.
// regenerate a new salt!
app.post('/changePassword', async (req, res) => {
	oldHashedPass = await retrievePassword(req.body.userId)
	var oldPlainTextPw = req.body.oldPassword;
	var newPlainTextPw = req.body.newPassword;
	var rounds = 10; // cost factor of 10 rounds. meaning calculation is done 2^10 times  to get final hash.  

	bcrypt.compare(oldPlainTextPw, oldHashedPass).then(function(result) {
		if (result == false) {
			console.log("Email and password does not match")
			res.status(204).send()
		}
		else {
			console.log("old PW Matches.")
			bcrypt.hash(newPlainTextPw, rounds, (error, hash) => {
				if (error) {
					console.log(err);
					res.status(400).send()
				}
				console.log(hash)
				sql.connect(sqlConfig, function () {
					var request = new sql.Request();
					let qu = `UPDATE dbo.[User] 
						  SET hashedPw = '` + hash + `'
						  WHERE userId = '` + req.body.userId + `'`;

					request.query(qu, function (err, recordset) {
						if (err) {
							res.status(400).send()
						}
						else {
							console.log("Pass changed.")
							res.status(200).send()
						}
					});
				});


			})
		}
	})
})

//get account type based on bank id
app.post('/fetchAccountType', (req, res) => {
	bank_id = req.body.bankid;
	console.log('bankid' + bank_id)
	sql.connect(sqlConfig, function () {
		var request = new sql.Request();
		let qu = `SELECT * FROM dbo.account
                   WHERE bankId= '` + req.body.bankid + `'`;
		console.log(qu)
		request.query(qu, function (error, results) {
			if (error) {
				console.log("error occured");
				res.status(400).send()

			}
			else {
				res.status(200).send({ "account": results.recordset })
			}
		});
	});
})

//Deletes files in the folder.
function deleteFile(path) {
	const fsExtra = require('fs-extra')
	fsExtra.emptyDirSync(path)
}

// setting for url encoding
app.use(bodyParser.urlencoded({ extended: false }))


function retrieveUserId(email) {
	return new promise(function (resolve, reject) {
		console.log("enter retrieve user id function");
		sql.connect(sqlConfig, function () {
			var request = new sql.Request();
			let qu = `SELECT * FROM dbo.[User]
          WHERE email= '` + email + `'`;

			request.query(qu, function (error, results, fields) {
				if (error) {
					console.log("error occured");
					resolve(0);
				}
				else {
					if (results.recordset && results.recordset.length > 0) {
						console.log(results.recordset[0].userId);
						resolve(results.recordset[0].userId);
					}
					else {
						console.log("user not present")
						resolve(0);
					}
				}

			});
		});
	});
}


function retrievePassword(userId) {
	return new promise(function (resolve, reject) {
		console.log("enter retrieve password function");
		sql.connect(sqlConfig, function () {
			var request = new sql.Request();
			//let qu = `SELECT password FROM dbo.[User]
			//WHERE userId= '` + userId + `'`;

			let qu = `SELECT hashedPw FROM dbo.[User]
          WHERE userId= '` + userId + `'`;
			request.query(qu, function (error, results, fields) {
				if (error) {
					console.log("error occured");
					resolve(0);
				}
				else {
					if (results.recordset && results.recordset.length > 0) {
						console.log("success");
						resolve(results.recordset[0].hashedPw);
					}
					else {
						console.log("user not present")
						resolve(0);
					}
				}

			});
		});
	});
}


//config for upload multiple files
let uploadConfig = upload.fields([{ name: 'bankStatement', maxCount: 1 }, { name: 'creditCard', maxCount: 1 }]);

//upload bank account statement client passes userId and accountTypeId
app.post('/uploadBankStatement', uploadConfig, async (req, res) => {

	let dataBufferStatement = fs.readFileSync('./uploads/' + req.files['bankStatement'][0].originalname);

	const options = {
		pagerender: render_page,
		version: 'v1.10.100'
	};

	let result = {}

	let creditCardParseData = {}

	PDFParser(dataBufferStatement, options).then(async function (data) {

		fs.writeFileSync('./uploads/result.txt', data.text);
		result = await parser.parseStatement(req.body.accountTypeId);

		if (req.files['creditCard'] && req.files['creditCard'][0]) {
			console.log("inside credit card")
			let dataBufferCard = fs.readFileSync('./uploads/' + req.files['creditCard'][0].originalname);
			creditCardParseData = await launchParseCard(options, dataBufferCard);
			result['creditCardSpend'] = creditCardParseData['creditCardSpend']
		}
		deleteFile("./uploads/")

		res.status(200).send({ "parsedData": result })

	});

})


//upload bank account statement client passes userId and accountTypeId
app.post('/updateParsedData', (req, res) => {

	result = req.body.parsedData

	var dateAnalysed = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");

	//Update the Bank account details table
	sql.connect(sqlConfig, function () {
		var request = new sql.Request();

	let qu = `INSERT INTO dbo.[parsedBankStatementData](dateAnalysed, userId, accountTypeId, previousMonthBalance, salary, currentMonthBalance, averageDailyBalance, creditCardSpend, startDate, endDate) 
		   VALUES ( '`+ dateAnalysed + `', '` + req.body.userId + `', '`+ req.body.accountTypeId + `', '`+ result['previousMonthBalance'] + `' , '`+ result['salary'] + `' , '`+ result['currentMonthBalance'] + `' , '`+ result['averageDailyBalance'] + `', '`+ result['creditCardSpend'] + `', '`+ result['startDate'] + `', '`+ result['endDate'] + `')`;

		console.log(qu)
		request.query(qu, function (error, recordset) {
			if (error) {
				res.status(400).send()
			}
			else {
				recommendationEngine(req.body.userId, req.body.accountTypeId)
				res.status(200).send()
			}
		});

	});
})


function launchParseCard(options, dataBufferCard) {
	return new promise(function (resolve, reject) {
		PDFParser(dataBufferCard, options).then(async function (data) {
			fs.writeFileSync('./uploads/resultCard.txt', data.text);
			creditCardParseData = await parser.parseCard();
			resolve(creditCardParseData);
		});
	});
}


//get recommendations for the userid and accounttypeid
app.post('/fetchrecommendations', (req, res) => {
	userId = req.body.userId;
	console.log('userId' + userId)
	accountTypeid = req.body.accountTypeid;
	console.log('userId' + accountTypeid)
	sql.connect(sqlConfig, function () {
		console.log("into db");
		var request = new sql.Request();
		// query_str = "DECLARE @ROUTPUT VARCHAR(8000); exec [dbo].[usp_getRecommendation] "+ userId + ", " +accountTypeid+ ", " + "@Routput OUTPUT; SELECT @Routput";
		query_str = "EXEC [dbo].[usp_getRecommendation] " + userId + ", " + accountTypeid
		console.log(query_str)
		request.query(query_str, function (err, results) {
			if (err) {
				console.log("error occured");
				res.status(400).send()

			}
			else {
				res.status(200).send({ "recommendation": results.recordset })
			}
		});
	});
})



//add feedback for a particular session Id.
app.post('/addFeedback', (req, res) => {

	sql.connect(sqlConfig, function () {
		var request = new sql.Request();

		var dateNow = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");

		let qu = `INSERT INTO dbo.[feedback](recommendationId, feedbackRating, feedbackComment, timestamp) 
			   VALUES ('` + req.body.recommendationId + `', '` + req.body.feedbackRating + `', '` + req.body.feedbackComment + `' , '` + dateNow + `')`;

		console.log(qu)

		request.query(qu, function (err, recordset) {
			if (err) {
				res.status(400).send()
			}
			else {
				res.status(200).send()
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

function recommendationEngine(userid, accountTypeid) {
	sql.connect(sqlConfig, function (i) {
		console.log("into db: " + i);
		for (i = 19; i < 24; i++) {

			var request = new sql.Request();
			query_str = "exec [dbo].[usp_OCBCRecommendation] " + userid + ", " + accountTypeid + ", " + i;
			console.log(query_str);
			request.query(query_str, function (err, rows) {
				if (err) throw err;
				//console.log(rows);
			});
		}

	});

}



