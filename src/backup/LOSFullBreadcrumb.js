import React, { Component } from "react";
import { formHeaders, constantVariables } from "./Validation/FormData";
import { CallGAEvent } from "./Validation/GoogleAnalytics.js";
import {  defaultValues,   stateList, housingList,AddCoborrower, employmentList, citizenshipStatusList, highestEducationList, estimatedCreditScoreList, timeAtCurrentAddressList, anyMilitaryServiceList, POBox } from "./AppData";
import BCTextField from "./BCTextField";
import BCSelectField from "./BCSelectField";
import BCButtonField from "./BCButtonField";
import { SendEmail } from "./EmailFunctions";
import axios from "axios";
import MaskedTextField from "./MaskedTextField";
import { emailRegex, GetPhoneMask, GetSSNMask, AmountFormatting, isValidInteger, currencySymbol, unFormatAmount, calculateAge, isFutureDate, checkValidDate, GetZipcodeMask, IsPhoneNumberValid, IsValidAreaCode, unMaskPhone, IsSSNGroupValid, allLetter } from "./Validation/RegexList";

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
class LOSFullBreadcrumb extends Component {
    constructor(props) {
        super(props);
         
        this.BrowserBack = this.BrowserBack.bind(this);
        this.BrowserForward = this.BrowserForward.bind(this);
        this.state = {
            isError: false,
            creditScore: defaultValues.creditScore,
            defaultSelect: defaultValues.defaultSelect,
            selectedState: "Select", //this.props.PostData && this.props.PostData.state ? filteredState[0] ? filteredState[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedHousing: "Select", //this.props.PostData && this.props.PostData.housing ? filteredHousing[0] ? filteredHousing[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedEmployment: "Select", //this.props.PostData && this.props.PostData.employment ? filteredemployment[0] ? filteredemployment[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            IsAdditionalBorrower: "Select", //this.props.PostData && this.props.PostData.addcoborrower ? IsAddCoborrower[0] ? IsAddCoborrower[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedCitizenship: defaultValues.defaultSelect,
            selectedHighestEducation: defaultValues.defaultSelect,
            selectedEstimatedCreditScore: "Select", //this.props.PostData && this.props.PostData.creditscore ? filteredEstimatedCreditScore[0] ? filteredEstimatedCreditScore[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedTimeAtCurrentAddress: "Select", //this.props.PostData && this.props.PostData.currenttime ? filteredTimeAtCurrentAddress[0] ? filteredTimeAtCurrentAddress[0].label : defaultValues.defaultSelect : defaultValues.defaultSelect,
            selectedAnyMilitaryService: defaultValues.defaultSelect,
            selectedDropdownValue: "Select", //filteredLoanPurpose.length > 0 ? filteredLoanPurpose[0].key : this.props.PostData && this.props.PostData.loanPurpose ? this.props.PostData.loanPurpose : defaultValues.defaultSelect,
            selectedPrimaryProject:"Select", // filteredSubPurpose.length > 0 ? filteredSubPurpose[0].key : this.props.PostData && this.props.PostData.subPurpose && this.props.PostData.subPurpose !== undefined ? this.props.PostData.subPurpose : defaultValues.defaultSelect,
          
            isDropdownFieldValid: true,
            displayDropdownItems: true,
            currentPage: 1,
            buttonText: 'Continue',
            IsContinue: false,
            mpUniqueClickID: this.getGUID(),
            skipPage1: false, skipPage10: false, skipPage12: false,
            load1block: false, load2block: false, load3block: false,
            load1Change: false, load2Change: false, load3Change: false, marqueeblock: false,
            IPAddress: '',
            currentPageName: '',
            ShowConsent: false,
            BorrowerInfo: []
        }
    }
    componentDidMount() {
        //this.initAutocomplete();
        this.getIPAddress();
        if (this.props.affiliateid === "CreditSoup" && (!this.ValidateInfo(false) || !this.IsValidBirthdate(this.props.PostData.birthdate))) {
            this.ShowLoanAppForm();
        }
        if(( this.props.loanPurpose !== undefined && this.props.loanPurpose !== '') || 
        (this.props.PostData && this.props.PostData.loanPurpose && this.props.PostData.loanPurpose !== undefined && this.props.PostData.loanPurpose !== '')) {
            this.setState({ skipPage1 : true, currentPage: 2});
            window.history.pushState("", "", `/los-application/app-page-2`);
             
        }
        // if(this.props.subPurpose !== '' || 
        // (this.props.PostData && this.props.PostData.subPurpose && this.props.PostData.subPurpose !=='' && this.props.PostData.subPurpose !== undefined)) {
        //     this.setState({ skipPage1 : true, currentPage: 2});
        //     if(this.props.IsZalea || this.props.IsHeadway) {
        //         window.history.pushState("", "", `/app-page-2`);
        //         this.ShowPowerdByPrimeRates("none");
        //         this.ShowHeadwayMenu("none");
        //     } else {
        //         window.history.pushState("", "", `/los-application/app-page-2`);
        //     }
        // }
        // if(this.props.email || (this.props.PostData && this.props.PostData.email)) {
        //     this.setState({ skipPage12 : true});
        // }
        if((this.props.firstname && this.props.lastname) || (this.props.PostData && this.props.PostData.firstname && this.props.PostData.lastname)) {
            this.setState({ skipPage10 : true});
        }
        // if (this.props.IsZalea) {
        //     this.setState({ selectedLoanPurpose: 'Medical Expense' });
        //     const increasedLoanAmount = Math.ceil((this.state.PlainLoanAmount / 0.94) / 50) * 50;
        //     const fees = increasedLoanAmount - this.state.PlainLoanAmount;
        //     this.setState({
        //         LoanOriginationFees: fees, LoanOrigination: increasedLoanAmount, IncludeFees: false,
        //         load1block: false, load2block: false, load3block: false,
        //         load1Change: false, load2Change: false, load3Change: false, marqueeblock: false
        //     });
        // } else if (this.props.IsHeadway) {
        //     this.setState({ selectedLoanPurpose: 'Home Improvement' });
        //     const increasedLoanAmount = Math.ceil((this.state.PlainLoanAmount / 0.94) / 50) * 50;
        //     const fees = increasedLoanAmount - this.state.PlainLoanAmount;
        //     this.setState({ LoanOriginationFees: fees, LoanOrigination: increasedLoanAmount, IncludeFees: false });
        // }
        // else {
            //this.getLenderLogoURLFromConfig();
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
        this.state.TotalPages = filteredVersion[0].questions.breadcrumb.length;
        this.state.QuestionsIds = filteredVersion[0].questions.breadcrumb;
        return filteredVersion;
    }
    GetPagesByVersion(filteredVersion) {
        let pageArray = [];
        if (filteredVersion && filteredVersion.length > 0 && filteredVersion[0].questions.breadcrumb) {
            let pageCount = 1;
            filteredVersion[0].questions.breadcrumb.forEach(element => {
                let customFormFields = this.GetFilteredQuestions(element);
                customFormFields.pageNumber = pageCount;
                let state = this.state.selectedDropdownValue; //this.GetConfigurableData(customFormFields, 0);
                let handleEvent = this.handleDropdownChange.bind(this);
                let showError = this.state.isDropdownFieldValid; //this.GetConfigurableData(customFormFields, 2);
                let showErrorMessage = this.GetConfigurableData(customFormFields, 3);
                let showCodeErrorMessage = this.GetConfigurableData(customFormFields, 4);
                if (customFormFields.type === "dropdown") {
                    let customListItems = customFormFields.options;// customFormFields.listItem === "loanPurposeList1" ? customFormFields.options : this.GetListItems(customFormFields);
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
                        let subState = this.GetConfigurableData(customSubFormFields, 0);
                        let subHandleEvent = this.GetConfigurableData(customSubFormFields, 1);
                        let subShowError = this.GetConfigurableData(customSubFormFields, 2);
                        let subShowErrorMessage = this.GetConfigurableData(customSubFormFields, 3);
                        let subShowCodeErrorMessage = this.GetConfigurableData(customSubFormFields, 4);
                        let subpage = undefined;
                        if (customSubFormFields.type === "dropdown") {
                            let subCustomListItems = customFormFields.options;//this.GetListItems(customSubFormFields);
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
                    });
                }
                pageCount++
            });
        }
        return pageArray;
    }
    GetConfigurableData(customFormFields, itemId) {
        if (customFormFields.name && customFormFields.name.toLowerCase() === "loanpurpose") {
            if (itemId === 0) return this.state.selectedLoanPurpose;
            if (itemId === 1) return this.handleDropdownChange.bind(this);
            if (itemId === 2) return this.state.isLoanPurposeValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "loanamount") {
            if (itemId === 0) return this.state.LoanAmountValue;
            if (itemId === 1) return this.handleLoanAmountChange.bind(this);
            if (itemId === 2) return this.state.isLoanAmountValid;
            if (itemId === 3) return this.state.showLoanAmountError;
            if (itemId === 4) return this.state.showLoanAmountMinError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "address1") {
            if (itemId === 0) return this.state.StreedAddressValue;
            if (itemId === 1) return this.handleStreedAddressChange.bind(this);
            if (itemId === 2) return this.state.isStreedAddressValid;
            if (itemId === 3) return this.state.showStreedAddressError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "address2") {
            if (itemId === 0) return this.state.ApptValue;
            if (itemId === 1) return this.handleApptChange.bind(this);
            if (itemId === 2) return this.state.isApptValid;
            if (itemId === 3) return this.state.showApptError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "city") {
            if (itemId === 0) return this.state.CityValue;
            if (itemId === 1) return this.handleCityChange.bind(this);
            if (itemId === 2) return this.state.isCityValid;
            if (itemId === 3) return this.state.showCityError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "state") {
            if (itemId === 0) return this.state.selectedState;
            if (itemId === 1) return this.handleStateChange.bind(this);
            if (itemId === 2) return this.state.isStateValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "zipcode") {
            if (itemId === 0) return this.state.ZipcodeValue;
            if (itemId === 1) return this.handleZipcodeChange.bind(this);
            if (itemId === 2) return this.state.isZipcodeValid;
            if (itemId === 3) return this.state.showZipcodeError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "housingstatus") {
            if (itemId === 0) return this.state.selectedHousing;
            if (itemId === 1) return this.handleHousingChange.bind(this);
            if (itemId === 2) return this.state.isHousingValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "housingpayment") {
            if (itemId === 0) return this.state.HousingPaymentValue;
            if (itemId === 1) return this.handleHousingPaymentChange.bind(this);
            if (itemId === 2) return this.state.isHousingPaymentValid;
            if (itemId === 3) return this.state.showHousingPaymentError;
            if (itemId === 4) return this.state.showHousingPaymentCodeError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "creditscore") {
            if (itemId === 0) return this.state.selectedEstimatedCreditScore;
            if (itemId === 1) return this.handleEstimatedCreditScoreChange.bind(this);
            if (itemId === 2) return this.state.isEstimatedCreditScoreValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "dateofbirth") {
            if (itemId === 0) return this.state.BirthdateValue;
            if (itemId === 1) return this.handleBirthdateChange.bind(this);
            if (itemId === 2) return this.state.isBirthdateValid;
            if (itemId === 3) return this.state.showBirthdateError;
        } if (customFormFields.name && customFormFields.name.toLowerCase() === "employmentstatus") {
            if (itemId === 0) return this.state.selectedEmployment;
            if (itemId === 1) return this.handleEmploymentChange.bind(this);
            if (itemId === 2) return this.state.isEmploymentValid;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "annualincome") {
            if (itemId === 0) return this.state.AnnualIncomeValue;
            if (itemId === 1) return this.handleAnnualIncomeChange.bind(this);
            if (itemId === 2) return this.state.isAnnualIncomeValid;
            if (itemId === 3) return this.state.showAnnualIncomeError;
            if (itemId === 4) return this.state.showAnnualIncomeMinError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "firstname") {
            if (itemId === 0) return this.state.FirstNameValue;
            if (itemId === 1) return this.handleFirstNameChange.bind(this);
            if (itemId === 2) return this.state.isFirstNameValid;
            if (itemId === 3) return this.state.showFirstNameError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "lastname") {
            if (itemId === 0) return this.state.LastNameValue;
            if (itemId === 1) return this.handleLastNameChange.bind(this);
            if (itemId === 2) return this.state.isLastNameValid;
            if (itemId === 3) return this.state.showLastNameError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "primaryphonenumber") {
            if (itemId === 0) return this.state.PhoneNumberValue;
            if (itemId === 1) return this.handlePhoneNumberChange.bind(this);
            if (itemId === 2) return this.state.isPhoneNumberValid;
            if (itemId === 3) return this.state.showPhoneNumberError;
            if (itemId === 4) return this.state.showPhoneNumberCodeError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "emailaddress") {
            if (itemId === 0) return this.state.EmailValue;
            if (itemId === 1) return this.handleEmailChange.bind(this);
            if (itemId === 2) return this.state.isEmailValid;
            if (itemId === 3) return this.state.showEmailError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "ssn") {
            if (itemId === 0) return this.state.ProvideSSNValue;
            if (itemId === 1) return this.handleProvideSSNChange.bind(this);
            if (itemId === 2) return this.state.isProvideSSNValid;
            if (itemId === 3) return this.state.showProvideSSNError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "homephone") {
            if (itemId === 0) return this.state.HomePhoneValue;
            if (itemId === 1) return this.handleHomePhoneChange.bind(this);
            if (itemId === 2) return this.state.isHomePhoneValid;
            if (itemId === 3) return this.state.showHomePhoneError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "employmentstatus") {
            if (itemId === 0) return this.state.EmploymentStatusValue;
            if (itemId === 1) return this.handleEmploymentStatusChange.bind(this);
            if (itemId === 2) return this.state.isEmploymentStatusValid;
            if (itemId === 3) return this.state.showEmploymentStatusError;
        } else if (customFormFields.name && customFormFields.name.toLowerCase() === "additionalborrower") {
            if (itemId === 0) return this.state.AdditionalBorrowerValue;
            if (itemId === 1) return this.handleAdditionalBorrowerChange.bind(this);
            if (itemId === 2) return this.state.isAdditionalBorrowerValid;
            if (itemId === 3) return this.state.showAdditionalBorrowerError;
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
            OnDropdownClick={this.onDropdownClick.bind(this)}
            GetActiveLabel={this.getDropdownLabel(customFormFields.options)}
            SelectedValue={this.state.selectedFieldValue}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            ShowHideList={this.showHideDropdownList}
            DisplayItem={this.state.displayDropdownItems}
            ListData={customFormFields.options}
            HandleSelectedOption={this.handleDropdownChange.bind(this)}
            formFields={customFormFields}
            showError={this.state.isDropdownFieldValid}
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
            handleChangeEvent={handleEvent}
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
            handleChangeEvent={handleEvent}
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
            HandleSelectedOption={handleEvent}
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
      
    showHideDropdownList(isDisplay) {
        return isDisplay ? displayBlock : displayNone;
    }
	
	onDropdownClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isFieldValid: true });
            //this.setState((prevState) => ({ displayLoanPurposeItems: !prevState.displayLoanPurposeItems }));
        }
    }
    handleDropdownChange(isFocus, event) {
         
        const selectedValue = event.target.value; //event.target.attributes['react-value'].value;
        this.setState({ selectedFieldValue: selectedValue, isDropdownFieldValid: true, isError: false });
        if (this.state.selectedValue === 'Business Funding') {
            this.setState({ showFundingModal: true });
        }
        if (!isFocus) {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusOut`);
            CallGAEvent("LoanPurpose", "FocusOut");
            if (selectedValue === 'Select') { this.setState({ isDropdownFieldValid: false }); } else { this.setState({ isDropdownFieldValid: true }); }
        } else {
            //CallGA(`/breadcrumb/pageNumber${this.state.currentPage}_focusIn`);
            CallGAEvent("LoanPurpose", "FocusIn");
        }
         
    }
    getDropdownLabel(options, key) {
        // const selectedDropdownValue = options.filter((option) => {
        //     return option.key === key || option.label === key;
        // });
        // return selectedDropdownValue.length > 0 ? selectedDropdownValue[0].label : '';
        return null;
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
    BrowserForward(e, updated) {
        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, updated);
        let currentPageState = updated;
        if (currentPageState >= 1 && currentPageState <= this.state.TotalPages && this.ValidateInfo(false)) {
            // if (customFormFields.name === "housingStatus" && (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage')) {
            //     currentPageState = currentPageState + 1;
            // } else if (customFormFields.name === "housingStatus") {
            //     currentPageState = currentPageState + 2;
            // } else {
            //     // if((customFormFields.name === "phonenumber" && this.state.skipPage12) ||
            //     // (customFormFields.name === "annualincome" && this.state.skipPage10)) {
            //     //     currentPageState = currentPageState + 2;
            //     // } else {
            //     currentPageState = currentPageState + 1;
            //     // }
            // }
            //customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
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
            // if (this.props.IsZalea) {
            //     if (customFormFields.name === "loanPurpose" || currentPageState === this.state.TotalPages) {
            //         this.ShowPowerdByPrimeRates("block");
            //     } else {
            //         this.ShowPowerdByPrimeRates("none");
            //     }
            // }
            // if (this.props.IsHeadway) {
            //     if (customFormFields.name === "loanPurpose") {
            //         this.ShowHeadwayMenu("block");
            //     } else {
            //         this.ShowHeadwayMenu("none");
            //     }
            // }
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
                // if (this.props.IsZalea || this.props.IsHeadway) {
                //     window.loadtracking(`/app-page-${currentPageState}`);
                // } else {
                    window.loadtracking(`/los-application/app-page-${currentPageState}`);
                //}
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
            // if (customFormFields.name === "creditScore" && (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage')) {
            //     //this.setState({currentPage : this.state.currentPage - 1});
            //     currentPageState = currentPageState - 1;
            // } else if (customFormFields.name === "creditScore") {
            //     //this.setState({currentPage : this.state.currentPage - 2});
            //     currentPageState = currentPageState - 2;
            // } else {
            //     // if(this.props.IsZalea) {
            //     // if((currentPageState === this.state.TotalPages && this.state.skipPage12) ||
            //     // (customFormFields.name === 11 && this.state.skipPage10)) {
            //     //     currentPageState = currentPageState - 2;
            //     // } else {
            //     //     currentPageState = currentPageState - 1;
            //     // }
            //     // } 
            //     // else {
            //     currentPageState = currentPageState - 1;
            //     // }
            //     // this.setState({currentPage : this.state.currentPage - 1});
            // }
            //customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, currentPageState);
            this.setState({ currentPage: currentPageState });
            // if(currentPageState===13) {
            //     this.PopulateBorrowerInfo();
            // }
            this.CallMatomoPageView(currentPageState);
            if (customFormFields.name === "firstName" || customFormFields.name === "loanAmount") {
                this.setState({ IsContinue: false, PreviousPhone: this.state.PhoneNumberValue });
            }
            if (customFormFields.name === 'SSN') {
                this.setState({ ShowConsent: true });
             } else {
                 this.setState({ ShowConsent: false });
             }
            // if (this.props.IsZalea) {
            //     if (customFormFields.name === "loanPurpose" || currentPageState === this.state.TotalPages) {
            //         this.ShowPowerdByPrimeRates("block");
            //     } else {
            //         this.ShowPowerdByPrimeRates("none");
            //     }
            // }
            // if (this.props.IsHeadway) {
            //     if (customFormFields.name === "loanPurpose") {
            //         this.ShowHeadwayMenu("block");
            //     } else {
            //         this.ShowHeadwayMenu("none");
            //     }
            // }
            if (customFormFields.name === 'address1') {
                setTimeout(() => {
                    this.initAutocomplete();
                }, 1000);
            }
        }
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
        if (this.ValidateInfo(true)) {
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
            //     //if((customFormFields.name === 'additionalBorrower' && this.state.IsAdditionalBorrower.toLocaleLowerCase() !== 'yes')
            //    // || (customFormFields.name === 'ssn' && this.state.IsAdditionalBorrower.toLocaleLowerCase() === 'yes'))
            //     //{
            //     var payload = '';

            //     if (!this.props.IsZalea && !this.props.IsHeadway) {
            //         payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.FirstWordCapital(this.state.FirstNameValue)}&lastname=${this.FirstWordCapital(this.state.LastNameValue)}&agreeemail=${this.state.AgreeEmail}&action=mandrill_complete&nonce=4109b2257c&isZalea=${window.isZalea}`;
            //         SendEmail(this.props.ThemeConfig.emailSendEndpoint, payload);
            //     }

            //     var that = this;
            //     if (window.presubmit !== undefined) window.presubmit();

            //     that.setState({ showModal: true });
            //     let app = this.props.IsZalea ? "Zalea" : this.props.IsHeadway ? 'Acorn Finance' : 'Breadcrumb';
            //     if (window._paq) {
            //         window._paq.push(['setCustomDimension', window.customDimensionId = 3, window.customDimensionValue = that.state.mpUniqueClickID]);
            //         window._paq.push(['setCustomDimension', window.customDimensionId = 8, window.customDimensionValue = that.state.mpUniqueClickID]);
            //         window._paq.push(['setCustomDimension', window.customDimensionId = 11, window.customDimensionValue = that.getEstimatedCreditScoreKey(that.state.selectedEstimatedCreditScore)]);
            //         window._paq.push(['setCustomDimension', window.customDimensionId = 12, window.customDimensionValue = that.state.AnnualIncomeValue]);
            //         window._paq.push(['setCustomDimension', window.customDimensionId = 14, window.customDimensionValue = this.props.IsHeadway ? 'Headway' : this.props.affiliateid ? this.props.affiliateid : null]);
            //         window._paq.push(['setCustomDimension', window.customDimensionId = 19, window.customDimensionValue = app]);
            //         window._paq.push(['trackEvent', 'PLPQ', 'PLPQ App Submit', `${app}`]);
            //     }
            //     var second = 0;
            //     var x = setInterval(function () {
            //         if (second < 1) {

            //             if (!that.state.IsFormSubmitted) {

            //                 if (!((that.state.IsIntercom || that.state.IsIntercomEdit) && that.state.selectedEstimatedCreditScore === '350-619')) {
            //                     document.getElementById('frmPrequalify').submit();
            //                 }
            //                 else {
            //                     window.location.href = that.props.configSettings.intercomRedirectUrl;
            //                 }
            //                 that.setState({ IsFormSubmitted: true });
            //                 window.scrollTo(0, 0);
            //             }
            //         }
            //         second++;
            //         if (second > 5 && second <= 10) {
            //             //that.state.loaderContent = 'We\'re still checking...';
            //             that.setState({ loaderContent: 'We\'re still checking...' });
            //         }
            //         if (second > 10 && second <= 15) {
            //             //that.state.loaderContent = 'Thank you for your patience...';
            //             that.setState({ loaderContent: 'Thank you for your patience...' });
            //         }
            //         if (second > 15) {
            //             //that.state.loaderContent ='Just a few moments longer....';
            //             that.setState({ loaderContent: 'Just a few moments longer....' });
            //             clearInterval(x);
            //         }
            //     }, 1000);
            //     if (window.loadtracking) {
            //         if (this.props.IsZalea) {
            //             window.loadtracking(`/app-zalea-submitted`);
            //         } else if (this.props.IsHeadway) {
            //             window.loadtracking(`/app-headway-submitted`);
            //         } else {
            //             window.loadtracking(`/personal-loans/app-breadcrumb-submitted`);
            //         }
            //     }
            } else {
                //let currentPageState = this.state.currentPage;
                if (customFormFields.name === "housingStatus" && (this.state.selectedHousing === 'RENT' || this.state.selectedHousing === 'OWN_WITH_MORTGAGE' || this.state.selectedHousing === 'Own – with mortgage')) {
                    //this.setState({ currentPage : currentPageState + 1 });
                    currentPageState = currentPageState + 1;
                    //this.state.currentPage = this.state.currentPage + 1;
                } else if (customFormFields.name === "housingStatus") {
                    //this.setState({ currentPage : currentPageState + 2 });
                    currentPageState = currentPageState + 2;
                    //this.state.currentPage = this.state.currentPage + 2;
                } else {
                    // if(this.props.IsZalea) {
                    if((customFormFields.name === "primaryPhoneNumber" && this.state.skipPage12) ||
                    (customFormFields.name === "annualincome" && this.state.skipPage10)) {
                        currentPageState = currentPageState + 2;
                    } else {
                        currentPageState = currentPageState + 1;
                    }
                    // } else {
                    //     currentPageState = currentPageState + 1;
                    // }
                    //this.setState({ currentPage : this.state.currentPage + 1 });
                   // currentPageState = currentPageState + 1;
                }
                customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, currentPageState);
                //customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
                
                this.setState({ currentPage: currentPageState });
                
                if (customFormFields.name === "primaryPhoneNumber" && !this.state.PhoneNumberValue) {
                    this.setState({ IsContinue: true });
                }
                else if (customFormFields.name === "primaryPhoneNumber" && this.state.PhoneNumberValue && this.state.isPhoneNumberValid) {
                    this.setState({ IsContinue: false });
                    //this.state.IsContinue = true;
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
                // if (this.props.IsZalea || this.props.IsHeadway) {
                //     window.history.pushState("", "", `/app-page-${currentPageState}`);
                // } else {
                    window.history.pushState("", "", `/los-application/app-page-${currentPageState}`);
                //}

                if (window.loadtracking) {
                    // if (this.props.IsZalea || this.props.IsHeadway) {
                    //     window.loadtracking(`/app-page-${currentPageState}`);
                    // } else {
                        window.loadtracking(`/los-application/app-page-${currentPageState}`);
                    //}
                }
                // if (this.props.IsZalea) {
                //     if (customFormFields.name === "loanPurpose" || currentPageState === this.state.TotalPages) {
                //         this.ShowPowerdByPrimeRates("block");
                //     } else {
                //         this.ShowPowerdByPrimeRates("none");
                //     }
                // }
                // if (this.props.IsHeadway) {
                //     if (customFormFields.name === "loanPurpose") {
                //         this.ShowHeadwayMenu("block");
                //     } else {
                //         this.ShowHeadwayMenu("none");
                //     }
                // }
                this.CallMatomoPageView(currentPageState);
            }
            
            setTimeout(() => {
                if (customFormFields.name === "address1") {
                    this.initAutocomplete();
                }
            }, 1000);
            //if(this.state.currentPage != 14) {

            //CallGA(`/los-application/app-page-${this.state.currentPage}`);
            //CallGAEvent("page","load",`/los-application/app-page-${this.state.currentPage}`);
            //}
            if (currentPageState === this.state.TotalPages) {

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
        }

    }

    FirstWordCapital(value) {
        return value.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
    }
    ValidateInfo(checkAllFields, event) {
        if (!this.state.initialDisabled) {
            // const filteredQuestions = this.props.versionConfigSettings.questions.filter(question => {
            //     if(question) {
            //         return question.pageNumber === this.state.currentPage;
            //     } 
            //     return filteredQuestions ? filteredQuestions[0] : null;
            // });

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
                    if (this.state.selectedDropdownValue === 'Select') {
                        this.setState({
                            isDropdownFieldValid: false
                        });
                        isValid = false;
                    }
                    if (this.state.selectedDropdownValue === 'Business Funding') {
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
                        //if(loanAmount < constantVariables.loanAmountMin || loanAmount > constantVariables.loanAmountMax) {
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
            } else if (customFormFields.name === "emailAddress") {
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

            // }
            // if (customFormFields.name === 'loanamount' && this.props.IsHeadway) {
            //     var originalLoanAmount = document.getElementById('frmPrequalify').originalLoanAmount;
            //     var loanAmount = document.getElementById('frmPrequalify').updatedLoanAmount;
            //     if (originalLoanAmount !== undefined && loanAmount !== undefined) {
            //         if (document.getElementById('frmPrequalify').originalLoanAmount.checked === false && document.getElementById('frmPrequalify').updatedLoanAmount.checked === false) {
            //             this.setState({ ShowLoanOriginationError: true });
            //             isValid = false;
            //         } else if (document.getElementById('frmPrequalify').updatedLoanAmount.checked) {
            //             //this.state.PlainLoanAmount = this.state.LoanOrigination;
            //             this.setState({ PlainLoanAmount: this.state.LoanOrigination });
            //         }
            //         this.setState({ IncludeFees: loanAmount.checked });
            //     }
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
            var borrowers = `{"address1" :"${this.state.StreedAddressValue}","address2": "${this.state.ApptValue}","city": "${this.state.CityValue}","state": "${this.state.selectedState}","zipCode": "${this.state.ZipcodeValue}","housingStatus": "${this.state.selectedHousing}","housingPayment": "${this.state.PlainHousingPayment}","creditScore": "${this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)}}","dateOfBirth": "${this.state.BirthdateValue}","employmentStatus": "${this.getEmploymentKey(this.state.selectedEmployment)}","annualIncome": "${this.state.PlainAnnualIncome}",
            "firstName": "${this.state.FirstNameValue}", "lastName": "${this.state.LastNameValue}", "primaryPhoneNumber": "${this.state.HomePhoneValue}","emailAddress": "${this.state.EmailValue}","SSN": "${this.state.ProvideSSNValue}","agreePqTerms": "${this.state.AgreePqTerms}","agreeTCPA": "${this.state.AgreeTCPA}","secondaryPhoneNumber": "${this.state.SecondaryPhoneNumberValue}","primaryBorrower": "${this.state.IsAdditionalBorrower}","employmentInformation":[]
            }`;
            this.state.BorrowerInfo.push(borrowers);           
        } else {
            var borrowers = `{"address1" :"${this.state.StreedAddressValue}","address2": "${this.state.ApptValue}","city": "${this.state.CityValue}","state": "${this.state.selectedState}","zipCode": "${this.state.ZipcodeValue}","housingStatus": "${this.state.selectedHousing}","housingPayment": "${this.state.PlainHousingPayment}","creditScore": "${this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)}}","dateOfBirth": "${this.state.BirthdateValue}","employmentStatus": "${this.getEmploymentKey(this.state.selectedEmployment)}","annualIncome": "${this.state.PlainAnnualIncome}",
            "firstName": "${this.state.FirstNameValue}", "lastName": "${this.state.LastNameValue}", "primaryPhoneNumber": "${this.state.HomePhoneValue}","emailAddress": "${this.state.EmailValue}","SSN": "${this.state.ProvideSSNValue}","agreePqTerms": "${this.state.AgreePqTerms}","agreeTCPA": "${this.state.AgreeTCPA}","secondaryPhoneNumber": "${this.state.SecondaryPhoneNumberValue}","primaryBorrower": "${this.state.IsAdditionalBorrower}","employmentInformation":[]
            }`;
            this.state.BorrowerInfo.push(borrowers);
            this.Submit();
        }
    }

    ResetBorrowerInfo(e) {
        this.setState({ StreedAddressValue: '',ApptValue:'',CityValue:'',selectedState:'Select', ZipcodeValue:'',
        selectedHousing:'selsect',PlainHousingPayment:'0', HousingPaymentValue:'',selectedEstimatedCreditScore:'select',BirthdateValue:'',
        selectedEmployment:'Select', PlainAnnualIncome:'',AnnualIncomeValue: '', PhoneNumberValue:'', FirstNameValue: '', LastNameValue:'', HomePhoneValue:'',
        EmailValue:'', ProvideSSNValue:'', AgreePqTerms:true, AgreeTCPA:false, SecondaryPhoneNumberValue:'' ,zipCodeArray: [],
        cityCodeArray: [], stateCodeArray: [],});
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
                                        {/* <input type="hidden" name="uuid" value={uuid} />
                                        <input type="hidden" name="MatchKey" value={uuid} />
                                        <input type="hidden" name="action" value={`${this.props.IsZalea ? 'zalea' : this.props.IsHeadway ? 'Acorn Finance' : 'breadcrumb'} app submit`} />
                                        <input type="hidden" name="gclid" value={this.props.GCLId ? this.props.GCLId : ''} />
                                        <input type="hidden" name="partnerid" value={this.props.PartnerId ? this.props.PartnerId : ''} />
                                        <input type="hidden" name="featured" value={this.props.Featured ? this.props.Featured : ''} />

                                        <input type="hidden" name="os" value={this.props.currentOS ? this.props.currentOS : ''} />
                                        <input type="hidden" name="browser" value={this.props.currentBrowser ? this.props.currentBrowser : ''} />
                                        <input type="hidden" name="devicetype" value={this.props.currentDevice ? this.props.currentDevice : ''} />
                                        <input type="hidden" name="affiliateid" value={this.props.IsHeadway ? 'Headway' : this.props.affiliateid ? this.props.affiliateid : ''} />
                                        <input type="hidden" name="programid" value={this.props.programid ? this.props.programid : ''} />
                                        <input type="hidden" name="campaignid" value={this.props.campaignid ? this.props.campaignid : ''} />

                                        <input type="hidden" name="utm_source" value={this.props.utmSource ? this.props.utmSource : ''} />
                                        <input type="hidden" name="utm_medium" value={this.props.utmMedium ? this.props.utmMedium : ''} />
                                        <input type="hidden" name="utm_term" value={this.props.utmTerm ? this.props.utmTerm : ''} />
                                        <input type="hidden" name="utm_campaign" value={this.props.utmCampaign ? this.props.utmCampaign : ''} />
                                        <input type="hidden" name="utm_content" value={this.props.utmContent ? this.props.utmContent : ''} />
                                        <input type="hidden" name="hsessionid" value={window.hSessionID ? window.hSessionID : ''} />
                                        <input type="hidden" name="logo_type" value="LA" />
                                        <input type="hidden" name="TransactionType" value="Application" />
                                        <input type="hidden" name="borrowers" value={`[${this.state.BorrowerInfo}]`} />
                                        <input type="hidden" name="loanpurpose" value={this.state.selectedLoanPurpose} />
                                        <input type="hidden" name="loanPurpose" value={this.state.selectedLoanPurpose} />
                                        <input type="hidden" name="firstname" value={this.state.FirstNameValue} />
                                        <input type="hidden" name="lastname" value={this.state.LastNameValue} />
                                        <input type="hidden" name="email" value={this.state.EmailValue} />
                                        <input type="hidden" name="phonenumber" value={unMaskPhone(this.state.PhoneNumberValue)} />
                                        <input type="hidden" name="streetaddress" value={this.state.StreedAddressValue} />
                                        <input type="hidden" name="city" value={this.state.CityValue} />
                                        <input type="hidden" name="state" value={this.state.selectedState} />
                                        <input type="hidden" name="zipcode" value={this.state.ZipcodeValue} />
                                        <input type="hidden" name="housingStatus" value={this.state.selectedHousing} />
                                        <input type="hidden" name="housingPayment" value={this.state.PlainHousingPayment} />
                                        <input type="hidden" name="currenttime" value={this.state.selectedTimeAtCurrentAddress} />
                                        <input type="hidden" name="creditscore" value={this.getEstimatedCreditScoreKey(this.state.selectedEstimatedCreditScore)} />
                                        <input type="hidden" name="birthdate" value={this.state.BirthdateValue} />
                                        <input type="hidden" name="ssn" value={this.state.ProvideSSNValue} />
                                        <input type="hidden" name="employmentStatus" value={this.getEmploymentKey(this.state.selectedEmployment)} />
                                        <input type="hidden" name="annualincome" value={this.state.PlainAnnualIncome} />
                                        <input type="hidden" name="pr_clid" value={this.state.mpUniqueClickID} />
                                        <input type="hidden" name="loanAmount" value={this.state.PlainLoanAmount} />
                                        <input type="hidden" name="loanamount" value={this.state.PlainLoanAmount} />
                                        <input type="hidden" name="ipAddress" value={this.state.IPAddress} />
                                        <input type="hidden" name="homePhone" value={this.state.HomePhoneValue} />
                                        <input type="hidden" name="addcoborrower" value={this.getCoborrowerKey(this.state.IsAdditionalBorrower)} /> */}

 
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
                                                        <div className="row">
                                                            <div className={` ${" col-sm-12 col-xs-12"} button-control-align  ${filteredPage.name === 'firstName' || filteredPage.name === 'address1' ? ' center-align ' : ''}`}>
                                                                <button type="submit" id="viewpreqoffers" tabIndex={this.state.currentPage + 1} name="viewpreqoffers" className=" btn bc-primary " disabled={`${!this.state.IsContinue ? '' : 'disabled'}`} >{this.state.buttonText}</button>
                                                            </div></div>
                                                    }
                                                    {this.state.showModal && (this.state.currentPage === this.state.TotalPages || this.state.IsAdditionalBorrower !== "Yes") &&
                                                        <div id="" className={`modal ${this.state.showModal ? 'displayblock' : ''}`}>
                                                            <div className="modal-content">
                                                                <div className={`wrapper loans`}>
                                                                    {/* <div className={`trans-logo `}>
                                                                <img src={this.props.IsZalea ? this.props.configSettings.ZaleaLogo : this.props.configSettings.primeRateLogo} alt="" className={`${this.props.IsZalea ? 'logowidth' : ''}`}/>
                                                            </div> 
                                                            { this.props.IsZalea && 
                                                        <div id="load-1">
                                                            <i className={` ${this.state.load1block ? ' displayblock ' : ' displaynone '} fa ${this.state.load1Change ? ' fa-check ' : ' fa-refresh fa-spin '} `}></i>
                                                            <span>Verifying your information</span>
                                                            </div> }
                                                            { this.props.IsZalea && 
                                                        <div id="load-2">
                                                            <i className={` ${this.state.load2block ? ' displayblock ' : ' displaynone '} fa ${this.state.load2Change ? ' fa-check ' : ' fa-refresh fa-spin '} `}></i>
                                                            <span>Checking your credit</span>
                                                        </div>
                                                            }
                                                             { this.props.IsZalea && 
                                                        <div id="load-3">
                                                            <i className={` ${this.state.load3block ? ' displayblock ' : ' displaynone '} fa ${this.state.load3Change ? ' fa-check ' : ' fa-refresh fa-spin '} `}></i>
                                                            <span>Contacting Lenders</span>
                                                        </div> 
                                                             }
                                                              { this.props.IsZalea && 
                                                        <div className="load-img">
                                                            <div id='marquee' className={` ${this.state.marqueeblock ? ' displayblock ' : ' displaynone '}`}>
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/SoFi.png" alt="SoFi" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/Upgrade.png" alt="Upgrade" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/Payoff.png" alt="Payoff" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/LightStream.png" alt="LightStream" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/Prosper.png" alt="Prosper" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/OMF.png" alt="OneMainFinancial" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/LendingPoint.png" alt="Lending Point" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/FreedomPlus.png" alt="Freedom Plus" />
                                                                <img className="mImage" src="/wp-content/themes/pr-flat-responsive-pro-child/images/Lender_Logo_300x100/BestEgg.png" alt="BestEgg" />
                                                            </div>
                                                        </div>
                                                              } */}
                                                                    <div className="trans-logo">
                                                                    <img src={this.props.configSettings.primeRateLogo} alt={this.props.configSettings.PrimeRateTheme} width= "250px" />
                                                                    </div>
                                                                    <div className="trans-statment" >
                                                                        {/* {this.props.IsZalea ? '' : this.props.IsHeadway ? '' :
                                                                            <img src={this.props.configSettings.lockImage} alt="" />} */}
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
                                                                        {/* <p>We have yet to open for business in your selected state. Please check back later.</p> */}
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
                                                    {/* {this.state.ShowConsent ? */}
                                                    <div className="row">
                                                     
                                                        <div className={" col-md-12 "}>
                                                       
                                                            <div className="checkbox">
                                                                <input name="agreePqTerms" id="agreePqTerms" checked={this.state.AgreePqTerms} tabIndex={this.state.currentPage + 1} value={this.state.AgreePqTerms} className={`checkbox pre-checkbox ${!this.state.AgreePqTerms ? 'has-error' : ''}`} type="checkbox" onChange={this.AgreePqTermsChange.bind(this)} />
                                                               
                                                                        <p className="formlist">I authorize {this.props.configSettings.PrimeRateTheme} and its <a className="loan-app info-tooltip tooltip-width">
                                                                            <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink"><b>{this.props.configSettings.PrimeRateTheme} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818, Accredited Debt Relief'}  </span>
                                                                            partners </a> to obtain consumer reports and related information about me from one or more consumer reporting agencies, such as TransUnion, Experian, or Equifax. I also authorize PrimeRates and its partners to share information about me and to <a className="loan-app info-tooltip tooltip-width-send-email-message-me">
                                                                                <span className="tooltiptext tooltiptext-send-email-message-me tooltip-top-margin-send-email-message-me">I understand and agree that I am authorizing {this.props.IsZalea ? this.props.configSettings.ZaleaTheme : this.props.configSettings.PrimeRateTheme} and its partners to send me special offers and promotions via email.</span>
                                                                                send me email messages </a>. Additionally, I agree to the {this.props.configSettings.PrimeRateTheme} <a href={`${this.props.IsZalea ? 'https://www.Zalea.com/terms-of-use' : '/terms-of-use'}`} target="_blank" rel="noopener noreferrer" className="underline-on-hover">Terms of Use</a>, <a href={`${this.props.IsZalea ? 'https://www.Zalea.com/privacy-policy' : '/privacy-policy'}`} target="_blank" rel="noopener noreferrer" className="underline-on-hover">Privacy Policy</a>, and <a href={`${this.props.IsZalea ? 'https://www.Zalea.com/e-sign' : '/e-sign'}`} target="_blank" className="underline-on-hover">Consent to Electronic Communications</a>. {!this.state.AgreePqTerms && <span className="formerror-agreement  " >Please agree to terms and conditions</span>}</p>
                                                                

                                                            </div>
                                                            
                                                            <div className="checkbox">

                                                                <input id='agreeTCPA' type='hidden' value={this.state.AgreeTCPA} name="agreeTCPA" />
                                                                <input id="checkbox" className="checkbox pre-checkbox" tabIndex={this.state.currentPage + 2} type="checkbox" value={this.state.AgreeTCPA} onChange={this.AagreeTCPAChange.bind(this)} />
                                                                <p className="formlist2">I agree to allow {this.props.configSettings.PrimeRateTheme} and its <a className="loan-app info-tooltip tooltip-width">
                                                                    <span className="tooltiptext tooltiptext-partner tooltip-top-margin-partnerlink-2"><b>{this.props.configSettings.PrimeRateTheme} Personal Loan Partners</b>: {' Best Egg, OneMain, SoFi, Upgrade, Prosper, FreedomPlus, Payoff, LightStream, Marcus, LendingPoint, Dot818, Accredited Debt Relief'}  </span>
                                                                    partners </a> to <a className="loan-app info-tooltip tooltip-width-call-text-me">
                                                                        <span className={`tooltiptext tooltiptext-call-text-me ${'tooltip-top-margin-call-text-me'} `}>I authorize {this.props.configSettings.PrimeRateTheme} and its partner lenders, service providers, affiliates, and successors and assigns, to deliver telemarketing calls and text messages to each telephone number that I provide in connection with my inquiry and application for credit using an automatic telephone dialing system and/or a prerecorded or artificial voice message. I understand I am not required to provide this authorization as a condition of purchasing any property, goods or services. I certify that I have authority to provide this consent either because I am the subscriber of these telephone numbers or I am a non-subscriber customary user who has authority to consent to these communications. If I would like to revoke this consent, I agree to send an email to {'customerservice@primerates.com'} with "Phone Call Opt-Out" in the subject line.  </span>
                                                                        call or text me </a> at the phone numbers I have provided to discuss my application for credit and for other marketing purposes. (optional)</p>

                                                            </div>
                                                            
                                                        </div>
                                                       
                                                    </div>
                                                    {/* //  : ''    
                                                    // } */}
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

export default LOSFullBreadcrumb;