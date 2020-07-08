export class PDFDetails {
    constructor(previousMonthBalance, currentMonthBalance, averageDailyBalance, startDate, endDate, salary, creditCardSpend) {
        this.previousMonthBalance = previousMonthBalance
        this.currentMonthBalance = currentMonthBalance
        this.averageDailyBalance = averageDailyBalance
        this.startDate = startDate
        this.endDate = endDate
        this.salary = salary
        this.creditCardSpend = creditCardSpend
    }
}