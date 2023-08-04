export const currencySymbol = "$";
const validate = (value, rules) => {
  let isValid = true;
  
  for (let rule in rules) {
  
    switch (rule) {
      
        case 'required': isValid = isValid && requiredValidator(value); break;

      	case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]); break;
        
        case 'isEmail': isValid = isValid && emailValidator(value); break;

        case 'max': isValid = isValid && maxValidator(value,rules[rule]); break;

        case 'min': isValid = isValid && minValidator(value,rules[rule]); break;
        
      	default: isValid = true;
    }

  }
  
  return isValid;
}
export function unFormatAmount(formattedValue) {
  return formattedValue.replace(currencySymbol, '').replace(/,/g, '');
}

/**
 * minLength Val
 * @param  value 
 * @param  minLength
 * @return          
 */
const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
}

/**
 * Check to confirm that feild is required
 * 
 * @param  value 
 * @return       
 */

const requiredValidator = value => {
  if(value && typeof(value) === "string") {
   return value.trim() !== '' && value !=='Select';
  } else {
    return value;
  }
     
}
/**
 * Email validation
 * 
 * @param value
 * @return 
 */
const emailValidator = value => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
}


const maxValidator =   (value, maxValue) => {
  
  return  value===''? true: parseInt(maxValue, 10) >= parseInt(unFormatAmount(value), 10); 
}

const minValidator =  (value, minValue) => {
  return value===''? true: parseInt(minValue, 10) < parseInt(unFormatAmount(value), 10); 
}


export {validate};
