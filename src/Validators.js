var loanAmountMin = 3000; //Loan Amount Field Validation Minimum Value
var loanAmountMax = 100000; //Loan Amount Field Validation Maximum Value
var loanAmountMessage = 'Select a loan amount must be between $3,000 and $100,000';
var loanTermMin = 2; //Loan Term Field Validation Minimum Value
var loanTermMax = 7; //Loan Term Field Validation Maximum Value
var loanTermMessage = 'Select a term between 2 and 7 years';
var anualIncomeMin = 10000; //Anual Income Field Validation Minimum Value
var anualIncomeMax = 2000000; //Anual Income Field Validation Maximum Value
var annualIncomeMessage = 'Select a anual income between $10,000 and $2,000,000';
var zipCodeLength = 5; //Zip Code Field Validation length Value
var zipCodeMessage = 'Please enter a valid 5 digit zipcode';
var loanAmountSlider = 500;
var currencySymbol = "$";

var initialValues = {
    loanAmountMin: loanAmountMin,
    loanAmountMax: loanAmountMax,
    loanAmountMessage: loanAmountMessage,
    loanTermMin: loanTermMin,
    loanTermMax: loanTermMax,
    loanTermMessage: loanTermMessage,
    anualIncomeMin: anualIncomeMin,
    anualIncomeMax: anualIncomeMax,
    annualIncomeMessage: annualIncomeMessage,
    zipCodeLength: zipCodeLength,
    zipCodeMessage: zipCodeMessage,
    loanAmountSlider: loanAmountSlider
}


var Validator = {
    initialValues: initialValues,
    isValidInteger: function isValidInteger(value) {
        const reg = /^[0-9\b]+$/;
        if (value === '' || reg.test(value)) {
            return true;
        }
        return false;
    },

    isLoanAmountInRange: function isLoanAmountInRange(value) {
        if (value < loanAmountMin || value > loanAmountMax) {
            return true;
        }
        return false;
    },

    isLoanTermInRange: function isLoanTermInRange(value) {
        if (value < loanTermMin || value > loanTermMax) {
            return true;
        }
        return false;
    },

    isAnualIncomeInRange: function isAnualIncomeInRange(value) {
        if (value < anualIncomeMin || value > anualIncomeMax) {
            return true;
        }
        return false;
    },

    isValidZip: function isValidZip(value) {
        if (value.length !== zipCodeLength) {
            return true;
        }
        return false;
    },

    amountFormatting: function amountFormatting(value, formatSymbol = '.') {
        
        return value !== undefined ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, formatSymbol) : '';
    },

    getCurrencySymbolWithSpace: function () {
        return currencySymbol + " ";
    }
}

export { Validator }

export function validators() {
    return Validator;  
  } 