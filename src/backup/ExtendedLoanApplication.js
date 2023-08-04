import React, { Component } from "react";
import { constantVariables } from "./Validation/FormData";
import { CallGAEvent } from "./Validation/GoogleAnalytics.js";
import { loanPurposeList1, defaultValues, stateList, housingList, employmentList, citizenshipStatusList, highestEducationList, estimatedCreditScoreList, timeAtCurrentAddressList, POBox, salaryPeriod } from "./AppData";
import BCTextField from "./BCTextField";
import BCSelectField from "./BCSelectField";
import BCButtonField from "./BCButtonField";
import { SendEmail } from "./EmailFunctions";
import axios from "axios";
import MaskedTextField from "./MaskedTextField";
import CheckBoxField from "./CheckBoxField";
//import SummaryPage from "./SummaryPage";
import LoanApplicationForm from './LoanApplicationForm';
import { GetPhoneMask, GetSSNMask, AmountFormatting, isValidInteger, currencySymbol, unFormatAmount, calculateAge, isFutureDate, checkValidDate, GetZipcodeMask, IsPhoneNumberValid, IsValidAreaCode, unMaskPhone, IsSSNGroupValid, allLetter, compareTwoDates } from "./Validation/RegexList";

const displayBlock = { display: 'block' };
const displayNone = { display: 'none' };
var autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
};
class ExtendedLoanApplication extends Component {
    constructor(props) {
        super(props);
        const filteredLoanPurpose = loanPurposeList1.filter(lp => {
            if (this.props.loanPurpose) {
                return (lp.plKey.toLowerCase() === this.props.loanPurpose.toLowerCase() || lp.key.toLowerCase() === this.props.loanPurpose.toLowerCase())
                    && this.props.loanPurpose.length > 0;
            }
            return filteredLoanPurpose;
        });
        const filteredHousing = housingList.filter(lp => {
            if (this.props.PostData && this.props.PostData.housing) {
                return (lp.key.toLowerCase() === this.props.PostData.housing.toLowerCase() || lp.text.toLowerCase() === this.props.PostData.housing.toLowerCase())
                    && this.props.PostData.housing.length > 0;
            }
            return filteredHousing;
        });
        const filteredState = stateList.filter(lp => {
            if (this.props.PostData && this.props.PostData.state) {
                return (lp.key.toLowerCase() === this.props.PostData.state.toLowerCase() || lp.text.toLowerCase() === this.props.PostData.state.toLowerCase())
                    && this.props.PostData.state.length > 0;
            }
            return filteredHousing;
        });

        const filteredEstimatedCreditScore = estimatedCreditScoreList.filter(lp => {
            if (this.props.PostData && this.props.PostData.creditscore) {
                return (lp.key.toLowerCase() === this.props.PostData.creditscore.toLowerCase())
                    && this.props.PostData.creditscore.length > 0;
            }
            return filteredEstimatedCreditScore;
        });

        const filteredTimeAtCurrentAddress = timeAtCurrentAddressList.filter(lp => {
            if (this.props.PostData && this.props.PostData.currenttime) {
                return (lp.key.toLowerCase() === this.props.PostData.currenttime.toLowerCase() || lp.label.toLowerCase() === this.props.PostData.currenttime.toLowerCase())
                    && this.props.PostData.currenttime.length > 0;
            }
            return filteredTimeAtCurrentAddress;
        });

        const filteredemployment = employmentList.filter(lp => {
            if (this.props.PostData && this.props.PostData.employment) {
                return (lp.key.toLowerCase() === this.props.PostData.employment.toLowerCase() || lp.label.toLowerCase() === this.props.PostData.employment.toLowerCase())
                    && this.props.PostData.employment.length > 0;
            }
            return filteredemployment;
        });
        this.BrowserBack = this.BrowserBack.bind(this);
        this.BrowserForward = this.BrowserForward.bind(this);
        this.state = {
            isError: false,
            creditScore: defaultValues.creditScore,
            defaultSelect: defaultValues.defaultSelect,
            selectedState: this.props.PostData && this.props.PostData.state ? filteredState[0] ? filteredState[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedHousing: this.props.PostData && this.props.PostData.housing ? filteredHousing[0] ? filteredHousing[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedEmployment: this.props.PostData && this.props.PostData.employment ? filteredemployment[0] ? filteredemployment[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedCitizenship: defaultValues.defaultSelect,
            selectedHighestEducation: defaultValues.defaultSelect,
            selectedEstimatedCreditScore: this.props.PostData && this.props.PostData.creditscore ? filteredEstimatedCreditScore[0] ? filteredEstimatedCreditScore[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedTimeAtCurrentAddress: this.props.PostData && this.props.PostData.currenttime ? filteredTimeAtCurrentAddress[0] ? filteredTimeAtCurrentAddress[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedAnyMilitaryService: defaultValues.defaultSelect,
            selectedLoanPurpose: filteredLoanPurpose.length > 0 ? filteredLoanPurpose[0].key : this.props.PostData && this.props.PostData.loanPurpose ? this.props.PostData.loanPurpose : defaultValues.defaultSelect,
            isFirstNameValid: true,
            isLastNameValid: true,
            isEmailValid: true,
           // isStreedAddressValid: true,
           // isApptValid: true,
           // isCityValid: true,
           // isStateValid: true,
           // isZipcodeValid: true,
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
            //isPrimaryPhoneNumberValid: true,    
            isSecondaryPhoneNumberValid: true,
            isProvideSSNValid: true,
            isLoanAmountValid: true,
            isLoanPurposeValid: true,
            isPrimaryProjectPurposeValid: true,
            showFirstNameError: true,
            showLastNameError: true,
            showEmailError: true,
           // showStreedAddressError: true,
            //showApptError: true,
            //showCityError: true,
           // showZipcodeError: true,
            showBirthdateError: true,
            showAnnualIncomeError: true,
            showAnnualIncomeMinError: true,
            showHousingPaymentError: true,
            showHousingPaymentMinError: true,
            showHousingPaymentCodeError: true,
            showPrimaryPhoneNumberError: true,
            showPrimaryPhoneNumberCodeError: true,
            showSecondaryPhoneNumberError: true,
            showSecondaryPhoneNumberCodeError: true,
            showProvideSSNError: true,
            showLoanAmountError: true,
            showLoanAmountMinError: true,
            showLoanPurposeError: true,
            showPrimaryProjectError: true,
            FirstNameValue: this.props.firstname && this.props.firstname !== undefined ? this.props.firstname : this.props.PostData && this.props.PostData.firstname && this.props.PostData.firstname !== undefined ? decodeURIComponent(this.props.PostData.firstname) : '',
            LastNameValue: this.props.lastname && this.props.lastname !== undefined ? this.props.lastname : this.props.PostData && this.props.PostData.lastname && this.props.PostData.lastname !== undefined ? decodeURIComponent(this.props.PostData.lastname) : '',
            EmailValue: this.props.email && this.props.email !== undefined ? decodeURIComponent(this.props.email) : this.props.PostData && this.props.PostData.email && this.props.PostData.email !== undefined ? decodeURIComponent(this.props.PostData.email) : '',
            EmailChangedValue: '',
            StreetAddressValue: this.props.PostData && this.props.PostData.streetaddress ? decodeURIComponent(this.props.PostData.EmployerAddress1) : '',
            ApptValue: this.props.PostData && this.props.PostData.appartment ? decodeURIComponent(this.props.PostData.EmployerAddress2) : '',
            CityValue: this.props.PostData && this.props.PostData.city ? decodeURIComponent(this.props.PostData.EmployerCity) : '',
            ZipcodeValue: this.props.PostData && this.props.PostData.zipcode ? decodeURIComponent(this.props.PostData.EmployerZipCode) : '',
           // BirthdateValue: this.props.PostData && this.props.PostData.birthdate ? decodeURIComponent(this.props.PostData.birthdate) : '',
            BirthdateValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].birthdate ? decodeURIComponent(this.props.PostDataEX.borrowers[0].birthdate) : '',
            DisplayAnnualIncomeValue: '',
            AnnualIncomeValue: this.props.PostData && this.props.PostData.annualincome ? currencySymbol + AmountFormatting(decodeURIComponent(this.props.PostData.annualincome)) : '',
            HousingPaymentValue: this.props.PostData && this.props.PostData.housingPayment ? currencySymbol + AmountFormatting(decodeURIComponent(this.props.PostData.housingPayment)) : '',
            PlainHousingPayment: '0',
            PlainAnnualIncome: '',   
            SecondaryPhoneNumberValue: '',
            SecondaryPhoneNumberMasked: '',
            ProvideSSNValue: this.props.PostData && this.props.PostData.ssn ? GetSSNMask(this.props.PostData.ssn) : '',
            ProvideSSNMasked: this.props.PostData && this.props.PostData.ssn ? this.props.PostData.ssn : '',
            DisplayLoanAmountValue: '',
            LoanAmountValue: this.props.loanAmount ? currencySymbol + AmountFormatting(this.props.loanAmount) : this.props.PostData && this.props.PostData.loanamount ? currencySymbol + AmountFormatting(this.props.PostData.loanamount) : '',
            PlainLoanAmount: this.props.loanAmount ? unFormatAmount(this.props.loanAmount) : this.props.PostData && this.props.PostData.loanamount ? unFormatAmount(this.props.PostData.loanamount) : '',
            HomePhone: '',
            HomePhoneValue: '',
            showHomePhoneError: true,
            isHomePhoneValid: true,
            hasErrorCssClass: 'has-error',
            initialEnabled: false,
            initialDisabled: false,
            AgreeTerms: true,
            AgreePqTerms: true,
            AgreeConsent: true,
            AgreeEmail: true,
            AgreeTCPA: false,
            emailFocus: false,
            annualIncomeFocus: false,
            housingPaymentFocus: false,
            showModal: false,
            showFundingModal: false,
            loaderContent: '',
            InCompleteEmailSent: false,
            PlainSSN: '',
            showAddressMessage: '',
            showDOBMessage: '',
            showStartDateerrorMessage: '',
            showAIMessage: '',
            showLenderImage: '',
            partnerId: this.props.PartnerId,
            zipCodeArray: [],
            cityCodeArray: [],
            stateCodeArray: [],
            housingPaymentDisabled: true,
            IsFormSubmitted: false,
            IsCreditSoup: this.props.affiliateid === "CreditSoup" ? true : false,
            IsCreditSoupEdit: false,
            ShowLoanProcessing: this.props.loanAmount ? true : this.props.PostData && this.props.PostData.loanamount ? true : false,
            LoanOriginationFees: '',
            LoanOrigination: '',
            ShowLoanOriginationError: false,
            IncludeFees: false,
            currentPage: 1,
            buttonText: 'Continue',
            IsContinue: false,
            mpUniqueClickID: this.getGUID(),
            skipPage1: false, skipPage10: false, skipPage12: false,
            load1block: false, load2block: false, load3block: false,
            load1Change: false, load2Change: false, load3Change: false, marqueeblock: false,
            IPAddress: '',
            currentPageName: '',
            EmploymentStatus: '',
            EmploymentStatusValue: '',
            showEmploymentStatusError: true,
            isEmploymentStatusValid: true,

            EmployerName: '',
            EmployerNameValue:'',// this.props.PostData. && this.props.PostData.borrowers. !== undefined ? this.props.employerName : this.props.EmployerInformation && this.props.EmployerInformation.employerName && this.props.EmployerInformation.employerName !== undefined ? decodeURIComponent(this.props.EmployerInformation.employerName) : '',
            showEmployerNameError: true,
            isEmployerNameValid: true,

            position: '',
            PositionValue: '',// this.props.position && this.props.position !== undefined ? this.props.position : this.props.EmployerInformation && this.props.EmployerInformation.position && this.props.EmployerInformation.position !== undefined ? decodeURIComponent(this.props.EmployerInformation.position) : '',
            showPositionError: true,
            isPositionValid: true,

            StartDate: '',
            StartDateValue: '',
            showStartDateError: true,
            isStartDateValid: true,

            EndDate: '',
            EndDateValue: '',
            showEndDateError: true,
            isEndDateValid: true,
            EndDateDisabled: true,
            EndDateCheckBoxChecked: true,

            EmployerAddress1: '',
            EmployerAddress1Value:'',  //this.props.PostData && this.props.PostData.employerAddress1 ? decodeURIComponent(this.props.PostData.employerAddress1) : '',
            showEmployerAddress1Error: true,
            isEmployerAddress1Valid: true,

            EmployerAddress2: '',
            EmployerAddress2Value:'', //this.props.PostData && this.props.PostData.employerAddress2 ? decodeURIComponent(this.props.PostData.employerAddress2) : '',
            showEmployerAddress2Error: true,
            isEmployerAddress2Valid: true,

            EmployerCity: '',
            EmployerAddress1CityValue:'', //this.props.PostData && this.props.PostData.employerCity ? decodeURIComponent(this.props.PostData.employerCity) : '',
            showEmployerAddress1CityError: true,
            isEmployerAddress1CityValid: true,

            EmployerState: '',
            EmployerAddress1StateValue:this.props.PostDataEX && this.props.PostDataEX.borrowers[0].employmentInformation.employerState ? this.props.PostDataEX.borrowers[0].employmentInformation.employerState : defaultValues.defaultSelect,//this.props.PostData && this.props.PostData.state ? filteredState[0] ? filteredState[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            showEmployerAddress1StateError: true,
            isEmployerAddress1StateValid: true,
            employeraddress1statechange: '',

            EmployerZipCode: '',
            EmployerAddress1ZipcodeValue: '',//this.props.PostData && this.props.PostData.employerZipCode ? decodeURIComponent(this.props.PostData.employerZipCode) : '',
            showEmployerAddress1ZipcodeError: true,
            isEmployerAddress1ZipcodeValid: true,

            SalaryAmount: '',
            SalaryAmountValue: this.props.PostDataEX.borrowers[0] && this.props.PostDataEX.borrowers[0].annualIncome ? `$${AmountFormatting(this.props.PostDataEX.borrowers[0].annualIncome)}` : '',
            showSalaryAmountError: true,
            isSalaryAmountValid: true,
            PlainSalaryAmount: '',

            selectedSalaryPeriod: '',
            SalaryPeriodValue: 'yearly',
            showSalaryPeriodError: true,
            isSalaryPeriodValid: true,

            EmployerPhoneNumber: '',
            EmployerPhoneNumberValue:  this.props.PostData && this.props.PostData.phonenumber ? GetPhoneMask(decodeURIComponent(this.props.PostData.phonenumber)) : '',//this.props.PostData && this.props.PostData.employerPhoneNumber ? GetPhoneMask(decodeURIComponent(this.props.PostData.employerPhoneNumber)) : '',
            EmployerPhoneNumberMasked: this.props.PostData && this.props.PostData.phonenumber ? this.props.PostData.phonenumber : '',//this.props.PostData && this.props.PostData.employerPhoneNumber ? this.props.PostData.employerPhoneNumber : '',
            isEmployerPhoneNumbervalid: true,
            showEmployerphonenumberError: true,
           // PrimaryPhoneNumberValue: this.props.PostData && this.props.PostData.phonenumber ? GetPhoneMask(decodeURIComponent(this.props.PostData.phonenumber)) : '',
           
             
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
            EmploymentHistory: []
        }
    }
    componentDidMount() {
        this.initAutocomplete();
        this.getIPAddress();
        if (this.props.affiliateid === "CreditSoup" && (!this.ValidateInfo(false) || !this.IsValidBirthdate(this.props.PostData.birthdate))) {
            this.ShowLoanAppForm();
        }

        else {
            this.getLenderLogoURLFromConfig();
        }

        //CallGA(`/extended-loan-application/app-page-${this.state.currentPage}`);
        if (window.loadtracking) {
            window.loadtracking(`/extended-loan-application/app-page-${this.state.currentPage}`);
        }
        this.CallMatomoPageView(this.state.currentPage);
        // window.onbeforeunload = function(event) {
        //     event.returnValue = "Are you sure you want to reload page, it will redirect to Page 1.";
        // };
        window.curentstate = this;
        window.onpopstate = function (event) {
            var current = window.curentstate.state.currentPage;
            var updated = 0;
            let pageNo = window.location.pathname.replace('/app-page-', '');
            updated = parseInt(pageNo, 10);
            if (current > updated) {
                window.curentstate.BrowserBack(event);
            } else {
                //if(updated > 1 && updated <= 13 && window.curentstate.ValidateInfo()) {
                window.curentstate.BrowserForward(event);
                //} else {
                //console.log(window.location.pathname);
                //}
            }
        }
        this.setState({ mpUniqueClickID: this.getGUID() });
        
    }

    GetVersion(versions) {
        let filteredVersion = '';
        let currentVersion = this.props.version;
        if (currentVersion && currentVersion !== '') {
            filteredVersion = versions.filter(version => {
                if (version && currentVersion) {
                    return currentVersion.toLowerCase() === version.versionNumber.toLowerCase();
                }
                return filteredVersion ? filteredVersion[0] : null;
            });
        } else {
            currentVersion = 'default';
            filteredVersion = versions.filter(version => {
                if (version && currentVersion) {
                    return currentVersion.toLowerCase() === version.versionNumber.toLowerCase();
                }
                return filteredVersion ? filteredVersion[0] : null;
            });
        }
        this.state.TotalPages = filteredVersion[0].questions.extended.length;
        this.state.QuestionsIds = filteredVersion[0].questions.extended;
        
        return filteredVersion;
    }
    GetPagesByVersion(filteredVersion) {
        let pageArray = [];
        
        if (filteredVersion && filteredVersion.length > 0 && filteredVersion[0].questions.extended) {
            let pageCount = 1;           
            filteredVersion[0].questions.extended.forEach(element => {
                let customFormFields = this.GetFilteredQuestions(element);
                customFormFields.pageNumber = pageCount;                
                let state = this.GetConfigurableData(customFormFields, 0);
                let handleEvent = this.GetConfigurableData(customFormFields, 1);
                let showError = this.GetConfigurableData(customFormFields, 2);
                let showErrorMessage = this.GetConfigurableData(customFormFields, 3);
                let showCodeErrorMessage = this.GetConfigurableData(customFormFields, 4);
                let handleCheckboxEvent = this.GetConfigurableData(customFormFields, 5);
                let isDisabled = this.GetConfigurableData(customFormFields, 6);
                let checkboxValue = this.GetConfigurableData(customFormFields, 7);
                if (customFormFields.type === "dropdown") {
                    let customListItems = this.GetListItems(customFormFields);
                    let page = this.GetDropdownPage(customListItems, customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage);
                    pageArray.push(page);
                } else if (customFormFields.type === "text") {
                    let page = this.GetTextPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage);
                    pageArray.push(page);
                } else if (customFormFields.type === "button") {
                    let customListItems = this.GetListItems(customFormFields);
                    let page = this.GetButtonPage(customListItems, customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage);
                    pageArray.push(page);
                } else if (customFormFields.type === "masked-text") {
                    let page = this.GetMaskedTextPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage, handleCheckboxEvent, isDisabled, checkboxValue);
                    pageArray.push(page);
                } else if (customFormFields.type === "checkbox") {
                    let page = this.GetCheckboxPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage);
                    pageArray.push(page);
                } else if (customFormFields.type === "summary") {
                    let page = this.GetSummaryPage(customFormFields);
                    pageArray.push(page);
                } else if (customFormFields.type === 'group') {
                    customFormFields.subquestions.forEach(subelement => {
                        let customSubFormFields = this.GetFilteredQuestions(subelement);
                        customSubFormFields.pageNumber = pageCount;
                        let subState = this.GetConfigurableData(customSubFormFields, 0);
                        let subHandleEvent = this.GetConfigurableData(customSubFormFields, 1);
                        let subShowError = this.GetConfigurableData(customSubFormFields, 2);
                        let subShowErrorMessage = this.GetConfigurableData(customSubFormFields, 3);
                        let subShowCodeErrorMessage = this.GetConfigurableData(customSubFormFields, 4);
                        let handleCheckboxEvent = this.GetConfigurableData(customSubFormFields, 5);
                        let isDisabled = this.GetConfigurableData(customSubFormFields, 6);
                        let checkboxValue = this.GetConfigurableData(customSubFormFields, 7);
                        let subpage = undefined;

                        if (customSubFormFields.type === "dropdown") {
                            let subCustomListItems = this.GetListItems(customSubFormFields);
                            subpage = this.GetDropdownPage(subCustomListItems, customSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "text") {
                            subpage = this.GetTextPage(customSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "button") {
                            let subCustomListItems = this.GetListItems(customSubFormFields);
                            subpage = this.GetButtonPage(subCustomListItems, customSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "masked-text") {
                            subpage = this.GetMaskedTextPage(customSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage, handleCheckboxEvent, isDisabled, checkboxValue);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "checkbox") {
                            subpage = this.GetCheckboxPage(customSubFormFields, state, subHandleEvent, showError, showErrorMessage, showCodeErrorMessage);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "summary") {
                            let subpage = this.GetSummaryPage(customSubFormFields);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === 'group') {
                            
                            customSubFormFields.subquestions.forEach(subelement => {
                                let customSubSubFormFields = this.GetFilteredQuestions(subelement);
                                customSubSubFormFields.pageNumber = pageCount;
                                let subState = this.GetConfigurableData(customSubSubFormFields, 0);
                                let subHandleEvent = this.GetConfigurableData(customSubSubFormFields, 1);
                                let subShowError = this.GetConfigurableData(customSubSubFormFields, 2);
                                let subShowErrorMessage = this.GetConfigurableData(customSubSubFormFields, 3);
                                let subShowCodeErrorMessage = this.GetConfigurableData(customSubSubFormFields, 4);
                                let handleCheckboxEvent = this.GetConfigurableData(customSubSubFormFields, 5);
                                let isDisabled = this.GetConfigurableData(customSubSubFormFields, 6);
                                let checkboxValue = this.GetConfigurableData(customSubSubFormFields, 7);
                                let subSubPage = undefined;
                                if (customSubSubFormFields.type === "dropdown") {
                                    let subCustomListItems = this.GetListItems(customSubSubFormFields);
                                    subSubPage = this.GetDropdownPage(subCustomListItems, customSubSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                                    pageArray.push(subSubPage);
                                } else if (customSubSubFormFields.type === "text") {

                                    subSubPage = this.GetTextPage(customSubSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                                    pageArray.push(subSubPage);
                                } else if (customSubSubFormFields.type === "button") {
                                    let subCustomListItems = this.GetListItems(customSubSubFormFields);
                                    subSubPage = this.GetButtonPage(subCustomListItems, customSubSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                                    pageArray.push(subSubPage);
                                } else if (customSubSubFormFields.type === "masked-text") {
                                    subSubPage = this.GetMaskedTextPage(customSubSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage, handleCheckboxEvent, isDisabled, checkboxValue);
                                    pageArray.push(subSubPage);
                                } else if (customSubSubFormFields.type === "checkbox") {
                                    subSubPage = this.GetCheckboxPage(customSubSubFormFields, state, subHandleEvent, showError, showErrorMessage, showCodeErrorMessage);
                                    pageArray.push(subSubPage);
                                } else if (customSubSubFormFields.type === "summary") {
                                    subSubPage = this.GetSummaryPage(customSubSubFormFields);
                                    pageArray.push(subSubPage);
                                }
                            });
                        }
                    });
                }
                pageCount++
            });
        }
        return pageArray;
    }
    GetConfigurableData(customFormFields, itemId) {
        if (customFormFields.name && customFormFields.name.toLowerCase() === "employername") {
            if (itemId === 0) return this.state.EmployerNameValue;
            if (itemId === 1) return this.handleEmployerNameChange.bind(this);
            if (itemId === 2) return this.state.isEmployerNameValid;
            if (itemId === 3) return this.state.showEmployerNameError;
        }
        else if (customFormFields.name && customFormFields.name.toLowerCase() === "position") {
            if (itemId === 0) return this.state.PositionValue;
            if (itemId === 1) return this.handlePositionChange.bind(this);
            if (itemId === 2) return this.state.isPositionValid;
            if (itemId === 3) return this.state.showPositionError;
        }
        else if (customFormFields.name && customFormFields.name.toLowerCase() === "startdate") {
            if (itemId === 0) return this.state.StartDateValue;
            if (itemId === 1) return this.handleStartDateChange.bind(this);
            if (itemId === 2) return this.state.isStartDateValid;
            if (itemId === 3) return this.state.showStartDateError;
        }else if (customFormFields.name && customFormFields.name.toLowerCase() === "enddate") {
            if (itemId === 0) return this.state.EndDateValue;
            if (itemId === 1) return this.handleEndDateChange.bind(this);
            if (itemId === 2) return this.state.isEndDateValid;
            if (itemId === 3) return this.state.showEndDateError;
            if (itemId === 5) return this.handleEndDateCheckBoxEvent.bind(this);
            if (itemId === 6) return this.state.EndDateDisabled;
            if (itemId === 7) return this.state.EndDateCheckBoxChecked;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "employeraddress1") {
            if (itemId === 0) return this.state.EmployerAddress1Value;
            if (itemId === 1) return this.handleEmployerAddress1Change.bind(this);
            if (itemId === 2) return this.state.isEmployerAddress1Valid;
            if (itemId === 3) return this.state.showEmployerAddress1Error;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "employeraddress2" ) {
            if (itemId === 0) return this.state.EmployerAddress2Value;
            if (itemId === 1) return this.handleEmployerAddress2Change.bind(this);
            if (itemId === 2) return this.state.isEmployerAddress2Valid;
            if (itemId === 3) return this.state.showEmployerAddress2Error;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "employercity" ) {
            if (itemId === 0) return this.state.EmployerAddress1CityValue;
            if (itemId === 1) return this.handleEmployerAddress1CityChange.bind(this);
            if (itemId === 2) return this.state.isEmployerAddress1CityValid;
            if (itemId === 3) return this.state.showEmployerAddress1CityError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "employerstate") {
            if (itemId === 0) return this.state.EmployerAddress1StateValue;
            if (itemId === 1) return this.handleEmployerAddress1StateChange.bind(this);
            if (itemId === 2) return this.state.isEmployerAddress1StateValid;
            if (itemId === 3) return this.state.showEmployerAddress1StateError;
        }
        else if (customFormFields.name && customFormFields.name.toLowerCase() === "employerzipcode") {
            if (itemId === 0) return this.state.EmployerAddress1ZipcodeValue;
            if (itemId === 1) return this.handleEmployerAddress1ZipcodeChange.bind(this);
            if (itemId === 2) return this.state.isEmployerAddress1ZipcodeValid;
            if (itemId === 3) return this.state.showEmployerAddress1ZipcodeError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "employerphonenumber") {
            if (itemId === 0) return this.state.EmployerPhoneNumberValue;
            if (itemId === 1) return this.handleEmployerPhonenumberChange.bind(this);
            if (itemId === 2) return this.state.isEmployerPhoneNumbervalid;
            if (itemId === 3) return this.state.showEmployerphonenumberError;
        } 
        else if (customFormFields.name && customFormFields.name.toLowerCase() === "salaryamount") {
            if (itemId === 0) return this.state.SalaryAmountValue;
            if (itemId === 1) return this.handleSalaryAmountChange.bind(this);
            if (itemId === 2) return this.state.isSalaryAmountValid;
            if (itemId === 3) return this.state.showSalaryAmountError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "salaryperiod") {
            if (itemId === 0) return this.state.SalaryPeriodValue;
            if (itemId === 1) return this.handleSalaryPeriodChange.bind(this);
            if (itemId === 2) return this.state.isSalaryPeriodValid;
            if (itemId === 3) return this.state.showSalaryPeriodError;
        } 
    }
    GetColumnWidth(col) {
        var strColumn = '';
        // if(col === 1) {
        //     strColumn = 'col-sm-12 col-xs-12';
        // } else if(col === 2) {
        //     strColumn = 'col-sm-6 col-xs-12';
        // } else if(col === 3) {
        //     strColumn = 'col-sm-4 col-xs-12';
        // } else if(col === 4) {
        //     strColumn = 'col-sm-3 col-xs-12';
        // }
        strColumn = `col-sm-${col} col-xs-12`;
        return strColumn;
    }
    GetDropdownPage(customListItems, customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        let columnStyle = '';
        let columnWidth = this.GetColumnWidth(customFormFields.col);
        // if(customFormFields.name === 'employerState' ){
        //     columnStyle = ` text-control-align new-height state ${columnWidth}`
        // } else if(customFormFields.name === 'SalaryPeriod' ) {
        //     columnStyle = ` text-control-align new-height ${columnWidth}`
        // }
        // else {
        columnStyle = ` text-control-align ${columnWidth}`
        //}
        return <BCSelectField
            css={this.props.versionConfigSettings.css}
            type={customFormFields.type}
            OnDropdownClick={this.onLoanPurposeClick.bind(this)}
            GetActiveLabel={this.getLoanPurposeLabel}
            SelectedValue={state}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            ShowHideList={this.showHideLoanPurposeList}
            DisplayItem={this.state.displayLoanPurposeItems}
            ListData={customListItems}
            HandleSelectedOption={handleEvent}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialEnabled}
            showTitle={customFormFields.showTitle}
            AutoFocus={customFormFields.focus}
            tabIndex={customFormFields.pageNumber}
            columnStyle={columnStyle}
            name={customFormFields.name} IsZalea={this.props.IsZalea} />;
    }
    GetTextPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        let min = ''; let max = '';
        let columnStyle = '';
        let customeMessage = '';
        let showToolTip = false;
        let inputType = "";
        let columnWidth = this.GetColumnWidth(customFormFields.col);
        if (customFormFields.name === 'loanAmount') {
            min = constantVariables.loanAmountMin;
            max = constantVariables.loanAmountMax;
        } else if (customFormFields.name === 'ssn') {
            min = '9';
            max = '9';
        } else if (customFormFields.name === 'housingpayment') {
            max = '8';
        }
        // if(customFormFields.name === 'employerAddress2' || customFormFields.name === 'employerAddress1' || customFormFields.name === 'legalname' || customFormFields.name === 'lastname' || customFormFields.name === 'primaryphonenumber'
        //  || customFormFields.name === 'secondaryphonenumber' || customFormFields.name === 'employerName' || customFormFields.name === 'position'
        //  || customFormFields.name === 'salaryAmount' || customFormFields.name === 'salaryPeriod'){
        //     columnStyle = ` text-control-align new-height updated-margin ${columnWidth}`
        // }else if(customFormFields.name === 'employerAddress1city' || customFormFields.name === 'employerZipCode'){
        //     columnStyle = ` text-control-align new-height ${columnWidth}`
        // }else{
        columnStyle = ` text-control-align ${columnWidth}`
        //}

         if (customFormFields.name === "employerAddress1") {
            customeMessage = this.state.showAddressMessage;
        } else {
            customeMessage = '';
        }
        if ( customFormFields.name === "employerPhoneNumber" ||
            customFormFields.name === "employerZipCode" || 
            customFormFields.name === "salaryAmount" ) {
            inputType = 'tel'
        }

        return <BCTextField formFields={customFormFields}
            css={this.props.versionConfigSettings.css}
            type={customFormFields.type}
            handleChangeEvent={handleEvent}  
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber} inputType={inputType} showWrapErrorMessage={false} isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice} name={customFormFields.name}
            IsZalea={this.props.IsZalea}
            OnFocusIn={this.handleFocusIn.bind(this, customFormFields.name)}
            currentBrowser={this.props.currentBrowser}
            customeMessage={customeMessage}
            showToolTip={showToolTip}
            min={min} max={max} showTitle={customFormFields.showTitle}
            columnStyle={columnStyle} key={customFormFields.name} />;
    }
    GetMaskedTextPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage, handleCheckBoxEvent, IsDisabled, CheckBoxChecked) {
        let customeMessage = '';
        let columncssStyle = '';
        let columnWidth = this.GetColumnWidth(customFormFields.col);
        //let checbox = customFormFields.name === 'endDate' ? <CheckBoxField name={customFormFields.name} title={'some message'} /> : ''; 
        if (customFormFields.name === "startDate" || customFormFields.name === "endDate") {
            customeMessage = this.state.showStartDateerrorMessage;
        } else {
            customeMessage = ''
        }
        //   if(customFormFields.name === 'primaryphonenumber' || customFormFields.name === 'secondaryphonenumber' || customFormFields.name === 'startDate' || customFormFields.name === 'endDate' || customFormFields.name === 'workPhone'){
        //     columncssStyle = ` text-control-align new-height updated-margin ${columnWidth}`
        //   } else {
        columncssStyle = ` text-control-align ${columnWidth}`;
        // }
        return <MaskedTextField formFields={customFormFields}
            css={this.props.versionConfigSettings.css}
            type={customFormFields.type}
            handleChangeEvent={handleEvent}
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}            
            name={customFormFields.name} customeMessage={customeMessage}
            inputType="tel" IsNumeric={true} AutoFocus={customFormFields.focus}
            fieldname={customFormFields.name}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            columnStyle={columncssStyle}
            IsZalea={this.props.IsZalea}
            handleCheckboxEvent={handleCheckBoxEvent}
            disabled={IsDisabled} IsCheckboxChecked={CheckBoxChecked}
        />;
    }
    GetButtonPage(customListItems, customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        return <BCButtonField columnStyle={` button-control-align ${" col-sm-12 col-xs-12 "}`}
            css={this.props.versionConfigSettings.css}
            type={customFormFields.type}
            OnDropdownClick={this.onEstimatedCreditScoreClick.bind(this)}
            GetActiveLabel={this.getEstimatedCreditScoreLabel}
            SelectedValue={state}
            ShowHideList={this.showHideEstimatedCreditScoreList}
            DisplayItem={this.state.displayEstimatedCreditScoreItems}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            ListData={customListItems}
            HandleSelectedOption={handleEvent}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber} IsZalea={this.props.IsZalea}
            name={customFormFields.name} />;
    }
    GetCheckboxPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        let columnWidth = this.GetColumnWidth(customFormFields.col);
        return <CheckBoxField formFields={customFormFields} Title={customFormFields.placeholder} keyID={'test'} handleOnChange={handleEvent}
            css={this.props.versionConfigSettings.css}
            type={customFormFields.type}    
            name={customFormFields.name} columnStyle={` text-control-align ${columnWidth}`} currentDevice={this.props.currentDevice} />;
    }
    GetSummaryPage(customFormFields) {
        let columnWidth = this.GetColumnWidth(customFormFields.col);
        return <LoanApplicationForm formFields={customFormFields} PostData={this.props.PostData} PostDataEX={this.state.CompleteInfo} EmploymentData={this.props.EmploymentData} BankData={window.BankData} OfferData={window.OfferData} columnStyle={` text-control-align ${columnWidth}`}
            css={this.props.versionConfigSettings.css}
            configSettings={this.props.configSettings} ThemeConfig={this.props.ThemeConfig} currentDevice={this.props.currentDevice} />;
    }

    GetFilteredQuestions(id) {
        const filteredQuestions = this.props.versionConfigSettings.questions.filter(question => {
            if (question && id) {
                return question.id === id;
            }
            return filteredQuestions ? filteredQuestions[0] : null;
        });
        return filteredQuestions ? filteredQuestions[0] : null;
    }
    GetListItems(customFormFields) {
        if (customFormFields.listItem === "stateList") {
            return stateList;
        } else if (customFormFields.listItem === "salaryPeriod") {
            return salaryPeriod;
        }
    }
    ShowLoanAppForm() {
        this.setState({
            IsCreditSoupEdit: true, IsCreditSoup: false,
            selectedHousing: this.getHousingKey(this.state.selectedHousing),
            selectedEmployment: this.getEmploymentKey(this.state.selectedEmployment),
            selectedEstimatedCreditScore: this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)
        });
        if (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage') {
            this.setState({ housingPaymentDisabled: false });
        }
        document.getElementById('frmPrequalify').ssn.type = "password";
    }
    initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        try {
            autocomplete = new window.google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('employerAddress1')),
                { types: ['geocode'] });

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
            autocomplete.setComponentRestrictions({ 'country': ['us'] });
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
    fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        if(place.address_components) {
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
            //this.props.IsZalea ? stateHWList.find(o => o.key === state) : 
            if (!this.handlePOBoxAddress(streetAdd)) {
                let findState = stateList.find(o => o.key === state);
                if (findState !== null && findState !== undefined) {
                    this.setState({
                        EmployerAddress1Value: `${streetAdd} ${aprtmentAdd} `, EmployerAddress2Value: '', EmployerAddress1CityValue: city,
                        EmployerAddress1StateValue: state, EmployerAddress1ZipcodeValue: zip, showInvalidAddressModal: false, IsContinue: false
                    });
                    document.getElementById('employerPhoneNumber').focus();
                
                }
                else {
                    this.setState({ showInvalidAddressModal: true });
                }
            } else {
                this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showEmployerAddress1Error: false });
            }
        }
    }

    closePopup() {
        this.setState({ showInvalidAddressModal: false, showFundingModal: false, showStateLoanAmountModal: false });
    }
    AagreeTCPAChange(e) {
        this.setState({ AgreeTCPA: e.target.checked });
    }
    AgreeEmailChange(e) {
        this.setState({ AgreeEmail: document.getElementById('frmPrequalify').agreeemail.checked, isError: false });
    }
    AgreeTermChange(e) {
        this.setState({ AgreeTerms: document.getElementById('frmPrequalify').agreeterms.checked, isError: false });
    }
    AgreePqTermsChange(e) {
        this.setState({ AgreePqTerms: document.getElementById('frmPrequalify').agreePqTerms.checked, isError: false });
    }
    AgreeConsentChange(e) {
        this.setState({ AgreeConsent: document.getElementById('frmPrequalify').agreeconsent.checked, isError: false });
    }
    GetIncludeFees(e) {
        this.setState({ IncludeFees: document.getElementById('frmPrequalify').updatedLoanAmount.checked });
    }
    InitialClick(e) {
        // let isValid = true;
        // if (!this.state.EmployerNameValue) { isValid = false; }
        // if (!this.state.PositionValue) { isValid = false; }
        // if (!this.state.EmailValue) { isValid = false; }
        // else if (!emailRegex.test(this.state.EmailValue)) {
        //     isValid = false;
        // }
        // if (isValid && this.state.EmailValue !== this.state.EmailChangedValue) {
        //     this.setState({ initialDisabled: false, EmailChangedValue: this.state.EmailValue, InCompleteEmailSent: true });
        //     var payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.FirstWordCapital(this.state.FirstNameValue)}&lastname=${this.FirstWordCapital(this.state.LastNameValue)}&action=mandrill_incomplete&nonce=4109b2257c`;
        //     SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);
        // }
    }
    ShowPowerdByPrimeRates(show) {
        try {
            document.getElementById("footer-text").style.display = show;
            document.getElementById("disclaimer-text").style.display = show;
        }
        catch (e) { }
    }
    ShowHeadwayMenu(show) {
        try {
            document.getElementById("headway-menu").style.display = show;
            document.getElementById("personal-loan-bar").style.display = show;
            document.getElementById("business-loan").style.display = show;
        }
        catch (e) { }
    }
    BrowserForward(e) {
        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
        let currentPageState = this.state.currentPage;
        if (this.state.currentPage > 1 && this.state.currentPage <= this.state.TotalPages && this.ValidateInfo(false)) {
            if (customFormFields.name === "housing" && (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage')) {
                currentPageState = currentPageState + 1;
            } else if (customFormFields.name === "housing") {
                currentPageState = currentPageState + 2;
            } else {
                // if((customFormFields.name === "phonenumber" && this.state.skipPage12) ||
                // (customFormFields.name === "annualincome" && this.state.skipPage10)) {
                //     currentPageState = currentPageState + 2;
                // } else {
                currentPageState = currentPageState + 1;
                // }
            }
           // customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
            this.setState({ currentPage: currentPageState });
            if (customFormFields.name === "employerName"  && this.state.EmployerNameValue && this.state.isEmployerNameValid) {
                this.setState({ IsContinue: false });
            }
            if (customFormFields.name === "employerPhoneNumber" || customFormFields.name === "employerAddress1") {
                this.setState({ IsContinue: false});
            }
            if (customFormFields.name === "employerPhoneNumber" && this.state.EmployerPhoneNumberValue && this.state.isEmployerPhoneNumbervalid) {
                this.setState({ IsContinue: true });
            }
            if (customFormFields.name === "employerAddress1" && this.state.EmployerAddress1Value && this.state.isEmployerAddress1Valid
                && this.state.EmployerAddress1StateValue !== 'Select' && this.state.isEmployerAddress1StateValid
                && this.state.EmployerAddress1CityValue && this.state.isEmployerAddress1CityValid
                && this.state.EmployerAddress1ZipcodeValue && this.state.isEmployerAddress1ZipcodeValid && this.state.showEmployerAddress1CityError && this.state.showEmployerAddress1ZipcodeError) {
                this.setState({ IsContinue: false });
            }

            if (customFormFields.name === 'employerAddress1') {
                setTimeout(() => {
                    this.initAutocomplete();
                }, 1000);
            }
            if (window.loadtracking) {
                window.loadtracking(`/extended-loan-application/app-page-${currentPageState}`);
            }
            this.CallMatomoPageView(currentPageState);
            if (this.state.currentPage === this.state.TotalPages) {
                //this.state.buttonText = 'View Pre-Qualified Offers';
                this.setState({ buttonText: 'View Pre-Qualified Offers' });
                // setTimeout(() => {                     
                //     document.getElementById('frmPrequalify').agreePqTerms.checked = true;
                // }, 1000); 
                //this.setState({ buttonText : 'View Pre-Qualified Offers'});
            } else {
                this.setState({ buttonText: 'Continue' });
            }
        }
    }
    BrowserBack(e) {
        
        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
        let currentPageState = this.state.currentPage;

        if (this.state.currentPage > 1 && this.state.currentPage <= this.state.TotalPages) {
            if (customFormFields.name === "estimatedcreditscore" && (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage')) {
                //this.setState({currentPage : this.state.currentPage - 1});
                currentPageState = currentPageState - 1;
            } else if (customFormFields.name === "estimatedcreditscore") {
                //this.setState({currentPage : this.state.currentPage - 2});
                currentPageState = currentPageState - 2;
            } else {
                // if(this.props.IsZalea) {
                // if((currentPageState === this.state.TotalPages && this.state.skipPage12) ||
                // (customFormFields.name === 11 && this.state.skipPage10)) {
                //     currentPageState = currentPageState - 2;
                // } else {
                //     currentPageState = currentPageState - 1;
                // }
                // } 
                // else {
                currentPageState = currentPageState - 1;
                // }
                // this.setState({currentPage : this.state.currentPage - 1});
            }
            customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
            this.setState({ currentPage: currentPageState });
            this.CallMatomoPageView(currentPageState);
            if (customFormFields.name === "legalname" || customFormFields.name === "loanAmount") {
                this.setState({ IsContinue: false, PreviousPhone: this.state.EmployerPhoneNumberValue });
            }

            if (customFormFields.name === 'employerAddress1') {
                setTimeout(() => {
                    this.initAutocomplete();
                }, 1000);
            }
        }
        if (this.state.currentPage === this.state.TotalPages) {
            //this.state.buttonText = 'View Pre-Qualified Offers';
            this.setState({ buttonText: 'View Pre-Qualified Offers' });
            // setTimeout(() => {                     
            //     document.getElementById('frmPrequalify').agreePqTerms.checked = true;
            // }, 1000); 
            //this.setState({ buttonText : 'View Pre-Qualified Offers'});
        } else {
            this.setState({ buttonText: 'Continue' });
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
    CallMatomoPageView(currentPageState) {
        if (window._paq) {
            window._paq.push(['setCustomUrl', `/extended-loan-application/app-page-${currentPageState}`]);
            window._paq.push(['setDocumentTitle', `Breadcrumb Application - Page ${currentPageState}`]);
            window._paq.push(['trackPageView']);
        }
    }
    Continue(e) {
        e.preventDefault();

        if (this.ValidateInfo(true)) {
            // var difference = compareTwoDates(this.state.StartDateValue, this.state.EndDateValue);
            //     if(difference < 0) {
            //         alert('start date can not be greater then end date');
            //     } else if(difference < 3) {
            //         alert('employment history needs atleast for 3 years');
            //         this.SaveEmploymentHistory();
            //         return;
            //     } else {               
            //this.SaveEmploymentHistory();
            //(true) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}-ContinueClicked`);
            CallGAEvent("View Pre-Qualified Offers Button", "Application Submitted");

            //View Pre-Qualified Offers
            let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
            let currentPageState = this.state.currentPage;
            if (this.state.currentPage === this.state.TotalPages) {
                // var payload = '';
                // payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.FirstWordCapital(this.state.FirstNameValue)}&lastname=${this.FirstWordCapital(this.state.LastNameValue)}&agreeemail=${this.state.AgreeEmail}&action=mandrill_complete&nonce=4109b2257c&isZalea=${window.isZalea}`;
                // SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);

                var that = this;
                if (window.presubmit !== undefined) window.presubmit();

                that.setState({ showModal: true });
                let app = 'Breadcrumb';
                if (window._paq) {
                    window._paq.push(['setCustomDimension', window.customDimensionId = 3, window.customDimensionValue = that.state.mpUniqueClickID]);
                    window._paq.push(['setCustomDimension', window.customDimensionId = 8, window.customDimensionValue = that.state.mpUniqueClickID]);
                    window._paq.push(['setCustomDimension', window.customDimensionId = 11, window.customDimensionValue = that.getEstimatedCreditScoreKey(that.state.selectedEstimatedCreditScore)]);
                    window._paq.push(['setCustomDimension', window.customDimensionId = 12, window.customDimensionValue = that.state.AnnualIncomeValue]);
                    window._paq.push(['setCustomDimension', window.customDimensionId = 14, window.customDimensionValue = this.props.affiliateid ? this.props.affiliateid : null]);
                    window._paq.push(['setCustomDimension', window.customDimensionId = 19, window.customDimensionValue = app]);
                    window._paq.push(['trackEvent', 'PLPQ', 'PLPQ App Submit', `${app}`]);
                }
                var second = 0;
                var x = setInterval(function () {
                    if (second < 1) {

                        if (!that.state.IsFormSubmitted) {

                            if (!((that.state.IsIntercom || that.state.IsIntercomEdit) && that.state.selectedEstimatedCreditScore === '350-619')) {
                                document.getElementById('frmPrequalify').submit();
                            }
                            else {
                                window.location.href = that.props.configSettings.intercomRedirectUrl;
                            }
                            that.setState({ IsFormSubmitted: true });
                            window.scrollTo(0, 0);
                        }
                    }
                    second++;
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
                if (window.loadtracking) {
                    window.loadtracking(`/extended-loan-application/app-breadcrumb-submitted`);
                }
            } else {
                //let currentPageState = this.state.currentPage;
                if(customFormFields.name === "employerName") {
                    this.setState({ CompleteInfo: this.GetEmploymentInfo() });
                }
                if (customFormFields.name === "housing" && (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage')) {
                    //this.setState({ currentPage : currentPageState + 1 });
                    currentPageState = currentPageState + 1;
                    //this.state.currentPage = this.state.currentPage + 1;
                } else if (customFormFields.name === "housing") {
                    //this.setState({ currentPage : currentPageState + 2 });
                    currentPageState = currentPageState + 2;
                    //this.state.currentPage = this.state.currentPage + 2;
                } else {
                    // if(this.props.IsZalea) {
                    // if((customFormFields.name === "phonenumber" && this.state.skipPage12) ||
                    // (customFormFields.name === "annualincome" && this.state.skipPage10)) {
                    //     currentPageState = currentPageState + 2;
                    // } else {
                    //     currentPageState = currentPageState + 1;
                    // }
                    // } else {
                    //     currentPageState = currentPageState + 1;
                    // }
                    //this.setState({ currentPage : this.state.currentPage + 1 });
                    currentPageState = currentPageState + 1;
                }
                customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, currentPageState);
                this.setState({ currentPage: currentPageState });
                if (customFormFields.name === "employerPhoneNumber" && !this.state.EmployerPhoneNumberValue) {
                    this.setState({ IsContinue: true });
                }
                else if (customFormFields.name === "employerPhoneNumber" && this.state.EmployerPhoneNumberValue && this.state.isPrimaryPhoneNumberValid) {
                    this.setState({ IsContinue: false });
                    //this.state.IsContinue = true;
                }
                if (customFormFields.name === "employerAddress1" && this.state.StreetAddressValue && this.state.isEmployerAddress1Valid
                    && this.state.EmployerAddress1StateValue !== 'Select' && this.state.isEmployerAddress1StateValid
                    && this.state.EmployerAddress1CityValue && this.state.isEmployerAddress1CityValid
                    && this.state.EmployerAddress1ZipcodeValue && this.state.isEmployerAddress1ZipcodeValid && this.state.showEmployerAddress1CityError && this.state.showEmployerAddress1ZipcodeError) {
                    this.setState({ IsContinue: false });
                }

                window.history.pushState("", "", `/extended-loan-application/app-page-${currentPageState}`);

                if (window.loadtracking) {
                    window.loadtracking(`/extended-loan-application/app-page-${currentPageState}`);
                }

                this.CallMatomoPageView(currentPageState);
            }
            setTimeout(() => {
                if (customFormFields.name === "employerAddress1") {
                    this.initAutocomplete();
                }
            }, 1000);
            //if(this.state.currentPage != 14) {

            //CallGA(`/extended-loan-application/app-page-${this.state.currentPage}`);
            //CallGAEvent("page","load",`/extended-loan-application/app-page-${this.state.currentPage}`);
            //}
            if (currentPageState === this.state.TotalPages) {

                //this.state.buttonText = 'View Pre-Qualified Offers';
                this.setState({ buttonText: 'View Pre-Qualified Offers' });
                // setTimeout(() => {                     
                //     document.getElementById('frmPrequalify').agreePqTerms.checked = true;
                // }, 1000); 
                //this.setState({ buttonText : 'View Pre-Qualified Offers'});
            } else {
                this.setState({ buttonText: 'Continue' });
            }
            window.scrollTo(0, 0);
            // try {
            //     window.ga('send', {
            //         hitType: 'pageview',
            //         page: `/Breadcrumb/pageNumber${this.state.currentPage}`
            //     });
            // }
            // catch(e) {

            // }
            //}           
        }
    }

    FirstWordCapital(value) {
        return value.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
    }
    ValidateInfo(checkAllFields, event) {
        
        if (!this.state.initialDisabled) {
            let isValid = true;
            let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
            if (customFormFields.name === "employerName") {
                if (!this.state.EmployerNameValue) {
                    this.setState({
                        isEmployerNameValid: false
                    });
                    isValid = false;
                } else {
                    this.setState({
                        EmployerNameValue: this.FirstWordCapital(this.state.EmployerNameValue)
                    });
                }       
                if (!this.state.EmployerAddress1Value) {
                    this.setState({
                        isEmployerAddress1Valid: false
                    });
                    isValid = false;
                }
                if (!this.state.EmployerAddress1CityValue) {
                    this.setState({
                        isEmployerAddress1CityValid: false
                    });
                    isValid = false;
                }
                if (!this.state.EmployerAddress1ZipcodeValue) {
                    this.setState({
                        isEmployerAddress1ZipcodeValid: false
                    });
                    isValid = false;
                } else if (this.state.EmployerAddress1ZipcodeValue.length < 5) {
                    this.setState({
                        isEmployerAddress1ZipcodeValid: true,
                        showEmployerAddress1ZipcodeError: false
                    });
                    isValid = false;
                }
                if(!this.state.EmployerAddress1StateValue){
                    this.setState({
                        isEmployerAddress1StateValid: false,
                        showEmployerAddress1StateError: true
                    });
                    isValid = false;
                } 
                if (this.state.EmployerAddress1StateValue === 'Select') {
                    this.setState({
                        isEmployerAddress1StateValid: false,
                        showEmployerAddress1StateError: true
                    });
                    isValid = false;
                } else {
                    if (this.state.EmployerAddress1StateValue === 'California' || this.state.EmployerAddress1StateValue === 'Texas') {
                    }
                }
                if (isValid) {
                   this.ValidateEmployerCityStateZip(true);
                    isValid = !this.state.IsContinue;
                   
                }
                if (!this.state.EmployerAddress1Value || !this.state.isEmployerAddress1Valid
                    || this.state.EmployerAddress1StateValue === 'Select' || !this.state.isEmployerAddress1StateValid
                    || !this.state.EmployerAddress1CityValue || !this.state.isEmployerAddress1CityValid
                    || !this.state.EmployerAddress1ZipcodeValue || !this.state.isEmployerAddress1ZipcodeValid
                    || !this.state.showEmployerAddress1CityError || !this.state.showEmployerAddress1ZipcodeError) {
                    isValid = false;
                }              
               
                let startDate = this.state.StartDateValue;
                if (!startDate) {
                    this.setState({
                        isStartDateValid: false,
                        showStartDateError: true
                    });
                    isValid = false;
                } else {
                   
                    startDate = startDate.replace(/_/g, ''); 
                    if (startDate.length < 10) {
                        this.setState({
                            isStartDateValid: false,
                            showStartDateError: false,
                            showStartDateerrorMessage: 'Please enter a valid date'
                        });
                        isValid = false;
                    } else{

                        let age = calculateAge(new Date(this.props.PostDataEX.borrowers[0].dateOfBirth), new Date(startDate));
                        if (age < 10) {
                            this.setState({
                                isStartDateValid: true,
                                showStartDateError: false,
                                showStartDateerrorMessage: 'Invalid start date'
                            });
                            isValid = false;
                         } else {
                                this.setState({
                                    isStartDateValid: true,
                                    showStartDateError: false,
                                   //showStartDateerrorMessage: 'Invalid start date'
                                });
                                //isValid = false;
                        }
                      
                        const message = checkValidDate(startDate);
                        if (message === '') {
                            const futureDate = isFutureDate(startDate);
                            if (futureDate) {
                                this.setState({
                                    isStartDateValid: true,
                                    showStartDateError: false,
                                    showStartDateerrorMessage: 'Future date is not allowed'
                                });
                                isValid = false;
                            } 
                        } else {
                            this.setState({
                                isStartDateValid: true,
                                showStartDateError: false,
                                showStartDateerrorMessage: `Please provide valid ${message}`
                            });
                            isValid = false;
                        }    
                    }
                 }
              
                if(!this.state.EndDateCheckBoxChecked) {
                    let endDate = this.state.EndDateValue;
                    if (!endDate) {
                        this.setState({
                            isEndDateValid: false,
                        // showEndDateError: false
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
                                        showStartDateerrorMessage: 'Future date is not allowed'
                                    });
                                    isValid = false;
                                } 
                            } else {
                                this.setState({
                                    isEndDateValid: true,
                                    showEndDateError: false,
                                    showStartDateerrorMessage: `Please provide valid ${message}`
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
                // if(this.state.EndDateCheckBoxChecked){
                //     return this.state.EndDateDisabled == true && this.state.showEndDateError == false;            
                // }else(!this.state.EndDateCheckBoxChecked){
                //     return this.state.EndDateDisabled == false && this.state.showEndDateError == false;
                // }
            
                let salaryAmount = unFormatAmount(this.state.SalaryAmountValue);
                if (!salaryAmount) {
                    this.setState({
                        isSalaryAmountValid: false,
                        showSalaryAmountError: true
                    });
                    isValid = false;
                }    


                let salaryPeriod = this.state.SalaryPeriodValue;
                if(!salaryPeriod){
                    this.setState({
                        isSalaryPeriodValid: false,
                        showSalaryPeriodError: true
                    });
                    isValid = false;
                }
                if (salaryPeriod === 'Select') {
                    this.setState({
                        isSalaryPeriodValid: false,
                        showSalaryPeriodError: true
                    });
                    isValid = false;
                }
                let position = this.state.PositionValue;	
                if (!position) {
                    this.setState({
                        isPositionValid: false,
                        showPositionError: true
                    });
                    isValid = false;
                } else {
                    this.setState({
                        PositionValue: this.FirstWordCapital(this.state.PositionValue)
                    });
                }

                
                let employerPhoneNumber = this.state.EmployerPhoneNumberValue;
                if (!employerPhoneNumber) {
                    this.setState({
                        isEmployerPhoneNumbervalid: false,
                        showEmployerphonenumberError: true
                    });
                    isValid = false;
                } else {
                    employerPhoneNumber = employerPhoneNumber.replace(/_/g, '');
                    if (employerPhoneNumber.length === 10) {
                        this.setState({
                            isEmployerPhoneNumbervalid: false,
                            showEmployerphonenumberError: true,
                           // showDOBMessage: 'Please enter a valid date'
                        });
                        isValid = false;
                    } else {
                      if (!IsPhoneNumberValid(employerPhoneNumber)){
                            this.setState({  
                                showEmployerphonenumberError: false,
                                
                            });  
                            isValid = false;
                        }
                        else{
                            this.setState({
                                showEmployerphonenumberError: true,
                            });
                        }
                    }
                    
                }

            }

            if (checkAllFields) {
                if (this.state.currentPage === this.state.TotalPages) {
                    // let isAgreePqTerms = document.getElementById('frmPrequalify').agreePqTerms.checked;

                    // if (!isAgreePqTerms) { this.setState({ AgreePqTerms: false }); isValid = false; }

                    let isAgreeTCPA = document.getElementById('agreeTCPA').value;

                    if (isAgreeTCPA !== 'true') { this.setState({ AgreeTCPA: false }); } else { this.setState({ AgreeTCPA: true }); }
                }
            }



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
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("FirstName", "FocusOut");
                if (!fname) { this.setState({ isFirstNameValid: false }); }
                else { this.setState({ isFirstNameValid: true }); this.InitialClick(); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("First Name", "FocusIn");
            }
        }
    }
    handleLastNameChange(isFocus, event) {
        let lname = event.target.value;
        if (allLetter(lname)) {
            this.setState({ LastNameValue: lname, isLastNameValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("LastName", "FocusOut");
                if (!lname) { this.setState({ isLastNameValid: false }); }
                else { this.setState({ isLastNameValid: true }); this.InitialClick(); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Last Name", "FocusIn");
            }
        }
    }

    // handleEmailChange(isFocus, event) {
    //     let email = event.target.value;
    //     this.setState({ EmailValue: email, isEmailValid: true, showEmailError: true, emailFocus: isFocus, isError: false });
    //     if (!isFocus) {
    //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
    //         CallGAEvent("Email", "FocusOut");
    //         if (!email) { this.setState({ isEmailValid: false, showEmailError: true }); } else {
    //             if (emailRegex.test(email)) {
    //                 this.setState({ isEmailValid: true, showEmailError: true });
    //                 this.InitialClick();
    //             } else {
    //                 this.setState({ isEmailValid: true, showEmailError: false });
    //             }
    //         }
    //     } else {
    //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
    //         CallGAEvent("Email", "FocusIn");
    //     }
    // }
    handleStreedAddressChange(isFocus, event) {
          
        let streetAddress = event.target.value;
        this.setState({ EmployerAddress1: streetAddress, isEmployerAddress1Valid: true, isError: false, showAddressMessage: '', showEmployerAddress1Error: true });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            // CallGAEvent("StreedAddress","FocusOut");
            if (!streetAddress) { this.setState({ isEmployerAddress1Valid: false }); }
            else if (this.handlePOBoxAddress(streetAddress)) {
                this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showEmployerAddress1Error: false });
            } else { this.setState({ isEmployerAddress1Valid: true }); }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("Street Address", "FocusIn");
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
        this.setState({ EmployerAddress2Value: apptAddress });
        if (!isFocus) {
            CallGAEvent("Apartment", "FocusOut");
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("Apartment", "FocusIn");
        }
    }
    handleCityChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let city = event.target.value;
            this.setState({ EmployerAddress1CityValue: city, isEmployerAddress1CityValid: true, isError: false, IsContinue: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("City", "FocusOut");
                if (!city) { this.setState({ isEmployerAddress1CityValid: false }); }
                else {
                    //this.setState({isEmployerAddress1CityValid : true});
                    if (this.state.EmployerAddress1StateValue !== 'Select' && this.state.EmployerAddress1ZipcodeValue) {
                        //this.setState({ IsContinue : true});
                        this.ValidateCityStateZip(true);
                    } else {
                        this.setState({ isEmployerAddress1CityValid: true, IsContinue: false });
                    }
                }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("City", "FocusIn");
            }
        }
    }
    stateValidation() {
        if (this.state.EmployerAddress1StateValue) {
            if (this.state.stateCodeArray.indexOf(this.state.EmployerAddress1StateValue.toLowerCase()) > -1) {
                this.setState({ isEmployerAddress1StateValid: true });
                return true;
            }
            else {
                this.setState({ isEmployerAddress1StateValid: true, showEmployerAddress1CityError: false });
                return false;
            }
        }
    }
    cityValidation() {
        if (this.state.EmployerAddress1CityValue) {
            if (this.state.cityCodeArray.indexOf(this.state.EmployerAddress1CityValue.toLowerCase()) > -1) {
                this.setState({ isEmployerAddress1CityValid: true, showEmployerAddress1CityError: true });
                return true;
            }
            else {
                this.setState({ isEmployerAddress1CityValid: true, showEmployerAddress1CityError: false });
                return false;
            }
        }
    }
    zipcodeValidation() {
        if (this.state.EmployerAddress1ZipcodeValue) {
            if (this.state.zipCodeArray.indexOf(this.state.EmployerAddress1ZipcodeValue) > -1) {
                this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true, IsContinue: false });
                return true;
            }
            else {
                this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: false, IsContinue: false });
                return false;
            }
        }
    }
    handleZipcodeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let zipcode = GetZipcodeMask(event.target.value);
            this.setState({ EmployerAddress1ZipcodeValue: zipcode, isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true, isError: false, IsContinue: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Zipcode", "FocusOut");
                if (!zipcode) { this.setState({ isEmployerAddress1ZipcodeValid: false, showEmployerAddress1ZipcodeError: true }); } else {
                    if (zipcode.length < 5) {
                        this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: false });
                    } else {
                        if (this.state.EmployerAddress1StateValue !== 'Select' && this.state.EmployerAddress1CityValue) {
                            this.ValidateCityStateZip(true);
                        } else {
                            this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true, IsContinue: false });
                        }
                        //this.setState({isEmployerAddress1ZipcodeValid : true, showEmployerAddress1ZipcodeError: true});
                    }
                }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Zipcode", "FocusIn");
            }
        }
    }
    handleBirthdateChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let birthdate = event.target.value;
            this.setState({ BirthdateValue: birthdate, isBirthdateValid: true, showBirthdateError: true, isError: false, showDOBMessage: '' });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Birthdate", "FocusOut");
                if (!birthdate) { this.setState({ isBirthdateValid: false, showBirthdateError: true }); }
                else {
                    birthdate = birthdate.replace(/_/g, '');
                    if (birthdate.length < 10) {
                        this.setState({ isBirthdateValid: false, showBirthdateError: false, showDOBMessage: 'Please enter a valid date' });
                    }
                    else {
                        const message = checkValidDate(birthdate);
                        if (message === '') {
                            const futureDate = isFutureDate(birthdate);
                            if (futureDate) {
                                this.setState({ isBirthdateValid: true, showBirthdateError: false, showStartDateerrorMessage: 'Future date is not allowed' });
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
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Birthdate", "FocusIn");
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
                        this.setState({ isSalaryAmountValid: true, showAnnualIncomeError: true, PlainAnnualIncome: salaryAmount });
                    }
                } else {
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                    CallGAEvent("Salary Amount", "FocusIn");
                }
            } else { this.setState({ isSalaryAmountValid: true, showSalaryAmountError: true }); }
        }
    }
    //handleAccountNumberChange
    handleAccountNumberChange(isFocus, event) {
        let accountNumber = event.target.value;
        if (isValidInteger(accountNumber)) {
            this.setState({ AccountNumberValue: accountNumber, isAccountNumberValid: true, isError: false, showAccountNumberError: true });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Account Number", "FocusOut");
                if (!accountNumber) { this.setState({ isAccountNumberValid: false }); }
                else if (accountNumber.length !== 11) {
                    this.setState({ showAccountNumberError: false });
                }
                else { this.setState({ isAccountNumberValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Account Number", "FocusIn");
            }
        }
    }

    handleRoutingNumberChange(isFocus, event) {
        let routingNumber = event.target.value;
        if (isValidInteger(routingNumber)) {
            this.setState({ RoutingNumberValue: routingNumber, isRoutingNumberValid: true, isError: false, showRoutingNumberError: true });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Routing Number", "FocusOut");
                if (!routingNumber) { this.setState({ isRoutingNumberValid: false }); }
                else if (routingNumber.length !== 9) {
                    this.setState({ showRoutingNumberError: false });
                }
                else { this.setState({ isRoutingNumberValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Routing Number", "FocusIn");
            }
        }
    }
    handleAnnualIncomeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let annualIncome = unFormatAmount(event.target.value);
            annualIncome = annualIncome.replace(/^0+/, '');

            if (isValidInteger(annualIncome)) {
                this.setState({ AnnualIncomeValue: annualIncome, isAnnualIncomeValid: true, showAnnualIncomeMinError: true, annualIncomeFocus: this.props.currentDevice === 'Mobile' ? false : isFocus, isError: false, showAIMessage: '' });
                if (!isFocus) {
                    this.setState({ AnnualIncomeValue: annualIncome });
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`); 
                    CallGAEvent("AnnualIncome", "FocusOut");
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
                } else {
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                    CallGAEvent("Annual Income", "FocusIn");
                }
            } else { this.setState({ isAnnualIncomeValid: true, showAnnualIncomeMinError: true }); }
        }
    }

    handleHousingPaymentChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let housingPayment = unFormatAmount(event.target.value);
            //housingPayment = housingPayment.replace(/_/g, '');
            if (isValidInteger(housingPayment)) {
                this.setState({ HousingPaymentValue: housingPayment, PlainHousingPayment: housingPayment, isHousingPaymentValid: true, showHousingPaymentMinError: true, housingPaymentFocus: isFocus, isError: false });
                if (!isFocus && !this.state.housingPaymentDisabled) {
                    this.setState({ HousingPaymentValue: housingPayment });
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);    
                    CallGAEvent("HousingPayment", "FocusOut");
                    if (!housingPayment) { this.setState({ isHousingPaymentValid: false, showHousingPaymentMinError: true }); }
                } else {
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                    CallGAEvent("Housing Payment", "FocusIn");
                }
            } else { this.setState({ isHousingPaymentValid: true, showHousingPaymentMinError: true }); }
        }
    }
    handlePrimaryPhoneNumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let phoneNumber = event.target.value;
            let plainNumber = phoneNumber.replace(/\(/g, '').replace(/\)/g, '').replace(/_/g, '').replace(/-/g, '').replace(' ', '');
            this.setState({
                EmployerPhoneNumberValue: phoneNumber, isPrimaryPhoneNumberValid: true,
                showPrimaryPhoneNumberCodeError: true,
                showPrimaryPhoneNumberError: true, isError: false
            });
            // this.state.showPhoneNumberError = true;
            // this.state.isPhoneNumberValid = true;
            // this.state.showPhoneNumberCodeError = true;
            // this.state.isError = false;
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("PrimaryPhoneNumber", "FocusOut");
                if (!this.state.EmployerPhoneNumberValue) {
                    this.setState({ isPrimaryPhoneNumberValid: false, showPrimaryPhoneNumberError: true, IsContinue: true });
                    return false;
                }
                if (plainNumber.length === 10) {
                    if (this.state.IsContinue || this.state.PreviousPhone !== phoneNumber) {
                        this.PhoneValidation(phoneNumber);
                    }
                } else {
                    this.setState({
                        isPrimaryPhoneNumberValid: true,
                        showPrimaryPhoneNumberCodeError: true,
                        showPrimaryPhoneNumberError: false,
                        IsContinue: true
                    });
                }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Phone Number", "FocusIn");
            }
            if (plainNumber.length === 10 && (this.state.IsContinue || this.state.PreviousPhone !== phoneNumber)) {
                this.PhoneValidationAPI(phoneNumber);
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
        if (!phoneNumber) { this.setState({ isPrimaryPhoneNumberValid: false, showPrimaryPhoneNumberError: true, showPrimaryPhoneNumberCodeError: true }); }
        else {
            var isValidAreacode = IsValidAreaCode(phoneNumber);
            if (isValidAreacode) {
                var isValidPhone = IsPhoneNumberValid(phoneNumber);
                if (!isValidPhone) {
                    this.setState({
                        isPrimaryPhoneNumberValid: true,
                        showPrimaryPhoneNumberCodeError: true,
                        showPrimaryPhoneNumberError: false
                    });
                    isValid = false;
                }
                else {
                    this.setState({
                        isPrimaryPhoneNumberValid: true,
                        showPrimaryPhoneNumberCodeError: true,
                        showPrimaryPhoneNumberError: true
                    });
                }
            }
            else {
                this.setState({
                    isPrimaryPhoneNumberValid: true,
                    showPrimaryPhoneNumberCodeError: false,
                    showPrimaryPhoneNumberError: true
                });
                isValid = false;
            }
        }
        return isValid;
    }
    PhoneValidationAPI(phoneNumber) {
        let isValid = true;
        this.setState({ showPrimaryPhoneNumberError: true });
        var promise = this.getPhoneNumberValidate(phoneNumber);
        promise.then(response => {
            if (response.data !== undefined) {
                isValid = response.data.valid;
                if (!isValid) {
                    this.setState({
                        isPrimaryPhoneNumberValid: true,
                        showPrimaryPhoneNumberCodeError: true,
                        showPrimaryPhoneNumberError: false,
                        IsContinue: true
                    });
                    isValid = false;
                }
                else {
                    this.setState({
                        showPrimaryPhoneNumberError: true,
                        IsContinue: false
                    });
                }
            }
        });
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
                document.getElementById('frmPrequalify').ssn.type = "password";
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
                document.getElementById('frmPrequalify').ssn.type = "tel";
            }
        }
    }
    handleFocusIn(field, event) {
        CallGAEvent(field, "FocusIn");
    }
    handleLoanAmountChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            var loanAmount = unFormatAmount(event.target.value);
            if (isValidInteger(loanAmount)) {
                this.setState({ PlainLoanAmount: loanAmount, LoanAmountValue: loanAmount, isLoanAmountValid: true, showLoanAmountMinError: true, isError: false });
                if (!isFocus) {
                    this.setState({ LoanAmountValue: loanAmount });
                    CallGAEvent("LoanAmount", "FocusOut");
                    if (!loanAmount) { this.setState({ showLoanAmountMinError: false }); } else {
                        var maxLoanAmount = constantVariables.loanAmountMax;
                        var minLoanAmount = constantVariables.loanAmountMin;
                        if (this.state.EmployerAddress1StateValue === 'California' || this.state.EmployerAddress1StateValue === 'Texas') {
                            minLoanAmount = constantVariables.HWStateMin;
                        }
                        if (loanAmount < minLoanAmount || loanAmount > maxLoanAmount) {
                            this.setState({ isLoanAmountValid: true, showLoanAmountMinError: false });
                        } else {
                            this.setState({ isLoanAmountValid: true, showLoanAmountMinError: true, PlainLoanAmount: loanAmount });

                        }
                    }
                }
            } else {
                this.setState({ isLoanAmountValid: true, showLoanAmountMinError: true });
                CallGAEvent("Loan Amount", "FocusIn");
            }
        }
    }

    //Select State  Dropdown event
    showHideStateList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onStateClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isEmployerAddress1StateValid: true });
            //this.setState((prevState) => ({ displayStateItems: !prevState.displayStateItems }));
        }
    }
    handleStateChange(isFocus, event) {
        
        if (!this.state.initialDisabled) {
            const states = event.target.value;
            this.setState({ EmployerAddress1StateValue: states, isEmployerAddress1StateValid: true, isError: false, showLoanAmountMinError: true, IsContinue: false });
            if (!isFocus) {
                CallGAEvent("State", "FocusOut");
                if (states === 'Select') { this.setState({ isEmployerAddress1StateValid: false }); } else {
                    if (states === 'California' || states === 'Texas') {
                        if(this.state.PlainLoanAmount!=='' && window.PostDataEX){
                            this.state.PlainLoanAmount=window.postDataEx.applicationInfo.loanAmount;
                        }
                        if (this.state.PlainLoanAmount < constantVariables.HWStateMin) {
                            this.setState({ showStateLoanAmountModal: true, showLoanAmountMinError: false, showStateMinLoanAmount: true });
                        }
                    }
                    if (this.state.EmployerAddress1ZipcodeValue && this.state.EmployerAddress1CityValue) {
                        this.ValidateCityStateZip(true);
                    } else {
                        this.setState({ isEmployerAddress1StateValid: true });
                    }
                }
            } else {
                CallGAEvent("State", "FocusIn");
            }
        }
    }
    getStateLabel(key) {
        const EmployerAddress1StateValue = stateList.filter((states) => {
            return states.key === key;
        });
        return EmployerAddress1StateValue[0].label;
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
            const housing = event.target.id; //event.target.attributes['react-value'].value;
            this.setState({ selectedHousing: housing, isHousingValid: true, isError: false, isHousingPaymentValid: true });
            if (housing === 'RENT' || housing === 'OWN_WITH_MORTGAGE' || housing === 'Own – with mortgage') {
                this.setState({ housingPaymentDisabled: false });
            }
            else {
                this.setState({ housingPaymentDisabled: true, HousingPaymentValue: '', PlainHousingPayment: '0' });
            }
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Housing", "FocusOut");
                if (housing === 'Select') { this.setState({ isHousingValid: false }); } else { this.setState({ isHousingValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Housing", "FocusIn");
            }
            this.Continue.bind(this);
        }
    }
    getHousingLabel(key) {
        const selectedHousing = housingList.filter((housing) => {
            return housing.key === key || housing.label === key;
        });
        return selectedHousing[0].label;
    }
    getHousingKey(label) {
        const selectedHousing = housingList.filter((housing) => {
            return housing.label === label;
        });
        return selectedHousing[0].key;
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
            const employment = event.target.id; //event.target.attributes['react-value'].value;
            this.setState({ selectedEmployment: employment, isEmploymentValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Employment", "FocusOut");
                if (employment === 'Select') { this.setState({ isEmploymentValid: false }); } else { this.setState({ isEmploymentValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Employment", "FocusIn");
            }
            this.Continue.bind(this);
        }
    }
    getEmploymentLabel(key) {
        const selectedEmployment = employmentList.filter((employment) => {
            return employment.key === key;
        });
        return selectedEmployment.length > 0 ? selectedEmployment[0].label : '';
    }
    getEmploymentKey(label) {
        const selectedEmployment = employmentList.filter((employment) => {
            return employment.label === label || employment.key === label;
        });
        return selectedEmployment.length > 0 ? selectedEmployment[0].key : '';
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
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Citizenship", "FocusOut");
                if (citizenship === 'Select') { this.setState({ isCitizenshipStatusValid: false }); } else { this.setState({ isCitizenshipStatusValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Citizenship", "FocusIn");
            }
        }
    }
    getCitizenshipLabel(key) {
        const selectedCitizenship = citizenshipStatusList.filter((citizenship) => {
            return citizenship.key === key || citizenship.label === key;
        });
        return selectedCitizenship[0].label;
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
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("HighestEducation", "FocusOut");
                if (education === 'Select') { this.setState({ isHighestEducationValid: false }); } else { this.setState({ isHighestEducationValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("HighestEducation", "FocusIn");
            }
        }
    }
    getHighestEducationLabel(key) {
        const selectedHighestEducation = highestEducationList.filter((HighestEducation) => {
            return HighestEducation.key === key || HighestEducation.label === key;
        });
        return selectedHighestEducation.length > 0 ? selectedHighestEducation[0].label : '';
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
            const estimatedCreditScore = event.target.id; //event.target.attributes['react-value'].value;
            this.setState({ selectedEstimatedCreditScore: estimatedCreditScore, isEstimatedCreditScoreValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("EstimatedCreditScore", "FocusOut");
                if (estimatedCreditScore === 'Select') { this.setState({ isEstimatedCreditScoreValid: false }); } else { this.setState({ isEstimatedCreditScoreValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("EstimatedCreditScore", "FocusIn");
            }
            this.Continue.bind(this);
        }
    }
    getEstimatedCreditScoreLabel(key) {
        const selectedEstimatedCreditScore = estimatedCreditScoreList.filter((estimatedCreditScore) => {
            return estimatedCreditScore.key === key || estimatedCreditScore.label === key;
        });
        return selectedEstimatedCreditScore.length > 0 ? selectedEstimatedCreditScore[0].label : '';
    }
    getEstimatedCreditScoreKey(label) {
        const selectedEstimatedCreditScore = estimatedCreditScoreList.filter((estimatedCreditScore) => {
            return estimatedCreditScore.label === label || estimatedCreditScore.key === label;
        });
        return selectedEstimatedCreditScore.length > 0 ? selectedEstimatedCreditScore[0].key : '';
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
            const timeAtCurrentAddress = event.target.id; //event.target.attributes['react-value'].value;
            this.setState({ selectedTimeAtCurrentAddress: timeAtCurrentAddress, isTimeAtCurrentAddressValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("TimeAtCurrentAddress", "FocusOut");
                if (timeAtCurrentAddress === 'Select') { this.setState({ isTimeAtCurrentAddressValid: false }); } else { this.setState({ isTimeAtCurrentAddressValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("TimeAtCurrentAddress", "FocusIn");
            }
            this.Continue.bind(this);
        }
    }
    getTimeAtCurrentAddressLabel(key) {
        const selectedTimeAtCurrentAddress = timeAtCurrentAddressList.filter((TimeAtCurrentAddress) => {
            return TimeAtCurrentAddress.key === key || TimeAtCurrentAddress.label === key;
        });
        return selectedTimeAtCurrentAddress.length > 0 ? selectedTimeAtCurrentAddress[0].label : '';
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
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("PrimaryProject", "FocusOut");
                if (primaryProjectPurpose === 'Select') { this.setState({ isPrimaryProjectPurposeValid: false }); } else { this.setState({ isPrimaryProjectPurposeValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("PrimaryProject", "FocusIn");
            }
        }
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
            if (this.state.selectedLoanPurpose === 'Business Funding') {
                this.setState({ showFundingModal: true });
            }
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("LoanPurpose", "FocusOut");
                if (loanPurpose === 'Select') { this.setState({ isLoanPurposeValid: false }); } else { this.setState({ isLoanPurposeValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("LoanPurpose", "FocusIn");
            }
        }
    }

    getLoanPurposeLabel(key) {
        const selectedLoanPurpose = loanPurposeList1.filter((loanPurpose) => {
            return loanPurpose.key === key || loanPurpose.label === key;
        });
        return selectedLoanPurpose.length > 0 ? selectedLoanPurpose[0].label : '';
    }

    handleHomePhoneChange(isFocus, event) {
        let homePhone = event.target.value;
        if (allLetter(homePhone)) {
            this.setState({ HomePhoneValue: homePhone, isHomePhoneValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("HomePhone", "FocusOut");
                if (!homePhone) { this.setState({ isHomePhoneValid: false }); }
                else { this.setState({ isHomePhoneValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Home Phone", "FocusIn");
            }
        }
    }

    handleEmploymentStatusChange(isFocus, event) {
        let employmentStatus = event.target.value;
        if (allLetter(employmentStatus)) {
            this.setState({ EmploymentStatusValue: employmentStatus, isEmploymentStatusValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Employment Status", "FocusOut");
                if (!employmentStatus) { this.setState({ isEmploymentStatusValid: false }); }
                else { this.setState({ isEmploymentStatusValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Employment Status", "FocusIn");
            }
        }
    }

    handleEmployerNameChange(isFocus, event) {
        let employerName = event.target.value;
       // if (allLetter(employerName)) {
            this.setState({ EmployerNameValue: employerName, isEmployerNameValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Employer Name", "FocusOut");
                if (!employerName) { this.setState({ isEmployerNameValid: false }); }
                else { this.setState({ isEmployerNameValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Employer Name", "FocusIn");
            }
       // }
    }

    handlePositionChange(isFocus, event) {
        let position = event.target.value;
       // if (allLetter(position)) {
            this.setState({ PositionValue: position, isPositionValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("position", "FocusOut");
                if (!position) { this.setState({ isPositionValid: false }); }
                else { this.setState({ isPositionValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("position", "FocusIn");
            }
       // }
    }
    handleStartDateChange(isFocus, event) {
        
        let startDate = event.target.value;
        this.setState({ StartDateValue: startDate, isStartDateValid: true, showStartDateError: true, isError: false, showStartDateerrorMessage: '' });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("StartDate", "FocusOut");
            if (!startDate) { this.setState({ isStartDateValid: false, showStartDateError: true }); }
            else {
                startDate = startDate.replace(/_/g, '');
                if (startDate.length < 10) {
                    this.setState({ isStartDateValid: true, showStartDateError: false, showStartDateerrorMessage: 'Please enter a valid date' });
                }  
                else {
                    const message = checkValidDate(startDate);
                    if (message === '') {
                        const futureDate = isFutureDate(startDate);
                        if (futureDate) {
                            this.setState({ isStartDateValid: true, showStartDateError: false, showStartDateerrorMessage: 'Future date is not allowed' });
                        } else {
                            let minimumyears = calculateAge(new Date(this.props.PostDataEX.borrowers[0].dateOfBirth), new Date(startDate));
                                if(minimumyears < 10) {
                                    this.setState({  isStartDateValid: true, showStartDateError: false, showStartDateerrorMessage: 'Start Date seems wrong according to your Birthdate'})           
                                }
                                
                             if (this.state.EndDateValue.length > 0) {
                                 var difference = compareTwoDates(startDate, this.state.EndDateValue);
                                  if(difference < 0) {
                                    this.setState({ showEndDateError : false });
                                }
                                 this.setState({ isStartDateValid: true, showStartDateError: true });
                             }
                        }
                    }
                    else { this.setState({ isStartDateValid: true, showStartDateError: false, showStartDateerrorMessage: `Please provide valid ${message}` }); }
                }
            }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("StartDate", "FocusIn");
        }
    }
    handleEndDateChange(isFocus, event) {
        let endDate = event.target.value;
        //if(allLetter(endDate)) {
        this.setState({ EndDateValue: endDate, isEndDateValid: true, isError: false, showEndDateError : true, showStartDateerrorMessage:'' });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("End Date", "FocusOut");
            if (!endDate) { this.setState({ isEndDateValid: false }); }
            else {
                 if (this.state.StartDateValue.length > 0) {
                     var difference = compareTwoDates(this.state.StartDateValue, endDate);
                      if(difference < 0) {
                          this.setState({ showEndDateError: false, showStartDateerrorMessage : 'Start Date can not be greater.' });
                      }
                }
                this.setState({ isEndDateValid: true });
            }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("End Date", "FocusIn");
        }
        //}
    }

    handleEndDateCheckBoxEvent(isFocus, event) {

        let endDateDisabled = event.target.checked;
        this.setState({ EndDateCheckBoxChecked: event.target.checked, EndDateValue : endDateDisabled ? '' : this.state.EndDateValue, EndDateDisabled: endDateDisabled, isEndDateValid: true, isError: false });
        if(endDateDisabled) {
            this.setState({
                isEndDateValid: true,
                showEndDateError: true,
                showEndDateMessage: '',
                showErrorMessage:''
            // showEndDateError: false
            });
        }
        // if(allLetter(endDate)) {
        //     this.setState({ EndDateValue: endDate, isEndDateValid : true, isError: false });
        //     if(!isFocus) {  
        //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
        //         CallGAEvent("End Date","FocusOut");
        //         if(!endDate) {  this.setState({isEndDateValid : false}); } 
        //         else {  this.setState({isEndDateValid : true});   }
        //     }else {
        //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
        //         CallGAEvent("End Date","FocusIn");
        //     }
        // }
    }

    handleCurrentPositionChange(isFocus, event) {
        // let currentPosition = event.target.value;
        // if(allLetter(currentPosition)) {
        //     this.setState({ CurrentPositionValue: currentPosition, isCurrentPositionValid : true, isError: false });
        //     if(!isFocus) {  
        //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
        //         CallGAEvent("Current Position","FocusOut");
        //         if(!currentPosition) {  this.setState({isCurrentPositionValid : false}); } 
        //         else {  this.setState({isCurrentPositionValid : true});   }
        //     }else {
        //         //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
        //         CallGAEvent("Current Position","FocusIn");
        //     }
        // }
    }
    handleEmployerPhonenumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let employerPhoneNumber = event.target.value;
            let plainNumber = employerPhoneNumber.replace(/\(/g, '').replace(/\)/g, '').replace(/_/g, '').replace(/-/g, '').replace(' ', '');
            this.setState({
                EmployerPhoneNumberValue: employerPhoneNumber, isEmployerPhoneNumbervalid: true,
                showEmployerPhoneNumberCodeError: true,
                showEmployerphonenumberError: true, isError: false
            });
            // this.state.showPhoneNumberError = true;
            // this.state.isPhoneNumberValid = true;
            // this.state.showPhoneNumberCodeError = true;
            // this.state.isError = false;
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Work Phone number", "FocusOut");
                if (!this.state.EmployerPhoneNumberValue) {
                    this.setState({ isEmployerPhoneNumbervalid: false, showEmployerphonenumberError: true, IsContinue: true });
                    return false;
                }
                if (plainNumber.length === 10) {
                    if (this.state.IsContinue || this.state.PreviousPhone !== employerPhoneNumber) {
                        this.EmployerPhoneValidation(employerPhoneNumber);
                    }
                } else {
                    this.setState({
                        isEmployerPhoneNumbervalid: true,
                        showEmployerPhoneNumberCodeError: true,
                        showEmployerphonenumberError: false,
                        IsContinue: true
                    });
                }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Work Phone number", "FocusIn");
            }
            if (plainNumber.length === 10 && (this.state.IsContinue || this.state.PreviousPhone !== employerPhoneNumber)) {
                this.employerPhoneValidationAPI(employerPhoneNumber);
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
        return isValid;
    }
    employerPhoneValidationAPI(employerPhoneNumber) {
        let isValid = true;
        this.setState({ showEmployerphonenumberError: true });
        var promise = this.getPhoneNumberValidate(employerPhoneNumber);
        promise.then(response => {
            if (response.data !== undefined) {
                isValid = response.data.valid;
                if (!isValid) {
                    this.setState({
                        isEmployerPhoneNumbervalid: true,
                        showEmployerPhoneNumberCodeError: true,
                        showEmployerphonenumberError: false,
                        IsContinue: true
                    });
                    isValid = false;
                }
                else {
                    this.setState({
                        showEmployerphonenumberError: true,
                        IsContinue: false
                    });
                }
            }
        });
        return isValid;
    }

    // handleWorkPhonenumberChange(isFocus, event) {
    //     let employerPhoneNumber = event.target.value;
    //    // if (allLetter(employerPhoneNumber)) {
    //         this.setState({ EmployerPhoneNumberValue: employerPhoneNumber, isEmployerPhoneNumbervalid: true, isError: false });
    //         if (!isFocus) {
    //             //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
    //             CallGAEvent("Work Phone number", "FocusOut");
    //             if (!employerPhoneNumber) { this.setState({ isEmployerPhoneNumbervalid: false }); }
    //             else { this.setState({ isEmployerPhoneNumbervalid: true }); }
    //         } else {
    //             //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
    //             CallGAEvent("Work Phone number", "FocusIn");
    //         }
    //     //}
    // }
    handleEmployerAddress1Change(isFocus, event) {
      // debugger;
        let employerAddress1 = event.target.value;
        //console.log(employerAddress1);
        ///if (allLetter(employerAddress1)) {
            this.setState({ EmployerAddress1Value: employerAddress1, isEmployerAddress1Valid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Work Address", "FocusOut");
                if (!employerAddress1) { this.setState({ isEmployerAddress1Valid: false }); }
                else { this.setState({ isEmployerAddress1Valid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Work Address", "FocusIn");
            }
        //}
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
            this.setState({ EmployerAddress1CityValue: employerCity, isEmployerAddress1CityValid: true, isError: false, IsContinue: false  });
            if (!isFocus) {
																																					  
                  CallGAEvent("Work Address City", "FocusOut");
                if (!employerCity) { this.setState({ isEmployerAddress1CityValid: false,showEmployerAddress1CityError:true }); }
                else{
                    if(this.state.EmployerAddress1StateValue !== 'Select' && this.state.EmployerAddress1ZipcodeValue && this.state.EmployercityChnagedvalue !== employerCity){
                       
                        this.ValidateEmployerCityStateZip(true);
                        this.setState({EmployercityChnagedvalue: employerCity});
                    }else{
                        this.setState({isEmployerAddress1CityValid: true,IsContinue : false});            
                    }
                }                  
            }else{CallGAEvent("Work Address City", "FocusIn");}                             
        }
	   
    }

    handleEmployerAddress1ZipcodeChange(isFocus, event) {
        
            let employerZipCode = GetZipcodeMask(event.target.value);
            this.setState({ EmployerAddress1ZipcodeValue: employerZipCode, isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true, isError: false });
																															 
            if (!isFocus) {
                console.log('focusout');
                CallGAEvent("employerzipcode", "FocusOut");
                if (!employerZipCode) { this.setState({ isEmployerAddress1ZipcodeValid: false, showEmployerAddress1ZipcodeError: true }); } else {
                    if (employerZipCode.length < 5) {
                        this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: false });
                    } else {
                        if (this.state.EmployerAddress1StateValue !== 'Select' && this.state.EmployerAddress1CityValue && this.state.EmployerZipcodeChangedValue !== employerZipCode) {
                            this.setState({ EmployerZipcodeChangedValue: employerZipCode ,IsContinue: true }); 
                            setTimeout(() => {
                             
                                this.ValidateEmployerCityStateZip(true);

                            }, 500);
                            //this.event.preventDefault();
                            console.log(' change');
                            // this.setState({ EmployerZipcodeChangedValue: employerZipCode });
                        } else {
                            console.log('not change');
                            this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true, IsContinue: false });
                        }
                        //this.setState({isZipcodeValid : true, showZipcodeError: true});
                    }
                }
                console.log(event);
                event.preventDefault();

            } else {
                CallGAEvent("employerzipcode", "FocusIn");
            }
        
    }
    handleEmployerAddress1StateChange(isFocus, event) {
        
        if (!this.state.initialDisabled) {
            const employerState = event.target.value; //event.target.attributes['react-value'].value;
            //const oldState = this.state.selectedState;
            this.setState({ EmployerAddress1StateValue: employerState, isEmployerAddress1StateValid: true, isError: false, showLoanAmountMinError: true,IsContinue: false });																																															   
            if (!isFocus) {
																																					  
                CallGAEvent("employerstate", "FocusOut");
                if (employerState === 'Select') { this.setState({ isEmployerAddress1StateValid: false }); } else {
                    if (this.state.EmployerAddress1ZipcodeValue && this.state.EmployerAddress1CityValue && this.state.EmployerselectedStateChanged !== employerState) {
                        this.ValidateEmployerCityStateZip(true);
                        this.setState({ isEmployerAddress1StateValid: true, EmployerselectedStateChanged: employerState });
                    } else {
                        this.setState({ isEmployerAddress1StateValid: true });
                    }
                }
            }
            else{
                CallGAEvent("employerstate", "FocusIn");
            }
        }
    }
    
    // showHideStateList(isDisplay) {
    //     return isDisplay ? displayBlock : displayNone;
    // }
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
                this.setState({ isEmployerAddress1ZipcodeValid: true, showEmployerAddress1ZipcodeError: true});
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
        return axios.get(`${apiEndpoint}${encodeURIComponent(this.state.EmployerAddress1Value)},${encodeURIComponent(this.state.EmployerAddress1CityValue)},${encodeURIComponent(this.state.EmployerAddress1StateValue)}&key=${this.props.ThemeConfig.googleAPIKey}`);
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
                                postalCodes.push(address.short_name);
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
        if (this.state.showEmployerAddress1ZipcodeError && this.state.showEmployerAddress1CityError ) {
            this.setState({ IsContinue: false });
        }
        if (!this.state.showEmployerAddress1ZipcodeError || !this.state.showEmployerAddress1CityError) {
            this.setState({ IsContinue: true});
        }

    };
  


    // handleEmployerAddress1CityChange(isFocus, event) {
    //     let employerCity = event.target.value;
    //   //  if (allLetter(employerCity)) {
    //         this.setState({ EmployerAddress1CityValue: employerCity, isEmployerAddress1CityValid: true, isError: false });
    //         if (!isFocus) {
    //             //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
    //             CallGAEvent("Work Address City", "FocusOut");
    //             if (!employerCity) { this.setState({ isEmployerAddress1CityValid: false }); }
    //             else { this.setState({ isEmployerAddress1CityValid: true }); }
    //         } else {
    //             //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
    //             CallGAEvent("Work Address City", "FocusIn");
    //         }
    //   //  }
    // }

    // handleEmployerAddress1StateChange(isFocus, event) {
    //     debugger;
    //     if (!this.state.initialDisabled) {
    //     let employerState = event.target.value;
    //   //  if (allLetter(employerState)) {
    //         this.setState({ EmployerAddress1StateValue: employerState, isEmployerAddress1StateValid: true, isError: false });
    //         if (!isFocus) {
    //             //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
    //             CallGAEvent("Work Address State", "FocusOut");
    //             if (employerState === 'Select') { this.setState({ isEmployerAddress1StateValid: false }); }
    //             else {
    //                 if(this.state.EmployerAddress1ZipcodeValue && this.state.EmployerAddress1CityValue && this.state.employeraddress1statechange !== employerState){
    //                     this.ValidateCityStateZip(true);
    //                     this.setState({isEmployerAddress1StateValid: true, employeraddress1statechange: employerState});
    //                 } 
    //             else { this.setState({ isEmployerAddress1StateValid: true }); }

    //         //  else {
    //         //     //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
    //         //     CallGAEvent("Work Address State", "FocusIn");
    //         // }
    //     }
    // }
    // }
    // }
    // // handleStateChange(isFocus, event) {
    // //     if (!this.state.initialDisabled) {
    // //         const states = event.target.value; //event.target.attributes['react-value'].value;
    // //         //const oldState = this.state.selectedState;
    // //         this.setState({ selectedState: states, isStateValid: true, isError: false, showLoanAmountMinError: true });

    // //         if (!isFocus) {
    // //             if (states === 'Select') { this.setState({ isStateValid: false }); } else {
    // //                 if (this.state.ZipcodeValue && this.state.CityValue && this.state.selectedStateChanged !== states) {
    // //                     this.ValidateCityStateZip(true);
    // //                     this.setState({ isStateValid: true, selectedStateChanged: states });
    // //                 } else {
    // //                     this.setState({ isStateValid: true });
    // //                 }
    // //             }
    // //         }
    // //     }
    // // }
    // getStateLabel(key) {
    //     const selectedState = stateList.filter((states) => {
    //         return states.key === key;
    //     });
    //     return selectedState[0] ? selectedState[0].label : null;
    // }

    // handleEmployerAddress1ZipcodeChange(isFocus, event) {
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
    //    // }
    // }

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
    getLenderLogoURLFromConfig() {
        if (this.props.PartnerId && this.props.Featured === "1") {
            const matchedLenderInfo = this.props.configSettings.lenderInfo.filter(lenderInfo => {
                return this.props.PartnerId === lenderInfo.partnerId;
            });
            if (matchedLenderInfo !== null && matchedLenderInfo.length > 0) {
                this.setState({ showLenderImage: matchedLenderInfo[0].lenderLogo });
            }
        } else if (this.props.affiliateid !== null && this.props.affiliateid !== undefined) {
            const matchedLenderInfo = this.props.configSettings.lenderInfo.filter(lenderInfo => {
                return this.props.affiliateid === lenderInfo.lender;
            });
            if (matchedLenderInfo !== null && matchedLenderInfo.length > 0) {
                this.setState({ showLenderImage: matchedLenderInfo[0].lenderLogo });
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
    getPhoneNumberValidate(employerPhoneNumber) {
        var apiEndpoint = `https://apilayer.net/api/validate?access_key=${this.props.ThemeConfig.phoneNumberAPIKey}&number=1${unMaskPhone(employerPhoneNumber)}`;
        return axios.get(`${apiEndpoint}`);
    }
    getZipCodeByCityState() {
        var apiEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
        return axios.get(`${apiEndpoint}${encodeURIComponent(this.state.EmployerAddress1Value)},${encodeURIComponent(this.state.EmployerAddress1CityValue)},${encodeURIComponent(this.state.EmployerAddress1StateValue)}&key=${this.props.ThemeConfig.googleAPIKey}`);
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
                this.stateValidation();
            }
        });

        this.setState({ zipCodeArray: postalCodes, cityCodeArray: cityCodes, stateCodeArray: stateCodes });
        if (!this.state.showEmployerAddress1ZipcodeError || !this.state.showEmployerAddress1CityError) {
            this.setState({ IsContinue: false });
        }
        if (this.state.showEmployerAddress1ZipcodeError && this.state.showEmployerAddress1CityError) {
            this.setState({ IsContinue: false });
        }
    };
    SaveEmploymentHistory() {
        var empHistory = `{'employerName' :'${this.state.EmployerNameValue}','position': '${this.state.PositionValue}','startDate': '${this.state.StartDateValue}','endDate': '${this.state.EndDateValue}','salaryAmount': '${this.state.SalaryAmountValue}','salaryPeriod': '${this.state.SalaryPeriodValue}','employerAddress1': '${this.state.EmployerAddress1Value}','employerAddress2': '${this.state.EmployerAddress2Value}','employerCity': '${this.state.EmployerAddress1CityValue}','employerState': '${this.state.EmployerAddress1StateValue}','employerZipCode': '${this.state.EmployerAddress1ZipcodeValue}','employerPhoneNumber': '${this.state.EmployerPhoneNumberValue}'}`;
        // return empHistory;
        this.state.EmploymentHistory.push(empHistory);
        this.setState({
            EmployerNameValue: '', PositionValue: '', StartDateValue: '',
            EndDateValue: '', SalaryAmountValue: '', SalaryPeriodValue: '', EmployerAddress1: '',EmployerAddress2: '',
            EmployerAddress1CityValue: '', EmployerAddress1StateValue: '', EmployerAddress1ZipcodeValue: '',
            EmployerPhoneNumberValue: ''
        });

    }

    GetCurrentPage(pages) {
        let that = this;

        let currentPage = pages.filter(element => {
            if (element && element.props.formFields && element.props.formFields.pageNumber !== undefined) {
                return element.props.formFields.pageNumber === that.state.currentPage;
            }
            return currentPage;
        });
        that.state.currentPageName = currentPage.name;
        return currentPage;
    }
    GetFilteredData(quesData, currentPageState) {
        const filteredQuestions = quesData.filter(question => {
            if (question) {
                return question.pageNumber === currentPageState;
            }
            return filteredQuestions ? filteredQuestions[0] : null;
        });
        return filteredQuestions ? filteredQuestions[0] : null;
    }
    GetProgressbarElements() {
        var strHtml = '';

        if (this.state.TotalPages > 0) {
            var liwidth = 100 / this.state.TotalPages;
            for (var i = 0; i < this.state.TotalPages; i++) {
                var cssclass = this.state.currentPage >= i + 1 ? 'done-progress' : '';
                strHtml += `<li style='width:${liwidth}% !important' class='${cssclass}'></li>`;//'<li className={`${cssclass} `}></li>'
            }
        }
        //strHtml += '</ul>';
        return strHtml;
    }
   
    GetEmploymentInfo(e) { 
        // let employerInfo = `{'employerName' :'${this.state.EmployerNameValue}',
        // 'position': '${this.state.PositionValue}','startDate': '${this.state.StartDateValue}',
        // 'endDate': '${this.state.EndDateValue}','salaryAmount': '${this.state.SalaryAmountValue}',
        // 'salaryPeriod': '${this.state.SalaryPeriodValue}','employerAddress1': '${this.state.EmployerAddress1Value}',
        // 'employerAddress2': '${this.state.EmployerAddress2Value}','employerCity': '${this.state.EmployerAddress1CityValue}',
        // 'employerState': '${this.state.EmployerAddress1StateValue}}','employerZipCode': '${this.state.EmployerAddress1ZipcodeValue}',
        //                    'employerPhoneNumber': '${this.state.EmployerPhoneNumberValue}'
        //                     }`;
        //           console.log(employerInfo);             
        let fullEmpInfo =this.props.PostDataEX;
        // let empInfo = `{
        //     "employerName" : "Sigma",
        //     "Position" : "SE",
        //     "startDate" : "01/24/2010",
        //     "currentPosition" : "",
        //     "endDate" : "01/01/2011",
        //     "employerAddress1" : "Perry Street",
        //     "employerAddress2" : "",
        //     "employerCity" : "Roseville",
        //     "employerState" : "Michigan",
        //     "employerZipCode" : "48066",
        //     "employerPhoneNumber" : "7023585490"          
        //      }`;
        if(fullEmpInfo.borrowers[0].employmentInformation) {
            fullEmpInfo.borrowers[0].employmentInformation.employerName =this.state.EmployerNameValue;
            fullEmpInfo.borrowers[0].employmentInformation.position =this.state.PositionValue;
            fullEmpInfo.borrowers[0].employmentInformation.startDate =this.state.StartDateValue;
            fullEmpInfo.borrowers[0].employmentInformation.endDate =this.state.EndDateValue;
            fullEmpInfo.borrowers[0].employmentInformation.salaryAmount =this.state.SalaryAmountValue;
            fullEmpInfo.borrowers[0].employmentInformation.salaryPeriod =this.state.SalaryPeriodValue;
            fullEmpInfo.borrowers[0].employmentInformation.employerAddress1 =this.state.EmployerAddress1Value;
            fullEmpInfo.borrowers[0].employmentInformation.employerAddress2 =this.state.EmployerAddress2Value;
            fullEmpInfo.borrowers[0].employmentInformation.employerCity =this.state.EmployerAddress1CityValue;
            fullEmpInfo.borrowers[0].employmentInformation.employerState =this.state.EmployerAddress1StateValue;
            fullEmpInfo.borrowers[0].employmentInformation.employerZipCode =this.state.EmployerAddress1ZipcodeValue;
            fullEmpInfo.borrowers[0].employmentInformation.employerPhoneNumber =this.state.EmployerPhoneNumberValue;
        }
         //fullEmpInfo.borrowers[0].employmentInformation.push(employerInfo);
         return fullEmpInfo;
    }
    render() {
        const uuid = typeof window.uuid === typeof undefined ? '' : window.uuid;
        let version = this.GetVersion(this.props.versionConfigSettings.versions);
        let pages = this.GetPagesByVersion(version);
        let currentPages = this.GetCurrentPage(pages);
        let filteredPage = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
        let progressbar = this.GetProgressbarElements();
        return (
            <div className="container" >
                {/* <!--Header section --> */}
                {/* {!this.state.showModal ?                */}
                <section id="headersection" className="">
                    <div className="row">
                        <div className={`${" col-md-2 "}`}>
                        </div>
                        <div className={`center-block ${" col-md-12 "} `}>
                            <div className="box-panel" id="mainbox">
                                <div className="container-box-content" id="mainboxcontent">
                                    <div className="row">

                                        <div className={` custom-pdding ${" col-md-6 col-xs-12 "}`}>

                                            <ul className="progreesBreadcrumb-bar" dangerouslySetInnerHTML={{ __html: `${progressbar}` }}></ul>

                                            <span className={` progreesBreadcrumb-bar-text second-phase-done ${this.props.currentDevice === 'Mobile' ? this.state.currentPage === 3 || this.state.currentPage === 10 ? 'heading-top' : '' : ''}`} >Progress</span>
                                        </div>
                                    </div>
                                    {filteredPage.name !== 'summarypage' ?
                                            <div className="row col-sm-12">
                                                {this.state.IsSummaryPage && !this.state.IsSummaryPageEdit}
                                                <span>
                                                    <h2 className="employmentheading">Please enter your most current employment information</h2>
                                                </span>
                                                <div>
                                                </div>
                                            </div>
                                            : ''
                                        }
                                    <form action={`${constantVariables.summaryPagePostURL}`} name="createacc2" id="frmPrequalify" disable-btn="" className="app-form" method="POST" onSubmit={this.Continue.bind(this)}>
                                        <input type="hidden" name="uuid" value={uuid} />
                                        <input type="hidden" name="MatchKey" value={uuid} />
                                        <input type="hidden" name="action" value={`${'breadcrumb'} app submit`} />
                                        <input type="hidden" name="gclid" value={this.props.GCLId ? this.props.GCLId : ''} />
                                        <input type="hidden" name="partnerid" value={this.props.PartnerId ? this.props.PartnerId : ''} />
                                        <input type="hidden" name="featured" value={this.props.Featured ? this.props.Featured : ''} />

                                        <input type="hidden" name="os" value={this.props.currentOS ? this.props.currentOS : ''} />
                                        <input type="hidden" name="browser" value={this.props.currentBrowser ? this.props.currentBrowser : ''} />
                                        <input type="hidden" name="devicetype" value={this.props.currentDevice ? this.props.currentDevice : ''} />
                                        <input type="hidden" name="affiliateid" value={this.props.affiliateid ? this.props.affiliateid : ''} />
                                        <input type="hidden" name="programid" value={this.props.programid ? this.props.programid : ''} />
                                        <input type="hidden" name="campaignid" value={this.props.campaignid ? this.props.campaignid : ''} />

                                        <input type="hidden" name="utm_source" value={this.props.utmSource ? this.props.utmSource : ''} />
                                        <input type="hidden" name="utm_medium" value={this.props.utmMedium ? this.props.utmMedium : ''} />
                                        <input type="hidden" name="utm_term" value={this.props.utmTerm ? this.props.utmTerm : ''} />
                                        <input type="hidden" name="utm_campaign" value={this.props.utmCampaign ? this.props.utmCampaign : ''} />
                                        <input type="hidden" name="utm_content" value={this.props.utmContent ? this.props.utmContent : ''} />
                                        <input type="hidden" name="hsessionid" value={window.hSessionID ? window.hSessionID : ''} />
                                        <input type="hidden" name="TransactionType" value="LOSFullApplication" /> 
                                        {/* <input type="hidden" name="logo_type" value="LA" />
                                    <input type="hidden" name="TransactionType" value="Application" />                                             */}
                                        {/* <input type="hidden" name="loanPurpose" value={this.state.selectedLoanPurpose} /> */}
                                        <input type="hidden" name="employerName" value={this.state.EmployerNameValue} />
                                        <input type="hidden" name="position" value={this.state.PositionValue} /> 
                                        <input type="hidden" name="employerPhoneNumber" value={unMaskPhone(this.state.EmployerPhoneNumberValue)} />
                                        {/* <input type="hidden" name="secondaryphonenumber" value={unMaskPhone(this.state.SecondaryPhoneNumberValue)} /> */}
                                        <input type="hidden" name="employerAddress1" value={this.state.EmployerAddress1Value} />
                                        <input type="hidden" name="employerAddress2" value={this.state.EmployerAddress2Value} />
                                        <input type="hidden" name="employerCity" value={this.state.EmployerAddress1CityValue} />
                                        <input type="hidden" name="employerState" value={this.state.EmployerAddress1StateValue} />
                                        <input type="hidden" name="employerZipCode" value={this.state.EmployerAddress1ZipcodeValue} />
                                        {/* <input type="hidden" name="housing" value={this.state.selectedHousing} />
                                        <input type="hidden" name="housingPayment" value={this.state.PlainHousingPayment} />
                                        <input type="hidden" name="currenttime" value={this.state.selectedTimeAtCurrentAddress} />
                                        <input type="hidden" name="creditscore" value={this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)} />
                                        <input type="hidden" name="birthdate" value={this.state.BirthdateValue} /> */}
                                        {/* <input type="hidden" name="ssn" value={this.state.ProvideSSNValue} /> */}
                                        {/* <input type="hidden" name="employment" value={this.getEmploymentKey(this.state.selectedEmployment)} />
                                        <input type="hidden" name="annualincome" value={this.state.PlainAnnualIncome} /> */}
                                        <input type="hidden" name="pr_clid" value={this.state.mpUniqueClickID} />
                                        {/* <input type="hidden" name="loanAmount" value={this.state.PlainLoanAmount} /> */}
                                        <input type="hidden" name="ipAddress" value={this.state.IPAddress} />
                                        {/* <input type="hidden" name="homePhone" value={this.state.HomePhoneValue} /> */}
                                        <input type="hidden" name="employmentInformation" value={this.state.CompleteInfo} />


                                        <div id="breadcrumb-preloader-preloader">
                                            <div id="preloader" className={` box_item ${(filteredPage.name === 'employerName' || filteredPage.name === 'position' || filteredPage.name === 'employerAddress1' || filteredPage.name === 'salaryAmount' || filteredPage.name === 'employerPhoneNumber' || filteredPage.name === 'summarypage') && this.props.currentDevice !== 'Mobile' ? ' address ' : ''}`}>
                                                <div className="">
                                                    <div className="row">
                                                    
                                                        {(filteredPage.name === 'employerAddress1' || filteredPage.name === 'summarypage') ? <div className={" col-sm-12 "}>
                                                            <h2 className="fieldname heading">{filteredPage.title}</h2>
                                                        </div> : ""}
                                                        {filteredPage.name === 'legalname' ?
                                                            <div className=" col-sm-12 col-xs-12 "><h2 className="fieldname heading">Your Name </h2></div>
                                                            : ""}

                                                        {currentPages}
                                                    </div>

                                                    {filteredPage.type === 'button' || this.state.currentPage === this.state.TotalPages ? '' :
                                                        this.props.currentDevice !== 'Mobile' &&
                                                        <div className="row">
                                                            <div className={` ${" col-sm-12 col-xs-12"} button-control-align  ${filteredPage.name === 'employerName' || filteredPage.name === 'employerAddress1' || filteredPage.name === 'employerPhoneNumber'? ' center-align ' : ''}`}>
                                                                <button type="submit" id="viewpreqoffers" tabIndex={this.state.currentPage + 1} name="viewpreqoffers" className=" btn bc-primary " disabled={`${!this.state.IsContinue ? '' : 'disabled'}`} >{this.state.buttonText}</button>
                                                            </div></div>
                                                    }
                                                    {this.state.showModal && this.state.currentPage === this.state.TotalPages &&
                                                        <div id="" className={`modal ${this.state.showModal ? 'displayblock' : ''}`}>
                                                            <div className="modal-content">
                                                                <div className={`wrapper loans ${this.props.IsZalea ? ' zaleaPopup ' : ''}`}>
                                                                    <div className="trans-logo">
                                                                        <img src={this.props.ThemeConfig.logo} alt="" />
                                                                    </div>
                                                                    <div className="trans-statment">
                                                                        {<img src={this.props.ThemeConfig.logo} alt="" />}
                                                                        {this.props.currentDevice === 'Mobile' ?
                                                                            <h4>Checking our partner network for loan offers…</h4>
                                                                            :
                                                                            <h1>Checking our partner network for loan offers…</h1>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        <div className={`${this.props.currentBrowser === 'safari' ? 'load-img-mobile-safari' : 'load-img'}`}>
                                                                            <i className={`fa fa-refresh fa-spin ${this.props.currentBrowser === 'safari' ? ' safari ' : ''}`}></i>

                                                                        </div>
                                                                    }
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
                                                                    <button value="Close" className="btn bc-primary" onClick={this.closePopup.bind(this)} > CLOSE</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                    {this.state.showStateLoanAmountModal &&
                                                        <div id="popupModal" className={`modal ${this.state.showStateLoanAmountModal ? 'displayblock' : ''}`}>
                                                            <div className="modal-content">
                                                                <div className="wrapper state address-popup">
                                                                    <div className="trans-statment">
                                                                        <p>The minimum loan amount for {this.state.EmployerAddress1StateValue} is $2,000. Please adjust your loan amount.</p>
                                                                        {/* <p>We have yet to open for business in your selected state. Please check back later.</p> */}
                                                                    </div>
                                                                    <button value="Close" className="btn bc-primary" onClick={this.closePopup.bind(this)} > CLOSE</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            {filteredPage.type === 'button' || this.state.currentPage === this.state.TotalPages ? '' : this.props.currentDevice === 'Mobile' &&
                                                <div className="row">
                                                    <div className={` button-align ${" col-sm-12 col-xs-12 "}`}>
                                                        <button type="submit" id="viewpreqoffers" name="viewpreqoffers" className={` btn bc-primary ${this.state.currentPage === 3 || this.state.currentPage === 10 ? 'updated-margin' : ''} `} disabled={`${!this.state.IsContinue ? '' : 'disabled'}`}>{this.state.buttonText}</button>
                                                    </div></div>
                                            }

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}

export default ExtendedLoanApplication;