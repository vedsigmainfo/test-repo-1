import React, { Component } from "react";
import { CallGAEvent } from "./Validation/GoogleAnalytics.js";
import BCTextField from "./BCTextField";
import BCSelectField from "./BCSelectField";
import BCButtonField from "./BCButtonField";
import FAButtonField from "./FAButtonField";
import BCSingleButtonField from "./BCSingleButtonField";
import BCFileUploadField from "./BCFileUploadField";
import { SendEmail } from "./EmailFunctions";
import {currencySymbol, validate } from "./Validation/validate";
import axios from "axios";
import { emailRegex, calculateAge,unFormatAmount,unformat,unformatwithoutspace, convertDateFormat,AddDate,MathsCalculator, AmountFormatting, checkValidDate, AmountFormattingInt } from "./Validation/RegexList";
import BCMaskedTextField from "./BCMaskedTextField";
import BCLoginField from "./BCLoginField";
import BCBankLinkField from "./BCBankLinkField";
import BCPinwheelLinkField from "./BCPinwheelLinkField.js";
import BCLabelField from "./BCLabelField";
import BCLabelCalculationField from "./BCLabelCalculationField";
import BCLabelStartField from "./BCLabelStartField";
import BCDocusign from "./BCDocusign";
import BCDocumentListField from "./BCDocumentListField";
import BCVehicleSelectField from "./BCVehicleSelectField";
import BCConsentField from "./BCConsentField";
import BCCaptchaField from "./BCCaptchaField";
import ConfigurableSummaryPage from "./ConfigurableSummaryPage";
import $ from "jquery";
import { formFields } from "./Validation/FormData.js";


var autocomplete;
var componentForm = {
    street_number: 'long_name',
    route: 'long_name',
    locality: 'long_name',
    sublocality_level_1:'long_name',
    postal_town : 'long_name',
    administrative_area_level_1: 'long_name',
    administrative_area_level_2: 'long_name',
    country: 'long_name',
    postal_code: 'short_name',
    intersection: 'long_name'
};
class ConfigurableBreadcrumb extends Component {
    constructor(props) {
        super(props);
        this.BrowserBack = this.BrowserBack.bind(this);
        this.BrowserForward = this.BrowserForward.bind(this);
        /** Declared function to call dynamic in custom validation for external validation*/
        this.validateCityStateZipAjax = this.ValidateCityStateZipAjax.bind(this);
      //  this.handleSelectFileClick=this.handleSelectFileClick.bind(this);
        this.commonValidateAPIAJAX = this.CommonValidationAPIAjax.bind(this);
        this.funcMap = {
            'commonValidateAPIAJAX':this.commonValidateAPIAJAX,
            'validateCityStateZipAjax': this.validateCityStateZipAjax
        };
        this.state = {
            bifurcatedPageArray:this.bifurcatePagesBySubmission(),
            hiddenFieldsArray:[],
            initialiseAutoComplete: true,
            phpErrorMessages: '',
            
            employmentInformation: [],
            loaderMessage: '',
        }
    }
    /** function to filter post data with list items*/
    getFilteredList = (listItem, value) => {
        let list = this.props.configSettings[listItem];
        let that = this;
        
        if(list){
            const filteredList = list.filter(lp => {
                if (that.props[value] && that.props[value] !== undefined) {
                    return (lp.plKey.toLowerCase() === that.props[value].toLowerCase() || lp.key.toLowerCase() === that.props[value].toLowerCase())
                        && that.props[value].length > 0;
                } else if (that.props.PostDataEX && that.props.PostDataEX[value]) {
                    return (lp.plKey.toLowerCase() === that.props.PostDataEX[value].toLowerCase() || lp.key.toLowerCase() === that.props.PostDataEX[value].toLowerCase())
                        && that.props.PostDataEX[value].length > 0;
                } else if(that.props.PostDataEX !== undefined && that.props.PostDataEX.request) {
                   let val = that.getJSONValue(that.props.PostDataEX.request ,value);
                   return val && val !== undefined && (lp.key.toLowerCase() === val.toLowerCase()) && val.length > 0;
                }
                return filteredList;
            });
            return filteredList;
        }
    }
    /** function to get querystring parameters value by passing querystring name */
    getQueryStringValueByName(name) {
        let value = '';
        this.props.QueryStrings.filter(qs => {
            if (name && qs.key === name) {
               value = qs.value;
            }
        });
        return value;
    }
    /** function to initialise dynamic state variales */
    initialiseInitialState() {
        let questionnaire = this.props.filteredVersion[0].questions; 
        let defaultState = this.props.versionConfigSettings.defaultState;
        if(questionnaire && questionnaire.length > 0) {
            questionnaire.forEach(element => {
                let customFormFields = this.GetFilteredQuestions(element);                
                if(customFormFields.type === 'group'){
                    customFormFields.subquestions.forEach(subQuestion => {
                        let subCustomFormFields = this.GetFilteredQuestions(subQuestion);
                        this.intialiseQuestionState(subCustomFormFields);
                    });
                }
                else{
                    this.intialiseQuestionState(customFormFields);
                }    
                            
            });
        }
        if(defaultState && defaultState.length > 0) {
            defaultState.forEach(state => {
                if(state.dataType === "string") {
                    this.state[`${state.name}`] = state.value;
                } else if(state.dataType === "bool") {
                    this.state[`${state.name}`] = state.value === "true" ? true : false;
                } else if(state.dataType === "number") {
                    this.state[`${state.name}`] = state.value && state.value !== '' ? parseInt(state.value) : 0;
                } else if(state.dataType === "array") {
                    this.state[`${state.name}`] = [];
                } else if(state.dataType === "select-array") {
                    this.state[`${state.name}`] = [{"key": state.key, "text": state.value, "label": state.value, "index": 0}];
                } else if(state.dataType === "configSetting") {
                    this.state[`${state.name}`] = this.getJSONValue(this.props.configSettings,state.value);
                }
            });
        }
    }
    /** initialise individual question state */
    intialiseQuestionState = (customFormFields) =>{
        let filteredList = [];
                if(customFormFields.listItem)
                    filteredList = this.getFilteredList(customFormFields.listItem, customFormFields.postData);
                let statePrefix = this.props.configSettings.fieldSettings.prefix;
                let stateSuffix = this.props.configSettings.fieldSettings.suffix;
                //initialize states dynamically based on question name
                this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = '';
                if(customFormFields.checkBoxDisabledStateName)
                    this.state[customFormFields.checkBoxDisabledStateName] = true;
                if(customFormFields.checkBoxStateName)
                    this.state[customFormFields.checkBoxStateName] = true;
                // If Querystring available for this attribute and value exist set State with value
                if(customFormFields.queryString && customFormFields.queryString.accept) {
                    let qParamName = customFormFields.queryString.postName ? customFormFields.queryString.postName : customFormFields.name;
                    let queryStringParam = this.getQueryStringValueByName(qParamName);
                    if(queryStringParam && queryStringParam !== '') {
                        this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = decodeURIComponent(queryStringParam);
                        customFormFields.value = decodeURIComponent(queryStringParam);

                    /** Below code has commented as we dont want now Skip logic of querystring parameter */
                        // if(customFormFields.type === "dropdown") {
                        //     var exist =this.props.configSettings[customFormFields.listItem].filter(item => {
                        //         return item.key.toLowerCase() === customFormFields.value.toLowerCase();
                        //     });
                        //     customFormFields.hasQueryString = exist && exist.length > 0 ? true : false;
                        // }else {
                        //     customFormFields.hasQueryString = this.GetValidateQueryStringPage(customFormFields, this);
                        // }
                    }
                } else {
                    if(this.props.configSettings[customFormFields.listItem]) {
                        if(this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = filteredList.length > 0){
                            this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = filteredList[0].key;
                        } else if(this.props.PostDataEx && this.props.PostDataEx[customFormFields.postData]) {
                            this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = this.props.PostDataEx[customFormFields.postData];
                                customFormFields.valid = true;
                                customFormFields.value = this.props.PostDataEx[customFormFields.postData];
                                this.state[`is${customFormFields.stateName}Valid`] = true;
                                this.state[`show${customFormFields.stateName}Error`] = false;
                        } else {
                            if(customFormFields.defaultSelection){
                                this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = customFormFields.defaultSelection;
                                customFormFields.valid = true;
                                customFormFields.value = customFormFields.defaultSelection;
                                this.state[`is${customFormFields.stateName}Valid`] = true;
                                this.state[`show${customFormFields.stateName}Error`] = false;
                             } else{
                                this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = 'Select';
                            }
                        }
                    } else {
                        let propsData = this.props.PostDataEX && this.props.PostDataEX.request && this.props.PostDataEX.request.borrowers && this.props.PostDataEX.request.borrowers[0];
                        if(this.props[customFormFields.postData] && this.props[customFormFields.postData] !== undefined) {
                            this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = this.props[customFormFields.postData];
                        } else if(propsData && propsData[customFormFields.postData] && propsData[customFormFields.postData] !== undefined) {
                            if(customFormFields.pattern === "date") {
                                let dateValue = convertDateFormat(propsData[customFormFields.postData],"YYYY-MM-DD",customFormFields.placeholder);
                                this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = dateValue;
                            } else {
                                this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = decodeURIComponent(propsData[customFormFields.postData]);
                                customFormFields.valid = true;
                                customFormFields.value = decodeURIComponent(propsData[customFormFields.postData]);
                                this.state[`is${customFormFields.stateName}Valid`] = true;
                                this.state[`show${customFormFields.stateName}Error`] = false;
                            }
                        } else {
                            this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = '';
                        }
                    }
                }
                this.state[`is${customFormFields.stateName}Valid`] = true;
                this.state[`show${customFormFields.stateName}Message`]='';
                this.state[`show${customFormFields.stateName}Error`] = false;
                this.state[`show${customFormFields.stateName}${customFormFields.errorCode}`] = '';
    }
    /** onKeyPress - continue with flow on enter key */
    onKeyPress = (e) => {
        if((e.which === 13 || e.charCode === 13 )&& (e.target.id.toLowerCase().indexOf('address1') < 0) && (e.target.id !=='zipCode') && (e.target.id !=='cbZipCode')) {
            this.Continue(e);
        }
    }
    /** Bifurcates the pages into different sections based on the submitForm attribute */
    bifurcatePagesBySubmission(){
        let pages = this.props.filteredVersion[0].questions;
        let pageArray = {};
        let pageArrayIndex = 0;
        pages.forEach(element => {
            let question = this.GetFilteredQuestions(element);
            if(pageArray[pageArrayIndex] === undefined || pageArray[pageArrayIndex] === null)
                pageArray[pageArrayIndex] = [];
            pageArray[pageArrayIndex].push(element);
            if(question.submitForm)
                pageArrayIndex++;
        });
        return pageArray;
    }    
    componentDidMount() {
        // initialise dynamic state variables
        this.initialiseInitialState();        
        this.setState({formControls:this.props.versionConfigSettings.questions})
        this.getIPAddress();
        this.state.TotalPages = this.props.filteredVersion[0].questions.length;
        this.state.QuestionsIds = this.state.bifurcatedPageArray[window.formSubmissionCount];
        if(window.formSubmissionCount !== 0) {
            this.showLoader();
            let currentPageNumber = this.getPageCount(this.state.bifurcatedPageArray, window.formSubmissionCount);
            
            
            let employmentStatus = '';
            if (window.postDataEngine !== undefined){
                employmentStatus = window.postDataEngine.request.borrowers[0].employmentStatus;
            }

            // if(!(employmentStatus === 'PART_TIME' || employmentStatus === 'FULL_TIME') && window.formSubmissionCount === 1){
            //     currentPageNumber = currentPageNumber + 1;
            // }

            if(!(this.props.configSettings.allowedEmployeInfo.find(elem=>elem==employmentStatus)!=undefined) && window.formSubmissionCount === 1){
                currentPageNumber = currentPageNumber + 1;
            }

            let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, currentPageNumber);
            if(customFormFields.name === 'login' || customFormFields.name === 'user-login') {
                if(window.isExistingUser === 'true') {
                    currentPageNumber = currentPageNumber + 1;
                }else if(window.isRegisteredUser === 'true') {
                    currentPageNumber = currentPageNumber + 1;
                }
               
                customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, currentPageNumber);
               let autoCompleteQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === currentPageNumber && x.isAddressGroup === true && x.autoComplete === true);
               let groupQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === currentPageNumber && x.isAddressGroup === true);
               setTimeout(() => {
                   if(autoCompleteQuestion && autoCompleteQuestion.length > 0 && groupQuestion && groupQuestion.length > 0){
                       this.initAutocomplete(autoCompleteQuestion[0], groupQuestion);
                    }
                }, 1000);
                
            }
            
            window.history.pushState("", "", `${this.props.configSettings.formSettings.urlPath}${currentPageNumber}`);
            this.getTitle(currentPageNumber);
            this.setState({ currentPage : currentPageNumber});
            this.hideLoader();
        }
        if (window.formSubmissionCount === 6) {
            const currentPageNumber = this.getPageCount(
              this.state.bifurcatedPageArray,
              window.formSubmissionCount
            );
            const { questions } = this.props.versionConfigSettings;
            const customFormFields = this.GetFilteredData(questions, currentPageNumber);
          
            const handleSubQuestion = (subQuestion) => {
              let subCustomFormFields = this.GetFilteredQuestions(subQuestion);
              this.intialiseQuestionState(subCustomFormFields);
          
              switch (window.bankPayStatus) {
                case "Bank Statement":
                  if (subQuestion === 1111) {
                    subCustomFormFields.titlebold = 'Account Ownership';
                  } else if (subQuestion === 176) {
                    subCustomFormFields.description2 = 'Please Provide the following documents to verify your bank account ownership: Bank Statements showing your name and account number.';
                  } else if (subQuestion === 177) {
                    subCustomFormFields.type = "";
                  }
                  break;
          
                case "Paystubs":
                  if (subQuestion === 1111) {
                    subCustomFormFields.titlebold = 'Proof of Income';
                  } else if (subQuestion === 176) {
                    subCustomFormFields.description2 = 'Please provide the following documents to verify your income: Most Recent Paystub (Less than 30 days old).';
                  } else if (subQuestion === 177) {
                    subCustomFormFields.type = "";
                  }
                  break;
          
                case "Both":
                  if (subQuestion === 1111) {
                    subCustomFormFields.titlebold = 'Proof of Income and Account Ownership';
                  } else if (subQuestion === 176) {
                    subCustomFormFields.description2 = 'Please provide the following documents to verify your income and bank account ownership: Most recent paystub (less than 30 days old) Bank statements showing your name and account number.';
                  }
                  break;
              }
            };
          
            if (customFormFields.type === 'group') {
              customFormFields.subquestions.forEach(handleSubQuestion);
            } else {
              this.intialiseQuestionState(customFormFields);
            }
          }
          
        
        this.getLenderLogoURLFromConfig();
        window.curentstate = this;

        window.onpopstate = function (event) {
            let current = window.curentstate.state.currentPage;
            let updated = 0;
            let pageNo = window.location.pathname.replace(`${window.curentstate.props.configSettings.formSettings.urlPath}`, '');

            updated = parseInt(pageNo, 10);
            if (current > updated) {
                window.curentstate.BrowserBack(event, updated);
            } else {
                window.curentstate.BrowserForward(event, updated);
            }
        }
        
        if (this.props.configSettings.formSettings.productType === "creditCards" && this.props.PostDataEX && this.props.PostDataEX.request &&
        this.props.PostDataEX.request.borrowers.length > 1) {
        this.state.AdditionalBorrowerValue = 'Yes';
        }
        
        window.parent.scrollTo(0, 0);  
    }
    /**Below method is for Skip if querystring value available to validate */
    GetValidateQueryStringPage(customFormFields, e)
    {
        let qaValid = false;
        customFormFields.touched = true;
        customFormFields.valid =true;
        if(customFormFields.isEmploymentInformation){
            let employmentQuestions = this.props.versionConfigSettings.questions.filter(x=>x.isEmploymentInformation === true);
            this.state.employmentInformation= this.GetEmploymentInfo(employmentQuestions);
        }
        let validFlag = false;
        let  showErrorValidation =  this.showErrorValidationOnGroup(customFormFields.pageNumber);
      
        if(showErrorValidation)
        {
            validFlag =this.GroupQuestionValidation(customFormFields.pageNumber);
        }
        let  customValidation=true;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        if(customFormFields.parentId == undefined && e  ) 
        {
            customValidation=this.handleCustomValidation(false,e !== undefined ? e.currentTarget : this.state[`${statePrefix}${customFormFields.StateName}${stateSuffix}`],customFormFields.customValidation,customFormFields,customFormFields.value, customFormFields.hasQueryString ? customFormFields.value : '');
        }
        else 
        {
            let tempgroupQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === customFormFields.pageNumber && x.type !== 'group');
            let isTempValid = true;
            let errorCount =0;
            let that = this;
            tempgroupQuestion.forEach(element => {
                if(element.customValidation )
                {
                    isTempValid=that.handleCustomValidation(false,e !== undefined ? e.currentTarget : this.state[`${statePrefix}${element.StateName}${stateSuffix}`],element.customValidation,element,element.value, customFormFields.hasQueryString ? customFormFields.value : '');          
                    if(!isTempValid) errorCount++;
                }
                else
                {
                    this.state[`show${element.stateName}Error`]=false;
                    this.state[`is${element.stateName}Valid`]=true;
                }
            });
            validFlag = errorCount === 0 ? true : false;
        }
        let rulesValidation = true;
        if(customFormFields.stateName) {
            rulesValidation = this.handleDynamicRules(customFormFields.stateName, customFormFields);
        }
        if (validFlag && customValidation && showErrorValidation && rulesValidation) {
            let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
            let statePrefix = this.props.configSettings.fieldSettings.prefix;
            let stateSuffix = this.props.configSettings.fieldSettings.suffix;
            if(customFormFields.arrayValue && customFormFields.arrayValue !== '') {
                this.state[`${statePrefix}${customFormFields.arrayValue}${stateSuffix}`].push(customFormFields.value);
            }
            if(customFormFields.loaderMessage){
                this.state.loaderMessage = customFormFields.loaderMessage;
            } else {this.state.loaderMessage = ''; }
            if(customFormFields.payloadkey)
            {
                let action = customFormFields.action;
                var payloadarr =customFormFields.payloadkey; ;
                var payloadstr = '';
                if(customFormFields.type === 'file-upload'){
                    var fd = new FormData();
                    for (let cvalidation in payloadarr) {
                        var value =  this.state[`${statePrefix}${this.GetPascalCase(payloadarr[cvalidation])}${stateSuffix}`];
                        if(value=='undefined' || value==undefined)
                        {
                            value = payloadarr[cvalidation];
                        }    
                        fd.append(cvalidation,value);
                    }                    
                    return this.handlePHPMethod(this,action,fd, customFormFields);
                }
                else{
                    for (let cvalidation in payloadarr) {
                        var value =  this.state[`${statePrefix}${this.GetPascalCase(payloadarr[cvalidation])}${stateSuffix}`];
                        if(value=='undefined' || value==undefined)
                        {
                            value = payloadarr[cvalidation];
                        }
                        payloadstr = payloadstr + cvalidation + '=' + value + '&';
                    }
                    payloadstr= payloadstr.substring(0,payloadstr.length-1);
                    return this.handlePHPMethod(this,action,payloadstr, customFormFields)
                }
                qaValid= true;
            }
            else {
                qaValid= true;
            }
        }
        return qaValid;
    }
    /** this method will accespt questions and it will verify to accept querystring param and if exist return value for that param */
    getQueryStringParamValue(customFormFields) {
        let queryParamValue ='';
        if(customFormFields.queryString && customFormFields.queryString.skip && customFormFields.queryString.accept) {
            let qParamName = customFormFields.queryString.postName ? customFormFields.queryString.postName : customFormFields.name;
            queryParamValue = this.getQueryStringValueByName(qParamName);
        }
        return queryParamValue;
    }
    /** this method will take current page and find next page if querysting param valid value exist */
    GetQueryStringNextPage(currentPage) {
        let queryStringPages = this.props.versionConfigSettings.questions.filter(element => element.hasQueryString && element.pageNumber > currentPage);
        queryStringPages.sort((a,b)=> {
            return a.pageNumber - b.pageNumber;
        });
        queryStringPages.forEach((item) => {
            if(item.pageNumber - currentPage > 1) {
                currentPage = item.pageNumber - 1;
                return currentPage + 1;
            }
        });
        return currentPage + 1;
    }
    removeFile(e) {
		var file = $(this).data("file");
		
		$(this).parent().remove();
	}
    componentDidUpdate(){
        
        if(this.props.configSettings.formSettings.resetFormSubmissionPageArray){
            let currentPageNumber=window.location.pathname;
            let matches = parseInt(currentPageNumber.match(/\d+/g).join(""));
        }
        if(window.formSubmissionCount !== 0 && this.state.initialiseAutoComplete) {
            this.state.initialiseAutoComplete = false;
            let questions = this.state.bifurcatedPageArray[window.formSubmissionCount];
            let pageOne = null;
            let addressQuestions = [];
            let autoCompleteQuestion = [];
            if(questions && questions.length > 0)
                pageOne = questions[0];

            let employmentStatus = '';
            if (window.postDataEngine !== undefined){
                employmentStatus = window.postDataEngine.request.borrowers[0].employmentStatus;
            }
            if(!(this.props.configSettings.allowedEmployeInfo.find(elem=>elem==employmentStatus)!=undefined)){
                pageOne = questions[0];
            }

            // if(customFormFields.name==='login' && 
            // (this.props.configSettings.allowedEmployeInfo !==undefined) && 
            // (this.props.configSettings.allowedEmployeInfo.find(elem=>elem==this.props[`${statePrefix}${customFormFields.employmentStateName}${stateSuffix}`])==undefined))
            // {
            //    pageOne = questions[0];
            // }

            if(pageOne !== null){
                let customFormFields = this.GetFilteredQuestions(pageOne);
                if(customFormFields.type === 'group'){
                    customFormFields.subquestions.forEach(element => {
                        let subField = this.GetFilteredQuestions(element);
                        if(subField.autoComplete === true)
                            autoCompleteQuestion.push(subField);
                        if(subField.isAddressGroup === true)
                            addressQuestions.push(subField);
                    });
                }
                else{
                    addressQuestions = questions.filter(x=>x.isAddressGroup === true);
                    autoCompleteQuestion = questions.filter(x=>x.isAddressGroup === true && x.autoComplete === true);
                }
                
            }
            if(autoCompleteQuestion && autoCompleteQuestion.length > 0 && addressQuestions && addressQuestions.length > 0)
                this.initAutocomplete(autoCompleteQuestion[0], addressQuestions);
           
        }
    }
    /** Get question's list from bifurcated array based on the form submission count */
    GetQuestionList(filteredVersion, formSubmissionCount) {
        if(filteredVersion){
            if(filteredVersion[formSubmissionCount])
                return filteredVersion[formSubmissionCount];
        }
    }
    /** Returns the pascal case for a given string */
    GetPascalCase(str) {
        str = str.replace(/(\w)(\w*)/g,
            function(g0,g1,g2){ return g1.toUpperCase() + g2;});
        return str;
    }
    /** Returns the page count for a question based on form submission count */
    getPageCount(filteredVersion, formSubmissionCount){
        if(formSubmissionCount === 0)
            return 1;
        else{
            let pageCount = 1;
            for(var i=0;i<formSubmissionCount;i++){
                pageCount = pageCount + filteredVersion[i].length;
            }
            return pageCount;
        }
    }
    /** Returns the pages based on the selected version */
    GetPagesByVersion(filteredVersion) {
        let pageArray = [];
        let questions = this.GetQuestionList(filteredVersion, window.formSubmissionCount);

        if (questions && questions.length > 0 ) {
            let pageCount = this.getPageCount(filteredVersion, window.formSubmissionCount);
           
            questions.forEach(element => {
                let customFormFields = this.GetFilteredQuestions(element);
                customFormFields.pageNumber = pageCount;
                let statePrefix = this.props.configSettings.fieldSettings.prefix;
                let stateSuffix = this.props.configSettings.fieldSettings.suffix;
                let state = this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`];
                let showError = this.state[`is${customFormFields.stateName}Valid`];
                let showErrorMessage = this.state[`show${customFormFields.stateName}Error`];
                let showCodeErrorMessage = this.state[`show${customFormFields.stateName}${customFormFields.errorCode}`];
                let customMessage = this.state[`show${customFormFields.stateName}Message`];
                let isDisabled = this.state[customFormFields.checkBoxDisabledStateName];
                let checkboxValue = this.state[customFormFields.checkBoxStateName];
                let customListItems = this.state[customFormFields.listItem];
                if(customFormFields.isContinue && customFormFields.isContinue == false)
                {
                    this.setState({ IsContinue: false });
                }
                // push the pages in array based on the question type
                if (customFormFields.type === "dropdown") {
                    customListItems = this.GetListItems(customFormFields);
                    let page = this.GetDropdownPage(customListItems, customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, customFormFields.name);
                    pageArray.push(page);
                }else if (customFormFields.type === "vehicle-dropdown") {
                    if(customFormFields.multiControlAction && customFormFields.multiControlAction.currentControl) {
                        if(customFormFields.multiControlAction.currentControl.vehicleType === "Year") {
                            this.state[customFormFields.listItem] = this.GetYears(customFormFields.numberOfYears, customFormFields.multiControlAction.currentControl.vehicleType);
                        }
                    }                    
                    let page = this.GetVehicleDropdownPage(customListItems, customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, customFormFields.name);
                    pageArray.push(page);
                }
                 else if (customFormFields.type === "text" || customFormFields.type === "text-to-arry") {
                    let page = this.GetTextPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customMessage, customFormFields.name);
                    pageArray.push(page);
                } else if (customFormFields.type === "button") {
                    customListItems = this.GetListItems(customFormFields);
                    let page = this.GetButtonPage(customListItems, customFormFields, state, showError, showErrorMessage, customFormFields.name);
                    pageArray.push(page);
                }else if (customFormFields.type === "fa-button") {
                    customListItems = this.GetListItems(customFormFields);
                    let page = this.GetFAButtonPage(customListItems, customFormFields, state, showError, showErrorMessage, customFormFields.name);
                    pageArray.push(page);
                } else if (customFormFields.type === "singlebutton") {

                    let page = this.GetSingleButtonPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, customFormFields.name);
                    pageArray.push(page);
                }
                else if (customFormFields.type === "masked-text") {
                    let page = this.GetMaskedTextPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customMessage, customFormFields.name, isDisabled, checkboxValue);
                    pageArray.push(page);
                }
                else if (customFormFields.type === "file-upload") {
                    let subSubPage = this.GetFileUploadPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, customFormFields.name);
                    pageArray.push(subSubPage);
                }
                else if (customFormFields.type === "summary") {
                    let page = this.GetSummaryPage(customFormFields);
                    pageArray.push(page);
                } 
                else if (customFormFields.type === "bank-link") {
                    let page = this.GetBankLinkPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, customFormFields.name);
                    pageArray.push(page);
                }
                else if (customFormFields.type === "pinwheel-link") {
                    let page = this.GetPinwheelLinkPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, customFormFields.name);
                    pageArray.push(page);
                } 
                else if (customFormFields.type === "docusign") {
                    let page = this.GetDocusignPage(customFormFields, customFormFields.name);
                    pageArray.push(page);
                } 
                else if (customFormFields.type === "label") {
                    let page = this.GetLabelField(customFormFields, customFormFields.name, state);
                    pageArray.push(page);
                }
                else if (customFormFields.type === "label-start") {
                    let page = this.GetStartPage(customFormFields, customFormFields.name);
                    pageArray.push(page);
                }
                else if (customFormFields.type === "calculation-desc") {
                    let page = this.GetCalculationDescField(customFormFields, customFormFields.name, showError, showErrorMessage, showCodeErrorMessage, customMessage);
                    pageArray.push(page);
                } 
                else if (customFormFields.type === "documentlist") {
                    customListItems = this.GetListItems(customFormFields);
                    let page = this.GetDocumentListPage(customFormFields,customListItems);
                    pageArray.push(page);
                }
                else if (customFormFields.type === "consent" ) {
                    
                    this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = customFormFields.defaultChecked;
                    customFormFields.value = customFormFields.defaultChecked;
                    customFormFields.valid = customFormFields.defaultChecked;
                    let page = this.GetConsentPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customMessage, customFormFields.name);
                    pageArray.push(page);
                }  else if (customFormFields.type === "captcha" ) {
                    let page = this.GetCaptchaPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customMessage, customFormFields.name);
                    pageArray.push(page);
                }
                else if (customFormFields.type === "login") {
                    var array=[];
                     if(customFormFields.customValidation)
                     {
                      array= this.GetCustomValidation(customFormFields.customValidation);
                     }
                     let page = this.GetLoginPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,array);
                     pageArray.push(page);
                 }
                else if (customFormFields.type === 'group') {
                    customFormFields.subquestions.forEach(subelement => {
                        let customSubFormFields = this.GetFilteredQuestions(subelement);
                        customSubFormFields.pageNumber = pageCount;
                        customSubFormFields.parentId = customFormFields.id;
                        if(customSubFormFields.isContinue && customSubFormFields.isContinue == false)
                        {
                            this.setState({ IsContinue: false });
                        }
                        let subStatePrefix = this.props.configSettings.fieldSettings.prefix;
                        let subStateSuffix = this.props.configSettings.fieldSettings.suffix;
                        let subState = this.state[`${subStatePrefix}${customSubFormFields.stateName}${subStateSuffix}`];
                        let subShowError = this.state[`is${customSubFormFields.stateName}Valid`];
                        let subShowErrorMessage = this.state[`show${customSubFormFields.stateName}Error`];
                        let subShowCodeErrorMessage = this.state[`show${customSubFormFields.stateName}${customSubFormFields.errorCode}`];
                        let subCustomMassage = this.state[`show${customSubFormFields.stateName}Message`];
                        let isSubDisabled = this.state[customSubFormFields.checkBoxDisabledStateName];
                        let subCheckboxValue = this.state[customSubFormFields.checkBoxStateName];
                        let subCustomListItems = this.state[customSubFormFields.listItem];

                        let subpage = undefined;
                        if (customSubFormFields.type === "dropdown") {
                            subCustomListItems = this.GetListItems(customSubFormFields);
                            subpage = this.GetDropdownPage(subCustomListItems, customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage, customFormFields.name);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "vehicle-dropdown") {
                            if(customSubFormFields.multiControlAction && customSubFormFields.multiControlAction.currentControl) {
                                if(customSubFormFields.multiControlAction.currentControl.vehicleType === "Year") {
                                    this.state[customSubFormFields.listItem] = this.GetYears(customSubFormFields, customSubFormFields.multiControlAction.currentControl.vehicleType);
                                }
                            }
                            subpage = this.GetVehicleDropdownPage(subCustomListItems, customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage, customFormFields.name);
                            pageArray.push(subpage);
                        }
                         else if (customSubFormFields.type === "text") {
                            subpage = this.GetTextPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage,subCustomMassage, customFormFields.name);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "button") {
                            subCustomListItems = this.GetListItems(customSubFormFields);
                            subpage = this.GetButtonPage(subCustomListItems, customSubFormFields, subState, subShowError, subShowErrorMessage, customFormFields.name);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "fa-button") {
                            subCustomListItems = this.GetListItems(customSubFormFields);
                            subpage = this.GetFAButtonPage(subCustomListItems, customSubFormFields, subState, subShowError, subShowErrorMessage, customFormFields.name);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "singlebutton") {
                            let page = this.GetSingleButtonPage(customSubFormFields, state, showError, showErrorMessage, showCodeErrorMessage, customFormFields.name);
                            pageArray.push(page);
                        }   else if (customSubFormFields.type === "masked-text") {
                            if(customSubFormFields.isDefaultDate&&customSubFormFields.isDefaultDate!==undefined){
                                let valuePattern = customSubFormFields.valuePattern && customSubFormFields.valuePattern ? customSubFormFields.valuePattern : customSubFormFields.placeholder;
                                let dateToCalculate=new Date();
                                const calculateYear = dateToCalculate.getFullYear();
                                const calculateMonth = ('0' + (dateToCalculate.getMonth()+1)).slice(-2);
                                const calculateDay = ('0' + dateToCalculate.getDate()).slice(-2);
                                const currentDate=`${calculateMonth}/${calculateDay}/${calculateYear}`; 
                                let date = convertDateFormat(currentDate,valuePattern,"MM/DD/YYYY");
                                this.state.subState=date;
                                customSubFormFields.value=date;
                            }
                            subpage = this.GetMaskedTextPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage,subCustomMassage, customFormFields.name, isSubDisabled, subCheckboxValue);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "summary") {
                            let subpage = this.GetSummaryPage(customSubFormFields);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "file-upload") {
                            let subpage = this.GetFileUploadPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage, customFormFields.name);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "bank-link") {
                            let subpage = this.GetBankLinkPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage, customFormFields.name);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "pinwheel-link") {
                            let subpage = this.GetPinwheelLinkPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage, customFormFields.name);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "docusign") {
                            let subpage = this.GetDocusignPage(customSubFormFields, customSubFormFields.name);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "label") {
                            let subpage = this.GetLabelField(customSubFormFields, customSubFormFields.name, subState);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "label-start") {
                            let subpage = this.GetStartPage(customSubFormFields,  customSubFormFields.name);
                            pageArray.push(subpage);
                        }
                         else if (customSubFormFields.type === "calculation-desc") {
                            let subpage = this.GetCalculationDescField(customSubFormFields, customSubFormFields.name, subShowError, subShowErrorMessage, subShowCodeErrorMessage, subCustomMassage);
                            pageArray.push(subpage);
                        } 
                        else if (customSubFormFields.type === "login") {
                           var array=[];
                            if(customSubFormFields.customValidation)
                            {
                             array= this.GetCustomValidation(customSubFormFields.customValidation);
                            }
                            subpage = this.GetLoginPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage,array);
                            pageArray.push(subpage);
                        }
                        else if (customSubFormFields.type === "documentlist") {
                           // subCustomListItems = this.GetListItems(customSubFormFields);
                            let subSubPage = this.GetDocumentListPage(customSubFormFields);
                            pageArray.push(subSubPage);
                        }
                        else if (customSubFormFields.type === "consent") {
                            // this.state[`${subStatePrefix}${customSubFormFields.stateName}${subStateSuffix}`] = customSubFormFields.defaultChecked;
                            // customSubFormFields.value = this.state[`${subStatePrefix}${customSubFormFields.stateName}${subStateSuffix}`]
                            customSubFormFields.valid = true  
                            subpage = this.GetConsentPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage,subCustomMassage, customFormFields.name);
                            pageArray.push(subpage);
                        } else if (customSubFormFields.type === "captcha") {
                            subpage = this.GetCaptchaPage(customSubFormFields, subState, subShowError, subShowErrorMessage, subShowCodeErrorMessage,subCustomMassage, customFormFields.name);
                            pageArray.push(subpage);
                        }
                    });
                }
                pageCount++
            });
        }
        this.state.Pages = pageArray;
        return pageArray;
    }
    GetYears(customSubFormFields, fieldName){
        let list = [];
        let val = `Select ${fieldName}`;
        let combinedList = [{"key" : "Select", "text": val, "label": val, "tabIndex": 0 }];
        var d = new Date();
        var year = d.getFullYear();
        for(var i=0; i < customSubFormFields.numberOfYears; i++) {
            let node= {"key": year, "text":year , "label":year, "tabIndex":i};
            list.push(node);
            year--;
        }
        combinedList.push(...list);
        return combinedList;
    }
    /** Returns the page number by page name */
    GetPageNumberbyName(name) {
        var pagenumber = this.state.Pages.filter(page => {
             if(page.props.parentName === name) {
                 return page.props.formFields.pageNumber;
             } else return null;
         });
         return pagenumber && pagenumber.length > 0 ? pagenumber[0].props.formFields.pageNumber : 0;
     }
     GetPageNumberbyNameOnly(name) {
        var pagenumber = this.state.Pages.filter(page => {
             if(page.props.name === name ||  page.props.formFields.name == name) {
                 return page.props.formFields.pageNumber;
             } else return null;
         });
         return pagenumber && pagenumber.length > 0 ? pagenumber[0].props.formFields.pageNumber : 0;
     }
     GetAllPagesbyName(pageNumber) {
        var pages = this.state.Pages.filter(page => {
             if(page.props.formFields.pageNumber === pageNumber) {
                 return page;
             } else return null;
         });
         return pages;
     }

    /** Custom validation  -It's call only when first time call Component to display predefine message in Login/Registration page. */
    GetCustomValidation(customValidation)
    {
        let eventValue = '';
        let arr = [];
        let isValid = true;
        arr=[];
        for (let cvalidation in customValidation) {
            switch (cvalidation) {
                case 'characters':
                    if(eventValue.length > customValidation[cvalidation].value)
                    {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                        isValid=true;
                    }
                    else
                    {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                        isValid=false;
                    }
                break;

                case 'lowercase letter':
                    if(eventValue.match(customValidation[cvalidation].rules)) {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                        isValid=true;
                     } else {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                        isValid=false;
                    }
                    break;
                case 'number':
                    if(eventValue.match(customValidation[cvalidation].rules)) {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                        isValid=true;
                    } else {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                        isValid=false;
                    }
                    break;
                case 'uppercase letter':
                    if(eventValue.match(customValidation[cvalidation].rules)) {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                        isValid=true;
                    } else {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                        isValid=false;
                    }
                    break;
                case 'special character':
                    if(eventValue.match(customValidation[cvalidation].rules)) {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                        isValid=true;
                    } else {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                        isValid=false;
                    }
                    break;
                default: isValid = true;
            }
          }
        return arr;
    }
    /** gets called on successful plaid login, sets the docusign url returned in state variables for further use */
    LoadOnPlaidSuccess = (docusignUrl) => {
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        this.state[`${statePrefix}docusignUrl${stateSuffix}`] = docusignUrl;
       // if(window.formSubmissionCount!==4){
            this.Continue();
       // }
        
    }
    /** Returns the Dropdown control for a question */
    GetDropdownPage(customListItems, customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, parentName) {
        return <BCSelectField
            css={this.props.configSettings.css}
            type={customFormFields.type}
            SelectedValue={state}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            ShowHideList={this.showHideLoanPurposeList}
            DisplayItem={this.state.displayLoanPurposeItems}
            ListData={customListItems}
            HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialDisabled}
            showTitle={customFormFields.showTitle}
            AutoFocus={customFormFields.focus}
            tabIndex={customFormFields.pageNumber}
            columnStyle={customFormFields.columnStyle}
            parentName={parentName}
            name={customFormFields.name} key={`${customFormFields.name}-${customListItems.length}`}/>;
    }
    /** Returns the Dropdown control for a question */
    GetVehicleDropdownPage(customListItems, customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, parentName) {
        return <BCVehicleSelectField
            css={this.props.configSettings.css}
            type={customFormFields.type}
            SelectedValue={state}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            ShowHideList={this.showHideLoanPurposeList}
            DisplayItem={this.state.displayLoanPurposeItems}
            ListData={customListItems}
            HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialDisabled}
            showTitle={customFormFields.showTitle}
            AutoFocus={customFormFields.focus}
            tabIndex={customFormFields.pageNumber}
            columnStyle={customFormFields.columnStyle}
            parentName={parentName}
            name={customFormFields.name} key={`${customFormFields.name}`}
            vehicleData={this.props.vehicleData}
            />;
    }
    /** Returns the text control for a question */
    GetTextPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customMessage, parentName) {
        return <BCTextField formFields={customFormFields}
            value={state}
            type={customFormFields.type}
            css={this.props.configSettings.css}
            showError={showError}
            showErrorMessage={showErrorMessage}
            HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? false : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber}
            inputType={customFormFields.inputType !== undefined && customFormFields.inputType !== null ? customFormFields.inputType  : "text"} showWrapErrorMessage={false}
            isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice}
            name={customFormFields.name}
            currentBrowser={this.props.currentBrowser}
            customMessage={customMessage}
            showTitle={customFormFields.showTitle}
            maxLength={customFormFields.maxLength ? parseInt(customFormFields.maxLength) : null}
            max={customFormFields.max ? parseInt(customFormFields.max) : null}
            isDisplay= {this.state[`isDisplay${customFormFields.stateName}`]}
            columnStyle={customFormFields.columnStyle !== undefined
                 && customFormFields.columnStyle !== null ? customFormFields.columnStyle:''}
            key={customFormFields.name} parentName={parentName}
            showToolTip={customFormFields.showToolTip}
            configSettings={this.props.configSettings}
            onKeyDown={this.onKeyPress.bind(this)}
            />;
    }
    /** Returns the text control for a question */
    GetConsentPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customMessage, parentName) {
        return <BCConsentField formFields={customFormFields}
            value={state}
            type={customFormFields.type}
            css={this.props.configSettings.css}
            showError={showError}
            showErrorMessage={showErrorMessage}
            HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? false : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber}
            inputType={customFormFields.inputType !== undefined && customFormFields.inputType !== null ? customFormFields.inputType  : "text"} showWrapErrorMessage={false}
            isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice}
            name={customFormFields.name}
            currentBrowser={this.props.currentBrowser}
            customMessage={customMessage}
            showTitle={customFormFields.showTitle}
            maxLength={customFormFields.maxLength ? parseInt(customFormFields.maxLength) : null}
            max={customFormFields.max ? parseInt(customFormFields.max) : null}
            isDisplay= {this.state[`isDisplay${customFormFields.stateName}`]}
            columnStyle={customFormFields.columnStyle !== undefined
                 && customFormFields.columnStyle !== null ? customFormFields.columnStyle:''}
            key={customFormFields.name} parentName={parentName}
            showToolTip={customFormFields.showToolTip}
            configSettings={this.props.configSettings}
            ShowConsent={ this.state.ShowConsent}
            buttonText={this.state.buttonText}
            onKeyDown={this.onKeyPress.bind(this)}
            />;
    }
    /** Returns the text control for a question */
    GetCaptchaPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customMessage, parentName) {
        return <BCCaptchaField formFields={customFormFields}
            value={state}
            type={customFormFields.type}
            css={this.props.configSettings.css}
            showError={showError}
            showErrorMessage={showErrorMessage}
            HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? false : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber}
            inputType={customFormFields.inputType !== undefined && customFormFields.inputType !== null ? customFormFields.inputType  : "text"} showWrapErrorMessage={false}
            isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice}
            name={customFormFields.name}
            currentBrowser={this.props.currentBrowser}
            customMessage={customMessage}
            showTitle={customFormFields.showTitle}
            maxLength={customFormFields.maxLength ? parseInt(customFormFields.maxLength) : null}
            max={customFormFields.max ? parseInt(customFormFields.max) : null}
            isDisplay= {this.state[`isDisplay${customFormFields.stateName}`]}
            columnStyle={customFormFields.columnStyle !== undefined
                 && customFormFields.columnStyle !== null ? customFormFields.columnStyle:''}
            key={customFormFields.name} parentName={parentName}
            showToolTip={customFormFields.showToolTip}
            configSettings={this.props.configSettings}
            onKeyDown={this.onKeyPress.bind(this)}
            />;
    }

    /** Returns the masked text control for a question */
    GetMaskedTextPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customeMessage, parentName, isDisabled, checkboxValue) {
        return <BCMaskedTextField key={customFormFields.name} formFields={customFormFields}
            css={this.props.configSettings.css}
            type={customFormFields.type}
            HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            //disabled={this.state.initialDisabled}
            name={customFormFields.name} customMessage={customeMessage}
            inputType="tel" IsNumeric={true} AutoFocus={customFormFields.focus}
            fieldname={customFormFields.name}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            columnStyle={`${customFormFields.columnStyle}`}
            handleCheckboxEvent={this.handleEndDateCheckBoxEvent.bind(this)}
            patterns={this.props.configSettings.maskPattern}
            disabled={isDisabled} IsCheckboxChecked={checkboxValue}
            maxLength={customFormFields.maxLength ? parseInt(customFormFields.maxLength) : null}
            max={customFormFields.max ? parseInt(customFormFields.max) : null}
            parentName={parentName}
            onKeyDown={this.onKeyPress.bind(this)}
            />;
    }
    /** Returns the button control for a question */
    GetButtonPage(customListItems, customFormFields, state, showError, showErrorMessage, parentName) {
        return <BCButtonField key={customFormFields.name} columnStyle={` button-control-align col-sm-12 col-xs-12`}
            css={this.props.configSettings.css}
            type={customFormFields.type}
            GetActiveLabel={this.getEstimatedCreditScoreLabel}
            SelectedValue={state}
            ShowHideList={this.showHideEstimatedCreditScoreList}
            DisplayItem={this.state.displayEstimatedCreditScoreItems}
            ListData={customListItems}
            HandleSelectedOption={this.Continue.bind(this)}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialDisabled} ShowConsent={ this.state.ShowConsent}
            tabIndex={customFormFields.pageNumber}
            name={customFormFields.name} parentName={parentName}/>;
    }
    /** Returns the FA Button control for a question */
    GetFAButtonPage(customListItems, customFormFields, state, showError, showErrorMessage, parentName) {
        return <FAButtonField key={customFormFields.name} columnStyle={` button-control-align col-sm-12 col-xs-12`}
            css={this.props.configSettings.css}
            type={customFormFields.type}
            GetActiveLabel={this.getEstimatedCreditScoreLabel}
            SelectedValue={state}
            ShowHideList={this.showHideEstimatedCreditScoreList}
            DisplayItem={this.state.displayEstimatedCreditScoreItems}
            ListData={customListItems}
            HandleSelectedOption={this.Continue.bind(this)}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialDisabled} ShowConsent={ this.state.ShowConsent}
            tabIndex={customFormFields.pageNumber}
            name={customFormFields.name} parentName={parentName}/>;
    }
    /** Returns the single button control for a question */
    GetSingleButtonPage( customFormFields, state, showError, showErrorMessage, parentName) {
        return <BCSingleButtonField columnStyle={` button-control-align  col-sm-12 col-xs-12 `}
            css={this.props.configSettings.css}
            GetActiveLabel={this.getEstimatedCreditScoreLabel}
            SelectedValue={state}
            ShowHideList={this.showHideEstimatedCreditScoreList}
            DisplayItem={this.state.displayEstimatedCreditScoreItems}
            Title={customFormFields.title}
            HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
            formFields={customFormFields}
            showError={showError}
            showErrorMessage={showErrorMessage}
            disabled={this.state.initialDisabled} ShowConsent={ this.state.ShowConsent}
            tabIndex={customFormFields.pageNumber}
            name={customFormFields.name} parentName={parentName} />;
    }

    /** Returns the bank link (plaid/non-plaid) control for a question */
    GetBankLinkPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, parentName) {

        return <BCBankLinkField formFields={customFormFields}
            plaidKeyAPI={this.props.configSettings.formSettings.plaidKeyAPI}
            showLoader={this.showLoader.bind(this)}
            hideLoader={this.hideLoader.bind(this)}
            setLoaderMessage={this.setLoaderMessage.bind(this)}
            css={this.props.configSettings.css}
            onPlaidSuccess={this.LoadOnPlaidSuccess.bind(this)}
            apiurl={this.props.configSettings.themeConfig.apiurl}
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            name={customFormFields.name}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            fieldname={customFormFields.name}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            parentName={parentName}
            HandleSelectedOption={this.Continue.bind(this)}
            key={customFormFields.name}
            />;
    }

    /** Returns the bank link (plaid/non-plaid) control for a question */
    GetPinwheelLinkPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, parentName) {

        return <BCPinwheelLinkField formFields={customFormFields}
            showLoader={this.showLoader.bind(this)}
            hideLoader={this.hideLoader.bind(this)}
            setLoaderMessage={this.setLoaderMessage.bind(this)}
            css={this.props.configSettings.css}
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            apiurl={this.props.configSettings.themeConfig.apiurl}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            name={customFormFields.name}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            fieldname={customFormFields.name}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            parentName={parentName}
            HandleSelectedOption={this.Continue.bind(this)}
            key={customFormFields.name}
            />;
    }

    /** Returns the docusign control for a question */
    GetDocusignPage(customFormFields, parentName) {
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        return <BCDocusign formFields={customFormFields}
            type={customFormFields.type}
            css={this.props.configSettings.css}
            docusignUrl={this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`]}
            AutoFocus={customFormFields.focus}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            parentName={parentName}
            configSettings={this.props.configSettings}
            />;
    }

    /** Returns the Label control for a question */
    GetLabelField(customFormFields, parentName,state) {
        return <BCLabelField formFields={customFormFields}
            css={this.props.configSettings.css}
            name={customFormFields.name}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            parentName={parentName}
            showTitle={customFormFields.showTitle}
            columnStyle={`${customFormFields.columnStyle}`}
            key={`${customFormFields.name}`}
            value={state}
            />;
    }

      /** Returns the Label with paragraph control for a question (start page)*/
      GetStartPage(customFormFields, parentName) {
        return <BCLabelStartField formFields={customFormFields}
        css={this.props.configSettings.css}
        name={customFormFields.name}
        tabIndex={customFormFields.pageNumber}
        currentDevice={this.props.currentDevice}
        parentName={parentName}
        showTitle={customFormFields.showTitle} 
        key={customFormFields.name}/>;
    }
    /** Returns the Calcuation display on page for a question */
    GetCalculationDescField(customFormFields, parentName,  showError, showErrorMessage, showCodeErrorMessage, customMessage) {
        var newAmount = 0;
        let formattedNewAmount = '';
        if(customFormFields.conditionalrules)
        {
            newAmount = this.handleCustomDynamicRules(customFormFields.name,'onInit',customFormFields);
            if(customFormFields.pageNumber === this.state.currentPage && newAmount < customFormFields.minimumAmount) {
                this.state.IsContinue = true;
                this.state[`show${(customFormFields.stateName)}Error`]=true;
                this.state[`show${customFormFields.stateName}Message`]= true;
                showError = true;
                showErrorMessage = true;
            }else {
                this.state[`show${(customFormFields.stateName)}Error`]=false;
                this.state[`show${customFormFields.stateName}Message`]= false;
                showError = false;
                showErrorMessage = false;
            }
            formattedNewAmount = `$${AmountFormatting(newAmount, customFormFields.thousandSeparator)}`;
            let statePrefix = this.props.configSettings.fieldSettings.prefix;
            let stateSuffix = this.props.configSettings.fieldSettings.suffix;
            this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = formattedNewAmount;
        }

        return <BCLabelCalculationField formFields={customFormFields}
            type={customFormFields.type}
            css={this.props.configSettings.css}
            name={customFormFields.name}
            tabIndex={customFormFields.pageNumber}
            currentDevice={this.props.currentDevice}
            parentName={parentName}
            showTitle={customFormFields.showTitle}
            newAmount={formattedNewAmount}
            currentState={this.state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            statePrefix = {this.props.configSettings.fieldSettings.prefix}
            stateSuffix = {this.props.configSettings.fieldSettings.suffix}
            columnStyle={customFormFields.columnStyle}
            configSettings={this.props.configSettings}
            onKeyDown={this.onKeyPress.bind(this)}
            />;
    }
    /** Returns the Summary control for a question */
    GetSummaryPage(customFormFields) {
        let columnWidth = this.GetColumnWidth(customFormFields.col);
        let productType = this.props.configSettings.formSettings.productType;
        let additionalBorrower = (productType === "creditCards" && this.state.AdditionalBorrowerValue === "Yes") ? true : false;
        return <ConfigurableSummaryPage key={'summary-page'} 
            formFields={customFormFields}
            configSettings={this.props.configSettings}                 
            currentBrowser={this.props.currentBrowser} 
            currentOS={this.props.currentOS}
            currentDevice={this.props.currentDevice}
            PostData={this.props.PostData}
            PostDataEX = {this.props.PostDataEX}
            versionConfigSettings={this.props.versionConfigSettings}
            filteredVersion={this.props.filteredVersion}
            QueryStrings={this.props.QueryStrings}
            SenderDomain={this.props.SenderDomain}
            css={this.props.configSettings.css}
            EmploymentData={this.props.EmploymentData} 
            BankData={window.BankData} 
            OfferData={window.OfferData} 
            columnStyle={` text-control-align ${columnWidth}`}
            currentPage ={this.state.currentPage}
            formSubmissionCount={0}
            AdditionalBorrower={additionalBorrower}
        />
    }
    /** Get employment information for a borrower */
    GetEmploymentInfo(employmentQuestions, e) {
        let fullEmpInfo =this.props.PostDataEX.request;
        if(fullEmpInfo.borrowers[0].employmentInformation) {            
            if(employmentQuestions && employmentQuestions.length > 0) {
                employmentQuestions.forEach(element => {
                    let statePrefix = this.props.configSettings.fieldSettings.prefix;
                    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
                    if(element.pattern === "date") {
                        fullEmpInfo.borrowers[0].employmentInformation[0][element.name] = convertDateFormat(this.state[`${statePrefix}${element.stateName}${stateSuffix}`],element.summaryInfo.valuePattern,element.summaryInfo.postDataPattern);
                    } else {
                        fullEmpInfo.borrowers[0].employmentInformation[0][element.name] = this.state[`${statePrefix}${element.stateName}${stateSuffix}`];
                    }
                });
            }
        }
        return fullEmpInfo;
    }
    /** Returns the column width */
    GetColumnWidth(col) {
        var strColumn = '';
        strColumn = `col-sm-${col} col-xs-12`;
        return strColumn;
    }
    /** Returns the file upload control for a question */
    GetFileUploadPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage, parentName) {
        let min = ''; let max = '';
        let customeMessage = '';
        return <BCFileUploadField columnStyle={customFormFields.columnStyle}
            formFields={customFormFields}
            name={customFormFields.name}
            removeSeletedFile={this.handleSelectFileClick.bind(this)}
            handleChangeEvent={this.handleFileUploadChange.bind(this)}
            handleClickEvent={this.handleFileUploadClick.bind(this)}
            value={state}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? true : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber} inputType={customFormFields.inputType} showWrapErrorMessage={false} isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice}
            OnFocusIn={this.handleFocusIn.bind(this, customFormFields.name)}
            currentBrowser={this.props.currentBrowser}
            customeMessage={customeMessage}
            min={min} max={max} showTitle={customFormFields.showTitle}
            key={customFormFields.name}
            parentName={parentName}
            />;
    }

    GetDocumentListPage(customFormFields,customListItems) {
        for (let listItem in customListItems) 
        {
            let required = this.handleCustomDynamicRules(customListItems[listItem].name,'onInit',customFormFields);
            customListItems[listItem].isRequire = required === '' ? true : required;
        }
        return <BCDocumentListField columnStyle={` button-control-align ${this.props.IsZalea || this.props.IsHeadway ? " col-sm-12 col-xs-12 " : " col-sm-12 col-xs-12 "}`}
                HandleSelectedOption={this.handleDynamicEvent.bind(this,customFormFields)}
                formFields={customFormFields}            
                tabIndex={customFormFields.pageNumber} 
                name={customFormFields.name}
                handleCustomDynamicRules ={this.handleCustomDynamicRules.bind(this)}
                list={customListItems} currentDevice={this.props.currentDevice}
                configSettings={this.props.configSettings}
            />;
    }
    handleFileUploadClick(isFocus, customFormFields, event) {
        let fileUpload = event.target.files[0];
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = fileUpload;
        let formIsValid = true;
        var focusOut =this.props.configSettings.formSettings.defaultFocus;
        if(isFocus) {
            this.setState({ IsContinue: false, isValid: formIsValid });
            this.state[`is${customFormFields.stateName}Valid`]=formIsValid;
            this.state[`show${customFormFields.stateName}Error`]=!formIsValid;
        }
    }
    /** Validate file upload control for file extensions and size */
    handleFileUploadChange(isFocus, customFormFields, event) {
        let files = event.target.files;
        let filesArr;
        let fileUpload = event.target.files[0];
        if(files){
            filesArr = Array.prototype.slice.call(files);
        }else{
            filesArr=fileUpload;
        }
       
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = filesArr;
        let formIsValid = false;
        var focusOut =this.props.configSettings.formSettings.defaultFocus;
        if(fileUpload) {
            // validations for size and file types
            if(customFormFields.allowedFormats && customFormFields.allowedFormats.length > 0){
                const lastDot = fileUpload.name.lastIndexOf('.');
                const fileName = fileUpload.name.substring(0, lastDot);
                const ext = fileUpload.name.substring(lastDot + 1);
                if(ext && customFormFields.allowedFormats.indexOf(ext.toLowerCase()) > -1){
                    formIsValid = true;
                }
            }
            const maxAllowedSize = parseInt(customFormFields.maxFileSize) * 1024 * 1024;
            if (fileUpload.size > maxAllowedSize) {
                formIsValid = false;
                
            }

            if(formIsValid){
                this.setState({ IsContinue: false,  isValid: formIsValid });
                this.state[`is${customFormFields.stateName}Valid`]=formIsValid;
                this.state[`show${customFormFields.stateName}Error`]=!formIsValid;
                // setTimeout(() => {
                //     document.getElementById(focusOut).focus();                    
                // }, 200);
            }
            else {
                formIsValid=false;
                this.setState({ IsContinue: true, isValid: formIsValid });
                this.state[`is${customFormFields.stateName}Valid`]=formIsValid;
                this.state[`show${customFormFields.stateName}Error`]=!formIsValid;
            }
        }
        else {
            formIsValid=false;
            this.setState({ IsContinue: true, isValid: formIsValid });
            this.state[`is${customFormFields.stateName}Valid`]=formIsValid;
            this.state[`show${customFormFields.stateName}Error`]=!formIsValid;
        }
    }
    /** Handle selected File */
    handleSelectFileClick(customFormFields,fileName){
        let formIsValid = false;
        let storedFiles=$("input[name='"+customFormFields.name+"']")[0].files;
        var fileBuffer = new DataTransfer();
        for(var i=0;i<storedFiles.length;i++) {
			if(storedFiles[i].name !== fileName) {
                fileBuffer.items.add(storedFiles[i]);
			}
        }
        $("input[name='"+customFormFields.name+"']")[0].files = fileBuffer.files;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`]= Array.prototype.slice.call(fileBuffer.files);
        let fieldName= `${statePrefix}${customFormFields.stateName}${stateSuffix}`;
        this.setState({fieldName:Array.prototype.slice.call(fileBuffer.files)});
        
        if(!fileBuffer.files.length) {
            formIsValid=false;
            this.setState({ IsContinue: true, isValid: formIsValid });
            this.state[`is${customFormFields.stateName}Valid`]=formIsValid;
            this.state[`show${customFormFields.stateName}Error`]=!formIsValid;
        }
    }
    /** Get the question details based on Id */
    GetFilteredQuestions(id) {
        const filteredQuestions = this.props.versionConfigSettings.questions.filter(question => {
            if (question && id) {
                return question.id === id;
            }
            return filteredQuestions ? filteredQuestions[0] : null;
        });
        return filteredQuestions ? filteredQuestions[0] : null;
    }
    /** Get list item details from config */
    GetListItems(customFormFields) {
        let configs = this.props.configSettings[customFormFields.listItem];
        return configs;
    }
    /** Returns the login control for the question */
    GetLoginPage(customFormFields, state, showError, showErrorMessage, showCodeErrorMessage,customArray) {
        let min = ''; let max = '';
        let columnStyle = '';
        let customeMessage = '';
        let inputType = "";
        
        if (customFormFields.name.toLowerCase() === 'email' || customFormFields.name.toLowerCase() === 'password' || customFormFields.name.toLowerCase() === 'verifypassword'){
            columnStyle = ` text-control-align col-sm-12 col-xs-12 `;
        }
        if (customFormFields.name === "email" || customFormFields.name === "ownerEmail") {
            inputType = 'email';
        }else if( customFormFields.name === "password" || customFormFields.name === "verifypassword"){
            inputType = 'tel';
        }
        return <BCLoginField formFields={customFormFields}
            handleChangeEvent={this.handleDynamicEvent.bind(this,customFormFields)}
            value={state}
            type={customFormFields.type}
            css={this.props.configSettings.css}
            showError={showError}
            showErrorMessage={showErrorMessage}
            showCodeErrorMessage={showCodeErrorMessage === undefined ? false : showCodeErrorMessage}
            disabled={this.state.initialDisabled}
            tabIndex={customFormFields.pageNumber} inputType={inputType}
            showWrapErrorMessage={false} isMinChanged={this.state.showStateMinLoanAmount}
            IsNumeric={true} AutoFocus={customFormFields.focus}
            currentDevice={this.props.currentDevice} name={customFormFields.name}
            OnFocusIn={this.handleFocusIn.bind(this, customFormFields.name)}
            currentBrowser={this.props.currentBrowser}
            customeMessage={customeMessage}
            min={min} max={max} showTitle={customFormFields.showTitle}
            columnStyle={columnStyle} OwnerCount={ 1}
            customArray = {this.state.customArray===undefined ? customArray : this.state.customArray}
            key={customFormFields.name}
            onKeyDown={this.onKeyPress.bind(this)}
             />;
    }
    /** Handles the checkbox event for a masked text control */
    handleEndDateCheckBoxEvent(customFormFields, isFocus, event) {
        let endDateDisabled = event.target.checked;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        this.state[customFormFields.checkBoxStateName] = event.target.checked;
        this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = endDateDisabled ? '' : this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`];
        this.state[customFormFields.checkBoxDisabledStateName] = endDateDisabled;
        this.state[`is${customFormFields.stateName}Valid`]=true;
        this.state.isError = false;
        customFormFields.valid =true;
        if(endDateDisabled) {
            this.state[`is${customFormFields.stateName}Valid`]=true;
            this.state[`show${customFormFields.stateName}Error`]=false;
            this.state[`show${customFormFields.stateName}Message`]='';
            this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = '';
            customFormFields.value = '';
        }
        this.state[`${customFormFields.checkBoxStateName}`] = endDateDisabled;
        this.forceUpdate();
    }
    /** Initialises the google auto complete control */
    initAutocomplete(customFormFields, groupQuestion) {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        try {
            autocomplete = new window.google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById(customFormFields.name)),
                { types: ['geocode'] });
            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', this.fillInAddress.bind(this, customFormFields, groupQuestion));
            autocomplete.setComponentRestrictions({ 'country': this.props.configSettings.addressAutoComplete.countryCode });
            var input = document.getElementById(customFormFields.name);
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
    /** Fill the google autocomplete address in the group fields */
    fillInAddress(customFormFields, groupQuestion) {
        // Get the place details from the autocomplete object.
        this.state.IsContinue = false;
        var place = autocomplete.getPlace();
        var focusOut =this.props.configSettings.formSettings.defaultFocus;
        let addressValues=[];
        let that = this;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        if(place.address_components) {
            if(groupQuestion && groupQuestion.length > 0){
                groupQuestion.forEach(element => {
                    let statePrefix = this.props.configSettings.fieldSettings.prefix;
                    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
                    this.state[`${statePrefix}${element.stateName}${stateSuffix}`] = '';
                    element.valid = true;
                    this.state[`is${element.stateName}Valid`] = true;
                    this.state[`show${element.stateName}Error`] = false;
                    if(element.errorCode) {
                        this.state[`show${element.stateName}${element.errorCode}`] = '';
                    }
                    addressValues.push('');
                });
            }
            let streetAdd = ''; let aprtmentAdd = ''; let city = ''; let state = ''; let zip = '';
            
            
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                    var val = place.address_components[i][componentForm[addressType]];
                   
                    if (addressType === 'street_number') {
                        addressValues[0] = val;
                        streetAdd = val;
                    }
                    if (addressType === 'route') {
                        addressValues[0] = addressValues[0] !== '' ? addressValues[0] + " " + val : val;
                        aprtmentAdd = val;
                    }
                    if (addressType === 'locality' || addressType === 'postal_town') {
                        addressValues[2] = val;
                        city = val;
                    }
                    if (addressType === 'administrative_area_level_1') {
                        addressValues[3] = val;
                        state = val;
                    }
                    if (addressType === 'administrative_area_level_2') {
                        addressValues[3] = val;
                        state = val;
                    }
                    if (addressType === 'postal_code') {
                        addressValues[4] = val;
                        zip = val;
                    }
                    if (addressType === 'country' && that.props.configSettings.addressAutoComplete.countryLookup && that.props.configSettings.addressAutoComplete.countryLookup.indexOf(val.toLowerCase()) >= 0) {
                        addressValues[3] = val;
                        state = val;
                    }
                    if (addressType === 'intersection') { //) && that.props.configSettings.addressAutoComplete.countryLookup && that.props.configSettings.addressAutoComplete.countryLookup.indexOf(val.toLowerCase()) >= 0) {
                        addressValues[0] = val;
                        streetAdd = val;
                    }
                }
            }
            if (!this.handlePOBoxAddress(streetAdd, aprtmentAdd)) {
                let findState = this.props.configSettings.stateList.find(o => o.key.toLowerCase() === addressValues[3].toLowerCase());  //TODO: Change Configurable List Items
                
                if ((findState !== null && findState !== undefined) || this.props.configSettings.addressAutoComplete.countryCode.indexOf('uk') > -1) {
                    let stateObj = {};
                    if(groupQuestion && groupQuestion.length > 0){
                        let i = 0;
                        groupQuestion.forEach(element => {
                            stateObj[`${statePrefix}${element.stateName}${stateSuffix}`] = addressValues[i];
                            if(element.focusField != undefined) {
                                focusOut = element.focusField;
                            }
                            if(addressValues[i] != '')
                            {
                            
                                this.state[`show${element.stateName}Error`] = false;
                                this.state[`is${element.stateName}Valid`] = true;
                                //if(element.errorCode) {
                                this.state[`show${element.stateName}${element.errorCode}`] = '';
                                //}
                                element.valid = true;
                            }
                            element.value=addressValues[i];
                            i++;

                            /** State Validation */
                            if(addressValues[3] != '' && element.stateName==='State'){
                                let currentStateVal=addressValues[3];
                                if(this.props.configSettings.allowedState.includes(currentStateVal)){
                                    this.state[`show${element.stateName}Error`] = false;
                                    this.state[`is${element.stateName}Valid`] = true;
                                    element.valid = true
                                }else{
                                    this.state[`show${element.stateName}Error`] = true;
                                    this.state[`is${element.stateName}Valid`] = true;
                                    this.state[`show${element.stateName}Message`] = element.errormessage;
                                    element.valid = false;
                                }
                            }
                        });
                    
                    }
                    stateObj.showInvalidAddressModal = false;
                    stateObj.IsContinue= false;
                    this.setState(stateObj);
                }
                else {
                   // this.setState({ showInvalidAddressModal: true });
                }
            } else {
                setTimeout(() => {
                    this.state[`show${customFormFields.stateName}Message`] = customFormFields.POBoxMessage;
                    this.state[`show${customFormFields.stateName}Error`]=true;
                    this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`]='';
                    this.forceUpdate();
                }, 200);
                
                //this.setState({ showAddressMessage: customFormFields.POBoxMessage, showStreedAddressError: false });
            }
        }
       //let validFlag =this.GroupQuestionValidation();
       document.getElementById(focusOut).focus();
    
    }
    closePopup() {
        this.setState({ showInvalidAddressModal: false, showFundingModal: false, showStateLoanAmountModal: false });
    }
    AagreeTCPAChange(e) {
        this.setState({ AgreeTCPA: e.target.checked });
    }
    AgreePqTermsChange(e) {
        this.setState({ AgreePqTerms: document.getElementById(this.props.configSettings.formSettings.name).agreePqTerms.checked, isError: false });
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
            var payload = `email=${encodeURIComponent(this.state.EmailValue)}&firstname=${this.FirstWordCapital(this.state.FirstNameValue)}&lastname=${this.FirstWordCapital(this.state.LastNameValue)}&action=los_engine_mandrill_incomplete&nonce=4109b2257c`;
            SendEmail(this.props.configSettings.themeConfig.emailSendEndpoint, payload);
        }
    }
    
    BrowserForward(e, updated) {
        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, updated);
        this.ContinueToNextPage(customFormFields);
    }

    BrowserBack(e, updated) {

        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, updated);
        let groupQuestion =  this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === updated && x.isAddressGroup === true);
        let currentPageState = updated;
        if (currentPageState >= 1 && currentPageState <= this.state.TotalPages) {
            this.setState({ currentPage: currentPageState });
            if (customFormFields.showConsent) {
                this.setState({ ShowConsent: true });
             } else {
                 this.setState({ ShowConsent: false });
             }
            if (customFormFields.autoComplete) {
                setTimeout(() => {
                    this.initAutocomplete(customFormFields, groupQuestion);
                }, 1000);
            }
           
            this.setState({ IsContinue: false });
            this.getTitle(currentPageState);
        }
        if(currentPageState >1){
            if(document.getElementsByClassName('switcher').length>0){
               // document.getElementsByClassName('switcher')[0].style.visibility = 'hidden';
            } 
        }else{
            if(document.getElementsByClassName('switcher')){
              //  document.getElementsByClassName('switcher')[0].style.visibility = 'visible';
            } 
        }

        if (customFormFields.submitForm) {
            this.setState({ buttonText: customFormFields.buttonText });
        } else {
            this.setState({ buttonText: this.props.configSettings.formSettings.defaultButtonText });
        }
    }
    
    Submit(){
        var that = this;        
        if (window.presubmit !== undefined) window.presubmit();
        that.setState({ showModal: true });
        var second = 0;
        let loadText = this.props.configSettings.modalTransitionPage.loaderText;
        var x = setInterval(function () {
            if (second < 1) {
                if (!that.state.IsFormSubmitted) {
                    document.getElementById(that.props.configSettings.formSettings.name).submit();
                    that.setState({ IsFormSubmitted: true });
                    window.parent.scrollTo(0, 0);
                }
            }
            second++;
            if (second > 5 && second <= 10) {
                that.setState({ loaderContent: loadText[0]});
            }
            if (second > 10 && second <= 15) {
                that.setState({ loaderContent: loadText[1]});
            }
            if (second > 15) {
                that.setState({ loaderContent: loadText[2] });
                clearInterval(x);
            }
        }, 1000);
        if (window.loadtracking) {
            window.loadtracking(`/personal-loans/app-breadcrumb-submitted`);
        }
    }
    /** Function to continue to next page */
    Continue(e, selectedValue) {
        if(e) e.preventDefault();
        let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
        /** Hide language */
        if(customFormFields.pageNumber>1){
            if(document.getElementsByClassName('switcher').length>0){
                document.getElementsByClassName('switcher')[0].style.visibility = 'hidden';
            }      
        }

        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        if(customFormFields.isEmploymentInformation){
            let employmentQuestions = this.props.versionConfigSettings.questions.filter(x=>x.isEmploymentInformation === true);
            this.setState({ employmentInformation: this.GetEmploymentInfo(employmentQuestions) });
        }
        if(customFormFields.type === "button" || customFormFields.type === "fa-button" || customFormFields.type === "bank-link") {
            let value = e && e.target && e.target.id ? e.target.id : '';
            // if(value === "" && customFormFields.type === "fa-button") {
            //     value = e && e.target && e.target.offsetParent && e.target.offsetParent.id ? e.target.offsetParent.id : '';
            // }
            customFormFields.value = value;
            this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] = value;
        }
        let validFlag = false;
        let  showErrorValidation =  this.showErrorValidationOnGroup();
        if(showErrorValidation)
        {
            validFlag =this.GroupQuestionValidation(this.state.currentPage);
            this.setState({
                IsContinue: !validFlag,
                isValid: validFlag });
        }
        /*** Show Signature Validation */

        let  customValidation=true;
        if(customFormFields.parentId == undefined && e  ) 
        {
            customValidation=this.handleCustomValidation(false,e !== undefined ? e.currentTarget : this.state[`${statePrefix}${customFormFields.StateName}${stateSuffix}`],customFormFields.customValidation,customFormFields,customFormFields.value, customFormFields.hasQueryString ? customFormFields.value : '');
        } else if(validFlag){
            let tempgroupQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === this.state.currentPage && x.type !== 'group');
            let isTempValid = true;
            let errorCount =0;
            let that = this;
            tempgroupQuestion.forEach(element => {
                if(element.customValidation )
                {
                    isTempValid=that.handleCustomValidation(false,e !== undefined ? e.currentTarget : this.state[`${statePrefix}${element.StateName}${stateSuffix}`],element.customValidation,element,element.value, customFormFields.hasQueryString ? customFormFields.value : '');
                    this.state[`is${element.stateName}Valid`]=true;
                    if(!isTempValid) errorCount++;
                }
                else
                {
                    this.setState({ IsContinue: true, isValid: true });
                    this.state[`show${element.stateName}Error`]=false;
                    this.state[`is${element.stateName}Valid`]=true;
                }
            });
            validFlag = errorCount === 0 ? true : false;
        }
        let rulesValidation = true;        
        var matchValidation = true;
        if(customFormFields.stateName) {
            rulesValidation = this.handleDynamicRules(customFormFields.stateName, customFormFields);
        }
        if(customFormFields.match && customFormFields.valid)
        {
            matchValidation=this.handleMatch(false,e,customFormFields.match);
        }
        if (validFlag && customValidation && showErrorValidation && rulesValidation) {
            CallGAEvent("View Pre-Qualified Offers Button", "Application Submitted");
            let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);            

            let statePrefix = this.props.configSettings.fieldSettings.prefix;
            let stateSuffix = this.props.configSettings.fieldSettings.suffix;
            if(customFormFields.arrayValue && customFormFields.arrayValue !== '') {
                this.state[`${statePrefix}${customFormFields.arrayValue}${stateSuffix}`].push(customFormFields.value);
            }
            if(customFormFields.loaderMessage){
                this.setState({loaderMessage : customFormFields.loaderMessage});
            }
            else
                this.setState({loaderMessage : ''});

            //initialize states dynamically based on question name
            //this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] =   formcontrols.value;
            if(customFormFields.payloadkey)
            {
                let action = customFormFields.action;
                let apikey = customFormFields.apikey;
                var payloadarr =customFormFields.payloadkey; ;
                var payloadstr = '';
                if(customFormFields.type === 'file-upload'){
                    var fd = new FormData();
                    for (let cvalidation in payloadarr) {
                        var value =  this.state[`${statePrefix}${this.GetPascalCase(payloadarr[cvalidation])}${stateSuffix}`];
                        if(value=='undefined' || value==undefined)
                        {
                            value = payloadarr[cvalidation];
                        }
                        fd.append(cvalidation,value);
                    }
                    return this.handlePHPMethod(this,action,fd, customFormFields);
                }
                else{
                    for (let cvalidation in payloadarr) {
                        var value =  this.state[`${statePrefix}${this.GetPascalCase(payloadarr[cvalidation])}${stateSuffix}`];
                        if(value=='undefined' || value==undefined)
                        {
                            value = payloadarr[cvalidation];
                        }
                        payloadstr = payloadstr + cvalidation + '=' + value + '&';
                    }
                    payloadstr= payloadstr.substring(0,payloadstr.length-1);
                    return this.handlePHPMethod(this,action,payloadstr, customFormFields)
                }
            }
            else {
                this.ContinueToNextPage(customFormFields);
            }
        } else {
            if(customFormFields.pattern === "date" && rulesValidation) {
                let date = this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`];
                let valuePattern = customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern ? customFormFields.summaryInfo.valuePattern : customFormFields.placeholder;
                date = convertDateFormat(date,valuePattern,"MM/DD/YYYY");
                date = date.replace(/_/g,"");
                if(date.length > 0 && date.length < 10) {
                    customFormFields.valid = false;
                    this.state[`show${customFormFields.stateName}Error`]=true;
                    this.state[`show${customFormFields.stateName}Message`] =  customFormFields.errormessage;
                    this.state[`is${customFormFields.stateName}Valid`]=true;
                } else {
                    this.state[`show${customFormFields.stateName}Message`] = '';
                    this.state[`is${customFormFields.stateName}Valid`]=validFlag;
                    this.state[`show${customFormFields.stateName}Error`]=(customValidation && matchValidation ? false : true);
                }
                this.setState({ IsContinue: true, isValid: false });
                    
            } if(!rulesValidation || !customValidation) {
                this.state[`show${customFormFields.stateName}${customFormFields.errorCode}`] = true;
                this.state[`is${customFormFields.stateName}Valid`]=true;
                this.state[`show${customFormFields.stateName}Error`]=(customValidation && matchValidation ? false : true) ;
                validFlag=false;
                this.setState({ IsContinue: true, isValid: validFlag });
            } else if(customFormFields.parentId == undefined){
                this.state[`show${customFormFields.stateName}${customFormFields.errorCode}`] = true;
                this.state[`is${customFormFields.stateName}Valid`]=validFlag;
                this.state[`show${customFormFields.stateName}Error`]=(customValidation && matchValidation ? false : true) ;
                validFlag=false;
                this.setState({ IsContinue: true, isValid: validFlag });
            } else {
                var focusOut =this.props.configSettings.formSettings.defaultFocus;
                setTimeout(() => {
                    document.getElementById(focusOut).focus();                    
                }, 200);
            }
        }
        this.setState({  isValid: false, isContinue:false });
        window.parent.scrollTo(0, 0);

        
    }
    /* This method will create clone of borrower with same data as co-borrower in PostData structure */
    AddCoborrowerNode =() => {
        let borrower = this.props.PostDataEX.request.borrowers[0];
        this.props.PostDataEX.request.borrowers.push(borrower);
    }
    /* This function will accept JSON object and path to the attribute to get value of given attribute */
    getJSONValue (theObject, path) {
        try {        
            return path.
                    replace(/\[/g, '.').replace(/\]/g,'').
                    split('.').
                    reduce(
                        function (obj, property) { 
                            return obj[property];
                        }, theObject
                    );
                        
        } catch (err) {
            return undefined;
        }   
    }
    /* This method will set value into PostData structure, which is displayed post login */
    SetPostDataRequest = (customFormFields) => {
        let fieldName = customFormFields.name;
        if(customFormFields.summaryInfo && customFormFields.summaryInfo.postData && customFormFields.summaryInfo.postData.length > 0) {
            if(customFormFields.summaryInfo.postData.indexOf(".") !== -1) {
                var index = customFormFields.summaryInfo.postData.lastIndexOf(".");
                fieldName = customFormFields.summaryInfo.postData.substring(index+1, customFormFields.summaryInfo.postData.length);
            }
            this.setJSONValue(this.props.PostDataEX.request, customFormFields.summaryInfo.postData, customFormFields.value,fieldName);
        } else {
            this.setJSONValue(this.props.PostDataEX.request, customFormFields.postData, customFormFields.value,fieldName);
        }
    }

    ContinueToNextPage = (customFormFields) =>{
        let autoCompleteQuestion = [];
        let groupQuestion=[];
        let currentPageState = this.state.currentPage;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let isCoBorrower = this.props.QueryStrings.filter(x => x.key === customFormFields.coBorrowerQueryStringKey);
        let addCBNode = false;
        if(customFormFields.copyBorrowerNode && isCoBorrower && isCoBorrower.length > 0 && isCoBorrower[0].value === "1") {
            this.state[`${statePrefix}${customFormFields.coBorrowerStateName}${stateSuffix}`] = "Yes";
            addCBNode = true;
        }
        if((customFormFields.copyBorrowerNode && this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] === "Yes") || (addCBNode) ) {
            this.AddCoborrowerNode();
        }
        if(customFormFields.postLogin) {
            if(customFormFields['parentId'] !== undefined)
            {
                let multipleQuestions =  this.props.versionConfigSettings.questions.filter(x=> x.id === customFormFields.id || x.parentId === customFormFields.parentId  );
                if(multipleQuestions && multipleQuestions.length > 0) {
                    let that = this;
                    multipleQuestions.forEach(element => {
                        that.SetPostDataRequest(element);
                    });
                }
            } else {
                this.SetPostDataRequest(customFormFields);
            }
        }
        if(customFormFields.isEmploymentInformation){
            let employmentQuestions = this.props.versionConfigSettings.questions.filter(x=>x.isEmploymentInformation === true);
            this.state.employmentInformation = this.GetEmploymentInfo(employmentQuestions);
        }
        if(customFormFields.setState !== undefined && customFormFields.setState !== '') {
            this.state[`${statePrefix}${customFormFields.setState}${stateSuffix}`] = this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`];
        }
        if (customFormFields.submitForm && customFormFields.submitForm === true) { 
           
            let that = this;
            let newObj = [];
            that.props.versionConfigSettings.requestNode.filter(reqestHidden =>{
                newObj.push(that.renderHiddenRow(reqestHidden));
            });
            that.state.hiddenFieldsArray = newObj;
            that.Submit();
        } else {
            if(customFormFields.nextpage)
            {
                var isDefault = false;
                for (let npage in customFormFields.nextpage)
                {
                    if(npage === customFormFields.value)
                    {
                        if(customFormFields.nextpage[npage] === "formSubmit") {
                            let that = this;
                            let newObj = [];
                            that.state[`${statePrefix}FormSubmissionCount${stateSuffix}`] = customFormFields.formSubmissionCount;
                            that.state[`${statePrefix}TransactionType${stateSuffix}`] = customFormFields.transactionType;
                            that.props.versionConfigSettings.requestNode.filter(reqestHidden =>{
                                newObj.push(that.renderHiddenRow(reqestHidden));
                            });
                            that.state.hiddenFieldsArray = newObj;
                            that.Submit();
                        } else {
                            currentPageState = this.GetPageNumberbyName(customFormFields.nextpage[npage]);
                            if(currentPageState === undefined || currentPageState === 0) {
                                currentPageState = this.GetPageNumberbyNameOnly(customFormFields.nextpage[npage]);
                            }
                        }
                        isDefault=true;
                    }
                }
                if(!isDefault)
                {
                    if(customFormFields.conditionalrules)
                    {
                       
                        var  questionPage = this.handleCustomDynamicRules(customFormFields.name,'onContinue', customFormFields);
                        if(questionPage != '')
                        {
                            currentPageState = this.GetPageNumberbyNameOnly(questionPage);
                        }
                        else
                        {
                            currentPageState = currentPageState + 1;    
                        }
                    }
                    else if(customFormFields.nextpage["Default"] !== undefined && customFormFields.nextpage["Default"] !== '') 
                    {
                        currentPageState = this.GetPageNumberbyName(customFormFields.nextpage["Default"]);
                        if(currentPageState === undefined || currentPageState === 0) {
                            currentPageState = this.GetPageNumberbyNameOnly(customFormFields.nextpage["Default"]);
                        }
                    }
                    else
                    {
                        currentPageState = currentPageState + 1;    
                    }
                }
                this.handleDynamicFieldResetValue(customFormFields);
                if(customFormFields.defaultValueForSelectedOption) {
                    let that = this;
                    let selectedOption = customFormFields.defaultValueForSelectedOption.filter(defalutValue => defalutValue.selected === customFormFields.value );
                    selectedOption.forEach(element => {
                        if(element.type === "amount") {
                            that.state[`${statePrefix}${element.stateName}${stateSuffix}`] = `${that.props.configSettings.fieldSettings.currencySymbol}${AmountFormatting(element.value, customFormFields.thousandSeparator)}`;
                        } else {
                            that.state[`${statePrefix}${element.stateName}${stateSuffix}`] = element.value;
                        }
                    });                    
                }
            }
            else
            {
                
                if(customFormFields.conditionalrules)
                {
                    var questionPage = this.handleCustomDynamicRules(customFormFields.name,'onContinue',customFormFields);
                    if(questionPage != '')
                    {
                        currentPageState = this.GetPageNumberbyNameOnly(questionPage);
                    }
                    else
                    {
                        currentPageState = currentPageState + 1;    
                    }
                }   
                
                // else if(customFormFields.name==='login' && (this.props.configSettings.allowedEmployeInfo !==undefined) 
                // &&(this.props.configSettings.allowedEmployeInfo.find(elem=>elem==this.state[`${statePrefix}${customFormFields.employmentStateName}${stateSuffix}`])==undefined)){
                //    console.log(this.props.configSettings.allowedEmployeInfo.find(elem=>elem==this.state[`${statePrefix}${customFormFields.employmentStateName}${stateSuffix}`]))
                //     currentPageState = currentPageState + 2;
                // }

                else
                {
                    currentPageState = currentPageState + 1;
                }                
            }
            
            customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, currentPageState);
            autoCompleteQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === currentPageState && x.isAddressGroup === true && x.autoComplete === true);
            groupQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === currentPageState && x.isAddressGroup === true);
            this.setState({ currentPage: currentPageState });
            if(customFormFields.showConsent && customFormFields.showConsent !== undefined) {
                this.setState({ ShowConsent: true });
            } else  {
                this.setState({ ShowConsent: false });
            }
            window.history.pushState("", "", `${this.props.configSettings.formSettings.urlPath}${currentPageState}`);
            this.getTitle(currentPageState);
            this.setState({IsContinue:false})
        }
        if(customFormFields.type ==="file-upload") {
            this.setState({IsContinue:true});
        }
        setTimeout(() => {
            if(autoCompleteQuestion && autoCompleteQuestion.length > 0 && groupQuestion && groupQuestion.length > 0){
                this.initAutocomplete(autoCompleteQuestion[0], groupQuestion);
            }
        }, 1000);
        if (customFormFields.submitForm) {
            let statePrefix = this.props.configSettings.fieldSettings.prefix;
            let stateSuffix = this.props.configSettings.fieldSettings.suffix;
            this.state[`${statePrefix}FormSubmissionCount${stateSuffix}`] = customFormFields.formSubmissionCount;
            this.setState({ buttonText: customFormFields.buttonText, TransactionTypeValue: customFormFields.transactionType });
        } else if (customFormFields.buttonText && customFormFields.buttonText !== '') { 
            this.setState({ buttonText: customFormFields.buttonText });
        } else {
            this.setState({ buttonText: this.props.configSettings.formSettings.defaultButtonText  });
        }
        setTimeout(() => {
           if(document.getElementById(customFormFields.name)) {
                document.getElementById(customFormFields.name).focus();
                if(this.props.currentDevice === 'Mobile'){
                    document.getElementById(customFormFields.name).scrollTo(0, 0);
                }
                else{
                    window.parent.scrollTo(0, 0);
                }
            }
            
        }, 100);
        // window.scrollTo(0, 0);
        this.setState({ isContinue:false });
    }

    /* Get Title based on different language configured*/ 
    getTitle(pageNumber){
        let title = document.title.split('|');
        let filterTitle = this.props.configSettings.formSettings.title.filter(element => {
            if(title.length > 1) {
                return element.part1 === title[1] || element.part2 === title[1];
            } else {
                return element.part1 === title[0] || element.part2 === title[0];
            }
        })
        if(filterTitle && filterTitle.length > 0) {
            if(filterTitle[0].language === "arabic") {
                //set arabic title
                document.title = `${filterTitle[0].part1}${filterTitle[0].part2.replace("{{X}}",pageNumber)}`;
            } else {
                document.title = `${filterTitle[0].part1.replace("{{X}}",pageNumber)}${filterTitle[0].part2}`;
            }
        } 
    }

    FirstWordCapital(value) {
        return value.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
    }

    handlePOBoxAddress(address, aprtmentAdd) {
        let hasPOBox = false;
        if (address) {
            let currentAddress = address.toLowerCase();
            const poBoxAddress = this.props.configSettings.POBox.filter((element) => {
                return currentAddress.indexOf(element.value) > -1;
            });
            if (poBoxAddress.length > 0) {
                hasPOBox = true;
            }
        }
        if(!hasPOBox && aprtmentAdd) {
            let currentAddress = aprtmentAdd.toLowerCase();
            const poBoxAddress = this.props.configSettings.POBox.filter((element) => {
                return currentAddress.indexOf(element.value) > -1;
            });
            if (poBoxAddress.length > 0) {
                hasPOBox = true;
            }
        }
        return hasPOBox;
    }
    
    handleFocusIn(field, event) {
        CallGAEvent(field, "FocusIn");
    }

    onStateClick(event) {
        if (!this.state.initialDisabled) {
            this.setState({ isStateValid: true });
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

    getZipCodeByCityState() {
        var apiEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
        return axios.get(`${apiEndpoint}${encodeURIComponent(this.state.Address1Value)},
        ${encodeURIComponent(this.state.CityValue)},
        ${encodeURIComponent(this.state.selectedState)}&key=${this.props.configSettings.themeConfig.googleAPIKey}`)
    }
  
    GetCurrentPage(pages) {
        let that = this; 
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let firstCoborrower,secondCoBorrower="";
        if(this.props.configSettings.coBorrowerDetail){
            let firstCoDetail = this.props.configSettings.coBorrowerDetail[0].stateName;
            let secondCoDetail = this.props.configSettings.coBorrowerDetail[1].stateName;
            firstCoborrower=this.state[`${statePrefix}${firstCoDetail}${stateSuffix}`]; 
            secondCoBorrower=this.state[`${statePrefix}${secondCoDetail}${stateSuffix}`]; 
        }

        let currentPage = pages.filter(element => {
            if (element) {
                return element.props.formFields.pageNumber === that.state.currentPage;
            }
            return currentPage;
        });
        let filteredCurrentPage=[];
        currentPage.forEach(pages=>{
            if(this.props.configSettings.coBorrowerDetail){
                if(pages.props.formFields.stateName==this.props.configSettings.coBorrowerDetail[0].signStatename){
                        if(firstCoborrower!==undefined && firstCoborrower.length>1){
                            filteredCurrentPage.push(pages)
                        }
                }else if(pages.props.formFields.stateName==this.props.configSettings.coBorrowerDetail[1].signStatename){
                        if(secondCoBorrower && secondCoBorrower.length>1){
                            filteredCurrentPage.push(pages)
                        }
                }else{
                    filteredCurrentPage.push(pages)
                }  
            }else{
                filteredCurrentPage.push(pages)
            }
        });
        that.state.currentPageName = filteredCurrentPage.name;
        return filteredCurrentPage;
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
        return strHtml;
    }
    
    /**Handle Dynamic event which call from each component where we handle validation, custom validation and different state to continue to next question */
    handleDynamicEvent = (formcontrols,isFocus, event) => {
        
        this.state[`show${formcontrols.stateName}${formcontrols.errorCode}`] = false;
        this.state[`is${formcontrols.stateName}Valid`]=false;
        this.state[`show${formcontrols.stateName}Error`]=false;
        this.state[`show${formcontrols.stateName}Message`]='';
        var isValidValue = true;
        var value ='';
        var name = '';

      if(event && event.target && formcontrols.type !== "captcha")
        {
            if (event.target.type == 'submit' || formcontrols.type === 'fa-button' || formcontrols.type === "bank-link")
            {
                name = event.currentTarget.name;
                value = event.currentTarget.id;
                // if(value === "" && formcontrols.type === "fa-button") {
                //     value = event && event.currentTarget && event.currentTarget.offsetParent && event.currentTarget.offsetParent.id ? event.currentTarget.offsetParent.id : '';
                // }
            }
            else if(event.target.type == 'checkbox') {
                name = event.target.name;
                value = event.target.checked;
               
            }
            else
            {
                name = event.target.name;
                value = event.target.value;
                
            }
            /** For salary Period */
            if(formcontrols.isCalcEmployeeSalary&&formcontrols.isCalcEmployeeSalary!=='undefined'){
                let filterVal=this.props.configSettings[formcontrols.listItem];
                this.calculateEmployeeSalary(filterVal,event.target.value);
            }
            /** For salary Period  */
            
        }
        var formIsValid = false;
        var customValidation = true;
        var matchValidation = true;
        var rulesValidation =true;
        if(formcontrols.type === "captcha") {
            formcontrols.value = event;
            name = formcontrols.name;
            value = event;
        }

        formcontrols.value = value;
        formcontrols.touched = true;
        formcontrols.valid =true;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        if(formcontrols.showCheckbox && formcontrols.checkBoxStateName && this.state[formcontrols.checkBoxStateName]){
            formIsValid=true;
            this.state[`show${formcontrols.stateName}${formcontrols.errorCode}`] = false;
            this.state[`is${formcontrols.stateName}Valid`]=isValidValue;
            this.state[`show${formcontrols.stateName}Error`]=false;
            this.setState({ IsContinue: false, isValid: formIsValid });
            return;
        }

        if(formcontrols.validationRules === null )
        {
            formcontrols.valid = true;
            formIsValid=true;
        }
        if(!isFocus )
        {
            /** This condition is only for Auto Loan for Vehicle Information Year, Make and Model dropdown */
            if(formcontrols.type === "vehicle-dropdown") {
                let list =[];
                if(formcontrols.multiControlAction && formcontrols.multiControlAction !== undefined) {
                    let currentControl = formcontrols.multiControlAction.currentControl;
                    let nextControl = formcontrols.multiControlAction.nextControl;
                    let resetControl = formcontrols.multiControlAction.resetControl;
                    let previousControl = formcontrols.multiControlAction.previousControl;
                    this.props.vehicleData.forEach((element, index) => {
                        let node=  {"key": element[nextControl.dropdownFieldName], "text":element[nextControl.dropdownFieldName] , "label":element[nextControl.dropdownFieldName], "tabIndex":index};
                        if( formcontrols.multiControlAction.currentControl.vehicleType === "Year") {
                            if(element[currentControl.vehicleType] === parseInt(formcontrols.value) && list.indexOf(node) === -1) {
                                list.push(node);
                            }
                        } else if( formcontrols.multiControlAction.currentControl.vehicleType === "Make") {
                            if(previousControl !== undefined)
                            if(element[previousControl.vehicleType] === parseInt(this.state[`${statePrefix}${previousControl.stateName}${stateSuffix}`]) && element[currentControl.dropdownFieldName] === formcontrols.value && list.indexOf(node) === -1) {
                                list.push(node);
                            }
                        }                        
                    });
                    this.state[nextControl.listName] = this.getUniqueList(list,"key", "label", nextControl.vehicleType);
                    this.state[`${statePrefix}${nextControl.stateName}${stateSuffix}`] = "Select";
                    if(resetControl !== undefined)
                        this.state[resetControl.listName] = this.getUniqueList(list,"key", "label", resetControl.vehicleType); 
                }
            }
            formcontrols.valid = validate(value, formcontrols.validationRules, this.props.configSettings.fieldSettings.currencySymbol);
            isValidValue = formcontrols.valid;

            if(formcontrols.pattern === "date") {
                let date = this.state[`${statePrefix}${formcontrols.stateName}${stateSuffix}`];
                let valuePattern = formcontrols.summaryInfo && formcontrols.summaryInfo.valuePattern ? formcontrols.summaryInfo.valuePattern : formcontrols.placeholder;
                date = convertDateFormat(date,valuePattern,"MM/DD/YYYY");
                date = date.replace(/_/g,"");
                if(date.length < 10) {
                    formcontrols.valid = false;
                    isValidValue = false;
                } else
                if (checkValidDate(date) !== '') {
                    formcontrols.valid = false;
                    isValidValue = false;
                }
            }
            
                     
            if(formcontrols.customValidation && formcontrols.valid)
            {
                
                customValidation=this.handleCustomValidation(false,event,formcontrols.customValidation,formcontrols,formcontrols.value);
           
            }
            if(formcontrols.customEvent && formcontrols.valid)
            {
                customValidation=this.handleCustomEvent(event,formcontrols.customEvent);
            }

            if(formcontrols.match && formcontrols.valid)
            {
                matchValidation=this.handleMatch(false,event,formcontrols.match);
            }

            if(formcontrols.valid && matchValidation)
            {
                rulesValidation=this.handleDynamicRules(formcontrols.stateName, formcontrols);
            }

            if(matchValidation && customValidation && formcontrols.valid)
            {
                this.state[`show${formcontrols.stateName}Error`]=false;
            }
            if(formcontrols.type === 'dropdown' && formcontrols.value !== "" && formcontrols.parentId === undefined){
                var focusOut =this.props.configSettings.formSettings.defaultFocus;
                document.getElementById(focusOut).focus();
            }
            if(formcontrols.isExpenditure && formcontrols.isExpenditure === true) {
                this.handleTotalExpense();
            }
        }
        this.state[`${statePrefix}${formcontrols.stateName}${stateSuffix}`] =   formcontrols.value;
        if(formcontrols.valid && customValidation && matchValidation && rulesValidation)
        {
            if(formcontrols.type=='masked-text' && value.length<=0){
                isValidValue=false;
            }
            formIsValid=true;
            this.state[`show${formcontrols.stateName}${formcontrols.errorCode}`] = false;
            this.state[`is${formcontrols.stateName}Valid`]=isValidValue;
            this.state[`show${formcontrols.stateName}Error`]=false;
            this.setState({ IsContinue: false, isValid: formIsValid });
        }
        else
        {
            if(formcontrols.pattern === "date" && rulesValidation) {
                let date = this.state[`${statePrefix}${formcontrols.stateName}${stateSuffix}`];
                let valuePattern = formcontrols.summaryInfo && formcontrols.summaryInfo.valuePattern ? formcontrols.summaryInfo.valuePattern : formcontrols.placeholder;
                date = convertDateFormat(date,valuePattern,"MM/DD/YYYY");
                date = date.replace(/_/g,"");
                if(date.length === 0) {
                    formcontrols.valid = false;
                    this.state[`show${formcontrols.stateName}Error`]=true;
                    this.state[`show${formcontrols.stateName}Message`] =  formcontrols.required;
                    this.state[`is${formcontrols.stateName}Valid`]=true;
                }else if((date.length > 0 && date.length < 10) || !isValidValue) {
                    formcontrols.valid = false;
                    this.state[`show${formcontrols.stateName}Error`]=true;
                    this.state[`show${formcontrols.stateName}Message`] =  formcontrols.customMessage;
                    this.state[`is${formcontrols.stateName}Valid`]=true;
                }else {
                    
                    this.state[`is${formcontrols.stateName}Valid`]=true;
                    this.state[`show${formcontrols.stateName}Error`]=(customValidation && matchValidation ? false : true) ;
                }
                this.setState({ IsContinue: true, isValid: false });
                    
            } else {
                
                this.state[`show${formcontrols.stateName}${formcontrols.errorCode}`] = true;
                this.state[`is${formcontrols.stateName}Valid`]=isValidValue;
                this.state[`show${formcontrols.stateName}Error`]=(customValidation && matchValidation ? false : true) ;
                formIsValid=false;
                this.setState({ IsContinue: true, isValid: formIsValid });
            }
        }
    }
    handleCustomEvent(event,customEvent){


    }
    calculateEmployeeSalary(payPeriodList,value){
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let salaryPeriodAmountQuestion  = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === this.state.currentPage && x.isSalaryPeriodAmount === true);
        let salaryPeriodAmount=window.postDataEngine.request.borrowers[0].annualIncome;
        if(value){  
            payPeriodList.map(lp => {
                if(lp.payPeriod) {
                    if(lp.key.toLowerCase() === value.toLowerCase()){
                        let finalPeriodAmount=Math.round(salaryPeriodAmount/lp.payPeriod);
                        this.state[`${statePrefix}${salaryPeriodAmountQuestion[0].stateName}${stateSuffix}`]=finalPeriodAmount;
                        document.getElementById(salaryPeriodAmountQuestion[0].name).focus();
                        return true;
                    } 
                }
            });
        }
    }
    handleTotalExpense() {
        let expenditureQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === this.state.currentPage && x.isExpenditure === true);
        let totalExpenditure = 0;        
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let that = this;
        let thousandSeparator = expenditureQuestion && expenditureQuestion.length > 0 ? expenditureQuestion[0].thousandSeparator !== undefined ? expenditureQuestion[0].thousandSeparator: '' : '';
        expenditureQuestion.forEach(element => {
            let amount = that.state[`${statePrefix}${element.stateName}${stateSuffix}`];
            amount = unFormatAmount(amount, this.props.configSettings.fieldSettings.currencySymbol);
            totalExpenditure = totalExpenditure + (amount ? parseInt(amount.replace(this.props.configSettings.fieldSettings.currencySymbol, ''), 10): 0);
        });
        that.setState({ TotalExpenditureValue : `${AmountFormattingInt(totalExpenditure)}` });
    }
    /** This method will check if control have any dependency to disabled based on current value selected */
    handleDynamicFieldResetValue(formcontrols){
        if(formcontrols.summaryInfo && formcontrols.summaryInfo.disableDependentFields ) {
            let nextPage = formcontrols.nextpage[formcontrols.value];
            nextPage = nextPage === undefined ? formcontrols.nextpage["Default"] : nextPage;
            let that = this;
            let statePrefix = this.props.configSettings.fieldSettings.prefix;
            let stateSuffix = this.props.configSettings.fieldSettings.suffix;
            formcontrols.summaryInfo.disableDependentFields.forEach(element => {
                if(element.selectedValue === nextPage)
                {
                    if(element["defaultValue"] !== undefined ) {
                        that.state[`${statePrefix}${element.stateName}${stateSuffix}`] = element.defaultValue;
                    }
                }
            });
        }
    }
    /** This method will sort the Array object based on given Key */
    dynamicSort = (property) => {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    /** This method will get Array Object for dropdown, Sort it and append Place holder in dropdown. */
    getUniqueList = (list, key, label, dropdownFieldName) => {
        let val = `Select ${dropdownFieldName}`;
        let combinedList = [{"key" : "Select", "text": val, "label": val, "tabIndex": 0 }];
        let mymap = new Map(); 
        let uniqueList = list.filter(el => { 
            const val = mymap.get(el[key]); 
            if(val) { 
                if(el[label] < val) { 
                    mymap.delete(el.key); 
                    mymap.set(el[key], el[label]); 
                    return true; 
                } else { 
                    return false; 
                } 
            } 
            mymap.set(el[key], el[label]); 
            return true; 
        });
        uniqueList.sort(this.dynamicSort(key));
        combinedList.push(...uniqueList);
        return combinedList;
    }
   /** To handle custom validation like email,string length,character,external validation, age etc.. */
   handleCustomValidation(isFocus, event,customValidation,customFormFields,controlValue) {
    let eventValue = '';
    let ageMinMaxChanged = false;
    if(event && event.target && event.target.value )
    {
     eventValue = event.target.value;
    }
    else if (controlValue != '')
    {
        eventValue = controlValue;
    }
    else
    {
        eventValue = '';
    }

    let isValid = true;
    let arr = [];
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    arr=[];
    let crossverifyflag = true;
    for (let cvalidation in customValidation) {

        switch (cvalidation) {
            case 'characters':
                
                if(eventValue.length > customValidation[cvalidation].value)
                {
                  arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                  isValid=true;
                }
                else
                {
                    arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`is${(customFormFields.stateName)}Valid`] = false;
                    isValid=false;
                    crossverifyflag = false;
                }
            break;
            case 'disableSpecilaCharacter':
                if(eventValue && eventValue.match(customValidation[cvalidation].rules)) {
                    arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                    this.state[`show${(customFormFields.stateName)}Error`]=false;         
                    this.state[`is${(customFormFields.stateName)}Valid`] = true;
                    this.state[`show${customFormFields.stateName}Message`]=customFormFields.errormessage;
                    isValid=false;
                } else {
                    arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                    isValid=true;
                }
            break;
            case 'maxcharacter':
                if(eventValue && eventValue.length <= customValidation[cvalidation])
                {
                  arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                  isValid=true;
                }
                else
                {
                    arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`is${(customFormFields.stateName)}Valid`] = false;
                    if(customValidation[cvalidation].customMessage !== undefined){
                        this.state[`show${customFormFields.stateName}Message`]= customValidation[cvalidation].customMessage;
                    }
                  
                    isValid=false;
                    
                }
            break;
            case 'disabledNegative':
                eventValue = unformat(eventValue, this.props.configSettings.fieldSettings.currencySymbol);
                console.log(eventValue)
                if(eventValue && eventValue>0 )
                {
                  arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                  isValid=true;
                }
                else if(eventValue && eventValue< 0)
                {
                        arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                        this.state[`show${(customFormFields.stateName)}Error`]=true;
                        this.state[`is${(customFormFields.stateName)}Valid`] = false;
                        if(customValidation[cvalidation].customMessage !== undefined){
                            this.state[`show${customFormFields.stateName}Message`]= customValidation[cvalidation].customMessage;
                        }
                    
                        isValid=false;                        
                }
                else
                {
                    if(customFormFields.validationRules&& customFormFields.validationRules.rule){
                        arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red'});
                        this.state[`show${(customFormFields.stateName)}Error`]=true;
                        this.state[`is${(customFormFields.stateName)}Valid`] = false;
                        if(customValidation[cvalidation].customMessage !== undefined){
                            this.state[`show${customFormFields.stateName}Message`]= customValidation[cvalidation].customMessage;
                        }
                    
                        isValid=false;
                    }
                    
                }
            break;
            case "disableSpecilaCharacter":
            if (eventValue.match(customValidation[cvalidation].rules)) {
                arr.push({
                key: cvalidation,
                value: customValidation[cvalidation].value,
                color: "red",
                label: customValidation[cvalidation].label,
                });
                this.state[`show${customFormFields.stateName}Error`] = true;
                this.state[`is${customFormFields.stateName}Valid`] = false;
                isValid = false;
            } else {
                arr.push({
                key: cvalidation,
                value: customValidation[cvalidation].value,
                color: "green",
                label: customValidation[cvalidation].label,
                });
                isValid = true;
            }
             break;
                case 'minmaxcharacter':
                let minmaxChar = customValidation[cvalidation].split("-");
                if(parseInt(minmaxChar[0]) <= parseInt(eventValue.length) && parseInt(minmaxChar[1]) >= parseInt(eventValue.length))
                {
                
                    arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green',label:customValidation[cvalidation].label});
                    isValid=true;
                }
                else
                {
                    arr.push({key:cvalidation,value:customValidation[cvalidation],color:'red',label:customValidation[cvalidation].label});
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`is${(customFormFields.stateName)}Valid`] = false;
                    isValid=false;
                    crossverifyflag = false;
                }
            break;
          case 'lowercase letter':
                if(eventValue.match(customValidation[cvalidation].rules)) {
                    arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                    isValid=true;
                 } else {
                    arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`is${(customFormFields.stateName)}Valid`] = false;
                    isValid=false;
                    crossverifyflag = false;
                }
                break;
          case 'number':
                   if(eventValue.match(customValidation[cvalidation].rules)) {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                        isValid=true;
                     } else {
                       arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                       this.state[`show${(customFormFields.stateName)}Error`]=true;
                       this.state[`is${(customFormFields.stateName)}Valid`] = false;
                       isValid=false;
                       crossverifyflag = false;
                      }
                break;
            case 'allowedState':
                let allowStateValue = customValidation[cvalidation]
                let stateValue = eventValue
                for (let validValue in allowStateValue)
                {
                    if(allowStateValue[validValue] === stateValue)
                    {
                        arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                        this.state[`show${customFormFields.stateName}Message`]='';
                        this.state[`show${(customFormFields.stateName)}Error`]=false;
                        isValid=true;
                        break;
                    }
                    else {
                        this.state[`show${(customFormFields.stateName)}Error`]=true;
                        this.state[`show${customFormFields.stateName}Message`]= customFormFields.errormessage;
                        isValid=false;
                    }
                }
                
            break;
          case 'uppercase letter':
                        if(eventValue.match(customValidation[cvalidation].rules)) {
                             arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                             isValid=true;
                          } else {
                            arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            this.state[`is${(customFormFields.stateName)}Valid`] = false;
                            isValid=false;
                            crossverifyflag = false;
                           }
                    break;
          case 'special character':
                            if(eventValue.match(customValidation[cvalidation].rules)) {
                                 arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green',label:customValidation[cvalidation].label});
                                 isValid=true;
                              } else {
                                arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'red',label:customValidation[cvalidation].label});
                                this.state[`show${(customFormFields.stateName)}Error`]=true;
                                this.state[`is${(customFormFields.stateName)}Valid`] = false;
                                isValid=false;
                                crossverifyflag = false;
                               }
                break;

          case 'password':
                           if(eventValue == (this.state[`${statePrefix}${(cvalidation)}${stateSuffix}`])  )
                           {
                            isValid=true;
                           }
                           else
                           {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            this.state[`is${(customFormFields.stateName)}Valid`] = false;
                            isValid=false;

                           }
           break;
           case 'phonenumber':
                           if(eventValue.replace(" ","").match(customValidation[cvalidation].rules))
                           {
                            isValid=true;
                           }
                           else
                           {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            this.state[`is${(customFormFields.stateName)}Valid`] = false;
                            isValid=false;

                           }
           break;
           case 'SSN':
                if(eventValue.replace(" ","").match(customValidation[cvalidation].rules))
                            {
                            isValid=true;
                            }
                            else
                            {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            this.state[`is${(customFormFields.stateName)}Valid`] = false;
                            isValid=false;

                            }
                            break;
           case 'externalValidation':
               if(isValid)
               {
                let isprevalidation  = true;
                let apiURL = customValidation[cvalidation].apiURL;
                let apikey = customValidation[cvalidation].apikey;
                var payloadarr =customValidation[cvalidation].payloadkey;
                var validate = customValidation[cvalidation].validate;
                var payloadstr = '';
                var isValueOnly = customValidation[cvalidation].isvalueonly;
                var isEqualSign = customValidation[cvalidation].isequalsign;
                if(validate !== undefined)
                {
                for (let validValue in validate)
                {
                    let sPrefix = this.props.configSettings.fieldSettings.prefix;
                    let sSuffix = this.props.configSettings.fieldSettings.suffix;
        
                    let arrayValue = this.state[`${validValue}`];
                    let stateValue =  this.state[`${sPrefix}${(validate[validValue].name)}${sSuffix}`];
                
                    if( isprevalidation && arrayValue != undefined && stateValue != undefined && arrayValue.length > 0 && arrayValue.indexOf(stateValue.toLowerCase()) > -1 )
                    {
                        isprevalidation = true;
                            
                     }
                    else
                    {
                        isprevalidation = false;
                                                  
        
                    }
                }
            }
            else
            {isprevalidation = false;}
                if(!isprevalidation)
                {
                let isCallApi = true;
                for (let cvalidation in payloadarr)
                {

                    var payloadName = payloadarr[cvalidation].name === undefined ? payloadarr[cvalidation]:payloadarr[cvalidation].name;
                    let payloadprefix = this.props.configSettings.fieldSettings.prefix;
                    let payloadsuffix = this.props.configSettings.fieldSettings.suffix;
                    var value =  this.state[`${payloadprefix}${( payloadName  )}${payloadsuffix}`];
                    if(value =='' || value==undefined)
                    {
                        isCallApi = false;
                    }
                    if(!isValueOnly)
                    payloadstr = payloadstr + cvalidation + (isEqualSign ? '=' :'') + unformatwithoutspace(value) + '&';
                    else
                    payloadstr = payloadstr +  encodeURIComponent((value)) + ',';
                }
                payloadstr= payloadstr.substring(0,payloadstr.length-1);
                if(isCallApi)
                {
                    isValid= this.handleExternalMethod(customValidation[cvalidation].method, apiURL,apikey,payloadstr,validate,customFormFields.stateName);
                }
                if(!isValid )
                {
                    this.state[`show${customFormFields.stateName}Message`]= customValidation[cvalidation].message;
                    customFormFields.valid = false;
                }
            }
            else
            {
                isValid = true;
            }
            }
           break;
           case 'minAge':
                if(customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern !== 'MM/DD/YYYY' && !ageMinMaxChanged) {
                    eventValue = convertDateFormat(eventValue,customFormFields.summaryInfo.valuePattern,"MM/DD/YYYY");
                    ageMinMaxChanged = true;
                }
                if(eventValue && eventValue.length > 0 && isValid && eventValue.match(customValidation[cvalidation].rules)) {
                    const age = calculateAge(new Date(eventValue), new Date());
                    if(customValidation[cvalidation].min <= age)
                    {
                        this.state[`show${(customFormFields.stateName)}Error`]=false;
                        this.state[`show${customFormFields.stateName}Message`]='';
                        isValid=true;
                    }
                    else {
                        if(customValidation[cvalidation].min > age)
                        {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            this.state[`show${customFormFields.stateName}Message`]= customFormFields.label + ' should not be higher today date';
                            isValid=false;
                        }
                        else
                        {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            if(customValidation[cvalidation].customMessage !== undefined ||customValidation[cvalidation].customMessage !== '')
                               this.state[`show${customFormFields.stateName}Message`]= customValidation[cvalidation].customMessage;
                            else
                               this.state[`show${customFormFields.stateName}Message`]= customFormFields.label + ' should not be less than ' + customValidation[cvalidation].min;

                            isValid=false;
                        }
                    }
                }
                else
                {
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`show${customFormFields.stateName}Message`] =  customFormFields.customMessage;
                    isValid=false;
                }
           break;
           case 'minAge-maxAge':
                if(customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern !== 'MM/DD/YYYY' && !ageMinMaxChanged) {
                    eventValue = convertDateFormat(eventValue,customFormFields.summaryInfo.valuePattern,"MM/DD/YYYY");
                    ageMinMaxChanged = true;
                }
                if(eventValue && eventValue.length > 0 && isValid && eventValue.match(customValidation[cvalidation].rules)) {
                    const age1 = calculateAge(new Date(eventValue), new Date());
                    if(customValidation[cvalidation].min <= age1 && customValidation[cvalidation].max >= age1)
                    {
                        this.state[`show${(customFormFields.stateName)}Error`]=false;
                        this.state[`show${customFormFields.stateName}Message`]='';
                        isValid=true;
                    }
                    else {
                        if(customValidation[cvalidation].min > age1)
                        {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            this.state[`show${customFormFields.stateName}Message`]= customValidation[cvalidation].customMessage;
                            isValid=false;
                        }
                        else if(customValidation[cvalidation].max < age1)
                        {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            this.state[`show${customFormFields.stateName}Message`]= customFormFields.customMessage;
                            isValid=false;
                        }
                        else
                        {
                            this.state[`show${(customFormFields.stateName)}Error`]=true;
                            if(customValidation[cvalidation].customMessage !== undefined ||customValidation[cvalidation].customMessage !== '')
                               this.state[`show${customFormFields.stateName}Message`]= customValidation[cvalidation].customMessage;
                            else
                               this.state[`show${customFormFields.stateName}Message`]= customFormFields.label + ' should not be less than ' + customValidation[cvalidation].min;

                            isValid=false;
                        }
                    }
                }
                else
                {
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`show${customFormFields.stateName}Message`] =  customFormFields.customMessage;
                    isValid=false;
                }

                
           break;
           case 'maxAge':
                if(customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern !== 'MM/DD/YYYY' && !ageMinMaxChanged) {
                    eventValue = convertDateFormat(eventValue,customFormFields.summaryInfo.valuePattern,"MM/DD/YYYY");
                    ageMinMaxChanged = true;
                }
                if(eventValue&& eventValue.length>0 && isValid && eventValue.match(customValidation[cvalidation].rules)) {

                    const age = calculateAge(new Date(eventValue), new Date());
                    if(customValidation[cvalidation].max >= age)
                    {
                        arr.push({key:cvalidation,value:customValidation[cvalidation].max,color:'green'});
                        this.state[`show${customFormFields.stateName}Message`]='';
                        isValid=true;
                    }
                    else {
                        this.state[`show${(customFormFields.stateName)}Error`]=true;
                        this.state[`show${customFormFields.stateName}${customFormFields.errorCode}`] = customFormFields.label + ' should not be greater than ' + customValidation[cvalidation].max;
                        this.state[`show${customFormFields.stateName}Message`]= customFormFields.customMessage;
                    }
                }
                else
                {
                    if(isValid)
                    {
                        this.state[`show${(customFormFields.stateName)}Error`]=true;
                        this.state[`show${customFormFields.stateName}Message`] =  customFormFields.customMessage;
                    }
                isValid=false;

            }
            break;
            case 'min-max':
                let minmax = customValidation[cvalidation].split("-");
                let val = unformat(eventValue,  this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
             
                if(parseInt(minmax[0]) <= (val) && parseInt(minmax[1]) >= parseInt(val))
                {
                    arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                    this.state[`show${customFormFields.stateName}Message`]='';
                    this.state[`show${(customFormFields.stateName)}Error`]=false;
                    isValid=true;
                }
                else if(parseInt(minmax[0]) >= parseInt(val))
                {
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`show${customFormFields.stateName}Message`]= customFormFields.errormessage;
                    isValid=false;
                }else if(parseInt(minmax[1]) <= parseInt(val))
                {
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`show${customFormFields.stateName}Message`]= customFormFields.custommessage;
                    isValid=false;
                }
                else {
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`show${customFormFields.stateName}Message`]= customFormFields.errormessage;
                    isValid=false;
                }
            break;
            case 'min':
                let mincustomvalue = customValidation[cvalidation];
                let mininputvalue = unformat(eventValue, this.props.configSettings.fieldSettings.currencySymbol);
                if(parseInt(mincustomvalue) <= parseInt(mininputvalue))
                {
                arr.push({key:cvalidation,value:customValidation[cvalidation],color:'green'});
                this.state[`show${customFormFields.stateName}Message`]='';
                this.state[`show${(customFormFields.stateName)}Error`]=false;
                isValid=true;
                }
                else {
                    this.state[`show${(customFormFields.stateName)}Error`]=true;
                    this.state[`show${customFormFields.stateName}Message`]= customFormFields.custommessage;
                    isValid=false;
                }
            break;
            case 'max':
                if(customValidation[cvalidation] > unformat(eventValue, this.props.configSettings.fieldSettings.currencySymbol))
                    {
                    arr.push({key:cvalidation,value:customValidation[cvalidation].value,color:'green'});
                    this.state[`show${customFormFields.stateName}Message`]='';
                    this.state[`show${(customFormFields.stateName)}Error`]=false;
                    isValid=true;
                    }
                    else {

                        this.state[`show${(customFormFields.stateName)}Error`]=true;
                        this.state[`show${customFormFields.stateName}Message`]= customFormFields.custommessage;
                        isValid=false;
                    }
            break;
            case 'EmailAddress':
                if (eventValue.replace(" ", "").match(customValidation[cvalidation].rules)) {
                    isValid = true;
                }
                else {
                    this.state[`show${(customFormFields.stateName)}Error`] = true;
                    this.state[`is${(customFormFields.stateName)}Valid`] = false;
                    isValid = false;

                }
            break;
           default: isValid = true;
        }
      }
    if(arr.length > 0)
    this.setState({customArray:arr});
    if(crossverifyflag === false) 
    {
        isValid = false;
        this.state[`show${(customFormFields.stateName)}Error`]=true;
        this.state[`is${(customFormFields.stateName)}Valid`] = false;
    }
   return isValid;
}
    /**Get the value from the state */
    getValue(type,fieldName)
    {
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let fullPostData = this.props.PostDataEX && this.props.PostDataEX.request ? this.props.PostDataEX.request : undefined;
        if(type=='State')
        {
            return this.state[`${statePrefix}${(fieldName)}${stateSuffix}`] === undefined ? this.state[`${(fieldName)}`] : this.state[`${statePrefix}${(fieldName)}${stateSuffix}`] ;
        }
        else if (type=='Prop')
        {
            return this.props[fieldName];
        }
        else if(type ==='Window')
        {
            return this.window[fieldName];
        }
        else if(type ==='postData')
        {
            return this.props.PostDataEX[fieldName];
        }
        else if(type ==='postData-borrower' && fullPostData !== undefined)
        {
            return fullPostData.borrowers[0][fieldName];
        }
        else if(type ==='postData-borrower-employment' && fullPostData !== undefined)
        {
            return fullPostData.borrowers[0].employmentInformation[0][fieldName];
        }
        else
        {
            return this.getJSONValue(fullPostData,type);
        }
    }
    /*Set value for JSON node */
    setJSONValue (theObject, path, value,fiedlName) {
        try {        
            return path.
                    replace(/\[/g, '.').replace(/\]/g,'').
                    split('.').
                    reduce(
                        function (obj, property) { 
                           if(property == fiedlName)
                             obj[property]=value;
                             return obj[property];
                        }, theObject
                    );
                        
        } catch (err) {
            return undefined;
        }   
    }
    /** Dynamic rules like compare 1 Question value with other or set value from 1 Question to other question */
    handleDynamicRules(fieldName, customFormFields) {
       
        var isValid = true;
        let rules = this.props.versionConfigSettings["rules"];
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        for (let rule in rules)
        {
            var field = rules[rule].field;
            if(field.toLowerCase() === fieldName.toLowerCase())
            {
                var compareField = rules[rule].compareField;
                var threshhold = rules[rule].threshhold;
                var threshholdtype = rules[rule].thresholdType;
                var operator = rules[rule].operator;
                var type = rules[rule].type;
                var customMessage = rules[rule].customMessage;
                var source = rules[rule].source;
                let stateValue =  this.state[`${statePrefix}${(fieldName)}${stateSuffix}`];
                let compareValue =  this.getValue(source,compareField);
                switch (operator)
                {
                    case '>':
                        if(threshhold != '' && threshholdtype != '')
                        {
                            if(type === "Date")
                            {
                                let valuePattern = customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern ? customFormFields.summaryInfo.valuePattern : customFormFields.placeholder;
                                stateValue = convertDateFormat(stateValue,valuePattern,"MM/DD/YYYY");
                                compareValue = convertDateFormat(compareValue,valuePattern,"MM/DD/YYYY");
                                var newDate = AddDate(new Date(compareValue),threshholdtype,threshhold)
                                if(new Date(stateValue) > newDate  && new Date(stateValue) < (new Date()))
                                {
                                    isValid = true;
                                }
                                else
                                {
                                    this.state[`show${(field)}Error`]=true;
                                    this.state[`show${field}Message`]= customMessage;
                                    isValid=false;
                                }
                            }
                            else if(type === "Numeric")
                            {
                                let newValue = MathsCalculator(compareValue,threshhold.substring(1,threshhold.length),threshhold.substring(0,1));
                                if(stateValue > newValue )
                                {
                                    isValid = true;
                                }
                                else
                                {
                                    this.state[`show${(field)}Error`]=true;
                                    this.state[`show${field}Message`]= customMessage;
                                    isValid=false;
                                }
                            }
                            else 
                            {
                                isValid =true;
                            }
                        }
                    break;
                    case '<':
                        if(type === "Date")
                        {
                            let valuePattern = customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern ? customFormFields.summaryInfo.valuePattern : customFormFields.placeholder;
                            stateValue = convertDateFormat(stateValue,valuePattern,"MM/DD/YYYY");
                            compareValue = convertDateFormat(compareValue,valuePattern,"MM/DD/YYYY");
                            var newDate = AddDate(new Date(compareValue),threshholdtype,threshhold);
                            var stateDate = new Date(stateValue);
                            if(stateDate < newDate  && stateDate < (new Date()))
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Numeric")
                        {
                            let newValue = MathsCalculator(compareValue,threshhold.substring(1,threshhold.length),threshhold.substring(0,1));
                            if(stateValue < newValue )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        } 
                        else if(type === "Minus")
                        {
                            
                            var tempValue = 0;
                            var thresholdValue = 0;
                            var newValue = 0;
                            if(compareField.length > 0)
                            {
                                var arrayValue = compareField.split(',');
                           
                                for(var i=0;i<=arrayValue.length-1;i++)
                                {
                                    var subArrayValue = arrayValue[i].split('-');
                                    if(subArrayValue.length > 1) {
                                        tempValue = this.getValue('State',subArrayValue[0]);
                                        var calcValue = subArrayValue[1];
                                        if(calcValue.indexOf('%') > -1) {
                                            calcValue = calcValue.substring(0, calcValue.length-1);
                                            tempValue = unformat(tempValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator) * parseFloat(calcValue);
                                            tempValue = `${this.props.configSettings.fieldSettings.currencySymbol}${AmountFormatting(tempValue, customFormFields.thousandSeparator)}`;
                                        }
                                    } else {
                                        tempValue = this.getValue('State',arrayValue[i]);
                                    }
                                    if(tempValue === '') {
                                        tempValue = "";
                                        this.state[`${statePrefix}${arrayValue[i]}${stateSuffix}`] = tempValue;
                                    } 
                                    tempValue = unFormatAmount(tempValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                                    if(newValue === 0) {
                                        newValue = tempValue === "" ? 0 : parseInt(tempValue);
                                    } else if(tempValue != undefined) {
                                        newValue=  MathsCalculator( newValue,tempValue === "" ? 0 : parseInt(tempValue, 10), 'Minus');
                                    }
                                }
                            }
                            stateValue = unFormatAmount(stateValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                            if(parseInt(stateValue) < newValue )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else 
                        {
                            isValid =true;
                        }
                    break;
                    case '=':
                        if(type === "Date")
                        {
                            let valuePattern = customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern ? customFormFields.summaryInfo.valuePattern : customFormFields.placeholder;
                            stateValue = convertDateFormat(stateValue,valuePattern,"MM/DD/YYYY");
                            compareValue = convertDateFormat(compareValue,valuePattern,"MM/DD/YYYY");
                            var newDate = AddDate(new Date(compareValue),threshholdtype,threshhold)
                            if(new Date(stateValue) === newDate  && new Date(stateValue) < (new Date()))
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Numeric")
                        {
                            let newValue = MathsCalculator(compareValue,threshhold.substring(1,threshhold.length),threshhold.substring(0,1));
                            if(stateValue === newValue )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "String")
                        {
                            if(stateValue === compareValue )
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                            else
                            {
                                isValid = true;
                            }
                        }
                        else 
                        {
                            isValid =true;
                        }
                    break;
                    case '>=':
                        if(type === "Date")
                        {
                            let valuePattern = customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern ? customFormFields.summaryInfo.valuePattern : customFormFields.placeholder;
                            stateValue = convertDateFormat(stateValue,valuePattern,"MM/DD/YYYY");
                            compareValue = convertDateFormat(compareValue,valuePattern,"MM/DD/YYYY");
                            var newDate = AddDate(new Date(compareValue),threshholdtype,threshhold)
                            if(new Date(stateValue) >= newDate  && new Date(stateValue) < (new Date()))
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Numeric")
                        {
                            let newValue = MathsCalculator(compareValue,threshhold.substring(1,threshhold.length),threshhold.substring(0,1));
                            if(stateValue >= newValue )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else 
                        {
                            isValid =true;
                        }
                    break;
                    case '<=':
                        if(type === "Date")
                        {
                            let valuePattern = customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern ? customFormFields.summaryInfo.valuePattern : customFormFields.placeholder;
                            stateValue = convertDateFormat(stateValue,valuePattern,"MM/DD/YYYY");
                            compareValue = convertDateFormat(compareValue,valuePattern,"MM/DD/YYYY");
                            var newDate = AddDate(new Date(compareValue),threshholdtype,threshhold)
                            if(new Date(stateValue) <= newDate  && new Date(stateValue) < (new Date()))
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Numeric")
                        {
                            let newValue = MathsCalculator(compareValue,threshhold.substring(1,threshhold.length),threshhold.substring(0,1));
                            if(stateValue <= newValue )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Sum")
                        {
                            var tempvalue = 0;
                            var thresholdValue = 0;
                            if(compareValue.length > 0)
                            {
                                for(var i=0;i<=compareValue.length-1;i++)
                                {
                                    tempvalue=  MathsCalculator( parseInt(compareValue[i].substring(1,compareValue[i].length).replace(',','')),tempvalue, 'Plus');
                                }
                            }
                            else
                            tempvalue = 0;
                            if(typeof threshhold === 'string')
                            {
                                thresholdValue = this.getValue('State',threshhold);
                            }
                            else
                            {
                                thresholdValue= threshhold;
                            }
                            if(thresholdValue != '')
                            thresholdValue = thresholdValue.substring(1,thresholdValue.length).replace(',','');
                            
                            stateValue = stateValue.substring(1,stateValue.length).replace(',','');
                            var newValue = MathsCalculator(parseInt(thresholdValue),parseInt(tempvalue),threshholdtype);
                            if(stateValue && parseInt(stateValue) <= newValue)
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Minus")
                        {
                            var tempValue = 0;
                            var thresholdValue = 0;
                            var newValue = 0;
                            if(compareField.length > 0)
                            {
                                var arrayValue = compareField.split(',');
                                for(var i=0;i<=arrayValue.length-1;i++)
                                {
                                    var subArrayValue = arrayValue[i].split('-');
                                    if(subArrayValue.length > 1) {
                                        tempValue = this.getValue('State',subArrayValue[0]);
                                        var calcValue = subArrayValue[1];
                                        if(calcValue.indexOf('%') > -1) {
                                            calcValue = calcValue.substring(0, calcValue.length-1);
                                            tempValue = unformat(tempValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator) * parseFloat(calcValue);
                                            tempValue = `${this.props.configSettings.fieldSettings.currencySymbol}${AmountFormatting(tempValue, customFormFields.thousandSeparator)}`;
                                        }
                                    } else {
                                        tempValue = this.getValue('State',arrayValue[i]);
                                    }
                                    if(tempValue === '') {
                                        tempValue = "";
                                        this.state[`${statePrefix}${arrayValue[i]}${stateSuffix}`] = tempValue;
                                    } 
                                    tempValue = unFormatAmount(tempValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                                    if(newValue === 0) {
                                        newValue = tempValue === "" ? 0 : parseInt(tempValue, 10);
                                    } else if(tempValue != undefined) {
                                        newValue=  MathsCalculator( newValue,tempValue === "" ? 0 : parseInt(tempValue, 10), 'Minus');
                                    }
                                }
                            }
                            stateValue = unFormatAmount(stateValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                            if(parseInt(stateValue) <= newValue )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Sign")
                        {
                            var tempValue = 0;
                            var thresholdValue = 0;
                            var newValue = 0;
                            if(compareField.length > 0)
                            {
                                var arrayValue = compareField.split(',');
                                for(var i=0;i<=arrayValue.length-1;i++)
                                {
                                    tempValue = this.getValue('State',arrayValue[i]);
                                    if(tempValue!=='undefined' && tempValue !==''){
                                        stateValue=stateValue.toLowerCase();
                                        tempValue=tempValue.toLowerCase();
                                        if(stateValue.includes(tempValue)){
                                            isValid = true;
                                        }else{
                                            this.state[`show${(field)}Error`]=true;
                                            this.state[`show${field}Message`]= customMessage;
                                            isValid=false;
                                        }
                                    }
                                }
                                         
                            }
                            
                        }
                        else 
                        {
                            isValid =true;
                        }
                    break;
                    case '!=':
                        if(type === "Date")
                        {
                            let valuePattern = customFormFields.summaryInfo && customFormFields.summaryInfo.valuePattern ? customFormFields.summaryInfo.valuePattern : customFormFields.placeholder;
                            stateValue = convertDateFormat(stateValue, valuePattern, "MM/DD/YYYY");
                            compareValue = convertDateFormat(compareValue,valuePattern,"MM/DD/YYYY");
                            var newDate = AddDate(new Date(compareValue),threshholdtype,threshhold)
                            if(new Date(stateValue) != newDate  )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else if(type === "Numeric")
                        {
                            let newValue = MathsCalculator(compareValue,threshhold.substring(1,threshhold.length),threshhold.substring(0,1));
                            if(stateValue != newValue )
                            {
                                isValid = true;
                            }
                            else
                            {
                                this.state[`show${(field)}Error`]=true;
                                this.state[`show${field}Message`]= customMessage;
                                isValid=false;
                            }
                        }
                        else 
                        {
                            isValid =true;
                        }
                        default: isValid = true;
                    }
                }
            }
        return isValid;
    }
    handleCustomDynamicRules(fieldName,ruleson, customFormFields)
    {
        var returnValue = '';
        let rules = this.props.versionConfigSettings["conditionalrules"];
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let flag = true;
        for (let rule in rules)
        {
            var field = rules[rule].field;
            if(field.toLowerCase() === fieldName.toLowerCase() &&  flag === true && rules[rule].ruleson === ruleson )
            {
                var compareField = rules[rule].compareField;
                console.log(compareField)
                var threshhold = rules[rule].threshhold;
                var threshholdtype = rules[rule].thresholdType;
                var operator = rules[rule].operator;
                var type = rules[rule].type;
                var source = rules[rule].source;
                var action = rules[rule].action;
                var actionType = rules[rule].actionType;
                let stateValue =  this.state[`${statePrefix}${(field)}${stateSuffix}`];
                let minimumAmount = rules[rule].minimumAmount;
                var conditions = rules[rule].conditions;
                switch (operator)
                {
                    case '!=':
                        if(threshhold != '' && threshholdtype != '')
                        {
                            if(type === "question")
                            {
                                if(returnValue ==='') {returnValue= true;}
                                let compareValue = this.getValue(source,compareField);
                                if(threshhold == 'null')
                                {
                                    if(compareValue != null)
                                    returnValue= false;
                                }
                                else
                                {
                                    var thresholdarray = threshhold.split(",");
                                    if(thresholdarray.length > 1)
                                    {
                                        for(var i=0;i<=thresholdarray.length-1;i++)
                                        {
                                            if(compareValue != null && returnValue && compareValue == thresholdarray[i])      
                                            {
                                                returnValue= false;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if(compareValue != null && returnValue && compareValue == thresholdarray[0])      
                                        {
                                        returnValue= false;
                                        }
                                    }
                                }
                            }
                            else 
                            {
                                returnValue =true;
                            }
                        }
                    break;
                    case '-':
                        if(threshhold != '' && threshholdtype != '')
                        {
                            if(type === "bulkquestion")
                            {
                                var newValue = 0;
                                var threshholdValue = 0;
                                if( compareField != undefined && compareField != '' && compareField.length > 0)
                                {
                                    var arrayValue = compareField.split(',');
                                    for(var i=0;i<=arrayValue.length-1;i++)
                                    {
                                        var tempValue = this.getValue('State',arrayValue[i]);
                                        if(tempValue === '') {
                                            tempValue = "";
                                            this.state[`${statePrefix}${arrayValue[i]}${stateSuffix}`] = tempValue;
                                        } 
                                        if(tempValue != undefined)
                                        {
                                            tempValue = unFormatAmount(tempValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                                            newValue=  MathsCalculator( tempValue === "" ? 0 : parseInt(tempValue, 10),newValue, 'Plus');
                                        }
                                    }
                                }
                                if(newValue) {
                                returnValue = newValue;
                                }   
                                else{
                                    returnValue = 0;
                                }
                            } 
                            else if(type === "threshhold-bulkquestion")
                            {
                                var newValue = 0;
                                var threshholdValue = unformat(this.state[`${statePrefix}${threshhold}${stateSuffix}`], this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                                if( compareField != undefined && compareField != '' && compareField.length > 0)
                                {
                                    var arrayValue = compareField.split(',');
                                    var optionSelected = conditions ? conditions.split('-') : undefined;
                                    var arrCondition = optionSelected !== undefined && optionSelected.length > 1 ? optionSelected[0].split(',') : undefined;
                                    for(var i=0;i<=arrayValue.length-1;i++)
                                    {
                                        if(arrCondition && arrCondition.length > 0 && this.state[`${statePrefix}${arrCondition[i]}${stateSuffix}`] === optionSelected[1]) {
                                            var tempValue = this.getValue('State',arrayValue[i]);
                                            if(tempValue === '') {
                                                tempValue = "";
                                                this.state[`${statePrefix}${arrayValue[i]}${stateSuffix}`] = tempValue;
                                            } 
                                            if(tempValue != undefined){
                                                tempValue = unFormatAmount(tempValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                                                newValue=  MathsCalculator( tempValue === "" ? 0 : parseInt(tempValue, 10),newValue, 'Plus');
                                            }
                                        } else if( arrCondition === undefined ){
                                            var tempValue = this.getValue('State',arrayValue[i]);
                                            if(tempValue === '') {
                                                tempValue = "";
                                                this.state[`${statePrefix}${arrayValue[i]}${stateSuffix}`] = tempValue;
                                            } 
                                            if(tempValue != undefined) {
                                                tempValue = unFormatAmount(tempValue, this.props.configSettings.fieldSettings.currencySymbol, customFormFields.thousandSeparator);
                                                newValue=  MathsCalculator( tempValue === "" ? 0 : parseInt(tempValue, 10),newValue, 'Plus');
                                            }
                                        }
                                    }
                                }
                                    threshholdValue = threshholdValue !== '' ? parseInt(threshholdValue) : 0;
                                    returnValue = threshholdValue - newValue;
                            }
                            else 
                            {
                                if(flag)
                                {
                                returnValue =true;
                                }
                            }
                        }
                    break;
                case '==':
                        if(threshhold != '' )
                        {
                            if(type === "list")
                            {
                                let array = [];
                                array = this.props.configSettings[compareField];
                                array.forEach((element, index) => {
                                    if(element.name == fieldName && flag && element.isRequire != false )
                                    {
                                        flag = false;
                                        returnValue =  element.nextQuestion;
                                        var nextQuestion = array.find((x,i) => x.name == returnValue && x.isRequire == true);
                                        if(nextQuestion === undefined || nextQuestion === null || nextQuestion === "") {
                                            var tempvalue = array.find((x,i) => x.isRequire == true && i > index);
                                            if(tempvalue !== undefined && tempvalue !== null) {
                                                returnValue = tempvalue.name;
                                            } else
                                            if(tempvalue === undefined || tempvalue == null || tempvalue =='')
                                            {
                                                returnValue = element.finalQuestion;
                                            }
                                        }
                                    }
                                });
                            }
                            if(type === "equal")
                            {
                                if(action != '' && actionType =='nextpage' && flag )
                                {
                                    flag = false;
                                    returnValue =  action;
                                }
                            }
                            if(type === "int")
                            {
                                var compareValue = (source == '' ? compareField:this.getValue(source,compareField));
                                if(stateValue == compareValue && actionType == 'nextpage' && threshholdtype == 'Value'  )
                                {
                                    flag = false;
                                    returnValue =  action;
                                }
                                if(threshhold == compareValue && actionType == 'nextpage' && threshholdtype == ''  )
                                {
                                    flag = false;
                                    returnValue =  action;
                                }
                            }
                            if(type === "string")
                            {
                                var compareValue = (source == '' ? compareField:this.getValue(source,compareField));
                                if(stateValue == compareValue && actionType == 'nextpage' && threshholdtype == 'Value'  )
                                {
                                    flag = false;
                                    returnValue =  action;
                                }
                                if(threshhold == compareValue && actionType == 'nextpage' && threshholdtype == ''  )
                                {
                                    flag = false;
                                    returnValue =  action;
                                }
                            }
                            if(type === "question")
                            {
                                if(returnValue ==='') {returnValue= false;}
                                var compareValue = this.getValue(source,compareField);
                                if(threshhold == 'null')
                                {
                                    if(compareValue != null)
                                        returnValue= false;
                                }
                                else
                                {
                                    var thresholdarray = threshhold.split(",");
                                    if(thresholdarray.length > 1)
                                    {
                                        for(var i=0;i<=thresholdarray.length-1;i++)
                                        {
                                            if(compareValue != null  && compareValue == thresholdarray[i])      
                                            {
                                                    returnValue= true;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if(compareValue != null && compareValue === thresholdarray[0])      
                                        {
                                            returnValue= true;
                                        } 
                                    }
                                }
                            }
                            else 
                            {
                                if(flag)
                                    returnValue ='';
                            }
                        }
                    break;
                    default:  returnValue =true;
                }
            }
        }
        return returnValue;
    }

    /** To call dynamic api from handle external method */
    handleExternalMethod(methodname,apiURL,apikey,payloadstr,validate,statename){
        let content = '';
        const method = this.funcMap[methodname];
        if (typeof method === 'function') {
            content =  method(apiURL,apikey,payloadstr,validate,statename);
        }
        return content;
    }

    /** To validate city state zip using AJAX method dynamically */
    ValidateCityStateZipAjax(apiEndpoint,apikey,payloadstr,validate,statename)
    {
        var postalCodes = [];
        var cityCodes = [];
        var stateCodes = [];
        var isValid=true;
        var that = this;
        $.ajax({
            url: `${apiEndpoint}${payloadstr}&key=${apikey}`,
            success: function (response) {
                if(response){
                    if (response !== undefined) {
                        if (response.results !== undefined && response.results.length > 0) {
                            let address_components = response.results[0].address_components;
                            if (address_components !== undefined) {
                                address_components.forEach(address => {
                                    if(that.props.configSettings.addressAutoComplete.countryCode.indexOf('uk') > -1) {
                                        if (address.types.indexOf('postal_town') >= 0) {
                                            //Add zipcode into list.
                                            cityCodes.push(address.long_name.toLowerCase());
                                            that.setState({  cityCodeArray: cityCodes });
                                        }
                                    } else
                                    if (address.types.indexOf('locality') >= 0) {
                                        //Add zipcode into list.
                                        cityCodes.push(address.long_name.toLowerCase());
                                        that.setState({  cityCodeArray: cityCodes });
                                    }
                                    if (address.types.indexOf('postal_code') >= 0) {
                                        //Add zipcode into list.
                                        postalCodes.push(address.long_name.toLowerCase());
                                        that.setState({ zipCodeArray: postalCodes });
                                    }
                                    if (address.types.indexOf('administrative_area_level_1') >= 0) {
                                        stateCodes.push(address.long_name.toLowerCase());
                                        that.setState({  stateCodeArray: stateCodes });
                                    }
                                    if (address.types.indexOf('country') >= 0 && that.props.configSettings.addressAutoComplete.countryLookup && that.props.configSettings.addressAutoComplete.countryLookup.indexOf(address.long_name.toLowerCase()) >= 0) {
                                        stateCodes = [];
                                        stateCodes.push(address.long_name.toLowerCase());
                                        that.setState({  stateCodeArray: stateCodes });
                                    }
                                    that.setState({ zipCodeArray: postalCodes });
                                });
                            }
                        }
                    }
                }
            },
            async: false
        });
        this.state.zipCodeArray = postalCodes;
        this.state.cityCodeArray = cityCodes;
        this.state.stateCodeArray=stateCodes;
        /*** Zip code validation for puert rico */
        if (this.state.StateValue && this.props.configSettings.allowedState){
                if(this.props.configSettings.allowedState.includes(this.state.StateValue)){
                isValid=true;
                
            }else{
                isValid=false;
            }
        }
    
        if(validate)
        {
            //initialize states dynamically based on question name
            for (let cvalidation in validate) {
                let statePrefix = this.props.configSettings.fieldSettings.prefix;
                let stateSuffix = this.props.configSettings.fieldSettings.suffix;
                let arrayValue = this.state[`${cvalidation}`];
                let stateValue =  this.state[`${statePrefix}${(validate[cvalidation].name)}${stateSuffix}`];
                if(arrayValue != undefined && stateValue != undefined && arrayValue.length > 0 && arrayValue.indexOf(stateValue.toLowerCase()) > -1 )
                {
                    this.state[`show${(validate[cvalidation].name)}Error`]=false;
                }
                else
                {
                    if(stateValue == undefined || stateValue=='')
                    {
                        this.state[`is${(validate[cvalidation].name)}Valid`] =  false;
                    }
                    else
                    {
                        this.state[`show${(validate[cvalidation].name)}Error`]=true;
                    }
                    if(validate[cvalidation].name === statename)
                    isValid=false;
                }
            }
        }
        return isValid;
    }

    /** Common method to call any api */
    CommonValidationAPIAjax(apiEndpoint,apikey,payloadstr,validate)
    {
        var isValid=true;
        $.ajax({
            url: `${apiEndpoint}${payloadstr}&${apikey}`,
            // dataType: 'jsonp',
            success: function (response) {
                if(response){
                    if (response !== undefined) {
                        isValid = response.valid;
                    }
                }
            },
            async: false
        });
        if(validate)
        {
            for (let cvalidation in validate)
            {
                let statePrefix = this.props.configSettings.fieldSettings.prefix;
                let stateSuffix = this.props.configSettings.fieldSettings.suffix;
                if(this.state[`${(cvalidation)}`].indexOf((this.state[`${statePrefix}{this.GetPascalCase(validate[cvalidation])}${stateSuffix}`]) > -1 ))
                {
                    this.state[`show${this.GetPascalCase(validate[cvalidation].name)}Error`]=false;
                    this.state[`is${this.GetPascalCase(validate[cvalidation].name)}Valid`] = true;
                }
                else
                {
                    this.state[`show${this.GetPascalCase(validate[cvalidation])}Error`]=true;
                    this.state[`is${this.GetPascalCase(validate[cvalidation])}Valid`] = false;
                    isValid=false;
                }
            }
        }
        return isValid;
    }

    /** To match 1 field value with another field */
    handleMatch(isFocus, event,customValidation, fieldValue = '', fieldId = '') {
        let password = event === null ? fieldValue : event.target.value;
        let fieldName = event === null ? fieldId : event.currentTarget.id;
        let isValid = true;
        let arr = [];
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        arr=[];
        for (let cvalidation in customValidation)
        {
            if(password == (this.state[`${statePrefix}${this.GetPascalCase(cvalidation)}${stateSuffix}`])  )
            {
                isValid=true;
                this.state[`is${this.GetPascalCase(fieldName)}Valid`] = true;
            }
            else
            {
                this.state[`show${this.GetPascalCase(fieldName)}Error`]=true;
                this.state[`is${this.GetPascalCase(fieldName)}Valid`] = false;
                isValid=false;
            }
        }
        return isValid;
    }

    showLoader(){
        this.setState({isFetchInProgress: true});
    }

    hideLoader(){
        this.setState({isFetchInProgress: false});
    }

    setLoaderMessage(message, delayMessageDisplay){
        const that = this;
        let appendedMessage = '';
        if(delayMessageDisplay){
            let brokenMessage = message.split("<br/>")
            if(brokenMessage && brokenMessage.length > 0)
            brokenMessage.forEach((element, i) => {
                setTimeout(() => {
                    appendedMessage += element + "<br/>";
                    that.setState({loaderMessage: appendedMessage}); 
                  }, i * 2000);
            });
        }
        else{
            that.setState({loaderMessage: message});
        }
    }

    onCloseDynamicModal(){
        this.setState({isDynamicModalPopup: false});
        if(this.state.nextFocusElement && document.getElementById(this.state.nextFocusElement))
            document.getElementById(this.state.nextFocusElement).focus();
    }

    /** To call PHP method from continue button */
    handlePHPMethod(event,action,payload, customFormFields) {
      
        let isSuccess = false;
        var that = this;
        that.showLoader();
        if(customFormFields.type === "file-upload") {
            for(let i=0; i<$("input[type='file']").length;i++){
                $.each($("input[type='file']")[i].files, function(i, file) {
                    payload.append('docType[]', file);
                });
            }
            
            //let contentTypeSet = customFormFields["contentType"] !== undefined ? customFormFields["contentType"] : true;
            $.ajax({
                method: "POST",
                url: `${that.props.configSettings.themeConfig.apiurl}?action=`+action,
                data: payload,
                processData: false,
                contentType: false,
                enctype:"multipart/form-data",
                success: function (response) {
                    if(response){
                        let apiResponse = JSON.parse(response);
                        if(apiResponse.url){
                            window.location.href=apiResponse.url;
                        }
                        else if(apiResponse.status === 'success'){
                            if(apiResponse.docusignUrl!==undefined){
                                this.LoadOnPlaidSuccess(apiResponse.docusignUrl);
                            }
                            isSuccess = true;
                            that.setState({ phpErrorMessages: ''});
                            that.ContinueToNextPage(customFormFields);
                            that.setState({
                                isValid: false,
                                isContinue:false
                            });
                            that.hideLoader();
                            if(customFormFields.showDynamicModalPopup)
                                that.setState({isDynamicModalPopup: true, dynamicModalPopupButtonText:customFormFields.dynamicModalPopupButtonText, dynamicModalPopupContent: customFormFields.dynamicModalPopupContent, nextFocusElement: customFormFields.nextFocusElement})
                        }
                        else{
                            that.hideLoader();
                            if(apiResponse.message && apiResponse.message.length > 0){
                                that.setState({ phpErrorMessages: apiResponse.message[0]});
                            }
                        }
                    }
                },
                error: function (a,b,c) {
                    //This is only for local COMMENT code while production build
                    isSuccess = true;
                    that.setState({ phpErrorMessages: ''});
                    that.ContinueToNextPage(customFormFields);
                    that.setState({
                        isValid: false,
                        isContinue:false
                    });
                    that.hideLoader();
                },
                async: true
            });  
        } else {
            $.ajax({
                method: "POST",
                url: `${that.props.configSettings.themeConfig.apiurl}?action=`+action,
                data: payload,
                processData: false,
                success: function (response) {
                    if(response){
                        let apiResponse = JSON.parse(response);
                        if(apiResponse.url){
                            window.location.href=apiResponse.url;
                        }
                        else if(apiResponse.status === 'success'){
                            isSuccess = true;
                            that.setState({ phpErrorMessages: ''});
                            that.ContinueToNextPage(customFormFields);
                            that.setState({
                                isValid: false,
                                isContinue:false
                            });
                            that.hideLoader();
                            if(customFormFields.showDynamicModalPopup)
                                that.setState({isDynamicModalPopup: true, dynamicModalPopupButtonText:customFormFields.dynamicModalPopupButtonText, dynamicModalPopupContent: customFormFields.dynamicModalPopupContent, nextFocusElement: customFormFields.nextFocusElement})
                        }
                        else{
                            that.hideLoader();
                            if(apiResponse.message && apiResponse.message.length > 0){
                                that.setState({ phpErrorMessages: apiResponse.message[0]});
                            }
                        }
                    }
                },
                error: function (a,b,c) {
                    //This is only for local COMMENT code while production build
                    isSuccess = true;
                    that.setState({ phpErrorMessages: ''});
                    that.ContinueToNextPage(customFormFields);
                    that.setState({
                        isValid: false,
                        isContinue:false
                    });
                    that.hideLoader();
                },
                async: true
            });
        }
        return isSuccess;
    }

    redirectQuestion(event,redirectid)
    {
        this.setState({ isManualBankForm:true, isDisplay:true });
        return false;
    }

    // To validation any question based on configuration from continue button
    showErrorValidationOnGroup(currentPage)
    {
        let tempgroupQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === currentPage && x.type !== 'group');
        let isTempValid = true;
        tempgroupQuestion.forEach(element => {
            if(isTempValid)
            {
                if(this.state[`show${element.stateName}Error`] != undefined && this.state[`show${element.stateName}Error`])
                {
                    isTempValid = false;
                    element.isValid = false;
                }
                else
                {
                    element.isValid = true;
                }
            }
        });
        return isTempValid;
    }

    GroupQuestionValidation(currentPage)
    {
        let tempgroupQuestion = this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === currentPage && x.type !== 'group');
        let isTempValid = true;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let errorCount = 0;
        let firstCoborrower,secondCoDetail,firstCoDetail,secondCoBorrower="";
        if(this.props.configSettings.coBorrowerDetail){
            firstCoDetail = this.props.configSettings.coBorrowerDetail[0].stateName;
            secondCoDetail = this.props.configSettings.coBorrowerDetail[1].stateName;
            firstCoborrower=this.state[`${statePrefix}${firstCoDetail}${stateSuffix}`]; 
            secondCoBorrower=this.state[`${statePrefix}${secondCoDetail}${stateSuffix}`]; 
        }
        tempgroupQuestion.forEach(element => {
            if(element.validationRules )
            {
                if(element.showCheckbox && element.checkBoxStateName && this.state[element.checkBoxStateName]){
                    this.state[`show${element.stateName}${element.errorCode}`] = false;
                    this.state[`is${element.stateName}Valid`]=true;
                    this.state[`show${element.stateName}Error`]=false;

                    this.setState({
                         IsContinue: false,
                         isValid: true });
                    isTempValid = true;
                }
                else if(element.validationRules.required && element.type !== "button" && element.type !== "fa-button" && element.type !== "bank-link")
                {
                    if(!element.value || element.value === '' || element.value === "false" || element.value ==='Select' || element.value=='select' || this.state[`${statePrefix}${element.stateName}${stateSuffix}`] === 'Select' || this.state[`${statePrefix}${element.stateName}${stateSuffix}`] === 'select' )
                    {
                       
                        if(this.props.configSettings.coBorrowerDetail){
                            if(element.stateName==this.props.configSettings.coBorrowerDetail[0].signStatename){
                                    if(firstCoborrower!==undefined && firstCoborrower.length>1){
                                        this.state[`show${element.stateName}Error`]=false;
                                        this.state[`show${element.stateName}${element.errorCode}`] = false;
                                        this.state[`is${element.stateName}Valid`]=true;
                                        isTempValid = true;
                                        this.setState({ IsContinue: false, isValid: true });
                                        this.state[`is${element.stateName}Valid`]=true;
                                    }
                            }else if(element.stateName==this.props.configSettings.coBorrowerDetail[1].signStatename){
                                    if(secondCoBorrower && secondCoBorrower.length>1){
                                        this.state[`show${element.stateName}Error`]=false;
                                        this.state[`show${element.stateName}${element.errorCode}`] = false;
                                        this.state[`is${element.stateName}Valid`]=true;
                                        isTempValid = true;
                                        this.setState({ IsContinue: false, isValid: true });
                                        this.state[`is${element.stateName}Valid`]=true;
                                    }else{
                                        this.state[`show${element.stateName}Error`]=false;
                                        this.state[`show${element.stateName}${element.errorCode}`] = false;
                                        this.state[`is${element.stateName}Valid`]=true;
                                        isTempValid = false;
                                        this.setState({ IsContinue: false, isValid: true });
                                        this.state[`is${element.stateName}Valid`]=true;
                                    }
                            }else{
                                isTempValid = false;
                                this.setState({ IsContinue: true, isValid: false });
                                this.state[`is${element.stateName}Valid`]=false;
                                errorCount++;
                            }  
                        }else{
                            isTempValid = false;
                            this.setState({ IsContinue: true, isValid: false });
                            this.state[`is${element.stateName}Valid`]=false;
                            errorCount++;
                        }
                       
                    } else if(element.pattern === "date") {
                        let date = this.state[`${statePrefix}${element.stateName}${stateSuffix}`];
                        let valuePattern = element.summaryInfo && element.summaryInfo.valuePattern ? element.summaryInfo.valuePattern : element.placeholder;
                        date = convertDateFormat(date, valuePattern, "MM/DD/YYYY");
                        date = date.replace(/_/g,"");
                        if(date.length < 10) {
                            isTempValid = false;
                            this.state[`show${element.stateName}Message`] = element.customMessage;
                            this.setState({ IsContinue: true,  isValid: false });
                            this.state[`show${element.stateName}Error`]=true;
                            errorCount++;
                        }
                    }
                    else
                    {
                       
                        let matchValidation = true;
                        if(element.match) {
                            matchValidation=this.handleMatch(false,null,element.match,element.value, element.name);
                            element.valid = matchValidation;
                        }
                        if(element.valid)
                        {
                            this.state[`show${element.stateName}Error`]=false;
                            this.state[`show${element.stateName}${element.errorCode}`] = false;
                            //this.setState({  IsContinue: true, isValid: true });
                            this.state[`is${element.stateName}Valid`]=true;
                        }
                        else
                        {
                            isTempValid = false;
                            errorCount++;
                            this.state[`show${element.stateName}${element.errorCode}`] = true;
                        }
                    }
                    if(element.stateName && isTempValid) {
                        isTempValid = this.handleDynamicRules(element.stateName, element);
                        if(!isTempValid) {
                            this.setState({ IsContinue: true,  isValid: false });
                            errorCount++;
                        }
                    }
                }
            }            
            else
            {
                this.setState({ IsContinue: true, isValid: true });
                this.state[`show${element.stateName}Error`]=false;
                this.state[`is${element.stateName}Valid`]=true;
            }
        });
        if(errorCount === 0) isTempValid = true; else isTempValid = false;
     return isTempValid;
    }

    renderHiddenRow(props) {
        var objectValue = ''
        var objectName='';
        var that = this;
        objectName = props.name;
        if(props.valueType === 'state')
        {
            let statePrefix = this.props.configSettings.fieldSettings.prefix;
            let stateSuffix = this.props.configSettings.fieldSettings.suffix;
            if(props.isPlain === "true") {
                objectValue = unformat(this.state[`${statePrefix}${props.value}${stateSuffix}`]);
            }else if(props.isIp === "true"){
                objectValue = this.state[`${props.value}`];
            } else {
                objectValue = this.state[`${statePrefix}${props.value}${stateSuffix}`];
            }
        }
        else if (props.valueType === 'window')
        {
            objectValue = window[props.value];
        }
        else if (props.valueType === 'configSetting')
        {
            objectValue = this.getJSONValue(this.props.configSettings,props.value);
        }
        else if (props.valueType === 'props')
        {
            objectValue = this.props[props.value];
        }
        else if (props.valueType === 'props-qs')
        {
            let objQeuryStringValue = this.props.QueryStrings.find(element => element.key=== props.value);
            objectValue = objQeuryStringValue ? objQeuryStringValue.value : '';
        }  
        else if (props.valueType === 'configNode')
        {
            let node = this.props.versionConfigSettings[props.value];
            let isAdditionalBorrower = false;
            let additionalJson=null;
            if(this.state[props.value]) {
                let jsonObj = this.createJSONObject(node, that).replace(`",}`,`"}`).replace(`],}`,`]}`);
                if(props.additionalBorrower){
                    if(this.state[props.additionalBorrower.stateName] === props.additionalBorrower.stateValue){
                        let additionalNode = this.props.versionConfigSettings[props.additionalBorrower.configNode];
                        additionalJson = this.createJSONObject(additionalNode, that).replace(`",}`,`"}`).replace(`],}`,`]}`);
                        isAdditionalBorrower = true;
                    }
                }
                if(!this.containsObject(jsonObj,this.state[props.value])) {
                    this.state[props.value].push(jsonObj);
                    if(isAdditionalBorrower)
                        this.state[props.value].push(additionalJson);
                    objectValue = `[${this.state[props.value]}]`;
                }
            } else {
                objectValue = [];
            }
        }
        else
        {
            objectValue='';
        }
        return (
            <input type="hidden" name={objectName} value={objectValue !== undefined ? objectValue : ''} />
        );
    }

    createJSONObject(node, that) {
        let jsonObject = '{';
        if(node) {
            node.filter(item => {
                var objectValue = '';
                var objectName='';
                objectName = item.name;
                if(item.valueType==='state')
                {
                    let statePrefix = that.props.configSettings.fieldSettings.prefix;
                    let stateSuffix = that.props.configSettings.fieldSettings.suffix;
                    if(that.state[`${statePrefix}${item.value}${stateSuffix}`] && item.currentFormat && item.newFormat) {
                        let upDate = convertDateFormat(that.state[`${statePrefix}${item.value}${stateSuffix}`],item.currentFormat,item.newFormat);
                        objectValue = upDate;
                    } else if(item.isPlain === "true") {
                        objectValue = unformat(that.state[`${statePrefix}${item.value}${stateSuffix}`], this.props.configSettings.fieldSettings.currencySymbol);
                    }
                    else {
                        let stateValueType = that.state[`${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`];
                        if(Array.isArray(that.state[`${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`])) {
                            objectValue = that.state[`${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`] ? that.state[`${statePrefix}${item.value}${stateSuffix}`] : [];
                        } else {
                            objectValue = that.state[`${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`] ? that.state[`${statePrefix}${item.value}${stateSuffix}`] : '';
                        }
                        
                    }
                }
                else if (item.valueType === 'window')
                {
                    objectValue = window[item.value] ? window[item.value]: '' ;
                }
                else if (item.valueType === 'props')
                {
                    objectValue = that.props[item.value] ? that.props[item.value] : '';
                }
                else if (item.valueType === 'props-qs')
                {
                    objectValue = that.props.QueryStrings[item.value] ? that.props.QueryStrings[item.value] : '';
                }
                else if (item.valueType === 'configSetting')
                {
                    objectValue = this.getJSONValue(this.props.configSettings,item.value);
                }
                else if (item.valueType === 'configNode')
                {
                    let subNode = that.props.versionConfigSettings[item.value];
                    if(that.state[item.value]) {
                        let jsonObj = that.createJSONObject(subNode, that).replace(`",}`,`"}`).replace(`],}`,`]}`);
                        if(!that.containsObject(jsonObj,that.state[item.value])) {
                            that.state[item.value].push(jsonObj);
                            objectValue = `[${that.state[item.value]}]`;
                        }
                    } else {
                        objectValue = [];
                    }
                } else {
                    objectValue='';
                }

                if (item.valueType === 'configNode') {
                    jsonObject += `"${objectName}":${objectValue !== undefined ? objectValue : ''},`;
                } else {
                    jsonObject += `"${objectName}":"${objectValue !== undefined ? objectValue : ''}",`;
                }
            });
        }
        return jsonObject + '}';
    }

    containsObject(obj, list) {
        var x;
        for (x in list) {
            if (list.hasOwnProperty(x) && list[x] === obj) {
                return true;
            }
        }
        return false;
    }

    render() {

        const uuid = typeof window.uuid === typeof undefined ? '' : window.uuid;
        let version = this.props.filteredVersion;
        let pages = this.GetPagesByVersion(this.state.bifurcatedPageArray);
        let currentPages = this.GetCurrentPage(pages);
        let filteredPage = this.GetFilteredData(this.props.versionConfigSettings.questions, this.state.currentPage);
        
        let progressbar = this.GetProgressbarElements();
        let isSubmitForm = filteredPage && filteredPage.submitForm && filteredPage.submitForm !== undefined && filteredPage.submitForm === true ? true : false;  
        return (
            <div className={this.props.configSettings.css.mainContainer.container}>
                {/* <!--Header section --> */}
                <section id="headersection">
                    <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                        <div className={`${this.props.configSettings.css.mainContainer.row.centerBlock.centerBlockPanel} ${this.state.currentPage > 1 ? this.props.configSettings.css.mainContainer.row.centerBlock.centerBlockMargin : ''}`}>
                            <div className={this.props.configSettings.css.mainContainer.row.centerBlock.mainBox} id="mainbox">
                                <div className={this.props.configSettings.css.mainContainer.row.centerBlock.mainBoxContent} id="mainboxcontent">
                                    <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                                        <div>
                                            {this.state.showLenderImage ?
                                                <div className={this.props.configSettings.css.mainContainer.row.centerBlock.logo.logoPanel}> <img className={this.props.configSettings.css.mainContainer.row.centerBlock.logo.logoContent} src={this.state.showLenderImage} alt="" /> </div>
                                                : ''
                                            }
                                        </div>
                                        <div className={this.props.configSettings.css.mainContainer.row.centerBlock.progressBar.progressBarContainer}>
                                            <ul className={this.props.configSettings.css.mainContainer.row.centerBlock.progressBar.progressBar} dangerouslySetInnerHTML={{ __html: `${progressbar}` }}></ul>
                                            <span className={`${this.props.configSettings.css.mainContainer.row.centerBlock.progressBar.progressBarText}  ${this.props.currentDevice === 'Mobile' ? this.state.currentPage === 3 || this.state.currentPage === 10 ? this.props.configSettings.css.mainContainer.row.centerBlock.progressBar.progressBarMargin : '' : ''}`} >{this.props.configSettings.formSettings.progressText}</span>
                                        </div>
                                    </div>
                                    <form action={`${filteredPage && filteredPage.formPostURL ? filteredPage.formPostURL : ''}`} name="createacc2" id={this.props.configSettings.formSettings.name} disable-btn="" encType={(window.formSubmissionCount)?"multipart/form-data":""} className="app-form" method="POST">
                                        { (isSubmitForm || formFields.formPostURL !== '') &&
                                            this.state.hiddenFieldsArray
                                        }
                                    
                                        {
                                            (filteredPage.backBtn !== undefined && filteredPage) ?
                                            <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                                                <div className={` button-align col-sm-5 col-xs-5 col-lg-3 col-md-3`}>
                                                    <button type="button" className={`btn bc-primary`} onClick={(e) => {
                                                        let updated = 0;
                                                        let pageNo = window.location.pathname.replace(`${window.curentstate.props.configSettings.formSettings.urlPath}`, '');
                                                        console.log(pageNo)
                                                        if(pageNo === "5" && (this.state['HousingStatusValue'] === 'OWN_NO_MORTGAGE' || this.state['HousingStatusValue'] === 'LIVING_RENT_FREE')){
                                                            updated = parseInt(pageNo, 10)-2;
                                                        }else{
                                                            updated = parseInt(pageNo, 10)-1;
                                                        }

                                                        // updated = parseInt(pageNo, 10)-1;

                                                        window.history.pushState("", "", `${this.props.configSettings.formSettings.urlPath}${updated}`);
                                                        this.BrowserBack(e, updated)
                                                    }} >&laquo; Back</button>
                                                </div>
                                            </div> :
                                            <div></div>
                                        }
                                        
                                        
                                        <div id="breadcrumb-preloader-preloader">
                                            <div id="preloader" className={`${this.props.configSettings.css.mainContainer.row.centerBlock.breadcrumbPreloaderContent.contentBox} ${filteredPage.extendWidth && this.props.currentDevice !== 'Mobile' ? this.props.configSettings.css.mainContainer.row.centerBlock.breadcrumbPreloaderContent.contentBoxMargin : '' }`}>  
                                                <div key={`title-div-${filteredPage.pageNumber}`} className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                                                    {filteredPage.titleClass !== undefined ? <div className={filteredPage.titleClass}>
                                                        <h2 className={this.props.configSettings.css.mainContainer.row.centerBlock.breadcrumbPreloaderContent.title}>{filteredPage.title}</h2>
                                                    </div> : ""}
                                                    {currentPages}
                                                </div>
                                        
                                                {filteredPage.type === 'button' || filteredPage.type === 'fa-button' || filteredPage.type === 'bank-link' || filteredPage.type === 'summary' || this.state.currentPage === this.state.TotalPages || (filteredPage.isContinue !== undefined && filteredPage.isContinue === false)   ? '' :
                                                    this.props.currentDevice !== 'Mobile' && filteredPage.showActionButton !== 'no' &&
                                                    <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                                                        <div className={` ${this.props.configSettings.css.mainContainer.row.centerBlock.breadcrumbPreloaderContent.prequalifyButtonContainer}  ${filteredPage.prequalifyButtonClass !== undefined ? filteredPage.prequalifyButtonClass : ''}`}>{
                                                                filteredPage.customBTN !== undefined && filteredPage.customBTN === true  
                                                                ?
                                                                <button type="button" id="viewpreqoffers" tabIndex={this.state.currentPage + 1} name="viewpreqoffersd" className={this.props.configSettings.css.button.field} disabled={`${!this.state.IsContinue ? '' : 'disabled'}`} onClick={this.Continue.bind(this)} >{filteredPage.customButtonText}</button> 
                                                                :
                                                                <button type="button" id="viewpreqoffers" tabIndex={this.state.currentPage + 1} name="viewpreqoffersd" className={this.props.configSettings.css.button.field} disabled={`${!this.state.IsContinue ? '' : 'disabled'}`} onClick={this.Continue.bind(this)} >{this.state.buttonText}</button>
                                                            }
                                                            {/* <button type="button" id="viewpreqoffers" tabIndex={this.state.currentPage + 1} name="viewpreqoffersd" className={this.props.configSettings.css.button.field} disabled={`${!this.state.IsContinue ? '' : 'disabled'}`} onClick={this.Continue.bind(this)} >{this.state.buttonText}</button> */}
                                                        </div>
                                                    </div>
                                                }
                                                
                                                {this.state.showModal && (this.state.currentPage === this.state.TotalPages || this.state.IsAdditionalBorrower !== "Yes") &&
                                                    <div id="" className={`${this.props.configSettings.css.modalPopup.container} ${this.state.showModal ? this.props.configSettings.css.modalPopup.class : ''}`}>
                                                        <div className={this.props.configSettings.css.modalPopup.contentContainer}>
                                                            <div className={this.props.configSettings.css.modalPopup.wrapper}>
                                                                <div className={this.props.configSettings.css.modalPopup.logo}>
                                                                    <img src={this.props.configSettings.modalTransitionPage.logo} alt={this.props.configSettings.modalTransitionPage.theme_name} width= "250px" />
                                                                </div>
                                                                <div className={this.props.configSettings.css.modalPopup.content}>
                                                                    {this.props.currentDevice === 'Mobile' ?
                                                                        <h4>{this.props.configSettings.modalTransitionPage.content}</h4>
                                                                        :
                                                                        <h1>{this.props.configSettings.modalTransitionPage.content}</h1>
                                                                    }
                                                                </div>
                                                                <div className={`${this.props.currentDevice === 'Mobile' ? this.props.configSettings.css.modalPopup.refreshPanelMobile : this.props.configSettings.css.modalPopup.refreshPanel}`}>
                                                                    <i className={this.props.configSettings.css.modalPopup.refreshIcon}></i>
                                                                </div>

                                                                <div className={this.props.configSettings.css.modalPopup.loaderContent}>
                                                                {this.state.loaderContent === '' ?
                                                                    <p>&nbsp;</p> : <p>{this.state.loaderContent}</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    this.state.isFetchInProgress &&
                                                    <div id="" className={`${this.props.configSettings.css.modalPopup.container} ${this.state.isFetchInProgress ? this.props.configSettings.css.modalPopup.class : ''}`}>
                                                        <div className={this.props.configSettings.css.modalPopup.contentContainer}>
                                                            <div className={this.props.configSettings.css.modalPopup.wrapper}>
                                                                <div className={this.props.configSettings.css.modalPopup.logo}>
                                                                    <img src={this.props.configSettings.modalTransitionPage.logo} alt={this.props.configSettings.modalTransitionPage.theme_name} width= "250px" />
                                                                </div>
                                                                <div className={this.props.configSettings.css.modalPopup.Modalcontent}>
                                                                    <h4 className="alignCenter" dangerouslySetInnerHTML={{ __html: `${this.state.loaderMessage}` }}></h4>
                                                                </div>
                                                                <div className={`${this.props.currentDevice === 'Mobile' ? this.props.configSettings.css.modalPopup.refreshPanelMobile : this.props.configSettings.css.modalPopup.refreshPanel}`}>
                                                                    <i className={this.props.configSettings.css.modalPopup.refreshIcon}></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    this.state.isDynamicModalPopup &&
                                                    <div id="" className={`${this.props.configSettings.css.modalPopup.container} ${this.state.isDynamicModalPopup ? this.props.configSettings.css.modalPopup.class : ''}`}>
                                                        <div className={this.props.configSettings.css.modalPopup.contentContainer}>
                                                            <div className={this.props.configSettings.css.modalPopup.wrapper}>
                                                                <div className={this.props.configSettings.css.modalPopup.logo}>
                                                                    <img src={this.props.configSettings.modalTransitionPage.logo} alt={this.props.configSettings.modalTransitionPage.theme_name} width= "250px" />
                                                                </div>
                                                                <div className={this.props.configSettings.css.modalPopup.content}>
                                                                    <div className={this.props.configSettings.css.login.thankyouModaltext} dangerouslySetInnerHTML={{ __html: `${this.state.dynamicModalPopupContent}` }}></div>
                                                                </div>
                                                                <div className={this.props.configSettings.css.modalPopup.buttonwidth}>
                                                                    <button className={this.props.configSettings.css.button.field} type="button" value={this.state.dynamicModalPopupButtonText} onClick={this.onCloseDynamicModal.bind(this)}>{this.state.dynamicModalPopupButtonText}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.phpErrorMessages && this.state.phpErrorMessages != '' &&
                                                    <div className="error-height">
                                                        <span className={`formerror top-margin-error-message has-error-mac`} >{this.state.phpErrorMessages}</span>
                                                    </div>
                                                }
                                                {this.state.showInvalidAddressModal &&
                                                    <div id="popupModal" className={`${this.props.configSettings.css.modalPopup.container} ${this.state.showInvalidAddressModal ? this.props.configSettings.css.modalPopup.class : ''}`}>
                                                        <div className={this.props.configSettings.css.modalPopup.contentContainer}>
                                                            <div className={this.props.configSettings.css.modalPopup.wrapperAddress}>
                                                                <div className={this.props.configSettings.css.modalPopup.content}>
                                                                    <p>We have yet to open for business in your selected state. Please check back later.</p>
                                                                </div>
                                                                <button value="Close" className={this.props.configSettings.css.button.field} onClick={this.closePopup.bind(this)} > CLOSE</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {/* {this.state.showStateLoanAmountModal &&
                                                    <div id="popupModal" className={`${this.props.configSettings.css.modalPopup.container} ${this.state.showStateLoanAmountModal ? this.props.configSettings.css.modalPopup.class : ''}`}>
                                                        <div className={this.props.configSettings.css.modalPopup.contentContainer}>
                                                            <div className={this.props.configSettings.css.modalPopup.wrapperAddress}>
                                                                <div className={this.props.configSettings.css.modalPopup.content}>
                                                                    <p>The minimum loan amount for {this.state.selectedState} is $2,000. Please adjust your loan amount.</p>
                                                                </div>
                                                                <button value="Close" className={this.props.configSettings.css.button.field} onClick={this.closePopup.bind(this)} > CLOSE</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                } */}
                                            </div>
                                            {filteredPage.type === 'button' || filteredPage.type === 'fa-button' || this.state.currentPage === this.state.TotalPages || filteredPage.type === 'summary' || filteredPage.type === 'bank-link' || filteredPage.type === 'docusign' ? '' : this.props.currentDevice === 'Mobile'  &&
                                                <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                                                    <div className={` button-align col-sm-12 col-xs-12`}>
                                                        <button type="button" id="viewpreqoffers" name="viewpreqoffers" className={` btn bc-primary ${this.state.currentPage === 3 || this.state.currentPage === 10 ? 'updated-margin' : ''} `} disabled={`${!this.state.IsContinue ? '' : 'disabled'}`} onClick={this.Continue.bind(this)} >{this.state.buttonText}</button>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                (filteredPage.includeNote !== undefined && filteredPage.includeNote) ?
                                                <p className="alignCenter">{filteredPage.note}</p> : ''
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