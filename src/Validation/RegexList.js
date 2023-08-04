export const emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}";
//export const currencySymbol = "$";
export const dateFormatMDY_s = "MM/DD/YYYY";
export const dateFormatMDY_d = "MM-DD-YYYY";
export const dateFormatDMY_s = "DD/MM/YYYY";
export const dateFormatDMY_d = "DD-MM-YYYY";
export const dateFormatYMD_s = "YYYY/MM/DD";
export const dateFormatYMD_d = "YYYY-MM-DD";
export function GetSSNMask(value) {
    var x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
    value = !x[2] ? x[1] : x[1] + '-' + x[2] + (x[3] ? '-' + x[3] : ''); 
    return value;
}
export function IsSSNGroupValid(value) {
    var valid = false;
    var group1RGX = /^0*([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|8[0-9][0-9]|89[0-9])$/;
    var groups = value.split('-');
    if(group1RGX.test(groups[0])) {
        if(window.location.origin === 'https://qa.financing.apply.zalea.com' 
        || window.location.origin === 'https://www.primerates.com') {
            if(groups[0] !== '666')
                valid = true;
        } else {
            valid = true;
        }
        
    }
    if(valid) {
        if(groups[1] === '00') {
            valid = false;
        }        
    }
    if(valid) {
        if(groups[2] === '0000') {
            valid =false;
        }
    }
    return valid;
}
export function GetPhoneMask(value) {
    var x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    return value;
}
export function IsPhoneNumberValid(value) {
    var regex = /[2-9]\d{2}[2-9]\d{6}/;
    if(regex.test(unMaskPhone(value))) {
        return true;
    }
    else
    {
        return false;
    }
}
export function IsValidAreaCode(value) {

    var regex = /^[2-9]\d{0,9}/;
    if(regex.test(unMaskPhone(value))) {
        return true;
    }
    else
    {
        return false;
    }
}
export function GetDateMask(value) {
    var x = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
    value = !x[2] ? x[1] : x[1] + '/' + x[2] + (x[3] ? '/' + x[3] : '');
    return value;
}
export function GetZipcodeMask(value) {
    var x = value.replace(/\D/g, '').match(/(\d{0,5})/);
    value = x[1];
    return value;
}
export function AmountFormatting(value, formatSymbol = ',') {
    if(value === undefined && typeof(value) !== "string") {
        return '';
    }
    value = parseFloat(value).toFixed(2);
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, formatSymbol);
}
export function AmountFormattingInt(value, formatSymbol = ',') {
    if(value === undefined && typeof(value) !== "string") {
        return '';
    }
    value = parseInt(value);
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, formatSymbol);
}
export function unFormatAmount(formattedValue, currencySymbol, formatSymbol = ',') {
    if(formattedValue && formattedValue !== undefined && typeof(formattedValue) === "string") {
        formattedValue = formattedValue.split(formatSymbol).join('');
        return formattedValue.replace(currencySymbol, '');
    } else {
        return formattedValue;
    }   
}

export function unMaskPhone(maskedValue) {
    if(maskedValue && maskedValue !== undefined && typeof(maskedValue) === "string")
        return maskedValue.replace('(','').replace(')','').replace(' ', '').replace('-','');
}

export  function isValidInteger(value) {
    const reg = /^[0-9\b]+$/;
    if (value === '' || reg.test(value)) {
        return true;
    }
    return false;
}

export function calculateAge(dateOfBirth, dateToCalculate) {
    const calculateYear = dateToCalculate.getFullYear();
    const calculateMonth = dateToCalculate.getMonth();
    const calculateDay = dateToCalculate.getDate();
  
    const birthYear = dateOfBirth.getFullYear();
    const birthMonth = dateOfBirth.getMonth();
    const birthDay = dateOfBirth.getDate();
  
    let age = calculateYear - birthYear;
    const ageMonth = calculateMonth - birthMonth;
    const ageDay = calculateDay - birthDay;
  
    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
      age = parseInt(age) - 1; // eslint-disable-line
    }
    return age;
  }
export function isFutureDate(dateOfBirth){
    var today = new Date().getTime(),
    birthdate = dateOfBirth.split("/");

    birthdate = new Date(birthdate[2], birthdate[0] - 1, birthdate[1]).getTime(); // Formate YYYY,MM,DD
    var diff = (today-birthdate);// / (365 * 24 * 60 * 60 * 1000);
    return diff < 0;
}
export function checkValidDate(dateOfBirth) {
    var pdate = dateOfBirth.split('/');
    var mm  = parseInt(pdate[0],10);
    var dd = parseInt(pdate[1],10);
    var yy = parseInt(pdate[2],10);
    // var today = new Date().getTime();
    // var birthdate = new Date(pdate[2], pdate[0] - 1, pdate[1]).getTime();
    // var diff = (today-birthdate) / (365 * 24 * 60 * 60 * 1000);
    var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
    let message = '';
    if(mm > 12 || mm < 1) message = 'Month';
    if (mm===1 || mm>2)
    {
        if (dd < 1 || dd>ListofDays[mm-1])
        {            
            message += 'Date';
        }
    }
    if (mm===2)
    {
        var lyear = false;
        if ( (!(yy % 4) && yy % 100) || !(yy % 400)) 
        {
        lyear = true;
        }
        if ((lyear===false) && (dd < 1 || dd>=29))
        {
            message = 'Date';
            
        }
        if ((lyear===true) && (dd < 1 || dd>29))
        {
            message = 'Date';				   
        }
    }
    if (yy === 0)
    {   
        message = "Year";
    }
    return message;
  }
  export function convertDateFormat(dateValue, currFormat, newFormat) {
    if(!dateValue  || dateValue === undefined || dateValue === null) {
        return '';
    }
    if(currFormat === newFormat) {
        return dateValue;
    } else {
        let updatedFormat = dateValue;
        let splitChar = "/";
        var mm = ''; var dd = ''; var yy = '';
        if(currFormat.indexOf("/") > -1) {
            splitChar = "/";
        } else if(currFormat.indexOf("-") > -1) {
            splitChar = "-";
        }
        var pdate = dateValue.split(splitChar);
        if(currFormat === dateFormatMDY_s || currFormat === dateFormatMDY_d)
        {
            mm  = parseInt(pdate[0],10);
            dd = parseInt(pdate[1],10);
            yy = parseInt(pdate[2],10);
        } 
        else if(currFormat === dateFormatYMD_s || currFormat === dateFormatYMD_d) 
        {
            yy  = parseInt(pdate[0],10);
            mm = parseInt(pdate[1],10);
            dd = parseInt(pdate[2],10);
        }
        else if(currFormat === dateFormatDMY_s || currFormat === dateFormatDMY_d) 
        {
            dd  = parseInt(pdate[0],10);
            mm = parseInt(pdate[1],10);
            yy = parseInt(pdate[2],10);
        }

        dd = dd < 10 ? `0${dd}` : `${dd}`;
        mm = mm < 10 ? `0${mm}` : `${mm}`;

        if(newFormat === dateFormatMDY_s)
        {
            updatedFormat =`${mm}/${dd}/${yy}`; 
        } 
        else if(newFormat === dateFormatMDY_d) 
        {
            updatedFormat =`${mm}-${dd}/${yy}`;
        } 
        else if(newFormat === dateFormatDMY_s) 
        {
            updatedFormat = `${dd}/${mm}/${yy}`; 
        }
        else if(newFormat === dateFormatDMY_d ) 
        {
            updatedFormat = `${dd}-${mm}-${yy}`; 
        }
        else if(newFormat === dateFormatYMD_s) 
        {
            updatedFormat = `${yy}/${mm}/${dd}`; 
        }
        else if(newFormat === dateFormatYMD_d) 
        {
            updatedFormat = `${yy}-${mm}-${dd}`; 
        }
        return updatedFormat;
    }
}
  export function allLetter(inputtxt){
    var isValid = false;
    let nameregex = /[^a-zA-Z+\s]+((\s)?([A-Za-z])+)*$/;       
    if(!nameregex.test(inputtxt)){
        isValid= true;
    }
    return isValid;
  }

  export function compareTwoDates(startDate, endDate){
    var sDate = startDate.split("/");
    sDate = new Date(sDate[2], sDate[0] - 1, sDate[1]).getTime(); // Formate YYYY,MM,DD
    var eDate = endDate.split("/");
    eDate = new Date(eDate[2], eDate[0] - 1, eDate[1]).getTime(); // Formate YYYY,MM,DD
    var diff = (eDate-sDate);// / (365  24  60  60  1000);
    diff = diff / 365 / 24 / 60 / 60 / 1000;
    return diff;
}

export function capitalizeFirstLetter(string) {
    if(string !== undefined) {
        let newstring = string.toLowerCase();
        newstring = newstring.charAt(0).toUpperCase() + newstring.slice(1);
        return newstring;
    }
    return string;
}
export function unformat(maskedValue, currencySymbol, formatSymbol = ',' ) {
    if(maskedValue && maskedValue !== undefined && typeof(maskedValue) === "string")
    {
        maskedValue = maskedValue.split(formatSymbol).join('');
        return maskedValue.replace('(','').replace(')','').replace(/ /g, '').replace(/-/g,'').replace(currencySymbol, '');
    }
}
export function unformatwithoutspace(maskedValue, currencySymbol, formatSymbol = ',') {
    if(maskedValue && maskedValue !== undefined && typeof(maskedValue) === "string")
    {
        maskedValue = maskedValue.split(formatSymbol).join('');
        return maskedValue.replace('(','').replace(')','').replace('-','').replace(currencySymbol, '');
    }
}
export function AddDate(oldDate, offsetType,offset) {
    var year = parseInt(oldDate.getFullYear());
    var month = parseInt(oldDate.getMonth());
    var date = parseInt(oldDate.getDate());
    var hour = parseInt(oldDate.getHours());
    var newDate;
    switch (offsetType) {
        case "Year":
        case "y":
        case "Y":              
                    newDate = new Date(year + parseInt(offset), month, date, hour);
                    break;
    
        case "Mmonth":
        case "m":
        case "M":
                    var yearOffset = 0;
                    var monthOffset = 0;
                    if (parseInt(offset) <12)
                    {
                    yearOffset = Math.floor((month + parseInt(offset))/12);
                    monthOffset = (month + parseInt(offset))%12;
                    }
                    else
                    {
                    yearOffset = Math.floor(parseInt(offset)/12);
                    monthOffset = month%12 + parseInt(offset)%12;
                    }
                    newDate = new Date(year + yearOffset, month + monthOffset, date, hour);
        break;
    
    
        case "Date":
        case "d":
        case "D":
                    var o = oldDate.getTime();
                    var n = o + parseInt(offset) * 24 * 3600 * 1000;
                    newDate = new Date(n);
        break;
    
        case "H":
        case "h":
                    var o = oldDate.getTi();
                    var n = o + parseInt(offset) * 3600 * 1000;
                    newDate = new Date(n);
        break;
        default:
                    newDate = new Date(year + parseInt(offset), month, date, hour);
    }
    return newDate;
    }

    export function MathsCalculator(oldValue, offset, offsetType) {
        
        var newValue=0;
        switch (offsetType) {
            case "+":
            case "Plus":
            
                        newValue = oldValue + offset;
                        break;
        
            case "-":
            case "Minus":
                        newValue = oldValue - offset;
                        break;
                        
            
            case "*":
            case "Multiply":
                        if(oldValue > 0)
                        newValue = oldValue * offset;
                        else
                        newValue = 0;
            break;
        
            case "/":
            case "Divide":
                            if(oldValue > 0)
                            newValue = oldValue / offset;
                            else
                            newValue = 0;
            break;
            default:
                        newValue = oldValue;
        }
        return newValue;
        }
    
        