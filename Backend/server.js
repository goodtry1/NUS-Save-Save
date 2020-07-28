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
const secureRandomPw = require('secure-random-password');

//cors
var cors = require('cors');
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

//JWT & cookie
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//PDF parser
var pdfUtil = require('pdf-to-text');
//var pdf2table = require('pdf2table');

//csv
const csv = require('csv-parser')


var parser = require("./parser");
const { query } = require('express');

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
	database: 'SaveSave',
	connectionTimeout: 300000,
	requestTimeout: 300000,
	pool: {
		idleTimeoutMillis: 10000000000000,
		max: 100
	}
}


// Start server and listen on http://localhost:5001/
var server = app.listen(5002, function () {
	updateListings()
	var host = server.address().address
	var port = server.address().port
	console.log("app listening at %s", port)

});


function authenticateToken(req, res, next) {

	const accessToken = req.cookies.access_token
	if (accessToken === null)
		return res.sendStatus(401)

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)

		req.user = user
		next()
	})
}

//two factor authentication email configuration
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'savesave462@gmail.com',
		pass: 'SaveSave123$'
	}
});

/* ------------------------------------------------------ RESTful GET/POST APIs below ------------------------------------------------------ */

// upon enter.. just to test app is working. (for standard path)
app.get('/', (req, res) => {
	res.send("App is working fine (for <b>standard</b>) but you are not supposed to enter here.... :D.")
})

// upon enter.. just to test app is working. (for /api/ path)
app.get('/api/', (req, res) => {
	res.send("App is working fine (for <b> /API/ </b>) but you are not supposed to enter here.... :D.")
})

app.post('/api/searchCompanyByName', (req, res) => {
	console.log(req.body)

	let index = req.body.name.charAt(0).toUpperCase()
	if (req.body.name) {
		let qu = "Select * from [dbo].[entity] e INNER JOIN [dbo].[category_keyword_mapping] c ON e.categoryId = c.categoryId AND e.entityName LIKE '%" + req.body.name + "%' AND [index_alphabet] = '" + index + "'";


		sql.connect(sqlConfig).then(pool => {
			return pool.request()
				.input('name', sql.NVarChar, req.body.name)
				.query(qu)
		}).then(result => {
			res.status(200).send(result.recordset)
		}).catch(err => {
			console.log(err)
		})
	} else {
		res.status(400).send("name is empty")
	}


})

//let excelConfig = upload.fields([{ name: 'csvFile', maxCount: 1 }]);
categories = []
async function updateListings() {

	/* console.log("Received CSV file: " + req.files['csvFile'][0].originalname) */

	/* sql.connect(sqlConfig).then(pool => {
		console.log("Dropping current values in the table")
		return pool.request().query("Delete from [dbo].[entity_test]")
	}).then(result => {
		console.log(result)
	}).catch(err => {
		console.log(err)
	}) */


	let start = new Date()
	//res.status(200).send("Uploading now, check the database later")
	console.log("Dropping current values in the table")
	let pool = await sql.connect(sqlConfig)
	let result = await pool.request().query("Delete from [dbo].[entity]")
	console.log("Values dropped:")
	console.log(result)




	await fetchCategories() //force async processing to ensure categories are fetched before processing



	let alphabets = "abcdefghijklmnopqrstuwxyz" //



	for (let z = 0; z < alphabets.length; z++) {
		result = await insertIntoDB(z, alphabets)
		console.log(result)
		if (z === alphabets.length - 1) {
			console.log("Update completed")
			var end = new Date() - start
			console.info('Execution time: %dms', end)
		}

	}




}


function insertIntoDB(z, alphabets) {
	/* let qu = '';
	let qu2 = ''
	let qu3 = ''; */

	let queryStrings = []
	/* let qu = '' */
	return new Promise(function (resolve, reject) {
		fs.createReadStream('./uploads/acra_listings/acra-information-on-corporate-entities-' + alphabets[z] + '.csv')/* req.files['csvFile'][0].originalname) */
			.pipe(csv())
			.on('data', (row) => {






				let name = row.entity_name.replace(/'/g, '"')
				let desc = row.primary_ssic_description.replace(/'/g, '"')
				let index = row.entity_name.charAt(0) //index partitioning
				let categoryId = matchCompanyDescToCategory(row)

				outerloop: //using a loop to check instead of await keyword
				for (let i = 0; i >= 0; i++) {
					if (categoryId) {
						if (queryStrings.length === 0) {
							queryStrings[0] = "INSERT INTO dbo.[entity] VALUES ('" + name + "','" + desc + "', '" + categoryId + "', '" + index + "');"
						} else {
							for (let k = 0; k < queryStrings.length; k++) {
								if (queryStrings[k].length < 4000000) {
									queryStrings[k] = queryStrings[k] += "INSERT INTO dbo.[entity] VALUES ('" + name + "','" + desc + "', '" + categoryId + "', '" + index + "');"
									i = -1
									break outerloop;
								} else {
									queryStrings[k + 1] = "INSERT INTO dbo.[entity] VALUES ('" + name + "','" + desc + "', '" + categoryId + "', '" + index + "');"
									i = -1
									break outerloop;
								}
							}
						}




						/* if (qu.length < 8000000) {
							qu += "INSERT INTO dbo.[entity] VALUES ('" + name + "','" + desc + "', '" + categoryId + "', '" + index + "');";
							i = -1
							break outerloop;
						} else {
							if (qu2.length < 8000000) {
								qu2 += "INSERT INTO dbo.[entity] VALUES ('" + name + "','" + desc + "', '" + categoryId + "', '" + index + "');";
								i = -1
								break outerloop;
							} else {
								qu3 += "INSERT INTO dbo.[entity] VALUES ('" + name + "','" + desc + "', '" + categoryId + "', '" + index + "');";
								i = -1
								break outerloop;
							}
							
						} */

					}
				}


			})
			.on('end', async () => {
				try {
					console.log("Reached the end of the file, inserting into DB now for index: " + alphabets[z])

					for (let i = 0; i < queryStrings.length; i++) {
						let pool = await sql.connect(sqlConfig)
						let result = await pool.request().query(queryStrings[i])
						console.log(result)
					}


					resolve("Success")
				} catch (err) {
					console.log(err)
				}

				/* sql.connect(sqlConfig).then(pool => {
					console.log("Reached the end of the file, inserting into DB now for index: " + alphabets[z])
					return await pool.request().query(qu)
				}).then(result => {
					console.log(result)
				}).catch(err => {
					console.log(err)
				}) */

			})
	})

}




/**
 * returns the categoryId based on the keyword found
 * needs to be refined
 * @param {*} row - each row from CSV 
 */
function matchCompanyDescToCategory(row) {
	let description = row.primary_ssic_description
	let descArr = description.trim().split(/[\s,\-()\/]+/)


	for (let i = 0; i < categories.length; i++) {
		for (let j = 0; j < descArr.length; j++) {
			//console.log(descArr[j].toUpperCase() + " vs " + categories[i].keyword)


			if (descArr[j].length !== categories[i].keyword.length) {

			} else if (descArr[j].toUpperCase().includes(categories[i].keyword)) {
				return categories[i].categoryId
			}

			if (i === categories.length - 1 && j === descArr.length - 1) {
				return 101;
			}
		}
	}

}

function fetchCategories() {
	return new promise(function (resolve, reject) {
		sql.connect(sqlConfig).then(pool => {

			console.log("Fetching categories");
			return pool.request().query("SELECT [categoryId], UPPER([keyword]) as keyword,[category] FROM [dbo].[category_keyword_mapping]");
		}).then(result => {
			console.log("Setting categories");

			categories = result.recordset; //array of objects
			resolve("Success")
		}).catch(err => {
			console.log(err);
			resolve("Error")
		});
	})

}

// two factor authentication for signup
app.post('/api/twoFactorAuthenticate', async (req, res) => {

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
app.post('/api/signUp', async (req, res) => {
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
		bcrypt.hash(plainTextPw, rounds).then(function (hash) {
			if (hash == false) {
				console.log(err);
				res.status(400).send()
			}
			console.log(hash)
			sql.connect(sqlConfig, function () {
				var request = new sql.Request();
				var joiningDate = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");
				let qu = `INSERT INTO dbo.[User](email, password, hashedPw, firstName, lastName, joiningDate, contactNumber, twoFactorAuth) 
						   VALUES ('` + req.body.email + `', '` + 12345 + `', '` + hash + `', '` + req.body.firstName + `', '` + req.body.lastName + `' , '` + joiningDate + `' , '` + req.body.contactNumber + `', '` + req.body.twoFactorAuth + `')`;

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
app.post('/api/signin', (req, res) => {

	console.log("trying to sign in")
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
					bcrypt.compare(password, results.recordset[0].hashedPw).then(function (result) {
						if (result == false) {
							console.log("Email and password does not match")
							res.status(204).send()
						}
						else {
							var user = results.recordset[0]

							var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

							res.cookie('access_token', accessToken, {
								httpOnly: true,
								/* secure: true */
							})

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

app.post("/api/logOut", (req, res) => {
	res.cookie('access_token', '', { maxAge: 0, httpOnly: true })


	res.status(200).send()
})

//get banks
app.get('/api/bankdetails', function (req, res) {
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
app.post('/api/userBankAccountDetails', authenticateToken, function (req, res) {
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
app.post('/api/addBankAccount', authenticateToken, (req, res) => {

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
app.post('/api/editProfile', authenticateToken, (req, res) => {

	sql.connect(sqlConfig, function () {
		var request = new sql.Request();

		let qu = `UPDATE dbo.[User] 
				SET email = '` + req.body.email + `', firstName = '` + req.body.firstName + `', lastName = '` + req.body.lastName + `', contactNumber = '` + req.body.contactNumber + `',twoFactorAuth = '` + req.body.twoFactorAuth + `'
				WHERE userId = '` + req.body.userId + `'`;



		request.query(qu, function (err, recordset) {
			if (err) {
				console.log(err)
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
app.post('/api/changePassword', authenticateToken, async (req, res) => {
	oldHashedPass = await retrievePassword(req.body.userId)
	var oldPlainTextPw = req.body.oldPassword;
	var newPlainTextPw = req.body.newPassword;
	var rounds = 10; // cost factor of 10 rounds. meaning calculation is done 2^10 times  to get final hash.  

	bcrypt.compare(oldPlainTextPw, oldHashedPass).then(function (result) {
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

// Reset password for users who forgot their password
// POST method takes in email & phone number for verification before resetting to a random password
app.post('/api/resetPassword', (req, res) => {
	email = req.body.email;
	contactNumber = req.body.contactNumber;

	sql.connect(sqlConfig, function () {
		var request = new sql.Request();
		let qu = `SELECT * FROM dbo.[User]
         	 		  WHERE email= '` + email + `'`;

		request.query(qu, function (error, results, fields) {
			if (error) {
				console.log("error occured");
				res.status(400).send()
			} else {
				console.log(results.recordset)
				if (results.recordset && results.recordset.length > 0) {
					if (results.recordset[0].contactNumber != contactNumber) {
						console.log("email found, but phone number do not match.");
						res.status(400).send("Phone number do not match.");
					} else {
						var userId = results.recordset[0].userId;
						var newPw = secureRandomPw.randomPassword({ length: 13 })

						//update pw
						bcrypt.hash(newPw, 10).then(function (hash) {
							if (error) {
								console.log(error);
								res.status(400).send()
							}
							console.log("newPW..." + hash)

							var request = new sql.Request();
							let qu = `UPDATE dbo.[User] 
										  SET hashedPw = '` + hash + `'
										  WHERE userId = '` + userId + `'`;

							request.query(qu, function (err, recordset) {
								if (err) {
									res.status(400).send()
								}
								else {
									console.log("Pass changed.. Sending Email! ")
									//email new pw to user
									var resetDate = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");
									var mailOptions = {
										from: 'savesave462@gmail.com',
										to: req.body.email,
										subject: 'Save Save - Password reset ',
										text: `Dear User,
														  
										Your new password is ${newPw}
										This request is generated at ${resetDate}.
										The new password is confidential and for security reasons, DO NOT share the password with anyone.`
									}

									transporter.sendMail(mailOptions, function (error, info) {
										if (error) {
											console.log('error')
											res.status(400).send("Email not sent. Please contact Admin.")
										}
										else {
											console.log("email sent.")
											res.status(200).send("Email has been sent.")
										}
									});
								}
							});
						})
					}
				} else {
					console.log("user not present in the system!")
					res.status(400).send("Error! No user found with the given email.")
				}
			}
		});
	})
})

//get account type based on bank id
app.post('/api/fetchAccountType', /* authenticateToken, */(req, res) => {
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

//get the paramters for the graph
app.post('/api/getParametersForGraph', authenticateToken, (req, res) => {
	userId = req.body.userId;
	//console.log('userId' + userId)
	accountTypeid = req.body.accountTypeid;
	sql.connect(sqlConfig, function () {
		var request = new sql.Request();


		let qu = "exec [dbo].[usp_getParametersForGraph] " + userId + ", " + accountTypeid;
		console.log(qu)

		request.query(qu, function (err, recordset) {
			if (err) {
				console.log("error occured");
				res.status(400).send()
			}
			else {
				console.log(recordset)
				res.status(200).send(recordset)
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
let uploadConfig = upload.fields([{ name: 'bankStatement', maxCount: 1 }, { name: 'creditCard', maxCount: 1 }, { name: 'transactionHistory', maxCount: 1 }]);

//upload bank account statement client passes userId and accountTypeId
app.post('/api/uploadBankStatement', uploadConfig, authenticateToken, async (req, res) => {


	const options = {
		pagerender: render_page,
		version: 'v1.10.100'
	};

	let result = {}

	let creditCardParseData = {}
	if (req.files['transactionHistory'] && req.files['transactionHistory'][0]) {
		let dataBuffertransaction = fs.readFileSync('./uploads/' + req.files['transactionHistory'][0].originalname);
		let filename = './uploads/' + req.files['transactionHistory'][0].originalname
		result = await launchParseTransactionHistory(options, filename, req.body.accountTypeId);
		if (req.files['creditCard'] && req.files['creditCard'][0]) {
			console.log("inside credit card")
			let dataBufferCard = fs.readFileSync('./uploads/' + req.files['creditCard'][0].originalname);
			creditCardParseData = await launchParseCard(options, dataBufferCard);
			result['creditCardSpend'] = creditCardParseData['creditCardSpend']
		}
		console.log('transaction History parse data')
		console.log(result)
		res.status(200).send({ "parsedData": result })
	}
	else {
		let dataBuffertransaction = fs.readFileSync('./uploads/' + req.files['bankStatement'][0].originalname);
		let filename = './uploads/' + req.files['bankStatement'][0].originalname
		result = await launchParseBankStatement(options, filename, req.body.accountTypeId);
		if (req.files['creditCard'] && req.files['creditCard'][0]) {
			console.log("inside credit card")
			let dataBufferCard = fs.readFileSync('./uploads/' + req.files['creditCard'][0].originalname);
			creditCardParseData = await launchParseCard(options, dataBufferCard);
			result['creditCardSpend'] = creditCardParseData['creditCardSpend']
		}
		console.log('Bank statement parse data')
		console.log(result)
		res.status(200).send({ "parsedData": result })
	}
	//deleteFile("./uploads/")
})


//upload bank account statement client passes userId and accountTypeId
app.post('/api/updateParsedData', (req, res) => {

	result = req.body.parsedData
	userInput = req.body.userInput
	console.log(userInput.startDate)
	var dateAnalysed = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");

	//Update the Bank account details table
	sql.connect(sqlConfig, function () {
		var request = new sql.Request();
		var qu;

		if (req.body.accountTypeId == 2) {
			qu = `INSERT INTO dbo.[parsedBankStatementData](dateAnalysed, userId, accountTypeId, previousMonthBalance, salary, currentMonthBalance, averageDailyBalance, creditCardSpend, startDate, endDate, 
			userInputPreviousMonthBalance, userInputSalary, userInputCurrentMonthBalance, userInputAverageDailyBalance, userInputCreditCardSpend, userInputStartDate, userInputEndDate) 
		   VALUES ( '`+ dateAnalysed + `', '` + req.body.userId + `', '` + req.body.accountTypeId + `', '` + result['previousMonthBalance'] + `' , '` + result['salary'] + `' , '` + result['currentMonthBalance'] + `' , '` + result['averageDailyBalance'] + `', '` + result['creditCardSpend'] + `', '` + result['startDate'] + `', '` + result['endDate'] + `', 
		   '` + userInput['previousMonthBalance'] + `', '` + userInput['salary'] + `', '` + userInput['currentMonthBalance'] + `', '` + userInput['averageDailyBalance'] + `', '` + userInput['creditCardSpend'] + `', '` + userInput['startDate'] + `', '` + userInput['endDate'] + `')`;


		}
		else if (req.body.accountTypeId == 1) {
			qu = `INSERT INTO dbo.[parsedBankStatementData](dateAnalysed, userId, accountTypeId, previousMonthBalance, salary, currentMonthBalance, creditCardSpend, startDate, endDate, insurance, investments, homeLoan, 
			userInputPreviousMonthBalance, userInputSalary, userInputCurrentMonthBalance, userInputCreditCardSpend, userInputStartDate, userInputEndDate, userInputInsurance, userInputInvestments, userInputHomeLoan) 
		   VALUES ( '`+ dateAnalysed + `', '` + req.body.userId + `', '` + req.body.accountTypeId + `', '` + result['previousMonthBalance'] + `' , '` + result['salary'] + `' , '` + result['currentMonthBalance'] + `' , '` + result['creditCardSpend'] + `', '` + result['startDate'] + `', '` + result['endDate'] + `', '` + result['insurance'] + `', '` + result['investments'] + `','` + result['homeLoan'] + `',
		   '` + userInput['previousMonthBalance'] + `', '` + userInput['salary'] + `', '` + userInput['currentMonthBalance'] + `', '` + userInput['creditCardSpend'] + `', '` + userInput['startDate'] + `', '` + userInput['endDate'] + `','` + userInput['insurance'] + `', '` + userInput['investments'] + `','` + userInput['homeLoan'] + `')`;

		}

		console.log(qu)
		request.query(qu, function (error, recordset) {
			if (error) {
				console.log(error.message)
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
			var random = randomize('0', 6);
			var filename = './uploads/resultCard' + String(random) + '.txt'
			fs.writeFileSync(filename, data.text);
			creditCardParseData = await parser.parseCard(filename);
			resolve(creditCardParseData);
		});
	});
}

function launchParseBankStatement(options, filename, accountTypeId) {
	return new promise(function (resolve, reject) {
		let dataBufferStatement = fs.readFileSync(filename);
		if (accountTypeId == 2) {
			PDFParser(dataBufferStatement, options).then(async function (data) {
				var random = randomize('0', 6);
				var filename = './uploads/result' + String(random) + '.txt'
				fs.writeFileSync(filename, data.text);
				result = await parser.parseBankStatementOCBC360(filename);
				resolve(result);
			});
		}
		else if (accountTypeId == 1) {
			pdfUtil.pdfToText(filename, async function (err, data) {
				var random = randomize('0', 6);
				var filename = './uploads/result' + String(random) + '.txt'
				fs.writeFileSync(filename, data);
				result = await parser.parseBankStatementDBSMultiplier(filename);
				resolve(result);
			});
		}
	});
}


function launchParseTransactionHistory(options, filename, accountTypeId) {
	return new promise(function (resolve, reject) {
		pdfUtil.pdfToText(filename, async function (err, data) {
			var random = randomize('0', 6);
			var filename = './uploads/resultTransactions' + String(random) + '.txt'
			fs.writeFileSync(filename, data);
			if (accountTypeId == 2)
				parseData = await parser.parseTransactionHistoryOCBC360(filename);
			else if (accountTypeId == 1)
				parseData = await parser.parseTransactionHistoryDBSMultiplier(filename);
			resolve(parseData);
		});
	});
}


//get recommendations for the userid and accounttypeid
app.post('/api/fetchrecommendations', authenticateToken, (req, res) => {
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
app.post('/api/addFeedback', authenticateToken, (req, res) => {
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
		normalizeWhitespace: false,
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