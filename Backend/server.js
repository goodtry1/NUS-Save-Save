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


var parser = require("./parser");
const e = require('express');

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

				let ps = new sql.PreparedStatement();

				ps.input('email', sql.NVarChar(50));
				ps.input('hashedPw', sql.Char(60));
				ps.input('firstName', sql.NVarChar(50));
				ps.input('lastName', sql.NVarChar(50));
				ps.input('joiningDate', sql.SmallDateTime);
				ps.input('contactNumber', sql.VarChar(50));
				ps.input('twoFactorAuth', sql.NVarChar(5));

				console.log("%%" +req.body.twoFactorAuth)
				var joiningDate = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");

				let params = {
					email: req.body.email,
					hashedPw: hash,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					joiningDate: joiningDate,
					contactNumber: req.body.contactNumber,
					twoFactorAuth: req.body.twoFactorAuth
				}

				ps.prepare(`INSERT INTO dbo.[User](email, hashedPw, firstName, lastName, joiningDate, contactNumber, twoFactorAuth) 
							VALUES (@email, @hashedPw, @firstName, @lastName, @joiningDate, @contactNumber, @twoFactorAuth)`, error => {

					ps.execute(params, (error, results) => {
						if (error) {
							console.log(error);
							res.status(400).send();
						} else {
							res.status(200).send();
						}
						ps.unprepare(err => {
							if (err) {
								console.log(err);
							} else {
								console.log("unpreparing.")
							}
						})
					})
				})
			});
		})
	}
})

// signin with Hash (prepared statment)
app.post('/api/signin', (req, res) => {

	console.log("trying to sign in")
	let email = req.body.email;
	let password = req.body.password;
	console.log('body ' + req.body.email + " " + req.body.password);

	sql.connect(sqlConfig, function () {
		let ps = new sql.PreparedStatement();
		ps.input('email', sql.NVarChar(50))
		ps.prepare(`SELECT * FROM dbo.[User] WHERE email = @email `, error => {
			ps.execute({ email: req.body.email }, (error, results) => {
				if (error) {
					console.log("error occured")
					res.status(400).send();
				} else {
					if (results.recordset && results.recordset.length > 0) {
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
					} else {
						console.log("Email does not exits")
						res.status(206).send()
					}
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
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

		let ps = new sql.PreparedStatement();
		ps.input('bankId', sql.Int);
		ps.prepare('select * from dbo.bank where bankId =@bankId', error => {
			ps.execute({ bankId: 2 }, (error, results) => {
				if (error) {
					console.log("Error occured");
					console.log(error);
					res.status(400).send();
				} else {
					res.status(200).send({ "banks": results.recordset });
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
	});
})


//get user bank account details
app.post('/api/userBankAccountDetails', authenticateToken, function (req, res) {
	userId = req.body.userId;

	sql.connect(sqlConfig, function () {
		
		let ps = new sql.PreparedStatement();
		ps.input('userId', sql.Int);
		ps.prepare(`SELECT userAccount.userBankAccountId, userAccount.userId, userAccount.accountTypeId, account.accountTypeName, account.bankId, account.baseInterestRate, userAccount.date, userAccount.status
					FROM userAccount
					INNER JOIN account ON userAccount.accountTypeId = account.accountTypeId
					AND userAccount.userId =@userId ` , error => {
			ps.execute({ userId: userId }, (error, results) => {
				if (error) {
					console.log("Error Occured");
					console.log(error);
					res.status(400).send();
				} else {
					res.status(200).send({ "userBankAccountDetails": results.recordset });
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})

		})

		// Comment starts below here for unsafe impl! Why is this unsafe? No type checking. a simple query of: "userId": "null' OR 1=1 --" and
		// Everything will be leaked.
		/*
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
		}); */
		// comment ends above this!

	});
})

//add Bank Account for a particular user.
app.post('/api/addBankAccount', authenticateToken, (req, res) => {

	sql.connect(sqlConfig, function () {

		let ps = new sql.PreparedStatement();
		ps.input('userId', sql.Int);
		ps.input('accountTypeId', sql.Int);
		ps.input('status', sql.Bit);
		ps.input('dateNow', sql.SmallDateTime);

		var dateNow = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");
		let params = {
			userId: req.body.userId,
			accountTypeId: req.body.accountTypeId,
			status: 1,
			dateNow: dateNow
		}

		ps.prepare(`INSERT INTO dbo.[userAccount](userId, accountTypeId, status, date) 
					VALUES (@userId, @accountTypeId, @status, @dateNow)` , error => {

			ps.execute(params, (error, results) => {
				if (error) {
					console.log("Error occured");
					console.log(error);
					res.status(400).send();
				} else {
					res.status(200).send();
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
	});
})

//Edit profile for a particular user.
app.post('/api/editProfile', authenticateToken, (req, res) => {

	sql.connect(sqlConfig, function () {

		let ps = new sql.PreparedStatement();
		ps.input('email', sql.NVarChar(50));
		ps.input('firstName', sql.NVarChar(50));
		ps.input('lastName', sql.NVarChar(50));
		ps.input('contactNumber', sql.VarChar(50));
		ps.input('twoFactorAuth', sql.NVarChar(5));
		ps.input('userId', sql.Int);

		let params = {
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			contactNumber: req.body.contactNumber,
			twoFactorAuth: req.body.twoFactorAuth,
			userId: req.body.userId
		}

		ps.prepare(`UPDATE dbo.[User] 
					SET email = @email, firstName = @firstName, lastName = @lastName, contactNumber = @contactNumber, twoFactorAuth = @twoFactorAuth
					WHERE userId = @userId` , error => {
			ps.execute(params, (error, results) => {
				if (error) {
					console.log("Error Occur");
					console.log(error)
					res.status(400).send()
				} else {
					res.status(200).send()
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
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

					let ps = new sql.PreparedStatement();
					ps.input('hashedPw', sql.Char(60));
					ps.input('userId', sql.Int)

					let params = {
						hashedPw: hash,
						userId: req.body.userId
					}

					ps.prepare(`UPDATE dbo.[User] 
								SET hashedPw = @hashedPw
								WHERE userId = @userId` , error => {
						ps.execute(params, (error, results) => {
							if (error) {
								console.log("Error occur");
								console.log(error);
								res.status(400).send();
							} else {
								console.log("Pass changed.");
								res.status(200).send();
							}
							ps.unprepare(err => {
								if (err) {
									console.log(err);
								}
							})
						})
					})
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
	
		let ps = new sql.PreparedStatement();
		ps.input('email', sql.NVarChar(50));
		ps.prepare(`SELECT * FROM dbo.[User] WHERE email=@email`, error => {
			ps.execute({ email: email }, (error, results) => {
				if (error) {
					console.log(error);
					res.status(400).send();
				} else {
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
						console.log(error)
						res.status(400).send("Error! No user found with the given email.")
					}
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		}); 

		// start comment here for unsecure example! 
		/*
		var request = new sql.Request();
		let qu = `SELECT * FROM dbo.[User]
         	 		  WHERE email= '` + email + `'`;

		console.log(qu);
		request.query(qu, function (error, results, fields) {
			if (error) {
				console.log(error);
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
		}); */
		// end of comment for unsafe impl!
		
	})
})

//get account type based on bank id
app.post('/api/fetchAccountType', /* authenticateToken, */ (req, res) => {
	bank_id = req.body.bankid;
	console.log('bankid' + bank_id)
	sql.connect(sqlConfig, function () {

		let ps = new sql.PreparedStatement();
		ps.input('bankId', sql.Int)
		ps.prepare(`SELECT * FROM dbo.account
					WHERE bankId= @bankId` , error => {
			ps.execute({ bankId: req.body.bankid }, (error, results) => {
				if (error) {
					console.log("Error Occured");
					console.log(error);
					res.status(400).send();
				} else {
					res.status(200).send({ "account": results.recordset });
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
	});
})

//get the paramters for the graph
app.post('/api/getParametersForGraph', authenticateToken, (req, res) => {
	userId = req.body.userId;
	//console.log('userId' + userId)
	accountTypeid = req.body.accountTypeid;
	sql.connect(sqlConfig, function () {

		let ps = new sql.PreparedStatement();
		ps.input('userId', sql.Int)
		ps.input('accountTypeId', sql.Int)

		let params = {
			userId: req.body.userId,
			accountTypeId: req.body.accountTypeid
		}

		ps.prepare(` exec [dbo].[usp_getParametersForGraph] @userId, @accountTypeId `, error => {
			ps.execute(params, (error, results) => {
				if (error) {
					console.log("Error occured");
					console.log(error);
					res.status(400).send();
				} else {
					console.log(results);
					res.status(200).send(results);
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
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
		let value;
		sql.connect(sqlConfig, function () {

			let ps = new sql.PreparedStatement();
			ps.input('email', sql.NVarChar(50));
			ps.prepare(`SELECT * FROM dbo.[User] WHERE email=@email`, error => {
				ps.execute({ email: email }, (error, results) => {
					if (error) {
						console.log(error);
						value = 0;
					} else {
						if (results.recordset && results.recordset.length > 0) {
							console.log(results.recordset[0].userId);
							//resolve(results.recordset[0].userId);
							value = results.recordset[0].userId;
						}
						else {
							console.log("user not present")
							value = 0;
						}
					}
					ps.unprepare(err => {
						if (err) {
							console.log(err)
						}
						resolve(value);
					})
				})
			})
		});
	});
}


function retrievePassword(userId) {
	return new promise(function (resolve, reject) {
		console.log("enter retrieve password function");
		let value;
		sql.connect(sqlConfig, function () {

			let ps = new sql.PreparedStatement();
			ps.input('userId', sql.Int);
			ps.prepare(`SELECT hashedPw FROM dbo.[User]
						WHERE userId= @userId` , error => {
				ps.execute({ userId: userId }, (error, results) => {
					if (error) {
						console.log("Error occured");
						console.log(error);
						value = 0;
					} else {
						if (results.recordset && results.recordset.length > 0) {
							console.log("RetrievePassword API: success");
							value = results.recordset[0].hashedPw;
						} else {
							console.log("user not present")
							value = 0;
						}
					}
					ps.unprepare(err => {
						if (err) {
							console.log(err);
						}
						resolve(value);
					})
				})
			})
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

		let ps = new sql.PreparedStatement();
		let qu;
		let params;
		if (req.body.accountTypeId == 2) {

			ps.input('dateAnalysed', sql.SmallDateTime);
			ps.input('userId' , sql.Int);
			ps.input('accountTypeId', sql.Int)

			ps.input('result_previousMonthBalance', sql.Float)
			ps.input('result_salary', sql.Float)
			ps.input('result_currentMonthBalance',sql.Float)
			ps.input('result_averageDailyBalance', sql.Float)
			ps.input('result_creditCardSpend', sql.Float)
			ps.input('result_startDate', sql.Date)
			ps.input('result_endDate', sql.Date)

			ps.input('userInputPreviousMonthBalance', sql.Float)
			ps.input('userInputSalary', sql.Float)
			ps.input('userInputCurrentMonthBalance', sql.Float)
			ps.input('userInputAverageDailyBalance', sql.Float)
			ps.input('userInputCreditCardSpend',sql.Float)
			ps.input('userInputStartDate', sql.Date)
			ps.input('userInputEndDate', sql.Date)
			
			params = {
				dateAnalysed : dateAnalysed,
				userId : req.body.userId,
				accountTypeId : req.body.accountTypeId,

				result_previousMonthBalance : result['previousMonthBalance'],
				result_salary : result['salary'],
				result_currentMonthBalance : result['currentMonthBalance'],
				result_averageDailyBalance : result['averageDailyBalance'],
				result_creditCardSpend : result['creditCardSpend'],
				result_startDate : result['startDate'],
				result_endDate : result['endDate'],
				
				userInputPreviousMonthBalance : userInput['previousMonthBalance'],
				userInputSalary : userInput['salary'],
				userInputCurrentMonthBalance : userInput['currentMonthBalance'],
				userInputAverageDailyBalance : userInput['averageDailyBalance'],
				userInputCreditCardSpend : userInput['creditCardSpend'],
				userInputStartDate : userInput['startDate'],
				userInputEndDate : userInput['endDate']
			}

			qu = `INSERT INTO dbo.[parsedBankStatementData](dateAnalysed, userId, accountTypeId, previousMonthBalance, salary, currentMonthBalance, averageDailyBalance, creditCardSpend, startDate, endDate, 
				userInputPreviousMonthBalance, userInputSalary, userInputCurrentMonthBalance, userInputAverageDailyBalance, userInputCreditCardSpend, userInputStartDate, userInputEndDate) 
			   VALUES ( @dateAnalysed, @userId, @accountTypeId, @result_previousMonthBalance , @result_salary , @result_currentMonthBalance , @result_averageDailyBalance, @result_creditCardSpend, @result_startDate, @result_endDate, 
			   @userInputPreviousMonthBalance, @userInputSalary, @userInputCurrentMonthBalance, @userInputAverageDailyBalance, @userInputCreditCardSpend, @userInputStartDate, @userInputEndDate)`;

		} else if (req.body.accountTypeId == 1) {

			ps.input('dateAnalysed', sql.SmallDateTime);
			ps.input('userId' , sql.Int);
			ps.input('accountTypeId', sql.Int)

			ps.input('result_previousMonthBalance', sql.Float)
			ps.input('result_salary', sql.Float)
			ps.input('result_currentMonthBalance',sql.Float)
			ps.input('result_creditCardSpend', sql.Float)
			ps.input('result_startDate', sql.Date)
			ps.input('result_endDate', sql.Date)
			ps.input('result_insurance', sql.Float)
			ps.input('result_investments', sql.Float)
			ps.input('result_homeLoan', sql.Float)

			ps.input('userInputPreviousMonthBalance', sql.Float)
			ps.input('userInputSalary', sql.Float)
			ps.input('userInputCurrentMonthBalance', sql.Float)
			ps.input('userInputCreditCardSpend',sql.Float)
			ps.input('userInputStartDate', sql.Date)
			ps.input('userInputEndDate', sql.Date)
			ps.input('userInputInsurance',sql.Float)
			ps.input('userInputInvestments',sql.Float)
			ps.input('userInputHomeLoan', sql.Float)

			params = {
				dateAnalysed : dateAnalysed,
				userId : req.body.userId,
				accountTypeId : req.body.accountTypeId,

				result_previousMonthBalance : result['previousMonthBalance'],
				result_salary : result['salary'],
				result_currentMonthBalance : result['currentMonthBalance'],
				result_creditCardSpend : result['creditCardSpend'],
				result_startDate : result['startDate'],
				result_endDate : result['endDate'],
				result_insurance : result['insurance'],
				result_investments : result['investments'],
				result_homeLoan : result['homeLoan'],

				userInputPreviousMonthBalance : userInput['previousMonthBalance'],
				userInputSalary : userInput['salary'],
				userInputCurrentMonthBalance : userInput['currentMonthBalance'],
				userInputCreditCardSpend : userInput['creditCardSpend'],
				userInputStartDate : userInput['startDate'],
				userInputEndDate : userInput['endDate'],
				userInputInsurance : userInput['insurance'], 
				userInputInvestments : userInput['investments'], 
				userInputHomeLoan : userInput['homeLoan']
			}

			qu = `INSERT INTO dbo.[parsedBankStatementData](dateAnalysed, userId, accountTypeId, previousMonthBalance, salary, currentMonthBalance, creditCardSpend, startDate, endDate, insurance, investments, homeLoan, 
				userInputPreviousMonthBalance, userInputSalary, userInputCurrentMonthBalance, userInputCreditCardSpend, userInputStartDate, userInputEndDate, userInputInsurance, userInputInvestments, userInputHomeLoan) 
			      VALUES (@dateAnalysed, @userId, @accountTypeId, @result_previousMonthBalance , @result_salary , @result_currentMonthBalance , @result_creditCardSpend, @result_startDate, '@result_endDate, @result_insurance, @result_investments, @result_homeLoan,
				@userInputPreviousMonthBalance, @userInputSalary, @userInputCurrentMonthBalance, @userInputCreditCardSpend, @userInputStartDate, @userInputEndDate, @userInputInsurance, @userInputInvestments, @userInputHomeLoan)`;
		
		}

		ps.prepare(qu, error => {
			ps.execute(params, (error, results) => {
				if (error) {
					console.log(error.message);
					res.status(400).send();
				} else {
					recommendationEngine(req.body.userId, req.body.accountTypeId)
					res.status(200).send()
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
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
	accountTypeId = req.body.accountTypeid;
	console.log('userId' + accountTypeId)
	sql.connect(sqlConfig, function () {
		console.log("into db");

		let ps = new sql.PreparedStatement();
		ps.input('userId', sql.Int);
		ps.input('accountTypeId', sql.Int);

		let params = {
			userId: userId,
			accountTypeId: accountTypeId
		}

		ps.prepare(` exec [dbo].[usp_getRecommendation] @userId, @accountTypeId `, error => {
			ps.execute(params, (error, results) => {
				console.log("--> result " + results.recordset)
				if (error) {
					console.log("Error occured");
					console.log(error);
					res.status(400).send();
				} else {
					console.log("success?")
					console.log(results.recordset)
					res.status(200).send({ "recommendation": results.recordset });
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
	});
})

//add feedback for a particular session Id.
app.post('/api/addFeedback', authenticateToken, (req, res) => {
	sql.connect(sqlConfig, function () {

		let ps = new sql.PreparedStatement();
		ps.input('recommendationId', sql.Int);
		ps.input('feedbackRating', sql.Int);
		ps.input('feedbackComment', sql.NVarChar(50));
		ps.input('timestamp', sql.SmallDateTime);

		var dateNow = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");

		let params = {
			recommendationId: req.body.recommendationId,
			feedbackRating: req.body.feedbackRating,
			feedbackComment: req.body.feedbackComment,
			timestamp: dateNow
		}

		ps.prepare(`INSERT INTO dbo.[feedback](recommendationId, feedbackRating, feedbackComment, timestamp) 
					VALUES (@recommendationId, @feedbackRating, @feedbackComment ,@timestamp)` , error => {
			ps.execute(params, (error, results) => {
				if (error) {
					console.log("Error occured");
					console.log(error);
					res.status(400).send();
				} else {
					res.status(200).send();
				}
				ps.unprepare(err => {
					if (err) {
						console.log(err);
					}
				})
			})
		})
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

function recommendationEngine(userid, accountTypeId) {
	sql.connect(sqlConfig, function (i) {
		console.log("into db: " + i);
		//var request = new sql.Request();
		if (accountTypeId == 2)
		{	
			for (i = 19; i < 24; i++) {
				let ps = new sql.PreparedStatement();
				ps.input('userid', sql.Int);
				ps.input('accountTypeId', sql.Int);
				ps.input('i', sql.Int);

				let params = {
					userid: userid,
					accountTypeId: accountTypeId,
					i: i
				}

				ps.prepare(`exec [dbo].[usp_OCBCRecommendation] @userid, @accountTypeId, @i`, error => {
					ps.execute(params, (error, result) => {
						if (error) {
							throw error;
						}
						ps.unprepare(err => {
							if (err) {
								console.log(err);
							}
						})
					})
				})

			/*
			var request = new sql.Request();
			query_str = "exec [dbo].[usp_OCBCRecommendation] " + userid + ", " + accountTypeid + ", " + i;
			console.log(query_str);
			request.query(query_str, function (err, rows) {
				if (err) throw err;
				//console.log(rows);
			});*/
			}
		}
		else
		{
			let ps = new sql.PreparedStatement();
			ps.input('userid', sql.Int);
			ps.input('accountTypeId', sql.Int);

			let params = {
				userid: userid,
				accountTypeId: accountTypeId,
				
			}

			ps.prepare(`exec [dbo].[usp_DBSRecommendation] @userid, @accountTypeid`, error => {
				ps.execute(params, (error, result) => {
					if (error) {
						throw error;
					}
					ps.unprepare(err => {
						if (err) {
							console.log(err);
						}
					})
				})
			})


			//var request = new sql.Request();
			// query_str = "exec [dbo].[usp_DBSRecommendation] " + userid + ", " + accountTypeId;
			// console.log(query_str);
			// request.query(query_str, function (err, recordset) {
			// 	if (err) throw err;
			// 	console.log(recordset);
			// });
		}

	});
}
