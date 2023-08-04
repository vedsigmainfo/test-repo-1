import React, { Component } from "react";
import { formFields,  constantVariables } from "./Validation/FormData";
import { CallGAEvent } from "./Validation/GoogleAnalytics.js";
import { loanPurposeList1, PrimaryProjectPurpose, defaultValues, stateList, housingList, employmentList, citizenshipStatusList, highestEducationList, estimatedCreditScoreList, timeAtCurrentAddressList, anyMilitaryServiceList, salaryPeriod, POBox } from "./AppData";
import TextField from "./TextField";
import MaskedTextField from "./MaskedTextField";
import SelectField from "./SelectField";
import { SendEmail } from "./EmailFunctions";
//import CheckBoxField from "./CheckBoxField";
import axios from "axios";
//import { Container,Col,Row } from 'react-bootstrap';
import { emailRegex, GetPhoneMask, GetSSNMask, AmountFormatting, isValidInteger, unFormatAmount, calculateAge, isFutureDate, checkValidDate, GetZipcodeMask, IsPhoneNumberValid, IsValidAreaCode, unMaskPhone, IsSSNGroupValid, allLetter, convertDateFormat, unformat } from "./Validation/RegexList";


const displayBlock = { display: 'block' };
const displayNone = { display: 'none' };
var autocomplete;
var autocompleteEmployment;
var autocompletecoborrower;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
};
class LoanApplicationForm extends Component {
    constructor(props) {
        super(props);
        const filteredLoanPurpose = loanPurposeList1.filter(lp => {
            if (this.props.loanPurpose) {
                return (lp.plKey.toLowerCase() === this.props.loanPurpose.toLowerCase())
                    && this.props.loanPurpose.length > 0;
            }
            return filteredLoanPurpose;
        });

        const filteredHousing = housingList.filter(lp => {
            if (this.props.PostDataFull && this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].housingStatus) {
                return (lp.key.toLowerCase() === this.props.PostDataFull.borrowers[0].housingStatus.toLowerCase())
                    && this.props.PostDataFull.borrowers[0].housingStatus.length > 0;
            }
            return filteredHousing;
        });
        const filteredState = stateList.filter(lp => {
            if (this.props.PostDataFull && this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].state) {
                return (lp.key.toLowerCase() === this.props.PostDataFull.borrowers[0].state.toLowerCase())
                    && this.props.PostDataFull.borrowers[0].state.length > 0;
            }
            return filteredState;
        });

        const filteredEstimatedCreditScore = estimatedCreditScoreList.filter(lp => {
            if (this.props.PostDataFull && this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].creditScore) {
                return (lp.key.toLowerCase() === this.props.PostDataFull.borrowers[0].creditScore.toLowerCase())
                    && this.props.PostDataFull.borrowers[0].creditScore.length > 0;
            }
            return filteredEstimatedCreditScore;
        });
        const filteredTimeAtCurrentAddress = timeAtCurrentAddressList.filter(lp => {
            if (this.props.PostDataFull && this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].currenttime) {
                return (lp.key.toLowerCase() === this.props.PostDataFull.borrowers[0].currenttime.toLowerCase())
                    && this.props.PostDataFull.borrowers[0].currenttime.length > 0;
            }
            return filteredTimeAtCurrentAddress;
        });

        const filteredemployment = employmentList.filter(lp => {
            if (this.props.PostDataFull && this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].employmentStatus) {
                return (lp.key.toLowerCase() === this.props.PostDataFull.borrowers[0].employmentStatus.toLowerCase())
                    && this.props.PostDataFull.borrowers[0].employmentStatus.length > 0;
            }
            return filteredemployment;
        });

        this.state = {
            isError: false,
            creditScore: defaultValues.creditScore,
            defaultSelect: defaultValues.defaultSelect,
            selectedState: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].state ? filteredState[0] ? filteredState[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedStateChanged: '',
            selectedHousing: this.props.PostDataFull.borrowers[0] && this.getHousingKey(this.props.PostDataFull.borrowers[0].housingStatus) ? filteredHousing[0] ? filteredHousing[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedEmployment: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].employmentStatus ? filteredemployment[0] ? filteredemployment[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedCitizenship: defaultValues.defaultSelect,
            selectedHighestEducation: defaultValues.defaultSelect,
            selectedEstimatedCreditScore: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].creditScore ? filteredEstimatedCreditScore.length > 0 ? filteredEstimatedCreditScore[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedTimeAtCurrentAddress: this.props.PostData && this.props.PostDataFull.currenttime ? filteredTimeAtCurrentAddress[0] ? filteredTimeAtCurrentAddress[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedAnyMilitaryService: defaultValues.defaultSelect,
            selectedLoanPurpose: filteredLoanPurpose.length > 0 ? filteredLoanPurpose[0].key : this.props.PostData && this.props.PostDataFull.loanPurpose ? this.props.PostDataFull.loanPurpose : defaultValues.defaultSelect,
            selectedPrimaryProject: defaultValues.defaultSelect,
            isFirstNameValid: true,
            isLastNameValid: true,
            isEmailValid: true,
            isStreedAddressValid: true,
            isApptValid: true,
            isCityValid: true,
            isStateValid: true,
            isZipcodeValid: true,
            isBirthdateValid: true,
            isHousingValid: true,
            isEmploymentValid: true,
            isCitizenshipStatusValid: true,
            isHighestEducationValid: true,
            isAnnualIncomeValid: true,
            isHousingPaymentValid: true,
            isEstimatedCreditScoreValid: true,
            isTimeAtCurrentAddressValid: true,
            isAnyMilitaryServiceValid: true,
            isPhoneNumberValid: true,
            isProvideSSNValid: true,
            isLoanAmountValid: true,
            isLoanPurposeValid: true,
            isPrimaryProjectPurposeValid: true,
            showFirstNameError: true,
            showLastNameError: true,
            showEmailError: true,
            showStreedAddressError: true,
            showApptError: true,
            showCityError: true,
            showZipcodeError: true,
            showBirthdateError: true,
            showAnnualIncomeError: true,
            showAnnualIncomeMinError: true,
            showHousingPaymentError: true,
            showHousingPaymentMinError: true,
            showHousingPaymentCodeError: true,
            showPhoneNumberError: true,
            showPhoneNumberCodeError: true,
            showProvideSSNError: true,
            showLoanAmountError: true,
            showLoanAmountMinError: true,
            showLoanPurposeError: true,
            showPrimaryProjectError: true,
            FirstNameValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].firstName ? this.props.PostDataFull.borrowers[0].firstName : '',
            LastNameValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].lastName ? this.props.PostDataFull.borrowers[0].lastName : '',
            EmailValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].emailAddress ? this.props.PostDataFull.borrowers[0].emailAddress : '',
            EmailChangedValue: '',
            StreedAddressValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].address1 ? this.props.PostDataFull.borrowers[0].address1 : '',
            ApptValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].address2 ? this.props.PostDataFull.borrowers[0].address2 : '',
            CityValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].city ? this.props.PostDataFull.borrowers[0].city : '',
            CityChangedValue: '',
            ZipcodeValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].zipCode ? this.props.PostDataFull.borrowers[0].zipCode : '',
            ZipcodeChangedValue: '',
            BirthdateValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].dateOfBirth ? convertDateFormat(this.props.PostDataFull.borrowers[0].dateOfBirth, "YYYY-MM-DD","MM/DD/YYYY") : '',
            DisplayAnnualIncomeValue: '',
            AnnualIncomeValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].annualIncome ? `$${AmountFormatting(this.props.PostDataFull.borrowers[0].annualIncome)}` : '',
            HousingPaymentValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].housingPayment ? `$${AmountFormatting(this.props.PostDataFull.borrowers[0].housingPayment)}` : '',
            PlainHousingPayment: '0',
            PlainAnnualIncome: this.props.PostData && this.props.PostDataFull.annualincome ? unFormatAmount(this.props.PostDataFull.annualincome) : '',
            PhoneNumberValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].primaryPhoneNumber ? GetPhoneMask(this.props.PostDataFull.borrowers[0].primaryPhoneNumber) : '',
            PhoneNumberMasked: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].primaryPhoneNumber ? this.props.PostDataFull.borrowers[0].primaryPhoneNumber : '',
            SecondaryPhoneNumberValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].secondaryPhoneNumber ? GetPhoneMask(this.props.PostDataFull.borrowers[0].secondaryPhoneNumber) : '',
            SecondaryPhoneNumberMasked: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].secondaryPhoneNumber ? this.props.PostDataFull.borrowers[0].secondaryPhoneNumber : '',
            showSecondaryPhoneNumberError: true,
            showSecondaryPhoneNumberCodeError: true,
            isSecondaryPhoneNumberValid: true,
            ProvideSSNValue: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].ssn ? GetSSNMask(this.props.PostDataFull.borrowers[0].ssn) : '',
            ProvideSSNMasked: this.props.PostDataFull.borrowers[0] && this.props.PostDataFull.borrowers[0].ssn ? this.props.PostDataFull.borrowers[0].ssn : '',
            DisplayLoanAmountValue: '',
            LoanAmountValue: this.props.loanAmount ? this.props.loanAmount : this.props.PostData && this.props.PostDataFull.loanamount ? this.props.PostDataFull.loanamount : '',
            PlainLoanAmount: this.props.loanAmount ? unFormatAmount(this.props.loanAmount) : this.props.PostData && this.props.PostDataFull.loanamount ? unFormatAmount(this.props.PostDataFull.loanamount) : '',
            hasErrorCssClass: 'has-error',
            initialEnabled: false,
            initialDisabled: false,
            AgreeTerms: true,
            AgreePqTerms: true,
            CBAgreePqTerms: true,
            AgreeConsent: true,
            AgreeEmail: true,
            AgreeTCPA: false,
            emailFocus: false,
            annualIncomeFocus: false,
            housingPaymentFocus: false,
            showModal: false,
            loaderContent: '',
            InCompleteEmailSent: false,
            PlainSSN: '',
            showDOBMessage: '',
            showAIMessage: '',
            showLenderImage: '',
            partnerId: this.props.PartnerId,
            zipCodeArray: [],
            cityCodeArray: [],
            stateCodeArray: [],
            housingPaymentDisabled: true,
            IsFormSubmitted: false,
            IsSummaryPage: true,
            IsSummaryPageEdit: false,
            ShowLoanProcessing: this.props.loanAmount ? true : this.props.PostData && this.props.PostDataFull.loanamount ? true : false,
            LoanOriginationFees: '',
            LoanOrigination: '',
            ShowLoanOriginationError: false,
            IncludeFees: false,
            IsIntercom: this.props.affiliateid === "intercom" ? true : false,
            IsAcquireInteractive: this.props.affiliateid === "426464" ? true : false,
            IsIntercomEdit: false,
            IsAcquireInteractiveExit: false,
            IntercomePoor: false,
            IntercomErrorMessage: 'Please agree to terms and conditions.',

            mpUniqueClickID: this.getGUID(),
            IPAddress: '',

            EmployerName: '',
            EmployerNameValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName : '',
            showEmployerNameError: true,
            isEmployerNameValid: true,

            position: '',
            PositionValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].position ? this.props.PostDataFull.borrowers[0].employmentInformation[0].position : '',
            // this.props.position && this.props.position !== undefined ? this.props.position : this.props.EmployerInformation && this.props.EmployerInformation.position && this.props.EmployerInformation.position !== undefined ? decodeURIComponent(this.props.EmployerInformation.position) : '',
            showPositionError: true,
            isPositionValid: true,

            StartDate: '',
            StartDateValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].startDate ? convertDateFormat(this.props.PostDataFull.borrowers[0].employmentInformation[0].startDate,"YYYY-MM-DD","MM/DD/YYYY") : '',
            showStartDateError: true,
            isStartDateValid: true,

            EndDate: '',
            EndDateValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate ? convertDateFormat(this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate,"YYYY-MM-DD","MM/DD/YYYY") : '',
            showEndDateError: true,
            isEndDateValid: true,
            EndDateDisabled: this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate ? false : true,
            EditEndDateCheckBoxChecked: true,
            
            EmployerAddress1: '',
            EmployerAddress1Value: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress1 ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress1 : '',
            showEmployerAddress1Error: true,
            isEmployerAddress1Valid: true,

            EmployerAddress2: '',
            EmployerAddress2Value: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress2 ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress2 : '',
            showEmployerAddress2Error: true,
            isEmployerAddress2Valid: true,

            EmployerCity: '',
            EmployerAddress1CityValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerCity ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerCity : '',
            showEmployerAddress1CityError: true,
            isEmployerAddress1CityValid: true,
            EmployercityChnagedvalue: '',

            EmployerState: '',
            EmployerAddress1StateValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerState ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerState : '',
            showEmployerAddress1StateError: true,
            isEmployerAddress1StateValid: true,
            EmployerselectedStateChanged: '',

            EmployerZipCode: '',
            EmployerAddress1ZipcodeValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerZipCode ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerZipCode : '',
            showEmployerAddress1ZipcodeError: true,
            isEmployerAddress1ZipcodeValid: true,
            EmployerZipcodeChangedValue: '',

            SalaryAmount: '',
            SalaryAmountValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryAmount ? this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryAmount : '',
            salaryAmountFocus: false,
            showSalaryAmountError: true,
            isSalaryAmountValid: true,
            PlainSalaryAmount: '',
            showSAmountMessage: '',
            showSalaryAmountMinError: true,

            selectedSalaryPeriod: '',
            SalaryPeriodValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryPeriod ? this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryPeriod : '',
            showSalaryPeriodError: true,
            isSalaryPeriodValid: true,

            EmployerPhoneNumber: '',
            EmployerPhoneNumberValue: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber ? GetPhoneMask(decodeURIComponent(this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber)) : '',
            EmployerPhoneNumberMasked: this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber : '',
            isEmployerPhoneNumbervalid: true,
            showEmployerphonenumberError: true,
            // PrimaryPhoneNumberValue: this.props.PostData && this.props.PostDataFull.phonenumber ? GetPhoneMask(decodeURIComponent(this.props.PostDataFull.phonenumber)) : '',

            CBFirstNameValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].firstName ? this.props.PostDataFull.borrowers[1].firstName : '',
            isCBFirstNameValid: true,
            showCBFirstNameError: true,

            CBLastNameValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].lastName ? this.props.PostDataFull.borrowers[1].lastName : '',
            isCBLastNameValid: true,
            showCBLastNameError: true,

            CBEmailValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].emailAddress ? this.props.PostDataFull.borrowers[1].emailAddress : '',
            isCBEmailValid: true,
            showCBEmailError: true,
            CBEmailChangedValue: '',
            CBemailFocus: false,
            InCompleteCBEmailSent: false,

            CBPhoneNumberValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].primaryPhoneNumber ? GetPhoneMask(this.props.PostDataFull.borrowers[1].primaryPhoneNumber) : '',
            CBPhoneNumberMasked: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].primaryPhoneNumber ? this.props.PostDataFull.borrowers[1].primaryPhoneNumber : '',
            CBSecondaryPhoneNumberValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].secondaryPhoneNumber ? GetPhoneMask(this.props.PostDataFull.borrowers[1].secondaryPhoneNumber) : '',
            CBSecondaryPhoneNumberMasked: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].secondaryPhoneNumber ? this.props.PostDataFull.borrowers[1].secondaryPhoneNumber : '',
            showCBSecondaryPhoneNumberError: true,
            showCBSecondaryPhoneNumberCodeError: true,
            isCBSecondaryPhoneNumberValid: true,
            showCBPhoneNumberError: true,
            showCBPhoneNumberCodeError: true,
            isCBPhoneNumberValid: true,

            CBStreetAddressValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].address1 ? this.props.PostDataFull.borrowers[1].address1 : '',
            isCBStreetAddressValid: true,
            showCBStreetAddressError: true,

            CBApptValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].address2 ? this.props.PostDataFull.borrowers[1].address2 : '',
            isCBApptValid: true,
            showCBApptError: true,

            CBCityValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].city ? this.props.PostDataFull.borrowers[1].city : '',
            CBCityChangedValue: '',
            showCBCityError: true,
            isCBCityValid: true,

            CBselectedState: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].state ? filteredState[0] ? filteredState[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            CBselectedStateChanged: '',
            isCBStateValid: true,

            CBZipcodeValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].zipCode ? this.props.PostDataFull.borrowers[1].zipCode : '',
            CBZipcodeChangedValue: '',
            showCBZipcodeError: true,
            isCBZipcodeValid: true,

            CBselectedHousing: this.props.PostDataFull.borrowers[1] && this.getHousingKey(this.props.PostDataFull.borrowers[1].housingStatus) ? filteredHousing[0] ? filteredHousing[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            isCBHousingValid: true,
            isCBHousingPaymentValid: true,
            CBhousingPaymentDisabled: true,
            CBHousingPaymentValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].housingPayment ? `$${AmountFormatting(this.props.PostDataFull.borrowers[1].housingPayment)}` : '',
            PlainCBHousingPayment: '0',
            showCBHousingPaymentError: true,
            showCBHousingPaymentMinError: true,
            showCBHousingPaymentCodeError: true,
            CBhousingPaymentFocus: false,


            CBselectedEstimatedCreditScore: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].creditScore ? filteredEstimatedCreditScore.length > 0 ? filteredEstimatedCreditScore[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            CBcreditScore: defaultValues.creditScore,
            isCBEstimatedCreditScoreValid: true,

            CBBirthdateValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].dateOfBirth ? convertDateFormat(this.props.PostDataFull.borrowers[1].dateOfBirth, "YYYY-MM-DD","MM/DD/YYYY") : '',
            showCBBirthdateError: true,
            isCBBirthdateValid: true,

            CBProvideSSNValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].ssn ? GetSSNMask(this.props.PostDataFull.borrowers[1].ssn) : '',
            CBProvideSSNMasked: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].ssn ? this.props.PostDataFull.borrowers[1].ssn : '',
            isCBProvideSSNValid: true,
            CBPlainSSN: '',
            showCBProvideSSNError: true,

            CBselectedEmployment: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].employmentStatus ? filteredemployment[0] ? filteredemployment[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            isCBEmploymentValid: true,

            CBAnnualIncomeValue: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].annualIncome ? `$${AmountFormatting(this.props.PostDataFull.borrowers[1].annualIncome)}` : '',
            CBannualIncomeFocus: false,
            CBPlainAnnualIncome: this.props.PostDataFull.borrowers[1] && this.props.PostDataFull.borrowers[1].annualincome ? unFormatAmount(this.props.PostDataFull.borrowers[1].annualincome) : '',
            showCBAnnualIncomeError: true,
            showCBAnnualIncomeMinError: true,
            DisplayCBAnnualIncomeValue: '',
            isCBAnnualIncomeValid: true,

            CurrentPositionValue: '',
            isCurrentPositionValid: true,
            showCurrentPositionError: true,

            AccountNumber: '',
            AccountNumberValue: '',
            showAccountNumberError: true,
            isAccountNumberValid: true,

            RoutingNumber: '',
            RoutingNumberValue: '',
            showRoutingNumberError: true,
            isRoutingNumberValid: true,
            CompleteInfo: '',
            EmploymentHistory: [],
            employerzipCodeArray: [],
            employercityCodeArray: [],
            employerstateCodeArray: [],
            CBzipCodeArray: [],
            CBcityCodeArray: [],
            CBstateCodeArray: [],
        }
    }
    componentDidMount() {
        //this.getLenderLogoURLFromConfig();
        this.initAutocomplete();
        this.initEmploymentAutocomplete();
        this.initcoborrowerAutocomplete();
        this.getIPAddress();
        if(this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate === '')
         { 
             //document.getElementById('chk-currentPosition').checked = true;
             this.setState({ EditEndDateCheckBoxChecked : true });
         } else {
            ///document.getElementById('chk-currentPosition').checked = false;
            this.setState({ EditEndDateCheckBoxChecked : false });
         }
        this.setState({ AgreePqTerms: true, AgreeTCPA: false , CBAgreePqTerms:true });
        // if ((this.props.affiliateid === "CreditSoup") && (!this.ValidateInfo(false) || !this.IsValidBirthdate(this.props.PostDataFull.birthdate))) {
        //     this.ShowLoanAppForm();
        //     this.LogInvalidData();
        // }

        if (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage') {
            this.setState({ housingPaymentDisabled: false });
        }
        this.setState({ mpUniqueClickID: this.getGUID() });

        window.curentstate = this;
        window.onpopstate = function (event) {
            return;
        }
        this.state.UpdatedData = this.getUpdatedData(this.props.PostDataFull);
    }
    ShowLoanAppForm() {
        window.scroll(0, 0);
        this.setState({ IsSummaryPageEdit: true, IsSummaryPage: false, AgreePqTerms: false, CBAgreePqTerms: false, AgreeConsent: false });

        this.setState({
            selectedHousing: this.getHousingKey(this.props.PostDataFull.borrowers[0].housingStatus),
            selectedEmployment: this.getEmploymentKey(this.props.PostDataFull.borrowers[0].employmentStatus),
            selectedEstimatedCreditScore: this.getEstimatedCreditScoreKey(this.props.PostDataFull.borrowers[0].creditScore)
        });
        if (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage') {
            this.setState({ housingPaymentDisabled: false });
        }
        if(this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate !== "") {
            if(document.getElementById("chk-currentPosition") !== null && !document.getElementById("chk-currentPosition").checked) {
                let endDateDisabled = true;  
                this.setState({ EditEndDateCheckBoxChecked: endDateDisabled, EndDateValue : endDateDisabled ? '' : this.state.EndDateValue, EndDateDisabled: endDateDisabled, isEndDateValid: true, isError: false });
                if(endDateDisabled) {
                    this.setState({
                        isEndDateValid: true,
                        showEndDateError: true,
                        showEndDateMessage: '',
                        showErrorMessage:''
                    // showEndDateError: false
                    });
                }
            }
        }
        let that = this;
        setTimeout(() => {
            that.initAutocomplete();
            that.initEmploymentAutocomplete();
            that.initcoborrowerAutocomplete();
            let formTag = document.getElementById(that.props.configSettings.formSettings.summaryFormName);
            if ( formTag && formTag.ssn !== null && formTag.ssn.length > 1) {
                formTag.ssn[0].type = "password";
            } else if(formTag && formTag.ssn !== null) {
                formTag.ssn.type = "password";
            }
        }, 1000)
    }
    LogInvalidData() {
        setTimeout(() => {
            let fields = `Field Name:`;
            if (!this.state.FirstNameValue) { fields = `${fields}FirstName, Values:'${this.props.PostDataFull.firstname}',`; }
            if (!this.state.LastNameValue) { fields = `${fields}LastName, Values:'${this.props.PostDataFull.lastname}',`; }
            if (!this.state.EmailValue || !this.state.isEmailValid || !this.state.showEmailError) { fields = `${fields}Email, Values:'${this.props.PostDataFull.email}',`; }
            if (!this.state.StreedAddressValue) { fields = `${fields}StreetAddress, Values:'${this.props.PostDataFull.streetaddress}',`; }
            if (!this.state.CityValue) { fields = `${fields}City, Values:'${this.props.PostDataFull.city}',`; }
            if (!this.state.ZipcodeValue || !this.state.showZipcodeError) { fields = `${fields}ZipcodeValue, Values:'${this.props.PostDataFull.zipcode}',`; }
            if (!this.state.BirthdateValue || this.state.BirthdateValue.length < 10 || !this.state.showBirthdateError) { fields = `${fields}Birthdate, Values:'${this.props.PostDataFull.birthdate}',`; }
            if (!this.state.AnnualIncomeValue || !this.state.showAnnualIncomeMinError) { fields = `${fields}AnnualIncome, Values:'${this.props.PostDataFull.annualincome}',`; }
            if (!this.state.PhoneNumberValue || !this.state.showPhoneNumberError || !this.state.showPhoneNumberCodeError) { fields = `${fields}Phonenumber, Values:'${this.props.PostDataFull.phonenumber}',`; }
            if (!this.state.ProvideSSNValue || !this.state.showProvideSSNError) { fields = `${fields}SSN, Values:'${this.props.PostDataFull.ssn}',`; }
            if (!this.state.LoanAmountValue || !this.state.showLoanAmountMinError) { fields = `${fields}LoanAmount, Values:'${this.props.PostDataFull.loanamount}',`; }
            if (this.state.selectedState === 'Select') { fields = `${fields}State, Values:'${this.props.PostDataFull.state}',`; }
            if (this.state.selectedHousing === 'Select') { fields = `${fields}Housing, Values:'${this.props.PostDataFull.housing}',`; }
            if (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage') {
                if (!this.state.HousingPaymentValue) { fields = `${fields}HousingPayment, Values:'${this.props.PostDataFull.housingPayment}',`; }
            }
            if (this.state.selectedEmployment === 'Select') { fields = `${fields}Employment, Values:'${this.props.PostDataFull.employment}',`; }
            // if (!this.state.IsIntercom && this.state.selectedEstimatedCreditScore === 'Select') { fields = `${fields}CreditScore, Values:'${this.props.PostDataFull.creditscore}',`; }
            if (this.state.selectedTimeAtCurrentAddress === 'Select') { fields = `${fields}TimeAtCurrentAddress, Values:'${this.props.PostDataFull.currenttime}',`; }

            let source = `action=log_message&nonce=4109b2257c&logMessage=Validation error occurred on ${this.props.affiliateid} call with fields: ${fields}`;
            SendEmail(this.props.ThemeConfig.emailSendEndpoint, source);
        }, 2500);
    }
    initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        try {
            autocomplete = new window.google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('address1')),
                { types: ['geocode'] });

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
            autocomplete.setComponentRestrictions({ 'country': ['us'] });
            var input = document.getElementById('address1');
            window.google.maps.event.addDomListener(input, 'keydown', e => {
                // If it's Enter
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            });
            window.google.maps.event.addDomListener(input, 'onchange', e => {
                // If it's onchange
                e.preventDefault();
            });
        } catch (e) {

        }
    }

    initEmploymentAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        try {
            autocompleteEmployment = new window.google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('employerAddress1')),
                { types: ['geocode'] });

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocompleteEmployment.addListener('place_changed', this.fillInEmployerAddress.bind(this));
            autocompleteEmployment.setComponentRestrictions({ 'country': ['us'] });
            var input = document.getElementById('employerAddress1');
            window.google.maps.event.addDomListener(input, 'keydown', e => {
                // If it's Enter
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            });
            window.google.maps.event.addDomListener(input, 'onchange', e => {
                // If it's onchange
                e.preventDefault();
            });
        } catch (e) {

        }
    }

    fillInEmployerAddress() {
        // Get the place details from the autocomplete object.
        var place = autocompleteEmployment.getPlace();
        this.setState({
            EmployerAddress1Value: '', EmployerAddress2Value: '', EmployerAddress1CityValue: '',
            EmployerAddress1StateValue: defaultValues.defaultSelect, EmployerAddress1ZipcodeValue: '', isEmployerAddress1StateValid: true, isEmployerAddress1CityValid: true, isEmployerAddress1ZipcodeValid: true, showEmployerAddress1CityError: true, showEmployerAddress1ZipcodeError: true
        });
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        let streetAdd = ''; let aprtmentAdd = ''; let city = ''; let state = ''; let zip = '';

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                if (addressType === 'street_number') {
                    streetAdd = val;
                }
                if (addressType === 'route') {
                    aprtmentAdd = val;
                }
                if (addressType === 'locality') {
                    city = val;
                }
                if (addressType === 'administrative_area_level_1') {
                    state = val;
                }
                if (addressType === 'postal_code') {
                    zip = val;
                }
            }
        }
        if (!this.handlePOBoxAddress(streetAdd)) {
            let findState = stateList.find(o => o.key === state);
            if (findState !== null && findState !== undefined) {
                this.setState({
                    EmployerAddress1Value: `${streetAdd} ${aprtmentAdd}`, EmployerAddress2Value: '', EmployerAddress1CityValue: city, CityChangedValue: city,
                    EmployerAddress1StateValue: state, selectedStateChanged: state, EmployerAddress1ZipcodeValue: zip, ZipcodeChangedValue: zip, showInvalidAddressModal: false
                });
                document.getElementById('employmentStatusselect').focus();
            }
            else {
                this.setState({ showInvalidAddressModal: true });
            }
        } else {
            this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showStreedAddressError: false });
        }
    }
    fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
            if(place.address_components) {
            this.setState({
                StreedAddressValue: '', ApptValue: '', CityValue: '',
                selectedState: defaultValues.defaultSelect, ZipcodeValue: '', isStateValid: true, isCityValid: true, isZipcodeValid: true, showCityError: true, showZipcodeError: true
            });
            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            let streetAdd = ''; let aprtmentAdd = ''; let city = ''; let state = ''; let zip = '';

            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                    var val = place.address_components[i][componentForm[addressType]];
                    if (addressType === 'street_number') {
                        streetAdd = val;
                    }
                    if (addressType === 'route') {
                        aprtmentAdd = val;
                    }
                    if (addressType === 'locality') {
                        city = val;
                    }
                    if (addressType === 'administrative_area_level_1') {
                        state = val;
                    }
                    if (addressType === 'postal_code') {
                        zip = val;
                    }
                }
            }
            if (!this.handlePOBoxAddress(streetAdd)) {
                let findState = stateList.find(o => o.key === state);
                if (findState !== null && findState !== undefined) {
                    this.setState({
                        StreedAddressValue: `${streetAdd} ${aprtmentAdd}`, ApptValue: '', CityValue: city, CityChangedValue: city,
                        selectedState: state, selectedStateChanged: state, ZipcodeValue: zip, ZipcodeChangedValue: zip, showInvalidAddressModal: false
                    });
                }
                else {
                    this.setState({ showInvalidAddressModal: true });
                }
            } else {
                this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showStreedAddressError: false });
            }
        }
    }

    
    initcoborrowerAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        try {
            autocompletecoborrower = new window.google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('CBHomeAddress')),
                { types: ['geocode'] });

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocompletecoborrower.addListener('place_changed', this.fillInCoborrowerAddress.bind(this));
            autocompletecoborrower.setComponentRestrictions({ 'country': ['us'] });
            var input = document.getElementById('CBHomeAddress');
            window.google.maps.event.addDomListener(input, 'keydown', e => {
                // If it's Enter
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            });
        } catch (e) {

        }
    }

    fillInCoborrowerAddress() {
        // Get the place details from the autocomplete object.
        var place = autocompletecoborrower.getPlace();
        this.setState({
            CBStreetAddressValue: '', CBApptValue: '', CBCityValue: '',
            CBselectedState: defaultValues.defaultSelect, CBZipcodeValue: '', isCBStateValid: true, isCBCityValid: true, isCBZipcodeValid: true, showCBCityError: true, showCBZipcodeError: true
        });
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        let streetAdd = ''; let aprtmentAdd = ''; let city = ''; let state = ''; let zip = '';

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                if (addressType === 'street_number') {
                    streetAdd = val;
                }
                if (addressType === 'route') {
                    aprtmentAdd = val;
                }
                if (addressType === 'locality') {
                    city = val;
                }
                if (addressType === 'administrative_area_level_1') {
                    state = val;
                }
                if (addressType === 'postal_code') {
                    zip = val;
                }
            }
        }
        if (!this.handlePOBoxAddress(streetAdd)) {
            let findState = stateList.find(o => o.key === state);
            if (findState !== null && findState !== undefined) {
                this.setState({
                    CBStreetAddressValue: `${streetAdd} ${aprtmentAdd}`, CBApptValue: '', CBCityValue: city, CBCityChangedValue: city,
                    CBselectedState: state, CBselectedStateChanged: state, CBZipcodeValue: zip, CBZipcodeChangedValue: zip, showInvalidAddressModal: false
                });
                // document.getElementById('employmentStatusselect').focus();
            }
            else {
                this.setState({ showInvalidAddressModal: true });
            }
        } else {
            this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showCBStreetAddressError: false });
        }
    }


    closePopup() {
        this.setState({ showInvalidAddressModal: false, showStateLoanAmountModal: false });
    }
    AgreeTCPAChange(e) {
        this.setState({ AgreeTCPA: e.target.checked , isError: false});
    }
    AgreeEmailChange(e) {
        this.setState({ AgreeEmail: document.getElementById(this.props.configSettings.formSettings.summaryFormName).agreeemail.checked, isError: false });
    }
    AgreeTermChange(e) {
        this.setState({ AgreeTerms: document.getElementById(this.props.configSettings.formSettings.summaryFormName).agreeterms.checked, isError: false });
    }
    AgreePqTermsChange(e) {
        this.setState({ AgreePqTerms: e.target.checked, isError: e.target.checked ? false : true });
        //this.setState({ AgreePqTerms: document.getElementById('agreePqTerms').checked, isError: false });
    }
    CBAgreePqTermsChange(e) {
        this.setState({ CBAgreePqTerms: e.target.checked, isError: e.target.checked ? false :  true });
        // alert(this.state.CBAgreePqTerms);
        //this.setState({ CBAgreePqTerms: document.getElementById('cb-agreePqTerms').checked, isError: false });
    }
    AgreeConsentChange(e) {
        this.setState({ AgreeConsent: document.getElementById(this.props.configSettings.formSettings.summaryFormName).agreeconsent.checked, isError: false });
    }
    GetIncludeFees(e) {
        this.setState({ IncludeFees: document.getElementById(this.props.configSettings.formSettings.summaryFormName).updatedLoanAmount.checked });
    }
    InitialClick(e) {
        let isValid = true;
        if (!this.state.FirstNameValue) { isValid = false; }
        if (!this.state.LastNameValue) { isValid = false; }
        if (!this.state.EmailValue) { isValid = false; }
        else if (!this.state.EmailValue.match(emailRegex)) {
            isValid = false;
        }
        if (isValid && this.state.EmailValue !== this.state.EmailChangedValue) {
            this.setState({ initialDisabled: false, EmailChangedValue: this.state.EmailValue, InCompleteEmailSent: true });
            // var payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.capitalizeFirstLetter(this.state.FirstNameValue)}&lastname=${this.capitalizeFirstLetter(this.state.LastNameValue)}&action=mandrill_incomplete&nonce=4109b2257c`;
            // SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);
        }
    }

    Submit(e) {
        e.preventDefault();
        if (!this.state.initialDisabled && this.ValidateInfo(true)) {
            var that = this;
            if(this.state.IsSummaryPageEdit)
                this.state.UpdatedData = this.getUpdatedData(this.props.PostDataFull);
            var payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.capitalizeFirstLetter(this.state.FirstNameValue)}&lastname=${this.capitalizeFirstLetter(this.state.LastNameValue)}&agreeemail=${this.state.AgreeEmail}&action=mandrill_complete&nonce=4109b2257c`;
            SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);
           
            that.setState({ showModal: true });
            var second = 0;
            if (window.presubmit !== undefined) window.presubmit();
            if (window._paq) {
                window._paq.push(['setCustomDimension', window.customDimensionId = 3, window.customDimensionValue = that.state.mpUniqueClickID]);
                window._paq.push(['setCustomDimension', window.customDimensionId = 8, window.customDimensionValue = that.state.mpUniqueClickID]);
                window._paq.push(['setCustomDimension', window.customDimensionId = 11, window.customDimensionValue = that.state.selectedEstimatedCreditScore]);
                window._paq.push(['setCustomDimension', window.customDimensionId = 12, window.customDimensionValue = that.state.AnnualIncomeValue]);
                window._paq.push(['setCustomDimension', window.customDimensionId = 14, window.customDimensionValue = that.props.affiliateid ? that.props.affiliateid : null]);
                window._paq.push(['setCustomDimension', window.customDimensionId = 19, window.customDimensionValue = this.props.affiliateid ? this.props.affiliateid === '426464' ? 'AcquireInteractive' : this.props.affiliateid : 'Affiliate Application']);
                window._paq.push(['trackEvent', 'PLPQ', 'PLPQ App Submit', this.props.affiliateid ? this.props.affiliateid === '426464' ? 'AcquireInteractive' : this.props.affiliateid : 'Affiliate Application']);
            }
            var x = setInterval(function () {
                //that.setState({loaderCheck : second });
                if (second < 1) {
                    if (!that.state.IsFormSubmitted) {
                        //if(window.loadanimation !== undefined) window.loadanimation();  
                        
                        document.getElementById(that.props.configSettings.formSettings.name).submit();

                        //document.getElementById(this.props.configSettings.formSettings.summaryFormName).submit();
                        that.setState({ IsFormSubmitted: true });
                        window.scrollTo(0, 0);

                    }
                    // if(!that.state.IsFormSubmitted) {
                    //     document.getElementById(this.props.configSettings.formSettings.summaryFormName).submit();
                    //     that.setState({ IsFormSubmitted: true });                                
                    //     window.scrollTo(0, 0);
                    //     //that.setState({ showModal : true});
                    // }                                       
                }
                second++;
                //if(second === 6) { document.getElementById('load-3').style.display = "block"; }
                //if(second === 8) { document.getElementById('load-4').style.display = "block"; }
                if (second > 5 && second <= 10) {
                    //that.state.loaderContent = 'We\'re still checking...';
                    that.setState({ loaderContent: 'We\'re still checking...' });
                }
                if (second > 10 && second <= 15) {
                    //that.state.loaderContent = 'Thank you for your patience...';
                    that.setState({ loaderContent: 'Thank you for your patience...' });
                }
                if (second > 15) {
                    //that.state.loaderContent ='Just a few moments longer....';
                    that.setState({ loaderContent: 'Just a few moments longer....' });
                    clearInterval(x);
                }
            }, 1000);
            // }else {                    
            //     document.getElementById("wptime-plugin-preloader").style.display = "block";
            //     document.getElementById("wptime-plugin-preloader").style.background = "url(https://dev.primerates.com/wp-content/plugins/the-preloader/images/preloader.GIF) no-repeat #fff 50%";
            //     document.getElementById("span-txt").style.display = "block";
            //     window.scrollTo(0, 0);
            //     if(!((this.state.IsIntercom || this.state.IsIntercomEdit) && this.state.selectedEstimatedCreditScore === '350-619')) {
            //         document.getElementById(this.props.configSettings.formSettings.summaryFormName).submit();
            //     }
            //     else {
            //         window.location.href = this.props.configSettings.intercomRedirectUrl;
            //     }
            //     if(this.state.IsIntercom || this.state.IsIntercomEdit) { window.intercom(); }
            //     this.setState({ showModal : true});
            //     //that.setState({ showModal : true});
            // }    

        }
    }
    getGUID() {
        var prGUID = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i === 8 || i === 12 || i === 16 || i === 20) {
                prGUID += "-"
            }
            prGUID += (i === 12 ? 4 : (i === 16 ? ((random & 3) | 8) : random)).toString(16);
        }
        return prGUID;
    }
    // FirstWordCapital(value) {
    //     return value.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
    // }
    ValidateInfo(checkAllFields) {
        if (!this.state.initialDisabled) {
            let isValid = true;
            if (!this.state.FirstNameValue) { this.setState({ isFirstNameValid: false }); isValid = false; } else { this.setState({ FirstNameValue: this.capitalizeFirstLetter(this.state.FirstNameValue) }); }
            if (!this.state.LastNameValue) { this.setState({ isLastNameValid: false }); isValid = false; } else { this.setState({ LastNameValue: this.capitalizeFirstLetter(this.state.LastNameValue) }); }
            if (!this.state.EmailValue) { this.setState({ isEmailValid: false }); isValid = false; } else if (this.state.EmailValue.match(emailRegex)) {
                this.setState({ isEmailValid: true, showEmailError: true });
            } else { this.setState({ isEmailValid: true, showEmailError: false }); isValid = false; }

            if (!this.state.StreedAddressValue) { this.setState({ isStreedAddressValid: false }); isValid = false; }
            if (!this.state.CityValue) { this.setState({ isCityValid: false }); isValid = false; }
            // else {
            //     isValid = this.cityValidation();
            // }
            if (!this.state.ZipcodeValue) { this.setState({ isZipcodeValid: false }); isValid = false; } else if (this.state.ZipcodeValue.length < 5) {
                this.setState({ isZipcodeValid: true, showZipcodeError: false }); isValid = false;
            }
            // else { 
            //     isValid = this.zipcodeValidation();
            //     //this.setState({isZipcodeValid : true, showZipcodeError: true}); 
            // }
            if (!this.state.BirthdateValue) { this.setState({ isBirthdateValid: false }); isValid = false; } else {
                if (this.state.BirthdateValue.length < 10) {
                    this.setState({ isBirthdateValid: false, showBirthdateError: true }); isValid = false;
                }
                else {
                    const age = calculateAge(new Date(this.state.BirthdateValue), new Date());
                    if (age < 18 || isNaN(age)) {
                        this.setState({ isBirthdateValid: true, showBirthdateError: false });
                        isValid = false;
                    } else {
                        this.setState({ isBirthdateValid: true, showBirthdateError: true });
                    }
                }
            }
            if (!this.state.AnnualIncomeValue) { this.setState({ isAnnualIncomeValid: false }); isValid = false; } else {
                let annualIncome = unFormatAmount(this.state.AnnualIncomeValue);
                if (annualIncome < constantVariables.annualIncomeMin || annualIncome > constantVariables.annualIncomeMax) {
                    this.setState({ isAnnualIncomeValid: true, showAnnualIncomeMinError: false }); isValid = false;
                } else {
                    this.setState({ isAnnualIncomeValid: true, showAnnualIncomeMinError: true, PlainAnnualIncome: annualIncome });
                }
            }
            if (!this.state.PhoneNumberValue) { this.setState({ isPhoneNumberValid: false }); isValid = false; }
            else {
                if (!this.PhoneValidation(this.state.PhoneNumberValue))
                    isValid = false;
                //isValid = this.state.showPhoneNumberError;
            }
            // if (!this.state.SecondaryPhoneNumberValue) { this.setState({ isPhoneNumberValid: false }); isValid = false; }
            // else {
            //     if (!this.PhoneValidation(this.state.SecondaryPhoneNumberValue))
            //         isValid = false;
            //     //isValid = this.state.showPhoneNumberError;
            // }
            if (!this.state.ProvideSSNValue && !this.state.IsAcquireInteractive) { this.setState({ isProvideSSNValid: false }); isValid = false; } else {
                if (checkAllFields || !this.state.IsAcquireInteractive) {
                    this.setState({ isProvideSSNValid: true });
                    if (this.state.ProvideSSNValue.length !== 11 && !this.state.IsSummaryPageEdit) { this.setState({ showProvideSSNError: false }); isValid = false; }
                    else {
                        // if (!IsSSNGroupValid(this.state.ProvideSSNValue)) {
                        //     this.setState({ showProvideSSNError: false }); isValid = false;
                        // } else {
                        //     this.setState({ showProvideSSNError: true });
                        // }
                        this.setState({ showProvideSSNError: true });
                    }
                }
            }
            if(!this.state.EditEndDateCheckBoxChecked) {
                let endDate = this.state.EndDateValue;
                if (!endDate) {
                    this.setState({
                        isEndDateValid: false,
                         showEndDateError: true
                    });
                    isValid = false;
                } else {
                    endDate = endDate.replace(/_/g, '');
                    if (endDate.length < 10) {
                        this.setState({
                            isEndDateValid: true,
                            showEndDateError: false,
                            showDOBMessage: 'Please enter a valid date'
                        });
                        isValid = false;
                    } else {
                        const message = checkValidDate(endDate);
                        if (message === '') {
                            const futureDate = isFutureDate(endDate);
                            if (futureDate) {
                                this.setState({
                                    isEndDateValid: true,
                                    showEndDateError: false,
                                    showDOBMessage: 'Future date is not allowed'
                                });
                                isValid = false;
                            } 
                        } else {
                            this.setState({
                                isEndDateValid: true,
                                showEndDateError: false,
                                showDOBMessage: `Please provide valid ${message}`
                            });
                            isValid = false;
                        }
                    }    
                } 
            } else {
                this.setState({
                    isEndDateValid: true,
                    showEndDateError: true,
                    showEndDateMessage: '',
                    showErrorMessage:''
                // showEndDateError: false
                });
            }

            if (this.state.selectedState === 'Select') { this.setState({ isStateValid: false }); isValid = false; }
            // if (this.state.selectedHousing === 'Select') { this.setState({ isHousingValid: false }); isValid = false; }
            // if (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage') {
            //     if (!this.state.HousingPaymentValue) { this.setState({ isHousingPaymentValid: false, housingPaymentDisabled: false }); isValid = false; }
            //     else { this.setState({ isHousingPaymentValid: true }); }
            // }
            // if (this.state.selectedEmployment === 'Select') { this.setState({ isEmploymentValid: false }); isValid = false; }
            // if ((checkAllFields || this.state.IsAcquireInteractive) && this.state.selectedEstimatedCreditScore === 'Select') { this.setState({ isEstimatedCreditScoreValid: false }); isValid = false; }
            // if (this.state.selectedTimeAtCurrentAddress === 'Select') { this.setState({ isTimeAtCurrentAddressValid: false }); isValid = false; }

            // if (!this.state.EmployerNameValue) { this.setState({ isEmployerNameValid: false }); isValid = false; } else { this.setState({ EmployerNameValue: this.capitalizeFirstLetter(this.state.EmployerNameValue) }); }
            // if (!this.state.PositionValue) { this.setState({ isPositionValid: false }); isValid = false; } else { this.setState({ PositionValue: this.capitalizeFirstLetter(this.state.PositionValue) }); }
            // if(!this.state.StartDateValue) { this.setState({isStartDateValid:false});  isValid = false;} else { this.setState({StartDateValue: this.state.StartDateValue }); }
            // if(!this.state.EndDateValue) { this.setState({isEndDateValid:false});  isValid = false;} else { this.setState({EndDateValue: this.state.EndDateValue }); }
            // if (!this.state.EmployerAddress1Value) { this.setState({ isEmployerAddress1Valid: false }); isValid = false; }
            // if (!this.state.EmployerAddress1CityValue) { this.setState({ isEmployerAddress1CityValid: false }); isValid = false; }
            // if (!this.state.EmployerPhoneNumberValue) { this.setState({ isEmployerPhoneNumbervalid: false }); isValid = false; }
            // else {
            //     if (!this.PhoneValidation(this.state.EmployerPhoneNumberValue))
            //         isValid = false;
            //     //isValid = this.state.showPhoneNumberError;
            // }

            // // else {
            // //     isValid = this.cityValidation();
            // // }
            // if (!this.state.EmployerAddress1ZipcodeValue) { this.setState({ isEmployerAddress1ZipcodeValid: false }); isValid = false; } else if (this.state.EmployerAddress1ZipcodeValue.length < 5) {
            //     this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: false }); isValid = false;
            // }

            if (checkAllFields) {
                let isAgreePqTerms = false;
                let isCBAgreePqTerms = false;
                let coborrowerExist = this.props.PostDataFull.borrowers.length > 1 ? true : false;
                isAgreePqTerms = document.getElementById('brAgreePqTerms').checked;
                if (!isAgreePqTerms) { this.setState({ AgreePqTerms: false}); isValid = false; } else { this.setState({ AgreePqTerms: true }) }
                if(coborrowerExist) {
                    isCBAgreePqTerms = document.getElementById('cb-agreePqTerms').checked;
                    if (!isCBAgreePqTerms) { this.setState({ CBAgreePqTerms: false}); isValid = false; }
                     else 
                    { this.setState({ CBAgreePqTerms: true}); }
                    if(!isAgreePqTerms && !isCBAgreePqTerms  ) {
                        this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions' });
                    } else if(!isAgreePqTerms && isCBAgreePqTerms){
                        this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions for Borrower' });
                    } else if(isAgreePqTerms && !isCBAgreePqTerms){
                        this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions for Co-borrower' });
                    }
                } else {
                    if(!isAgreePqTerms){
                        this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions for Borrower' });
                    }
                }
               

                
                
                // if ( this.state.isEstimatedCreditScoreValid && this.state.isLoanPurposeValid && !this.state.AgreePqTerms && !this.state.CBAgreePqTerms && this.props.currentDevice === 'Mobile') {
                //     this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions' });
                // }
            }

            
            // if(!this.state.AgreePqTerms){
            //     this.setState({IntercomErrorMessage: 'Please agree to terms and conditions for Borrower'});
            // }
            // if(!this.state.CBAgreePqTerms){
            //     this.setState({IntercomErrorMessage: 'Please agree to terms and conditions for Co-Borrower'});
            // }



            if (isValid) {
                this.setState({ isError: false });
            }
            else {
                this.setState({ isError: true });
            }
            return isValid;
        }
    }
    handleFirstNameChange(isFocus, event) {
        let fname = event.target.value;
        if (allLetter(fname)) {
            this.setState({ FirstNameValue: fname, isFirstNameValid: true, isError: false });
            if (!isFocus) {
                if (!fname) { this.setState({ isFirstNameValid: false }); }
                else { this.setState({ isFirstNameValid: true }); }
            }
        }
    }
    handleEmployerNameChange(isFocus, event) {
        let employername = event.target.value;
        // if (allLetter(employername)) {
        this.setState({ EmployerNameValue: employername, isEmployerNameValid: true, isError: false });
        if (!isFocus) {
            if (!employername) { this.setState({ isEmployerNameValid: false }); }
            else { this.setState({ isEmployerNameValid: true }); }
        }
        //  }
    }
    handlePositionChange(isFocus, event) {
        let pos = event.target.value;
        //if (allLetter(pos)) {
        this.setState({ PositionValue: pos, isPositionValid: true, isError: false });
        if (!isFocus) {
            if (!pos) { this.setState({ isPositionValid: false }); }
            else { this.setState({ isPositionValid: true }); }
        }
        //  }
    }
    handleStartDateChange(isFocus, event) {
        // let startDate = event.target.value;
        // if(allLetter(startDate)) {
        //     this.setState({ StartDateValue: startDate, isStartDateValid : true, isError: false });
        //     if(!isFocus) {  
        //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
        //         CallGAEvent("Start Date","FocusOut");
        //         if(!startDate) {  this.setState({isStartDateValid : false}); } 
        //         else {  this.setState({isStartDateValid : true});   }
        //     }else {
        //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
        //         CallGAEvent("Start Date","FocusIn");
        //     }
        // }
        let startDate = event.target.value;
        this.setState({ StartDateValue: startDate, isStartDateValid: true, showStartDateError: true, isError: false, showDOBMessage: '' });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("StartDate", "FocusOut");
            if (!startDate) { this.setState({ isStartDateValid: false, showStartDateError: true }); }
            else {
                startDate = startDate.replace(/_/g, '');
                if (startDate.length < 10) {
                    this.setState({ isStartDateValid: false, showStartDateError: false, showDOBMessage: 'Please enter a valid date' });
                }
                else {
                    const message = checkValidDate(startDate);
                    if (message === '') {
                        const futureDate = isFutureDate(startDate);
                        if (futureDate) {
                            this.setState({ isStartDateValid: true, showStartDateError: false, showDOBMessage: 'Future date is not allowed' });
                        } else {
                            if (this.state.EndDateValue.length > 0) {
                                //var difference = compareTwoDates(startDate, this.state.EndDateValue);
                                // if(difference < 0) {
                                //     alert('start date can not be greater then end date');
                                // } else if(difference < 3) {
                                //     alert('employment history needs atleast for 3 years');
                                // }                                  
                                // else {
                                //     alert(` you have total ${parseInt(difference)} experience`);
                                // }                            
                                this.setState({ isStartDateValid: true, showStartDateError: true });
                            }
                        }
                    }
                    else { this.setState({ isStartDateValid: true, showStartDateError: false, showDOBMessage: `Please provide valid ${message}` }); }
                }
            }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("StartDate", "FocusIn");
        }
    }
    handleEndDateChange(isFocus, event) {

        let endDate = event.target.value;
        this.setState({ EndDateValue: endDate, isEndDateValid: true, showEndDateError: true, isError: false, showDOBMessage: '' });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("endDate", "FocusOut");
            if (!endDate) { this.setState({ isEndDateValid: false, showEndDateError: true }); }
            else {
                endDate = endDate.replace(/_/g, '');
                if (endDate.length < 10) {
                    this.setState({ isEndDateValid: false, showEndDateError: false, showDOBMessage: 'Please enter a valid date' });
                }
                else {
                    const message = checkValidDate(endDate);
                    if (message === '') {
                        const futureDate = isFutureDate(endDate);
                        if (futureDate) {
                            this.setState({ isEndDateValid: true, showEndDateError: false, showDOBMessage: 'Future date is not allowed' });
                        } else {
                            if (this.state.EndDateValue.length > 0) {
                                //var difference = compareTwoDates(endDate, this.state.EndDateValue);
                                // if(difference < 0) {
                                //     alert('start date can not be greater then end date');
                                // } else if(difference < 3) {
                                //     alert('employment history needs atleast for 3 years');
                                // }                                  
                                // else {
                                //     alert(` you have total ${parseInt(difference)} experience`);
                                // }                            
                                this.setState({ isEndDateValid: true, showEndDateError: true });
                            }
                        }
                    }
                    else { this.setState({ isEndDateValid: true, showEndDateError: false, showDOBMessage: `Please provide valid ${message}` }); }
                }
            }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("endDate", "FocusIn");
        }
    }

    // handleEndDateCheckBoxEvent(isFocus, event) {

    //     let endDateDisabled = event.target.checked;
    //     this.setState({ EndDateCheckBoxChecked: event.target.checked, EndDateDisabled: endDateDisabled, isEndDateValid: true, isError: false });
    //     // if(allLetter(endDate)) {
    //     //     this.setState({ EndDateValue: endDate, isEndDateValid : true, isError: false });
    //     //     if(!isFocus) {  
    //     //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
    //     //         CallGAEvent("End Date","FocusOut");
    //     //         if(!endDate) {  this.setState({isEndDateValid : false}); } 
    //     //         else {  this.setState({isEndDateValid : true});   }
    //     //     }else {
    //     //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
    //     //         CallGAEvent("End Date","FocusIn");
    //     //     }
    //     // }
    // }
   
    handleEndDateCheckBoxEvent(isFocus, event) {
       
        // this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate ? false : 'true'
        let endDateDisabled = event.target.checked;  
        this.setState({ EditEndDateCheckBoxChecked: event.target.checked, EndDateValue : endDateDisabled ? '' : this.state.EndDateValue, EndDateDisabled: endDateDisabled, isEndDateValid: true, isError: false });
        if(endDateDisabled) {
            this.setState({
                isEndDateValid: true,
                showEndDateError: true,
                showEndDateMessage: '',
                showErrorMessage:''
            // showEndDateError: false
            });
        }
     }


    handleEmployerAddress1Change(isFocus, event) {
        if (!this.state.initialDisabled) {
            let employerAddress1 = event.target.value;
            this.setState({ EmployerAddress1Value: employerAddress1, isEmployerAddress1Valid: true, isError: false, showAddressMessage: '', showEmployerAddress1Error: true });
            if (!isFocus) {
                if (!employerAddress1) { this.setState({ isEmployerAddress1Valid: false }); }
                else if (this.handlePOBoxAddress(employerAddress1)) {
                    this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showEmployerAddress1Error: false });
                }
                else { this.setState({ isEmployerAddress1Valid: true }); }
            }
        }
    }
    handleEmployerAddress2Change(isFocus, event) {
        let apptAddress = event.target.value;
        this.setState({ EmployerAddress2Value: apptAddress });
        if (!isFocus) {
            CallGAEvent("Apartment", "FocusOut");
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("Apartment", "FocusIn");
        }
    }
    handleEmployerAddress1CityChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let employerCity = event.target.value;
            //  if (allLetter(employerCity)) {
            this.setState({ EmployerAddress1CityValue: employerCity, isEmployerAddress1CityValid: true, isError: false });
            if (!isFocus) {
                CallGAEvent("Work Address City", "FocusOut");
                if (!employerCity) { this.setState({ isEmployerAddress1CityValid: false }); }
                else {
                    if (this.state.EmployerAddress1StateValue !== 'Select' && this.state.EmployerAddress1ZipcodeValue && this.state.EmployercityChnagedvalue !== employerCity) {
                        this.ValidateEmployerCityStateZip(true);
                        this.setState({ EmployercityChnagedvalue: employerCity });
                    } else {
                        this.setState({ isEmployerAddress1CityValid: true });
                    }
                }

            } else { CallGAEvent("Work Address City", "FocusIn"); }

        }
    }
    handleEmployerAddress1ZipcodeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let employerZipCode = GetZipcodeMask(event.target.value);
            this.setState({ EmployerAddress1ZipcodeValue: employerZipCode, isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true, isError: false });
            if (!isFocus) {
                CallGAEvent("employerzipCode", "FocusOut");
                if (!employerZipCode) { this.setState({ isEmployerAddress1ZipcodeValid: false, showEmployerAddress1ZipcodeError: true }); } else {
                    if (employerZipCode.length < 5) {
                        this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: false });
                    } else {
                        if (this.state.EmployerAddress1StateValue !== 'Select' && this.state.EmployerAddress1CityValue && this.state.EmployerZipcodeChangedValue !== employerZipCode) {
                            this.ValidateEmployerCityStateZip(true);
                            this.setState({ EmployerZipcodeChangedValue: employerZipCode });
                        } else {
                            this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true });
                        }
                        //this.setState({isZipcodeValid : true, showZipcodeError: true});
                    }
                }
            } else {
                CallGAEvent("employerzipCode", "FocusIn");
            }
        }
    }
    handleEmployerAddress1StateChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const employerState = event.target.value; //event.target.attributes['react-value'].value;
            //const oldState = this.state.selectedState;
            this.setState({ EmployerAddress1StateValue: employerState, isEmployerAddress1StateValid: true, isError: false, showLoanAmountMinError: true });

            if (!isFocus) {
                CallGAEvent("employerState", "FocusOut");
                if (employerState === 'Select') { this.setState({ isEmployerAddress1StateValid: false }); } else {
                    if (this.state.EmployerAddress1ZipcodeValue && this.state.EmployerAddress1CityValue && this.state.EmployerselectedStateChanged !== employerState) {
                        this.ValidateEmployerCityStateZip(true);
                        this.setState({ isEmployerAddress1StateValid: true, EmployerselectedStateChanged: employerState });
                    } else {
                        this.setState({ isEmployerAddress1StateValid: true });
                    }
                }
            }
            else {
                CallGAEvent("employerState", "FocusIn");
            }
        }
    }
    employershowHideStateList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onemployerStateClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isEmployerAddress1StateValid: true });
            //this.setState((prevState) => ({ displayStateItems: !prevState.displayStateItems }));
        }
    }
    getemployerStateLabel(key) {
        const EmployerAddress1StateValue = stateList.filter((employerState) => {
            return employerState.key === key;
        });
        return EmployerAddress1StateValue[0] ? EmployerAddress1StateValue[0].label : null;
    }

    // handleEmployerAddress1ZipcodeChange(isFocus, event) {
    //     if (!this.state.initialDisabled) {
    //     let employerZipCode = event.target.value;
    //     //if (allLetter(employerZipCode)) {
    //         this.setState({ EmployerAddress1ZipcodeValue: employerZipCode, isEmployerAddress1ZipcodeValid: true, isError: false });
    //         if (!isFocus) {
    //             //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
    //             CallGAEvent("Work Address Zipcode", "FocusOut");
    //             if (!employerZipCode) { this.setState({ isEmployerAddress1ZipcodeValid: false }); }
    //             else { this.setState({ isEmployerAddress1ZipcodeValid: true }); }
    //         } else {
    //             //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
    //             CallGAEvent("Work Address Zipcode", "FocusIn");
    //         }
    //     }
    // }
    employerstateValidation() {
        if (this.state.EmployerAddress1StateValue) {
            if (this.state.employerstateCodeArray.indexOf(this.state.EmployerAddress1StateValue.toLowerCase()) > -1) {
                this.setState({ isEmployerAddress1StateValid: true, showEmployerAddress1CityError: true });
                return true;
            }
            else {
                this.setState({ isEmployerAddress1StateValid: true, showEmployerAddress1CityError: false });
                return false;
            }
        }
    }
    employercityValidation() {
        if (this.state.EmployerAddress1CityValue) {
            if (this.state.employercityCodeArray.indexOf(this.state.EmployerAddress1CityValue.toLowerCase()) > -1) {
                this.setState({ isEmployerAddress1CityValid: true, showEmployerAddress1CityError: true });
                return true;
            }
            else {
                this.setState({ isEmployerAddress1CityValid: true, showEmployerAddress1CityError: false });
                return false;
            }
        }
    }
    employerzipcodeValidation() {
        if (this.state.EmployerAddress1ZipcodeValue) {
            if (this.state.employerzipCodeArray.indexOf(this.state.EmployerAddress1ZipcodeValue) > -1) {
                this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true });
                return true;
            }
            else {
                this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: false });
                return false;
            }
        }

    }

    getEmployerZipCodeByCityState() {
        var apiEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
        return axios.get(`${apiEndpoint}${encodeURIComponent(this.state.StreedAddressValue)},${encodeURIComponent(this.state.EmployerAddress1CityValue)},${encodeURIComponent(this.state.EmployerAddress1StateValue)}&key=${this.props.ThemeConfig.googleAPIKey}`);
    }
    ValidateEmployerCityStateZip(isCity) {
        var promise = this.getEmployerZipCodeByCityState();
        var postalCodes = [];
        var cityCodes = [];
        var stateCodes = [];
        this.setState({ employerzipCodeArray: postalCodes, employercityCodeArray: cityCodes, employerstateCodeArray: stateCodes });
        promise.then(response => {
            if (response.data !== undefined) {
                if (response.data.results !== undefined && response.data.results.length > 0) {
                    let address_components = response.data.results[0].address_components;
                    if (address_components !== undefined) {
                        address_components.forEach(address => {
                            if (address.types.indexOf('locality') >= 0) {
                                //Add zipcode into list.
                                cityCodes.push(address.short_name.toLowerCase());
                            }
                            if (address.types.indexOf('postal_code') >= 0) {
                                //Add zipcode into list.
                                postalCodes.push(address.short_name.toLowerCase());
                            }
                            if (address.types.indexOf('administrative_area_level_1') >= 0) {
                                stateCodes.push(address.long_name.toLowerCase());
                            }
                        });
                    }
                }
                this.employerzipcodeValidation();
                this.employercityValidation();
                this.employerstateValidation();
            }
        });
        this.setState({ employerzipCodeArray: postalCodes, employercityCodeArray: cityCodes, employerstateCodeArray: stateCodes });

    };


    //     handleEmployerAddress1StateChange(isFocus, event) {
    //         if (!this.state.initialDisabled) {
    //         let employerState = event.target.value;
    //        // if (allLetter(employerState)) {
    //             this.setState({ EmployerAddress1StateValue: employerState, isEmployerAddress1StateValid: true, isError: false });
    //             if (!isFocus) {
    //                 //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
    //                 CallGAEvent("Work Address State", "FocusOut");
    //                 if (!employerState) { this.setState({ isEmployerAddress1StateValid: false }); }
    //                 else { this.setState({ isEmployerAddress1StateValid: true }); }
    //             } else {
    //                 //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
    //                 CallGAEvent("Work Address State", "FocusIn");
    //             }
    //         }
    //    // }
    // }






    handleWorkPhonenumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let employerPhoneNumber = event.target.value;// GetPhoneMask(event.target.value);
            this.setState({
                EmployerPhoneNumberValue: employerPhoneNumber, isEmployerPhoneNumbervalid: true,
                showEmployerPhoneNumberCodeError: true,
                showEmployerphonenumberError: true, isError: false
            });
            if (!isFocus) {
                this.EmployerPhoneValidation(employerPhoneNumber);
            }
        }
    }
    EmployerPhoneValidation(employerPhoneNumber) {
        let isValid = true;
        if (!employerPhoneNumber) { this.setState({ isEmployerPhoneNumbervalid: false, showEmployerphonenumberError: true, showEmployerPhoneNumberCodeError: true }); }
        else {
            var isValidAreacode = IsValidAreaCode(employerPhoneNumber);
            if (isValidAreacode) {
                var isValidPhone = IsPhoneNumberValid(employerPhoneNumber);
                if (!isValidPhone) {
                    this.setState({
                        isEmployerPhoneNumbervalid: true,
                        showEmployerPhoneNumberCodeError: true,
                        showEmployerphonenumberError: false
                    });
                    isValid = false;
                }
                else {
                    this.setState({
                        isEmployerPhoneNumbervalid: true,
                        showEmployerPhoneNumberCodeError: true,
                        showEmployerphonenumberError: true
                    });
                }
            }
            else {
                this.setState({
                    isEmployerPhoneNumbervalid: true,
                    showEmployerPhoneNumberCodeError: false,
                    showEmployerphonenumberError: true
                });
                isValid = false;
            }
        }
        if (isValid) {
            var promise = this.getEmployerPhoneNumberValidate();
            promise.then(response => {
                if (response.data !== undefined) {
                    isValid = response.data.valid;
                    if (!isValid) {
                        this.setState({
                            isEmployerPhoneNumbervalid: true,
                            showEmployerPhoneNumberCodeError: true,
                            showEmployerphonenumberError: false
                        });
                        isValid = false;
                    }
                }
            });
        }
        return isValid;
    }
    getEmployerPhoneNumberValidate() {
        var apiEndpoint = `https://apilayer.net/api/validate?access_key=${this.props.ThemeConfig.phoneNumberAPIKey}&number=1${unMaskPhone(this.state.EmployerPhoneNumberValue)}`;
        return axios.get(`${apiEndpoint}`);
    }






    handleLastNameChange(isFocus, event) {
        let lname = event.target.value;
        if (allLetter(lname)) {
            this.setState({ LastNameValue: lname, isLastNameValid: true, isError: false });
            if (!isFocus) {
                if (!lname) { this.setState({ isLastNameValid: false }); }
                else { this.setState({ isLastNameValid: true }); }
            }
        }
    }

    handleEmailChange(isFocus, event) {
        let email = event.target.value;
        this.setState({ EmailValue: email, isEmailValid: true, showEmailError: true, emailFocus: isFocus, isError: false });
        if (!isFocus) {
            if (!email) { this.setState({ isEmailValid: false, showEmailError: true }); } else {
                if (email.match(emailRegex)) {
                    this.setState({ isEmailValid: true, showEmailError: true });
                    this.InitialClick();
                } else {
                    this.setState({ isEmailValid: true, showEmailError: false });
                }
            }
        }
    }
    handleStreedAddressChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let streetAddress = event.target.value;
            this.setState({ StreedAddressValue: streetAddress, isStreedAddressValid: true, isError: false, showAddressMessage: '', showStreedAddressError: true });
            if (!isFocus) {
                if (!streetAddress) { this.setState({ isStreedAddressValid: false }); }
                else if (this.handlePOBoxAddress(streetAddress)) {
                    this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showStreedAddressError: false });
                }
                else { this.setState({ isStreedAddressValid: true }); }
            }
        }
    }
    handlePOBoxAddress(address) {
        let hasPOBox = false;
        if (address) {
            let currentAddress = address.toLowerCase();
            const poBoxAddress = POBox.filter((element) => {
                return currentAddress.indexOf(element.value) > -1;
            });
            if (poBoxAddress.length > 0) {
                hasPOBox = true;
            }
        }
        return hasPOBox;
    }
    handleApptChange(isFocus, event) {
        let apptAddress = event.target.value;
        this.setState({ ApptValue: apptAddress });
    }
    handleCityChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let city = event.target.value;
            this.setState({ CityValue: city, isCityValid: true, isError: false });
            if (!isFocus) {
                if (!city) { this.setState({ isCityValid: false }); }
                else {
                    //this.setState({isCityValid : true});
                    if (this.state.selectedState !== 'Select' && this.state.ZipcodeValue && this.state.CityChangedValue !== city) {
                        this.ValidateCityStateZip(true);
                        this.setState({ CityChangedValue: city });
                    } else {
                        this.setState({ isCityValid: true });
                    }
                }
            }
        }
    }
    stateValidation() {
        if (this.state.selectedState) {
            if (this.state.stateCodeArray.indexOf(this.state.selectedState.toLowerCase()) > -1) {
                this.setState({ isStateValid: true, showCityError: true });
                return true;
            }
            else {
                this.setState({ isStateValid: true, showCityError: false });
                return false;
            }
        }
    }
    cityValidation() {
        if (this.state.CityValue) {
            if (this.state.cityCodeArray.indexOf(this.state.CityValue.toLowerCase()) > -1) {
                this.setState({ isCityValid: true, showCityError: true });
                return true;
            }
            else {
                this.setState({ isCityValid: true, showCityError: false });
                return false;
            }
        }
    }
    zipcodeValidation() {
        if (this.state.ZipcodeValue) {
            if (this.state.zipCodeArray.indexOf(this.state.ZipcodeValue) > -1) {
                this.setState({ isZipcodeValid: true, showZipcodeError: true });
                return true;
            }
            else {
                this.setState({ isZipcodeValid: true, showZipcodeError: false });
                return false;
            }
        }

    }
    handleZipcodeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let zipcode = GetZipcodeMask(event.target.value);
            this.setState({ ZipcodeValue: zipcode, isZipcodeValid: true, showZipcodeError: true, isError: false });
            if (!isFocus) {
                if (!zipcode) { this.setState({ isZipcodeValid: false, showZipcodeError: true }); } else {
                    if (zipcode.length < 5) {
                        this.setState({ isZipcodeValid: true, showZipcodeError: false });
                    } else {
                        if (this.state.selectedState !== 'Select' && this.state.CityValue && this.state.ZipcodeChangedValue !== zipcode) {
                            this.ValidateCityStateZip(true);
                            this.setState({ ZipcodeChangedValue: zipcode });
                        } else {
                            this.setState({ isZipcodeValid: true, showZipcodeError: true });
                        }
                        //this.setState({isZipcodeValid : true, showZipcodeError: true});
                    }
                }
            }
        }
    }
    handleBirthdateChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let birthdate = event.target.value;// GetDateMask(event.target.value);
            this.setState({ BirthdateValue: birthdate, isBirthdateValid: true, showBirthdateError: true, isError: false, showDOBMessage: '' });
            if (!isFocus) {
                if (!birthdate) { this.setState({ isBirthdateValid: false, showBirthdateError: true }); }
                else {
                    if (birthdate.length < 10) {
                        this.setState({ isBirthdateValid: false, showBirthdateError: true });
                    }
                    else {
                        const message = checkValidDate(birthdate);
                        if (message === '') {
                            const futureDate = isFutureDate(birthdate);
                            if (futureDate) {
                                this.setState({ isBirthdateValid: true, showBirthdateError: false, showDOBMessage: 'Future date is not allowed' });
                            } else {
                                const age = calculateAge(new Date(birthdate), new Date());
                                if (age > 100) {
                                    this.setState({ isBirthdateValid: true, showBirthdateError: false, showDOBMessage: 'Invalid birth date' });
                                } else
                                    if (age < 18 || isNaN(age)) {
                                        this.setState({ isBirthdateValid: true, showBirthdateError: false, showDOBMessage: '' });
                                    } else {
                                        this.setState({ isBirthdateValid: true, showBirthdateError: true });
                                    }
                            }
                        }
                        else { this.setState({ isBirthdateValid: true, showBirthdateError: false, showDOBMessage: `Please provide valid ${message}` }); }
                    }
                }
            }
        }
    }
    IsValidBirthdate(birthdate) {
        let isValid = false;
        if (birthdate.length < 10) {
            this.setState({ isBirthdateValid: false, showBirthdateError: true });
        }
        else {
            const message = checkValidDate(birthdate);
            if (message === '') {
                const age = calculateAge(new Date(birthdate), new Date());
                if (age > 100) {
                    this.setState({ isBirthdateValid: true, showBirthdateError: false, showDOBMessage: 'Invalid birth date' });
                } else
                    if (age < 18 || isNaN(age)) {
                        this.setState({ isBirthdateValid: true, showBirthdateError: false, showDOBMessage: '' });
                    } else {
                        this.setState({ isBirthdateValid: true, showBirthdateError: true });
                        isValid = true;
                    }
            }
            else { this.setState({ isBirthdateValid: true, showBirthdateError: false, showDOBMessage: `Please provide valid ${message}` }); }
        }
        return isValid;
    }
    handleAnnualIncomeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let annualIncome = unFormatAmount(event.target.value);
            annualIncome = annualIncome.replace(/^0+/, '');
            //annualIncome = annualIncome.replace(/_/g, '');
            if (isValidInteger(annualIncome)) {
                this.setState({ AnnualIncomeValue: annualIncome, isAnnualIncomeValid: true, showAnnualIncomeMinError: true, annualIncomeFocus: isFocus, isError: false, showAIMessage: '' });
                if (!isFocus) {
                    this.setState({ AnnualIncomeValue: this.props.configSettings.fieldSettings.currencySymbol + AmountFormatting(annualIncome) });
                    if (!annualIncome) { this.setState({ isAnnualIncomeValid: false, showAnnualIncomeMinError: true }); }
                    else {
                        if (annualIncome < constantVariables.annualIncomeMin) {
                            this.setState({ isAnnualIncomeValid: true, showAnnualIncomeMinError: false, showAIMessage: '' });
                        } else if (annualIncome > constantVariables.annualIncomeMax) {
                            this.setState({ isAnnualIncomeValid: true, showAnnualIncomeError: false, showAnnualIncomeMinError: true, showAIMessage: 'Value may not exceed $10M' });
                        } else {
                            this.setState({ isAnnualIncomeValid: true, showAnnualIncomeError: true, showAnnualIncomeMinError: true, PlainAnnualIncome: annualIncome });
                        }
                    }
                }
            } else { this.setState({ isAnnualIncomeValid: true, showAnnualIncomeMinError: true }); }
        }
    }

    handleHousingPaymentChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let housingPayment = unFormatAmount(event.target.value);
            // housingPayment = housingPayment.replace(/_/g, '');
            if (isValidInteger(housingPayment)) {
                this.setState({ HousingPaymentValue: housingPayment, PlainHousingPayment: housingPayment, isHousingPaymentValid: true, showHousingPaymentMinError: true, housingPaymentFocus: isFocus, isError: false });
                if (!isFocus && !this.state.housingPaymentDisabled) {
                    this.setState({ HousingPaymentValue: this.props.configSettings.fieldSettings.currencySymbol + AmountFormatting(housingPayment) });
                    if (!housingPayment) { this.setState({ isHousingPaymentValid: false, showHousingPaymentMinError: true }); }
                }
            } else { this.setState({ isHousingPaymentValid: true, showHousingPaymentMinError: true }); }
        }
    }
    handlePhoneNumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let phoneNumber = event.target.value;// GetPhoneMask(event.target.value);
            this.setState({
                PhoneNumberValue: phoneNumber, isPhoneNumberValid: true,
                showPhoneNumberCodeError: true,
                showPhoneNumberError: true, isError: false
            });
            if (!isFocus) {
                this.PhoneValidation(phoneNumber);
            }
        }
    }

    handleSecondaryPhoneNumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let phoneNumber = event.target.value;
            let plainNumber = phoneNumber.replace(/\(/g, '').replace(/\)/g, '').replace(/_/g, '').replace(/-/g, '').replace(' ', '');
            this.setState({
                SecondaryPhoneNumberValue: phoneNumber, isSecondaryPhoneNumberValid: true,
                showSecondaryPhoneNumberCodeError: true,
                showSecondaryPhoneNumberError: true, isError: false
            });
            if (!isFocus) {
                CallGAEvent("SecondaryPhoneNumber", "FocusOut");

                if (plainNumber.length > 0 && plainNumber.length < 10) {
                    this.setState({
                        isSecondaryPhoneNumberValid: false,
                        showSecondaryPhoneNumberCodeError: true,
                        showSecondaryPhoneNumberError: false,
                        IsContinue: false
                    });
                } else if (plainNumber.length === 10) {
                    if (this.state.IsContinue || this.state.PreviousPhone !== phoneNumber) {
                        this.PhoneValidation(phoneNumber);
                    }
                }
                else {
                    this.setState({
                        isSecondaryPhoneNumberValid: true,
                        showSecondaryPhoneNumberCodeError: true,
                        showSecondaryPhoneNumberError: true,
                        IsContinue: true
                    });
                }

            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Secondary Phone Number", "FocusIn");
            }
            // if(plainNumber.length === 10 && (this.state.IsContinue || this.state.PreviousPhone !==  phoneNumber)) {
            //     this.PhoneValidationAPI(phoneNumber);
            // }
        }
    }
    PhoneValidation(phoneNumber) {
        let isValid = true;
        if (!phoneNumber) { this.setState({ isPhoneNumberValid: false, showPhoneNumberError: true, showPhoneNumberCodeError: true }); }
        else {
            var isValidAreacode = IsValidAreaCode(phoneNumber);
            if (isValidAreacode) {
                var isValidPhone = IsPhoneNumberValid(phoneNumber);
                if (!isValidPhone) {
                    this.setState({
                        isPhoneNumberValid: true,
                        showPhoneNumberCodeError: true,
                        showPhoneNumberError: false
                    });
                    isValid = false;
                }
                else {
                    this.setState({
                        isPhoneNumberValid: true,
                        showPhoneNumberCodeError: true,
                        showPhoneNumberError: true
                    });
                }
            }
            else {
                this.setState({
                    isPhoneNumberValid: true,
                    showPhoneNumberCodeError: false,
                    showPhoneNumberError: true
                });
                isValid = false;
            }
        }
        if (isValid) {
            var promise = this.getPhoneNumberValidate();
            promise.then(response => {
                if (response.data !== undefined) {
                    isValid = response.data.valid;
                    if (!isValid) {
                        this.setState({
                            isPhoneNumberValid: true,
                            showPhoneNumberCodeError: true,
                            showPhoneNumberError: false
                        });
                        isValid = false;
                    }
                }
            });
        }
        return isValid;
    }
    handleProvideSSNChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let provideSSN = event.target.value;
            this.setState({ ProvideSSNValue: provideSSN, isProvideSSNValid: true, showProvideSSNError: true, isError: false });
            let formData = document.getElementById(this.props.configSettings.formSettings.summaryFormName);
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("SSN", "FocusOut");
                provideSSN = provideSSN.replace(/_/g, '');
                if(formData && formData.ssn !== null && formData.ssn.length > 1) {
                    formData.ssn[0].type = "password";
                } else if(formData && formData.ssn !== null ) {
                    formData.ssn.type = "password";
                }
                
                if (!provideSSN) { this.setState({ isProvideSSNValid: false }); } else {
                    this.setState({ isProvideSSNValid: true });
                    if (provideSSN.length !== 11) { this.setState({ showProvideSSNError: false, isError: true }); }
                    else {
                        if (!IsSSNGroupValid(provideSSN)) {
                            this.setState({ showProvideSSNError: false });
                        } else {
                            this.setState({ showProvideSSNError: true });
                        }
                    }
                }
            }
            else {

                // CallGAEvent("SSN","FocusIn");
                
                if (formData && formData.ssn !== null && formData.ssn.length > 1 ) {
                    formData.ssn[0].type = "tel";
                } else if (formData && formData.ssn !== null) {
                    formData.ssn.type = "tel";
                }                
            }
        }
    }
    handleFocusIn(field, event) {
        CallGAEvent(field, "FocusIn");
    }
    handleLoanAmountChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            var loanAmount = unFormatAmount(event.target.value);
            loanAmount = loanAmount.replace(/^0+/, '');
            //loanAmount = loanAmount.replace(/_/g, '');
            if (isValidInteger(loanAmount)) {
                this.setState({ PlainLoanAmount: loanAmount, LoanAmountValue: loanAmount, isLoanAmountValid: true, showLoanAmountMinError: true, isError: false });

                if (!isFocus) {
                    this.setState({ LoanAmountValue: this.props.configSettings.fieldSettings.currencySymbol + AmountFormatting(loanAmount) });
                    if (!loanAmount) { this.setState({ isLoanAmountValid: false, showLoanAmountMinError: true }); } else {
                        var maxLoanAmount = constantVariables.loanAmountMax;
                        var minLoanAmount = constantVariables.loanAmountMin;

                        if (loanAmount < minLoanAmount || loanAmount > maxLoanAmount) {
                            this.setState({ isLoanAmountValid: true, showLoanAmountMinError: false });
                        } else {
                            this.setState({ isLoanAmountValid: true, showLoanAmountMinError: true, PlainLoanAmount: loanAmount });

                        }
                    }
                }
            } else { this.setState({ isLoanAmountValid: true, showLoanAmountMinError: true }); }
        }
    }
    //Select State  Dropdown event
    showHideStateList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onStateClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isStateValid: true });
            //this.setState((prevState) => ({ displayStateItems: !prevState.displayStateItems }));
        }
    }
    handleStateChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const states = event.target.value; //event.target.attributes['react-value'].value;
            //const oldState = this.state.selectedState;
            this.setState({ selectedState: states, isStateValid: true, isError: false, showLoanAmountMinError: true });

            if (!isFocus) {
                if (states === 'Select') { this.setState({ isStateValid: false }); } else {
                    if (this.state.ZipcodeValue && this.state.CityValue && this.state.selectedStateChanged !== states) {
                        this.ValidateCityStateZip(true);
                        this.setState({ isStateValid: true, selectedStateChanged: states });
                    } else {
                        this.setState({ isStateValid: true });
                    }
                }
            }
        }
    }
    getStateLabel(key) {
        const selectedState = stateList.filter((states) => {
            return states.key === key;
        });
        return selectedState[0] ? selectedState[0].label : null;
    }
    //Select Housing  Dropdown event
    showHideHousingList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onHousingClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isHousingValid: true });
            //this.setState((prevState) => ({ displayHousingItems: !prevState.displayHousingItems }));
        }
    }
    handleHousingChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const housing = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedHousing: housing, isHousingValid: true, isError: false, isHousingPaymentValid: true });
            if (housing === 'RENT' || housing === 'OWN_WITH_MORTGAGE' || housing === 'Own – with mortgage') {
                this.setState({ housingPaymentDisabled: false });
            }
            else {
                this.setState({ housingPaymentDisabled: true, HousingPaymentValue: '', PlainHousingPayment: '0' });
            }
            if (!isFocus) {
                if (housing === 'Select') { this.setState({ isHousingValid: false }); } else { this.setState({ isHousingValid: true }); }
            }
        }
    }
    getHousingLabel(key) {
        const selectedHousing = housingList.filter((housing) => {
            return housing.key === key || housing.label === key;
        });
        return selectedHousing[0] ? selectedHousing[0].label : null;
    }
    getHousingKey(label) {
        const selectedHousing = housingList.filter((housing) => {
            return housing.label.toLowerCase() === label.toLowerCase() || housing.key.toLowerCase() === label.toLowerCase();
        });
        return selectedHousing[0] ? selectedHousing[0].key : null;
    }
    //Select Employment  Dropdown event
    showHideEmploymentList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onEmploymentClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isEmploymentValid: true });
            //this.setState((prevState) => ({ displayEmploymentItems: !prevState.displayEmploymentItems })); 
        }
    }
    handleEmploymentChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const employment = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedEmployment: employment, isEmploymentValid: true, isError: false });
            if (!isFocus) {
                if (employment === 'Select') { this.setState({ isEmploymentValid: false }); } else { this.setState({ isEmploymentValid: true }); }
            }
        }
    }
    getEmploymentLabel(key) {
        const selectedEmployment = employmentList.filter((employment) => {
            return employment.key === key;
        });
        return selectedEmployment[0] ? selectedEmployment[0].label : null;
    }
    getEmploymentKey(label) {
        const selectedEmployment = employmentList.filter((employment) => {
            return employment.label.toLowerCase() === label.toLowerCase() || employment.key.toLowerCase() === label.toLowerCase();
        });
        return selectedEmployment[0] ? selectedEmployment[0].label : null;
    }
    //Select CitizenShip  Dropdown event
    showHideCitizenshipList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onCitizenshipClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isCitizenshipStatusValid: true });
            //this.setState((prevState) => ({ displayCitizenshipItems: !prevState.displayCitizenshipItems })); 
        }
    }
    handleCitizenshipChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const citizenship = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedCitizenship: citizenship, isCitizenshipStatusValid: true, isError: false });
            if (!isFocus) {
                if (citizenship === 'Select') { this.setState({ isCitizenshipStatusValid: false }); } else { this.setState({ isCitizenshipStatusValid: true }); }
            }
        }
    }
    getCitizenshipLabel(key) {
        const selectedCitizenship = citizenshipStatusList.filter((citizenship) => {
            return citizenship.key === key;
        });
        return selectedCitizenship[0] ? selectedCitizenship[0].label : null;
    }
    //Select HighestEducation  Dropdown event
    showHideHighestEducationList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onHighestEducationClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isHighestEducationValid: true });
            //this.setState((prevState) => ({ displayHighestEducationItems: !prevState.displayHighestEducationItems }));
        }
    }
    handleHighestEducationChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const education = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedHighestEducation: education, isHighestEducationValid: true, isError: false });
            if (!isFocus) {
                if (education === 'Select') { this.setState({ isHighestEducationValid: false }); } else { this.setState({ isHighestEducationValid: true }); }
            }
        }
    }
    getHighestEducationLabel(key) {
        const selectedHighestEducation = highestEducationList.filter((HighestEducation) => {
            return HighestEducation.key === key;
        });
        return selectedHighestEducation[0] ? selectedHighestEducation[0].label : null;
    }

    //Select Estimated Credit Score  Dropdown event
    showHideEstimatedCreditScoreList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onEstimatedCreditScoreClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isEstimatedCreditScoreValid: true });
            //this.setState((prevState) => ({ displayEstimatedCreditScoreItems: !prevState.displayEstimatedCreditScoreItems })); 
        }
    }
    handleEstimatedCreditScoreChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const estimatedCreditScore = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedEstimatedCreditScore: estimatedCreditScore, isEstimatedCreditScoreValid: true, isError: false });
            if (!isFocus) {
                if (estimatedCreditScore === 'Select') { this.setState({ isEstimatedCreditScoreValid: false }); } else { this.setState({ isEstimatedCreditScoreValid: true }); }
            }
        }
    }
    getEstimatedCreditScoreLabel(key) {
        const selectedEstimatedCreditScore = estimatedCreditScoreList.filter((estimatedCreditScore) => {
            return estimatedCreditScore.key === key || estimatedCreditScore.label === key;
        });
        return selectedEstimatedCreditScore[0] ? selectedEstimatedCreditScore[0].label : null;
    }
    getEstimatedCreditScoreKey(label) {
        const selectedEstimatedCreditScore = estimatedCreditScoreList.filter((estimatedCreditScore) => {
            return estimatedCreditScore.label.toLowerCase() === label.toLowerCase() || estimatedCreditScore.key.toLowerCase() === label.toLowerCase();
        });
        return selectedEstimatedCreditScore[0] ? selectedEstimatedCreditScore[0].label : null;
    }
    //Select TimeAtCurrentAddress  Dropdown event
    showHideTimeAtCurrentAddressList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onTimeAtCurrentAddressClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isTimeAtCurrentAddressValid: true });
            //this.setState((prevState) => ({ displayTimeAtCurrentAddressItems: !prevState.displayTimeAtCurrentAddressItems }));
        }
    }
    handleTimeAtCurrentAddressChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const timeAtCurrentAddress = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedTimeAtCurrentAddress: timeAtCurrentAddress, isTimeAtCurrentAddressValid: true, isError: false });
            if (!isFocus) {
                if (timeAtCurrentAddress === 'Select') { this.setState({ isTimeAtCurrentAddressValid: false }); } else { this.setState({ isTimeAtCurrentAddressValid: true }); }
            }
        }
    }
    getTimeAtCurrentAddressLabel(key) {
        const selectedTimeAtCurrentAddress = timeAtCurrentAddressList.filter((TimeAtCurrentAddress) => {
            return TimeAtCurrentAddress.key === key;
        });
        return selectedTimeAtCurrentAddress[0] ? selectedTimeAtCurrentAddress[0].label : null;
    }
    //Select Any Military Service  Dropdown event
    showHideAnyMilitaryServiceList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onAnyMilitaryServiceClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isAnyMilitaryServiceValid: true });
            //this.setState((prevState) => ({ displayAnyMilitaryServiceItems: !prevState.displayAnyMilitaryServiceItems }));
        }
    }
    handleAnyMilitaryServiceChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const anyMilitaryService = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedAnyMilitaryService: anyMilitaryService, isAnyMilitaryServiceValid: true, isError: false });
            if (!isFocus) {
                if (anyMilitaryService === 'Select') { this.setState({ isAnyMilitaryServiceValid: false }); } else { this.setState({ isAnyMilitaryServiceValid: true }); }
            }
        }
    }
    getAnyMilitaryServiceLabel(key) {
        const selectedAnyMilitaryService = anyMilitaryServiceList.filter((AnyMilitaryService) => {
            return AnyMilitaryService.key === key;
        });
        return selectedAnyMilitaryService[0] ? selectedAnyMilitaryService[0].label : null;
    }
    //PrimaryProject Purpose Dropdown event
    showHidePrimaryProjectPurposeList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onPrimaryProjectPurposeClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isPrimaryProjectPurposeValid: true });
            //this.setState((prevState) => ({ displayLoanPurposeItems: !prevState.displayLoanPurposeItems }));
        }
    }
    handlePrimaryProjectPurposeChange(isFocus, event) {

        if (!this.state.initialDisabled) {
            const primaryProjectPurpose = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedPrimaryProject: primaryProjectPurpose, isPrimaryProjectPurposeValid: true, isError: false });
            if (!isFocus) {
                if (primaryProjectPurpose === 'Select') { this.setState({ isPrimaryProjectPurposeValid: false }); } else { this.setState({ isPrimaryProjectPurposeValid: true }); }
            }
        }
    }
    getPrimaryProjectPurposeLabel(key) {
        const selectedPrimaryProjectPurpose = PrimaryProjectPurpose.filter((primaryProjectPurpose) => {
            return primaryProjectPurpose.key === key;
        });
        return selectedPrimaryProjectPurpose[0] ? selectedPrimaryProjectPurpose[0].label : null;
    }
    //Loan Purpose Dropdown event
    showHideLoanPurposeList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onLoanPurposeClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isLoanPurposeValid: true });
            //this.setState((prevState) => ({ displayLoanPurposeItems: !prevState.displayLoanPurposeItems }));
        }
    }
    handleLoanPurposeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const loanPurpose = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ selectedLoanPurpose: loanPurpose, isLoanPurposeValid: true, isError: false });
            window.loanPurpose = loanPurpose;
            if (!isFocus) {
                if (loanPurpose === 'Select') { this.setState({ isLoanPurposeValid: false }); } else { this.setState({ isLoanPurposeValid: true }); }
            }
        }
    }

    handleSalaryAmountChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let salaryAmount = unFormatAmount(event.target.value);
            salaryAmount = salaryAmount.replace(/^0+/, '');
            if (isValidInteger(salaryAmount)) {
                this.setState({ SalaryAmountValue: `$${AmountFormatting(salaryAmount)}`, isSalaryAmountValid: true, isError: false, showAIMessage: '' });
                if (!isFocus) {
                    this.setState({ SalaryAmountValue: `$${AmountFormatting(salaryAmount)}` });
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`); 
                    CallGAEvent("Salary Amount", "FocusOut");
                    if (!salaryAmount) { this.setState({ isSalaryAmountValid: false }); }
                    else {
                        this.setState({ isSalaryAmountValid: true, showSalaryAmountError: true, PlainSalaryAmount: salaryAmount });
                    }
                } else {
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                    CallGAEvent("Salary Amount", "FocusIn");
                }
            } else { this.setState({ isSalaryAmountValid: true, showSalaryAmountError: true }); }
        }
    }
    onSalaryPeriodClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isSalaryPeriodValid: true });
            //this.setState((prevState) => ({ displayEmploymentItems: !prevState.displayEmploymentItems })); 
        }
    }
    handleSalaryPeriodChange(isFocus, event) {
        let salaryPeriod = event.target.value;

        //  if (allLetter(SalaryPeriod)) {
        this.setState({ SalaryPeriodValue: salaryPeriod, isSalaryPeriodValid: true, isError: false });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("Salary Period", "FocusOut");
            if (salaryPeriod === 'Select') { this.setState({ isSalaryPeriodValid: false }); }
            else { this.setState({ isSalaryPeriodValid: true }); }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("Salary Period", "FocusIn");
        }
        //  }
    }

    getLoanPurposeLabel(key) {
        const selectedLoanPurpose = loanPurposeList1.filter((loanPurpose) => {
            return loanPurpose.key === key;
        });
        return selectedLoanPurpose[0] ? selectedLoanPurpose[0].label : null;
    }

    getLenderLogoURLFromConfig() {
        if (this.props.PartnerId && this.props.Featured === "1") {
            const matchedLenderInfo = this.props.configSettings.lenderInfo.filter(lenderInfo => {
                return this.props.PartnerId === lenderInfo.partnerId;
            });
            if (matchedLenderInfo !== null && matchedLenderInfo.length > 0) {
                this.setState({ showLenderImage: `https://${window.cdn !== undefined ? window.cdn : window.location.hostname}${matchedLenderInfo[0].lenderLogo}` });
            }
        } else if (this.props.affiliateid !== null && this.props.affiliateid !== undefined) {
            const matchedLenderInfo = this.props.configSettings.lenderInfo.filter(lenderInfo => {
                return this.props.affiliateid === lenderInfo.lender;
            });
            if (matchedLenderInfo !== null && matchedLenderInfo.length > 0) {
                this.setState({ showLenderImage: `https://${window.cdn !== undefined ? window.cdn : window.location.hostname}${matchedLenderInfo[0].lenderLogo}` });
            }
        }
    }
    getIPAddress() {
        try {
            axios.get(`https://api.ipify.org`).then(response => {
                if (response.data !== undefined) {
                    this.setState({ IPAddress: response.data });
                }
            });
        } catch (error) { }
    }
    getPhoneNumberValidate() {
        var apiEndpoint = `https://apilayer.net/api/validate?access_key=${this.props.ThemeConfig.phoneNumberAPIKey}&number=1${unMaskPhone(this.state.PhoneNumberValue)}`;
        return axios.get(`${apiEndpoint}`);
    }
    getSecondaryPhoneNumberValidate() {
        var apiEndpoint = `https://apilayer.net/api/validate?access_key=${this.props.ThemeConfig.phoneNumberAPIKey}&number=1${unMaskPhone(this.state.SecondaryPhoneNumberValue)}`;
        return axios.get(`${apiEndpoint}`);
    }
    getZipCodeByCityState() {
        var apiEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
        return axios.get(`${apiEndpoint}${encodeURIComponent(this.state.StreedAddressValue)},${encodeURIComponent(this.state.CityValue)},${encodeURIComponent(this.state.selectedState)}&key=${this.props.ThemeConfig.googleAPIKey}`);
    }
    ValidateCityStateZip(isCity) {
        var promise = this.getZipCodeByCityState();
        var postalCodes = [];
        var cityCodes = [];
        var stateCodes = [];
        this.setState({ zipCodeArray: postalCodes, cityCodeArray: cityCodes, stateCodeArray: stateCodes });
        promise.then(response => {
            if (response.data !== undefined) {
                if (response.data.results !== undefined && response.data.results.length > 0) {
                    let address_components = response.data.results[0].address_components;
                    if (address_components !== undefined) {
                        address_components.forEach(address => {
                            if (address.types.indexOf('locality') >= 0) {
                                //Add zipcode into list.
                                cityCodes.push(address.short_name.toLowerCase());
                            }
                            if (address.types.indexOf('postal_code') >= 0) {
                                //Add zipcode into list.
                                postalCodes.push(address.short_name);
                            }
                            if (address.types.indexOf('administrative_area_level_1') >= 0) {
                                stateCodes.push(address.long_name.toLowerCase());
                            }
                        });
                    }
                }
                this.zipcodeValidation();
                this.cityValidation();
            }
        });
        this.setState({ zipCodeArray: postalCodes, cityCodeArray: cityCodes, stateCodeArray: stateCodes });
    };
    capitalizeFirstLetter(string) {
        if (string) {
            let newstring = string.toLowerCase();
            newstring = newstring.charAt(0).toUpperCase() + newstring.slice(1);
            return newstring;
        } else { return string; }

    }
    Onaddlegaldataclick() {
        prompt("Add Some Data Here!");
    }





    handleCBFirstNameChange(isFocus, event) {
        let CBfname = event.target.value;
        if (allLetter(CBfname)) {
            this.setState({ CBFirstNameValue: CBfname, isCBFirstNameValid: true, isError: false });
            if (!isFocus) {
                if (!CBfname) { this.setState({ isCBFirstNameValid: false }); }
                else { this.setState({ isCBFirstNameValid: true }); }
            }
        }
    }
    handleCBLastNameChange(isFocus, event) {
        let CBlname = event.target.value;
        if (allLetter(CBlname)) {
            this.setState({ CBLastNameValue: CBlname, isCBLastNameValid: true, isError: false });
            if (!isFocus) {
                if (!CBlname) { this.setState({ isCBLastNameValid: false }); }
                else { this.setState({ isCBLastNameValid: true }); }
            }
        }
    }

    handleCBEmailChange(isFocus, event) {
        let CBemail = event.target.value;
        this.setState({ CBEmailValue: CBemail, isCBEmailValid: true, showCBEmailError: true, CBemailFocus: isFocus, isError: false });
        if (!isFocus) {
            if (!CBemail) { this.setState({ isCBEmailValid: false, showCBEmailError: true }); } else {
                if (CBemail.match(emailRegex)) {
                    this.setState({ isCBEmailValid: true, showCBEmailError: true });
                    this.InitialClick();
                } else {
                    this.setState({ isCBEmailValid: true, showCBEmailError: false });
                }
            }
        }
    }


    handleCBPhoneNumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBphoneNumber = event.target.value;// GetPhoneMask(event.target.value);
            this.setState({
                CBPhoneNumberValue: CBphoneNumber, isCBPhoneNumberValid: true,
                showCBPhoneNumberCodeError: true,
                showCBPhoneNumberError: true, isError: false
            });
            if (!isFocus) {
                this.CBPhoneValidation(CBphoneNumber);
            }
        }
    }

    handleCBSecondaryPhoneNumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBsecondaryphoneNumber = event.target.value;
            let plainNumber = CBsecondaryphoneNumber.replace(/\(/g, '').replace(/\)/g, '').replace(/_/g, '').replace(/-/g, '').replace(' ', '');
            this.setState({
                SecondaryPhoneNumberValue: CBsecondaryphoneNumber, isCBSecondaryPhoneNumberValid: true,
                showCBSecondaryPhoneNumberCodeError: true,
                showCBSecondaryPhoneNumberError: true, isError: false
            });
            if (!isFocus) {
                CallGAEvent("SecondaryPhoneNumber", "FocusOut");

                if (plainNumber.length > 0 && plainNumber.length < 10) {
                    this.setState({
                        isCBSecondaryPhoneNumberValid: false,
                        showCBSecondaryPhoneNumberCodeError: true,
                        showCBSecondaryPhoneNumberError: false,
                        IsContinue: false
                    });
                } else if (plainNumber.length === 10) {
                    if (this.state.IsContinue || this.state.PreviousPhone !== CBsecondaryphoneNumber) {
                        this.CBPhoneValidation(CBsecondaryphoneNumber);
                    }
                }
                else {
                    this.setState({
                        isCBSecondaryPhoneNumberValid: true,
                        showCBSecondaryPhoneNumberCodeError: true,
                        showCBSecondaryPhoneNumberError: true,
                        IsContinue: true
                    });
                }

            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Secondary Phone Number", "FocusIn");
            }
            // if(plainNumber.length === 10 && (this.state.IsContinue || this.state.PreviousPhone !==  phoneNumber)) {
            //     this.PhoneValidationAPI(phoneNumber);
            // }
        }
    }
    CBPhoneValidation(CBphoneNumber) {
        let isValid = true;
        if (!CBphoneNumber) { this.setState({ isCBPhoneNumberValid: false, showCBPhoneNumberError: true, showCBPhoneNumberCodeError: true }); }
        else {
            var isValidAreacode = IsValidAreaCode(CBphoneNumber);
            if (isValidAreacode) {
                var isValidPhone = IsPhoneNumberValid(CBphoneNumber);
                if (!isValidPhone) {
                    this.setState({
                        isCBPhoneNumberValid: true,
                        showCBPhoneNumberCodeError: true,
                        showCBPhoneNumberError: false
                    });
                    isValid = false;
                }
                else {
                    this.setState({
                        isCBPhoneNumberValid: true,
                        showCBPhoneNumberCodeError: true,
                        showCBPhoneNumberError: true
                    });
                }
            }
            else {
                this.setState({
                    isCBPhoneNumberValid: true,
                    showCBPhoneNumberCodeError: false,
                    showCBPhoneNumberError: true
                });
                isValid = false;
            }
        }
        if (isValid) {
            var promise = this.getPhoneNumberValidate();
            promise.then(response => {
                if (response.data !== undefined) {
                    isValid = response.data.valid;
                    if (!isValid) {
                        this.setState({
                            isCBPhoneNumberValid: true,
                            showCBPhoneNumberCodeError: true,
                            showCBPhoneNumberError: false
                        });
                        isValid = false;
                    }
                }
            });
        }
        return isValid;
    }

    handleCBStreetAddressChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBstreetAddress = event.target.value;
            this.setState({ CBStreetAddressValue: CBstreetAddress, isCBStreetAddressValid: true, isError: false, showAddressMessage: '', showCBStreetAddressError: true });
            if (!isFocus) {
                if (!CBstreetAddress) { this.setState({ isCBStreetAddressValid: false }); }
                else if (this.handlePOBoxAddress(CBstreetAddress)) {
                    this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showCBStreetAddressError: false });
                }
                else { this.setState({ isCBStreetAddressValid: true }); }
            }
        }
    }

   
    
    
    handleCBApptChange(isFocus, event) {
        let CBapptAddress = event.target.value;
        this.setState({ CBApptValue: CBapptAddress });
    }
    handleCBCityChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBcity = event.target.value;
            this.setState({ CBCityValue: CBcity, isCBCityValid: true, isError: false });
            if (!isFocus) {
                if (!CBcity) { this.setState({ isCBCityValid: false }); }
                else {
                    //this.setState({isCityValid : true});
                    if (this.state.CBselectedState !== 'Select' && this.state.CBZipcodeValue && this.state.CBCityChangedValue !== CBcity) {
                        this.ValidateCBCityStateZip(true);
                        this.setState({ CBCityChangedValue: CBcity });
                    } else {
                        this.setState({ isCBCityValid: true });
                    }
                }
            }
        }
    }

    showHideCBStateList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onCBStateClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isCBStateValid: true });
            //this.setState((prevState) => ({ displayStateItems: !prevState.displayStateItems }));
        }
    }
    handleCBStateChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const CBstates = event.target.value; //event.target.attributes['react-value'].value;
            //const oldState = this.state.selectedState;
            this.setState({ CBselectedState: CBstates, isCBStateValid: true, isError: false, showLoanAmountMinError: true });
            if (!isFocus) {
                if (CBstates === 'Select') { this.setState({ isCBStateValid: false }); } else {
                    if (this.state.CBZipcodeValue && this.state.CBCityValue && this.state.CBselectedStateChanged !== CBstates) {
                        this.ValidateCBCityStateZip(true);
                        this.setState({ isCBStateValid: true, CBselectedStateChanged: CBstates });
                    } else {
                        this.setState({ isCBStateValid: true });
                    }
                }
            }
        }
    }
    getCBStateLabel(key) {
        const CBselectedState = stateList.filter((CBstates) => {
            return CBstates.key === key;
        });
        return CBselectedState[0] ? CBselectedState[0].label : null;
    }

    CBstateValidation() {
        if (this.state.CBselectedState) {
            if (this.state.CBstateCodeArray.indexOf(this.state.CBselectedState.toLowerCase()) > -1) {
                this.setState({ isCBStateValid: true, showCBCityError: true });
                return true;
            }
            else {
                this.setState({ isCBStateValid: true, showCBCityError: false });
                return false;
            }
        }
    }
    CBcityValidation() {
        if (this.state.CBCityValue) {
            if (this.state.CBcityCodeArray.indexOf(this.state.CBCityValue.toLowerCase()) > -1) {
                this.setState({ isCBCityValid: true, showCBCityError: true });
                return true;
            }
            else {
                this.setState({ isCBCityValid: true, showCBCityError: false });
                return false;
            }
        }
    }
    CBzipcodeValidation() {
        if (this.state.CBZipcodeValue) {
            if (this.state.CBzipCodeArray.indexOf(this.state.CBZipcodeValue) > -1) {
                this.setState({ isCBZipcodeValid: true, showCBZipcodeError: true });
                return true;
            }
            else {
                this.setState({ isCBZipcodeValid: true, showCBZipcodeError: false });
                return false;
            }
        }

    }
    handleCBZipcodeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBzipcode = GetZipcodeMask(event.target.value);
            this.setState({ CBZipcodeValue: CBzipcode, isCBZipcodeValid: true, showCBZipcodeError: true, isError: false });
            if (!isFocus) {
                if (!CBzipcode) { this.setState({ isCBZipcodeValid: false, showCBZipcodeError: true }); } else {
                    if (CBzipcode.length < 5) {
                        this.setState({ isCBZipcodeValid: true, showCBZipcodeError: false });
                    } else {
                        if (this.state.CBselectedState !== 'Select' && this.state.CityValue && this.state.ZipcodeChangedValue !== CBzipcode) {
                            this.ValidateCBCityStateZip(true);
                            this.setState({ CBZipcodeChangedValue: CBzipcode });
                        } else {
                            this.setState({ isCBZipcodeValid: true, showCBZipcodeError: true });
                        }
                        //this.setState({isZipcodeValid : true, showZipcodeError: true});
                    }
                }
            }
        }
    }
    getCBZipCodeByCityState() {
        var apiEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
        return axios.get(`${apiEndpoint}${encodeURIComponent(this.state.CBStreetAddressValue)},${encodeURIComponent(this.state.CBCityValue)},${encodeURIComponent(this.state.CBselectedState)}&key=${this.props.ThemeConfig.googleAPIKey}`);
    }
    ValidateCBCityStateZip(isCity) {
        var promise = this.getCBZipCodeByCityState();
        var postalCodes = [];
        var cityCodes = [];
        var stateCodes = [];
        this.setState({ CBzipCodeArray: postalCodes, CBcityCodeArray: cityCodes, CBstateCodeArray: stateCodes });
        promise.then(response => {
            if (response.data !== undefined) {
                if (response.data.results !== undefined && response.data.results.length > 0) {
                    let address_components = response.data.results[0].address_components;
                    if (address_components !== undefined) {
                        address_components.forEach(address => {
                            if (address.types.indexOf('locality') >= 0) {
                                //Add zipcode into list.
                                cityCodes.push(address.short_name.toLowerCase());
                            }
                            if (address.types.indexOf('postal_code') >= 0) {
                                //Add zipcode into list.
                                postalCodes.push(address.short_name.toLowerCase());
                            }
                            if (address.types.indexOf('administrative_area_level_1') >= 0) {
                                stateCodes.push(address.long_name.toLowerCase());
                            }
                        });
                    }
                }
                this.CBzipcodeValidation();
                this.CBcityValidation();
            }
        });
        this.setState({ CBzipCodeArray: postalCodes, CBcityCodeArray: cityCodes, CBstateCodeArray: stateCodes });
    };

    showHideCBHousingList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onCBHousingClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isCBHousingValid: true });
            //this.setState((prevState) => ({ displayHousingItems: !prevState.displayHousingItems }));
        }
    }
    handleCBHousingChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const CBhousing = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ CBselectedHousing: CBhousing, isCBHousingValid: true, isError: false, isCBHousingPaymentValid: true });
            if (CBhousing === 'RENT' || CBhousing === 'OWN_WITH_MORTGAGE' || CBhousing === 'Own – with mortgage') {
                this.setState({ CBhousingPaymentDisabled: false });
            }
            else {
                this.setState({ CBhousingPaymentDisabled: true, CBHousingPaymentValue: '', CBPlainHousingPayment: '0' });
            }
            if (!isFocus) {
                if (CBhousing === 'Select') { this.setState({ isCBHousingValid: false }); } else { this.setState({ isCBHousingValid: true }); }
            }
        }
    }
    getCBHousingLabel(key) {
        const CBselectedHousing = housingList.filter((housing) => {
            return housing.key === key || housing.label === key;
        });
        return CBselectedHousing[0] ? CBselectedHousing[0].label : null;
    }
    getCBHousingKey(label) {
        const CBselectedHousing = housingList.filter((housing) => {
            return housing.label.toLowerCase() === label.toLowerCase() || housing.key.toLowerCase() === label.toLowerCase();
        });
        return CBselectedHousing[0] ? CBselectedHousing[0].key : null;
    }

    handleCBHousingPaymentChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBhousingPayment = unFormatAmount(event.target.value);
            // housingPayment = housingPayment.replace(/_/g, '');
            if (isValidInteger(CBhousingPayment)) {
                this.setState({ CBHousingPaymentValue: CBhousingPayment, CBPlainHousingPayment: CBhousingPayment, isCBHousingPaymentValid: true, showCBHousingPaymentMinError: true, CBhousingPaymentFocus: isFocus, isError: false });
                if (!isFocus && !this.state.CBhousingPaymentDisabled) {
                    this.setState({ CBHousingPaymentValue: this.props.configSettings.fieldSettings.currencySymbol + AmountFormatting(CBhousingPayment) });
                    if (!CBhousingPayment) { this.setState({ isCBHousingPaymentValid: false, showCBHousingPaymentMinError: true }); }
                }
            } else { this.setState({ isCBHousingPaymentValid: true, showCBHousingPaymentMinError: true }); }
        }
    }

    showHideCBEstimatedCreditScoreList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onCBEstimatedCreditScoreClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isCBEstimatedCreditScoreValid: true });
            //this.setState((prevState) => ({ displayEstimatedCreditScoreItems: !prevState.displayEstimatedCreditScoreItems })); 
        }
    }
    handleCBEstimatedCreditScoreChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const CBestimatedCreditScore = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ CBselectedEstimatedCreditScore: CBestimatedCreditScore, isCBEstimatedCreditScoreValid: true, isError: false });
            if (!isFocus) {
                if (CBestimatedCreditScore === 'Select') { this.setState({ isCBEstimatedCreditScoreValid: false }); } else { this.setState({ isCBEstimatedCreditScoreValid: true }); }
            }
        }
    }
    getCBEstimatedCreditScoreLabel(key) {
        const CBselectedEstimatedCreditScore = estimatedCreditScoreList.filter((CBestimatedCreditScore) => {
            return CBestimatedCreditScore.key === key || CBestimatedCreditScore.label === key;
        });
        return CBselectedEstimatedCreditScore[0] ? CBselectedEstimatedCreditScore[0].label : null;
    }
    getCBEstimatedCreditScoreKey(label) {
        const CBselectedEstimatedCreditScore = estimatedCreditScoreList.filter((CBestimatedCreditScore) => {
            return CBestimatedCreditScore.label.toLowerCase() === label.toLowerCase() || CBestimatedCreditScore.key.toLowerCase() === label.toLowerCase();
        });
        return CBselectedEstimatedCreditScore[0] ? CBselectedEstimatedCreditScore[0].label : null;
    }

    handleCBBirthdateChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBbirthdate = event.target.value;// GetDateMask(event.target.value);
            this.setState({ CBBirthdateValue: CBbirthdate, isCBBirthdateValid: true, showCBBirthdateError: true, isError: false, showDOBMessage: '' });
            if (!isFocus) {
                if (!CBbirthdate) { this.setState({ isCBBirthdateValid: false, showCBBirthdateError: true }); }
                else {
                    if (CBbirthdate.length < 10) {
                        this.setState({ isCBBirthdateValid: false, showCBBirthdateError: true });
                    }
                    else {
                        const message = checkValidDate(CBbirthdate);
                        if (message === '') {
                            const futureDate = isFutureDate(CBbirthdate);
                            if (futureDate) {
                                this.setState({ isCBBirthdateValid: true, showCBBirthdateError: false, showDOBMessage: 'Future date is not allowed' });
                            } else {
                                const age = calculateAge(new Date(CBbirthdate), new Date());
                                if (age > 100) {
                                    this.setState({ isCBBirthdateValid: true, showCBBirthdateError: false, showDOBMessage: 'Invalid birth date' });
                                } else
                                    if (age < 18 || isNaN(age)) {
                                        this.setState({ isCBBirthdateValid: true, showCBBirthdateError: false, showDOBMessage: '' });
                                    } else {
                                        this.setState({ isCBBirthdateValid: true, showCBBirthdateError: true });
                                    }
                            }
                        }
                        else { this.setState({ isCBBirthdateValid: true, showCBBirthdateError: false, showDOBMessage: `Please provide valid ${message}` }); }
                    }
                }
            }
        }
    }
    IsValidCBBirthdate(CBbirthdate) {
        let isValid = false;
        if (CBbirthdate.length < 10) {
            this.setState({ isCBBirthdateValid: false, showCBBirthdateError: true });
        }
        else {
            const message = checkValidDate(CBbirthdate);
            if (message === '') {
                const age = calculateAge(new Date(CBbirthdate), new Date());
                if (age > 100) {
                    this.setState({ isCBBirthdateValid: true, showCBBirthdateError: false, showDOBMessage: 'Invalid birth date' });
                } else
                    if (age < 18 || isNaN(age)) {
                        this.setState({ isCBBirthdateValid: true, showCBBirthdateError: false, showDOBMessage: '' });
                    } else {
                        this.setState({ isCBBirthdateValid: true, showCBBirthdateError: true });
                        isValid = true;
                    }
            }
            else { this.setState({ isCBBirthdateValid: true, showCBBirthdateError: false, showDOBMessage: `Please provide valid ${message}` }); }
        }
        return isValid;
    }

    handleCBProvideSSNChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBprovideSSN = event.target.value;
            this.setState({ CBProvideSSNValue: CBprovideSSN, isCBProvideSSNValid: true, showCBProvideSSNError: true, isError: false });
            let formData = document.getElementById(this.props.configSettings.formSettings.summaryFormName);
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("SSN", "FocusOut");
                CBprovideSSN = CBprovideSSN.replace(/_/g, '');
                if(formData && formData.cbSsn !== null && formData.cbSsn.length > 1) {
                    formData.cbSsn[1].type = "password";
                } else if(formData && formData.ssn !== null ) {
                    formData.cbSsn.type = "password";
                }
               
                if (!CBprovideSSN) { this.setState({ isCBProvideSSNValid: false }); } else {
                    this.setState({ isCBProvideSSNValid: true });
                    if (CBprovideSSN.length !== 11) { this.setState({ showCBProvideSSNError: false, isError: true }); }
                    else {
                        if (!IsSSNGroupValid(CBprovideSSN)) {
                            this.setState({ showCBProvideSSNError: false });
                        } else {
                            this.setState({ showCBProvideSSNError: true });
                        }
                    }
                }
            }
            else {

                // CallGAEvent("SSN","FocusIn");
                if(formData && formData.cbSsn !== null && formData.cbSsn.length > 1) {
                    formData.cbSsn[1].type = "tel";
                } else if(formData && formData.ssn !== null ) {
                    formData.cbSsn.type = "tel";
                }
            }
        }
    }

    showHideCBEmploymentList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onCBEmploymentClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isCBEmploymentValid: true });
            //this.setState((prevState) => ({ displayEmploymentItems: !prevState.displayEmploymentItems })); 
        }
    }
    handleCBEmploymentChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const CBemployment = event.target.value; //event.target.attributes['react-value'].value;
            this.setState({ CBselectedEmployment: CBemployment, isCBEmploymentValid: true, isError: false });
            if (!isFocus) {
                if (CBemployment === 'Select') { this.setState({ isCBEmploymentValid: false }); } else { this.setState({ isCBEmploymentValid: true }); }
            }
        }
    }
    getCBEmploymentLabel(key) {
        const CBselectedEmployment = employmentList.filter((CBemployment) => {
            return CBemployment.key === key;
        });
        return CBselectedEmployment[0] ? CBselectedEmployment[0].label : null;
    }
    getCBEmploymentKey(label) {
        const CBselectedEmployment = employmentList.filter((CBemployment) => {
            return CBemployment.label.toLowerCase() === label.toLowerCase() || CBemployment.key.toLowerCase() === label.toLowerCase();
        });
        return CBselectedEmployment[0] ? CBselectedEmployment[0].label : null;
    }

    handleCBAnnualIncomeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let CBannualIncome = unFormatAmount(event.target.value);
            CBannualIncome = CBannualIncome.replace(/^0+/, '');
            //annualIncome = annualIncome.replace(/_/g, '');
            if (isValidInteger(CBannualIncome)) {
                this.setState({ CBAnnualIncomeValue: CBannualIncome, isCBAnnualIncomeValid: true, showCBAnnualIncomeMinError: true, CBannualIncomeFocus: isFocus, isError: false, showAIMessage: '' });
                if (!isFocus) {
                    this.setState({ CBAnnualIncomeValue: this.props.configSettings.fieldSettings.currencySymbol + AmountFormatting(CBannualIncome) });
                    if (!CBannualIncome) { this.setState({ isCBAnnualIncomeValid: false, showCBAnnualIncomeMinError: true }); }
                    else {
                        if (CBannualIncome < constantVariables.annualIncomeMin) {
                            this.setState({ isCBAnnualIncomeValid: true, showCBAnnualIncomeMinError: false, showAIMessage: '' });
                        } else if (CBannualIncome > constantVariables.annualIncomeMax) {
                            this.setState({ isCBAnnualIncomeValid: true, showCBAnnualIncomeError: false, showCBAnnualIncomeMinError: true, showAIMessage: 'Value may not exceed $10M' });
                        } else {
                            this.setState({ isCBAnnualIncomeValid: true, showCBAnnualIncomeError: true, showCBAnnualIncomeMinError: true, CBPlainAnnualIncome: CBannualIncome });
                        }
                    }
                }
            } else { this.setState({ isCBAnnualIncomeValid: true, showCBAnnualIncomeMinError: true }); }
        }
    }

    // GetCheckboxPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
    //     let columnWidth = this.GetColumnWidth(customFormFields.col);
    //     return <CheckBoxField formFields={customFormFields} Title={customFormFields.placeholder} keyID={'test'} handleOnChange={handleEvent} 
    //         name={customFormFields.name} columnStyle={` text-control-align ${columnWidth}`} currentDevice={this.props.currentDevice} />;
    // }


    // getCoBorrowerDetails() {
    //     let Coborrowerinfo = this.props.PostDataFull;
    //     if (Coborrowerinfo.borrowers[0].CoBorrowerData) {
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.address1
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.address2
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.city
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.state
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.zipCode
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.housingStatus
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.housingPayment
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.firstName
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.lastName;
    //         Coborrowerinfo.borrowers[0].CoBorrowerData.phoneNumber
    //         console.log(Coborrowerinfo.borrowers[0].CoBorrowerData);
    //     }
    //     return Coborrowerinfo;
    // }

    getUpdatedData(fullEmpInfo){
        if(fullEmpInfo !== null && fullEmpInfo.borrowers !== null) {
            fullEmpInfo.borrowers[0].address1 = this.state.StreedAddressValue;
			fullEmpInfo.borrowers[0].address2 = this.state.ApptValue;
			fullEmpInfo.borrowers[0].city = this.state.CityValue;
			fullEmpInfo.borrowers[0].state = this.state.selectedState;
			fullEmpInfo.borrowers[0].zipCode = this.state.ZipcodeValue;
			fullEmpInfo.borrowers[0].housingStatus = this.state.selectedHousing;
			fullEmpInfo.borrowers[0].housingPayment = unformat(this.state.HousingPaymentValue);
			fullEmpInfo.borrowers[0].creditScore = this.state.selectedEstimatedCreditScore;
			fullEmpInfo.borrowers[0].dateOfBirth = convertDateFormat( this.state.BirthdateValue, "MM/DD/YYYY","YYYY-MM-DD");
			fullEmpInfo.borrowers[0].employmentStatus = this.state.selectedEmployment;
			fullEmpInfo.borrowers[0].annualIncome = unformat(this.state.AnnualIncomeValue);
			fullEmpInfo.borrowers[0].firstName = this.state.FirstNameValue;
			fullEmpInfo.borrowers[0].lastName = this.state.LastNameValue;
			fullEmpInfo.borrowers[0].primaryPhoneNumber = unformat(this.state.PhoneNumberValue);
			fullEmpInfo.borrowers[0].emailAddress = this.state.EmailValue;
			fullEmpInfo.borrowers[0].ssn = this.state.ProvideSSNValue;
			fullEmpInfo.borrowers[0].agreePqTerms = this.state.AgreePqTerms;
			fullEmpInfo.borrowers[0].primaryBorrower = "true";
			
            if(fullEmpInfo.borrowers[0].employmentInformation) {
                fullEmpInfo.borrowers[0].employmentInformation.employerName =this.state.EmployerNameValue;
                fullEmpInfo.borrowers[0].employmentInformation.position =this.state.PositionValue;
                fullEmpInfo.borrowers[0].employmentInformation.startDate =convertDateFormat(  this.state.StartDateValue, "MM/DD/YYYY","YYYY-MM-DD");
                fullEmpInfo.borrowers[0].employmentInformation.endDate = convertDateFormat( this.state.EndDateValue, "MM/DD/YYYY","YYYY-MM-DD");
                fullEmpInfo.borrowers[0].employmentInformation.salaryAmount = unformat(this.state.SalaryAmountValue);
                fullEmpInfo.borrowers[0].employmentInformation.salaryPeriod =this.state.SalaryPeriodValue;
                fullEmpInfo.borrowers[0].employmentInformation.employerAddress1 =this.state.EmployerAddress1Value;
                fullEmpInfo.borrowers[0].employmentInformation.employerAddress2 =this.state.EmployerAddress2Value;
                fullEmpInfo.borrowers[0].employmentInformation.employerCity =this.state.EmployerAddress1CityValue;
                fullEmpInfo.borrowers[0].employmentInformation.employerState =this.state.EmployerAddress1StateValue;
                fullEmpInfo.borrowers[0].employmentInformation.employerZipCode =this.state.EmployerAddress1ZipcodeValue;
                fullEmpInfo.borrowers[0].employmentInformation.employerPhoneNumber = unformat(this.state.EmployerPhoneNumberValue);
            }
            if(fullEmpInfo.borrowers.length > 1) {
                fullEmpInfo.borrowers[1].address1 = this.state.CBStreetAddressValue;
                fullEmpInfo.borrowers[1].address2 = this.state.CBApptValue;
                fullEmpInfo.borrowers[1].city = this.state.CBCityValue;
                fullEmpInfo.borrowers[1].state = this.state.CBselectedState;
                fullEmpInfo.borrowers[1].zipCode = this.state.CBZipcodeValue;
                fullEmpInfo.borrowers[1].housingStatus = this.state.CBselectedHousing;
                fullEmpInfo.borrowers[1].housingPayment = unformat(this.state.CBHousingPaymentValue);
                fullEmpInfo.borrowers[1].creditScore = this.state.CBselectedEstimatedCreditScore;
                fullEmpInfo.borrowers[1].dateOfBirth =convertDateFormat( this.state.CBBirthdateValue, "MM/DD/YYYY","YYYY-MM-DD");
                fullEmpInfo.borrowers[1].employmentStatus = this.state.CBselectedEmployment;
                fullEmpInfo.borrowers[1].annualIncome = unformat(this.state.CBAnnualIncomeValue);
                fullEmpInfo.borrowers[1].firstName = this.state.CBFirstNameValue;
                fullEmpInfo.borrowers[1].lastName = this.state.CBLastNameValue;
                fullEmpInfo.borrowers[1].primaryPhoneNumber = unformat(this.state.CBPhoneNumberValue);
                fullEmpInfo.borrowers[1].emailAddress = this.state.CBEmailValue;
                fullEmpInfo.borrowers[1].ssn = unformat(this.state.CBProvideSSNValue);
                fullEmpInfo.borrowers[1].agreePqTerms = this.state.CBAgreePqTerms;
                fullEmpInfo.borrowers[1].primaryBorrower = "false";
            }
        }
        return JSON.stringify(fullEmpInfo);
    }
    render() {
        //     const ename = this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[0].employmentInformation && this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName ? this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName : '');
        //    console.log(this.props.ename);
        //     const pos = this.capitalizeFirstLetter(this.props.PostDataFull && this.props.PostDataFull.employmentInformation.position ? this.props.PostDataFull.employmentInformation.position : '');
        //     const salaryamt = this.props.PostDataFull && this.props.PostDataFull.employmentInformation.salaryAmount ? unFormatAmount(this.props.PostDataFull.employmentInformation.salaryAmount) : '';
        //     const phonenum = this.props.PostDataFull && this.props.PostDataFull.employmentInformation.employerPhoneNumber ? GetPhoneMask(this.props.PostDataFull.employmentInformation.employerPhoneNumber) : '';
        //     const sdate = this.props.PostDataFull && this.props.PostDataFull.employmentInformation.startDate ? this.props.PostDataFull.employmentInformation.startDate : '';
        //     const edate = this.props.PostDataFull && this.props.PostDataFull.employmentInformation.endDate ? this.props.PostDataFull.employmentInformation.endDate : '';
        //     const address1 = this.props.PostData && this.props.PostDataFull.employmentInformation.employerAddress1 ? this.props.PostDataFull.employmentInformation.employerAddress1 : '';
        //     const address2 = this.props.PostData && this.props.PostDataFull.employmentInformation.employerAddress2 ? this.props.PostDataFull.employmentInformation.employerAddress2 : '';
        //     // const state = this.props.PostDataFull && this.props.PostDataFull.employmentInformation.employerState ? filteredState[0] ? filteredState[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect;
        //     const zip = this.props.PostDataFull && this.props.PostDataFull.employmentInformation.employerZipCode ? this.props.PostDataFull.employmentInformation.employerZipCode : '';
        //     const city = this.props.PostDataFull && this.props.PostDataFull.employmentInformation.employerCity ? this.props.PostDataFull.employmentInformation.employerCity : '';

        const address1 = this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress1;
        const address2 = this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress2;
        const city = this.props.PostDataFull.borrowers[0].employmentInformation[0].employerCity;
        const state = this.props.PostDataFull.borrowers[0].employmentInformation[0].employerState;
        const zip = this.props.PostDataFull.borrowers[0].employmentInformation[0].employerZipCode;
        return (
            <div className="container" >
                <section id="headersection" className="">
                    <div className="row">
                        <div className="col-md-1">
                        </div>
                        <div className="center-block col-md-12">

                            {/* <div className={`box-panel clearfix access-offer-top-margin`} id="mainbox"> */}
                            <div className=".container-box-content-summary" id="mainboxcontent">
                                {/* <form action={`${constantVariables.summaryPagePostURL}`} name="createacc2" id="frmPrequalify" disable-btn="" className="app-form" method="POST" onSubmit={this.Submit.bind(this)}> */}
                                {/* {this.state.IsSummaryPage && !this.state.IsSummaryPageEdit ? */}
                                <div className="row">
                                    {/* <input type="hidden" name="uuid" value={uuid} />
                                    <input type="hidden" name="gclid" value={this.props.GCLId ? this.props.GCLId : ''} />
                                    <input type="hidden" name="partnerId" value={this.props.PartnerId ? this.props.PartnerId : ''} />
                                    <input type="hidden" name="featured" value={this.props.Featured ? this.props.Featured : ''} />
                                    <input type="hidden" name="os" value={this.props.currentOS ? this.props.currentOS : ''} />
                                    <input type="hidden" name="browser" value={this.props.currentBrowser ? this.props.currentBrowser : ''} />
                                    <input type="hidden" name="deviceType" value={this.props.currentDevice ? this.props.currentDevice : ''} />
                                    <input type="hidden" name="affiliateId" value={this.props.affiliateid ? this.props.affiliateid : ''} />
                                    <input type="hidden" name="programId" value={this.props.programid ? this.props.programid : ''} />
                                    <input type="hidden" name="campaignId" value={this.props.campaignid ? this.props.campaignid : ''} />
                                    <input type="hidden" name="utm_source" value={this.props.utmSource ? this.props.utmSource : ''} />
                                    <input type="hidden" name="utm_medium" value={this.props.utmMedium ? this.props.utmMedium : ''} />
                                    <input type="hidden" name="utm_term" value={this.props.utmTerm ? this.props.utmTerm : ''} />
                                    <input type="hidden" name="utm_campaign" value={this.props.utmCampaign ? this.props.utmCampaign : ''} />
                                    <input type="hidden" name="utm_content" value={this.props.utmContent ? this.props.utmContent : ''} />
                                    <input type="hidden" name="hsessionid" value={window.hSessionID ? window.hSessionID : ''} />
                                    <input type="hidden" name="prclid" value={this.state.mpUniqueClickID} />
                                    <input type="hidden" name="pr_sessionid" value={window.prsessionid ? window.prsessionid : ''} />
                                    <input type="hidden" name="ipAddress" value={this.state.IPAddress} />
                                    <input type="hidden" name="action" value={`${this.props.affiliateid ? this.props.affiliateid === '426464' ? 'AcquireInteractive' : this.props.affiliateid : 'Affiliate'} app submit`} />
                                    <input type="hidden" name="senderDomain" value={window.location.host} /> */}

                                    {!this.state.IsSummaryPage && this.state.IsSummaryPageEdit ?
                                        <div className="row">
                                            {this.state.IsSummaryPage && !this.state.IsSummaryPageEdit}
                                            <span>
                                                <h1 className="big-heading">Almost finished!</h1>
                                                <h5 className="heading">Please review your application information. Once you have confirmed that it is correct, click 'Submit Application' and we'll take it from here.</h5>
                                            </span>
                                            <div>
                                            </div>
                                        </div>
                                        : ''
                                    }
                                </div>
                                {this.state.IsSummaryPage && !this.state.IsSummaryPageEdit ?
                                    <div className="row ">
                                        {this.state.IsSummaryPage && !this.state.IsSummaryPageEdit}
                                        <span>
                                            <h1 className="big-heading">Almost finished!</h1>
                                            <h5 className="heading" >Please review your application information. Once you have confirmed that it is correct, click 'Submit Application' and we'll take it from here.</h5>
                                        </span>
                                        <div>
                                        </div>
                                    </div>
                                    : ''
                                }
                                {this.state.IsSummaryPage && !this.state.IsSummaryPageEdit ?
                                   <span>
                                   {this.props.currentDevice !== 'Mobile' ? 
                                       <span>
                                   <div className="summaryPage-leftalign summaryPage-border">
                                   <span><h4 className="summaryPage-leftalign">Loan Information</h4></span>
                                   <div className="offerdetail offerdetailborder">
                                    <div className="row">
                                           {/* <input type="hidden" name="lastname" value={this.props.PostDataFull.borrowers[0].offerData.lenderName} />
                                           <input type="hidden" name="loanAmount" value={this.props.PostDataFull.borrowers[0].offerData.loanAmount} />     */}
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Lender Name:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[0].offerData.lenderName}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Loan amount:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[0].offerData.loanAmount)}`}</b></div>            
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="APR" value={this.props.PostDataFull.borrowers[0].offerData.APR} />
                                           <input type="hidden" name="term" value={this.props.PostDataFull.borrowers[0].offerData.term} /> 
                                           <input type="hidden" name="monthlyPayment" value={this.props.PostDataFull.borrowers[0].offerData.monthlyPayment} /> */}
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> APR:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" > <b>{this.props.PostDataFull.borrowers[0].offerData.APR} &#x25;</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Term:</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[0].offerData.term/24} Years</b></div>    
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Monthly Payment:</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[0].offerData.monthlyPayment)}`}</b></div>                        
                                       </div> 
                                   </div>
                                    
                                   <span><h4 className="summaryPage-leftalign">Primary Borrower Information</h4></span>
                                   <div className="primarydetail">                                                         
                                       <div className="row">
                                           {/* <input type="hidden" name="firstname" value={this.props.PostDataFull.borrowers[0].firstName} />
                                           <input type="hidden" name="lastname" value={this.props.PostDataFull.borrowers[0].lastName} /> */}
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[0].firstName)}`}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[0].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="emailAddress" value={this.props.PostDataFull.borrowers[0].emailAddress} />
                                       <input type="hidden" name="primaryPhoneNumber" value={unMaskPhone(this.props.PostDataFull.borrowers[0].primaryPhoneNumber)} /> */}
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Email Address:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="wordwrap"><u>{this.props.PostDataFull.borrowers[0].emailAddress}</u></b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{GetPhoneMask(this.props.PostDataFull.borrowers[0].primaryPhoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundBorrower">
                                           {/* <input type="hidden" name="address1" value={this.props.PostDataFull.borrowers[0].address1} />
                                           <input type="hidden" name="address2" value={this.props.PostDataFull.borrowers[0].address2} /> */}
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle1"> Address1:</b></div>
                                           <div className="col-sm-3 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataFull.borrowers[0].address1}</b></div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle2" > Address2:</b>  </div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataFull.borrowers[0].address2} &nbsp; </b></div>
                                       
                                            {/* <input type="hidden" name="city" value={this.props.PostDataFull.borrowers[0].city} />
                                           <input type="hidden" name="state" value={this.props.PostDataFull.borrowers[0].state} />
                                           <input type="hidden" name="zip" value={this.props.PostDataFull.borrowers[0].zipCode} /> */}
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle1"> City:</b> </div>
                                           <div className="col-sm-3 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataFull.borrowers[0].city}</b></div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle2"> State:</b> </div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataFull.borrowers[0].state}</b></div>
                                           <div className="col-sm-3 address-back-margin " ><b className="labelstyle1"> Zip:</b>   </div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labeladdressvalue">{this.props.PostDataFull.borrowers[0].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="housingStatus" value={(this.props.PostDataFull.borrowers[0].housingStatus)} />
                                           <input type="hidden" name="housingPayment" value={this.props.PostDataFull.borrowers[0].housingPayment} /> */}
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.getHousingLabel(this.props.PostDataFull.borrowers[0].housingStatus) ? this.getHousingLabel(this.props.PostDataFull.borrowers[0].housingStatus) : '-'}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b> {this.props.PostDataFull.borrowers[0].housingPayment ? `$${AmountFormatting(this.props.PostDataFull.borrowers[0].housingPayment)}` : '-'}</b></div>
                                       </div>
                                       <div className="row">
                                            {/* <input type="hidden" name="creditScore" value={this.props.PostDataFull.borrowers[0].creditScore} />
                                           <input type="hidden" name="dateOfBirth" value={this.props.PostDataFull.borrowers[0].dateOfBirth} /> */}
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataFull.borrowers[0].creditScore)}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{convertDateFormat(this.props.PostDataFull.borrowers[0].dateOfBirth,"YYYY-MM-DD","MM/DD/YYYY")}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="ssn" value={this.props.PostDataFull.borrowers[0].ssn} />
                                           <input type="hidden" name="annualIncome" value={this.props.PostDataFull.borrowers[0].annualIncome} /> */}
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">SSN:</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`XXX-XX-${this.props.PostDataFull.borrowers[0].ssn !== null && this.props.PostDataFull.borrowers[0].ssn !== undefined && this.props.PostDataFull.borrowers[0].ssn.length > 4 ? this.props.PostDataFull.borrowers[0].ssn.substr(this.props.PostDataFull.borrowers[0].ssn.length - 4) : this.props.PostDataFull.borrowers[0].ssn}`}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[0].annualIncome)}`}</b></div>
                                       </div>                                            
                                   </div>
                                   <span><h4 className="summaryPage-leftalign summarypage-textindent employmentText">Employment Information</h4></span>
                                   <div className="employerdetail">
                                       
                                       <div className="row">
                                           {/* <input type="hidden" name="employerName" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName} />
                                           <input type="hidden" name="position" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].position} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle"> Employer Name:</b></div>
                                           <div className="col-sm-3 " ><b className="wordwrap">{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName)}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Position / Title:</b></div>
                                           <div className="col-sm-3 " ><b className="wordwrap">{this.props.PostDataFull.borrowers[0].employmentInformation[0].position}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="startDate" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].startDate} />
                                           <input type="hidden" name="endDate" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle"> Start Date:</b></div>
                                           <div className="col-sm-3" ><b>{convertDateFormat(this.props.PostDataFull.borrowers[0].employmentInformation[0].startDate,"YYYY-MM-DD","MM/DD/YYYY")}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> End Date:&nbsp;</b></div>
                                           <div className="col-sm-3 " ><b>{this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate ? convertDateFormat(this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate,"YYYY-MM-DD","MM/DD/YYYY") : 'Present'}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="salaryAmount" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryAmount} />
                                           <input type="hidden" name="salaryPeriod" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryPeriod} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle"> Salary Amount:&nbsp;</b> </div>
                                           <div className="col-sm-3 " ><b>{`${AmountFormatting(this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryAmount)}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Salary Period:&nbsp;</b></div>
                                           <div className="col-sm-3 " ><b>{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryPeriod)}`}</b></div>
                                       </div>
                                       <div className="row address-background">
                                           {/* <input type="hidden" name="employerAddress1" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress1} />
                                           <input type="hidden" name="employerAddress2" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress2} /> */}
                                           <div className="col-sm-3 " ><b className="labelemploymentaddress"> Address1:</b>  </div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddressvalue">{address1}</b></div>
                                           <div className="col-sm-3 " ><b className="labelempaddress2"> Address 2:</b></div>
                                           <div className="col-sm-3 " ><b className="labelempaddressvalue2">{address2}&nbsp;</b></div>
                                        
                                           {/* <input type="hidden" name="employerCity" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerCity} />
                                           <input type="hidden" name="employerState" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerState} />
                                           <input type="hidden" name="employerZipCode" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerZipCode} /> */}
                                           <div className="col-sm-3 " ><b className="labelemploymentaddress"> City:</b>  </div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddressvalue">{city}</b></div>
                                           <div className="col-sm-3 " ><b className="labelempaddress2"> State:</b> </div>
                                           <div className="col-sm-3 " ><b className="labelempaddressvalue2">{state}</b></div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddress"> Zip:</b> </div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddressvalue">{zip}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="employmentStatus" value={this.props.PostDataFull.borrowers[0].employmentStatus} />
                                           <input type="hidden" name="employerPhoneNumber" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle">Employment Status:</b> </div>
                                           <div className="col-sm-3 " ><b>{this.getEmploymentLabel(this.props.PostDataFull.borrowers[0].employmentStatus)}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Phone Number:</b> </div>
                                           <div className="col-sm-3 " ><b>{this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber}</b></div>
                                       </div>                                           

                                   </div>
                                   {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                       <div className="row">
                                           <div className="col-md-12">
                                               <div className="checkboxsummary">
                                                   <input id='agreePqTerms' name="agreePqTerms" type='hidden' value={this.state.AgreePqTerms} />
                                                   <input className={`checkbox pre-checkbox `} id='brAgreePqTerms' type="checkbox" value={this.state.AgreePqTerms} tabIndex="1" onChange={this.AgreePqTermsChange.bind(this)} />
                                                   <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                               </div>
                                           </div>
                                       </div>}
                                   <hr className="hr-size hr" />
                                   {this.props.PostDataFull.borrowers.length > 1 ? <span>
                                       <span><h4 className="summaryPage-leftalign">Co-Borrower Information</h4></span>
                                       <div className="Coborrowerdetail">
                                       <div className="row">
                                           {/* <input type="hidden" name="firstname" value={this.props.PostDataFull.borrowers[1].firstName} />
                                           <input type="hidden" name="lastname" value={this.props.PostDataFull.borrowers[1].lastName} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-sm-3 " ><b>{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[1].firstName)}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-sm-3" ><b>{this.props.PostDataFull.borrowers[1].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="emailAddress" value={this.props.PostDataFull.borrowers[1].emailAddress} />
                                       <input type="hidden" name="phonenumber" value={unMaskPhone(this.props.PostDataFull.borrowers[1].primaryPhoneNumber)} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle">Email Address:</b> </div>
                                           <div className="col-sm-3" ><b className="wordwrap"><u>{this.props.PostDataFull.borrowers[1].emailAddress}</u></b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className="col-sm-3 " ><b>{GetPhoneMask(this.props.PostDataFull.borrowers[1].primaryPhoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                           {/* <input type="hidden" name="address1" value={this.props.PostDataFull.borrowers[1].address1} />
                                           <input type="hidden" name="address2" value={this.props.PostDataFull.borrowers[1].address2} /> */}
                                           <div className="col-sm-3" ><b className="labelstyleCB1"> Address1:</b></div>
                                           <div className="col-sm-3" ><b className="labelCBaddressvalue">{this.props.PostDataFull.borrowers[1].address1}</b></div>
                                           <div className="col-sm-3" ><b className="labelstyleCB2"> Address2:</b>  </div>
                                           <div className="col-sm-3" ><b className="labelCBaddressvalue2">{this.props.PostDataFull.borrowers[1].address2}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                            {/* <input type="hidden" name="city" value={this.props.PostDataFull.borrowers[1].city} />
                                           <input type="hidden" name="state" value={this.props.PostDataFull.borrowers[1].state} />
                                           <input type="hidden" name="zip" value={this.props.PostDataFull.borrowers[1].zipCode} /> */}
                                           <div className="col-sm-3" ><b className="labelstyleCB1"> City:</b> </div>
                                           <div className="col-sm-3 " ><b className="labelCBaddressvalue">{this.props.PostDataFull.borrowers[1].city}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyleCB2"> State:</b>  </div>
                                           <div className="col-sm-3 " ><b className="labelCBaddressvalue2">{this.props.PostDataFull.borrowers[1].state}</b></div>
                                           <div className="col-sm-3" ><b className="labelstyleCB1"> Zip:</b>   </div>
                                           <div className="col-sm-3 " ><b className="labelCBaddressvalue">{this.props.PostDataFull.borrowers[1].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="housingStatus" value={(this.props.PostDataFull.borrowers[1].housingStatus)} />
                                           <input type="hidden" name="housingPayment" value={this.props.PostDataFull.borrowers[1].housingPayment} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className="col-sm-3 " ><b>{this.getHousingLabel(this.props.PostDataFull.borrowers[1].housingStatus) ? this.getHousingLabel(this.props.PostDataFull.borrowers[1].housingStatus) : '-'}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className="col-sm-3" ><b>{ this.props.PostDataFull.borrowers[1].housingPayment ? `$${AmountFormatting(this.props.PostDataFull.borrowers[1].housingPayment)}` : '-'}</b></div>
                                       </div>
                                       <div className="row">
                                            {/* <input type="hidden" name="creditScore" value={this.props.PostDataFull.borrowers[1].creditScore} />
                                           <input type="hidden" name="dateOfBirth" value={this.props.PostDataFull.borrowers[1].dateOfBirth} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className="col-sm-3 " ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataFull.borrowers[1].creditScore)}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className="col-sm-3 " ><b>{convertDateFormat(this.props.PostDataFull.borrowers[1].dateOfBirth,"YYYY-MM-DD","MM/DD/YYYY")}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="ssn" value={this.props.PostDataFull.borrowers[1].ssn} />
                                           <input type="hidden" name="annualIncome" value={this.props.PostDataFull.borrowers[1].annualIncome} /> */}
                                           <div className="col-sm-3 " ><b className="labelstyle">SSN:</b></div>
                                           <div className="col-sm-3 " ><b>{`XXX-XX-${this.props.PostDataFull.borrowers[1].ssn !== null && this.props.PostDataFull.borrowers[1].ssn !== undefined && this.props.PostDataFull.borrowers[1].ssn.length > 4 ? this.props.PostDataFull.borrowers[1].ssn.substr(this.props.PostDataFull.borrowers[1].ssn.length - 4) : this.props.PostDataFull.borrowers[1].ssn}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-sm-3 " ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[1].annualIncome)}`}</b></div>
                                       </div>                                                
                                          
                                           {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                               <div className="row">
                                                   <div className="col-md-12">
                                                       <div className="CBcheckboxsummary">
                                                           <input id='cbagreePqTerms' name="cbAgreePqTerms" type='hidden' value={this.state.CBAgreePqTerms} />
                                                           <input className={`CBcheckbox pre-checkbox `} id='cb-agreePqTerms' type="checkbox" value={this.state.CBAgreePqTerms} tabIndex="2" onChange={this.CBAgreePqTermsChange.bind(this)} />
                                                           <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                                       </div>
                                                   </div>
                                               </div>}
                                       </div>  <hr className="hr-size hr" /> </span> : ''
                                   }
                                   <div>
                                       <div className="row">
                                           <a className="col-sm-6 credit-soup-line-height summarypageLink" tabIndex="3" onClick={this.ShowLoanAppForm.bind(this)} ><i className="fa fa-edit edit-icon-size " style={{ fontSize: "15px" }} ></i>  <u>click here to edit your information</u> </a>
                                       </div>
                                   </div>
                               </div>
                               <input type="hidden" name="request" value={this.state.UpdatedData} />
                               <input type="hidden" name="formSubmissionCount" value={this.props.formFields.formSubmissionCount} />
                               </span> 
                               :
                            //    :  Mobile UI started for Summary page
                               <span> 
                               <div className="summaryPage-leftalign summaryPage-border">
                                   <span><h4 className="loantitle">Loan Information</h4></span>
                                   <div className="offerdetail offerdetailborder">
                                    <div className="row">
                                    <input type="hidden" name="request" value={this.state.UpdatedData} />
                                    <input type="hidden" name="formSubmissionCount" value={this.props.formFields.formSubmissionCount} />
                                           {/* <input type="hidden" name="lenderName" value={this.props.PostDataFull.borrowers[0].offerData.lenderName} />
                                           <input type="hidden" name="loanAmount" value={this.props.PostDataFull.borrowers[0].offerData.loanAmount} />     */}
                                           <div className="col-sm-6 col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Lender Name:</b> </div>
                                           <div className="col-sm-6  col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[0].offerData.lenderName}</b></div>
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Loan amount:</b> </div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[0].offerData.loanAmount)}`}</b></div>            
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="APR" value={this.props.PostDataFull.borrowers[0].offerData.APR} />
                                           <input type="hidden" name="term" value={this.props.PostDataFull.borrowers[0].offerData.term} /> 
                                           <input type="hidden" name="monthlyPayment" value={this.props.PostDataFull.borrowers[0].offerData.monthlyPayment} /> */}
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> APR:</b> </div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" > <b>{this.props.PostDataFull.borrowers[0].offerData.APR} &#x25;</b></div>
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Term:</b></div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[0].offerData.term/24} Years</b></div>    
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Monthly Payment:</b></div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[0].offerData.monthlyPayment)}`}</b></div>                        
                                       </div> 
                                   </div>                              
                                   <span><h4 className="summaryPage-leftalign">Primary Borrower Information</h4></span>
                                   <div className="primarydetails">                                                
                                       
                                       <div className="row">
                                           {/* <input type="hidden" name="firstName" value={this.props.PostDataFull.borrowers[0].firstName} />
                                           <input type="hidden" name="lastname" value={this.props.PostDataFull.borrowers[0].lastName} /> */}
                                           <div className="col-sm-3 col-xs-5 summarypage-margin-zero" ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-sm-3 col-xs-7 summarypage-margin-zero" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[0].firstName)}`}</b></div>
                                           <div className="col-sm-3 col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-sm-3 col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[0].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="emailAddress" value={this.props.PostDataFull.borrowers[0].emailAddress} />
                                       <input type="hidden" name="phonenumber" value={unMaskPhone(this.props.PostDataFull.borrowers[0].primaryPhoneNumber)} /> */}
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Email Address:</b> </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b><u>{this.props.PostDataFull.borrowers[0].emailAddress}</u></b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{GetPhoneMask(this.props.PostDataFull.borrowers[0].primaryPhoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundBorrower">
                                           {/* <input type="hidden" name="address1" value={this.props.PostDataFull.borrowers[0].address1} />
                                           <input type="hidden" name="address2" value={this.props.PostDataFull.borrowers[0].address2} /> */}
                                           <div className=" col-xs-5 address-back-margin" ><b className="labelstyle1"> Address1:</b></div>
                                           <div className=" col-xs-7 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataFull.borrowers[0].address1}</b></div>
                                           <div className=" col-xs-5 address-back-margin" ><b className="labelstyle2" > Address2:</b>  </div>
                                           <div className=" col-xs-7 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataFull.borrowers[0].address2} &nbsp; </b></div>
                                       
                                            {/* <input type="hidden" name="city" value={this.props.PostDataFull.borrowers[0].city} />
                                           <input type="hidden" name="state" value={this.props.PostDataFull.borrowers[0].state} />
                                           <input type="hidden" name="zip" value={this.props.PostDataFull.borrowers[0].zipCode} /> */}
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyle1"> City:</b> </div>
                                           <div className=" col-xs-7 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataFull.borrowers[0].city}</b></div>
                                           <div className=" col-xs-5 address-back-margin" ><b className="labelstyle2"> State:</b> </div>
                                           <div className=" col-xs-7 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataFull.borrowers[0].state}</b></div>
                                           <div className=" col-xs-5 address-back-margin " ><b className="labelstyle1"> Zip:</b>   </div>
                                           <div className=" col-xs-7 address-back-margin" ><b className="labeladdressvalue">{this.props.PostDataFull.borrowers[0].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="housingStatus" value={(this.props.PostDataFull.borrowers[0].housingStatus)} />
                                           <input type="hidden" name="housingPayment" value={this.props.PostDataFull.borrowers[0].housingPayment} /> */}
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{this.getHousingLabel(this.props.PostDataFull.borrowers[0].housingStatus) ? this.getHousingLabel(this.props.PostDataFull.borrowers[0].housingStatus) : '-'}</b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[0].housingPayment ? `$${AmountFormatting(this.props.PostDataFull.borrowers[0].housingPayment)}` : '-'}</b></div>
                                       </div>
                                       <div className="row">
                                            {/* <input type="hidden" name="creditScore" value={this.props.PostDataFull.borrowers[0].creditScore} />
                                           <input type="hidden" name="dateOfBirth" value={this.props.PostDataFull.borrowers[0].dateOfBirth} /> */}
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataFull.borrowers[0].creditScore)}</b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{convertDateFormat(this.props.PostDataFull.borrowers[0].dateOfBirth,"YYYY-MM-DD","MM/DD/YYYY")}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="ssn" value={this.props.PostDataFull.borrowers[0].ssn} />
                                           <input type="hidden" name="annualIncome" value={this.props.PostDataFull.borrowers[0].annualIncome} /> */}
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">SSN:</b></div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{`XXX-XX-${this.props.PostDataFull.borrowers[0].ssn !== null && this.props.PostDataFull.borrowers[0].ssn !== undefined && this.props.PostDataFull.borrowers[0].ssn.length > 4 ? this.props.PostDataFull.borrowers[0].ssn.substr(this.props.PostDataFull.borrowers[0].ssn.length - 4) : this.props.PostDataFull.borrowers[0].ssn}`}</b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[0].annualIncome)}`}</b></div>
                                       </div>                                            
                                   </div>
                                   <span><h4 className="summaryPage-leftalign summarypage-textindent employmentText">Employment Information</h4></span>
                                   <div className="employerdetail">
                                       
                                       <div className="row">
                                           {/* <input type="hidden" name="employerName" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName} />
                                           <input type="hidden" name="position" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].position} /> */}
                                           <div className=" col-xs-5 emptext " ><b className="labelstyle "> Employer Name:</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[0].employmentInformation[0].employerName)}`}</b></div>
                                           <div className=" col-xs-5 emptext" ><b className="labelstyle ">Position / Title:</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{this.props.PostDataFull.borrowers[0].employmentInformation[0].position}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="startDate" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].startDate} />
                                           <input type="hidden" name="endDate" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate} /> */}
                                           <div className=" col-xs-5 emptext " ><b className="labelstyle"> Start Date:</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{this.props.PostDataFull.borrowers[0].employmentInformation[0].startDate}</b></div>
                                           <div className=" col-xs-5 emptext " ><b className="labelstyle"> End Date:&nbsp;</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate ? this.props.PostDataFull.borrowers[0].employmentInformation[0].endDate : 'Present'}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="salaryAmount" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryAmount} />
                                           <input type="hidden" name="salaryPeriod" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryPeriod} /> */}
                                           <div className="col-xs-5 emptext " ><b className="labelstyle"> Salary Amount:&nbsp;</b> </div>
                                           <div className="col-xs-7 emptextvalue" ><b>{`${AmountFormatting(this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryAmount)}`}</b></div>
                                           <div className="col-xs-5 emptext " ><b className="labelstyle"> Salary Period:&nbsp;</b></div>
                                           <div className="col-xs-7 emptextvalue" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[0].employmentInformation[0].salaryPeriod)}`}</b></div>
                                       </div>
                                       <div className="row address-background">
                                           {/* <input type="hidden" name="employerAddress1" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress1} />
                                           <input type="hidden" name="employerAddress2" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerAddress2} /> */}
                                           <div className="col-xs-5  " ><b className="labelemploymentaddress"> Address1:</b>  </div>
                                           <div className="col-xs-7 " ><b className="labelemploymentaddressvalue">{address1}</b></div>
                                           <div className="col-xs-5 " ><b className="labelempaddress2"> Address 2:</b></div>
                                           <div className="col-xs-7 " ><b className="labelempaddressvalue2">{address2}&nbsp;</b></div>
                                        
                                           {/* <input type="hidden" name="employerCity" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerCity} />
                                           <input type="hidden" name="employerState" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerState} />
                                           <input type="hidden" name="employerZipCode" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerZipCode} /> */}
                                           <div className="col-xs-5  " ><b className="labelemploymentaddress"> City:</b>  </div>
                                           <div className="col-xs-7 " ><b className="labelemploymentaddressvalue">{city}</b></div>
                                           <div className="col-xs-5  " ><b className="labelempaddress2"> State:</b> </div>
                                           <div className="col-xs-7 " ><b className="labelempaddressvalue2">{state}</b></div>
                                           <div className="col-xs-5  " ><b className="labelemploymentaddress"> Zip:</b> </div>
                                           <div className="col-xs-7 " ><b className="labelemploymentaddressvalue">{zip}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="employmentStatus" value={this.props.PostDataFull.borrowers[0].employmentStatus} />
                                           <input type="hidden" name="employerPhoneNumber" value={this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber} /> */}
                                           <div className="col-xs-7 emptext" ><b className="labelstyle">Employment Status:</b> </div>
                                           <div className="col-xs-5 emptextvalue" ><b className="empstatus">{this.getEmploymentLabel(this.props.PostDataFull.borrowers[0].employmentStatus)}</b></div>
                                           <div className="col-xs-6 emptext" ><b className="labelstyle"> Phone Number:</b> </div>
                                           <div className="col-xs-6 emptextvalue" ><b className="empphone">{this.props.PostDataFull.borrowers[0].employmentInformation[0].employerPhoneNumber}</b></div>
                                       </div>                                           

                                   </div>
                                   {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                       <div className="row">
                                           <div className="col-md-12">
                                               <div className="checkboxsummary">
                                                   <input id='agreePqTerms' name="agreePqTerms" type='hidden' value={this.state.AgreePqTerms} />
                                                   <input className={`checkbox pre-checkbox `} id='brAgreePqTerms' type="checkbox" value={this.state.AgreePqTerms} tabIndex="4" onChange={this.AgreePqTermsChange.bind(this)} />
                                                   <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                               </div>
                                           </div>
                                       </div>}
                                   <hr className="hr-size hr" />
                                   {this.props.PostDataFull.borrowers.length > 1 ? <span>
                                       <span><h4 className="summaryPage-leftalign">Co-Borrower Information</h4></span>
                                       <div className="Coborrowerdetail">
                                       <div className="row">
                                           {/* <input type="hidden" name="cbFirstName" value={this.props.PostDataFull.borrowers[1].firstName} />
                                           <input type="hidden" name="cbLastName" value={this.props.PostDataFull.borrowers[1].lastName} /> */}
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataFull.borrowers[1].firstName)}`}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[1].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="cbEmail" value={this.props.PostDataFull.borrowers[1].emailAddress} />
                                       <input type="hidden" name="cbphoneNumber" value={unMaskPhone(this.props.PostDataFull.borrowers[1].primaryPhoneNumber)} /> */}
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle">Email Address:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b><u>{this.props.PostDataFull.borrowers[1].emailAddress}</u></b></div>
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{GetPhoneMask(this.props.PostDataFull.borrowers[1].primaryPhoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                           {/* <input type="hidden" name="cbStreetAddress" value={this.props.PostDataFull.borrowers[1].address1} />
                                           <input type="hidden" name="cbAppartment" value={this.props.PostDataFull.borrowers[1].address2} /> */}
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB1"> Address1:</b></div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue">{this.props.PostDataFull.borrowers[1].address1}</b></div>
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB2"> Address2:</b>  </div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue2">{this.props.PostDataFull.borrowers[1].address2}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                            {/* <input type="hidden" name="cbCity" value={this.props.PostDataFull.borrowers[1].city} />
                                           <input type="hidden" name="cbState" value={this.props.PostDataFull.borrowers[1].state} />
                                           <input type="hidden" name="cbZipCode" value={this.props.PostDataFull.borrowers[1].zipCode} /> */}
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB1"> City:</b> </div>
                                           <div className="col-xs-7 address-back-margin " ><b className="labelCBaddressvalue">{this.props.PostDataFull.borrowers[1].city}</b></div>
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB2"> State:</b>  </div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue2">{this.props.PostDataFull.borrowers[1].state}</b></div>
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB1"> Zip:</b>   </div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue">{this.props.PostDataFull.borrowers[1].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       {/* <input type="hidden" name="cbHousing" value={(this.props.PostDataFull.borrowers[1].housingStatus)} />
                                           <input type="hidden" name="cbhousingPayment" value={this.props.PostDataFull.borrowers[1].housingPayment} /> */}
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b>{this.getHousingLabel(this.props.PostDataFull.borrowers[1].housingStatus) ? this.getHousingLabel(this.props.PostDataFull.borrowers[1].housingStatus) : '-'}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataFull.borrowers[1].housingPayment ? `$${AmountFormatting(this.props.PostDataFull.borrowers[1].housingPayment)}` : '-'}</b></div>
                                       </div>
                                       <div className="row">
                                            {/* <input type="hidden" name="cbcreditScore" value={this.props.PostDataFull.borrowers[1].creditScore} />
                                           <input type="hidden" name="cbdateOfBirth" value={this.props.PostDataFull.borrowers[1].dateOfBirth} /> */}
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataFull.borrowers[1].creditScore)}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{convertDateFormat(this.props.PostDataFull.borrowers[1].dateOfBirth,"YYYY-MM-DD","MM/DD/YYYY")}</b></div>
                                       </div>
                                       <div className="row">
                                           {/* <input type="hidden" name="cbSsn" value={this.props.PostDataFull.borrowers[1].ssn} />
                                           <input type="hidden" name="cbAnnualIncome" value={this.props.PostDataFull.borrowers[1].annualIncome} /> */}
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">SSN:</b></div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b>{`XXX-XX-${this.props.PostDataFull.borrowers[1].ssn !== null && this.props.PostDataFull.borrowers[1].ssn !== undefined && this.props.PostDataFull.borrowers[1].ssn.length > 4 ? this.props.PostDataFull.borrowers[1].ssn.substr(this.props.PostDataFull.borrowers[1].ssn.length - 4) : this.props.PostDataFull.borrowers[1].ssn}`}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataFull.borrowers[1].annualIncome)}`}</b></div>
                                       </div>                                                
                                     
                                           {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                               <div className="row">
                                                   <div className="col-md-12">
                                                       <div className="CBcheckboxsummary">
                                                           <input id='cbagreePqTerms' name="cbAgreePqTerms" type='hidden' value={this.state.CBAgreePqTerms} />
                                                           <input className={`CBcheckbox pre-checkbox `} id='cb-agreePqTerms' type="checkbox" value={this.state.CBAgreePqTerms} tabIndex="5" onChange={this.CBAgreePqTermsChange.bind(this)} />
                                                           <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                                       </div>
                                                   </div>
                                               </div>}
                                       </div>  <hr className="hr-size hr" /> </span> : ''
                                   }
                                   <div>
                                       <div className="row">
                                           <a className="col-sm-6 credit-soup-line-height summarypageLink" tabIndex="6" onClick={this.ShowLoanAppForm.bind(this)} ><i className="fa fa-edit edit-icon-size " style={{ fontSize: "15px" }} ></i>  <u>click here to edit your information</u> </a>
                                       </div>
                                   </div>
                               </div>
                               </span> }
                               </span>
                                    :
                                    (!this.state.IsSummaryPage && this.state.IsSummaryPageEdit) ?
                                        <span>
                                            <input type="hidden" name="request" value={this.state.UpdatedData} />
                                            <input type="hidden" name="formSubmissionCount" value={this.props.formFields.formSubmissionCount} />
                                            <hr className="hr-size hr"/>
                                            <h4 className="summaryPage-leftalign-edit">Primary Borrower Information</h4>
                                            <div className="row">
                                                <TextField formFields={formFields.LegalName}
                                                    handleChangeEvent={this.handleFirstNameChange.bind(this)}
                                                    value={this.state.FirstNameValue}
                                                    showTitle={false}
                                                    showError={this.state.isFirstNameValid}
                                                    showErrorMessage={this.state.showFirstNameError}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="7"
                                                    name="firstName" columnStyle="col-sm-6 " controlCss="summarypage-form-control" />

                                                <TextField formFields={formFields.LastName}
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleLastNameChange.bind(this)}
                                                    value={this.state.LastNameValue}
                                                    showError={this.state.isLastNameValid}
                                                    showErrorMessage={this.state.showLastNameError}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="8"
                                                    name="lastName" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <TextField formFields={formFields.Emailaddress}
                                                    handleChangeEvent={this.handleEmailChange.bind(this)}
                                                    showTitle={false}
                                                    value={this.state.EmailValue}
                                                    isFocused={this.state.emailFocus}
                                                    showError={this.state.isEmailValid}
                                                    showErrorMessage={this.state.showEmailError}
                                                    showCodeErrorMessage={true}
                                                    name="emailAddress" disabled={this.state.initialEnabled}
                                                    tabIndex="9" inputType="email"
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <MaskedTextField formFields={formFields.PhoneNumber}
                                                    handleChangeEvent={this.handlePhoneNumberChange.bind(this)}
                                                    showTitle={false}
                                                    value={this.state.PhoneNumberValue}
                                                    showError={this.state.isPhoneNumberValid}
                                                    showErrorMessage={this.state.showPhoneNumberError}
                                                    showCodeErrorMessage={this.state.showPhoneNumberCodeError}
                                                    disabled={this.state.initialDisabled}
                                                    name="phoneNumber" tabIndex="10" customeMessage=''
                                                    fieldname="phoneNumber" AutoFocus={false}
                                                    inputType="tel" IsNumeric={true}
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <TextField formFields={formFields.HomeAddress}
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleStreedAddressChange.bind(this)}
                                                    value={this.state.StreedAddressValue}
                                                    showError={this.state.isStreedAddressValid}
                                                    showErrorMessage={this.state.showStreedAddressError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showAddressMessage}
                                                    name="address1" maxLength="50" disabled={this.state.initialDisabled}
                                                    tabIndex="11" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <TextField formFields={formFields.HomeAddressApartment}
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleApptChange.bind(this)}
                                                    value={this.state.ApptValue}
                                                    showError={this.state.isApptValid}
                                                    showErrorMessage={this.state.showApptError}
                                                    showCodeErrorMessage={true}
                                                    name="address2" maxLength="20" disabled={this.state.initialDisabled}
                                                    tabIndex="12" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <TextField formFields={formFields.HomeAddressCity}
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleCityChange.bind(this)}
                                                    value={this.state.CityValue}
                                                    showError={this.state.isCityValid}
                                                    showErrorMessage={this.state.showCityError}
                                                    showCodeErrorMessage={true} customeMessage=''
                                                    name="city" maxLength="30" disabled={this.state.initialDisabled}
                                                    tabIndex="13" columnStyle="col-sm-5" controlCss="summarypage-form-control" />

                                                <SelectField columnStyle="col-sm-4"
                                                    OnDropdownClick={this.onStateClick.bind(this)}
                                                    GetActiveLabel={this.getStateLabel}
                                                    SelectedValue={this.state.selectedState}
                                                    ShowHideList={this.showHideStateList}
                                                    DisplayItem={this.state.displayStateItems}
                                                    ListData={stateList}
                                                    HandleSelectedOption={this.handleStateChange.bind(this)}
                                                    formFields={formFields.HomeAddressState}
                                                    showError={this.state.isStateValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="14" controlCss="summarypage-form-control"
                                                    name="state" />
                                                <TextField formFields={formFields.HomeAddressZipcode}
                                                    handleChangeEvent={this.handleZipcodeChange.bind(this)}
                                                    value={this.state.ZipcodeValue}
                                                    showError={this.state.isZipcodeValid}
                                                    showErrorMessage={this.state.showZipcodeError}
                                                    showCodeErrorMessage={true} IsNumeric={true}
                                                    inputType="tel" customeMessage=''
                                                    name="zipCode" maxLength="5" disabled={this.state.initialDisabled}
                                                    tabIndex="15" columnStyle="col-sm-3" showTitle={false}
                                                    controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <SelectField columnStyle="col-sm-6"
                                                    OnDropdownClick={this.onHousingClick.bind(this)}
                                                    GetActiveLabel={this.getHousingLabel}
                                                    SelectedValue={this.state.selectedHousing}
                                                    ShowHideList={this.showHideHousingList}
                                                    DisplayItem={this.state.displayHousingItems}
                                                    ListData={housingList}
                                                    HandleSelectedOption={this.handleHousingChange.bind(this)}
                                                    formFields={formFields.Housing}
                                                    showError={this.state.isHousingValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="16" showTitle={false}
                                                    name="housingStatus" controlCss="summarypage-form-control" />

                                                {/* <input type="hidden" name="housingPayment" value={this.state.PlainHousingPayment} /> */}
                                                <TextField formFields={formFields.HousingPayment}
                                                    handleChangeEvent={this.handleHousingPaymentChange.bind(this)}
                                                    value={this.state.HousingPaymentValue}
                                                    showError={this.state.isHousingPaymentValid}
                                                    showErrorMessage={this.state.showHousingPaymentError}
                                                    showCodeErrorMessage={this.state.showHousingPaymentCodeError}
                                                    disabled={this.state.housingPaymentDisabled}
                                                    name="" showTitle={false}
                                                    fieldname="housingPayment"
                                                    inputType="tel" IsNumeric={true}
                                                    tabIndex="17" columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                            </div>
                                            <div className="row">
                                                <SelectField columnStyle="col-sm-6"
                                                    OnDropdownClick={this.onEstimatedCreditScoreClick.bind(this)}
                                                    GetActiveLabel={this.getEstimatedCreditScoreLabel}
                                                    SelectedValue={this.state.selectedEstimatedCreditScore}
                                                    ShowHideList={this.showHideEstimatedCreditScoreList}
                                                    DisplayItem={this.state.displayEstimatedCreditScoreItems}
                                                    ListData={estimatedCreditScoreList}
                                                    HandleSelectedOption={this.handleEstimatedCreditScoreChange.bind(this)}
                                                    formFields={formFields.EstimatedCreditScore}
                                                    showError={this.state.isEstimatedCreditScoreValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="18" showTitle={false}
                                                    name="creditScore" controlCss="summarypage-form-control" />
                                                <MaskedTextField formFields={formFields.BirthDate}
                                                    handleChangeEvent={this.handleBirthdateChange.bind(this)}
                                                    value={this.state.BirthdateValue}
                                                    showError={this.state.isBirthdateValid}
                                                    showErrorMessage={this.state.showBirthdateError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                    name="dateOfBirth" disabled={this.state.initialDisabled}
                                                    fieldname="dateOfBirth"
                                                    tabIndex="19" IsNumeric={true}
                                                    inputType="tel" showTitle={false}
                                                    columnStyle="col-sm-6" maxLength="10" controlCss="summarypage-form-control" />
                                                
                                            </div>

                                            <div className="row">
                                                 {/* <input type="hidden" name="cssn" value={this.state.PlainSSN} /> */}
                                                <MaskedTextField formFields={formFields.ProvideSSN}
                                                    handleChangeEvent={this.handleProvideSSNChange.bind(this)}
                                                    value={this.state.ProvideSSNValue}
                                                    showError={this.state.isProvideSSNValid}
                                                    showErrorMessage={this.state.showProvideSSNError}
                                                    showCodeErrorMessage={true} IsNumeric={true}
                                                    disabled={this.state.initialDisabled}
                                                    customeMessage='' fieldname="SSN" showTitle={false}
                                                    tabIndex="20" min="9" max="9" name="ssn"
                                                    inputType="password" inputMode="numeric"
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                                {/* <input type="hidden" id="annualIncome" name="annualIncome" value={this.state.PlainAnnualIncome} /> */}
                                                {/* <input type="hidden" name="agreePqTerms" value={this.state.AgreePqTerms} /> */}
                                                {/* <input type="hidden" name="agreeTCPA" value={this.state.AgreeTCPA} /> */}
                                                <TextField formFields={formFields.AnnualIncome}
                                                    handleChangeEvent={this.handleAnnualIncomeChange.bind(this)}
                                                    value={this.state.AnnualIncomeValue}
                                                    isFocused={this.state.annualIncomeFocus}
                                                    showTooltip={true} customeMessage={this.state.showAIMessage}
                                                    showError={this.state.isAnnualIncomeValid}
                                                    showErrorMessage={this.state.showAnnualIncomeError}
                                                    showCodeErrorMessage={this.state.showAnnualIncomeMinError}
                                                    disabled={this.state.initialDisabled} IsNumeric={true}
                                                    maxLength="12" tabIndex="21" inputType="tel"
                                                    fieldname={`annualIncome`} showTitle={false} name="annualIncome"
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                                
                                            </div>

                                            <h4 className="summaryPage-leftalign-edit">Employment Information</h4>
                                            <div className="row">
                                                <TextField formFields={formFields.EmployerName}
                                                    handleChangeEvent={this.handleEmployerNameChange.bind(this)}
                                                    value={this.state.EmployerNameValue}
                                                    showError={this.state.isEmployerNameValid}
                                                    showErrorMessage={this.state.showEmployerNameError}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="22" customeMessage={this.state.showDOBMessage}
                                                    name="employerName" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <TextField formFields={formFields.Position}
                                                    handleChangeEvent={this.handlePositionChange.bind(this)}
                                                    value={this.state.PositionValue}
                                                    showError={this.state.isPositionValid}
                                                    showErrorMessage={this.state.showPositionError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="23" controlCss="summarypage-form-control"
                                                    name="position" columnStyle="col-sm-6" showTitle={false} />
                                            </div>
                                            <div className="row">

                                                <MaskedTextField formFields={formFields.StartDate}
                                                    handleChangeEvent={this.handleStartDateChange.bind(this)}
                                                    value={this.state.StartDateValue}
                                                    showError={this.state.isStartDateValid}
                                                    showErrorMessage={this.state.showStartDateError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                    disabled={this.state.initialEnabled}
                                                    tabIndex="24"
                                                    fieldname="startDate" maxLength="10" IsNumeric={true}
                                                    inputType="tel" controlCss="summarypage-form-control"
                                                    name="startDate" columnStyle="col-sm-6" showTitle={false} />
                                                
                                                <MaskedTextField formFields={formFields.EndDate}
                                                   IsCheckboxChecked={this.state.EditEndDateCheckBoxChecked}
                                                    handleChangeEvent={this.handleEndDateChange.bind(this)}
                                                    handleCheckboxEvent={this.handleEndDateCheckBoxEvent.bind(this)} 
                                                    disabled= {this.state.EndDateDisabled}
                                                    value={this.state.EndDateValue}
                                                    showError={this.state.isEndDateValid}
                                                    showErrorMessage={this.state.showEndDateError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                    maxLength="10" 
                                                    tabIndex="25" IsNumeric={true}
                                                    fieldname="endDate" inputType="tel" controlCss="summarypage-form-control"
                                                    name="endDate" columnStyle="col-sm-6" showTitle={false} />
                                            </div>
                                            <div className="row">
                                                <TextField formFields={formFields.SalaryAmount}
                                                    handleChangeEvent={this.handleSalaryAmountChange.bind(this)}
                                                    value={this.state.SalaryAmountValue}
                                                    isFocused={this.state.salaryAmountFocus}
                                                    showTooltip={true} customeMessage={this.state.showSAmountMessage}
                                                    showError={this.state.isSalaryAmountValid}
                                                    showErrorMessage={this.state.showSalaryAmountError}
                                                    showCodeErrorMessage={this.state.showSalaryAmountMinError}
                                                    disabled={this.state.initialDisabled} IsNumeric={true}
                                                    maxLength="12" tabIndex="26" inputType="tel"
                                                    fieldname={`salaryAmount`} showTitle={false} name="salaryAmount"
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <SelectField columnStyle="col-sm-6"
                                                    OnDropdownClick={this.onSalaryPeriodClick.bind(this)}
                                                    GetActiveLabel={this.getSalaryPeriodLabel}
                                                    SelectedValue={this.state.SalaryPeriodValue}
                                                    ShowHideList={this.showHideSalaryPeriodList}
                                                    //DisplayItem={this.state.displayEmploymentItems}
                                                    ListData={salaryPeriod}
                                                    HandleSelectedOption={this.handleSalaryPeriodChange.bind(this)}
                                                    formFields={formFields.SalaryFrequency}
                                                    showError={this.state.isSalaryPeriodValid}
                                                    showErrorMessage={this.state.showSalaryPeriodError}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="27" showTitle={false}
                                                    name="salaryPeriod" controlCss="summarypage-form-control" />
                                            </div>
                                            <div className="row">
                                                <TextField formFields={formFields.EmployerAddress1}
                                                    handleChangeEvent={this.handleEmployerAddress1Change.bind(this)}
                                                    value={this.state.EmployerAddress1Value}
                                                    showError={this.state.isEmployerAddress1Valid}
                                                    showErrorMessage={this.state.showEmployerAddress1Error}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="28" controlCss="summarypage-form-control"
                                                    name="employerAddress1" columnStyle="col-sm-6 " showTitle={false} />

                                                <TextField formFields={formFields.EmployerAddress2}

                                                    handleChangeEvent={this.handleEmployerAddress2Change.bind(this)}
                                                    value={this.state.EmployerAddress2Value}
                                                    showError={this.state.isEmployerAddress2Valid}
                                                    showErrorMessage={this.state.showEmployerAddress2Error}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="29" controlCss="summarypage-form-control"
                                                    name="employerAddress2" columnStyle="col-sm-6" showTitle={false} />
                                            </div>
                                            <div className="row">

                                                <TextField formFields={formFields.EmployerCity}
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleEmployerAddress1CityChange.bind(this)}
                                                    value={this.state.EmployerAddress1CityValue}
                                                    showError={this.state.isEmployerAddress1CityValid}
                                                    showErrorMessage={this.state.showEmployerAddress1CityError}
                                                    showCodeErrorMessage={true} customeMessage=''
                                                    maxLength="30" disabled={this.state.initialEnabled}
                                                    tabIndex="30" controlCss="summarypage-form-control"
                                                    name="employerCity" columnStyle="col-sm-5" />

                                                <SelectField columnStyle="col-sm-4"
                                                    OnDropdownClick={this.onemployerStateClick.bind(this)}
                                                    GetActiveLabel={this.getemployerStateLabel}
                                                    SelectedValue={this.state.EmployerAddress1StateValue}
                                                    ShowHideList={this.employershowHideStateList}
                                                    DisplayItem={this.state.displayStateItems}
                                                    ListData={stateList}
                                                    HandleSelectedOption={this.handleEmployerAddress1StateChange.bind(this)}
                                                    formFields={formFields.EmployerState}
                                                    showError={this.state.isEmployerAddress1StateValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="31" controlCss="summarypage-form-control"
                                                    name="employerState" showTitle={false} />

                                                <TextField formFields={formFields.EmployerZipCode}
                                                    handleChangeEvent={this.handleEmployerAddress1ZipcodeChange.bind(this)}
                                                    value={this.state.EmployerAddress1ZipcodeValue}
                                                    showError={this.state.isEmployerAddress1ZipcodeValid}
                                                    showErrorMessage={this.state.showEmployerAddress1ZipcodeError}
                                                    showCodeErrorMessage={true} customeMessage='' IsNumeric={true}
                                                    inputType="tel"
                                                    maxLength="5" disabled={this.state.initialEnabled}
                                                    tabIndex="32" controlCss="summarypage-form-control"
                                                    name="employerZipCode" columnStyle="col-sm-3" showTitle={false} />
                                            </div>
                                            <div className="row">
                                                <SelectField columnStyle="col-sm-6"
                                                    OnDropdownClick={this.onEmploymentClick.bind(this)}
                                                    GetActiveLabel={this.getEmploymentLabel}
                                                    SelectedValue={this.state.selectedEmployment}
                                                    ShowHideList={this.showHideEmploymentList}
                                                    DisplayItem={this.state.displayEmploymentItems}
                                                    ListData={employmentList}
                                                    HandleSelectedOption={this.handleEmploymentChange.bind(this)}
                                                    formFields={formFields.Employment}
                                                    showError={this.state.isEmploymentValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="33" showTitle={false}
                                                    name="employmentStatus" controlCss="summarypage-form-control" />
                                                <MaskedTextField formFields={formFields.EmployerPhoneNumber}
                                                    handleChangeEvent={this.handleWorkPhonenumberChange.bind(this)}
                                                    value={this.state.EmployerPhoneNumberValue}
                                                    showError={this.state.isEmployerPhoneNumbervalid}
                                                    showErrorMessage={this.state.showEmployerphonenumberError}
                                                    showCodeErrorMessage={this.state.showPhoneNumberCodeError} customeMessage=''
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="34" inputType="tel" IsNumeric={true}
                                                    fieldname="employerPhoneNumber" controlCss="summarypage-form-control"
                                                    name="employerPhoneNumber" columnStyle="col-sm-6" showTitle={false} />
                                            </div>
                                            {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="checkbox">
                                                                <input id='agreePqTerms' name="agreePqTerms" type='hidden' value={this.state.AgreePqTerms} />
                                                                <input className={`checkbox pre-checkbox `} id='brAgreePqTerms' type="checkbox" value={this.state.AgreePqTerms} tabIndex="24" onChange={this.AgreePqTermsChange.bind(this)} />
                                                                <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                                            </div>
                                                        </div>
                                            </div>}
                                            <hr className="hr-size hr" />
                                        </span> : ''}
                                       

                                {(!this.state.IsSummaryPage && this.state.IsSummaryPageEdit && this.props.PostDataFull.borrowers.length > 1) ?
                                    <span>
                                        <h4 className="summaryPage-leftalign-edit">Co-Borrower Information</h4>
                                        <div className="row">
                                            <TextField formFields={formFields.CBFirstName}
                                                handleChangeEvent={this.handleCBFirstNameChange.bind(this)}
                                                value={this.state.CBFirstNameValue}
                                                showTitle={false}
                                                showError={this.state.isCBFirstNameValid}
                                                showErrorMessage={this.state.showCBFirstNameError}
                                                showCodeErrorMessage={true}
                                                maxLength="50" disabled={this.state.initialEnabled}
                                                tabIndex="35"
                                                name="cbFirstName" columnStyle="col-sm-6 " controlCss="summarypage-form-control" />

                                            <TextField formFields={formFields.CBLastName}
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBLastNameChange.bind(this)}
                                                value={this.state.CBLastNameValue}
                                                showError={this.state.isCBLastNameValid}
                                                showErrorMessage={this.state.showCBLastNameError}
                                                showCodeErrorMessage={true}
                                                maxLength="50" disabled={this.state.initialEnabled}
                                                tabIndex="36"
                                                name="cbLastName" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <TextField formFields={formFields.CBEmailaddress}
                                                handleChangeEvent={this.handleCBEmailChange.bind(this)}
                                                showTitle={false}
                                                value={this.state.CBEmailValue}
                                                isFocused={this.state.CBemailFocus}
                                                showError={this.state.isCBEmailValid}
                                                showErrorMessage={this.state.showCBEmailError}
                                                showCodeErrorMessage={true}
                                                name="cbEmail" disabled={this.state.initialEnabled}
                                                tabIndex="37" inputType="email"
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            <MaskedTextField formFields={formFields.CBPhoneNumber}
                                                handleChangeEvent={this.handleCBPhoneNumberChange.bind(this)}
                                                showTitle={false}
                                                value={this.state.CBPhoneNumberValue}
                                                showError={this.state.isCBPhoneNumberValid}
                                                showErrorMessage={this.state.showCBPhoneNumberError}
                                                showCodeErrorMessage={this.state.showCBPhoneNumberCodeError}
                                                disabled={this.state.initialDisabled}
                                                name="cbphoneNumber" tabIndex="38" customeMessage=''
                                                fieldname="phoneNumber" AutoFocus={false}
                                                inputType="tel" IsNumeric={true}
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <TextField formFields={formFields.CBHomeAddress}
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBStreetAddressChange.bind(this)}
                                                value={this.state.CBStreetAddressValue}
                                                showError={this.state.isCBStreetAddressValid}
                                                showErrorMessage={this.state.showCBStreetAddressError}
                                                showCodeErrorMessage={true} customeMessage={this.state.showAddressMessage}
                                                name="cbStreetAddress" maxLength="50" disabled={this.state.initialDisabled}
                                                id="CBHomeAddress"
                                                tabIndex="39" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            <TextField formFields={formFields.CBHomeAddressApartment}
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBApptChange.bind(this)}
                                                value={this.state.CBApptValue}
                                                showError={this.state.isCBApptValid}
                                                showErrorMessage={this.state.showCBApptError}
                                                showCodeErrorMessage={true}
                                                name="cbAppartment" maxLength="20" disabled={this.state.initialDisabled}
                                                tabIndex="40" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <TextField formFields={formFields.CBHomeAddressCity}
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBCityChange.bind(this)}
                                                value={this.state.CBCityValue}
                                                showError={this.state.isCBCityValid}
                                                showErrorMessage={this.state.showCBCityError}
                                                showCodeErrorMessage={true} customeMessage=''
                                                name="cbCity" maxLength="30" disabled={this.state.initialDisabled}
                                                tabIndex="41" columnStyle="col-sm-5" controlCss="summarypage-form-control" />

                                            <SelectField columnStyle="col-sm-4"
                                                OnDropdownClick={this.onCBStateClick.bind(this)}
                                                GetActiveLabel={this.getCBStateLabel}
                                                showTitle={false}
                                                SelectedValue={this.state.CBselectedState}
                                                ShowHideList={this.showHideCBStateList}
                                                DisplayItem={this.state.displayStateItems}
                                                ListData={stateList}
                                                HandleSelectedOption={this.handleCBStateChange.bind(this)}
                                                formFields={formFields.CBHomeAddressState}
                                                showError={this.state.isCBStateValid}
                                                disabled={this.state.initialDisabled}
                                                tabIndex="42" controlCss="summarypage-form-control"
                                                name="cbState" />
                                            <TextField formFields={formFields.CBHomeAddressZipcode}
                                                handleChangeEvent={this.handleCBZipcodeChange.bind(this)}
                                                value={this.state.CBZipcodeValue}
                                                showError={this.state.isCBZipcodeValid}
                                                showErrorMessage={this.state.showCBZipcodeError}
                                                showCodeErrorMessage={true} IsNumeric={true}
                                                inputType="tel" customeMessage=''
                                                name="cbZipCode" maxLength="5" disabled={this.state.initialDisabled}
                                                tabIndex="43" columnStyle="col-sm-3" showTitle={false}
                                                controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <SelectField columnStyle="col-sm-6"
                                                OnDropdownClick={this.onCBHousingClick.bind(this)}
                                                GetActiveLabel={this.getCBHousingLabel}
                                                SelectedValue={this.state.CBselectedHousing}
                                                ShowHideList={this.showHideCBHousingList}
                                                DisplayItem={this.state.displayHousingItems}
                                                ListData={housingList}
                                                HandleSelectedOption={this.handleCBHousingChange.bind(this)}
                                                formFields={formFields.CBHousing}
                                                showError={this.state.isCBHousingValid}
                                                disabled={this.state.initialDisabled}
                                                tabIndex="44" showTitle={false}
                                                name="cbHousing" controlCss="summarypage-form-control" />

                                            {/* <input type="hidden" name="cbhousingPayment" value={this.state.CBPlainHousingPayment} /> */}
                                            <TextField formFields={formFields.CBHousingPayment}
                                                handleChangeEvent={this.handleCBHousingPaymentChange.bind(this)}
                                                value={this.state.CBHousingPaymentValue}
                                                showError={this.state.isCBHousingPaymentValid}
                                                showErrorMessage={this.state.showCBHousingPaymentError}
                                                showCodeErrorMessage={this.state.showCBHousingPaymentCodeError}
                                                disabled={this.state.CBhousingPaymentDisabled}
                                                name="" showTitle={false}
                                                fieldname="housingPayment"
                                                inputType="tel" IsNumeric={true}
                                                tabIndex="45" columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                        </div>
                                        <div className="row">
                                            <SelectField columnStyle="col-sm-6"
                                                OnDropdownClick={this.onCBEstimatedCreditScoreClick.bind(this)}
                                                GetActiveLabel={this.getCBEstimatedCreditScoreLabel}
                                                SelectedValue={this.state.CBselectedEstimatedCreditScore}
                                                ShowHideList={this.showHideCBEstimatedCreditScoreList}
                                                DisplayItem={this.state.displayEstimatedCreditScoreItems}
                                                ListData={estimatedCreditScoreList}
                                                HandleSelectedOption={this.handleCBEstimatedCreditScoreChange.bind(this)}
                                                formFields={formFields.CBEstimatedCreditScore}
                                                showError={this.state.isCBEstimatedCreditScoreValid}
                                                disabled={this.state.initialDisabled}
                                                tabIndex="46" showTitle={false}
                                                name="cbcreditScore" controlCss="summarypage-form-control" />
                                            <MaskedTextField formFields={formFields.CBBirthDate}
                                                handleChangeEvent={this.handleCBBirthdateChange.bind(this)}
                                                value={this.state.CBBirthdateValue}
                                                showError={this.state.isCBBirthdateValid}
                                                showErrorMessage={this.state.showCBBirthdateError}
                                                showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                name="cbdateOfBirth" disabled={this.state.initialDisabled}
                                                fieldname="dateOfBirth"
                                                tabIndex="47" IsNumeric={true}
                                                inputType="tel" showTitle={false}
                                                columnStyle="col-sm-6" maxLength="10" controlCss="summarypage-form-control" />

                                            
                                        </div>
                                        <div className="row">
                                            {/* <input type="hidden" name="cssn" value={this.state.PlainSSN} /> */}
                                            <MaskedTextField formFields={formFields.CBProvideSSN}
                                                handleChangeEvent={this.handleCBProvideSSNChange.bind(this)}
                                                value={this.state.CBProvideSSNValue}
                                                showError={this.state.isCBProvideSSNValid}
                                                showErrorMessage={this.state.showCBProvideSSNError}
                                                showCodeErrorMessage={true} IsNumeric={true}
                                                disabled={this.state.initialDisabled}
                                                customeMessage='' fieldname="SSN" showTitle={false}
                                                tabIndex="48" min="9" max="9" name="cbSsn"
                                                inputType="password" inputMode="numeric"
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            {/* <input type="hidden" id="annualIncome" name="cbAnnualIncome" value={this.state.PlainAnnualIncome} /> */}
                                            {/* <input type="hidden" name="agreePqTerms" value={this.state.AgreePqTerms} /> */}
                                            {/* <input type="hidden" name="agreeTCPA" value={this.state.AgreeTCPA} /> */}
                                            <TextField formFields={formFields.CBAnnualIncome}
                                                handleChangeEvent={this.handleCBAnnualIncomeChange.bind(this)}
                                                value={this.state.CBAnnualIncomeValue}
                                                isFocused={this.state.CBannualIncomeFocus}
                                                showTooltip={true} customeMessage={this.state.showAIMessage}
                                                showError={this.state.isCBAnnualIncomeValid}
                                                showErrorMessage={this.state.showCBAnnualIncomeError}
                                                showCodeErrorMessage={this.state.showCBAnnualIncomeMinError}
                                                disabled={this.state.initialDisabled} IsNumeric={true}
                                                maxLength="12" tabIndex="49" inputType="tel"
                                                fieldname={`annualIncome`} showTitle={false} name="annualIncome"
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                            
                                        </div>
                                        {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="CBcheckbox">
                                                                <input id='cbagreePqTerms' name="cbAgreePqTerms" type='hidden' value={this.state.CBAgreePqTerms} />
                                                                <input className={`CBcheckbox pre-checkbox `} id='cb-agreePqTerms' type="checkbox" value={this.state.CBAgreePqTerms} tabIndex="50" onChange={this.CBAgreePqTermsChange.bind(this)} />
                                                                <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                                            </div>
                                                        </div>
                                         </div>}
                                         <hr className="hr-size hr" />
                                    </span> : ''}
                                   
                                {(this.state.IsIntercom || this.state.IsAcquireInteractive) && this.props.currentDevice !== 'Mobile' ?
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="checkbox">

                                                <input id='agreeTCPA' type='hidden' value={this.state.AgreeTCPA} name="agreeTCPA" />
                                                <input className="checkbox pre-checkbox" id='chk-agreeTCPA' type="checkbox" value={this.state.AgreeTCPA} tabIndex="51" onChange={this.AgreeTCPAChange.bind(this)} />
                                                {this.state.IsSummaryPage && this.state.IsSummaryPageEdit ?
                                                    <p className="formlist2">I agree to allow {this.props.ThemeConfig.theme_name} and its <a className="loan-app info-tooltip tooltip-width">
                                                        <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink"><b>{this.props.ThemeConfig.theme_name} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818'}  </span>
                                                        partners </a> to <a className="loan-app info-tooltip tooltip-width-call-text-me">
                                                            <span className="tooltiptext tooltiptext-call-text-me tooltip-top-margin-call-text-me">I authorize {this.props.ThemeConfig.theme_name} and its partner lenders, service providers, affiliates, and successors and assigns, to deliver telemarketing calls and text messages to each telephone number that I provide in connection with my inquiry and application for credit using an automatic telephone dialing system and/or a prerecorded or artificial voice message. I understand I am not required to provide this authorization as a condition of purchasing any property, goods or services. I certify that I have authority to provide this consent either because I am the subscriber of these telephone numbers or I am a non-subscriber customary user who has authority to consent to these communications. If I would like to revoke this consent, I agree to send an email to {'customerservice@primerates.com'} with "Phone Call Opt-Out" in the subject line.  </span>
                                                            call or text me </a> at the phone numbers I have provided to discuss my application for credit and for other marketing purposes. (optional)</p>
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div> : ''}
                                {!this.state.IsIntercom && !this.state.IsAcquireInteractive ?
                                    <center>
                                        <div className="row" id="formbutton">
                                            <div className="all-error-message">                                            
  
                                                    { !this.state.AgreePqTerms &&  !this.state.CBAgreePqTerms ? 
                                                        <p> <span className="formerror-agreement "> Please agree to terms and conditions</span> </p> : 
                                                        
                                                    !this.state.AgreePqTerms && this.state.CBAgreePqTerms ? 
                                                        <p> <span className="formerror-agreement "> Please agree to terms and conditions for Borrower </span> </p> :
                                                        this.props.PostDataFull.borrowers.length > 1 && !this.state.CBAgreePqTerms && this.state.AgreePqTerms ?   
                                                        <p> <span className="formerror-agreement "> Please agree to terms and conditions for Co-borrower </span> </p> : <p>&nbsp;</p> ?
                                                    <p>&nbsp;</p> : ''
                                                    }    
                                            </div>  
                                            <button type="submit" id="viewpreqoffers" name="viewpreqoffers" tabIndex="52" className="btn bc-primary" disabled={this.state.initialDisabled} onClick={this.Submit.bind(this)}>Submit Application</button>
                                            {this.state.showModal &&
                                                <div id="myModal" className={`modal ${this.state.showModal ? 'displayblock' : ''}`}>
                                                    <div className="modal-content">
                                                        <div className="wrapper loans">
                                                            <div className="trans-logo">
                                                                <img src={this.props.ThemeConfig.logo} alt="" />
                                                            </div>
                                                            <div className="trans-statment">
                                                                    <img src={this.props.configSettings.lockImage} alt="" />
                                                                    <h1>Submitting your full application information...</h1>
                                                                </div>

                                                            <div className={`${this.props.currentBrowser === 'safari' ? 'load-img-mobile-safari' : 'load-img'}`}>
                                                                <i className={`fa fa-refresh fa-spin ${this.props.currentBrowser === 'safari' ? ' safari ' : ''}`}></i>

                                                            </div>

                                                            <div className="website-text">
                                                                <p> {this.state.loaderContent}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {this.state.showInvalidAddressModal &&
                                                <div id="popupModal" className={`modal ${this.state.showInvalidAddressModal ? 'displayblock' : ''}`}>
                                                    <div className="modal-content">
                                                        <div className="wrapper state address-popup">
                                                            <div className="trans-statment">
                                                                <p>We have yet to open for business in your selected state. Please check back later.</p>
                                                            </div>
                                                            <button value="Close" id={`close`} name={`close`} className="btn btn-primary" onClick={this.closePopup.bind(this)} > CLOSE</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {this.state.showStateLoanAmountModal &&
                                                <div id="popupModal" className={`modal ${this.state.showStateLoanAmountModal ? 'displayblock' : ''}`}>
                                                    <div className="modal-content">
                                                        <div className="wrapper state address-popup">
                                                            <div className="trans-statment">
                                                                <p>The minimum loan amount for {this.state.selectedState} is $2,000. Please adjust your loan amount.</p>
                                                                {/* <p>We have yet to open for business in your selected state. Please check back later.</p> */}
                                                            </div>
                                                            <button value="Close" id={`close`} name={`close`} className="btn btn-primary" onClick={this.closePopup.bind(this)} > CLOSE</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </center>
                                    :
                                    <center>
                                        {/* {!this.state.IsAcquireInteractive && <span>
                                                    <input type="hidden" name="agreePqTerms" value={this.state.AgreePqTerms} />
                                                    <input type="hidden" name="agreeTCPA" value={this.state.AgreeTCPA} />
                                                </span>
                                                } */}
                                        {!this.state.showModal &&
                                            <div className="row" id="formbutton">
                                                {this.props.currentDevice === 'Mobile' ? <span>
                                                    <button type="submit" id="viewpreqoffers" name="viewpreqoffers" tabIndex="53" className="btn btn-primary intercome-button" disabled={this.state.initialDisabled} >View Pre-Qualified Offers</button>
                                                    <h5 className="formerror">No impact to your credit score</h5>
                                                    <div className={` ${this.state.isError ? ' all-error-message ' : ''}`}>
                                                        <p> {this.state.isError && <span className="formerror-agreement ">{this.state.IntercomErrorMessage}</span>}</p>
                                                    </div>
                                                </span>
                                                    : <span>
                                                        <h4 className="formerror"> Your submission will not impact your credit score </h4>
                                                        <div className="all-error-message">
                                                            <p> {this.state.isError && <span className="formerror-agreement ">{this.state.IntercomErrorMessage}</span>}</p>
                                                        </div>
                                                        <button type="submit" id="viewpreqoffers" name="viewpreqoffers" tabIndex="54" className="btn btn-primary intercome-button" disabled={this.state.initialDisabled} >View Pre-Qualified Offers</button>
                                                    </span>}
                                                {(this.state.IsIntercom || this.state.IsAcquireInteractive) && this.props.currentDevice === 'Mobile' ?
                                                    <div className="row disclosure">
                                                        <div className="col-md-12">
                                                            <div className="checkbox">
                                                                <input name="agreePqTerms" id="agreePqTerms" tabIndex="55" checked={this.state.AgreePqTerms} value={this.state.AgreePqTerms} className={`mobile-checkbox  checkbox pre-checkbox ${!this.state.AgreePqTerms ? 'has-error' : ''}`} type="checkbox" onChange={this.AgreePqTermsChange.bind(this)} />

                                                                <p className="formlist2 intercom-consent-alignment">I authorize {this.props.ThemeConfig.theme_name} and its <a className="loan-app info-tooltip tooltip-width">
                                                                    <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink"><b>{this.props.ThemeConfig.theme_name} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818'}  </span>
                                                                    partners </a> to obtain consumer reports and related information about me from one or more consumer reporting agencies, such as TransUnion, Experian, or Equifax. I also authorize PrimeRates and its partners to share information about me and to <a className="loan-app info-tooltip tooltip-width-send-email-message-me">
                                                                        <span className="tooltiptext tooltiptext-send-email-message-me tooltip-top-margin-send-email-message-me">I understand and agree that I am authorizing {this.props.ThemeConfig.theme_name} and its partners to send me special offers and promotions via email.</span>
                                                                        send me email messages </a>. Additionally, I agree to the {this.props.ThemeConfig.theme_name} <a href='/terms-of-use' target="_blank" rel="noopener noreferrer" className="underline-on-hover">Terms of Use</a>, <a href='/privacy-policy' target="_blank" rel="noopener noreferrer" className="underline-on-hover">Privacy Policy</a>, and <a href='/e-sign' target="_blank" className="underline-on-hover">Consent to Electronic Communications</a>.</p>

                                                            </div>
                                                            <div className="checkbox">

                                                                <input id='agreeTCPA' type='hidden' value={this.state.AgreeTCPA} name="agreeTCPA" />
                                                                <input className={` checkbox pre-checkbox mobile-checkbox `} id='chk-agreeTCPA' type="checkbox" value={this.state.AgreeTCPA} tabIndex="56" onChange={this.AgreeTCPAChange.bind(this)} />

                                                                <p className="formlist2 intercom-consent-alignment">I agree to allow {this.props.ThemeConfig.theme_name} and its <a className="loan-app info-tooltip tooltip-width">
                                                                    <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink"><b>{this.props.ThemeConfig.theme_name} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818'}  </span>
                                                                    partners </a> to <a className="loan-app info-tooltip tooltip-width-call-text-me">
                                                                        <span className="tooltiptext tooltiptext-call-text-me tooltip-top-margin-call-text-me">I authorize {this.props.ThemeConfig.theme_name} and its partner lenders, service providers, affiliates, and successors and assigns, to deliver telemarketing calls and text messages to each telephone number that I provide in connection with my inquiry and application for credit using an automatic telephone dialing system and/or a prerecorded or artificial voice message. I understand I am not required to provide this authorization as a condition of purchasing any property, goods or services. I certify that I have authority to provide this consent either because I am the subscriber of these telephone numbers or I am a non-subscriber customary user who has authority to consent to these communications. If I would like to revoke this consent, I agree to send an email to {'customerservice@primerates.com'} with "Phone Call Opt-Out" in the subject line.  </span>
                                                                        call or text me </a> at the phone numbers I have provided to discuss my application for credit and for other marketing purposes. (optional)</p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ''}
                                            </div>}
                                        {(this.state.IsIntercom || this.state.IsAcquireInteractive) && this.state.showModal ?
                                            <center>
                                                <div className="row" id="formbutton">
                                                    <div id="myModal" className={`modal ${this.state.showModal ? 'displayblock' : ''}`}>
                                                        <div className="modal-content">
                                                            <div className="wrapper loans">
                                                                <div className="trans-logo">
                                                                    <img src={this.props.ThemeConfig.logo} alt="" />
                                                                </div>
                                                                <div className="trans-statment">
                                                                    <img src={this.props.configSettings.lockImage} alt="" />
                                                                    <h1>Checking our partner network for loan offers…</h1>
                                                                </div>

                                                                <div className={`${this.props.currentBrowser === 'safari' ? 'load-img-mobile-safari' : 'load-img'}`}>
                                                                    {this.props.currentBrowser === 'safari' ? <i className={`fa fa-refresh fa-spin ${this.props.currentBrowser === 'safari' ? ' safari ' : ''}`}></i> : ''}
                                                                    {this.props.currentBrowser === 'safari' ? <img src={`https://${window.cdn !== undefined ? window.cdn : window.location.hostname}${this.props.configSettings.safariloadImage}`} alt="PrimeRates" width="300" /> :
                                                                        <img src={`https://${window.cdn !== undefined ? window.cdn : window.location.hostname}${this.props.configSettings.spinnerGIF}`} alt={this.props.ThemeConfig.theme_name} width="250" />}
                                                                </div>

                                                                <div className="website-text">
                                                                    <p> {this.state.loaderContent}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> </center> : ''}
                                    </center>
                                }
                                {/* </form> */}

                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default LoanApplicationForm;