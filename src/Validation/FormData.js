var formFields = {
    LegalName : { 'title' : 'First Name', 'placeholder' : 'First Name', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },
    
    LastName : { 'title' : 'Last Name', 'placeholder' : 'Last name', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },
    
    Emailaddress :  { 'title' : 'Email address', 'placeholder' : 'Email address', 'errormessage' : 'Please enter a valid email address.', 'required' : 'required', 'showTitle' : 'false' },

    ConfirmEmailaddress :  { 'title' : 'Confirm email address', 'placeholder' : 'Confirm email address', 'errormessage' : 'Email addresses do not match.', 'required' : 'required', 'showTitle' : 'false' },
    
    HomeAddress :  { 'title' : 'Your Street Address', 'placeholder' : 'Street address', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },
    
    HomeAddressApartment :  { 'title' : 'Apartment', 'placeholder' : 'Apt, Suite, Bldg. (Optional)', 'errormessage' : 'Only 20 characters is allowed.', 'required' : '', 'showTitle' : 'false' },
    
    HomeAddressCity :  { 'title' : 'City', 'placeholder' : 'City', 'errormessage' : 'Invalid city for selected state', 'required' : 'required', 'showTitle' : 'false' },
    
    HomeAddressState :  { 'title' : 'State', 'placeholder' : 'State', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },
    
    HomeAddressZipcode :  { 'title' : 'What is your zip code?', 'placeholder' : 'Zip', 'errormessage' : 'Invalid zip code.', 'required' : 'Please enter Zip', 'showTitle' : 'false' },
    
    BirthDate :  { 'title' : 'When were you born?', 'placeholder' : 'MM/DD/YYYY', 'errormessage' : 'Borrower must be at least 18 years old.', 'required' : 'Please enter Birthdate', 'showTitle' : 'false' },
    
    Housing :  { 'title' : "Housing Status", 'placeholder' : 'Housing', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },
    
    Employment :  { 'title' : "What is your employment status?", 'placeholder' : 'Employment', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },
    
    CitizenshipStatus :  { 'title' : 'Citizenship Status', 'placeholder' : 'Citizenship Status', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },
    
    HighestEducation :  { 'title' : 'Highest Education', 'placeholder' : 'Highest education', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    AnnualIncome :  { 'title' : 'Your Gross Annual Income', 'placeholder' : '$0', 'errormessage' : '','errormessagecode' : 'Insufficient Annual Income', 'required' : 'required', 'invalid' : 'Not a valid value.', 'showTitle' : 'false' },

    EstimatedCreditScore :  { 'title' : "What is your estimated credit score?", 'placeholder' : 'Estimated credit score', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    TimeAtCurrentAddress :  { 'title' : 'How long have you lived at your current address?', 'placeholder' : 'Time at current address', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    AnyMilitaryService :  { 'title' : 'Any military service', 'placeholder' : 'Any military service', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    PhoneNumber :  { 'title' : 'Phone number', 'placeholder' : '(xxx) xxx-xxxx', 'errormessagecode' : 'Invalid Area code.','errormessage' : 'Invalid Phone number.', 'required' : 'required', 'showTitle' : 'false' },

    ProvideSSN :  { 'title' : 'Please enter your SSN', 'placeholder' : 'xxx-xx-xxxx', 'errormessage' : 'Invalid SSN.', 'required' : 'required', 'showTitle' : 'false' },

    ConfirmSSN :  { 'title' : 'Confirm SSN', 'placeholder' : 'xxx-xx-xxxx', 'errormessage' : 'SSN does not match.', 'required' : 'required', 'showTitle' : 'false' },

    LoanAmount :  { 'title' : 'How much do you wish to borrow?', 'placeholder' : '$0', 'errormessage' : '', 'errormessagecode' : 'Enter an amount between ', 'required' : 'required', 'showTitle' : 'false' },

    LoanPurpose :  { 'title' : 'What is the purpose of the loan?', 'placeholder' : 'Select a loan purpose', 'errormessage' : 'Please make a selection.', 'required' : 'required', 'showTitle' : 'false' },
    
    PrimaryProjectPurpose :  { 'title' : 'What is the purpose of the loan?', 'placeholder' : 'Primary Project Purpose', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    HousingPayment :  { 'title' : "Housing Payment", 'placeholder' : '$0', 'errormessagecode' : 'Invalid Payment.','errormessage' : 'Invalid Housing Payment.', 'required' : 'required', 'showTitle' : 'false' },

    EmployerName: {'title' : "Employer Name", 'placeholder' : 'Employer Name', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false'},

    Position: { 'title' : 'What is your Position', 'placeholder' : 'Position/ Title', 'errormessage' : 'Only 10 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },

    StartDate: { 'title' : 'Start Date', 'placeholder' : 'MM/DD/YYYY', 'errormessage' : 'Please enter a valid Start Date.', 'required' : 'Please enter Start Date', 'showTitle' : 'false'},

    EndDate: { 'title' : 'End Date', 'placeholder' : 'MM/DD/YYYY', 'errormessage' : 'Please enter a valid End Date.', 'required' : 'Please enter End Date', 'showTitle' : 'false', 'checkBoxText': 'Current Position', 'showCheckbox': 'true'},

    EmployerAddress1: { 'title' : 'Your Street Address', 'placeholder' : 'Street address', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },
  
    EmployerAddress2: { 'title' : 'Apartment Address', 'placeholder' : 'Apt, Suite, Bldg. (Optional)', 'errormessage' : 'Only 20 characters is allowed.', 'required' : '', 'showTitle' : 'false' },
    
    EmployerCity:  { 'title' : 'City', 'placeholder' : 'City', 'errormessage' : 'Invalid city for selected state', 'required' : 'required', 'showTitle' : 'false' },
    
    EmployerState: { 'title' : 'State', 'placeholder' : 'State', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },
    
    EmployerZipCode: { 'title' : 'What is your zip code?', 'placeholder' : 'Zip', 'errormessage' : 'Invalid zip code.', 'required' : 'Please enter Zip', 'showTitle' : 'false' },
    
    EmployerPhoneNumber: { 'title' : 'what is your Phone number?', 'placeholder' : '(xxx) xxx-xxxx', 'errormessagecode' : 'Invalid Area code.','errormessage' : 'Invalid Phone number.', 'required' : 'required', 'showTitle' : 'false' },

    CoBorrower: { 'title' : "Would you like to add an additional borrower?", 'placeholder' : 'CoBorrower', 'errormessage' : '', 'required' : 'Please make a selection.', 'showTitle' : 'false' },
    SalaryAmount: { 'title' : 'Salary Amount', 'placeholder' : '$0', 'errormessage' : '','errormessagecode' : 'Invalid Salary Amount', 'required' : 'required', 'invalid' : 'Not a valid value.', 'showTitle' : 'false' },

    SalaryFrequency:  { 'title' : "Salary Period", 'placeholder' : 'Salary Frequency', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    CBFirstName : { 'title' : 'First Name', 'placeholder' : 'First Name', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },
    
    CBLastName : { 'title' : 'Last Name', 'placeholder' : 'Last name', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },
    
    CBEmailaddress :  { 'title' : 'Email address', 'placeholder' : 'Email address', 'errormessage' : 'Please enter a valid email address.', 'required' : 'required', 'showTitle' : 'false' },

    CBConfirmEmailaddress :  { 'title' : 'Confirm email address', 'placeholder' : 'Confirm email address', 'errormessage' : 'Email addresses do not match.', 'required' : 'required', 'showTitle' : 'false' },
    
    CBHomeAddress :  { 'title' : 'Your Street Address', 'placeholder' : 'Street address', 'errormessage' : 'Only 50 characters is allowed.', 'required' : 'required', 'showTitle' : 'false' },
    
    CBHomeAddressApartment :  { 'title' : 'Apartment', 'placeholder' : 'Apt, Suite, Bldg. (Optional)', 'errormessage' : 'Only 20 characters is allowed.', 'required' : '', 'showTitle' : 'false' },
    
    CBHomeAddressCity :  { 'title' : 'City', 'placeholder' : 'City', 'errormessage' : 'Invalid city for selected state', 'required' : 'required', 'showTitle' : 'false' },
    
    CBHomeAddressState :  { 'title' : 'State', 'placeholder' : 'State', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },
    
    CBHomeAddressZipcode :  { 'title' : 'What is your zip code?', 'placeholder' : 'Zip', 'errormessage' : 'Invalid zip code.', 'required' : 'Please enter Zip', 'showTitle' : 'false' },
    
    CBBirthDate :  { 'title' : 'When were you born?', 'placeholder' : 'MM/DD/YYYY', 'errormessage' : 'Borrower must be at least 18 years old.', 'required' : 'Please enter Birthdate', 'showTitle' : 'false' },
    
    CBHousing :  { 'title' : "Housing Status", 'placeholder' : 'Housing', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },
    
    CBEmployment :  { 'title' : "What is your employment status?", 'placeholder' : 'Employment', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    CBAnnualIncome :  { 'title' : 'Your Gross Annual Income', 'placeholder' : '$0', 'errormessage' : '','errormessagecode' : 'Insufficient Annual Income', 'required' : 'required', 'invalid' : 'Not a valid value.', 'showTitle' : 'false' },

    CBEstimatedCreditScore :  { 'title' : "What is your estimated credit score?", 'placeholder' : 'Estimated credit score', 'errormessage' : '', 'required' : 'required', 'showTitle' : 'false' },

    CBPhoneNumber :  { 'title' : 'Phone number', 'placeholder' : '(xxx) xxx-xxxx', 'errormessagecode' : 'Invalid Area code.','errormessage' : 'Invalid Phone number.', 'required' : 'required', 'showTitle' : 'false' },

    CBProvideSSN :  { 'title' : 'Please enter your SSN', 'placeholder' : 'xxx-xx-xxxx', 'errormessage' : 'Invalid SSN.', 'required' : 'required', 'showTitle' : 'false' },

    CBConfirmSSN :  { 'title' : 'Confirm SSN', 'placeholder' : 'xxx-xx-xxxx', 'errormessage' : 'SSN does not match.', 'required' : 'required', 'showTitle' : 'false' },
 
    CBHousingPayment :  { 'title' : "Housing Payment", 'placeholder' : '$0', 'errormessagecode' : 'Invalid Payment.','errormessage' : 'Invalid Housing Payment.', 'required' : 'required', 'showTitle' : 'false' },

}

var formHeaders = {
    TopHeader : { 'title' : 'Find Out If You Pre-Qualify', 'description' : 'PrimeRates can check if you pre-qualify without affecting your credit score. (All fields are Required)', 'showTitle' : 'false',
                    'context1' : 'Get offers from multiple lenders',
                    'context2' : 'No impact to your credit score',
                    'context3' : 'Your information is secure', },

    Sections: { 'section1' : 'Tell Us About Yourself',
                'section2' : 'Lender Partner-Required Information',
                'section3' : 'Loan Request Information',
                'section4' : 'Terms and Conditions',},
     
}


var constantVariables = {
    loanAmountMin : 3000,
    loanAmountMax : 100000,
    loanAmountMinHW : 1000,
    loanAmountMaxHW : 100000,
    loanAmountMinZalea : 2000,
    loanAmountMaxZalea : 35000,
    HWStateMin : 2000,
    annualIncomeMin :  7200,
    annualIncomeMax : 10000000,
    prequalifyPostURL: '/personal-loans/pre-qualify/offers',
    summaryPagePostURL: '/los-full-application/bank-linking',
    zaleaPostURL: '/offers',
    headWayPostURL: '/offers',
    appFormStartPostURL: '/personal-loans/app-form-housing',
    appFormHousingPostURL: '/personal-loans/app-form-pinfo',
    appFormPInfoPostURL: '/personal-loans/app-form-pinfo/offers',
    //prequalifyPostURL: "/redirect",
}
export { formFields, formHeaders, constantVariables };