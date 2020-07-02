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


module.exports = { 
    initializeParseData: initializeParseData,
    parseStatement: parseStatement,
	parseCard:parseCard
}