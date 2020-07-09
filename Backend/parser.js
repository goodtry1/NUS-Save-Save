var express = require('express');
var promise = require('promise');
var parser = new express.Router();
const readline = require('readline');
const fs = require('fs');

function initializeParseData()
{
	return new promise(function(resolve, reject) {
		let result = {}
		result['previousMonthBalance'] = 0;
		result['currentMonthBalance'] = 0;
		result['averageDailyBalance'] =0;
		result['date'] = 0;
		result['salary']  = 0;
		resolve (result);
  });
}


function parseStatement(parsestatement)
{
	
  return new promise(async function(resolve, reject) {
  // record the index of each line in raw text data
  let lineIndex = 1;

  // map and index map
  let textMap = new Map();
  let indexMap = new Map();

  let result = await initializeParseData();

  // extracted information
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

    lineIndex++;
  });


  readInterface.on('close', function () {
    // set this month's total withdraws/deposits, total interests this year and this month's average daily balance
	if(indexMap.get('totalWithdrawalsDeposits'))
	{
		let array = textMap.get(indexMap.get('totalWithdrawalsDeposits')).trim().split(/\s+/);
		if(array.length == 2)
		{
			result['averageDailyBalance'] = parseFloat(textMap.get(indexMap.get('averageDailyBalance')).replace(/\s|,|/g, ''));
		}	
	}
		resolve (result)
		console.log(result)
	
  });
  });
}

function parseCard()
{
	
	return new promise(function(resolve, reject) {
	// record the index of each line in raw text data
	let lineIndex = 1;

	// map and index map
	let textMap = new Map();
	let indexMap = new Map();

	// extracted information
	let result = {}
	result['creditCardSpend']= 0;

	let readInterface = readline.createInterface({
		input: fs.createReadStream('./uploads/resultCard.txt')
	});

	readInterface.on('line', function (line) {
		textMap.set(lineIndex, line);

		if (line === 'TOTAL AMOUNT DUE') {
		  indexMap.set('creditCardSpend', lineIndex + 1);
		}

		lineIndex++;
    });


	readInterface.on('close', function () {

		if(indexMap.get('creditCardSpend'))
		{
			let array = textMap.get(indexMap.get('creditCardSpend')).trim().split(/\s+/);
			if(array.length == 1)
			{
				result['creditCardSpend'] = parseFloat(array[0].replace(/\s|,|/g, ''));
			}	
		}
		resolve (result)
		console.log(result)
	});
  
  });

}

function parseTransactionHistoryOCBC360()
{
	
	return new promise(async function(resolve, reject) {
	// record the index of each line in raw text data
	let lineIndex = 1;

	// map and index map
	let textMap = new Map();
	let indexMap = new Map();
	let transactionStartIndex = 0;

	let result = await initializeParseData();
	
	// extracted information
	let readInterface = readline.createInterface({
		input: fs.createReadStream('./uploads/resultTransactions.txt')
	});

	readInterface.on('line', function (line) {
		textMap.set(lineIndex, line);
		if (line.includes('Available Balance')){
		    indexMap.set('Available Balance', lineIndex);
			let array = line.trim().split("  ").filter(function(value, index, arr){ return value !=  "";})
			//console.log(array[1].replace(/\s|,|/g, ''))
			result['currentMonthBalance'] = parseFloat(array[1].replace(/\s|,|/g, ''));
		}
		if(line.includes('Transaction Date')) 
		{
			indexMap.set('transactionTable', lineIndex + 1);
			transactionStartIndex = lineIndex + 1;
		}

		lineIndex++;
    });


	readInterface.on('close', function () {
		indexMap.set('transactionTableEnd', lineIndex - 2);
		transactionTableEnd = lineIndex;
		transactionMonth = 0
		if(indexMap.get('transactionTable'))
		{
			let array = textMap.get(indexMap.get('transactionTable')).trim().split(/\s+/);
			if(array.length > 0)
			{
				result['date'] = array[0].replace(/\s|,|/g, '');
				transactionMonth = parseInt(array[0].substring(3, 5)); 
			}	
			
			balanceNow = result['currentMonthBalance'];
			balanceArray = {}
			sumAverage = 0;
			lastTransactionDay =0;
			currentTransactionday = 0
			lastDate=0
			
			for (var i =transactionStartIndex; i<transactionTableEnd; i++) {  
				
				let array = (textMap.get(i)).trim().split("  ").filter(function(value, index, arr){ return value !=  "";});
				

				if((array.length) == 4 && (transactionMonth == parseInt(array[0].substring(3, 5)))) {
					//console.log(array);
				    
					transactionLine = textMap.get(i)
					//console.log(transactionLine)

					index = transactionLine.indexOf(array[3])
					
					currentTransactionday = parseInt(array[0].substring(0, 2)); 
					
					if(i == transactionStartIndex)
					{
						lastDate = currentTransactionday;
						//console.log(transactionMonth)
						lastTransactionDay = currentTransactionday
						balanceArray[lastTransactionDay]= result['currentMonthBalance'];
					}
					
					for (var j=lastTransactionDay-1; j>=currentTransactionday; j--)
					{
						balanceArray[j] = balanceNow;
					}
					
					if(index < 85) //most likely debit column
					{
						//console.log("debit")
						balanceNow += parseFloat(array[3])
					}
					else
					{
						//console.log("credit")
						balanceNow -= parseFloat(array[3])
					}
				
					lastTransactionDay = currentTransactionday;
					
				}
				
			}
			
			for (var j=lastTransactionDay-1; j>=1; j--)
			{
				balanceArray[j] = balanceNow;
			}
			
			//console.log(balanceArray)
			result['previousMonthBalance'] = parseFloat(balanceNow.toFixed(2))
			var sum =0
			
			for (var i=1;i<= lastDate;i++)
			{
				sum += balanceArray[i];
			}

			result['averageDailyBalance'] = parseFloat((sum/size_dict(balanceArray)).toFixed(2)) ;			
		}
		resolve (result)
	});
  
  });

}

function size_dict(d){c=0; for (i in d) ++c; return c}


function parseTransactionHistoryDBSMultiplier()
{
	return new promise(async function(resolve, reject) {
	// record the index of each line in raw text data
	let lineIndex = 1;

	// map and index map
	let textMap = new Map();
	let indexMap = new Map();

	// extracted information
	let result = await initializeParseData();
	totalWithdrawal = 0
	totalDeposit = 0

	let readInterface = readline.createInterface({
		input: fs.createReadStream('./uploads/resultTransactions.txt')
	});

	readInterface.on('line', function (line) {
		textMap.set(lineIndex, line);
		

		if (line.includes('Available Balance')){
		    indexMap.set('Available Balance', lineIndex);
			let array = line.trim().split(/\s+/).filter(function(value, index, arr){ return value !=  "";})
			result['currentMonthBalance'] = parseFloat(array[2].replace('S$', '').replace(/\s|,|/g, ''));
		}
		
		if (line.includes('Total')){
			let array = line.trim().split(/\s+/).filter(function(value, index, arr){ return value !=  "";})
			if(array.length == 3)
			{
				indexMap.set('totalWithdrawalsDeposits', lineIndex);
				totalWithdrawal = parseFloat(array[1].replace('S$', '').replace(/\s|,|/g, ''));
				totalDeposit = parseFloat(array[2].replace('S$', '').replace(/\s|,|/g, ''));
				
			}
		}
		if(line.includes('(Withdrawal)               (Deposit)')){
			indexMap.set('TransactionTable', lineIndex+2);
		}
		
		lineIndex++;
    });


	readInterface.on('close', function () {

		resolve (result)
		console.log(result)
		result['previousMonthBalance'] = parseFloat((result['currentMonthBalance'] - totalDeposit + totalWithdrawal).toFixed(2))
		if(indexMap.get('TransactionTable'))
		{
			let array = textMap.get(indexMap.get('TransactionTable')).trim().split("  ").filter(function(value, index, arr){ return value !=  "";});
			console.log(array)
			if(array.length == 3)
			{
				result['date'] = array[0]
			}	
		}
	});
  
  });
}

module.exports = { 
    initializeParseData: initializeParseData,
    parseStatement: parseStatement,
	parseCard:parseCard,
	parseTransactionHistoryOCBC360:parseTransactionHistoryOCBC360,
	parseTransactionHistoryDBSMultiplier:parseTransactionHistoryDBSMultiplier
	
}