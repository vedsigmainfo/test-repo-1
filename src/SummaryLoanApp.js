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
import { emailRegex, GetPhoneMask, GetSSNMask, AmountFormatting, isValidInteger, currencySymbol, unFormatAmount, calculateAge, isFutureDate, checkValidDate, GetZipcodeMask, IsPhoneNumberValid, IsValidAreaCode, unMaskPhone, IsSSNGroupValid, allLetter } from "./Validation/RegexList";


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
class SummaryLoanApp extends Component {
    constructor(props) {
        super(props);
        //const parentState = super.getMasterState();
        const filteredLoanPurpose = loanPurposeList1.filter(lp => {
            if (this.props.loanPurpose) {
                return (lp.plKey.toLowerCase() === this.props.loanPurpose.toLowerCase())
                    && this.props.loanPurpose.length > 0;
            }
            return filteredLoanPurpose;
        });

        const filteredHousing = housingList.filter(lp => {
            if (this.props.PostDataEX && this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].housingStatus) {
                return (lp.key.toLowerCase() === this.props.PostDataEX.borrowers[0].housingStatus.toLowerCase())
                    && this.props.PostDataEX.borrowers[0].housingStatus.length > 0;
            }
            return filteredHousing;
        });
        const filteredState = stateList.filter(lp => {
            if (this.props.PostDataEX && this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].state) {
                return (lp.key.toLowerCase() === this.props.PostDataEX.borrowers[0].state.toLowerCase())
                    && this.props.PostDataEX.borrowers[0].state.length > 0;
            }
            return filteredState;
        });

        const filteredEstimatedCreditScore = estimatedCreditScoreList.filter(lp => {
            if (this.props.PostDataEX && this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].creditScore) {
                return (lp.key.toLowerCase() === this.props.PostDataEX.borrowers[0].creditScore.toLowerCase())
                    && this.props.PostDataEX.borrowers[0].creditScore.length > 0;
            }
            return filteredEstimatedCreditScore;
        });
        const filteredTimeAtCurrentAddress = timeAtCurrentAddressList.filter(lp => {
            if (this.props.PostDataEX && this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].currenttime) {
                return (lp.key.toLowerCase() === this.props.PostDataEX.borrowers[0].currenttime.toLowerCase())
                    && this.props.PostDataEX.borrowers[0].currenttime.length > 0;
            }
            return filteredTimeAtCurrentAddress;
        });

        const filteredemployment = employmentList.filter(lp => {
            if (this.props.PostDataEX && this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].employmentStatus) {
                return (lp.key.toLowerCase() === this.props.PostDataEX.borrowers[0].employmentStatus.toLowerCase())
                    && this.props.PostDataEX.borrowers[0].employmentStatus.length > 0;
            }
            return filteredemployment;
        });

        this.state = {
            isError: false,
            creditScore: defaultValues.creditScore,
            defaultSelect: defaultValues.defaultSelect,
            StateValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].state ? filteredState[0] ? filteredState[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            StateValueChanged: '',
            HousingStatusValue: this.props.PostDataEX.borrowers[0] && this.getHousingKey(this.props.PostDataEX.borrowers[0].housingStatus) ? filteredHousing[0] ? filteredHousing[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            EmploymentStatusValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].employmentStatus ? filteredemployment[0] ? filteredemployment[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            CitizenshipValue: defaultValues.defaultSelect,
            EducationValue: defaultValues.defaultSelect,
            CreditScoreValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].creditScore ? filteredEstimatedCreditScore.length > 0 ? filteredEstimatedCreditScore[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            TimeAtCurrentAddressValue: this.props.PostData && this.props.PostDataEX.currenttime ? filteredTimeAtCurrentAddress[0] ? filteredTimeAtCurrentAddress[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            MilitaryValue: defaultValues.defaultSelect,
            LoanPurposeValue: filteredLoanPurpose.length > 0 ? filteredLoanPurpose[0].key : this.props.PostData && this.props.PostDataEX.loanPurpose ? this.props.PostDataEX.loanPurpose : defaultValues.defaultSelect,
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
            FirstNameValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].firstName ? this.props.PostDataEX.borrowers[0].firstName : '',
            LastNameValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].lastName ? this.props.PostDataEX.borrowers[0].lastName : '',
            EmailValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].emailAddress ? this.props.PostDataEX.borrowers[0].emailAddress : '',
            EmailChangedValue: '',
            StreedAddressValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].address1 ? this.props.PostDataEX.borrowers[0].address1 : '',
            ApptValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].address2 ? this.props.PostDataEX.borrowers[0].address2 : '',
            CityValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].city ? this.props.PostDataEX.borrowers[0].city : '',
            CityChangedValue: '',
            ZipcodeValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].zipCode ? this.props.PostDataEX.borrowers[0].zipCode : '',
            ZipcodeChangedValue: '',
            BirthdateValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].dateOfBirth ? this.props.PostDataEX.borrowers[0].dateOfBirth : '',
            DisplayAnnualIncomeValue: '',
            AnnualIncomeValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].annualIncome ? `$${AmountFormatting(this.props.PostDataEX.borrowers[0].annualIncome)}` : '',
            HousingPaymentValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].housingPayment ? `$${AmountFormatting(this.props.PostDataEX.borrowers[0].housingPayment)}` : '',
            PlainHousingPayment: '0',
            PlainAnnualIncome: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].annualIncome ? unFormatAmount(this.props.PostDataEX.borrowers[0].annualIncome) : '',
            PhoneNumberValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].phoneNumber ? GetPhoneMask(this.props.PostDataEX.borrowers[0].phoneNumber) : '',
            PhoneNumberMasked: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].phoneNumber ? this.props.PostDataEX.borrowers[0].phonenumber : '',
            SecondaryPhoneNumberValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].secondaryPhoneNumber ? GetPhoneMask(this.props.PostDataEX.borrowers[0].secondaryPhoneNumber) : '',
            SecondaryPhoneNumberMasked: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].secondaryPhoneNumber ? this.props.PostDataEX.borrowers[0].secondaryPhoneNumber : '',
            showSecondaryPhoneNumberError: true,
            showSecondaryPhoneNumberCodeError: true,
            isSecondaryPhoneNumberValid: true,
            ProvideSSNValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].ssn ? GetSSNMask(this.props.PostDataEX.borrowers[0].ssn) : '',
            ProvideSSNMasked: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].ssn ? this.props.PostDataEX.borrowers[0].ssn : '',
            DisplayLoanAmountValue: '',
            LoanAmountValue: this.props.loanAmount ? this.props.loanAmount : this.props.PostData && this.props.PostDataEX.loanamount ? this.props.PostDataEX.loanamount : '',
            PlainLoanAmount: this.props.loanAmount ? unFormatAmount(this.props.loanAmount) : this.props.PostData && this.props.PostDataEX.loanamount ? unFormatAmount(this.props.PostDataEX.loanamount) : '',
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
            ShowLoanProcessing: this.props.loanAmount ? true : this.props.PostData && this.props.PostDataEX.loanAmount ? true : false,
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
            EmployerNameValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerName ? this.props.PostDataEX.borrowers[0].employmentInformation.employerName : '',
            showEmployerNameError: true,
            isEmployerNameValid: true,

            position: '',
            PositionValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.position ? this.props.PostDataEX.borrowers[0].employmentInformation.position : '',
            // this.props.position && this.props.position !== undefined ? this.props.position : this.props.EmployerInformation && this.props.EmployerInformation.position && this.props.EmployerInformation.position !== undefined ? decodeURIComponent(this.props.EmployerInformation.position) : '',
            showPositionError: true,
            isPositionValid: true,

            StartDate: '',
            StartDateValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.startDate ? this.props.PostDataEX.borrowers[0].employmentInformation.startDate : '',
            showStartDateError: true,
            isStartDateValid: true,

            EndDate: '',
            EndDateValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.endDate ? this.props.PostDataEX.borrowers[0].employmentInformation.endDate : '',
            showEndDateError: true,
            isEndDateValid: true,
            EndDateDisabled: this.props.PostDataEX.borrowers[0].employmentInformation.endDate ? false : true,
            EditEndDateCheckBoxChecked: true,
            
            EmployerAddress1: '',
            EmployerAddress1Value: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress1 ? this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress1 : '',
            showEmployerAddress1Error: true,
            isEmployerAddress1Valid: true,

            EmployerAddress2: '',
            EmployerAddress2Value: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress2 ? this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress2 : '',
            showEmployerAddress2Error: true,
            isEmployerAddress2Valid: true,

            EmployerCity: '',
            EmployerAddress1CityValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerCity ? this.props.PostDataEX.borrowers[0].employmentInformation.employerCity : '',
            showEmployerAddress1CityError: true,
            isEmployerAddress1CityValid: true,
            EmployercityChnagedvalue: '',

            EmployerState: '',
            EmployerAddress1StateValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerState ? this.props.PostDataEX.borrowers[0].employmentInformation.employerState : '',
            showEmployerAddress1StateError: true,
            isEmployerAddress1StateValid: true,
            EmployerselectedStateChanged: '',

            EmployerZipCode: '',
            EmployerAddress1ZipcodeValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerZipCode ? this.props.PostDataEX.borrowers[0].employmentInformation.employerZipCode : '',
            showEmployerAddress1ZipcodeError: true,
            isEmployerAddress1ZipcodeValid: true,
            EmployerZipcodeChangedValue: '',

            SalaryAmount: '',
            SalaryAmountValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.salaryAmount ? this.props.PostDataEX.borrowers[0].employmentInformation.salaryAmount : '',
            salaryAmountFocus: false,
            showSalaryAmountError: true,
            isSalaryAmountValid: true,
            PlainSalaryAmount: '',
            showSAmountMessage: '',
            showSalaryAmountMinError: true,

            selectedSalaryPeriod: '',
            SalaryPeriodValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.salaryPeriod ? this.props.PostDataEX.borrowers[0].employmentInformation.salaryPeriod : '',
            showSalaryPeriodError: true,
            isSalaryPeriodValid: true,

            EmployerPhoneNumber: '',
            EmployerPhoneNumberValue: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber ? GetPhoneMask(decodeURIComponent(this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber)) : '',
            EmployerPhoneNumberMasked: this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber ? this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber : '',
            isEmployerPhoneNumbervalid: true,
            showEmployerphonenumberError: true,
            // PrimaryPhoneNumberValue: this.props.PostData && this.props.PostDataEX.phonenumber ? GetPhoneMask(decodeURIComponent(this.props.PostDataEX.phonenumber)) : '',

            CBFirstNameValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].firstName ? this.props.PostDataEX.borrowers[1].firstName : '',
            isCBFirstNameValid: true,
            showCBFirstNameError: true,

            CBLastNameValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].lastName ? this.props.PostDataEX.borrowers[1].lastName : '',
            isCBLastNameValid: true,
            showCBLastNameError: true,

            CBEmailValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].emailAddress ? this.props.PostDataEX.borrowers[1].emailAddress : '',
            isCBEmailValid: true,
            showCBEmailError: true,
            CBEmailChangedValue: '',
            CBemailFocus: false,
            InCompleteCBEmailSent: false,

            CBPhoneNumberValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].phoneNumber ? GetPhoneMask(this.props.PostDataEX.borrowers[1].phoneNumber) : '',
            CBPhoneNumberMasked: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].phoneNumber ? this.props.PostDataEX.borrowers[1].phonenumber : '',
            CBSecondaryPhoneNumberValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].secondaryPhoneNumber ? GetPhoneMask(this.props.PostDataEX.borrowers[1].secondaryPhoneNumber) : '',
            CBSecondaryPhoneNumberMasked: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].secondaryPhoneNumber ? this.props.PostDataEX.borrowers[1].secondaryPhoneNumber : '',
            showCBSecondaryPhoneNumberError: true,
            showCBSecondaryPhoneNumberCodeError: true,
            isCBSecondaryPhoneNumberValid: true,
            showCBPhoneNumberError: true,
            showCBPhoneNumberCodeError: true,
            isCBPhoneNumberValid: true,

            CBStreetAddressValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].address1 ? this.props.PostDataEX.borrowers[1].address1 : '',
            isCBStreetAddressValid: true,
            showCBStreetAddressError: true,

            CBApptValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].address2 ? this.props.PostDataEX.borrowers[1].address2 : '',
            isCBApptValid: true,
            showCBApptError: true,

            CBCityValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].city ? this.props.PostDataEX.borrowers[1].city : '',
            CBCityChangedValue: '',
            showCBCityError: true,
            isCBCityValid: true,

            CBselectedState: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].state ? filteredState[0] ? filteredState[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            CBselectedStateChanged: '',
            isCBStateValid: true,

            CBZipcodeValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].zipCode ? this.props.PostDataEX.borrowers[1].zipCode : '',
            CBZipcodeChangedValue: '',
            showCBZipcodeError: true,
            isCBZipcodeValid: true,

            CBselectedHousing: this.props.PostDataEX.borrowers[1] && this.getHousingKey(this.props.PostDataEX.borrowers[1].housingStatus) ? filteredHousing[0] ? filteredHousing[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            isCBHousingValid: true,
            isCBHousingPaymentValid: true,
            CBhousingPaymentDisabled: true,
            CBHousingPaymentValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].housingPayment ? `$${AmountFormatting(this.props.PostDataEX.borrowers[1].housingPayment)}` : '',
            PlainCBHousingPayment: '0',
            showCBHousingPaymentError: true,
            showCBHousingPaymentMinError: true,
            showCBHousingPaymentCodeError: true,
            CBhousingPaymentFocus: false,


            CBselectedEstimatedCreditScore: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].creditScore ? filteredEstimatedCreditScore.length > 0 ? filteredEstimatedCreditScore[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            CBcreditScore: defaultValues.creditScore,
            isCBEstimatedCreditScoreValid: true,

            CBBirthdateValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].dateOfBirth ? this.props.PostDataEX.borrowers[1].dateOfBirth : '',
            showCBBirthdateError: true,
            isCBBirthdateValid: true,

            CBProvideSSNValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].ssn ? GetSSNMask(this.props.PostDataEX.borrowers[1].ssn) : '',
            CBProvideSSNMasked: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].ssn ? this.props.PostDataEX.borrowers[1].ssn : '',
            isCBProvideSSNValid: true,
            CBPlainSSN: '',
            showCBProvideSSNError: true,

            CBselectedEmployment: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].employmentStatus ? filteredemployment[0] ? filteredemployment[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect,
            isCBEmploymentValid: true,

            CBAnnualIncomeValue: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].annualIncome ? `$${AmountFormatting(this.props.PostDataEX.borrowers[1].annualIncome)}` : '',
            CBannualIncomeFocus: false,
            CBPlainAnnualIncome: this.props.PostDataEX.borrowers[1] && this.props.PostDataEX.borrowers[1].annualincome ? unFormatAmount(this.props.PostDataEX.borrowers[1].annualincome) : '',
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

            hiddenFieldsArray:[],
            ...this.props.parentState
        }
    }
    componentDidMount() {
        //this.getLenderLogoURLFromConfig();
        this.initAutocomplete();
        this.initEmploymentAutocomplete();
        this.initcoborrowerAutocomplete();
        this.getIPAddress();
        if(this.props.PostDataEX.borrowers[0].employmentInformation.endDate === '')
         { 
             //document.getElementById('chk-currentPosition').checked = true;
             this.setState({ EditEndDateCheckBoxChecked : true });
         } else {
            ///document.getElementById('chk-currentPosition').checked = false;
            this.setState({ EditEndDateCheckBoxChecked : false });
         }
        this.setState({ AgreePqTerms: true, AgreeTCPA: false , CBAgreePqTerms:true });
        // if ((this.props.affiliateid === "CreditSoup") && (!this.ValidateInfo(false) || !this.IsValidBirthdate(this.props.PostDataEX.birthdate))) {
        //     this.ShowLoanAppForm();
        //     this.LogInvalidData();
        // }

        if (this.state.HousingStatusValue === 'RENT' || this.state.HousingStatusValue === 'OWN_WITH_MORTGAGE' || this.state.HousingStatusValue === 'Own – with mortgage') {
            this.setState({ housingPaymentDisabled: false });
        }
        this.setState({ mpUniqueClickID: this.getGUID() });

        window.curentstate = this;
        window.onpopstate = function (event) {
            return;
        }
    }
    ShowLoanAppForm() {
        window.scroll(0, 0);
        this.setState({ IsSummaryPageEdit: true, IsSummaryPage: false });

        this.setState({
            HousingStatusValue: this.getHousingKey(this.props.PostDataEX.borrowers[0].housingStatus),
            EmploymentStatusValue: this.getEmploymentKey(this.props.PostDataEX.borrowers[0].employmentStatus),
            CreditScoreValue: this.getEstimatedCreditScoreKey(this.props.PostDataEX.borrowers[0].creditScore)
        });
        if (this.state.HousingStatusValue === 'RENT' || this.state.HousingStatusValue === 'OWN_WITH_MORTGAGE' || this.state.HousingStatusValue === 'Own – with mortgage') {
            this.setState({ housingPaymentDisabled: false });
        }
        if (document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn !== undefined) {
            document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn.type = "password";

        };
        setTimeout(() => {
            this.initAutocomplete();
            this.initEmploymentAutocomplete();
            this.initcoborrowerAutocomplete();
        }, 1000)
    }
    LogInvalidData() {
        setTimeout(() => {
            let fields = `Field Name:`;
            if (!this.state.FirstNameValue) { fields = `${fields}FirstName, Values:'${this.props.PostDataEX.firstname}',`; }
            if (!this.state.LastNameValue) { fields = `${fields}LastName, Values:'${this.props.PostDataEX.lastname}',`; }
            if (!this.state.EmailValue || !this.state.isEmailValid || !this.state.showEmailError) { fields = `${fields}Email, Values:'${this.props.PostDataEX.email}',`; }
            if (!this.state.StreedAddressValue) { fields = `${fields}StreetAddress, Values:'${this.props.PostDataEX.streetaddress}',`; }
            if (!this.state.CityValue) { fields = `${fields}City, Values:'${this.props.PostDataEX.city}',`; }
            if (!this.state.ZipcodeValue || !this.state.showZipcodeError) { fields = `${fields}ZipcodeValue, Values:'${this.props.PostDataEX.zipcode}',`; }
            if (!this.state.BirthdateValue || this.state.BirthdateValue.length < 10 || !this.state.showBirthdateError) { fields = `${fields}Birthdate, Values:'${this.props.PostDataEX.birthdate}',`; }
            if (!this.state.AnnualIncomeValue || !this.state.showAnnualIncomeMinError) { fields = `${fields}AnnualIncome, Values:'${this.props.PostDataEX.annualincome}',`; }
            if (!this.state.PhoneNumberValue || !this.state.showPhoneNumberError || !this.state.showPhoneNumberCodeError) { fields = `${fields}Phonenumber, Values:'${this.props.PostDataEX.phonenumber}',`; }
            if (!this.state.ProvideSSNValue || !this.state.showProvideSSNError) { fields = `${fields}SSN, Values:'${this.props.PostDataEX.ssn}',`; }
            if (!this.state.LoanAmountValue || !this.state.showLoanAmountMinError) { fields = `${fields}LoanAmount, Values:'${this.props.PostDataEX.loanamount}',`; }
            if (this.state.StateValue === 'Select') { fields = `${fields}State, Values:'${this.props.PostDataEX.state}',`; }
            if (this.state.HousingStatusValue === 'Select') { fields = `${fields}Housing, Values:'${this.props.PostDataEX.housing}',`; }
            if (this.state.HousingStatusValue === 'RENT' || this.state.HousingStatusValue === 'OWN_WITH_MORTGAGE' || this.state.HousingStatusValue === 'Own – with mortgage') {
                if (!this.state.HousingPaymentValue) { fields = `${fields}HousingPayment, Values:'${this.props.PostDataEX.housingPayment}',`; }
            }
            if (this.state.EmploymentStatusValue === 'Select') { fields = `${fields}Employment, Values:'${this.props.PostDataEX.employment}',`; }
            // if (!this.state.IsIntercom && this.state.CreditScoreValue === 'Select') { fields = `${fields}CreditScore, Values:'${this.props.PostDataEX.creditscore}',`; }
            if (this.state.TimeAtCurrentAddressValue === 'Select') { fields = `${fields}TimeAtCurrentAddress, Values:'${this.props.PostDataEX.currenttime}',`; }

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
                    EmployerAddress1StateValue: state, StateValueChanged: state, EmployerAddress1ZipcodeValue: zip, ZipcodeChangedValue: zip, showInvalidAddressModal: false
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
                StateValue: defaultValues.defaultSelect, ZipcodeValue: '', isStateValid: true, isCityValid: true, isZipcodeValid: true, showCityError: true, showZipcodeError: true
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
                        StateValue: state, StateValueChanged: state, ZipcodeValue: zip, ZipcodeChangedValue: zip, showInvalidAddressModal: false
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
        else if (!emailRegex.test(this.state.EmailValue)) {
            isValid = false;
        }
        if (isValid && this.state.EmailValue !== this.state.EmailChangedValue) {
            this.setState({ initialDisabled: false, EmailChangedValue: this.state.EmailValue, InCompleteEmailSent: true });
            // var payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.capitalizeFirstLetter(this.state.FirstNameValue)}&lastname=${this.capitalizeFirstLetter(this.state.LastNameValue)}&action=mandrill_incomplete&nonce=4109b2257c`;
            // SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);
        }
    }
    handleSubmit(e) {
        this.props.handleSubmit(e, this.state);
    }
    Submit(e) {
        e.preventDefault();
        if (!this.state.initialDisabled && this.ValidateInfo(true)) {
            let that = this;
            let newObj = [];
            this.props.versionConfigSettings.requestNode.filter(reqestHidden =>{
                newObj.push(that.renderHiddenRow(reqestHidden));
            });
            this.state.hiddenFieldsArray = newObj;
            var that = this;

            var payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.capitalizeFirstLetter(this.state.FirstNameValue)}&lastname=${this.capitalizeFirstLetter(this.state.LastNameValue)}&agreeemail=${this.state.AgreeEmail}&action=mandrill_complete&nonce=4109b2257c`;
            SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);

            that.setState({ showModal: true });
            var second = 0;
            if (window.presubmit !== undefined) window.presubmit();
            if (window._paq) {
                window._paq.push(['setCustomDimension', window.customDimensionId = 3, window.customDimensionValue = that.state.mpUniqueClickID]);
                window._paq.push(['setCustomDimension', window.customDimensionId = 8, window.customDimensionValue = that.state.mpUniqueClickID]);
                window._paq.push(['setCustomDimension', window.customDimensionId = 11, window.customDimensionValue = that.state.CreditScoreValue]);
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

                        document.getElementById(that.props.configSettings.formSettings.summaryFormName).submit();

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
            //     if(!((this.state.IsIntercom || this.state.IsIntercomEdit) && this.state.CreditScoreValue === '350-619')) {
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
    renderHiddenRow(props) {
        var objectValue = ''
        var objectName='';
        objectName = props.name;
        if(props.valueType==='state')
        {            
            objectValue = this.state[props.value];                              
        }
        else if (props.valueType === 'window')
        {
            objectValue = window[props.value];
        }
        else if (props.valueType === 'props')
        {
            objectValue = this.props[props.value];
        }else if (props.valueType === 'props-qs')
        {
            let objQeuryStringValue = this.props.QueryStrings.find(element => element.key=== props.value);
            objectValue = objQeuryStringValue ? objQeuryStringValue.value : '';
        }
        else
        {
            objectValue='';
        }
        return (
            <input type="hidden" name={objectName} value={objectValue} />
        );        
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
            if (!this.state.EmailValue) { this.setState({ isEmailValid: false }); isValid = false; } else if (emailRegex.test(this.state.EmailValue)) {
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
                        if (!IsSSNGroupValid(this.state.ProvideSSNValue)) {
                            this.setState({ showProvideSSNError: false }); isValid = false;;
                        } else {
                            this.setState({ showProvideSSNError: true });
                        }
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

            if (this.state.StateValue === 'Select') { this.setState({ isStateValid: false }); isValid = false; }
            // if (this.state.HousingStatusValue === 'Select') { this.setState({ isHousingValid: false }); isValid = false; }
            // if (this.state.HousingStatusValue === 'RENT' || this.state.HousingStatusValue === 'OWN_WITH_MORTGAGE' || this.state.HousingStatusValue === 'Own – with mortgage') {
            //     if (!this.state.HousingPaymentValue) { this.setState({ isHousingPaymentValid: false, housingPaymentDisabled: false }); isValid = false; }
            //     else { this.setState({ isHousingPaymentValid: true }); }
            // }
            // if (this.state.EmploymentStatusValue === 'Select') { this.setState({ isEmploymentValid: false }); isValid = false; }
            // if ((checkAllFields || this.state.IsAcquireInteractive) && this.state.CreditScoreValue === 'Select') { this.setState({ isEstimatedCreditScoreValid: false }); isValid = false; }
            // if (this.state.TimeAtCurrentAddressValue === 'Select') { this.setState({ isTimeAtCurrentAddressValid: false }); isValid = false; }

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

                isAgreePqTerms = document.getElementById('brAgreePqTerms').checked;
            
                if (!isAgreePqTerms) { this.setState({ AgreePqTerms: false}); isValid = false; } else { this.setState({ AgreePqTerms: true }) }

                isCBAgreePqTerms = document.getElementById('cb-agreePqTerms').checked;
                if (!isCBAgreePqTerms) { this.setState({ CBAgreePqTerms: false}); isValid = false; }
                 else 
                 { this.setState({ CBAgreePqTerms: true}) }

                if(!isAgreePqTerms && !isCBAgreePqTerms) {
                    this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions' });
                } else if(!isAgreePqTerms && isCBAgreePqTerms){
                    this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions for Borrower' });
                } else if(isAgreePqTerms && !isCBAgreePqTerms){
                    this.setState({ IntercomErrorMessage: 'Please agree to terms and conditions for Co-borrower' });
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
       
        // this.props.PostDataEX.borrowers[0].employmentInformation.endDate ? false : 'true'
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
            //const oldState = this.state.StateValue;
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
                if (emailRegex.test(email)) {
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
                    if (this.state.StateValue !== 'Select' && this.state.ZipcodeValue && this.state.CityChangedValue !== city) {
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
        if (this.state.StateValue) {
            if (this.state.stateCodeArray.indexOf(this.state.StateValue.toLowerCase()) > -1) {
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
                        if (this.state.StateValue !== 'Select' && this.state.CityValue && this.state.ZipcodeChangedValue !== zipcode) {
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
                    this.setState({ AnnualIncomeValue: currencySymbol + AmountFormatting(annualIncome) });
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
                    this.setState({ HousingPaymentValue: currencySymbol + AmountFormatting(housingPayment) });
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
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("SSN", "FocusOut");
                provideSSN = provideSSN.replace(/_/g, '');
                document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn[0].type = "password";
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
                if (document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn !== undefined )
                    document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn[0].type = "tel";
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
                    this.setState({ LoanAmountValue: currencySymbol + AmountFormatting(loanAmount) });
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
            //const oldState = this.state.StateValue;
            this.setState({ StateValue: states, isStateValid: true, isError: false, showLoanAmountMinError: true });

            if (!isFocus) {
                if (states === 'Select') { this.setState({ isStateValid: false }); } else {
                    if (this.state.ZipcodeValue && this.state.CityValue && this.state.StateValueChanged !== states) {
                        this.ValidateCityStateZip(true);
                        this.setState({ isStateValid: true, StateValueChanged: states });
                    } else {
                        this.setState({ isStateValid: true });
                    }
                }
            }
        }
    }
    getStateLabel(key) {
        const StateValue = stateList.filter((states) => {
            return states.key === key;
        });
        return StateValue[0] ? StateValue[0].label : null;
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
            this.setState({ HousingStatusValue: housing, isHousingValid: true, isError: false, isHousingPaymentValid: true });
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
        const HousingStatusValue = housingList.filter((housing) => {
            return housing.key === key || housing.label === key;
        });
        return HousingStatusValue[0] ? HousingStatusValue[0].label : null;
    }
    getHousingKey(label) {
        const HousingStatusValue = housingList.filter((housing) => {
            return housing.label.toLowerCase() === label.toLowerCase() || housing.key.toLowerCase() === label.toLowerCase();
        });
        return HousingStatusValue[0] ? HousingStatusValue[0].key : null;
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
            this.setState({ EmploymentStatusValue: employment, isEmploymentValid: true, isError: false });
            if (!isFocus) {
                if (employment === 'Select') { this.setState({ isEmploymentValid: false }); } else { this.setState({ isEmploymentValid: true }); }
            }
        }
    }
    getEmploymentLabel(key) {
        const EmploymentStatusValue = employmentList.filter((employment) => {
            return employment.key === key;
        });
        return EmploymentStatusValue[0] ? EmploymentStatusValue[0].label : null;
    }
    getEmploymentKey(label) {
        const EmploymentStatusValue = employmentList.filter((employment) => {
            return employment.label.toLowerCase() === label.toLowerCase() || employment.key.toLowerCase() === label.toLowerCase();
        });
        return EmploymentStatusValue[0] ? EmploymentStatusValue[0].label : null;
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
            this.setState({ CitizenshipValue: citizenship, isCitizenshipStatusValid: true, isError: false });
            if (!isFocus) {
                if (citizenship === 'Select') { this.setState({ isCitizenshipStatusValid: false }); } else { this.setState({ isCitizenshipStatusValid: true }); }
            }
        }
    }
    getCitizenshipLabel(key) {
        const CitizenshipValue = citizenshipStatusList.filter((citizenship) => {
            return citizenship.key === key;
        });
        return CitizenshipValue[0] ? CitizenshipValue[0].label : null;
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
            this.setState({ EducationValue: education, isHighestEducationValid: true, isError: false });
            if (!isFocus) {
                if (education === 'Select') { this.setState({ isHighestEducationValid: false }); } else { this.setState({ isHighestEducationValid: true }); }
            }
        }
    }
    getHighestEducationLabel(key) {
        const EducationValue = highestEducationList.filter((HighestEducation) => {
            return HighestEducation.key === key;
        });
        return EducationValue[0] ? EducationValue[0].label : null;
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
            this.setState({ CreditScoreValue: estimatedCreditScore, isEstimatedCreditScoreValid: true, isError: false });
            if (!isFocus) {
                if (estimatedCreditScore === 'Select') { this.setState({ isEstimatedCreditScoreValid: false }); } else { this.setState({ isEstimatedCreditScoreValid: true }); }
            }
        }
    }
    getEstimatedCreditScoreLabel(key) {
        const CreditScoreValue = estimatedCreditScoreList.filter((estimatedCreditScore) => {
            return estimatedCreditScore.key === key || estimatedCreditScore.label === key;
        });
        return CreditScoreValue[0] ? CreditScoreValue[0].label : null;
    }
    getEstimatedCreditScoreKey(label) {
        const CreditScoreValue = estimatedCreditScoreList.filter((estimatedCreditScore) => {
            return estimatedCreditScore.label.toLowerCase() === label.toLowerCase() || estimatedCreditScore.key.toLowerCase() === label.toLowerCase();
        });
        return CreditScoreValue[0] ? CreditScoreValue[0].label : null;
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
            this.setState({ TimeAtCurrentAddressValue: timeAtCurrentAddress, isTimeAtCurrentAddressValid: true, isError: false });
            if (!isFocus) {
                if (timeAtCurrentAddress === 'Select') { this.setState({ isTimeAtCurrentAddressValid: false }); } else { this.setState({ isTimeAtCurrentAddressValid: true }); }
            }
        }
    }
    getTimeAtCurrentAddressLabel(key) {
        const TimeAtCurrentAddressValue = timeAtCurrentAddressList.filter((TimeAtCurrentAddress) => {
            return TimeAtCurrentAddress.key === key;
        });
        return TimeAtCurrentAddressValue[0] ? TimeAtCurrentAddressValue[0].label : null;
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
            this.setState({ MilitaryValue: anyMilitaryService, isAnyMilitaryServiceValid: true, isError: false });
            if (!isFocus) {
                if (anyMilitaryService === 'Select') { this.setState({ isAnyMilitaryServiceValid: false }); } else { this.setState({ isAnyMilitaryServiceValid: true }); }
            }
        }
    }
    getAnyMilitaryServiceLabel(key) {
        const MilitaryValue = anyMilitaryServiceList.filter((AnyMilitaryService) => {
            return AnyMilitaryService.key === key;
        });
        return MilitaryValue[0] ? MilitaryValue[0].label : null;
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
            this.setState({ LoanPurposeValue: loanPurpose, isLoanPurposeValid: true, isError: false });
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
        const LoanPurposeValue = loanPurposeList1.filter((loanPurpose) => {
            return loanPurpose.key === key;
        });
        return LoanPurposeValue[0] ? LoanPurposeValue[0].label : null;
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
        return axios.get(`${apiEndpoint}${encodeURIComponent(this.state.StreedAddressValue)},${encodeURIComponent(this.state.CityValue)},${encodeURIComponent(this.state.StateValue)}&key=${this.props.ThemeConfig.googleAPIKey}`);
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
                if (emailRegex.test(CBemail)) {
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
            //const oldState = this.state.StateValue;
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
                    this.setState({ CBHousingPaymentValue: currencySymbol + AmountFormatting(CBhousingPayment) });
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
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("SSN", "FocusOut");
                CBprovideSSN = CBprovideSSN.replace(/_/g, '');
                document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn[1].type = "password";
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
                if (document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn !== undefined && document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn.length > 1)
                    document.getElementById(this.props.configSettings.formSettings.summaryFormName).ssn[1].type = "tel";
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
                    this.setState({ CBAnnualIncomeValue: currencySymbol + AmountFormatting(CBannualIncome) });
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
    //     let Coborrowerinfo = this.props.PostDataEX;
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


    render() {
        //     const ename = this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[0].employmentInformation && this.props.PostDataEX.borrowers[0].employmentInformation.employerName ? this.props.PostDataEX.borrowers[0].employmentInformation.employerName : '');
        //    console.log(this.props.ename);
        //     const pos = this.capitalizeFirstLetter(this.props.PostDataEX && this.props.PostDataEX.employmentInformation.position ? this.props.PostDataEX.employmentInformation.position : '');
        //     const salaryamt = this.props.PostDataEX && this.props.PostDataEX.employmentInformation.salaryAmount ? unFormatAmount(this.props.PostDataEX.employmentInformation.salaryAmount) : '';
        //     const phonenum = this.props.PostDataEX && this.props.PostDataEX.employmentInformation.employerPhoneNumber ? GetPhoneMask(this.props.PostDataEX.employmentInformation.employerPhoneNumber) : '';
        //     const sdate = this.props.PostDataEX && this.props.PostDataEX.employmentInformation.startDate ? this.props.PostDataEX.employmentInformation.startDate : '';
        //     const edate = this.props.PostDataEX && this.props.PostDataEX.employmentInformation.endDate ? this.props.PostDataEX.employmentInformation.endDate : '';
        //     const address1 = this.props.PostData && this.props.PostDataEX.employmentInformation.employerAddress1 ? this.props.PostDataEX.employmentInformation.employerAddress1 : '';
        //     const address2 = this.props.PostData && this.props.PostDataEX.employmentInformation.employerAddress2 ? this.props.PostDataEX.employmentInformation.employerAddress2 : '';
        //     // const state = this.props.PostDataEX && this.props.PostDataEX.employmentInformation.employerState ? filteredState[0] ? filteredState[0].key : defaultValues.defaultSelect : defaultValues.defaultSelect;
        //     const zip = this.props.PostDataEX && this.props.PostDataEX.employmentInformation.employerZipCode ? this.props.PostDataEX.employmentInformation.employerZipCode : '';
        //     const city = this.props.PostDataEX && this.props.PostDataEX.employmentInformation.employerCity ? this.props.PostDataEX.employmentInformation.employerCity : '';

        const address1 = this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress1;
        const address2 = this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress2;
        const city = this.props.PostDataEX.borrowers[0].employmentInformation.employerCity;
        const state = this.props.PostDataEX.borrowers[0].employmentInformation.employerState;
        const zip = this.props.PostDataEX.borrowers[0].employmentInformation.employerZipCode;
        const uuid = typeof window.uuid === typeof undefined ? '' : window.uuid;
        return (
            <div className="container1" >
                <section id="headersection1" className="">
                    <div className="row">
                        <div className="center-block col-md-12">
                            {/* <div className={`box-panel clearfix access-offer-top-margin`} id="mainbox"> */}
                            <div className=".container-box-content-summary" id="mainboxcontent">
                                {/* <form action={`${constantVariables.summaryPagePostURL}`} name="createacc2" id={this.props.configSettings.formSettings.summaryFormName} disable-btn="" className="app-form" method="POST" onSubmit={this.Submit.bind(this)}> */}
                                {/* {this.state.IsSummaryPage && !this.state.IsSummaryPageEdit ? */}
                                <div className="row">
                                    {this.state.hiddenFieldsArray}
                                    <input type="hidden" name="action" value={`${this.props.affiliateid ? this.props.affiliateid === '426464' ? 'AcquireInteractive' : this.props.affiliateid : 'Affiliate'} app submit`} />

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
                                           <input type="hidden" name="lastname" value={this.props.PostDataEX.borrowers[0].offerData.lenderName} />
                                           <input type="hidden" name="loanAmount" value={this.props.PostDataEX.borrowers[0].offerData.loanAmount} />    
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Lender Name:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].offerData.lenderName}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Loan amount:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[0].offerData.loanAmount)}`}</b></div>            
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="APR" value={this.props.PostDataEX.borrowers[0].offerData.APR} />
                                           <input type="hidden" name="term" value={this.props.PostDataEX.borrowers[0].offerData.term} /> 
                                           <input type="hidden" name="monthlyPayment" value={this.props.PostDataEX.borrowers[0].offerData.monthlyPayment} />
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> APR:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" > <b>{this.props.PostDataEX.borrowers[0].offerData.APR} &#x25;</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Term:</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].offerData.term/24} Years</b></div>    
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Monthly Payment:</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[0].offerData.monthlyPayment)}`}</b></div>                        
                                       </div> 
                                   </div>
                                    
                                   <span><h4 className="summaryPage-leftalign">Primary Borrower Information</h4></span>
                                   <div className="primarydetail">                                                         
                                       <div className="row">
                                           <input type="hidden" name="firstname" value={this.props.PostDataEX.borrowers[0].firstName} />
                                           <input type="hidden" name="lastname" value={this.props.PostDataEX.borrowers[0].lastName} />
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[0].firstName)}`}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="emailAddress" value={this.props.PostDataEX.borrowers[0].emailAddress} />
                                       <input type="hidden" name="phonenumber" value={unMaskPhone(this.props.PostDataEX.borrowers[0].phoneNumber)} />
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Email Address:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b><u>{this.props.PostDataEX.borrowers[0].emailAddress}</u></b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{GetPhoneMask(this.props.PostDataEX.borrowers[0].phoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundBorrower">
                                           <input type="hidden" name="address1" value={this.props.PostDataEX.borrowers[0].address1} />
                                           <input type="hidden" name="address2" value={this.props.PostDataEX.borrowers[0].address2} />
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle1"> Address1:</b></div>
                                           <div className="col-sm-3 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataEX.borrowers[0].address1}</b></div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle2" > Address2:</b>  </div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataEX.borrowers[0].address2} &nbsp; </b></div>
                                       
                                            <input type="hidden" name="city" value={this.props.PostDataEX.borrowers[0].city} />
                                           <input type="hidden" name="state" value={this.props.PostDataEX.borrowers[0].state} />
                                           <input type="hidden" name="zip" value={this.props.PostDataEX.borrowers[0].zipCode} />
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle1"> City:</b> </div>
                                           <div className="col-sm-3 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataEX.borrowers[0].city}</b></div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labelstyle2"> State:</b> </div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataEX.borrowers[0].state}</b></div>
                                           <div className="col-sm-3 address-back-margin " ><b className="labelstyle1"> Zip:</b>   </div>
                                           <div className="col-sm-3 address-back-margin" ><b className="labeladdressvalue">{this.props.PostDataEX.borrowers[0].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="housingStatus" value={(this.props.PostDataEX.borrowers[0].housingStatus)} />
                                           <input type="hidden" name="housingPayment" value={this.props.PostDataEX.borrowers[0].housingPayment} />
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.getHousingLabel(this.props.PostDataEX.borrowers[0].housingStatus)}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[0].housingPayment)}`}</b></div>
                                       </div>
                                       <div className="row">
                                            <input type="hidden" name="creditScore" value={this.props.PostDataEX.borrowers[0].creditScore} />
                                           <input type="hidden" name="dateOfBirth" value={this.props.PostDataEX.borrowers[0].dateOfBirth} />
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataEX.borrowers[0].creditScore)}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].dateOfBirth}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="ssn" value={this.props.PostDataEX.borrowers[0].ssn} />
                                           <input type="hidden" name="annualIncome" value={this.props.PostDataEX.borrowers[0].annualIncome} />
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">SSN:</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`XXX-XX-${this.props.PostDataEX.borrowers[0].ssn !== null && this.props.PostDataEX.borrowers[0].ssn !== undefined && this.props.PostDataEX.borrowers[0].ssn.length > 4 ? this.props.PostDataEX.borrowers[0].ssn.substr(this.props.PostDataEX.borrowers[0].ssn.length - 4) : this.props.PostDataEX.borrowers[0].ssn}`}</b></div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-sm-3 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[0].annualIncome)}`}</b></div>
                                       </div>                                            
                                   </div>
                                   <span><h4 className="summaryPage-leftalign summarypage-textindent employmentText">Employment Information</h4></span>
                                   <div className="employerdetail">
                                       
                                       <div className="row">
                                           <input type="hidden" name="employerName" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerName} />
                                           <input type="hidden" name="position" value={this.props.PostDataEX.borrowers[0].employmentInformation.position} />
                                           <div className="col-sm-3 " ><b className="labelstyle"> Employer Name:</b></div>
                                           <div className="col-sm-3 " ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[0].employmentInformation.employerName)}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Position / Title:</b></div>
                                           <div className="col-sm-3 " ><b>{this.props.PostDataEX.borrowers[0].employmentInformation.position}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="startDate" value={this.props.PostDataEX.borrowers[0].employmentInformation.startDate} />
                                           <input type="hidden" name="endDate" value={this.props.PostDataEX.borrowers[0].employmentInformation.endDate} />
                                           <div className="col-sm-3 " ><b className="labelstyle"> Start Date:</b></div>
                                           <div className="col-sm-3" ><b>{this.props.PostDataEX.borrowers[0].employmentInformation.startDate}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> End Date:&nbsp;</b></div>
                                           <div className="col-sm-3 " ><b>{this.props.PostDataEX.borrowers[0].employmentInformation.endDate ? this.props.PostDataEX.borrowers[0].employmentInformation.endDate : 'Present'}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="salaryAmount" value={this.props.PostDataEX.borrowers[0].employmentInformation.salaryAmount} />
                                           <input type="hidden" name="salaryPeriod" value={this.props.PostDataEX.borrowers[0].employmentInformation.salaryPeriod} />
                                           <div className="col-sm-3 " ><b className="labelstyle"> Salary Amount:&nbsp;</b> </div>
                                           <div className="col-sm-3 " ><b>{`${AmountFormatting(this.props.PostDataEX.borrowers[0].employmentInformation.salaryAmount)}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Salary Period:&nbsp;</b></div>
                                           <div className="col-sm-3 " ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[0].employmentInformation.salaryPeriod)}`}</b></div>
                                       </div>
                                       <div className="row address-background">
                                           <input type="hidden" name="employerAddress1" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress1} />
                                           <input type="hidden" name="employerAddress2" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress2} />
                                           <div className="col-sm-3 " ><b className="labelemploymentaddress"> Address1:</b>  </div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddressvalue">{address1}</b></div>
                                           <div className="col-sm-3 " ><b className="labelempaddress2"> Address 2:</b></div>
                                           <div className="col-sm-3 " ><b className="labelempaddressvalue2">{address2}&nbsp;</b></div>
                                        
                                           <input type="hidden" name="employerCity" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerCity} />
                                           <input type="hidden" name="employerState" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerState} />
                                           <input type="hidden" name="employerZipCode" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerZipCode} />
                                           <div className="col-sm-3 " ><b className="labelemploymentaddress"> City:</b>  </div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddressvalue">{city}</b></div>
                                           <div className="col-sm-3 " ><b className="labelempaddress2"> State:</b> </div>
                                           <div className="col-sm-3 " ><b className="labelempaddressvalue2">{state}</b></div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddress"> Zip:</b> </div>
                                           <div className="col-sm-3 " ><b className="labelemploymentaddressvalue">{zip}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="employmentStatus" value={this.props.PostDataEX.borrowers[0].employmentStatus} />
                                           <input type="hidden" name="employerPhoneNumber" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber} />
                                           <div className="col-sm-3 " ><b className="labelstyle">Employment Status:</b> </div>
                                           <div className="col-sm-3 " ><b>{this.getEmploymentLabel(this.props.PostDataEX.borrowers[0].employmentStatus)}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Phone Number:</b> </div>
                                           <div className="col-sm-3 " ><b>{this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber}</b></div>
                                       </div>                                           

                                   </div>
                                   {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                       <div className="row">
                                           <div className="col-md-12">
                                               <div className="checkboxsummary">
                                                   <input id='agreePqTerms' name="agreePqTerms" type='hidden' value={this.state.AgreePqTerms} />
                                                   <input className={`checkbox pre-checkbox `} id='brAgreePqTerms' type="checkbox" value={this.state.AgreePqTerms} tabIndex="24" onChange={this.AgreePqTermsChange.bind(this)} />
                                                   <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                               </div>
                                           </div>
                                       </div>}
                                   <hr className="hr-size hr" />
                                   {this.props.PostDataEX.borrowers.length > 1 ? <span>
                                       <span><h4 className="summaryPage-leftalign">Co-Borrower Information</h4></span>
                                       <div className="Coborrowerdetail">
                                       <div className="row">
                                           <input type="hidden" name="firstname" value={this.props.PostDataEX.borrowers[1].firstName} />
                                           <input type="hidden" name="lastname" value={this.props.PostDataEX.borrowers[1].lastName} />
                                           <div className="col-sm-3 " ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-sm-3 " ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[1].firstName)}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-sm-3" ><b>{this.props.PostDataEX.borrowers[1].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="emailAddress" value={this.props.PostDataEX.borrowers[1].emailAddress} />
                                       <input type="hidden" name="phonenumber" value={unMaskPhone(this.props.PostDataEX.borrowers[1].phoneNumber)} />
                                           <div className="col-sm-3 " ><b className="labelstyle">Email Address:</b> </div>
                                           <div className="col-sm-3 " ><b><u>{this.props.PostDataEX.borrowers[1].emailAddress}</u></b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className="col-sm-3 " ><b>{GetPhoneMask(this.props.PostDataEX.borrowers[1].phoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                           <input type="hidden" name="address1" value={this.props.PostDataEX.borrowers[1].address1} />
                                           <input type="hidden" name="address2" value={this.props.PostDataEX.borrowers[1].address2} />
                                           <div className="col-sm-3" ><b className="labelstyleCB1"> Address1:</b></div>
                                           <div className="col-sm-3" ><b className="labelCBaddressvalue">{this.props.PostDataEX.borrowers[1].address1}</b></div>
                                           <div className="col-sm-3" ><b className="labelstyleCB2"> Address2:</b>  </div>
                                           <div className="col-sm-3" ><b className="labelCBaddressvalue2">{this.props.PostDataEX.borrowers[1].address2}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                            <input type="hidden" name="city" value={this.props.PostDataEX.borrowers[1].city} />
                                           <input type="hidden" name="state" value={this.props.PostDataEX.borrowers[1].state} />
                                           <input type="hidden" name="zip" value={this.props.PostDataEX.borrowers[1].zipCode} />
                                           <div className="col-sm-3" ><b className="labelstyleCB1"> City:</b> </div>
                                           <div className="col-sm-3 " ><b className="labelCBaddressvalue">{this.props.PostDataEX.borrowers[1].city}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyleCB2"> State:</b>  </div>
                                           <div className="col-sm-3 " ><b className="labelCBaddressvalue2">{this.props.PostDataEX.borrowers[1].state}</b></div>
                                           <div className="col-sm-3" ><b className="labelstyleCB1"> Zip:</b>   </div>
                                           <div className="col-sm-3 " ><b className="labelCBaddressvalue">{this.props.PostDataEX.borrowers[1].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="housingStatus" value={(this.props.PostDataEX.borrowers[1].housingStatus)} />
                                           <input type="hidden" name="housingPayment" value={this.props.PostDataEX.borrowers[1].housingPayment} />
                                           <div className="col-sm-3 " ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className="col-sm-3 " ><b>{this.getHousingLabel(this.props.PostDataEX.borrowers[1].housingStatus)}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className="col-sm-3" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[1].housingPayment)}`}</b></div>
                                       </div>
                                       <div className="row">
                                            <input type="hidden" name="creditScore" value={this.props.PostDataEX.borrowers[1].creditScore} />
                                           <input type="hidden" name="dateOfBirth" value={this.props.PostDataEX.borrowers[1].dateOfBirth} />
                                           <div className="col-sm-3 " ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className="col-sm-3 " ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataEX.borrowers[1].creditScore)}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className="col-sm-3 " ><b>{this.props.PostDataEX.borrowers[1].dateOfBirth}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="ssn" value={this.props.PostDataEX.borrowers[1].ssn} />
                                           <input type="hidden" name="annualIncome" value={this.props.PostDataEX.borrowers[1].annualIncome} />
                                           <div className="col-sm-3 " ><b className="labelstyle">SSN:</b></div>
                                           <div className="col-sm-3 " ><b>{`XXX-XX-${this.props.PostDataEX.borrowers[1].ssn !== null && this.props.PostDataEX.borrowers[1].ssn !== undefined && this.props.PostDataEX.borrowers[1].ssn.length > 4 ? this.props.PostDataEX.borrowers[1].ssn.substr(this.props.PostDataEX.borrowers[1].ssn.length - 4) : this.props.PostDataEX.borrowers[1].ssn}`}</b></div>
                                           <div className="col-sm-3 " ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-sm-3 " ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[1].annualIncome)}`}</b></div>
                                       </div>                                                
                                          
                                           {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                               <div className="row">
                                                   <div className="col-md-12">
                                                       <div className="CBcheckboxsummary">
                                                           <input id='cbagreePqTerms' name="cbAgreePqTerms" type='hidden' value={this.state.CBAgreePqTerms} />
                                                           <input className={`CBcheckbox pre-checkbox `} id='cb-agreePqTerms' type="checkbox" value={this.state.CBAgreePqTerms} tabIndex="24" onChange={this.CBAgreePqTermsChange.bind(this)} />
                                                           <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                                       </div>
                                                   </div>
                                               </div>}
                                       </div>  <hr className="hr-size hr" /> </span> : ''
                                   }
                                   <div>
                                       <div className="row">
                                           <a className="col-sm-6 credit-soup-line-height summarypageLink" tabIndex="5" onClick={this.ShowLoanAppForm.bind(this)} ><i className="fa fa-edit edit-icon-size " style={{ fontSize: "15px" }} ></i>  <u>click here to edit your information</u> </a>
                                       </div>
                                   </div>
                               </div>
                               </span> 
                               :
                            //    :  Mobile UI started for Summary page
                               <span> 
                               <div className="summaryPage-leftalign summaryPage-border">
                                   <span><h4 className="loantitle">Loan Information</h4></span>
                                   <div className="offerdetail offerdetailborder">
                                    <div className="row">
                                           <input type="hidden" name="lenderName" value={this.props.PostDataEX.borrowers[0].offerData.lenderName} />
                                           <input type="hidden" name="loanAmount" value={this.props.PostDataEX.borrowers[0].offerData.loanAmount} />    
                                           <div className="col-sm-6 col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Lender Name:</b> </div>
                                           <div className="col-sm-6  col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].offerData.lenderName}</b></div>
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Loan amount:</b> </div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].offerData.loanAmount}</b></div>            
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="APR" value={this.props.PostDataEX.borrowers[0].offerData.APR} />
                                           <input type="hidden" name="term" value={this.props.PostDataEX.borrowers[0].offerData.term} /> 
                                           <input type="hidden" name="monthlyPayment" value={this.props.PostDataEX.borrowers[0].offerData.monthlyPayment} />
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> APR:</b> </div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" > <b>{this.props.PostDataEX.borrowers[0].offerData.APR}</b></div>
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Term:</b></div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].offerData.term}</b></div>    
                                           <div className="col-sm-3  col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Monthly Payment:</b></div>
                                           <div className="col-sm-3  col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].offerData.monthlyPayment}</b></div>                        
                                       </div> 
                                   </div>                              
                                   <span><h4 className="summaryPage-leftalign">Primary Borrower Information</h4></span>
                                   <div className="primarydetails">                                                
                                       
                                       <div className="row">
                                           <input type="hidden" name="firstName" value={this.props.PostDataEX.borrowers[0].firstName} />
                                           <input type="hidden" name="lastname" value={this.props.PostDataEX.borrowers[0].lastName} />
                                           <div className="col-sm-3 col-xs-5 summarypage-margin-zero" ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-sm-3 col-xs-7 summarypage-margin-zero" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[0].firstName)}`}</b></div>
                                           <div className="col-sm-3 col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-sm-3 col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="emailAddress" value={this.props.PostDataEX.borrowers[0].emailAddress} />
                                       <input type="hidden" name="phonenumber" value={unMaskPhone(this.props.PostDataEX.borrowers[0].phoneNumber)} />
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Email Address:</b> </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b><u>{this.props.PostDataEX.borrowers[0].emailAddress}</u></b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{GetPhoneMask(this.props.PostDataEX.borrowers[0].phoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundBorrower">
                                           <input type="hidden" name="address1" value={this.props.PostDataEX.borrowers[0].address1} />
                                           <input type="hidden" name="address2" value={this.props.PostDataEX.borrowers[0].address2} />
                                           <div className=" col-xs-5 address-back-margin" ><b className="labelstyle1"> Address1:</b></div>
                                           <div className=" col-xs-7 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataEX.borrowers[0].address1}</b></div>
                                           <div className=" col-xs-5 address-back-margin" ><b className="labelstyle2" > Address2:</b>  </div>
                                           <div className=" col-xs-7 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataEX.borrowers[0].address2} &nbsp; </b></div>
                                       
                                            <input type="hidden" name="city" value={this.props.PostDataEX.borrowers[0].city} />
                                           <input type="hidden" name="state" value={this.props.PostDataEX.borrowers[0].state} />
                                           <input type="hidden" name="zip" value={this.props.PostDataEX.borrowers[0].zipCode} />
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyle1"> City:</b> </div>
                                           <div className=" col-xs-7 address-back-margin " ><b className="labeladdressvalue">{this.props.PostDataEX.borrowers[0].city}</b></div>
                                           <div className=" col-xs-5 address-back-margin" ><b className="labelstyle2"> State:</b> </div>
                                           <div className=" col-xs-7 address-back-margin" ><b className="labeladdressvalue2">{this.props.PostDataEX.borrowers[0].state}</b></div>
                                           <div className=" col-xs-5 address-back-margin " ><b className="labelstyle1"> Zip:</b>   </div>
                                           <div className=" col-xs-7 address-back-margin" ><b className="labeladdressvalue">{this.props.PostDataEX.borrowers[0].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="housingStatus" value={(this.props.PostDataEX.borrowers[0].housingStatus)} />
                                           <input type="hidden" name="housingPayment" value={this.props.PostDataEX.borrowers[0].housingPayment} />
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{this.getHousingLabel(this.props.PostDataEX.borrowers[0].housingStatus)}</b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[0].housingPayment)}`}</b></div>
                                       </div>
                                       <div className="row">
                                            <input type="hidden" name="creditScore" value={this.props.PostDataEX.borrowers[0].creditScore} />
                                           <input type="hidden" name="dateOfBirth" value={this.props.PostDataEX.borrowers[0].dateOfBirth} />
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataEX.borrowers[0].creditScore)}</b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[0].dateOfBirth}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="ssn" value={this.props.PostDataEX.borrowers[0].ssn} />
                                           <input type="hidden" name="annualIncome" value={this.props.PostDataEX.borrowers[0].annualIncome} />
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">SSN:</b></div>
                                           <div className=" col-xs-7 summarypage-margin-zero" ><b>{`XXX-XX-${this.props.PostDataEX.borrowers[0].ssn !== null && this.props.PostDataEX.borrowers[0].ssn !== undefined && this.props.PostDataEX.borrowers[0].ssn.length > 4 ? this.props.PostDataEX.borrowers[0].ssn.substr(this.props.PostDataEX.borrowers[0].ssn.length - 4) : this.props.PostDataEX.borrowers[0].ssn}`}</b></div>
                                           <div className=" col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[0].annualIncome)}`}</b></div>
                                       </div>                                            
                                   </div>
                                   <span><h4 className="summaryPage-leftalign summarypage-textindent employmentText">Employment Information</h4></span>
                                   <div className="employerdetail">
                                       
                                       <div className="row">
                                           <input type="hidden" name="employerName" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerName} />
                                           <input type="hidden" name="position" value={this.props.PostDataEX.borrowers[0].employmentInformation.position} />
                                           <div className=" col-xs-5 emptext " ><b className="labelstyle "> Employer Name:</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[0].employmentInformation.employerName)}`}</b></div>
                                           <div className=" col-xs-5 emptext" ><b className="labelstyle ">Position / Title:</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{this.props.PostDataEX.borrowers[0].employmentInformation.position}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="startDate" value={this.props.PostDataEX.borrowers[0].employmentInformation.startDate} />
                                           <input type="hidden" name="endDate" value={this.props.PostDataEX.borrowers[0].employmentInformation.endDate} />
                                           <div className=" col-xs-5 emptext " ><b className="labelstyle"> Start Date:</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{this.props.PostDataEX.borrowers[0].employmentInformation.startDate}</b></div>
                                           <div className=" col-xs-5 emptext " ><b className="labelstyle"> End Date:&nbsp;</b></div>
                                           <div className=" col-xs-7 emptextvalue" ><b>{this.props.PostDataEX.borrowers[0].employmentInformation.endDate ? this.props.PostDataEX.borrowers[0].employmentInformation.endDate : 'Present'}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="salaryAmount" value={this.props.PostDataEX.borrowers[0].employmentInformation.salaryAmount} />
                                           <input type="hidden" name="salaryPeriod" value={this.props.PostDataEX.borrowers[0].employmentInformation.salaryPeriod} />
                                           <div className="col-xs-5 emptext " ><b className="labelstyle"> Salary Amount:&nbsp;</b> </div>
                                           <div className="col-xs-7 emptextvalue" ><b>{`${AmountFormatting(this.props.PostDataEX.borrowers[0].employmentInformation.salaryAmount)}`}</b></div>
                                           <div className="col-xs-5 emptext " ><b className="labelstyle"> Salary Period:&nbsp;</b></div>
                                           <div className="col-xs-7 emptextvalue" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[0].employmentInformation.salaryPeriod)}`}</b></div>
                                       </div>
                                       <div className="row address-background">
                                           <input type="hidden" name="employerAddress1" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress1} />
                                           <input type="hidden" name="employerAddress2" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerAddress2} />
                                           <div className="col-xs-5  " ><b className="labelemploymentaddress"> Address1:</b>  </div>
                                           <div className="col-xs-7 " ><b className="labelemploymentaddressvalue">{address1}</b></div>
                                           <div className="col-xs-5 " ><b className="labelempaddress2"> Address 2:</b></div>
                                           <div className="col-xs-7 " ><b className="labelempaddressvalue2">{address2}&nbsp;</b></div>
                                        
                                           <input type="hidden" name="employerCity" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerCity} />
                                           <input type="hidden" name="employerState" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerState} />
                                           <input type="hidden" name="employerZipCode" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerZipCode} />
                                           <div className="col-xs-5  " ><b className="labelemploymentaddress"> City:</b>  </div>
                                           <div className="col-xs-7 " ><b className="labelemploymentaddressvalue">{city}</b></div>
                                           <div className="col-xs-5  " ><b className="labelempaddress2"> State:</b> </div>
                                           <div className="col-xs-7 " ><b className="labelempaddressvalue2">{state}</b></div>
                                           <div className="col-xs-5  " ><b className="labelemploymentaddress"> Zip:</b> </div>
                                           <div className="col-xs-7 " ><b className="labelemploymentaddressvalue">{zip}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="employmentStatus" value={this.props.PostDataEX.borrowers[0].employmentStatus} />
                                           <input type="hidden" name="employerPhoneNumber" value={this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber} />
                                           <div className="col-xs-7 emptext" ><b className="labelstyle">Employment Status:</b> </div>
                                           <div className="col-xs-5 emptextvalue" ><b className="empstatus">{this.getEmploymentLabel(this.props.PostDataEX.borrowers[0].employmentStatus)}</b></div>
                                           <div className="col-xs-6 emptext" ><b className="labelstyle"> Phone Number:</b> </div>
                                           <div className="col-xs-6 emptextvalue" ><b className="empphone">{this.props.PostDataEX.borrowers[0].employmentInformation.employerPhoneNumber}</b></div>
                                       </div>                                           

                                   </div>
                                   {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                       <div className="row">
                                           <div className="col-md-12">
                                               <div className="checkboxsummary">
                                                   <input id='agreePqTerms' name="agreePqTerms" type='hidden' value={this.state.AgreePqTerms} />
                                                   <input className={`checkbox pre-checkbox `} id='brAgreePqTerms' type="checkbox" value={this.state.AgreePqTerms} tabIndex="24" onChange={this.AgreePqTermsChange.bind(this)} />
                                                   <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                               </div>
                                           </div>
                                       </div>}
                                   <hr className="hr-size hr" />
                                   {this.props.PostDataEX.borrowers.length > 1 ? <span>
                                       <span><h4 className="summaryPage-leftalign">Co-Borrower Information</h4></span>
                                       <div className="Coborrowerdetail">
                                       <div className="row">
                                           <input type="hidden" name="cbFirstName" value={this.props.PostDataEX.borrowers[1].firstName} />
                                           <input type="hidden" name="cbLastName" value={this.props.PostDataEX.borrowers[1].lastName} />
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">First Name:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{`${this.capitalizeFirstLetter(this.props.PostDataEX.borrowers[1].firstName)}`}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Last name:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[1].lastName}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="cbEmail" value={this.props.PostDataEX.borrowers[1].emailAddress} />
                                       <input type="hidden" name="cbphoneNumber" value={unMaskPhone(this.props.PostDataEX.borrowers[1].phoneNumber)} />
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle">Email Address:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b><u>{this.props.PostDataEX.borrowers[1].emailAddress}</u></b></div>
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle">Phone Number:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{GetPhoneMask(this.props.PostDataEX.borrowers[1].phoneNumber)}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                           <input type="hidden" name="cbStreetAddress" value={this.props.PostDataEX.borrowers[1].address1} />
                                           <input type="hidden" name="cbAppartment" value={this.props.PostDataEX.borrowers[1].address2} />
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB1"> Address1:</b></div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue">{this.props.PostDataEX.borrowers[1].address1}</b></div>
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB2"> Address2:</b>  </div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue2">{this.props.PostDataEX.borrowers[1].address2}</b></div>
                                       </div>
                                       <div className="row address-backgroundCoBorrower">
                                            <input type="hidden" name="cbCity" value={this.props.PostDataEX.borrowers[1].city} />
                                           <input type="hidden" name="cbState" value={this.props.PostDataEX.borrowers[1].state} />
                                           <input type="hidden" name="cbZipCode" value={this.props.PostDataEX.borrowers[1].zipCode} />
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB1"> City:</b> </div>
                                           <div className="col-xs-7 address-back-margin " ><b className="labelCBaddressvalue">{this.props.PostDataEX.borrowers[1].city}</b></div>
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB2"> State:</b>  </div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue2">{this.props.PostDataEX.borrowers[1].state}</b></div>
                                           <div className="col-xs-5 address-back-margin" ><b className="labelstyleCB1"> Zip:</b>   </div>
                                           <div className="col-xs-7 address-back-margin" ><b className="labelCBaddressvalue">{this.props.PostDataEX.borrowers[1].zipCode}</b></div>
                                       </div>
                                       <div className="row">
                                       <input type="hidden" name="cbHousing" value={(this.props.PostDataEX.borrowers[1].housingStatus)} />
                                           <input type="hidden" name="cbhousingPayment" value={this.props.PostDataEX.borrowers[1].housingPayment} />
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle"> Housing Status:</b> </div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b>{this.getHousingLabel(this.props.PostDataEX.borrowers[1].housingStatus)}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Housing Payment:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[1].housingPayment)}`}</b></div>
                                       </div>
                                       <div className="row">
                                            <input type="hidden" name="cbcreditScore" value={this.props.PostDataEX.borrowers[1].creditScore} />
                                           <input type="hidden" name="cbdateOfBirth" value={this.props.PostDataEX.borrowers[1].dateOfBirth} />
                                           <div className="col-xs-5 summarypage-margin-zero " ><b className="labelstyle">Credit Score:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b>{this.getEstimatedCreditScoreLabel(this.props.PostDataEX.borrowers[1].creditScore)}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle"> Date of Birth:</b>   </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{this.props.PostDataEX.borrowers[1].dateOfBirth}</b></div>
                                       </div>
                                       <div className="row">
                                           <input type="hidden" name="cbSsn" value={this.props.PostDataEX.borrowers[1].ssn} />
                                           <input type="hidden" name="cbAnnualIncome" value={this.props.PostDataEX.borrowers[1].annualIncome} />
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">SSN:</b></div>
                                           <div className="col-xs-7 summarypage-margin-zero " ><b>{`XXX-XX-${this.props.PostDataEX.borrowers[1].ssn !== null && this.props.PostDataEX.borrowers[1].ssn !== undefined && this.props.PostDataEX.borrowers[1].ssn.length > 4 ? this.props.PostDataEX.borrowers[1].ssn.substr(this.props.PostDataEX.borrowers[1].ssn.length - 4) : this.props.PostDataEX.borrowers[1].ssn}`}</b></div>
                                           <div className="col-xs-5 summarypage-margin-zero" ><b className="labelstyle">Annual Income:</b>  </div>
                                           <div className="col-xs-7 summarypage-margin-zero" ><b>{`$${AmountFormatting(this.props.PostDataEX.borrowers[1].annualIncome)}`}</b></div>
                                       </div>                                                
                                     
                                           {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                               <div className="row">
                                                   <div className="col-md-12">
                                                       <div className="CBcheckboxsummary">
                                                           <input id='cbagreePqTerms' name="cbAgreePqTerms" type='hidden' value={this.state.CBAgreePqTerms} />
                                                           <input className={`CBcheckbox pre-checkbox `} id='cb-agreePqTerms' type="checkbox" value={this.state.CBAgreePqTerms} tabIndex="24" onChange={this.CBAgreePqTermsChange.bind(this)} />
                                                           <span dangerouslySetInnerHTML={{ __html: `${this.props.ThemeConfig.consentText}` }}></span>
                                                       </div>
                                                   </div>
                                               </div>}
                                       </div>  <hr className="hr-size hr" /> </span> : ''
                                   }
                                   <div>
                                       <div className="row">
                                           <a className="col-sm-6 credit-soup-line-height summarypageLink" tabIndex="5" onClick={this.ShowLoanAppForm.bind(this)} ><i className="fa fa-edit edit-icon-size " style={{ fontSize: "15px" }} ></i>  <u>click here to edit your information</u> </a>
                                       </div>
                                   </div>
                               </div>
                               </span> }
                               </span>
                                    :
                                    (!this.state.IsSummaryPage && this.state.IsSummaryPageEdit) ?
                                        <span>
                                            <hr className="hr-size hr"/>
                                            <h4 className="summaryPage-leftalign-edit">Primary Borrower Information</h4>
                                            <div className="row">
                                                <TextField formFields={formFields.LegalName}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleFirstNameChange.bind(this)}
                                                    value={this.state.FirstNameValue}
                                                    showTitle={false}
                                                    showError={this.state.isFirstNameValid}
                                                    showErrorMessage={this.state.showFirstNameError}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="6"
                                                    name="firstName" columnStyle="col-sm-6 " controlCss="summarypage-form-control" />

                                                <TextField formFields={formFields.LastName}
                                                    css={this.props.css}
                                                    type="text"
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleLastNameChange.bind(this)}
                                                    value={this.state.LastNameValue}
                                                    showError={this.state.isLastNameValid}
                                                    showErrorMessage={this.state.showLastNameError}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="7"
                                                    name="lastName" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <TextField formFields={formFields.Emailaddress}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleEmailChange.bind(this)}
                                                    showTitle={false}
                                                    value={this.state.EmailValue}
                                                    isFocused={this.state.emailFocus}
                                                    showError={this.state.isEmailValid}
                                                    showErrorMessage={this.state.showEmailError}
                                                    showCodeErrorMessage={true}
                                                    name="emailAddress" disabled={this.state.initialEnabled}
                                                    tabIndex="8" inputType="email"
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <MaskedTextField formFields={formFields.PhoneNumber}
                                                    css={this.props.css}
                                                    type="masked-text"
                                                    handleChangeEvent={this.handlePhoneNumberChange.bind(this)}
                                                    showTitle={false}
                                                    value={this.state.PhoneNumberValue}
                                                    showError={this.state.isPhoneNumberValid}
                                                    showErrorMessage={this.state.showPhoneNumberError}
                                                    showCodeErrorMessage={this.state.showPhoneNumberCodeError}
                                                    disabled={this.state.initialDisabled}
                                                    name="phoneNumber" tabIndex="9" customeMessage=''
                                                    fieldname="phoneNumber" AutoFocus={false}
                                                    inputType="tel" IsNumeric={true}
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <TextField formFields={formFields.HomeAddress}
                                                    css={this.props.css}
                                                    type="text"
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleStreedAddressChange.bind(this)}
                                                    value={this.state.StreedAddressValue}
                                                    showError={this.state.isStreedAddressValid}
                                                    showErrorMessage={this.state.showStreedAddressError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showAddressMessage}
                                                    name="address1" maxLength="50" disabled={this.state.initialDisabled}
                                                    tabIndex="10" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <TextField formFields={formFields.HomeAddressApartment}
                                                    css={this.props.css}
                                                    type="text"
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleApptChange.bind(this)}
                                                    value={this.state.ApptValue}
                                                    showError={this.state.isApptValid}
                                                    showErrorMessage={this.state.showApptError}
                                                    showCodeErrorMessage={true}
                                                    name="address2" maxLength="20" disabled={this.state.initialDisabled}
                                                    tabIndex="11" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <TextField formFields={formFields.HomeAddressCity}
                                                    css={this.props.css}
                                                    type="text"
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleCityChange.bind(this)}
                                                    value={this.state.CityValue}
                                                    showError={this.state.isCityValid}
                                                    showErrorMessage={this.state.showCityError}
                                                    showCodeErrorMessage={true} customeMessage=''
                                                    name="city" maxLength="30" disabled={this.state.initialDisabled}
                                                    tabIndex="12" columnStyle="col-sm-5" controlCss="summarypage-form-control" />

                                                <SelectField columnStyle="col-sm-4"
                                                    css={this.props.css}
                                                    type="dropdown"
                                                    OnDropdownClick={this.onStateClick.bind(this)}
                                                    GetActiveLabel={this.getStateLabel}
                                                    SelectedValue={this.state.StateValue}
                                                    ShowHideList={this.showHideStateList}
                                                    DisplayItem={this.state.displayStateItems}
                                                    ListData={stateList}
                                                    HandleSelectedOption={this.handleStateChange.bind(this)}
                                                    formFields={formFields.HomeAddressState}
                                                    showError={this.state.isStateValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="13" controlCss="summarypage-form-control"
                                                    name="state" />
                                                <TextField formFields={formFields.HomeAddressZipcode}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleZipcodeChange.bind(this)}
                                                    value={this.state.ZipcodeValue}
                                                    showError={this.state.isZipcodeValid}
                                                    showErrorMessage={this.state.showZipcodeError}
                                                    showCodeErrorMessage={true} IsNumeric={true}
                                                    inputType="tel" customeMessage=''
                                                    name="zipCode" maxLength="5" disabled={this.state.initialDisabled}
                                                    tabIndex="14" columnStyle="col-sm-3" showTitle={false}
                                                    controlCss="summarypage-form-control" />
                                            </div>

                                            <div className="row">
                                                <SelectField columnStyle="col-sm-6"
                                                    css={this.props.css}
                                                    type="dropdown"
                                                    OnDropdownClick={this.onHousingClick.bind(this)}
                                                    GetActiveLabel={this.getHousingLabel}
                                                    SelectedValue={this.state.HousingStatusValue}
                                                    ShowHideList={this.showHideHousingList}
                                                    DisplayItem={this.state.displayHousingItems}
                                                    ListData={housingList}
                                                    HandleSelectedOption={this.handleHousingChange.bind(this)}
                                                    formFields={formFields.Housing}
                                                    showError={this.state.isHousingValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="16" showTitle={false}
                                                    name="housingStatus" controlCss="summarypage-form-control" />

                                                <input type="hidden" name="housingPayment" value={this.state.PlainHousingPayment} />
                                                <TextField formFields={formFields.HousingPayment}
                                                    css={this.props.css}
                                                    type="text"
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
                                                    css={this.props.css}
                                                    type="dropdown"
                                                    OnDropdownClick={this.onEstimatedCreditScoreClick.bind(this)}
                                                    GetActiveLabel={this.getEstimatedCreditScoreLabel}
                                                    SelectedValue={this.state.CreditScoreValue}
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
                                                    css={this.props.css}
                                                    type="masked-text"
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
                                                 <input type="hidden" name="cssn" value={this.state.PlainSSN} />
                                                <MaskedTextField formFields={formFields.ProvideSSN}
                                                    css={this.props.css}
                                                    type="masked-text"
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

                                                <input type="hidden" id="annualIncome" name="annualIncome" value={this.state.PlainAnnualIncome} />
                                                {/* <input type="hidden" name="agreePqTerms" value={this.state.AgreePqTerms} /> */}
                                                <input type="hidden" name="agreeTCPA" value={this.state.AgreeTCPA} />
                                                <TextField formFields={formFields.AnnualIncome}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleAnnualIncomeChange.bind(this)}
                                                    value={this.state.AnnualIncomeValue}
                                                    isFocused={this.state.annualIncomeFocus}
                                                    showTooltip={true} customeMessage={this.state.showAIMessage}
                                                    showError={this.state.isAnnualIncomeValid}
                                                    showErrorMessage={this.state.showAnnualIncomeError}
                                                    showCodeErrorMessage={this.state.showAnnualIncomeMinError}
                                                    disabled={this.state.initialDisabled} IsNumeric={true}
                                                    maxLength="12" tabIndex="22" inputType="tel"
                                                    fieldname={`annualIncome`} showTitle={false} name="annualIncome"
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                                
                                            </div>

                                            <h4 className="summaryPage-leftalign-edit">Employment Information</h4>
                                            <div className="row">
                                                <TextField formFields={formFields.EmployerName}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleEmployerNameChange.bind(this)}
                                                    value={this.state.EmployerNameValue}
                                                    showError={this.state.isEmployerNameValid}
                                                    showErrorMessage={this.state.showEmployerNameError}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="23" customeMessage={this.state.showDOBMessage}
                                                    name="employerName" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <TextField formFields={formFields.Position}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handlePositionChange.bind(this)}
                                                    value={this.state.PositionValue}
                                                    showError={this.state.isPositionValid}
                                                    showErrorMessage={this.state.showPositionError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="24" controlCss="summarypage-form-control"
                                                    name="position" columnStyle="col-sm-6" showTitle={false} />
                                            </div>
                                            <div className="row">

                                                <MaskedTextField formFields={formFields.StartDate}
                                                    css={this.props.css}
                                                    type="masked-text"
                                                    handleChangeEvent={this.handleStartDateChange.bind(this)}
                                                    value={this.state.StartDateValue}
                                                    showError={this.state.isStartDateValid}
                                                    showErrorMessage={this.state.showStartDateError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                    disabled={this.state.initialEnabled}
                                                    tabIndex="25"
                                                    fieldname="startDate" maxLength="10" IsNumeric={true}
                                                    inputType="tel" controlCss="summarypage-form-control"
                                                    name="startDate" columnStyle="col-sm-6" showTitle={false} />
                                                
                                                <MaskedTextField formFields={formFields.EndDate}
                                                    css={this.props.css}
                                                    type="masked-text"
                                                    IsCheckboxChecked={this.state.EditEndDateCheckBoxChecked}
                                                    handleChangeEvent={this.handleEndDateChange.bind(this)}
                                                    handleCheckboxEvent={this.handleEndDateCheckBoxEvent.bind(this)} 
                                                    disabled= {this.state.EndDateDisabled}
                                                    value={this.state.EndDateValue}
                                                    showError={this.state.isEndDateValid}
                                                    showErrorMessage={this.state.showEndDateError}
                                                    showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                    maxLength="10" 
                                                    tabIndex="26" IsNumeric={true}
                                                    fieldname="endDate" inputType="tel" controlCss="summarypage-form-control"
                                                    name="endDate" columnStyle="col-sm-6" showTitle={false} />
                                            </div>
                                            <div className="row">
                                                <TextField formFields={formFields.SalaryAmount}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleSalaryAmountChange.bind(this)}
                                                    value={this.state.SalaryAmountValue}
                                                    isFocused={this.state.salaryAmountFocus}
                                                    showTooltip={true} customeMessage={this.state.showSAmountMessage}
                                                    showError={this.state.isSalaryAmountValid}
                                                    showErrorMessage={this.state.showSalaryAmountError}
                                                    showCodeErrorMessage={this.state.showSalaryAmountMinError}
                                                    disabled={this.state.initialDisabled} IsNumeric={true}
                                                    maxLength="12" tabIndex="32" inputType="tel"
                                                    fieldname={`salaryAmount`} showTitle={false} name="salaryAmount"
                                                    columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                                <SelectField columnStyle="col-sm-6"
                                                    css={this.props.css}
                                                    type="dropdown"
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
                                                    tabIndex="33" showTitle={false}
                                                    name="salaryPeriod" controlCss="summarypage-form-control" />
                                            </div>
                                            <div className="row">
                                                <TextField formFields={formFields.EmployerAddress1}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleEmployerAddress1Change.bind(this)}
                                                    value={this.state.EmployerAddress1Value}
                                                    showError={this.state.isEmployerAddress1Valid}
                                                    showErrorMessage={this.state.showEmployerAddress1Error}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="27" controlCss="summarypage-form-control"
                                                    name="employerAddress1" columnStyle="col-sm-6 " showTitle={false} />

                                                <TextField formFields={formFields.EmployerAddress2}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleEmployerAddress2Change.bind(this)}
                                                    value={this.state.EmployerAddress2Value}
                                                    showError={this.state.isEmployerAddress2Valid}
                                                    showErrorMessage={this.state.showEmployerAddress2Error}
                                                    showCodeErrorMessage={true}
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="28" controlCss="summarypage-form-control"
                                                    name="employerAddress2" columnStyle="col-sm-6" showTitle={false} />
                                            </div>
                                            <div className="row">

                                                <TextField formFields={formFields.EmployerCity}
                                                    css={this.props.css}
                                                    type="text"
                                                    showTitle={false}
                                                    handleChangeEvent={this.handleEmployerAddress1CityChange.bind(this)}
                                                    value={this.state.EmployerAddress1CityValue}
                                                    showError={this.state.isEmployerAddress1CityValid}
                                                    showErrorMessage={this.state.showEmployerAddress1CityError}
                                                    showCodeErrorMessage={true} customeMessage=''
                                                    maxLength="30" disabled={this.state.initialEnabled}
                                                    tabIndex="29" controlCss="summarypage-form-control"
                                                    name="employerCity" columnStyle="col-sm-5" />

                                                <SelectField columnStyle="col-sm-4"
                                                    css={this.props.css}
                                                    type="dropdown"
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
                                                    tabIndex="30" controlCss="summarypage-form-control"
                                                    name="employerState" showTitle={false} />

                                                <TextField formFields={formFields.EmployerZipCode}
                                                    css={this.props.css}
                                                    type="text"
                                                    handleChangeEvent={this.handleEmployerAddress1ZipcodeChange.bind(this)}
                                                    value={this.state.EmployerAddress1ZipcodeValue}
                                                    showError={this.state.isEmployerAddress1ZipcodeValid}
                                                    showErrorMessage={this.state.showEmployerAddress1ZipcodeError}
                                                    showCodeErrorMessage={true} customeMessage='' IsNumeric={true}
                                                    inputType="tel"
                                                    maxLength="5" disabled={this.state.initialEnabled}
                                                    tabIndex="31" controlCss="summarypage-form-control"
                                                    name="employerZipCode" columnStyle="col-sm-3" showTitle={false} />
                                            </div>
                                            <div className="row">
                                                <SelectField columnStyle="col-sm-6"
                                                    css={this.props.css}
                                                    type="dropdown"
                                                    OnDropdownClick={this.onEmploymentClick.bind(this)}
                                                    GetActiveLabel={this.getEmploymentLabel}
                                                    SelectedValue={this.state.EmploymentStatusValue}
                                                    ShowHideList={this.showHideEmploymentList}
                                                    DisplayItem={this.state.displayEmploymentItems}
                                                    ListData={employmentList}
                                                    HandleSelectedOption={this.handleEmploymentChange.bind(this)}
                                                    formFields={formFields.Employment}
                                                    showError={this.state.isEmploymentValid}
                                                    disabled={this.state.initialDisabled}
                                                    tabIndex="21" showTitle={false}
                                                    name="employmentStatus" controlCss="summarypage-form-control" />
                                                <MaskedTextField formFields={formFields.EmployerPhoneNumber}
                                                    css={this.props.css}
                                                    type="masked-text"
                                                    handleChangeEvent={this.handleWorkPhonenumberChange.bind(this)}
                                                    value={this.state.EmployerPhoneNumberValue}
                                                    showError={this.state.isEmployerPhoneNumbervalid}
                                                    showErrorMessage={this.state.showEmployerphonenumberError}
                                                    showCodeErrorMessage={this.state.showPhoneNumberCodeError} customeMessage=''
                                                    maxLength="50" disabled={this.state.initialEnabled}
                                                    tabIndex="32" inputType="tel" IsNumeric={true}
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
                                       

                                {(!this.state.IsSummaryPage && this.state.IsSummaryPageEdit && this.props.PostDataEX.borrowers.length > 1) ?
                                    <span>
                                        <h4 className="summaryPage-leftalign-edit">Co-Borrower Information</h4>
                                        <div className="row">
                                            <TextField formFields={formFields.CBFirstName}
                                                css={this.props.css}
                                                type="text"
                                                handleChangeEvent={this.handleCBFirstNameChange.bind(this)}
                                                value={this.state.CBFirstNameValue}
                                                showTitle={false}
                                                showError={this.state.isCBFirstNameValid}
                                                showErrorMessage={this.state.showCBFirstNameError}
                                                showCodeErrorMessage={true}
                                                maxLength="50" disabled={this.state.initialEnabled}
                                                tabIndex="6"
                                                name="cbFirstName" columnStyle="col-sm-6 " controlCss="summarypage-form-control" />

                                            <TextField formFields={formFields.CBLastName}
                                                css={this.props.css}
                                                type="text"
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBLastNameChange.bind(this)}
                                                value={this.state.CBLastNameValue}
                                                showError={this.state.isCBLastNameValid}
                                                showErrorMessage={this.state.showCBLastNameError}
                                                showCodeErrorMessage={true}
                                                maxLength="50" disabled={this.state.initialEnabled}
                                                tabIndex="7"
                                                name="cbLastName" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <TextField formFields={formFields.CBEmailaddress}
                                                css={this.props.css}
                                                type="text"
                                                handleChangeEvent={this.handleCBEmailChange.bind(this)}
                                                showTitle={false}
                                                value={this.state.CBEmailValue}
                                                isFocused={this.state.CBemailFocus}
                                                showError={this.state.isCBEmailValid}
                                                showErrorMessage={this.state.showCBEmailError}
                                                showCodeErrorMessage={true}
                                                name="cbEmail" disabled={this.state.initialEnabled}
                                                tabIndex="8" inputType="email"
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            <MaskedTextField formFields={formFields.CBPhoneNumber}
                                                css={this.props.css}
                                                type="masked-text"
                                                handleChangeEvent={this.handleCBPhoneNumberChange.bind(this)}
                                                showTitle={false}
                                                value={this.state.CBPhoneNumberValue}
                                                showError={this.state.isCBPhoneNumberValid}
                                                showErrorMessage={this.state.showCBPhoneNumberError}
                                                showCodeErrorMessage={this.state.showCBPhoneNumberCodeError}
                                                disabled={this.state.initialDisabled}
                                                name="cbphoneNumber" tabIndex="9" customeMessage=''
                                                fieldname="phoneNumber" AutoFocus={false}
                                                inputType="tel" IsNumeric={true}
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <TextField formFields={formFields.CBHomeAddress}
                                                css={this.props.css}
                                                type="text"
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBStreetAddressChange.bind(this)}
                                                value={this.state.CBStreetAddressValue}
                                                showError={this.state.isCBStreetAddressValid}
                                                showErrorMessage={this.state.showCBStreetAddressError}
                                                showCodeErrorMessage={true} customeMessage={this.state.showAddressMessage}
                                                name="cbStreetAddress" maxLength="50" disabled={this.state.initialDisabled}
                                                id="CBHomeAddress"
                                                tabIndex="10" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            <TextField formFields={formFields.CBHomeAddressApartment}
                                                css={this.props.css}
                                                type="text"
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBApptChange.bind(this)}
                                                value={this.state.CBApptValue}
                                                showError={this.state.isCBApptValid}
                                                showErrorMessage={this.state.showCBApptError}
                                                showCodeErrorMessage={true}
                                                name="cbAppartment" maxLength="20" disabled={this.state.initialDisabled}
                                                tabIndex="11" columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <TextField formFields={formFields.CBHomeAddressCity}
                                                css={this.props.css}
                                                type="text"
                                                showTitle={false}
                                                handleChangeEvent={this.handleCBCityChange.bind(this)}
                                                value={this.state.CBCityValue}
                                                showError={this.state.isCBCityValid}
                                                showErrorMessage={this.state.showCBCityError}
                                                showCodeErrorMessage={true} customeMessage=''
                                                name="cbCity" maxLength="30" disabled={this.state.initialDisabled}
                                                tabIndex="12" columnStyle="col-sm-5" controlCss="summarypage-form-control" />

                                            <SelectField columnStyle="col-sm-4"
                                                css={this.props.css}
                                                type="dropdown"
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
                                                tabIndex="13" controlCss="summarypage-form-control"
                                                name="cbState" />
                                            <TextField formFields={formFields.CBHomeAddressZipcode}
                                                css={this.props.css}
                                                type="text"
                                                handleChangeEvent={this.handleCBZipcodeChange.bind(this)}
                                                value={this.state.CBZipcodeValue}
                                                showError={this.state.isCBZipcodeValid}
                                                showErrorMessage={this.state.showCBZipcodeError}
                                                showCodeErrorMessage={true} IsNumeric={true}
                                                inputType="tel" customeMessage=''
                                                name="cbZipCode" maxLength="5" disabled={this.state.initialDisabled}
                                                tabIndex="14" columnStyle="col-sm-3" showTitle={false}
                                                controlCss="summarypage-form-control" />
                                        </div>

                                        <div className="row">
                                            <SelectField columnStyle="col-sm-6"
                                                css={this.props.css}
                                                type="dropdown"
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
                                                tabIndex="16" showTitle={false}
                                                name="cbHousing" controlCss="summarypage-form-control" />

                                            <input type="hidden" name="cbhousingPayment" value={this.state.CBPlainHousingPayment} />
                                            <TextField formFields={formFields.CBHousingPayment}
                                                css={this.props.css}
                                                type="text"
                                                handleChangeEvent={this.handleCBHousingPaymentChange.bind(this)}
                                                value={this.state.CBHousingPaymentValue}
                                                showError={this.state.isCBHousingPaymentValid}
                                                showErrorMessage={this.state.showCBHousingPaymentError}
                                                showCodeErrorMessage={this.state.showCBHousingPaymentCodeError}
                                                disabled={this.state.CBhousingPaymentDisabled}
                                                name="" showTitle={false}
                                                fieldname="housingPayment"
                                                inputType="tel" IsNumeric={true}
                                                tabIndex="17" columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                        </div>
                                        <div className="row">
                                            <SelectField columnStyle="col-sm-6"
                                                css={this.props.css}
                                                type="dropdown"
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
                                                tabIndex="18" showTitle={false}
                                                name="cbcreditScore" controlCss="summarypage-form-control" />
                                            <MaskedTextField formFields={formFields.CBBirthDate}
                                                css={this.props.css}
                                                type="masked-text"
                                                handleChangeEvent={this.handleCBBirthdateChange.bind(this)}
                                                value={this.state.CBBirthdateValue}
                                                showError={this.state.isCBBirthdateValid}
                                                showErrorMessage={this.state.showCBBirthdateError}
                                                showCodeErrorMessage={true} customeMessage={this.state.showDOBMessage}
                                                name="cbdateOfBirth" disabled={this.state.initialDisabled}
                                                fieldname="dateOfBirth"
                                                tabIndex="19" IsNumeric={true}
                                                inputType="tel" showTitle={false}
                                                columnStyle="col-sm-6" maxLength="10" controlCss="summarypage-form-control" />

                                            
                                        </div>
                                        <div className="row">
                                            <input type="hidden" name="cssn" value={this.state.PlainSSN} />
                                            <MaskedTextField formFields={formFields.CBProvideSSN}
                                                css={this.props.css}
                                                type="masked-text"
                                                handleChangeEvent={this.handleCBProvideSSNChange.bind(this)}
                                                value={this.state.CBProvideSSNValue}
                                                showError={this.state.isCBProvideSSNValid}
                                                showErrorMessage={this.state.showCBProvideSSNError}
                                                showCodeErrorMessage={true} IsNumeric={true}
                                                disabled={this.state.initialDisabled}
                                                customeMessage='' fieldname="SSN" showTitle={false}
                                                tabIndex="20" min="9" max="9" name="cbSsn"
                                                inputType="password" inputMode="numeric"
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />
                                            <input type="hidden" id="annualIncome" name="cbAnnualIncome" value={this.state.PlainAnnualIncome} />
                                            {/* <input type="hidden" name="agreePqTerms" value={this.state.AgreePqTerms} /> */}
                                            <input type="hidden" name="agreeTCPA" value={this.state.AgreeTCPA} />
                                            <TextField formFields={formFields.CBAnnualIncome}
                                                css={this.props.css}
                                                type="text"
                                                handleChangeEvent={this.handleCBAnnualIncomeChange.bind(this)}
                                                value={this.state.CBAnnualIncomeValue}
                                                isFocused={this.state.CBannualIncomeFocus}
                                                showTooltip={true} customeMessage={this.state.showAIMessage}
                                                showError={this.state.isCBAnnualIncomeValid}
                                                showErrorMessage={this.state.showCBAnnualIncomeError}
                                                showCodeErrorMessage={this.state.showCBAnnualIncomeMinError}
                                                disabled={this.state.initialDisabled} IsNumeric={true}
                                                maxLength="12" tabIndex="22" inputType="tel"
                                                fieldname={`annualIncome`} showTitle={false} name="annualIncome"
                                                columnStyle="col-sm-6" controlCss="summarypage-form-control" />

                                            
                                        </div>
                                        {!this.state.showModal && !this.state.IsIntercom && !this.state.IsAcquireInteractive &&
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="CBcheckbox">
                                                                <input id='cbagreePqTerms' name="cbAgreePqTerms" type='hidden' value={this.state.CBAgreePqTerms} />
                                                                <input className={`CBcheckbox pre-checkbox `} id='cb-agreePqTerms' type="checkbox" value={this.state.CBAgreePqTerms} tabIndex="24" onChange={this.CBAgreePqTermsChange.bind(this)} />
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
                                                <input className="checkbox pre-checkbox" id='chk-agreeTCPA' type="checkbox" value={this.state.AgreeTCPA} tabIndex="24" onChange={this.AgreeTCPAChange.bind(this)} />
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
                                                    !this.state.CBAgreePqTerms && this.state.AgreePqTerms ?   
                                                        <p> <span className="formerror-agreement "> Please agree to terms and conditions for Co-borrower </span> </p> : <p>&nbsp;</p> ?
                                                    <p>&nbsp;</p> : ''
                                                    }    
                                            </div>  
                                            <button type="button" id="viewpreqoffers" name="viewpreqoffers" tabIndex="26" className="btn bc-primary-summary" disabled={this.state.initialDisabled} onClick={this.handleSubmit.bind(this)}>Submit Application</button>
                                            {this.state.showModal &&
                                                <div id="myModal" className={`modal ${this.state.showModal ? 'displayblock' : ''}`}>
                                                    <div className="modal-content">
                                                        <div className="wrapper loans">
                                                            <div className="trans-logo">
                                                                <img src={this.props.ThemeConfig.logo} alt="" />
                                                            </div>
                                                            {/* <div className="trans-statment">
                                                                    <img src={this.props.configSettings.lockImage} alt="" />
                                                                    <h1>Checking our partner network for loan offers…</h1>
                                                                </div> */}

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
                                                                <p>The minimum loan amount for {this.state.StateValue} is $2,000. Please adjust your loan amount.</p>
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
                                                    <button type="submit" id="viewpreqoffers" name="viewpreqoffers" tabIndex="26" className="btn btn-primary intercome-button" disabled={this.state.initialDisabled} >View Pre-Qualified Offers</button>
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
                                                        <button type="submit" id="viewpreqoffers" name="viewpreqoffers" tabIndex="26" className="btn btn-primary intercome-button" disabled={this.state.initialDisabled} >View Pre-Qualified Offers</button>
                                                    </span>}
                                                {(this.state.IsIntercom || this.state.IsAcquireInteractive) && this.props.currentDevice === 'Mobile' ?
                                                    <div className="row disclosure">
                                                        <div className="col-md-12">
                                                            <div className="checkbox">
                                                                <input name="agreePqTerms" id="agreePqTerms" tabIndex="23" checked={this.state.AgreePqTerms} value={this.state.AgreePqTerms} className={`mobile-checkbox  checkbox pre-checkbox ${!this.state.AgreePqTerms ? 'has-error' : ''}`} type="checkbox" onChange={this.AgreePqTermsChange.bind(this)} />

                                                                <p className="formlist2 intercom-consent-alignment">I authorize {this.props.ThemeConfig.theme_name} and its <a className="loan-app info-tooltip tooltip-width">
                                                                    <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink"><b>{this.props.ThemeConfig.theme_name} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818'}  </span>
                                                                    partners </a> to obtain consumer reports and related information about me from one or more consumer reporting agencies, such as TransUnion, Experian, or Equifax. I also authorize PrimeRates and its partners to share information about me and to <a className="loan-app info-tooltip tooltip-width-send-email-message-me">
                                                                        <span className="tooltiptext tooltiptext-send-email-message-me tooltip-top-margin-send-email-message-me">I understand and agree that I am authorizing {this.props.ThemeConfig.theme_name} and its partners to send me special offers and promotions via email.</span>
                                                                        send me email messages </a>. Additionally, I agree to the {this.props.ThemeConfig.theme_name} <a href='/terms-of-use' target="_blank" rel="noopener noreferrer" className="underline-on-hover">Terms of Use</a>, <a href='/privacy-policy' target="_blank" rel="noopener noreferrer" className="underline-on-hover">Privacy Policy</a>, and <a href='/e-sign' target="_blank" className="underline-on-hover">Consent to Electronic Communications</a>.</p>

                                                            </div>
                                                            <div className="checkbox">

                                                                <input id='agreeTCPA' type='hidden' value={this.state.AgreeTCPA} name="agreeTCPA" />
                                                                <input className={` checkbox pre-checkbox mobile-checkbox `} id='chk-agreeTCPA' type="checkbox" value={this.state.AgreeTCPA} tabIndex="24" onChange={this.AgreeTCPAChange.bind(this)} />

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

export default SummaryLoanApp;