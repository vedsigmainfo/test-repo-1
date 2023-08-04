import React, { Component } from "react";
import { formHeaders, constantVariables } from "./Validation/FormData";
import { CallGAEvent } from "./Validation/GoogleAnalytics.js";
import { loanPurposeList1, SubLoanPurpose, PrimaryProjectPurpose, defaultValues, stateList, housingList,AddCoborrower, employmentList, citizenshipStatusList, highestEducationList, estimatedCreditScoreList, timeAtCurrentAddressList, anyMilitaryServiceList, POBox } from "./AppData";
import BCTextField from "./BCTextField";
import BCSelectField from "./BCSelectField";
import BCButtonField from "./BCButtonField";
import { SendEmail } from "./EmailFunctions";
import {validate } from "./Validation/validate";
import axios from "axios";
import MaskedTextField from "./MaskedTextField";
import { emailRegex, GetPhoneMask, GetSSNMask, AmountFormatting, isValidInteger, currencySymbol, unFormatAmount, calculateAge, isFutureDate, checkValidDate, GetZipcodeMask, IsPhoneNumberValid, IsValidAreaCode, unMaskPhone, IsSSNGroupValid, allLetter } from "./Validation/RegexList";
import BCLoginField from "./BCLoginField";

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
class ConfigurableBreadcrumb extends Component {
    constructor(props) {
        super(props);
        const filteredLoanPurpose = loanPurposeList1.filter(lp => {
            if (this.props.loanPurpose) {
                return (lp.plKey.toLowerCase() === this.props.loanPurpose.toLowerCase() || lp.key.toLowerCase() === this.props.loanPurpose.toLowerCase())
                    && this.props.loanPurpose.length > 0;
            }
            return filteredLoanPurpose;
        });
        const filteredSubPurpose = SubLoanPurpose.filter(lp => {
            if (this.props.subPurpose && this.props.subPurpose !== undefined) {
                return (lp.plKey.toLowerCase() === this.props.subPurpose.toLowerCase() || lp.key.toLowerCase() === this.props.subPurpose.toLowerCase())
                    && this.props.subPurpose.length > 0;
            } else if (this.props.PostData && this.props.PostData.subPurpose) {
                return (lp.plKey.toLowerCase() === this.props.PostData.subPurpose.toLowerCase() || lp.key.toLowerCase() === this.props.PostData.subPurpose.toLowerCase())
                    && this.props.PostData.subPurpose.length > 0;
            }
            return filteredSubPurpose;
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
        const IsAddCoborrower = AddCoborrower.filter(lp => {
            if (this.props.PostData && this.props.PostData.addcoborrower) {
                return (lp.key.toLowerCase() === this.props.PostData.addcoborrower.toLowerCase() || lp.label.toLowerCase() === this.props.PostData.addcoborrower.toLowerCase())
                    && this.props.PostData.addcoborrower.length > 0;
            }
            return IsAddCoborrower;
        });
        this.BrowserBack = this.BrowserBack.bind(this);
        this.BrowserForward = this.BrowserForward.bind(this);
        this.state = {
            isError: false,
            creditScore: defaultValues.creditScore,
            defaultSelect: defaultValues.defaultSelect,
            // selectedState: this.props.PostData && this.props.PostData.state ? filteredState[0] ? filteredState[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            // selectedHousing: this.props.PostData && this.props.PostData.housing ? filteredHousing[0] ? filteredHousing[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            // selectedEmployment: this.props.PostData && this.props.PostData.employment ? filteredemployment[0] ? filteredemployment[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            // IsAdditionalBorrower: this.props.PostData && this.props.PostData.addcoborrower ? IsAddCoborrower[0] ? IsAddCoborrower[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            // selectedCitizenship: defaultValues.defaultSelect,
            // selectedHighestEducation: defaultValues.defaultSelect,
            // selectedEstimatedCreditScore: this.props.PostData && this.props.PostData.creditscore ? filteredEstimatedCreditScore[0] ? filteredEstimatedCreditScore[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            // selectedTimeAtCurrentAddress: this.props.PostData && this.props.PostData.currenttime ? filteredTimeAtCurrentAddress[0] ? filteredTimeAtCurrentAddress[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            // selectedAnyMilitaryService: defaultValues.defaultSelect,
            // selectedLoanPurpose: filteredLoanPurpose.length > 0 ? filteredLoanPurpose[0].key : this.props.PostData && this.props.PostData.loanPurpose ? this.props.PostData.loanPurpose : defaultValues.defaultSelect,
            // selectedPrimaryProject: filteredSubPurpose.length > 0 ? filteredSubPurpose[0].key : this.props.PostData && this.props.PostData.subPurpose && this.props.PostData.subPurpose !== undefined ? this.props.PostData.subPurpose : defaultValues.defaultSelect,
            // isFirstNameValid: true,
            // isLastNameValid: true,
            // isEmailValid: true,
            // isStreedAddressValid: true,
            // isApptValid: true,
            // isCityValid: true,
            // isStateValid: true,
            // isZipcodeValid: true,
            // isBirthdateValid: true,
            // isHousingValid: true,
            // isEmploymentValid: true,
            // isAdditionalBorrowerValid: true,
            // isCitizenshipStatusValid: true,
            // isHighestEducationValid: true,
            // isAnnualIncomeValid: true,
            // isHousingPaymentValid: true,
            // isEstimatedCreditScoreValid: true,
            // isTimeAtCurrentAddressValid: true,
            // isAnyMilitaryServiceValid: true,
            // isPhoneNumberValid: true,
            // isProvideSSNValid: true,
            // isLoanAmountValid: true,
            // isLoanPurposeValid: true,
            // isPrimaryProjectPurposeValid: true,
            // showFirstNameError: true,
            // showLastNameError: true,
            // showEmailError: true,
            // showStreedAddressError: true,
            // showApptError: true,
            // showCityError: true,
            // showZipcodeError: true,
            // showBirthdateError: true,
            // showAnnualIncomeError: true,
            // showAnnualIncomeMinError: true,
            // showHousingPaymentError: true,
            // showHousingPaymentMinError: true,
            // showHousingPaymentCodeError: true,
            // showPhoneNumberError: true,
            // showPhoneNumberCodeError: true,
            // showProvideSSNError: true,
            // showLoanAmountError: true,
            // showLoanAmountMinError: true,
            // showLoanPurposeError: true,
            // showPrimaryProjectError: true,
            // FirstNameValue: this.props.firstname && this.props.firstname !== undefined ? this.props.firstname : this.props.PostData && this.props.PostData.firstname && this.props.PostData.firstname !== undefined ? decodeURIComponent(this.props.PostData.firstname) : '',
            // LastNameValue: this.props.lastname && this.props.lastname !== undefined ? this.props.lastname : this.props.PostData && this.props.PostData.lastname && this.props.PostData.lastname !== undefined ? decodeURIComponent(this.props.PostData.lastname) : '',
            // EmailValue: this.props.email && this.props.email !== undefined ? decodeURIComponent(this.props.email) : this.props.PostData && this.props.PostData.email && this.props.PostData.email !== undefined ? decodeURIComponent(this.props.PostData.email) : '',
            // EmailChangedValue: '',
            // StreedAddressValue: this.props.PostData && this.props.PostData.streetaddress ? decodeURIComponent(this.props.PostData.streetaddress) : '',
            // ApptValue: this.props.PostData && this.props.PostData.appartment ? decodeURIComponent(this.props.PostData.appartment) : '',
            // CityValue: this.props.PostData && this.props.PostData.city ? decodeURIComponent(this.props.PostData.city) : '',
            // ZipcodeValue: this.props.PostData && this.props.PostData.zipcode ? decodeURIComponent(this.props.PostData.zipcode) : '',
            // BirthdateValue: this.props.PostData && this.props.PostData.birthdate ? decodeURIComponent(this.props.PostData.birthdate) : '',
            // DisplayAnnualIncomeValue: '',
            // AnnualIncomeValue: this.props.PostData && this.props.PostData.annualincome ? currencySymbol + AmountFormatting(decodeURIComponent(this.props.PostData.annualincome)) : '',
            // HousingPaymentValue: this.props.PostData && this.props.PostData.housingPayment ? currencySymbol + AmountFormatting(decodeURIComponent(this.props.PostData.housingPayment)) : '',
            // PlainHousingPayment: '0',
            // PlainAnnualIncome: '',
            // PhoneNumberValue: this.props.PostData && this.props.PostData.phonenumber ? GetPhoneMask(decodeURIComponent(this.props.PostData.phonenumber)) : '',
            // PhoneNumberMasked: this.props.PostData && this.props.PostData.phonenumber ? this.props.PostData.phonenumber : '',
            // ProvideSSNValue: this.props.PostData && this.props.PostData.ssn ? GetSSNMask(this.props.PostData.ssn) : '',
            // ProvideSSNMasked: this.props.PostData && this.props.PostData.ssn ? this.props.PostData.ssn : '',
            // DisplayLoanAmountValue: '',
            // LoanAmountValue: this.props.loanAmount ? currencySymbol + AmountFormatting(this.props.loanAmount) : this.props.PostData && this.props.PostData.loanamount ? currencySymbol + AmountFormatting(this.props.PostData.loanamount) : '',
            // PlainLoanAmount: this.props.loanAmount ? unFormatAmount(this.props.loanAmount) : this.props.PostData && this.props.PostData.loanamount ? unFormatAmount(this.props.PostData.loanamount) : '',
            // HomePhone: '',
            // HomePhoneValue: '',
            // showHomePhoneError: true,
            // isHomePhoneValid: true,
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
            currentPage: this.props.CoBorrowerRequired ? this.props.filteredVersion[0].questions.borrower.length + 1 : 1,
            buttonText: 'Continue',
            IsContinue: false,
            mpUniqueClickID: this.getGUID(),
            skipPage1: false, skipPage10: false, skipPage12: false,
            load1block: false, load2block: false, load3block: false,
            load1Change: false, load2Change: false, load3Change: false, marqueeblock: false,
            IPAddress: '',
            currentPageName: '',

            // EmploymentStatus: '',
            // EmploymentStatusValue: '',
            // showEmploymentStatusError: true,
            // isEmploymentStatusValid: true,

            // EmployerName: '',
            // EmployerNameValue: '',
            // showEmployerNameError: true,
            // isEmployerNameValid: true,

            // Position: '',
            // PositionValue: '',
            // showPositionError: true,
            // isPositionValid: true,

            // StartDate: '',
            // StartDateValue: '',
            // showStartDateError: true,
            // isStartDateValid: true,

            // EndDate: '',
            // EndDateValue: '',
            // showEndDateError: true,
            // isEndDateValid: true,

            // WorkPhonenumber: '',
            // WorkPhonenumberValue: '',
            // showWorkPhonenumberError: true,
            // isWorkPhonenumberValid: true,

            // WorkAddress: '',
            // WorkAddressValue: '',
            // showWorkAddressError: true,
            // isWorkAddressValid: true,

            // WorkAddressCity: '',
            // WorkAddressCityValue: '',
            // showWorkAddressCityError: true,
            // isWorkAddressCityValid: true,

            // WorkAddressState: '',
            // WorkAddressStateValue: '',
            // showWorkAddressStateError: true,
            // isWorkAddressStateValid: true,

            // WorkAddressZipcode: '',
            // WorkAddressZipcodeValue: '',
            // showWorkAddressZipcodeError: true,
            // isWorkAddressZipcodeValid: true,

            // AdditionalBorrower: '',
            // showAdditionalBorrowerError: true,

            ShowConsent: false,
            BorrowerInfo: []
        }
    }

    /** function to initialise dynamic state variales */
    initialiseInitialState() {
        const version = this.props.filteredVersion;
        let questionnaire = this.props.CoBorrowerRequired ? this.GetQuestionList(false, version) : this.GetQuestionList(true, version);
        //const questionnaire = this.props.versionConfigSettings.questions;
        if(questionnaire && questionnaire.length > 0) {
            questionnaire.forEach(element => {
                let customFormFields = this.GetFilteredQuestions(element);
                let statePrefix = customFormFields.type === 'dropdown' ? 'selected' : ''; 
                let stateSuffix = customFormFields.type === 'dropdown' ? '' : 'Value';               
                //initialize states dynamically based on question name
                this.state[`${statePrefix}${this.GetPascalCase(customFormFields.name)}${stateSuffix}`] = '';
                this.state[`is${this.GetPascalCase(customFormFields.name)}Valid`] = true;
                this.state[`show${this.GetPascalCase(customFormFields.name)}Error`] = true;
                this.state[`show${this.GetPascalCase(customFormFields.name)}${customFormFields.errorCode}`] = '';
            });
        }  
    }

    componentDidMount() {
        // initialise dynamic state variables
        this.initialiseInitialState();

        //this.initAutocomplete();
        
        this.setState({formControls:this.props.versionConfigSettings.questions})
        this.getIPAddress();
        if (this.props.affiliateid === "CreditSoup" && (!this.ValidateInfo(false) || !this.IsValidBirthdate(this.props.PostData.birthdate))) {
            this.ShowLoanAppForm();
        }
        if(( this.props.loanPurpose !== undefined && this.props.loanPurpose !== '') || 
        (this.props.PostData && this.props.PostData.loanPurpose && this.props.PostData.loanPurpose !== undefined && this.props.PostData.loanPurpose !== '')) {
            this.setState({ skipPage1 : true, currentPage: 2});
            window.history.pushState("", "", `/los-application/app-page-2`);
             
        }
        this.state.TotalPages = this.props.CoBorrowerRequired ? this.props.filteredVersion[0].questions.borrower.length + this.props.filteredVersion[0].questions.coborrower.length :  this.props.filteredVersion[0].questions.borrower.length;
        this.state.QuestionsIds = this.props.CoBorrowerRequired ?  this.props.filteredVersion[0].questions.coborrower : this.props.filteredVersion[0].questions.borrower;
        if(this.props.CoBorrowerRequired) {
            window.history.pushState("", "", `/los-application/app-page-${this.props.filteredVersion[0].questions.borrower.length + 1}`);
            this.initAutocomplete();
        }
        
        if((this.props.firstname && this.props.lastname) || (this.props.PostData && this.props.PostData.firstname && this.props.PostData.lastname)) {
            this.setState({ skipPage10 : true});
        }
        
            this.getLenderLogoURLFromConfig();
        //}

        //CallGA(`/los-application/app-page-${this.state.currentPage}`);
        if (window.loadtracking) {
            if (this.props.IsZalea || this.props.IsHeadway) {
                window.loadtracking(`/app-page-${this.state.currentPage}`);
            } else {
                window.loadtracking(`/los-application/app-page-${this.state.currentPage}`);
            }

        }
        this.CallMatomoPageView(this.state.currentPage);
        // window.onbeforeunload = function(event) {
        //     event.returnValue = "Are you sure you want to reload page, it will redirect to Page 1.";
        // };
        window.curentstate = this;
        window.onpopstate = function (event) {
            var current = window.curentstate.state.currentPage;
            var updated = 0;
            if (window.curentstate.props.IsZalea || window.curentstate.props.IsHeadway) {
                let pageNo = window.location.pathname.replace('/app-page-', '');
                updated = parseInt(pageNo, 10);
            } else {
                let pageNo = window.location.pathname.replace('/los-application/app-page-', '');
                updated = parseInt(pageNo, 10);
            }
            if (current > updated) {
                window.curentstate.BrowserBack(event, updated);
            } else {
                //if(updated > 1 && updated <= 13 && window.curentstate.ValidateInfo()) {
                window.curentstate.BrowserForward(event, updated);
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
        this.state.TotalPages = this.props.CoBorrowerRequired ? filteredVersion[0].questions.borrower.length + filteredVersion[0].questions.coborrower.length :  filteredVersion[0].questions.borrower.length;
        this.state.QuestionsIds = this.props.CoBorrowerRequired ?  filteredVersion[0].questions.coborrower : filteredVersion[0].questions.borrower;
        return filteredVersion;
    }
    GetQuestionList(isBorrower, filteredVersion) {
        if(isBorrower) {
            if (filteredVersion && filteredVersion.length > 0 && filteredVersion[0].questions.borrower) {
                return filteredVersion[0].questions.borrower;
                
            }
        } else {
            if (filteredVersion && filteredVersion.length > 0 && filteredVersion[0].questions.coborrower) {
                return filteredVersion[0].questions.coborrower;
                
            }
        }

    }

    GetPascalCase(str) {
        str = str.replace(/(\w)(\w*)/g, 
            function(g0,g1,g2){ return g1.toUpperCase() + g2;});
        return str;
    }

    GetPagesByVersion(filteredVersion) {
        let pageArray = [];
        let questions = this.props.CoBorrowerRequired ? this.GetQuestionList(false, filteredVersion) : this.GetQuestionList(true, filteredVersion);
        
        if (questions && questions.length > 0 ) {
            let pageCount = this.props.CoBorrowerRequired ? this.props.filteredVersion[0].questions.borrower.length + 1 : 1;
            
            questions.forEach(element => {
                let customFormFields = this.GetFilteredQuestions(element);
                customFormFields.pageNumber = pageCount;
                let statePrefix = customFormFields.type === 'dropdown' ? 'selected' : '';
                let stateSuffix = customFormFields.type === 'dropdown' ? '' : 'Value';
                let state = this.state[`${statePrefix}${this.GetPascalCase(customFormFields.name)}${stateSuffix}`];
                let handleEvent = this.GetConfigurableData(customFormFields, 1);
                let showError = this.state[`is${this.GetPascalCase(customFormFields.name)}Valid`];                
                let showErrorMessage = this.state[`show${this.GetPascalCase(customFormFields.name)}Error`];                
                let showCodeErrorMessage = this.state[`show${this.GetPascalCase(customFormFields.name)}${customFormFields.errorCode}`];
  
                
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
                    let page = this.GetMaskedTextPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage);
                    pageArray.push(page);
                } else if (customFormFields.type === 'group') {
                    customFormFields.subquestions.forEach(subelement => {
                        let customSubFormFields = this.GetFilteredQuestions(subelement);
                        customSubFormFields.pageNumber = pageCount;
                      

                        let subStatePrefix = customSubFormFields.type === 'dropdown' ? 'selected' : '';
                        let subStateSuffix = customSubFormFields.type === 'dropdown' ? '' : 'Value';
                        let subState = this.state[`${subStatePrefix}${this.GetPascalCase(customSubFormFields.name)}${subStateSuffix}`];
                        let subHandleEvent = this.GetConfigurableData(customSubFormFields, 1);
                        let subShowError = this.state[`is${this.GetPascalCase(customSubFormFields.name)}Valid`];                
                        let subShowErrorMessage = this.state[`show${this.GetPascalCase(customSubFormFields.name)}Error`];                
                        let subShowCodeErrorMessage = this.state[`show${this.GetPascalCase(customSubFormFields.name)}${customSubFormFields.errorCode}`];

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
                            subpage = this.GetMaskedTextPage(customSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "login") {
                            subpage = this.GetLoginPage(customSubFormFields, subState, subHandleEvent, subShowError, subShowErrorMessage, subShowCodeErrorMessage);
                            pageArray.push(subpage);
                        }
                    });
                }
                pageCount++
            });
        }
        return pageArray;
    }
    GetConfigurableData(customFormFields, itemId) {
        if (customFormFields.name && customFormFields.name.toLowerCase() === "loanpurpose") {
            // if (itemId === 0) return this.state.selectedLoanPurpose;
         //   if (itemId === 1) return this.handleLoanPurposeChange.bind(this);
            // if (itemId === 2) return this.state.isLoanPurposeValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "loanamount") {
            // if (itemId === 0) return this.state.LoanAmountValue;
         //   if (itemId === 1) return this.handleLoanAmountChange.bind(this);
            // if (itemId === 2) return this.state.isLoanAmountValid;
            // if (itemId === 3) return this.state.showLoanAmountError;
            //if (itemId === 4) return this.state.showLoanAmountMinError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "address1") {
            // if (itemId === 0) return this.state.StreedAddressValue;
      //      if (itemId === 1) return this.handleStreedAddressChange.bind(this);
            // if (itemId === 2) return this.state.isStreedAddressValid;
            // if (itemId === 3) return this.state.showStreedAddressError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "address2") {
            // if (itemId === 0) return this.state.ApptValue;
        //    if (itemId === 1) return this.handleApptChange.bind(this);
            // if (itemId === 2) return this.state.isApptValid;
            // if (itemId === 3) return this.state.showApptError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "city") {
            // if (itemId === 0) return this.state.CityValue;
        //    if (itemId === 1) return this.handleCityChange.bind(this);
            // if (itemId === 2) return this.state.isCityValid;
            // if (itemId === 3) return this.state.showCityError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "state") {
            // if (itemId === 0) return this.state.selectedState;
        //    if (itemId === 1) return this.handleStateChange.bind(this);
            // if (itemId === 2) return this.state.isStateValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "zipcode") {
            // if (itemId === 0) return this.state.ZipcodeValue;
        //    if (itemId === 1) return this.handleZipcodeChange.bind(this);
            // if (itemId === 2) return this.state.isZipcodeValid;
            // if (itemId === 3) return this.state.showZipcodeError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "housingstatus") {
            // if (itemId === 0) return this.state.selectedHousing;
        //    if (itemId === 1) return this.handleHousingChange.bind(this);
            // if (itemId === 2) return this.state.isHousingValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "housingpayment") {
            // if (itemId === 0) return this.state.HousingPaymentValue;
         //   if (itemId === 1) return this.handleHousingPaymentChange.bind(this);
            // if (itemId === 2) return this.state.isHousingPaymentValid;
            // if (itemId === 3) return this.state.showHousingPaymentError;
            //if (itemId === 4) return this.state.showHousingPaymentCodeError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "creditscore") {
            // if (itemId === 0) return this.state.selectedEstimatedCreditScore;
        //    if (itemId === 1) return this.handleEstimatedCreditScoreChange.bind(this);
            // if (itemId === 2) return this.state.isEstimatedCreditScoreValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "dateofbirth") {
            // if (itemId === 0) return this.state.BirthdateValue;
          //  if (itemId === 1) return this.handleBirthdateChange.bind(this);
            // if (itemId === 2) return this.state.isBirthdateValid;
            // if (itemId === 3) return this.state.showBirthdateError;
        } if (customFormFields.name && customFormFields.name.toLowerCase() === "employmentstatus") {
            // if (itemId === 0) return this.state.selectedEmployment;
          //  if (itemId === 1) return this.handleEmploymentChange.bind(this);
            // if (itemId === 2) return this.state.isEmploymentValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "annualincome") {
            // if (itemId === 0) return this.state.AnnualIncomeValue;
           // if (itemId === 1) return this.handleAnnualIncomeChange.bind(this);
            // if (itemId === 2) return this.state.isAnnualIncomeValid;
            // if (itemId === 3) return this.state.showAnnualIncomeError;
            //if (itemId === 4) return this.state.showAnnualIncomeMinError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "firstname") {
            // if (itemId === 0) return this.state.FirstNameValue;
        //    if (itemId === 1) return this.handleFirstNameChange.bind(this);
            // if (itemId === 2) return this.state.isFirstNameValid;
            // if (itemId === 3) return this.state.showFirstNameError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "lastname") {
            // if (itemId === 0) return this.state.LastNameValue;
         //   if (itemId === 1) return this.handleLastNameChange.bind(this);
            // if (itemId === 2) return this.state.isLastNameValid;
            // if (itemId === 3) return this.state.showLastNameError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "primaryphonenumber") {
            // if (itemId === 0) return this.state.PhoneNumberValue;
         //   if (itemId === 1) return this.handlePhoneNumberChange.bind(this);
            // if (itemId === 2) return this.state.isPhoneNumberValid;
            // if (itemId === 3) return this.state.showPhoneNumberError;
            //if (itemId === 4) return this.state.showPhoneNumberCodeError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "emailaddress") {
            // if (itemId === 0) return this.state.EmailValue;
        //    if (itemId === 1) return this.handleEmailChange.bind(this);
            // if (itemId === 2) return this.state.isEmailValid;
            // if (itemId === 3) return this.state.showEmailError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "ssn") {
            // if (itemId === 0) return this.state.ProvideSSNValue;
        //    if (itemId === 1) return this.handleProvideSSNChange.bind(this);
            // if (itemId === 2) return this.state.isProvideSSNValid;
            // if (itemId === 3) return this.state.showProvideSSNError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "homephone") {
            // if (itemId === 0) return this.state.HomePhoneValue;
         //   if (itemId === 1) return this.handleHomePhoneChange.bind(this);
            // if (itemId === 2) return this.state.isHomePhoneValid;
            // if (itemId === 3) return this.state.showHomePhoneError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "employmentstatus") {
            // if (itemId === 0) return this.state.EmploymentStatusValue;
         //   if (itemId === 1) return this.handleEmploymentStatusChange.bind(this);
            // if (itemId === 2) return this.state.isEmploymentStatusValid;
            // if (itemId === 3) return this.state.showEmploymentStatusError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "additionalborrower") {
            // if (itemId === 0) return this.state.AdditionalBorrowerValue;
          //  if (itemId === 1) return this.handleAdditionalBorrowerChange.bind(this);
            // if (itemId === 2) return this.state.isAdditionalBorrowerValid;
            // if (itemId === 3) return this.state.showAdditionalBorrowerError;
        }
    }
    GetDropdownPage(customListItems, customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        let columnStyle = '';
        if (customFormFields.name === 'state') {
            columnStyle = ` text-control-align new-height state col-sm-4 col-xs-12`;
        } else {
            columnStyle = ` text-control-align col-sm-12 col-xs-12 `;
        }
        return <BCSelectField
            OnDropdownClick={this.onLoanPurposeClick.bind(this)}
            GetActiveLabel={this.getLoanPurposeLabel}
            SelectedValue={state}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            ShowHideList={this.showHideLoanPurposeList}
            DisplayItem={this.state.displayLoanPurposeItems}
            ListData={customListItems}
            HandleSelectedOption={this.HandleSelectedOption.bind(this,customFormFields)}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialEnabled}
            showTitle={customFormFields.showTitle}
            AutoFocus={customFormFields.focus}
            tabIndex={customFormFields.pageNumber} IsHeadway={this.props.IsHeadway}
            columnStyle={columnStyle}
            name={customFormFields.name} IsZalea={this.props.IsZalea} key={customListItems.length}/>;
    }
    GetTextPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        let min = ''; let max = '';
        let columnStyle = '';
        let customeMessage = '';
        let showToolTip = false;
        let inputType = "";
        if (customFormFields.name.toLowerCase() === 'loanamount') {
            min = this.props.IsZalea ? (this.state.selectedState.toLocaleLowerCase() === 'california' || this.state.selectedState.toLocaleLowerCase() === 'texas') ? constantVariables.HWStateMin : constantVariables.loanAmountMinZalea : constantVariables.loanAmountMin;
            max = this.props.IsZalea ? constantVariables.loanAmountMaxZalea : constantVariables.loanAmountMax;
        } else if (customFormFields.name === 'ssn') {
            min = '9';
            max = '9';
        } else if (customFormFields.name.toLowerCase() === 'housingpayment') {
            max = '8';
        }
        if (customFormFields.name.toLowerCase() === 'address2' || customFormFields.name.toLowerCase() === 'address1' || customFormFields.name.toLowerCase() === 'firstname' || customFormFields.name.toLowerCase() === 'lastname') {
            columnStyle = ` text-control-align new-height updated-margin ${this.props.IsZalea || this.props.IsHeadway ? " col-sm-6 col-xs-12 " : " col-sm-6 col-xs-12 "}`
        } else if (customFormFields.name.toLowerCase() === 'city' || customFormFields.name.toLowerCase() === 'zipcode') {
            columnStyle = ` text-control-align new-height  col-sm-4 col-xs-12  `;
        } else {
            columnStyle = ` text-control-align col-sm-12 col-xs-12 `;
        }

        if (customFormFields.name.toLowerCase() === "annualincome") {
            customeMessage = this.state.showAIMessage;
            showToolTip = true;
        } else if (customFormFields.name.toLowerCase() === "address1") {
            customeMessage = this.state.showAddressMessage;
        } else {
            customeMessage = '';
        }

        if (customFormFields.name.toLowerCase() === "annualincome" ||
            customFormFields.name.toLowerCase() === "phonenumber" ||
            customFormFields.name.toLowerCase() === "primaryphonenumber" ||
            customFormFields.name.toLowerCase() === "ssn" ||
            customFormFields.name.toLowerCase() === "housingpayment" ||
            customFormFields.name.toLowerCase() === "birthdate" ||
            customFormFields.name.toLowerCase() === "zipcode" ||
            customFormFields.name.toLowerCase() === "loanamount") {
            inputType = 'tel';
        } else if (customFormFields.name === "email") {
            inputType = 'email';
        } 
        return <BCTextField formFields={customFormFields}
            //handleChangeEvent={handleEvent}
            //value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            HandleSelectedOption={this.HandleSelectedOption.bind(this,customFormFields)}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber} 
            inputType={inputType} showWrapErrorMessage={false} 
            isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice}
            name={customFormFields.name}
            //IsZalea={this.props.IsZalea} IsHeadway={this.props.IsHeadway}
            OnFocusIn={this.handleFocusIn.bind(this, customFormFields.name)}
            currentBrowser={this.props.currentBrowser}
            customeMessage={customeMessage}
            showToolTip={showToolTip}
            min={min} max={max} showTitle={customFormFields.showTitle}
            columnStyle={columnStyle} />;
    }
    GetMaskedTextPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        let customeMessage = '';
        if (customFormFields.name === "dateOfBirth") {
            customeMessage = this.state.showDOBMessage;
        } else {
            customeMessage = ''
        }
        return <MaskedTextField formFields={customFormFields}
           // handleChangeEvent={this.HandleSelectedOption.bind(this,customFormFields)}
            HandleSelectedOption={this.HandleSelectedOption.bind(this,customFormFields)}
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            name={customFormFields.name} customeMessage={customeMessage}
            inputType="tel" IsNumeric={true} AutoFocus={customFormFields.focus}
            fieldname={customFormFields.name}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            columnStyle={` text-control-align ${this.props.IsZalea || this.props.IsHeadway ? " col-sm-12 col-xs-12 " : " col-sm-12 col-xs-12 "}`}
            IsZalea={this.props.IsZalea} IsHeadway={this.props.IsHeadway} />;
    }
    GetButtonPage(customListItems, customFormFields, state, handleEvent, showError, showErrorMessage) {
        return <BCButtonField columnStyle={` button-control-align ${this.props.IsZalea || this.props.IsHeadway ? " col-sm-12 col-xs-12 " : " col-sm-12 col-xs-12 "}`}
            OnDropdownClick={this.onEstimatedCreditScoreClick.bind(this)}
            GetActiveLabel={this.getEstimatedCreditScoreLabel}
            SelectedValue={state}
            ShowHideList={this.showHideEstimatedCreditScoreList}
            DisplayItem={this.state.displayEstimatedCreditScoreItems}
            ListData={customListItems}
            HandleSelectedOption={this.HandleSelectedOption.bind(this,customFormFields)}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialDisabled} ShowConsent={ this.state.ShowConsent}
            tabIndex={customFormFields.pageNumber} IsZalea={this.props.IsZalea}
            name={customFormFields.name} IsHeadway={this.props.IsHeadway} />;
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
        if (customFormFields.listItem === "housingList") {
            return housingList;
        } else if (customFormFields.listItem === "employmentList") {
            return employmentList;
        } else if (customFormFields.listItem === "estimatedCreditScoreList") {
            return estimatedCreditScoreList;
        } else if (customFormFields.listItem === "loanPurposeList1") {
            return loanPurposeList1;
        } else if (customFormFields.listItem === "stateList") {
            return stateList;
        }
        else if(customFormFields.listItem === "AddCoborrower"){
            return AddCoborrower;
        }

    }
     GetLoginPage(customFormFields, state, handleEvent, showError, showErrorMessage, showCodeErrorMessage) {
        //console.log(`${customFormFields.name} ==> ${state}`);

        let min = ''; let max = '';
        let columnStyle = '';
        let customeMessage = '';
        let inputType = "";
        if (customFormFields.name === "ownerDOB") {
            customeMessage = this.state.showDOBMessage;
        } else {
            customeMessage = ''
        }

        if (customFormFields.name.toLowerCase() === 'email' || customFormFields.name.toLowerCase() === 'password' || customFormFields.name.toLowerCase() === 'verifypassword'){
            //columnStyle = ` text-control-align new-height updated-margin ${this.props.IsZalea || this.props.IsHeadway ? " col-sm-6 col-xs-12 " : " col-sm-6 col-xs-12 "}`
            columnStyle = ` text-control-align col-sm-12 col-xs-12 `;
        }
        // else {
        //     columnStyle = ` text-control-align col-sm-12 col-xs-12 `;
        // }

        if (customFormFields.name === "email" || customFormFields.name === "ownerEmail") {
            inputType = 'email';
        }else if( customFormFields.name === "password" || customFormFields.name === "verifypassword"){
            inputType = 'tel';
        } 

        return <BCLoginField formFields={customFormFields}
            handleChangeEvent={this.HandleSelectedOption.bind(this,customFormFields)}
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber} inputType={inputType} showWrapErrorMessage={false} isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice} name={customFormFields.name}
            IsZalea={this.props.IsZalea} IsHeadway={this.props.IsHeadway}
            OnFocusIn={this.handleFocusIn.bind(this, customFormFields.name)}
            currentBrowser={this.props.currentBrowser}
            customeMessage={customeMessage}
            min={min} max={max} showTitle={customFormFields.showTitle}
            columnStyle={columnStyle} OwnerCount={ 1}
            PasswordStrengthChar={this.state.PasswordStrengthChar}
            PasswordStrengthSpecial={this.state.PasswordStrengthSpecial}
            PasswordStrengthNumber={this.state.PasswordStrengthNumber}
            PasswordStrengthUper={this.state.PasswordStrengthUper}
            PasswordStrengthLower={this.state.PasswordStrengthLower}
            customArray = {this.state.customArray}
             />; //columnStyle={` text-control-align ${columnWidth}`}
    }

    ShowLoanAppForm() {
        this.setState({
            IsCreditSoupEdit: true, IsCreditSoup: false,
            selectedHousing: this.getHousingKey(this.state.selectedHousing),
            selectedEmployment: this.getEmploymentKey(this.state.selectedEmployment),
            selectedEstimatedCreditScore: this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore),
            IsAdditionalBorrower: this.getCoborrowerKey(this.state.IsAdditionalBorrower)
        });
        if (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage') {
            this.setState({ housingPaymentDisabled: false });
        }
       
       
        document.getElementById('frmPrequalify').SSN.type = "password";
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
            //this.props.IsZalea ? stateHWList.find(o => o.key === state) : 
            if (!this.handlePOBoxAddress(streetAdd)) {
                let findState = stateList.find(o => o.key === state);
                if (findState !== null && findState !== undefined) {
                    this.setState({
                        StreedAddressValue: `${streetAdd} ${aprtmentAdd}`, ApptValue: '', CityValue: city,
                        selectedState: state, ZipcodeValue: zip, showInvalidAddressModal: false, IsContinue: false
                    });
                    document.getElementById('viewpreqoffers').focus();
                }
                else {
                    this.setState({ showInvalidAddressModal: true });
                }
            } else {
                this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showStreedAddressError: false });
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
        let isValid = true;
        if (!this.state.FirstNameValue) { isValid = false; }
        if (!this.state.LastNameValue) { isValid = false; }
        if (!this.state.EmailValue) { isValid = false; }
        else if (!emailRegex.test(this.state.EmailValue)) {
            isValid = false;
        }
        if (isValid && this.state.EmailValue !== this.state.EmailChangedValue) {
            this.setState({ initialDisabled: false, EmailChangedValue: this.state.EmailValue, InCompleteEmailSent: true });
            var payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.FirstWordCapital(this.state.FirstNameValue)}&lastname=${this.FirstWordCapital(this.state.LastNameValue)}&action=mandrill_incomplete&nonce=4109b2257c&isZalea=${window.isZalea}&isHeadway=${window.isHeadway}`;
            SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);
        }
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
    BrowserForward(e, updated) {
        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, updated);
        let currentPageState = updated;
        if (currentPageState >= 1 && currentPageState <= this.state.TotalPages && this.ValidateInfo(false)) {
            this.setState({ currentPage: currentPageState });
            if (customFormFields.name === "primaryPhoneNumber" || customFormFields.name === "address1") {
                this.setState({ IsContinue: true });
            }
            if (customFormFields.name === "primaryPhoneNumber" && this.state.PhoneNumberValue && this.state.isPhoneNumberValid) {
                this.setState({ IsContinue: false });
            }
            if (customFormFields.name === "address1" && this.state.StreedAddressValue && this.state.isStreedAddressValid
                && this.state.selectedState !== 'Select' && this.state.isStateValid
                && this.state.CityValue && this.state.isCityValid
                && this.state.ZipcodeValue && this.state.isZipcodeValid && this.state.showCityError && this.state.showZipcodeError) {
                this.setState({ IsContinue: false });
            }
            if (customFormFields.name === 'SSN') {
               this.setState({ ShowConsent: true });
            } else {
                this.setState({ ShowConsent: false });
            }
            if (customFormFields.name === 'address1') {
                setTimeout(() => {
                    this.initAutocomplete();
                }, 1000);
            }
            
            if (window.loadtracking) {
                window.loadtracking(`/los-application/app-page-${currentPageState}`);
            }
            this.CallMatomoPageView(currentPageState);
            if (this.state.currentPage === this.state.TotalPages) {
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
    BrowserBack(e, updated) {
        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, updated);
        let currentPageState = updated;
        if (currentPageState >= 1 && currentPageState <= this.state.TotalPages) {
            this.setState({ currentPage: currentPageState });
            this.CallMatomoPageView(currentPageState);
            if (customFormFields.name === "firstName" || customFormFields.name === "loanAmount") {
                this.setState({ IsContinue: false, PreviousPhone: this.state.PhoneNumberValue });
            }
            if (customFormFields.name === 'SSN') {
                this.setState({ ShowConsent: true });
             } else {
                 this.setState({ ShowConsent: false });
             }
            if (customFormFields.name === 'address1') {
                setTimeout(() => {
                    this.initAutocomplete();
                }, 1000);
            }
        }
        if (this.state.currentPage === this.state.TotalPages) {
            this.setState({ buttonText: 'View Pre-Qualified Offers' });
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
            if (this.props.IsZalea || this.props.IsHeadway) {
                window._paq.push(['setCustomUrl', `/app-page-${currentPageState}`]);
            } else {
                window._paq.push(['setCustomUrl', `/los-application/app-page-${currentPageState}`]);
            }

            window._paq.push(['setDocumentTitle', `Breadcrumb Application - Page ${currentPageState}`]);
            window._paq.push(['trackPageView']);
        }
    }
    Submit(){
        var that = this;
        if (window.presubmit !== undefined) window.presubmit();

        that.setState({ showModal: true });
        let app = this.props.IsZalea ? "Zalea" : this.props.IsHeadway ? 'Acorn Finance' : 'Breadcrumb';
        if (window._paq) {
            window._paq.push(['setCustomDimension', window.customDimensionId = 3, window.customDimensionValue = that.state.mpUniqueClickID]);
            window._paq.push(['setCustomDimension', window.customDimensionId = 8, window.customDimensionValue = that.state.mpUniqueClickID]);
            window._paq.push(['setCustomDimension', window.customDimensionId = 11, window.customDimensionValue = that.getEstimatedCreditScoreKey(that.state.selectedEstimatedCreditScore)]);
            window._paq.push(['setCustomDimension', window.customDimensionId = 12, window.customDimensionValue = that.state.AnnualIncomeValue]);
            window._paq.push(['setCustomDimension', window.customDimensionId = 14, window.customDimensionValue = this.props.IsHeadway ? 'Headway' : this.props.affiliateid ? this.props.affiliateid : null]);
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
            if (this.props.IsZalea) {
                window.loadtracking(`/app-zalea-submitted`);
            } else if (this.props.IsHeadway) {
                window.loadtracking(`/app-headway-submitted`);
            } else {
                window.loadtracking(`/personal-loans/app-breadcrumb-submitted`);
            }
        }
    }
    Continue(e) {
        e.preventDefault();
        if (this.state.isValid) {
            //(true) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}-ContinueClicked`);
            CallGAEvent("View Pre-Qualified Offers Button", "Application Submitted");

            //View Pre-Qualified Offers
            let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
            
            let currentPageState = this.state.currentPage;
            if(customFormFields.name  === "additionalBorrower") {
                if(this.state.IsAdditionalBorrower !== "Yes") {
                    this.SetBorrowerInfo();
                    this.setState({ showModal: true });
                    return;
                } else {
                    this.SetBorrowerInfo();
                    this.ResetBorrowerInfo();
                }
            }
            if (this.state.currentPage === this.state.TotalPages) {
                this.SetBorrowerInfo();
                this.Submit();
            } else {
                if (customFormFields.name === "housingStatus" && (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage')) {
                    currentPageState = currentPageState + 1;
                } else if (customFormFields.name === "housingStatus") {
                    currentPageState = currentPageState + 2;
                } else {
                    if((customFormFields.name === "primaryPhoneNumber" && this.state.skipPage12) ||
                    (customFormFields.name === "annualincome" && this.state.skipPage10)) {
                        currentPageState = currentPageState + 2;
                    } else {
                        currentPageState = currentPageState + 1;
                    }
                }
                customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, currentPageState);
                
                this.setState({ currentPage: currentPageState });
                if (customFormFields.name === "primaryPhoneNumber" && !this.state.PhoneNumberValue) {
                    this.setState({ IsContinue: true });
                }
                else if (customFormFields.name === "primaryPhoneNumber" && this.state.PhoneNumberValue && this.state.isPhoneNumberValid) {
                    this.setState({ IsContinue: false });
                }
                if (customFormFields.name === "address1" && this.state.StreedAddressValue && this.state.isStreedAddressValid
                    && this.state.selectedState !== 'Select' && this.state.isStateValid
                    && this.state.CityValue && this.state.isCityValid
                    && this.state.ZipcodeValue && this.state.isZipcodeValid && this.state.showCityError && this.state.showZipcodeError) {
                    this.setState({ IsContinue: false });
                }
                if(customFormFields.name === "SSN") {
                    this.setState({ ShowConsent: true });
                } else  {
                    this.setState({ ShowConsent: false });
                }
                window.history.pushState("", "", `/los-application/app-page-${currentPageState}`);

                if (window.loadtracking) {
                   window.loadtracking(`/los-application/app-page-${currentPageState}`);
                }
                
                this.CallMatomoPageView(currentPageState);
            }
            
            setTimeout(() => {
                if (customFormFields.name === "address1") {
                    this.initAutocomplete();
                }
            }, 1000);

            if (currentPageState === this.state.TotalPages) {
                this.setState({ buttonText: 'View Pre-Qualified Offers' });
            } else {
                this.setState({ buttonText: 'Continue' });
            }
            window.scrollTo(0, 0);
        }
        this.setState({
                     isValid: false
          });
    }

    FirstWordCapital(value) {
        return value.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
    }
    ValidateInfo(checkAllFields, event) {
        if (!this.state.initialDisabled) {

            let isValid = true;
            let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
            if (customFormFields.name === "loanPurpose") {
                if (this.props.IsZalea || this.props.IsHeadway) {
                    if (this.state.selectedPrimaryProject === 'Select') {
                        this.setState({
                            isPrimaryProjectPurposeValid: false
                        });
                        isValid = false;
                    }

                } else {
                    if (this.state.selectedLoanPurpose === 'Select') {
                        this.setState({
                            isLoanPurposeValid: false
                        });
                        isValid = false;
                    }
                    if (this.state.selectedLoanPurpose === 'Business Funding') {
                        isValid = true;
                    }
                }
            } else if (customFormFields.name === "loanAmount") {
                if (!this.state.LoanAmountValue) {
                    this.setState({
                        isLoanAmountValid: false
                    });
                    isValid = false;
                } else {
                    let loanAmount = unFormatAmount(this.state.LoanAmountValue);
                    var maxLoanAmount = this.props.IsZalea ? constantVariables.loanAmountMaxZalea : this.props.IsHeadway ? constantVariables.loanAmountMaxHW : constantVariables.loanAmountMax;
                    var minLoanAmount = this.props.IsZalea ? constantVariables.loanAmountMinZalea : this.props.IsHeadway ? constantVariables.loanAmountMinHW : constantVariables.loanAmountMin;
                    if (loanAmount < minLoanAmount || loanAmount > maxLoanAmount) {
                        this.setState({
                            isLoanAmountValid: true,
                            showLoanAmountMinError: false
                        });
                        isValid = false;
                    } else {
                        this.setState({
                            isLoanAmountValid: true,
                            showLoanAmountMinError: true,
                            PlainLoanAmount: loanAmount
                        });
                    }
                }

            } else if (customFormFields.name === "address1") {
                if (!this.state.StreedAddressValue) {
                    this.setState({
                        isStreedAddressValid: false
                    });
                    isValid = false;
                }
                if (!this.state.CityValue) {
                    this.setState({
                        isCityValid: false
                    });
                    isValid = false;
                }
                if (!this.state.ZipcodeValue) {
                    this.setState({
                        isZipcodeValid: false
                    });
                    isValid = false;
                } else if (this.state.ZipcodeValue.length < 5) {
                    this.setState({
                        isZipcodeValid: true,
                        showZipcodeError: false
                    });
                    isValid = false;
                }
                if (this.state.selectedState === 'Select') {
                    this.setState({
                        isStateValid: false
                    });
                    isValid = false;
                } else {
                    if (this.state.selectedState === 'California' || this.state.selectedState === 'Texas') {
                        if (this.state.PlainLoanAmount < constantVariables.HWStateMin) {
                            this.setState({
                                showStateLoanAmountModal: true,
                                showLoanAmountMinError: false,
                                showStateMinLoanAmount: true
                            });
                            isValid = false;
                        } else {
                            this.setState({
                                showStateMinLoanAmount: false
                            });
                        }
                    }
                }
                if (isValid) {
                    this.ValidateCityStateZip(true);
                    isValid = !this.state.IsContinue;
                }
                if (!this.state.StreedAddressValue || !this.state.isStreedAddressValid
                    || this.state.selectedState === 'Select' || !this.state.isStateValid
                    || !this.state.CityValue || !this.state.isCityValid
                    || !this.state.ZipcodeValue || !this.state.isZipcodeValid
                    || !this.state.showCityError || !this.state.showZipcodeError) {
                    isValid = false;
                }

            } else if (customFormFields.name === "housingStatus") {
                if (this.state.selectedHousing === 'Select') {
                    this.setState({
                        isHousingValid: false
                    });
                    isValid = false;
                }
            } else if (customFormFields.name === "housingPayment") {
                if (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage') {
                    if (!this.state.PlainHousingPayment || this.state.PlainHousingPayment === '0') { this.setState({ isHousingPaymentValid: false, housingPaymentDisabled: false }); isValid = false; }
                    else { this.setState({ isHousingPaymentValid: true }); }
                }
            } else if (customFormFields.name === "creditScore") {
                if (this.state.selectedEstimatedCreditScore === 'Select') {
                    this.setState({
                        isEstimatedCreditScoreValid: false
                    });
                    isValid = false;
                }
            } else if (customFormFields.name === "dateOfBirth") {
                let birthdate = this.state.BirthdateValue;
                if (!birthdate) {
                    this.setState({
                        isBirthdateValid: false,
                        showBirthdateError: true
                    });
                    isValid = false;
                } else {
                    birthdate = birthdate.replace(/_/g, '');
                    if (birthdate.length < 10) {
                        this.setState({
                            isBirthdateValid: false,
                            showBirthdateError: false,
                            showDOBMessage: 'Please enter a valid date'
                        });
                        isValid = false;
                    } else {
                        const message = checkValidDate(birthdate);
                        if (message === '') {
                            const futureDate = isFutureDate(birthdate);
                            if (futureDate) {
                                this.setState({
                                    isBirthdateValid: true,
                                    showBirthdateError: false,
                                    showDOBMessage: 'Future date is not allowed'
                                });
                                isValid = false;
                            } else {
                                const age = calculateAge(new Date(birthdate), new Date());
                                if (age > 100) {
                                    this.setState({
                                        isBirthdateValid: true,
                                        showBirthdateError: false,
                                        showDOBMessage: 'Invalid birth date'
                                    });
                                    isValid = false;
                                } else
                                    if (age < 18 || isNaN(age)) {
                                        this.setState({
                                            isBirthdateValid: true,
                                            showBirthdateError: false,
                                            showDOBMessage: ''
                                        });
                                        isValid = false;
                                    } else {
                                        this.setState({
                                            isBirthdateValid: true,
                                            showBirthdateError: true
                                        });
                                    }
                            }
                        } else {
                            this.setState({
                                isBirthdateValid: true,
                                showBirthdateError: false,
                                showDOBMessage: `Please provide valid ${message}`
                            });
                            isValid = false;
                        }
                    }
                }
            }
            if (customFormFields.name === "employmentStatus") {
                if (this.state.selectedEmployment === 'Select') {
                    this.setState({
                        isEmploymentValid: false
                    });
                    isValid = false;
                }
            } else if (customFormFields.name === "annualIncome") {
                let annualIncome = unFormatAmount(this.state.AnnualIncomeValue);
                if (!annualIncome) {
                    this.setState({
                        isAnnualIncomeValid: false,
                        showAnnualIncomeMinError: true
                    });
                    isValid = false;
                } else {

                    if (annualIncome < constantVariables.annualIncomeMin) {
                        this.setState({
                            isAnnualIncomeValid: true,
                            showAnnualIncomeMinError: false,
                            showAIMessage: ''
                        });
                        isValid = false;
                    } else if (annualIncome > constantVariables.annualIncomeMax) {
                        this.setState({
                            isAnnualIncomeValid: true,
                            showAnnualIncomeError: false,
                            showAnnualIncomeMinError: true,
                            showAIMessage: 'Value may not exceed $10M'
                        });
                        isValid = false;
                    } else {
                        this.setState({
                            isAnnualIncomeValid: true,
                            showAnnualIncomeError: true,
                            showAnnualIncomeMinError: true,
                            PlainAnnualIncome: annualIncome
                        });
                    }
                }
            } else if (customFormFields.name === "firstName") {
                if (!this.state.FirstNameValue) {
                    this.setState({
                        isFirstNameValid: false
                    });
                    isValid = false;
                } else {
                    this.setState({
                        FirstNameValue: this.FirstWordCapital(this.state.FirstNameValue)
                    });
                }
                if (!this.state.LastNameValue) {
                    this.setState({
                        isLastNameValid: false
                    });
                    isValid = false;
                } else {
                    this.setState({
                        LastNameValue: this.FirstWordCapital(this.state.LastNameValue)
                    });
                }
            } else if (customFormFields.name === "primaryPhoneNumber") {
                let phoneNumber = this.state.PhoneNumberValue;
                if (!phoneNumber) {
                    this.setState({
                        isPhoneNumberValid: false,
                        showPhoneNumberError: true
                    });
                    isValid = false;
                } else {
                    phoneNumber = phoneNumber.replace(/_/g, '');
                    if (phoneNumber.length === 10) {
                        this.setState({
                            isPhoneNumberValid: false,
                            showPhoneNumberError: true,
                        });
                        isValid = false;
                    } else {
                      if (!IsPhoneNumberValid(phoneNumber)){
                            this.setState({  
                                showPhoneNumberError: false,
                                
                            });  
                            isValid = false;
                        }
                        else{
                            this.setState({
                                showPhoneNumberError: true,
                            });
                        }
                    }      
                }
                }  
            else if (customFormFields.name === "emailAddress") {
                if (!this.state.EmailValue) {
                    this.setState({
                        isEmailValid: false
                    });
                    isValid = false;
                } else if (emailRegex.test(this.state.EmailValue)) {
                    this.setState({
                        isEmailValid: true,
                        showEmailError: true
                    });
                } else {
                    this.setState({
                        isEmailValid: true,
                        showEmailError: false
                    });
                    isValid = false;
                }
            } else if (customFormFields.name === "SSN") {
                let ssn = this.state.ProvideSSNValue;
                if (!ssn) {
                    this.setState({
                        isProvideSSNValid: false
                    });
                    isValid = false;
                } else {
                    this.setState({
                        isProvideSSNValid: true
                    });
                    ssn = ssn.replace(/_/g, '');
                    if (ssn.length !== 11 && !this.state.IsCreditSoupEdit) {
                        this.setState({
                            showProvideSSNError: false
                        });
                        isValid = false;
                    } else {
                        if (!IsSSNGroupValid(ssn)) {
                            this.setState({
                                showProvideSSNError: false
                            });
                            isValid = false;
                        } else {
                            this.setState({
                                showProvideSSNError: true
                            });
                        }
                    }
                }
            }
            if (customFormFields.name === "additionalcoborrower") {
                if (this.state.IsAdditionalBorrower === 'Select') {
                    this.setState({
                        isAdditionalBorrowerValid: false
                    });
                    isValid = false;
                }
            }


            if (checkAllFields) {
                if (this.state.ShowConsent) {
                    let isAgreePqTerms = document.getElementById('frmPrequalify').agreePqTerms.checked;

                    if (!isAgreePqTerms) { this.setState({ AgreePqTerms: false }); isValid = false; }

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

    handleEmailChange(isFocus, event) {
        let email = event.target.value;
        this.setState({ EmailValue: email, isEmailValid: true, showEmailError: true, emailFocus: isFocus, isError: false });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("Email", "FocusOut");
            if (!email) { this.setState({ isEmailValid: false, showEmailError: true }); } else {
                if (emailRegex.test(email)) {
                    this.setState({ isEmailValid: true, showEmailError: true });
                    this.InitialClick();
                } else {
                    this.setState({ isEmailValid: true, showEmailError: false });
                }
            }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("Email", "FocusIn");
        }
    }
    handleStreedAddressChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let streetAddress = event.target.value;
            this.setState({ StreedAddressValue: streetAddress, isStreedAddressValid: true, isError: false, showAddressMessage: '', showStreedAddressError: true });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                // CallGAEvent("StreedAddress","FocusOut");
                if (!streetAddress) { this.setState({ isStreedAddressValid: false }); }
                else if (this.handlePOBoxAddress(streetAddress)) {
                    this.setState({ showAddressMessage: 'PO Boxes are not permitted.', showStreedAddressError: false });
                } else { this.setState({ isStreedAddressValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Street Address", "FocusIn");
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
            this.setState({ CityValue: city, isCityValid: true, isError: false, IsContinue: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("City", "FocusOut");
                if (!city) { this.setState({ isCityValid: false, showCityError: true }); }
                else {
                    //this.setState({isCityValid : true});
                    if (this.state.selectedState !== 'Select' && this.state.ZipcodeValue) {
                        //this.setState({ IsContinue : true});
                        this.ValidateCityStateZip(true);
                    } else {
                        this.setState({ isCityValid: true, IsContinue: false });
                    }
                }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("City", "FocusIn");
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
                this.setState({ isZipcodeValid: true, showZipcodeError: true, IsContinue: false });
                return true;
            }
            else {
                this.setState({ isZipcodeValid: true, showZipcodeError: false, IsContinue: false });
                return false;
            }
        }
    }
    handleZipcodeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let zipcode = GetZipcodeMask(event.target.value);
            this.setState({ ZipcodeValue: zipcode, isZipcodeValid: true, showZipcodeError: true, isError: false, IsContinue: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Zipcode", "FocusOut");
                if (!zipcode) { this.setState({ isZipcodeValid: false, showZipcodeError: true }); } else {
                    if (zipcode.length < 5) {
                        this.setState({ isZipcodeValid: true, showZipcodeError: false });
                    } else {
                        if (this.state.selectedState !== 'Select' && this.state.CityValue) {
                            this.ValidateCityStateZip(true);
                        } else {
                            this.setState({ isZipcodeValid: true, showZipcodeError: true, IsContinue: false });
                        }
                        //this.setState({isZipcodeValid : true, showZipcodeError: true});
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
    handleAnnualIncomeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let annualIncome = unFormatAmount(event.target.value);
            annualIncome = annualIncome.replace(/^0+/, '');

            if (isValidInteger(annualIncome)) {
                this.setState({ AnnualIncomeValue: annualIncome, isAnnualIncomeValid: true, showAnnualIncomeMinError: true, annualIncomeFocus: this.props.currentDevice === 'Mobile' ? false : isFocus, isError: false, showAIMessage: '' });
                if (!isFocus) {
                    this.setState({ AnnualIncomeValue: `$${AmountFormatting( annualIncome)}` });
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
                    CallGAEvent("Housing Payment", "FocusOut");
                    if (!housingPayment) { this.setState({ isHousingPaymentValid: false, showHousingPaymentMinError: true }); }
                } else {
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                    CallGAEvent("Housing Payment", "FocusIn");
                }
            } else { this.setState({ isHousingPaymentValid: true, showHousingPaymentMinError: true }); }
        }
    }
    handlePhoneNumberChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            let phoneNumber = event.target.value;
            let plainNumber = phoneNumber.replace(/\(/g, '').replace(/\)/g, '').replace(/_/g, '').replace(/-/g, '').replace(' ', '');
            this.setState({
                PhoneNumberValue: phoneNumber, isPhoneNumberValid: true,
                showPhoneNumberCodeError: true,
                showPhoneNumberError: true, isError: false
            });
            if (!isFocus) {
                CallGAEvent("primaryPhoneNumber", "FocusOut");
                if (!this.state.PhoneNumberValue) {
                    this.setState({ isPhoneNumberValid: false, showPhoneNumberError: true, IsContinue: true });
                    return false;
                }
                if (plainNumber.length === 10) {
                    if (this.state.IsContinue || this.state.PreviousPhone !== phoneNumber) {
                        this.PhoneValidation(phoneNumber);
                    }
                } else {
                    this.setState({
                        isPhoneNumberValid: true,
                        showPhoneNumberCodeError: true,
                        showPhoneNumberError: false,
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
        return isValid;
    }
    PhoneValidationAPI(phoneNumber) {
        let isValid = true;
        this.setState({ showPhoneNumberError: true });
        var promise = this.getPhoneNumberValidate(phoneNumber);
        promise.then(response => {
            if (response.data !== undefined) {
                isValid = response.data.valid;
                if (!isValid) {
                    this.setState({
                        isPhoneNumberValid: true,
                        showPhoneNumberCodeError: true,
                        showPhoneNumberError: false,
                        IsContinue: true
                    });
                    isValid = false;
                }
                else {
                    this.setState({
                        showPhoneNumberError: true,
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
                document.getElementById('frmPrequalify').SSN.type = "password";
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
                if( document.getElementById('frmPrequalify').SSN !== undefined)
                document.getElementById('frmPrequalify').SSN.type = "tel";
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
                if (this.props.IsZalea || this.props.IsHeadway) {
                    const increasedLoanAmount = Math.ceil((loanAmount / 0.94) / 50) * 50;
                    const fees = increasedLoanAmount - loanAmount;
                    this.setState({ LoanOriginationFees: fees, LoanOrigination: increasedLoanAmount });
                }
                if (!isFocus) {
                    this.setState({ LoanAmountValue: `$${AmountFormatting(loanAmount)}` });
                    //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                    CallGAEvent("Loan Amount", "FocusOut");
                    if (!loanAmount) { this.setState({ showLoanAmountMinError: false }); } else {
                        var maxLoanAmount = this.props.IsZalea ? constantVariables.loanAmountMaxZalea : this.props.IsHeadway ? constantVariables.loanAmountMaxHW : constantVariables.loanAmountMax;
                        var minLoanAmount = this.props.IsZalea ? constantVariables.loanAmountMinZalea : this.props.IsHeadway ? constantVariables.loanAmountMinHW : constantVariables.loanAmountMin;
                        if (this.state.selectedState === 'California' || this.state.selectedState === 'Texas') {
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
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
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
            this.setState({ isStateValid: true });
        }
    }
    handleStateChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const states = event.target.value;
            this.setState({ selectedState: states, isStateValid: true, isError: false, showLoanAmountMinError: true, IsContinue: false });
            if (!isFocus) {
                CallGAEvent("State", "FocusOut");
                if (states === 'Select') { this.setState({ isStateValid: false }); } else {
                    if (states === 'California' || states === 'Texas') {
                        if (this.state.PlainLoanAmount < constantVariables.HWStateMin) {
                            this.setState({ showStateLoanAmountModal: true, showLoanAmountMinError: false, showStateMinLoanAmount: true });
                        }
                    }
                    if (this.state.ZipcodeValue && this.state.CityValue) {
                        this.ValidateCityStateZip(true);
                    } else {
                        this.setState({ isStateValid: true });
                    }
                }
            } else {
                CallGAEvent("State", "FocusIn");
            }
        }
    }
    getStateLabel(key) {
        const selectedState = stateList.filter((states) => {
            return states.key === key;
        });
        return selectedState[0].label;
    }
    //Select Housing  Dropdown event
    showHideHousingList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onHousingClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isHousingValid: true });
        }
    }
    handleHousingChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const housing = event.target.id;
            this.setState({ selectedHousing: housing, isHousingValid: true, isError: false, isHousingPaymentValid: true });
            if (housing === 'RENT' || housing === 'OWN_WITH_MORTGAGE' || housing === 'Own – with mortgage') {
                this.setState({ housingPaymentDisabled: false });
            }
            else {
                this.setState({ housingPaymentDisabled: true, HousingPaymentValue: '', PlainHousingPayment: '0' });
            }
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("housing Status", "FocusOut");
                if (housing === 'Select') { this.setState({ isHousingValid: false }); } else { this.setState({ isHousingValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("housing Status", "FocusIn");
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
        }
    }
    handleEmploymentChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const employment = event.target.id;
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


    //Add coborrower
    handleAdditionalBorrowerChange(isFocus, event) {
        const addcoborrower = event.target.id;
        this.setState({ IsAdditionalBorrower: addcoborrower, isAdditionalBorrowerValid: true, isError: false });
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("CoBorrower", "FocusOut");
            if (addcoborrower === 'Select') { this.setState({ isAdditionalBorrowerValid: false }); } else { this.setState({ isAdditionalBorrowerValid: true }); }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("CoBorrower", "FocusIn");
        }
        if(addcoborrower === 'Yes') {
            this.Continue.bind(this);
        }       
    }
    getCoborrowerLabel(key) {
        const AdditionalBorrower = AddCoborrower.filter((addcoborrower) => {
            return addcoborrower.key === key;
        });
        return AdditionalBorrower.length > 0 ? AdditionalBorrower[0].label : '';
    }
    getCoborrowerKey(label) {
        const AdditionalBorrower = AddCoborrower.filter((addcoborrower) => {
            return addcoborrower.label === label || addcoborrower.key === label;
        });
        return AdditionalBorrower.length > 0 ? AdditionalBorrower[0].key : '';
    }

    //Select CitizenShip  Dropdown event
    showHideCitizenshipList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onCitizenshipClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isCitizenshipStatusValid: true });
        }
    }
    handleCitizenshipChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const citizenship = event.target.value;
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
        }
    }
    handleHighestEducationChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const education = event.target.value;
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
        }
    }
    handleEstimatedCreditScoreChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const estimatedCreditScore = event.target.id;
            this.setState({ selectedEstimatedCreditScore: estimatedCreditScore, isEstimatedCreditScoreValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Credit Score", "FocusOut");
                if (estimatedCreditScore === 'Select') { this.setState({ isEstimatedCreditScoreValid: false }); } else { this.setState({ isEstimatedCreditScoreValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Credit Score", "FocusIn");
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
        }
    }
    handleTimeAtCurrentAddressChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const timeAtCurrentAddress = event.target.id;
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
    //Select Any Military Service  Dropdown event
    showHideAnyMilitaryServiceList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onAnyMilitaryServiceClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isAnyMilitaryServiceValid: true });
        }
    }
    handleAnyMilitaryServiceChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const anyMilitaryService = event.target.value;
            this.setState({ selectedAnyMilitaryService: anyMilitaryService, isAnyMilitaryServiceValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("AnyMilitaryService", "FocusOut");
                if (anyMilitaryService === 'Select') { this.setState({ isAnyMilitaryServiceValid: false }); } else { this.setState({ isAnyMilitaryServiceValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("AnyMilitaryService", "FocusIn");
            }
        }
    }
    getAnyMilitaryServiceLabel(key) {
        const selectedAnyMilitaryService = anyMilitaryServiceList.filter((AnyMilitaryService) => {
            return AnyMilitaryService.key === key || AnyMilitaryService.label === key;
        });
        return selectedAnyMilitaryService.length > 0 ? selectedAnyMilitaryService[0].label : '';
    }
    //PrimaryProject Purpose Dropdown event
    showHidePrimaryProjectPurposeList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onPrimaryProjectPurposeClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isPrimaryProjectPurposeValid: true });
        }
    }
    handlePrimaryProjectPurposeChange(isFocus, event) {

        if (!this.state.initialDisabled) {
            const primaryProjectPurpose = event.target.value;
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
    getPrimaryProjectPurposeLabel(key) {
        if (this.props.IsZalea) {
            const selectedPrimaryProjectPurpose = SubLoanPurpose.filter((primaryProjectPurpose) => {
                return primaryProjectPurpose.key === key || primaryProjectPurpose.label === key;
            });
            return selectedPrimaryProjectPurpose.length > 0 ? selectedPrimaryProjectPurpose[0].label : '';
        }
        if (this.props.IsHeadway) {
            const selectedPrimaryProjectPurpose = PrimaryProjectPurpose.filter((primaryProjectPurpose) => {
                return primaryProjectPurpose.key === key || primaryProjectPurpose.label === key;
            });
            return selectedPrimaryProjectPurpose.length > 0 ? selectedPrimaryProjectPurpose[0].label : '';
        }
    }

    //Loan Purpose Dropdown event
    showHideLoanPurposeList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
    onLoanPurposeClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isLoanPurposeValid: true });
        }
    }
    handleLoanPurposeChange(isFocus, event) {
        if (!this.state.initialDisabled) {
            const loanPurpose = event.target.value;
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
        if (allLetter(employerName)) {
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
        }
    }

    handlePositionChange(isFocus, event) {
        let position = event.target.value;
        if (allLetter(position)) {
            this.setState({ PositionValue: position, isPositionValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Position", "FocusOut");
                if (!position) { this.setState({ isPositionValid: false }); }
                else { this.setState({ isPositionValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Position", "FocusIn");
            }
        }
    }
    handleStartDateChange(isFocus, event) {
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
                            this.setState({ isStartDateValid: true, showStartDateError: true });
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
        if (allLetter(endDate)) {
            this.setState({ EndDateValue: endDate, isEndDateValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("End Date", "FocusOut");
                if (!endDate) { this.setState({ isEndDateValid: false }); }
                else { this.setState({ isEndDateValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("End Date", "FocusIn");
            }
        }
    }
    handleWorkPhonenumberChange(isFocus, event) {
        let workPhonenumber = event.target.value;
        if (allLetter(workPhonenumber)) {
            this.setState({ WorkPhonenumberValue: workPhonenumber, isWorkPhonenumberValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Work Phone number", "FocusOut");
                if (!workPhonenumber) { this.setState({ isWorkPhonenumberValid: false }); }
                else { this.setState({ isWorkPhonenumberValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Work Phone number", "FocusIn");
            }
        }
    }
    handleWorkAddressChange(isFocus, event) {
        let workAddress = event.target.value;
        if (allLetter(workAddress)) {
            this.setState({ WorkAddressValue: workAddress, isWorkAddressValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Work Address", "FocusOut");
                if (!workAddress) { this.setState({ isWorkAddressValid: false }); }
                else { this.setState({ isWorkAddressValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Work Address", "FocusIn");
            }
        }
    }

    handleWorkAddressCityChange(isFocus, event) {
        let workAddressCity = event.target.value;
        if (allLetter(workAddressCity)) {
            this.setState({ WorkAddressCityValue: workAddressCity, isWorkAddressCityValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Work Address City", "FocusOut");
                if (!workAddressCity) { this.setState({ isWorkAddressCityValid: false }); }
                else { this.setState({ isWorkAddressCityValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Work Address City", "FocusIn");
            }
        }
    }

    handleWorkAddressStateChange(isFocus, event) {
        let workAddressState = event.target.value;
        if (allLetter(workAddressState)) {
            this.setState({ WorkAddressStateValue: workAddressState, isWorkAddressStateValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Work Address State", "FocusOut");
                if (!workAddressState) { this.setState({ isWorkAddressStateValid: false }); }
                else { this.setState({ isWorkAddressStateValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Work Address State", "FocusIn");
            }
        }
    }

    handleWorkAddressZipcodeChange(isFocus, event) {
        let workAddressZipcode = event.target.value;
        if (allLetter(workAddressZipcode)) {
            this.setState({ WorkAddressZipcodeValue: workAddressZipcode, isWorkAddressZipcodeValid: true, isError: false });
            if (!isFocus) {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
                CallGAEvent("Work Address Zipcode", "FocusOut");
                if (!workAddressZipcode) { this.setState({ isWorkAddressZipcodeValid: false }); }
                else { this.setState({ isWorkAddressZipcodeValid: true }); }
            } else {
                //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
                CallGAEvent("Work Address Zipcode", "FocusIn");
            }
        }
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
    getPhoneNumberValidate(phoneNumber) {
        var apiEndpoint = `https://apilayer.net/api/validate?access_key=${this.props.ThemeConfig.phoneNumberAPIKey}&number=1${unMaskPhone(phoneNumber)}`;
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
                this.stateValidation();
            }
        });

        this.setState({ zipCodeArray: postalCodes, cityCodeArray: cityCodes, stateCodeArray: stateCodes });
        if (!this.state.showZipcodeError || !this.state.showCityError) {
            this.setState({ IsContinue: true });
        }
        if (this.state.showZipcodeError && this.state.showCityError) {
            this.setState({ IsContinue: false });
        }
    };

    GetCurrentPage(pages) {
        let that = this;
        let currentPage = pages.filter(element => {
            if (element) {
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


    SetBorrowerInfo(e) {
        if(this.state.IsAdditionalBorrower === 'Yes') {
            var borrower1 = `{"address1" :"${this.state.StreedAddressValue}","address2": "${this.state.ApptValue}","city": "${this.state.CityValue}","state": "${this.state.selectedState}","zipCode": "${this.state.ZipcodeValue}","housingStatus": "${this.state.selectedHousing}","housingPayment": "${this.state.PlainHousingPayment}","creditScore": "${this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)}}","dateOfBirth": "${this.state.BirthdateValue}","employmentStatus": "${this.getEmploymentKey(this.state.selectedEmployment)}","annualIncome": "${this.state.PlainAnnualIncome}",
            "firstName": "${this.state.FirstNameValue}", "lastName": "${this.state.LastNameValue}", "primaryPhoneNumber": "${this.state.HomePhoneValue}","emailAddress": "${this.state.EmailValue}","SSN": "${this.state.ProvideSSNValue}","agreePqTerms": "${this.state.AgreePqTerms}","agreeTCPA": "${this.state.AgreeTCPA}","secondaryPhoneNumber": "${this.state.SecondaryPhoneNumberValue}","primaryBorrower": "${this.state.IsAdditionalBorrower}","employmentInformation":[]
            }`;
            this.state.BorrowerInfo.push(borrower1);           
        } else {
            var borrowers = `{"address1" :"${this.state.StreedAddressValue}","address2": "${this.state.ApptValue}","city": "${this.state.CityValue}","state": "${this.state.selectedState}","zipCode": "${this.state.ZipcodeValue}","housingStatus": "${this.state.selectedHousing}","housingPayment": "${this.state.PlainHousingPayment}","creditScore": "${this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)}}","dateOfBirth": "${this.state.BirthdateValue}","employmentStatus": "${this.getEmploymentKey(this.state.selectedEmployment)}","annualIncome": "${this.state.PlainAnnualIncome}",
            "firstName": "${this.state.FirstNameValue}", "lastName": "${this.state.LastNameValue}", "primaryPhoneNumber": "${this.state.HomePhoneValue}","emailAddress": "${this.state.EmailValue}","SSN": "${this.state.ProvideSSNValue}","agreePqTerms": "${this.state.AgreePqTerms}","agreeTCPA": "${this.state.AgreeTCPA}","secondaryPhoneNumber": "${this.state.SecondaryPhoneNumberValue}","primaryBorrower": "${this.state.IsAdditionalBorrower}","employmentInformation":[]
            }`;
            this.state.BorrowerInfo.push(borrowers);
            this.Submit();
        }
    }

    PopulateBorrowerInfo() {
        // debugger;
        // if(this.state.BorrowerInfo.length > 0) {
        //     var jsonData = JSON.parse(this.state.BorrowerInfo[0]);
        //     this.setState({ StreedAddressValue: jsonData.address1,ApptValue:jsonData.address2,CityValue:jsonData.city,selectedState:jsonData.state, ZipcodeValue:jsonData.zipCode,
        //         selectedHousing:jsonData.housingStatus,PlainHousingPayment:jsonData.housingPayment, HousingPaymentValue:`$${AmountFormatting(jsonData.housingPayment)}`,selectedEstimatedCreditScore:jsonData.creditScore,BirthdateValue:jsonData.dateOfBirth,
        //         selectedEmployment:jsonData.employmentStatus, PlainAnnualIncome:jsonData.annualIncome,AnnualIncomeValue:`$${AmountFormatting(jsonData.annualIncome)}`, PhoneNumberValue:jsonData.phoneNumber, FirstNameValue: jsonData.firstName, LastNameValue:jsonData.lastName, HomePhoneValue:jsonData.primaryPhoneNumber,
        //         EmailValue:jsonData.emailAddress, ProvideSSNValue:jsonData.SSN, AgreePqTerms:true, AgreeTCPA:false, SecondaryPhoneNumberValue:''})
        // }
       
        // this.setState({ StreedAddressValue: '',ApptValue:'',CityValue:'',selectedState:'Select', ZipcodeValue:'',
        // selectedHousing:'selsect',PlainHousingPayment:'0', HousingPaymentValue:'',selectedEstimatedCreditScore:'select',BirthdateValue:'',
        // selectedEmployment:'Select', PlainAnnualIncome:'',AnnualIncomeValue: '', PhoneNumberValue:'', FirstNameValue: '', LastNameValue:'', HomePhoneValue:'',
        // EmailValue:'', ProvideSSNValue:'', AgreePqTerms:true, AgreeTCPA:false, SecondaryPhoneNumberValue:''})

    }

    ResetBorrowerInfo(e) {
        this.setState({ StreedAddressValue: '',ApptValue:'',CityValue:'',selectedState:'Select', ZipcodeValue:'',
        selectedHousing:'selsect',PlainHousingPayment:'0', HousingPaymentValue:'',selectedEstimatedCreditScore:'select',BirthdateValue:'',
        selectedEmployment:'Select', PlainAnnualIncome:'',AnnualIncomeValue: '', PhoneNumberValue:'', FirstNameValue: '', LastNameValue:'', HomePhoneValue:'',
        EmailValue:'', ProvideSSNValue:'', AgreePqTerms:true, AgreeTCPA:false, SecondaryPhoneNumberValue:'' ,zipCodeArray: [],
        cityCodeArray: [], stateCodeArray: [],});
    }
    GetPostData(field) {
        const borrower = this.state.BorrowerInfo && this.state.BorrowerInfo.length > 0 ? JSON.parse(this.state.BorrowerInfo[0]) : null;
        if(field === "action") { return `${this.props.IsZalea ? 'zalea' : this.props.IsHeadway ? 'Acorn Finance' : 'breadcrumb'} app submit`} 
        if(field === "gclid") { return this.props.GCLId ? this.props.GCLId : ''} 
        if(field === "partnerid") { return this.props.PartnerId ? this.props.PartnerId : ''} 
        if(field === "featured") { return this.props.Featured ? this.props.Featured : ''} 

        if(field === "os") { return this.props.currentOS ? this.props.currentOS : ''} 
        if(field === "browser") { return this.props.currentBrowser ? this.props.currentBrowser : ''} 
        if(field === "devicetype") { return this.props.currentDevice ? this.props.currentDevice : ''} 
        if(field === "affiliateid") { return this.props.IsHeadway ? 'Headway' : this.props.affiliateid ? this.props.affiliateid : ''} 
        if(field === "programid") { return this.props.programid ? this.props.programid : ''} 
        if(field === "campaignid") { return this.props.campaignid ? this.props.campaignid : ''} 

        if(field === "utm_source") { return this.props.utmSource ? this.props.utmSource : ''} 
        if(field === "utm_medium") { return this.props.utmMedium ? this.props.utmMedium : ''} 
        if(field === "utm_term") { return this.props.utmTerm ? this.props.utmTerm : ''} 
        if(field === "utm_campaign") { return this.props.utmCampaign ? this.props.utmCampaign : ''} 
        if(field === "utm_content") { return this.props.utmContent ? this.props.utmContent : ''} 
        if(field === "hsessionid") { return window.hSessionID ? window.hSessionID : ''} 
        if(field === "logo_type") { return  'LA';}
        if(field === "TransactionType") { return  "Application";}
        if(field === "borrowers") { return `[${this.state.BorrowerInfo}]`} 
        if(field === "loanpurpose") { return this.state.selectedLoanPurpose} 
        if(field === "loanPurpose") { return this.state.selectedLoanPurpose} 
        if(field === "firstname") { return this.state.FirstNameValue} 
        if(field === "lastname") { return this.state.LastNameValue} 
        if(field === "email") { 
            if(borrower !== null && borrower !== undefined) {
                return borrower.emailAddress
            } else {
                return this.state.EmailValue
            }
        } 
        if(field === "phonenumber") { return unMaskPhone(this.state.PhoneNumberValue)} 
        if(field === "streetaddress") { return this.state.StreedAddressValue} 
        if(field === "city") { return this.state.CityValue} 
        if(field === "state") { return this.state.selectedState} 
        if(field === "zipcode") { return this.state.ZipcodeValue} 
        if(field === "housingStatus") { return this.state.selectedHousing} 
        if(field === "housingPayment") { return this.state.PlainHousingPayment} 
        if(field === "currenttime") { return this.state.selectedTimeAtCurrentAddress} 
        if(field === "creditscore") { return this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)} 
        if(field === "birthdate") { return this.state.BirthdateValue} 
        if(field === "ssn") { return this.state.ProvideSSNValue} 
        if(field === "employmentStatus") { return this.getEmploymentKey(this.state.selectedEmployment)} 
        if(field === "annualincome") { return this.state.PlainAnnualIncome} 
        if(field === "pr_clid") { return this.state.mpUniqueClickID} 
        if(field === "loanAmount") { return this.state.PlainLoanAmount} 
        if(field === "loanamount") { return this.state.PlainLoanAmount} 
        if(field === "ipAddress") { return this.state.IPAddress} 
        if(field === "homePhone") { return this.state.HomePhoneValue} 
        if(field === "addcoborrower") { return this.state.IsAdditionalBorrower === 'Yes' ? true : false} 
    }
    HandleSelectedOption = (formcontrols,event) => {
    
        var name ='';
        var value ='';
        if(event.target)
        {
        if (event.target.type == 'submit')
        {
             name = event.currentTarget.name;
             value = event.currentTarget.id;
        }
        else
        {
            name = event.target.name;
            value = event.target.value;
       }
    }
        var formIsValid = false;
      
        formcontrols.value = value;
        formcontrols.touched = true;
        formcontrols.valid = validate(value, formcontrols.validationRules);
        if(formcontrols.customValidation)
        {
            this.handleCustomValidation(false,event,formcontrols.customValidation);
        }
    
        let statePrefix = formcontrols.type === 'dropdown' ? 'selected' : ''; 
        let stateSuffix = formcontrols.type === 'dropdown' ? '' : 'Value';               
        //initialize states dynamically based on question name
        this.state[`${statePrefix}${this.GetPascalCase(formcontrols.name)}${stateSuffix}`] =   formcontrols.value;
        this.state[`is${this.GetPascalCase(formcontrols.name)}Valid`] = formcontrols.valid;
       // this.state[`show${this.GetPascalCase(formcontrols.name)}Error`] = true;
        this.state[`show${this.GetPascalCase(formcontrols.name)}${formcontrols.errorCode}`] = true;
        
          if(formcontrols.valid )
               { 
                    formIsValid=true;
                    this.Continue.bind(this);
                    this.setState({
                         IsContinue: false,
                         isValid: formIsValid });
                
            }
            
            
           

          
       
  
    }
    handleCustomValidation(isFocus, event,customValidation) { 
        let eventValue = event.target.value;
        let password = event.target.value;
        let eventName= event.target.name;
        let isValid = true;
        let arr = [];
        var lowerCaseLetters = /[a-z]/g;
        var numbers = /[0-9]/g;
        var special = /[!@#$%^&*]/g;
        var upperCaseLetters = /[A-Z]/g;
        arr=[];
        for (let cvalidation in customValidation) {
  
            switch (cvalidation) {
                case 'character':
                    if(eventValue.length > customValidation[cvalidation])
                    {
                      //var validationmsg="<li style='green'>At least <b>customValidation[cvalidation] cvalidation</b></li>";
                      arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                    }
                    else
                    {
                        //var validationmsg="<li style='red'>At least <b>customValidation[cvalidation] cvalidation</b></li>";
                        arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                    }
                break;

              case 'lowercase':
                    if(password.match(lowerCaseLetters)) {  
                        //var validationmsg='<li style="green">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                        arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                     } else {
                      //  var validationmsg='<li style="red">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                        arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                    }
                    break;
              case 'number':
                       if(password.match(numbers)) {  
                                    //var validationmsg='<li style="green">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                            arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                         } else {
                               //  var validationmsg='<li style="red">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                           arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                          }
                          break;
              case 'upercase':
                            if(password.match(upperCaseLetters)) {  
                                         //var validationmsg='<li style="green">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                                 arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                              } else {
                                    //  var validationmsg='<li style="red">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                                arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                               }
                               break;
              case 'special':
                                if(password.match(special)) {  
                                             //var validationmsg='<li style="green">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                                     arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                                  } else {
                                        //  var validationmsg='<li style="red">At least <b>' +customValidation[cvalidation] + ' '  +  cvalidation + '</b></li>';
                                    arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                                   }
                break;
                
                           
                 default: isValid = true;
            }
        
          }
       this.setState({customArray:arr});
        this.setState({ PasswordValue: password, IsPasswordValid: true, ShowPasswordError: true, isError: false });
       
        if(password.match(lowerCaseLetters)) {  
            this.setState({ PasswordStrengthLower: true });
        } else {
            this.setState({ PasswordStrengthLower: false });
        }
        
      
        if(password.match(upperCaseLetters)) {  
            this.setState({ PasswordStrengthUper: true });
        } else {
            this.setState({ PasswordStrengthUper: false });
        }
        
        if(password.match(numbers)) {  
            this.setState({ PasswordStrengthNumber: true });
        } else {
            this.setState({ PasswordStrengthNumber: false });
        }
        // Validate Special character
   
        if(password.match(special)) {  
            this.setState({ PasswordStrengthSpecial: true });
        } else {
            this.setState({ PasswordStrengthSpecial: false });
        }
        if(password.length >= 8) {  
            this.setState({ PasswordStrengthChar: true });
        } else {
            this.setState({ PasswordStrengthChar: false });
        }
        if (!isFocus) {
            
            CallGAEvent("Password", "FocusOut");
            if (!password) { this.setState({ IsPasswordValid: false, ShowPasswordError: true }); } else {
                if(password.length < 8) { this.setState({ IsPasswordValid: true,ShowPasswordError: false, isError: true }); } 
                else{  
                    this.setState({ IsPasswordValid: true, ShowPasswordError: true });
                }
            }
        } else {
            CallGAEvent("Password", "FocusIn");
        }
    }
    render() {
        const uuid = typeof window.uuid === typeof undefined ? '' : window.uuid;
        let version = this.props.filteredVersion;
        let pages = this.GetPagesByVersion(version);
        let currentPages = this.GetCurrentPage(pages);
        let filteredPage = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
        let progressbar = this.GetProgressbarElements();
        return (
            <div className="container" >
                {/* <!--Header section --> */}
                <section id="headersection" className="">
                    <div className="row">
                        <div className={`${this.props.IsZalea || this.props.IsHeadway ? " col-md-2 " : " col-md-2 "}`}>
                        </div>
                        <div className={`center-block ${this.props.IsZalea || this.props.IsHeadway ? " col-md-12" : " col-md-12 "} ${this.props.IsHeadway && this.state.currentPage > 1 ? ' access-offer-top-margin ' : ''}`}>
                            <div className="box-panel" id="mainbox">
                                <div className="container-box-content" id="mainboxcontent">
                                    <div className="row">
                                        <div className="">
                                            {!this.props.IsZalea && this.state.showLenderImage ?
                                                <div className="prq-logo"> <img className="pqr-logo-img" src={this.state.showLenderImage} alt="" /> </div>
                                                : ''
                                            }
                                        </div>
                                        <div className={` custom-pdding ${this.props.IsZalea || this.props.IsHeadway ? " col-md-6 col-xs-12 " : " col-md-6 col-xs-12 "}`}>

                                            <ul className="progreesBreadcrumb-bar" dangerouslySetInnerHTML={{ __html: `${progressbar}` }}></ul>

                                            <span className={` progreesBreadcrumb-bar-text second-phase-done ${this.props.currentDevice === 'Mobile' ? this.state.currentPage === 3 || this.state.currentPage === 10 ? 'heading-top' : '' : ''}`} >Progress</span>
                                        </div>

                                        {this.props.IsHeadway && this.state.currentPage === 1 &&
                                            <span>
                                                <div className={' col-md-5 col-xs-12 headwayFirstSectionContent'}>
                                                    <h3 className="firstSectionContenth3">{formHeaders.TopHeader.title}</h3>
                                                    <div>
                                                        <div className="firstSectionContentp tick">{<i className="fa fa-check " aria-hidden="true"></i>}{formHeaders.TopHeader.context1}</div>
                                                        <div className="firstSectionContentp tick">{<i className="fa fa-check " aria-hidden="true"></i>}{formHeaders.TopHeader.context2}</div>
                                                        <div className="firstSectionContentp tick">{<i className="fa fa-check " aria-hidden="true"></i>}{formHeaders.TopHeader.context3}</div>
                                                    </div>
                                                </div>
                                                <h4 className={` col-md-5 col-xs-12 headway-view-offer`}>Already Applied? <a href={`/access-offers?dealerid=${this.props.dealerid}`} >View My Offers </a> </h4>
                                            </span>
                                        }


                                    </div>
                                    <form action={`${this.props.IsZalea ? constantVariables.zaleaPostURL : this.props.IsHeadway ? constantVariables.headWayPostURL : constantVariables.prequalifyPostURL}`} name="createacc2" id="frmPrequalify" disable-btn="" className="app-form" method="POST" onSubmit={this.Continue.bind(this)}>

                                        <input type="hidden" name="uuid" value={uuid} />
                                        <input type="hidden" name="MatchKey" value={this.GetPostData("uuid")} />
                                        <input type="hidden" name="action" value={this.GetPostData("action")} />
                                        <input type="hidden" name="gclid" value={this.GetPostData("gclid")} />
                                        <input type="hidden" name="partnerid" value={this.GetPostData("partnerid")} />
                                        <input type="hidden" name="featured" value={this.GetPostData("featured")} />

                                        <input type="hidden" name="os" value={this.GetPostData("os")} />
                                        <input type="hidden" name="browser" value={this.GetPostData("browser")} />
                                        <input type="hidden" name="devicetype" value={this.GetPostData("devicetype")} />
                                        <input type="hidden" name="affiliateid" value={this.GetPostData("affiliateid")} />
                                        <input type="hidden" name="programid" value={this.GetPostData("programid")} />
                                        <input type="hidden" name="campaignid" value={this.GetPostData("campaignid")} />

                                        <input type="hidden" name="utm_source" value={this.GetPostData("utm_source")} />
                                        <input type="hidden" name="utm_medium" value={this.GetPostData("utm_medium")} />
                                        <input type="hidden" name="utm_term" value={this.GetPostData("utm_term")} />
                                        <input type="hidden" name="utm_campaign" value={this.GetPostData("utm_campaign")} />
                                        <input type="hidden" name="utm_content" value={this.GetPostData("utm_content")} />
                                        <input type="hidden" name="hsessionid" value={this.GetPostData("hsessionid")} />
                                        <input type="hidden" name="logo_type" value="LA" />
                                        <input type="hidden" name="TransactionType" value={this.props.CoBorrowerRequired ? "addCoBorrower" : "LOSApplication"} />
                                        <input type="hidden" name="borrowers" value={`[${this.state.BorrowerInfo}]`} />
                                        <input type="hidden" name="loanpurpose" value={this.GetPostData("loanpurpose")} />
                                        <input type="hidden" name="loanPurpose" value={this.GetPostData("loanPurpose")} />
                                        <input type="hidden" name="firstname" value={this.GetPostData("firstname")} />
                                        <input type="hidden" name="lastname" value={this.GetPostData("lastname")} />
                                        <input type="hidden" name="email" value={this.GetPostData("email")} />
                                        <input type="hidden" name="phonenumber" value={this.GetPostData("phonenumber")} />
                                        <input type="hidden" name="streetaddress" value={this.GetPostData("streetaddress")} />
                                        <input type="hidden" name="city" value={this.GetPostData("city")} />
                                        <input type="hidden" name="state" value={this.GetPostData("state")} />
                                        <input type="hidden" name="zipcode" value={this.GetPostData("zipcode")} />
                                        <input type="hidden" name="housingStatus" value={this.GetPostData("housingStatus")} />
                                        <input type="hidden" name="housingPayment" value={this.GetPostData("housingPayment")} />
                                        <input type="hidden" name="currenttime" value={this.GetPostData("currenttime")} />
                                        <input type="hidden" name="creditscore" value={this.GetPostData("creditscore")} />
                                        <input type="hidden" name="birthdate" value={this.GetPostData("birthdate")} />
                                        <input type="hidden" name="ssn" value={this.GetPostData("ssn")} />
                                        <input type="hidden" name="employmentStatus" value={this.GetPostData("employmentStatus")} />
                                        <input type="hidden" name="annualincome" value={this.GetPostData("annualincome")} />
                                        <input type="hidden" name="pr_clid" value={this.GetPostData("pr_clid")} />
                                        <input type="hidden" name="loanAmount" value={this.GetPostData("loanAmount")} />
                                        <input type="hidden" name="loanamount" value={this.GetPostData("loanamount")} />
                                        <input type="hidden" name="ipAddress" value={this.GetPostData("ipAddress")} />
                                        <input type="hidden" name="homePhone" value={this.GetPostData("homePhone")} />
                                        <input type="hidden" name="addcoborrower" value={this.GetPostData("addcoborrower")} />
                                         {
                                            this.props.CoBorrowerRequired &&
                                            <spn>
                                                <input type="hidden" name="ApplicationID" value={this.props.ApplicationID} />
                                                <input type="hidden" name="CoBorrowerRequired" value={this.props.CoBorrowerRequired} />
                                            </spn>
                                         }
                                        <div id="breadcrumb-preloader-preloader">
                                            <div id="preloader" className={` box_item ${(filteredPage.name === 'address1' || filteredPage.name === 'address2' || filteredPage.name === 'firstName' || filteredPage.name === 'lastName') && this.props.currentDevice !== 'Mobile' ? ' address ' : ''}`}>
                                                <div className="">
                                                    <div className="row">

                                                        {filteredPage.name === 'address1' ? <div className={this.props.IsZalea || this.props.IsHeadway ? " col-sm-12 " : " col-sm-12 "}>
                                                            <h2 className="fieldname ">{filteredPage.title}</h2>
                                                        </div> : ""}
                                                        {filteredPage.name === 'firstName' ?
                                                            <div className=" col-sm-12 col-xs-12 "><h2 className="fieldname ">{filteredPage.title}</h2></div>
                                                            : ""}

                                                        {currentPages}
                                                    </div>

                                                    {filteredPage.type === 'button' || this.state.currentPage === this.state.TotalPages ? '' :
                                                        this.props.currentDevice !== 'Mobile' && !this.state.ShowConsent &&
                                                        <div className="ro ssw">
                                                            <div className={` ${" col-sm-12 col-xs-12"} button-control-align  ${filteredPage.name === 'firstName' || filteredPage.name === 'address1' ? ' center-align ' : ''}`}>
                                                                <button type="submit" id="viewpreqoffers" tabIndex={this.state.currentPage + 1} name="viewpreqoffers" className=" btn bc-primary " disabled={`${!this.state.IsContinue ? '' : 'disabled'}`} >{this.state.buttonText}</button>
                                                            </div></div>
                                                    }
                                                    {this.state.showModal && (this.state.currentPage === this.state.TotalPages || this.state.IsAdditionalBorrower !== "Yes") &&
                                                        <div id="" className={`modal ${this.state.showModal ? 'displayblock' : ''}`}>
                                                            <div className="modal-content">
                                                                <div className={`wrapper loans`}>
                                                                    <div className="trans-logo">
                                                                    <img src={this.props.ThemeConfig.logo} alt={this.props.ThemeConfig.theme_name} width= "250px" />
                                                                    </div>
                                                                    <div className="trans-statment" >
                                                                        {this.props.currentDevice === 'Mobile' ?
                                                                            <h4>Checking our partner network for loan offers…</h4>
                                                                            :
                                                                            <h1>Checking our partner network for loan offers…</h1>
                                                                        }
                                                                    </div>
                                                                     
                                                                        
                                                                            <div className={`${this.props.currentDevice === 'Mobile' ? 'load-img-mobile-hs' : 'load-img-hs'}`}>
                                                                                <i className="fa fa-spin fa-refresh"></i>
                                                                               
                                                                            </div> 
                                                                             
                                                                    <div className="website-text">
                                                                    {this.state.loaderContent === '' ? 
                                                                        <p>&nbsp;</p> : <p>{this.state.loaderContent}</p>
                                                                        }
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
                                                                        <p>The minimum loan amount for {this.state.selectedState} is $2,000. Please adjust your loan amount.</p>
                                                                    </div>
                                                                    <button value="Close" className="btn bc-primary" onClick={this.closePopup.bind(this)} > CLOSE</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            {filteredPage.type === 'button' || this.state.currentPage === this.state.TotalPages ? '' : this.props.currentDevice === 'Mobile'  && !this.state.ShowConsent &&
                                                <div className="row">
                                                    <div className={` button-align ${this.props.IsZalea || this.props.IsHeadway ? " col-sm-12 col-xs-12 " : " col-sm-12 col-xs-12 "}`}>
                                                        <button type="submit" id="viewpreqoffers" name="viewpreqoffers" className={` btn bc-primary ${this.state.currentPage === 3 || this.state.currentPage === 10 ? 'updated-margin' : ''} `} disabled={`${!this.state.IsContinue ? '' : 'disabled'}`}>{this.state.buttonText}</button>
                                                    </div></div>
                                            }
                                            {this.state.ShowConsent &&
                                                <span>
                                                    <div className="row">
                                                        <div className={` message-allignment ${this.props.IsZalea || this.props.IsHeadway ? " col-md-12 " : " col-md-12 "}`}>
                                                            <h2 className="fieldname">This will NOT affect your credit.</h2> </div>
                                                    </div>
                                                    {this.props.currentDevice === 'Mobile' && this.state.ShowConsent  &&
                                                        <div className="row">
                                                            <div className={`verify-button ${this.props.currentDevice !== 'Mobile' ? ' wrapper ' : ''}`}>
                                                                <button type="submit" id="viewpreqoffers" name="viewpreqoffers" className=" btn bc-primary submit-app" >{this.state.buttonText}</button>
                                                            </div> </div>}
                                                    <div className="row">
                                                     
                                                        <div className={" col-md-12 "}>
                                                       
                                                            <div className="checkbox">
                                                                <input name="agreePqTerms" id="agreePqTerms" checked={this.state.AgreePqTerms} tabIndex={this.state.currentPage + 1} value={this.state.AgreePqTerms} className={`checkbox pre-checkbox ${!this.state.AgreePqTerms ? 'has-error' : ''}`} type="checkbox" onChange={this.AgreePqTermsChange.bind(this)} />
                                                               
                                                                        <p className="formlist">{this.state.IsAdditionalBorrower === 'Yes' ? 'I, the co-borrower, intend to apply for joint credit and ' : '' }I authorize {this.props.ThemeConfig.theme_name} and its <a className="loan-app info-tooltip tooltip-width">
                                                                            <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink"><b>{this.props.ThemeConfig.theme_name} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818, Accredited Debt Relief'}  </span>
                                                                            partners </a> to obtain consumer reports and related information about me from one or more consumer reporting agencies, such as TransUnion, Experian, or Equifax. I also authorize PrimeRates and its partners to share information about me and to <a className="loan-app info-tooltip tooltip-width-send-email-message-me">
                                                                                <span className="tooltiptext tooltiptext-send-email-message-me tooltip-top-margin-send-email-message-me">I understand and agree that I am authorizing {this.props.IsZalea ? this.props.configSettings.ZaleaTheme : this.props.ThemeConfig.theme_name} and its partners to send me special offers and promotions via email.</span>
                                                                                send me email messages </a>. Additionally, I agree to the {this.props.ThemeConfig.theme_name} <a href={`${this.props.IsZalea ? 'https://www.Zalea.com/terms-of-use' : '/terms-of-use'}`} target="_blank" rel="noopener noreferrer" className="underline-on-hover">Terms of Use</a>, <a href={`${this.props.IsZalea ? 'https://www.Zalea.com/privacy-policy' : '/privacy-policy'}`} target="_blank" rel="noopener noreferrer" className="underline-on-hover">Privacy Policy</a>, and <a href={`${this.props.IsZalea ? 'https://www.Zalea.com/e-sign' : '/e-sign'}`} target="_blank" className="underline-on-hover">Consent to Electronic Communications</a>. {!this.state.AgreePqTerms && <span className="formerror-agreement  " >Please agree to terms and conditions</span>}</p>
                                                                

                                                            </div>
                                                            
                                                            <div className="checkbox">

                                                                <input id='agreeTCPA' type='hidden' value={this.state.AgreeTCPA} name="agreeTCPA" />
                                                                <input id="checkbox" className="checkbox pre-checkbox" tabIndex={this.state.currentPage + 2} type="checkbox" value={this.state.AgreeTCPA} onChange={this.AagreeTCPAChange.bind(this)} />
                                                                <p className="formlist2">{this.state.IsAdditionalBorrower === 'Yes' ? 'I, the co-borrower, intend to apply for joint credit and ' : '' }I agree to allow {this.props.ThemeConfig.theme_name} and its <a className="loan-app info-tooltip tooltip-width">
                                                                    <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink-2"><b>{this.props.ThemeConfig.theme_name} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818, Accredited Debt Relief'}  </span>
                                                                    partners </a> to <a className="loan-app info-tooltip tooltip-width-call-text-me">
                                                                        <span className={`tooltiptext tooltiptext-call-text-me ${'tooltip-top-margin-call-text-me'} `}>I authorize {this.props.ThemeConfig.theme_name} and its partner lenders, service providers, affiliates, and successors and assigns, to deliver telemarketing calls and text messages to each telephone number that I provide in connection with my inquiry and application for credit using an automatic telephone dialing system and/or a prerecorded or artificial voice message. I understand I am not required to provide this authorization as a condition of purchasing any property, goods or services. I certify that I have authority to provide this consent either because I am the subscriber of these telephone numbers or I am a non-subscriber customary user who has authority to consent to these communications. If I would like to revoke this consent, I agree to send an email to {'customerservice@primerates.com'} with "Phone Call Opt-Out" in the subject line.  </span>
                                                                        call or text me </a> at the phone numbers I have provided to discuss my application for credit and for other marketing purposes. (optional)</p>

                                                            </div>
                                                            
                                                        </div>
                                                       
                                                    </div>
                                                    {this.state.currentPage === this.state.TotalPages && this.state.ShowConsent  && this.props.currentDevice !== 'Mobile' &&
                                                        <div className="row">
                                                            
                                                            <div className={`verify-button ${this.props.currentDevice !== 'Mobile' ? ' wrapper ' : ''}`}>
                                                                <button type="submit" id="viewpreqoffers" tabIndex={this.state.currentPage + 3} name="viewpreqoffers" className=" btn bc-primary submit-app" >{this.state.buttonText}</button>
                                                            </div> </div>
                                                    }
                                                    {this.state.currentPage !== this.state.TotalPages && this.state.ShowConsent  && this.props.currentDevice !== 'Mobile' &&
                                                        <div className="row">
                                                            
                                                            <div className={`verify-button ${this.props.currentDevice !== 'Mobile' ? ' wrapper ' : ''}`}>
                                                                <button type="submit" id="viewpreqoffers" tabIndex={this.state.currentPage + 3} name="viewpreqoffers" className=" btn bc-primary submit-app" >{this.state.buttonText}</button>
                                                            </div> </div>
                                                    }
                                                </span>
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

export default ConfigurableBreadcrumb;