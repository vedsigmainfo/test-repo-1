import React, { Component } from "react";
import { CallGAEvent } from "./Validation/GoogleAnalytics.js";
import BCButtonField from "./BCButtonField";
import FAButtonField from "./FAButtonField";
import BCSingleButtonField from "./BCSingleButtonField";
import { validate } from "./Validation/validate";
import axios from "axios";
import {
  calculateAge,
  unFormatAmount,
  unformat,
  unformatwithoutspace,
  convertDateFormat,
  AddDate,
  MathsCalculator,
  AmountFormatting,
  GetSSNMask,
  GetPhoneMask,
} from "./Validation/RegexList";
import BCLabelField from "./BCLabelField";
import { SendEmail } from "./EmailFunctions";
import SPTextField from "./SPTextField";
import SPSelectField from "./SPSelectField";
import SPMaskedTextField from "./SPMaskedTextField";
import SPMaskedTextCheckBoxField from "./SPMaskedTextCheckBoxField";
import $, { getJSON } from "jquery";

var autocomplete = [];
var componentForm = {
  street_number: "long_name",
  route: "long_name",
  locality: "long_name",
  postal_town: "long_name",
  administrative_area_level_1: "long_name",
  country: "long_name",
  postal_code: "short_name",
  intersection: "long_name",
};
class ConfigurableSummaryPage extends Component {
  constructor(props) {
    super(props);
    // this.BrowserBack = this.BrowserBack.bind(this);
    // this.BrowserForward = this.BrowserForward.bind(this);
    /** Declared function to call dynamic in custom validation for external validation*/

    this.validateCityStateZipAjax = this.ValidateCityStateZipAjax.bind(this);
    this.commonValidateAPIAJAX = this.CommonValidationAPIAjax.bind(this);
    this.funcMap = {
      commonValidateAPIAJAX: this.commonValidateAPIAJAX,
      validateCityStateZipAjax: this.validateCityStateZipAjax,
    };
    this.state = {
      hiddenFieldsArray: [],
      initialiseAutoComplete: true,
      phpErrorMessages: "",
      employmentInformation: [],
      loaderMessage: "",
      formSubmissionCount: this.props.formSubmissionCount,
      currentPage: 1,
      IsSummaryPageEdit: false,
      ShowErrorMessage: false,
      consentMessage: false,
      autoCompleteRendered: [],
    };
  }
  ShowLoanAppForm() {
    this.setState({ IsSummaryPageEdit: true });
    window.scrollTo(0, 0);
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    var focusOut = this.props.configSettings.formSettings.defaultFocus;
    let that = this;
    this.state.Pages.forEach((element) => {
      if (
        element.props.formFields &&
        element.props.formFields.autoComplete &&
        element.props.formFields.summaryInfo &&
        element.props.formFields.summaryInfo.editable
      ) {
        let groupQuestion = this.props.versionConfigSettings.questions.filter(
          (x) =>
            x.isAddressGroup === true &&
            (x.id === element.props.formFields.id ||
              (x.summaryInfo &&
                x.summaryInfo.parentId === element.props.formFields.id))
        );
        setTimeout(() => {
          that.initAutocomplete(element.props.formFields, groupQuestion);
        }, 500);
      }
      if (
        element.props.formFields.showCheckbox === true &&
        that.state[
          `${statePrefix}${element.props.formFields.stateName}${stateSuffix}`
        ] === ""
      ) {
        that.state[`is${element.props.formFields.stateName}Valid`] = true;
        that.state[element.props.formFields.checkBoxStateName] = true;
        setTimeout(() => {
          if (document.getElementById(`chk-${element.props.formFields.name}`)) {
            document.getElementById(
              `chk-${element.props.formFields.name}`
            ).checked = true;
            that.state[element.props.checkBoxStateName] = true;
            document.getElementById(
              `${element.props.formFields.name}`
            ).disabled = true;
          } else {
            that.state[element.props.checkBoxStateName] = false;
          }
          that.state[element.props.formFields.checkBoxDisabledStateName] = true;
        }, 1000);
      }
      if (
        element.props.formFields &&
        element.props.formFields.summaryInfo &&
        element.props.formFields.summaryInfo.editable
      ) {
        setTimeout(() => {
          that.handleDynamicFieldDisabled(element.props.formFields);
        }, 1000);
      }
    });
    document.getElementById(focusOut).focus();
  }
  /**Get the value from the state */
  getValue(type, fieldName) {
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    let fullPostData =
      this.props.PostDataEX && this.props.PostDataEX.request
        ? this.props.PostDataEX.request
        : undefined;
    let summaryType =
      type.summaryInfo !== undefined ? type.summaryInfo.postData : "";
    if (summaryType !== "") {
      type = summaryType;
    }
    if (type == "State") {
      return this.state[`${statePrefix}${fieldName}${stateSuffix}`] ===
        undefined
        ? this.state[`${fieldName}`]
        : this.state[`${statePrefix}${fieldName}${stateSuffix}`];
    } else if (type == "Prop") {
      return this.props[fieldName];
    } else if (type === "Window") {
      return this.window[fieldName];
    } else {
      return this.getJSONValue(fullPostData, type);
    }
  }
  /* This function will accept JSON object and path to the attribute to get value of given attribute */
  getJSONValue(theObject, path) {
    try {
      return path
        .replace(/\[/g, ".")
        .replace(/\]/g, "")
        .split(".")
        .reduce(function (obj, property) {
          return obj[property];
        }, theObject);
    } catch (err) {
      return undefined;
    }
  }
  setJSONValue(theObject, path, value, fiedlName) {
    try {
      return path
        .replace(/\[/g, ".")
        .replace(/\]/g, "")
        .split(".")
        .reduce(function (obj, property) {
          if (property == fiedlName) obj[property] = value;
          return obj[property];
        }, theObject);
    } catch (err) {
      return undefined;
    }
  }
  /* This method will loop through summary page sections and also render rows for that sections*/
  renderSummarySections(section, pages) {
    const filterredPages = pages.filter((page) => {
      return (
        page.props.formFields.summarySection === section.name &&
        section.isVisible
      );
    });
    let showSection = this.getJSONValue(
      this.props.PostDataEX.request,
      section.postData
    );
    return (
      <span key={section.name}>
        {section.isVisible && showSection !== undefined && (
          <div key={section.name} className={section.cssClass}>
            <h4 className="summaryPage-leftalign">{section.title}</h4>
            <div
              className={`${
                section.name === "LoanInformation"
                  ? "row offerdetail offerdetailborder"
                  : "row"
              } `}
            >
              {filterredPages.map((page, index) => {
                if (page.props.formFields.hideSummary != undefined || page.props.formFields.hideSummary) {
                   if (this.props.configSettings.allowedEmployeInfo !== undefined &&
                    this.props.configSettings.allowedEmployeInfo.find((elem) => elem == this.props.PostDataEX.request.borrowers[0].employmentStatus) != undefined
                  ) {
                    return this.renderRow(page.props, section, index);
                  } 
                }else{
                    return this.renderRow(page.props, section, index);
                }
              })}
            </div>
          </div>
        )}
      </span>
    );
  }
  getMaskedValue(values, field) {
    if (field.pattern === "phone") {
      values = GetPhoneMask(values);
    } else if (field.pattern === "ssn") {
      values = GetSSNMask(values);
      if (values && values.length === 11) {
        values = `XXX-XX-${values.substr(values.length - 4)}`;
      }
    } else if (field.pattern === "date" && field.summaryInfo.postDataPattern) {
      values = convertDateFormat(
        values,
        field.summaryInfo.postDataPattern,
        field.summaryInfo.valuePattern
      );
      if (values === "" && field.showCheckbox) {
        values = field.currentPositionText;
      }
    }
    if (field.isNumber) {
      values = unFormatAmount(
        values,
        this.props.configSettings.fieldSettings.currencySymbol,
        field.thousandSeparator
      );
      if (values !== undefined && values !== "") {
        values =
          this.props.configSettings.fieldSettings.currencySymbol +
          AmountFormatting(values, field.thousandSeparator);
      } else {
        values =
          this.props.configSettings.fieldSettings.currencySymbol +
          field.defaultValue;
      }
    }
    if (field.listItem && field.listItem !== "") {
      let item = this.props.configSettings[field.listItem].find(
        (o) => o.key.toLowerCase() === values.toLowerCase()
      );
      if (item && item !== undefined) {
        if (field.type === "fa-button") {
          values = item.label.replace(
            this.props.configSettings.formSettings.listItemHtmlSpace,
            ""
          );
        } else {
          values = item.label;
        }
      }
    }
    return values;
  }
  /*This method will render question with label and value on summary page for given secction*/
  renderRow(props, section, index) {
    var field = props.formFields;
    var values = this.getValue(field, "");
    if (values !== undefined) {
      if (typeof values === "string") {
        values = values.replace(/\\/g, "");
      }
      values = this.getMaskedValue(values, field);
    }
    if (field.summarySection === section.name) {
      let prefix = field.summaryInfo.prefix;
      let suffix = field.summaryInfo.suffix;
      let page = this.state.Pages.find(
        (pg) => pg.props.formFields.id === field.id
      );

      return (
        <span key={index}>
          {this.state.IsSummaryPageEdit &&
          field.summaryInfo !== undefined &&
          !field.summaryInfo.isConsent &&
          section.name !== "LoanInformation" ? (
            <span key={index}>{page}</span>
          ) : this.state.IsSummaryPageEdit &&
            field.summaryInfo !== undefined &&
            !field.summaryInfo.isConsent &&
            section.name === "LoanInformation" ? (
            <div>
              <div className={`${field.summaryInfo.titleCSS}`}>
                {field.summaryInfo.title &&
                field.summaryInfo.title !== undefined &&
                field.summaryInfo.title.length > 0 ? (
                  <b className="labelstyle">{field.summaryInfo.title}</b>
                ) : (
                  <b>&nbsp;</b>
                )}
              </div>
              <div className={`${field.summaryInfo.titleCSS}`}>
                {values && values !== undefined && values.length > 0 ? (
                  <b className="labelstyleBold">
                    {prefix && prefix !== "" ? prefix : ""}
                    {values}
                    {suffix && suffix !== "" ? suffix : ""}
                  </b>
                ) : (
                  <b>&nbsp;</b>
                )}
              </div>
            </div>
          ) : this.state.IsSummaryPageEdit &&
            field.summaryInfo !== undefined &&
            field.summaryInfo.isConsent === true ? (
            <div className={`${field.summaryInfo.titleCSS}`}>
              <label htmlFor={field.name} className={"adaCompliance"}>
                {field.name}
              </label>
              <input
                className={`checkbox pre-checkbox `}
                id={`${field.name}`}
                type="checkbox"
                value={this.state[`${prefix}${field.stateName}${suffix}`]}
                tabIndex="1"
                onChange={this.handleConsentChange.bind(this, field)}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: `${field.summaryInfo.title}`,
                }}
              ></span>
            </div>
          ) : (
            ""
          )}
          {!this.state.IsSummaryPageEdit &&
          field.summaryInfo !== undefined &&
          !field.summaryInfo.isConsent ? (
            <div>
              <div>
                <div className={`${field.summaryInfo.titleCSS}`}>
                  {field.summaryInfo.title &&
                  field.summaryInfo.title !== undefined &&
                  field.summaryInfo.title.length > 0 ? (
                    <b className="labelstyle">{field.summaryInfo.title}</b>
                  ) : (
                    <b>&nbsp;</b>
                  )}
                </div>
                <div className={`${field.summaryInfo.titleCSS}`}>
                  {values && values !== undefined && values.length > 0 ? (
                    <b className="labelstyleBold">
                      {prefix && prefix !== "" ? prefix : ""}
                      {values}
                      {suffix && suffix !== "" ? suffix : ""}
                    </b>
                  ) : (
                    <b>&nbsp;</b>
                  )}
                </div>
              </div>
            </div>
          ) : !this.state.IsSummaryPageEdit &&
            field.summaryInfo !== undefined &&
            field.summaryInfo.isConsent === true ? (
            <div className={`${field.summaryInfo.titleCSS}`}>
              <label htmlFor={field.name} className={"adaCompliance"}>
                {field.name}
              </label>
              <input
                className={`checkbox pre-checkbox `}
                id={`${field.name}`}
                type="checkbox"
                value={this.state[`${prefix}${field.stateName}${suffix}`]}
                tabIndex="1"
                onChange={this.handleConsentChange.bind(this, field)}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: `${field.summaryInfo.title}`,
                }}
              ></span>
            </div>
          ) : (
            ""
          )}
        </span>
      );
    } else return "";
  }

  handleConsentChange(field, event) {
    let that = this;
    let consents = that.props.versionConfigSettings.questions.filter(
      (consent) => consent.summaryInfo && consent.summaryInfo.isConsent === true  && consent.summaryInfo.isMandatoryConsent === true 
    );
    let borrowerCount = 0;
    let coBorrowerCount = 0;
    consents.forEach((borrower, index) => {
      let consent = consents[index];
      if (
        consent &&
        consent["name"] !== undefined &&
        document.getElementById(consent.name)
      ) {
        if (document.getElementById(consent.name).checked === false) {
          that.state[`is${consent.stateName}Valid`] = false;
          if (index === 0) {
            borrowerCount++;
          } else {
            coBorrowerCount++;
          }
        }
      }
    });
    if (borrowerCount > 0 || coBorrowerCount > 0) {
      this.setState({ consentMessage: true });
    } else {
      this.setState({ consentMessage: false });
    }
  }
  /** function to filter post data with list items*/
  getFilteredList = (listItem, value) => {
    let list = this.props.configSettings[listItem];
    if (list) {
      const filteredList = list.filter((lp) => {
        if (this.props[value] && this.props[value] !== undefined) {
          return (
            (lp.plKey.toLowerCase() === this.props[value].toLowerCase() ||
              lp.key.toLowerCase() === this.props[value].toLowerCase()) &&
            this.props[value].length > 0
          );
        } else if (this.props.PostDataEX && this.props.PostDataEX[value]) {
          return (
            (lp.plKey.toLowerCase() ===
              this.props.PostDataEX[value].toLowerCase() ||
              lp.key.toLowerCase() ===
                this.props.PostDataEX[value].toLowerCase()) &&
            this.props.PostDataEX[value].length > 0
          );
        }
        return filteredList;
      });
      return filteredList;
    }
  };
  /** function to get querystring parameters value by passing querystring name */
  getQueryStringValueByName(name) {
    let value = "";
    this.props.QueryStrings.filter((qs) => {
      if (name && qs.key === name) {
        value = qs.value;
      }
    });
    return value;
  }
  /** function to initialise dynamic state variales */
  initialiseInitialState() {
    const version = this.props.filteredVersion;
    let questionnaire =
      this.props.versionConfigSettings.versions[0].summaryQuestions;
    let defaultState = this.props.versionConfigSettings.defaultState;
    if (questionnaire && questionnaire.length > 0) {
      questionnaire.forEach((element) => {
        let customFormFields = this.GetFilteredQuestions(element);
        if (customFormFields.type === "group") {
          customFormFields.subquestions.forEach((subQuestion) => {
            let subCustomFormFields = this.GetFilteredQuestions(subQuestion);
            this.intialiseQuestionState(subCustomFormFields);
          });
        } else {
          this.intialiseQuestionState(customFormFields);
        }
      });
    }
    if (defaultState && defaultState.length > 0) {
      defaultState.forEach((state) => {
        if (state.dataType === "string") {
          this.state[`${state.name}`] = state.value;
        } else if (state.dataType === "bool") {
          this.state[`${state.name}`] = state.value === "true" ? true : false;
        } else if (state.dataType === "number") {
          this.state[`${state.name}`] =
            state.value && state.value !== "" ? parseInt(state.value) : 0;
        } else if (state.dataType === "array") {
          this.state[`${state.name}`] = [];
        } else if (state.dataType === "select-array") {
          this.state[`${state.name}`] = [
            { key: state.key, text: state.value, label: state.value, index: 0 },
          ];
        } else if (state.dataType === "configSetting") {
          this.state[`${state.name}`] = this.getJSONValue(
            this.props.configSettings,
            state.value
          );
        }
      });
    }
  }
  /** initialise individual question state */
  intialiseQuestionState = (customFormFields) => {
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    let fullPostData = this.props.PostDataEX && this.props.PostDataEX.request;
    let postData =
      customFormFields.summaryInfo !== undefined
        ? customFormFields.summaryInfo.postData
        : "";
    let value = this.getJSONValue(fullPostData, postData);

    if (value && value !== undefined) {
      if (
        customFormFields.pattern === "date" &&
        customFormFields.summaryInfo.postDataPattern
      ) {
        value = convertDateFormat(
          value,
          customFormFields.summaryInfo.postDataPattern,
          customFormFields.summaryInfo.valuePattern
        );
        this.state[
          `${statePrefix}${customFormFields.stateName}${stateSuffix}`
        ] = value;
        if (customFormFields.showCheckbox && value === "") {
          this.state.checkBoxStateName = true;
          if (document.getElementById(`chk-${customFormFields.name}`)) {
            document.getElementById(
              `chk-${customFormFields.name}`
            ).checked = true;
          }
        } else {
          this.state.checkBoxStateName = false;
          if (document.getElementById(`chk-${customFormFields.name}`)) {
            document.getElementById(
              `chk-${customFormFields.name}`
            ).checked = false;
          }
        }
      } else {
        this.state[
          `${statePrefix}${customFormFields.stateName}${stateSuffix}`
        ] = decodeURIComponent(value);
        this.state[`is${customFormFields.stateName}Valid`] = true;
        this.state[`show${customFormFields.stateName}Error`] = false;
      }
      customFormFields.valid = true;
      customFormFields.value = decodeURIComponent(value);
    } else {
      this.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] =
        "";
    }
  };
  /** onKeyPress - continue with flow on enter key */
  onKeyPress = (e) => {
    if (e.which === 13 && e.target.id.toLowerCase().indexOf("address1") < 0) {
      this.ContinueSummary(e);
    }
  };

  componentDidMount() {
    // initialise dynamic state variables
    this.state.formSubmissionCount = this.props.formSubmissionCount;
    this.initialiseInitialState();
    this.setState({ formControls: this.props.versionConfigSettings.questions });
    this.getIPAddress();
    this.state.TotalPages = this.props.filteredVersion[0].questions.length;
    this.state.QuestionsIds =
      this.props.versionConfigSettings.versions[0].summaryQuestions;
    this.setState({ currentPage: 1, IsSummaryPageEdit: false });
    this.state.currentPage = 1;

    //window.curentstate = this;
    this.props.PostDataEX.request.transactionType =
      this.props.formFields.transactionType;
    this.state.errorCount = 0;
    // window.onpopstate = function (event) {
    //     //return;
    //     var current = window.curentstate.state.currentPage;
    //     var updated = 0;
    //     let pageNo = window.location.pathname.replace(`${window.curentstate.props.configSettings.formSettings.urlPath}`, '');
    //     updated = parseInt(pageNo, 10);
    //     if (current > updated) {
    //         window.curentstate.BrowserBack(event, updated);
    //     } else {
    //         window.curentstate.BrowserForward(event, updated);
    //     }
    // }
  }

  // componentDidUpdate(){
  //     if(this.state.formSubmissionCount !== 0 && this.state.initialiseAutoComplete) {
  //         this.state.initialiseAutoComplete = false;
  //         let questions = this.props.versionConfigSettings.versions[0].question;
  //         let pageOne = null;
  //         let addressQuestions = [];
  //         let autoCompleteQuestion = [];
  //         if(questions && questions.length > 0)
  //             pageOne = questions[0];
  //         if(pageOne !== null){
  //             let customFormFields = this.GetFilteredQuestions(pageOne);
  //             if(customFormFields.type === 'group'){
  //                 customFormFields.subquestions.forEach(element => {
  //                     let subField = this.GetFilteredQuestions(element);
  //                     if(subField.autoComplete === true)
  //                         autoCompleteQuestion.push(subField);
  //                     if(subField.isAddressGroup === true)
  //                         addressQuestions.push(subField);
  //                 });
  //             }
  //             else{
  //                 addressQuestions = questions.filter(x=>x.isAddressGroup === true);
  //                 autoCompleteQuestion = questions.filter(x=>x.isAddressGroup === true && x.autoComplete === true);
  //             }
  //         }
  //         if(autoCompleteQuestion && autoCompleteQuestion.length > 0 && addressQuestions && addressQuestions.length > 0)
  //             this.initAutocomplete(autoCompleteQuestion[0], addressQuestions);
  //     }
  // }

  /** Returns the pascal case for a given string */
  GetPascalCase(str) {
    //str = str.replace(/(\w)(\w*)/g,
    //  function(g0,g1,g2){ return g1.toUpperCase() + g2;});
    return str;
  }
  /** Returns the page count for a question based on form submission count */
  getPageCount(filteredVersion, formSubmissionCount) {
    if (formSubmissionCount === 0) return 1;
    else {
      let pageCount = 1;
      for (var i = 0; i < formSubmissionCount; i++) {
        pageCount = pageCount + filteredVersion[i].length;
      }
      return pageCount;
    }
  }
  /** Returns the pages based on the selected version */
  GetPagesByVersion() {
    let pageArray = [];
    let questions =
      this.props.versionConfigSettings.versions[0].summaryQuestions;
    if (questions && questions.length > 0) {
      let pageCount = this.getPageCount(
        questions,
        this.state.formSubmissionCount
      );
      questions.forEach((element) => {
        let customFormFields = this.GetFilteredQuestions(element);
        customFormFields.pageNumber = pageCount;
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;
        let state =
          this.state[
            `${statePrefix}${customFormFields.stateName}${stateSuffix}`
          ];
        let showError = this.state[`is${customFormFields.stateName}Valid`];
        let showErrorMessage =
          this.state[`show${customFormFields.stateName}Error`];
        let showCodeErrorMessage =
          this.state[
            `show${customFormFields.stateName}${customFormFields.errorCode}`
          ];
        let customMessage =
          this.state[`show${customFormFields.stateName}Message`];
        let isDisabled = this.state[customFormFields.checkBoxDisabledStateName];
        let checkboxValue = this.state[customFormFields.checkBoxStateName];
        if (
          customFormFields.isContinue &&
          customFormFields.isContinue == false
        ) {
          this.setState({ IsContinue: false });
        }
        let summaryInfo =
          customFormFields.summaryInfo && customFormFields.summaryInfo
            ? customFormFields.summaryInfo
            : undefined;
        let type =
          summaryInfo && summaryInfo.controlType ? summaryInfo.controlType : "";
        if (type && summaryInfo !== undefined) {
          // push the pages in array based on the question type
          if (type === "dropdown") {
            let customListItems = this.GetListItems(customFormFields);
            let page = this.GetDropdownPage(
              customListItems,
              customFormFields,
              state,
              showError,
              showErrorMessage,
              showCodeErrorMessage,
              customFormFields.name
            );
            pageArray.push(page);
          } else if (
            type === "text" ||
            customFormFields.type === "text-to-arry"
          ) {
            let page = this.GetTextPage(
              customFormFields,
              state,
              showError,
              showErrorMessage,
              showCodeErrorMessage,
              customMessage,
              customFormFields.name
            );
            pageArray.push(page);
          } else if (type === "button") {
            let customListItems = this.GetListItems(customFormFields);
            let page = this.GetButtonPage(
              customListItems,
              customFormFields,
              state,
              showError,
              showErrorMessage,
              customFormFields.name
            );
            pageArray.push(page);
          } else if (type === "fa-button") {
            let customListItems = this.GetListItems(customFormFields);
            let page = this.GetFAButtonPage(
              customListItems,
              customFormFields,
              state,
              showError,
              showErrorMessage,
              customFormFields.name
            );
            pageArray.push(page);
          } else if (type === "singlebutton") {
            let page = this.GetSingleButtonPage(
              customFormFields,
              state,
              showError,
              showErrorMessage,
              showCodeErrorMessage,
              customFormFields.name
            );
            pageArray.push(page);
          } else if (type === "masked-text") {
            let page = this.GetMaskedTextPage(
              customFormFields,
              state,
              showError,
              showErrorMessage,
              showCodeErrorMessage,
              customMessage,
              customFormFields.name,
              isDisabled,
              checkboxValue
            );
            pageArray.push(page);
          } else if (type === "masked-text-check-box") {
            let page = this.GetMaskedTextCheckBoxPage(
              customFormFields,
              state,
              showError,
              showErrorMessage,
              showCodeErrorMessage,
              customMessage,
              customFormFields.name,
              isDisabled,
              checkboxValue
            );
            pageArray.push(page);
          } else if (type === "label") {
            let page = this.GetLabelField(
              customFormFields,
              customFormFields.name
            );
            pageArray.push(page);
          } else if (type === "group") {
            customFormFields.subquestions.forEach((subelement) => {
              let customSubFormFields = this.GetFilteredQuestions(subelement);
              customSubFormFields.pageNumber = pageCount;
              customSubFormFields.parentId = customFormFields.id;
              if (
                customSubFormFields.isContinue &&
                customSubFormFields.isContinue == false
              ) {
                this.setState({ IsContinue: false });
              }
              let subStatePrefix =
                this.props.configSettings.fieldSettings.prefix;
              let subStateSuffix =
                this.props.configSettings.fieldSettings.suffix;
              let subState =
                this.state[
                  `${subStatePrefix}${customSubFormFields.stateName}${subStateSuffix}`
                ];
              let subShowError =
                this.state[`is${customSubFormFields.stateName}Valid`];
              let subShowErrorMessage =
                this.state[`show${customSubFormFields.stateName}Error`];
              let subShowCodeErrorMessage =
                this.state[
                  `show${customSubFormFields.stateName}${customSubFormFields.errorCode}`
                ];
              let subCustomMassage =
                this.state[`show${customSubFormFields.stateName}Message`];
              let isSubDisabled =
                this.state[customSubFormFields.checkBoxDisabledStateName];
              let subCheckboxValue =
                this.state[customSubFormFields.checkBoxStateName];
              let subType =
                customSubFormFields.summaryInfo &&
                customSubFormFields.summaryInfo.controlType
                  ? customSubFormFields.summaryInfo.controlType
                  : "";

              if (subType && subType !== undefined) {
                let subpage = undefined;
                if (subType === "dropdown") {
                  let subCustomListItems =
                    this.GetListItems(customSubFormFields);
                  subpage = this.GetDropdownPage(
                    subCustomListItems,
                    customSubFormFields,
                    subState,
                    subShowError,
                    subShowErrorMessage,
                    subShowCodeErrorMessage,
                    customFormFields.name
                  );
                  pageArray.push(subpage);
                } else if (subType === "text") {
                  subpage = this.GetTextPage(
                    customSubFormFields,
                    subState,
                    subShowError,
                    subShowErrorMessage,
                    subShowCodeErrorMessage,
                    subCustomMassage,
                    customFormFields.name
                  );
                  pageArray.push(subpage);
                } else if (subType === "button") {
                  let subCustomListItems =
                    this.GetListItems(customSubFormFields);
                  subpage = this.GetButtonPage(
                    subCustomListItems,
                    customSubFormFields,
                    subState,
                    subShowError,
                    subShowErrorMessage,
                    customFormFields.name
                  );
                  pageArray.push(subpage);
                } else if (subType === "fa-button") {
                  let subCustomListItems =
                    this.GetListItems(customSubFormFields);
                  subpage = this.GetFAButtonPage(
                    subCustomListItems,
                    customSubFormFields,
                    subState,
                    subShowError,
                    subShowErrorMessage,
                    customFormFields.name
                  );
                  pageArray.push(subpage);
                } else if (subType === "singlebutton") {
                  let page = this.GetSingleButtonPage(
                    customSubFormFields,
                    state,
                    showError,
                    showErrorMessage,
                    showCodeErrorMessage,
                    customFormFields.name
                  );
                  pageArray.push(page);
                } else if (subType === "masked-text") {
                  subpage = this.GetMaskedTextPage(
                    customSubFormFields,
                    subState,
                    subShowError,
                    subShowErrorMessage,
                    subShowCodeErrorMessage,
                    subCustomMassage,
                    customFormFields.name,
                    isSubDisabled,
                    subCheckboxValue
                  );
                  pageArray.push(subpage);
                } else if (subType === "masked-text-check-box") {
                  let subpage = this.GetMaskedTextCheckBoxPage(
                    customSubFormFields,
                    subState,
                    subShowError,
                    subShowErrorMessage,
                    subShowCodeErrorMessage,
                    subCustomMassage,
                    customFormFields.name,
                    isSubDisabled,
                    subCheckboxValue
                  );
                  pageArray.push(subpage);
                } else if (subType === "label") {
                  let subpage = this.GetLabelField(
                    customSubFormFields,
                    customSubFormFields.name
                  );
                  pageArray.push(subpage);
                }
              }
            });
          }
        }

        pageCount++;
      });
    }
    this.state.Pages = pageArray;
    return pageArray;
  }
  /** Returns the page number by page name */
  GetPageNumberbyName(name) {
    var pagenumber = this.state.Pages.filter((page) => {
      if (page.props.parentName === name) {
        return page.props.formFields.pageNumber;
      } else return null;
    });
    return pagenumber && pagenumber.length > 0
      ? pagenumber[0].props.formFields.pageNumber
      : 0;
  }
  GetPageNumberbyNameOnly(name) {
    var pagenumber = this.state.Pages.filter((page) => {
      if (page.props.name === name || page.props.formFields.name == name) {
        return page.props.formFields.pageNumber;
      } else return null;
    });
    return pagenumber && pagenumber.length > 0
      ? pagenumber[0].props.formFields.pageNumber
      : 0;
  }

  /** Custom validation  -It's call only when first time call Component to display predefine message in Login/Registration page. */
  GetCustomValidation(customValidation) {
    let eventValue = "";
    let arr = [];
    let isValid = true;
    arr = [];

    for (let cvalidation in customValidation) {
      switch (cvalidation) {
        case "characters":
          if (eventValue.length > customValidation[cvalidation].value) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "red",
            });
            isValid = false;
          }
          break;

        case "lowercase letter":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            isValid = false;
          }
          break;
        case "number":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            isValid = false;
          }
          break;
        case "uppercase letter":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            isValid = false;
          }
          break;
        case "special character":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            isValid = false;
          }
          break;
        default:
          isValid = true;
      }
    }
    return arr;
  }
  /** gets called on successful plaid login, sets the docusign url returned in state variables for further use */
  LoadOnPlaidSuccess = (docusignUrl) => {
    this.state.docusignUrl = docusignUrl;
    this.ContinueSummary();
  };
  /** Returns the Dropdown control for a question */
  GetDropdownPage(
    customListItems,
    customFormFields,
    state,
    showError,
    showErrorMessage,
    showCodeErrorMessage,
    parentName
  ) {
    return (
      <SPSelectField
        css={this.props.configSettings.css}
        type={customFormFields.type}
        SelectedValue={state}
        showCodeErrorMessage={
          showCodeErrorMessage === undefined ? true : showCodeErrorMessage
        }
        ShowHideList={this.showHideLoanPurposeList}
        DisplayItem={this.state.displayLoanPurposeItems}
        ListData={customListItems}
        HandleSelectedOption={this.handleDynamicEvent.bind(
          this,
          customFormFields
        )}
        formFields={customFormFields}
        showError={showError}
        showErrorMessage={showErrorMessage}
        disabled={this.state.initialDisabled}
        showTitle={customFormFields.showTitle}
        AutoFocus={customFormFields.focus}
        tabIndex={customFormFields.pageNumber}
        columnStyle={customFormFields.columnStyle}
        parentName={parentName}
        name={customFormFields.name}
        key={customListItems.length}
      />
    );
  }
  /** Returns the text control for a question */
  GetTextPage(
    customFormFields,
    state,
    showError,
    showErrorMessage,
    showCodeErrorMessage,
    customMessage,
    parentName
  ) {
    let showToolTip = false;
    return (
      <SPTextField
        formFields={customFormFields}
        value={state}
        type={customFormFields.type}
        css={this.props.configSettings.css}
        showError={showError}
        showErrorMessage={showErrorMessage}
        HandleSelectedOption={this.handleDynamicEvent.bind(
          this,
          customFormFields
        )}
        showCodeErrorMessage={
          showCodeErrorMessage === undefined ? false : showCodeErrorMessage
        }
        disabled={this.state.initialDisabled}
        tabIndex={customFormFields.pageNumber}
        inputType={
          customFormFields.inputType !== undefined &&
          customFormFields.inputType !== null
            ? customFormFields.inputType
            : "text"
        }
        showWrapErrorMessage={false}
        isMinChanged={this.state.showStateMinLoanAmount}
        IsNumeric={true}
        AutoFocus={customFormFields.focus}
        currentDevice={this.props.currentDevice}
        name={customFormFields.name}
        currentBrowser={this.props.currentBrowser}
        customMessage={customMessage}
        showTitle={customFormFields.showTitle}
        maxLength={
          customFormFields.maxLength
            ? parseInt(customFormFields.maxLength)
            : null
        }
        max={customFormFields.max ? parseInt(customFormFields.max) : null}
        isDisplay={this.state[`isDisplay${customFormFields.stateName}`]}
        columnStyle={
          customFormFields.columnStyle !== undefined &&
          customFormFields.columnStyle !== null
            ? customFormFields.columnStyle
            : ""
        }
        key={customFormFields.name}
        parentName={parentName}
        showToolTip={customFormFields.showToolTip}
        configSettings={this.props.configSettings}
        onKeyDown={this.onKeyPress.bind(this)}
      />
    );
  }
  /** Returns the masked text control for a question */
  GetMaskedTextPage(
    customFormFields,
    state,
    showError,
    showErrorMessage,
    showCodeErrorMessage,
    customeMessage,
    parentName,
    isDisabled,
    checkboxValue
  ) {
    return (
      <SPMaskedTextField
        formFields={customFormFields}
        css={this.props.configSettings.css}
        type={customFormFields.type}
        HandleSelectedOption={this.handleDynamicEvent.bind(
          this,
          customFormFields
        )}
        value={state}
        showError={showError}
        showErrorMessage={showErrorMessage}
        showCodeErrorMessage={
          showCodeErrorMessage === undefined ? true : showCodeErrorMessage
        }
        name={customFormFields.name}
        customMessage={customeMessage}
        inputType="tel"
        IsNumeric={true}
        AutoFocus={customFormFields.focus}
        fieldname={customFormFields.name}
        tabIndex={customFormFields.pageNumber}
        currentDevice={this.props.currentDevice}
        columnStyle={`${customFormFields.columnStyle}`}
        handleCheckboxEvent={this.handleEndDateCheckBoxEvent.bind(this)}
        patterns={this.props.configSettings.maskPattern}
        disabled={isDisabled}
        IsCheckboxChecked={checkboxValue}
        maxLength={
          customFormFields.maxLength
            ? parseInt(customFormFields.maxLength)
            : null
        }
        max={customFormFields.max ? parseInt(customFormFields.max) : null}
        parentName={parentName}
      />
    );
  }
  /** Returns the masked text control for a question */
  GetMaskedTextCheckBoxPage(
    customFormFields,
    state,
    showError,
    showErrorMessage,
    showCodeErrorMessage,
    customeMessage,
    parentName,
    isDisabled,
    checkboxValue
  ) {
    return (
      <SPMaskedTextCheckBoxField
        formFields={customFormFields}
        css={this.props.configSettings.css}
        type={customFormFields.type}
        HandleSelectedOption={this.handleDynamicEvent.bind(
          this,
          customFormFields
        )}
        value={state}
        showError={showError}
        showErrorMessage={showErrorMessage}
        showCodeErrorMessage={
          showCodeErrorMessage === undefined ? true : showCodeErrorMessage
        }
        name={customFormFields.name}
        customMessage={customeMessage}
        inputType="tel"
        IsNumeric={true}
        AutoFocus={customFormFields.focus}
        fieldname={customFormFields.name}
        tabIndex={customFormFields.pageNumber}
        currentDevice={this.props.currentDevice}
        columnStyle={`${customFormFields.columnStyle}`}
        handleCheckboxEvent={this.handleEndDateCheckBoxEvent.bind(this)}
        patterns={this.props.configSettings.maskPattern}
        disabled={isDisabled}
        IsCheckboxChecked={checkboxValue}
        maxLength={
          customFormFields.maxLength
            ? parseInt(customFormFields.maxLength)
            : null
        }
        max={customFormFields.max ? parseInt(customFormFields.max) : null}
        parentName={parentName}
      />
    );
  }
  /** Returns the button control for a question */
  GetButtonPage(
    customListItems,
    customFormFields,
    state,
    showError,
    showErrorMessage,
    parentName
  ) {
    return (
      <BCButtonField
        columnStyle={` button-control-align col-sm-12 col-xs-12`}
        css={this.props.configSettings.css}
        type={customFormFields.type}
        GetActiveLabel={this.getEstimatedCreditScoreLabel}
        SelectedValue={state}
        ShowHideList={this.showHideEstimatedCreditScoreList}
        DisplayItem={this.state.displayEstimatedCreditScoreItems}
        ListData={customListItems}
        HandleSelectedOption={this.handleDynamicEvent.bind(
          this,
          customFormFields
        )}
        formFields={customFormFields}
        showError={showError}
        showErrorMessage={showErrorMessage}
        disabled={this.state.initialDisabled}
        ShowConsent={this.state.ShowConsent}
        tabIndex={customFormFields.pageNumber}
        name={customFormFields.name}
        parentName={parentName}
      />
    );
  }
  /** Returns the FA Button control for a question */
  GetFAButtonPage(
    customListItems,
    customFormFields,
    state,
    showError,
    showErrorMessage,
    parentName
  ) {
    return (
      <FAButtonField
        columnStyle={` button-control-align col-sm-12 col-xs-12`}
        css={this.props.configSettings.css}
        type={customFormFields.type}
        GetActiveLabel={this.getEstimatedCreditScoreLabel}
        SelectedValue={state}
        ShowHideList={this.showHideEstimatedCreditScoreList}
        DisplayItem={this.state.displayEstimatedCreditScoreItems}
        ListData={customListItems}
        HandleSelectedOption={this.handleDynamicEvent.bind(
          this,
          customFormFields
        )}
        formFields={customFormFields}
        showError={showError}
        showErrorMessage={showErrorMessage}
        disabled={this.state.initialDisabled}
        ShowConsent={this.state.ShowConsent}
        tabIndex={customFormFields.pageNumber}
        name={customFormFields.name}
        parentName={parentName}
      />
    );
  }
  /** Returns the single button control for a question */
  GetSingleButtonPage(
    customFormFields,
    state,
    showError,
    showErrorMessage,
    parentName
  ) {
    return (
      <BCSingleButtonField
        columnStyle={` button-control-align  col-sm-12 col-xs-12 `}
        // OnDropdownClick={this.onEstimatedCreditScoreClick.bind(this)}
        css={this.props.configSettings.css}
        GetActiveLabel={this.getEstimatedCreditScoreLabel}
        SelectedValue={state}
        ShowHideList={this.showHideEstimatedCreditScoreList}
        DisplayItem={this.state.displayEstimatedCreditScoreItems}
        Title={customFormFields.title}
        HandleSelectedOption={this.handleDynamicEvent.bind(
          this,
          customFormFields
        )}
        formFields={customFormFields}
        showError={showError}
        showErrorMessage={showErrorMessage}
        disabled={this.state.initialDisabled}
        ShowConsent={this.state.ShowConsent}
        tabIndex={customFormFields.pageNumber}
        name={customFormFields.name}
        parentName={parentName}
      />
    );
  }

  /** Returns the Label control for a question */
  GetLabelField(customFormFields, parentName) {
    return (
      <BCLabelField
        key={customFormFields.name}
        formFields={customFormFields}
        css={this.props.configSettings.css}
        name={customFormFields.name}
        tabIndex={customFormFields.pageNumber}
        currentDevice={this.props.currentDevice}
        parentName={parentName}
        showTitle={customFormFields.showTitle}
      />
    );
  }

  /** Get employment information for a borrower */
  // GetEmploymentInfo(employmentQuestions, e) {
  //     let fullEmpInfo =this.props.PostDataEX.request;
  //     if(fullEmpInfo.borrowers[0].employmentInformation) {
  //         if(employmentQuestions && employmentQuestions.length > 0) {
  //             employmentQuestions.forEach(element => {
  //                 let statePrefix = this.props.configSettings.fieldSettings.prefix;
  //                 let stateSuffix = this.props.configSettings.fieldSettings.suffix;
  //                 if(element.pattern === "date") {
  //                     fullEmpInfo.borrowers[0].employmentInformation[0][element.name] = convertDateFormat(this.state[`${statePrefix}${element.stateName}${stateSuffix}`],"MM/DD/YYYY","YYYY-MM-DD");
  //                 } else {
  //                     fullEmpInfo.borrowers[0].employmentInformation[0][element.name] = this.state[`${statePrefix}${element.stateName}${stateSuffix}`];
  //                 }
  //             });
  //         }
  //     }
  //     return fullEmpInfo;
  // }

  /** Get the question details based on Id */
  GetFilteredQuestions(id) {
    const filteredQuestions = this.props.versionConfigSettings.questions.filter(
      (question) => {
        if (question && id) {
          return question.id === id;
        }
        return filteredQuestions ? filteredQuestions[0] : null;
      }
    );
    return filteredQuestions ? filteredQuestions[0] : null;
  }
  /** Get list item details from config */
  GetListItems(customFormFields) {
    let configs = this.props.configSettings[customFormFields.listItem];
    return configs;
  }

  /** Handles the checkbox event for a masked text control */
  handleEndDateCheckBoxEvent(customFormFields, isFocus, event) {
    let endDateDisabled = event.target.checked;
    let that = this;
    if (document.getElementById(customFormFields.name))
      document.getElementById(customFormFields.name).disabled = endDateDisabled;

    if (
      endDateDisabled === true &&
      document.getElementById(`chk-${customFormFields.name}`)
    ) {
      document.getElementById(`chk-${customFormFields.name}`).checked = true;
    }
    setTimeout(() => {
      let statePrefix = that.props.configSettings.fieldSettings.prefix;
      let stateSuffix = that.props.configSettings.fieldSettings.suffix;
      that.state[customFormFields.checkBoxStateName] = endDateDisabled;
      that.state[`${statePrefix}${customFormFields.stateName}${stateSuffix}`] =
        endDateDisabled
          ? ""
          : that.state[
              `${statePrefix}${customFormFields.stateName}${stateSuffix}`
            ];
      that.state[customFormFields.checkBoxDisabledStateName] = endDateDisabled;
      that.state[`is${customFormFields.stateName}Valid`] = true;
      that.state.isError = false;
      customFormFields.valid = true;
      if (endDateDisabled) {
        that.state[`is${customFormFields.stateName}Valid`] = true;
        that.state[`show${customFormFields.stateName}Error`] = false;
        that.state[`show${customFormFields.stateName}Message`] = "";
        that.state[
          `${statePrefix}${customFormFields.stateName}${stateSuffix}`
        ] = "";
        customFormFields.value = "";
        if (
          that.state.errorCountList.indexOf(customFormFields.stateName) > -1
        ) {
          that.state.errorCount--;
          that.RemoveFromErrorList(customFormFields.stateName);
        }
      }
      if (document.getElementById(customFormFields.name))
        document.getElementById(customFormFields.name).disabled =
          endDateDisabled;

      if (
        endDateDisabled === true &&
        document.getElementById(`chk-${customFormFields.name}`)
      )
        document.getElementById(`chk-${customFormFields.name}`).checked = true;
      if (!isFocus) {
        that.state[`is${customFormFields.stateName}Valid`] = true;
        that.state[`show${customFormFields.stateName}Error`] = false;
        that.state[`show${customFormFields.stateName}Message`] = "";
      }
      that.state[`${customFormFields.checkBoxStateName}`] = endDateDisabled;
      that.forceUpdate();
    }, 300);
  }
  /** Initialises the google auto complete control */
  initAutocomplete(customFormFields, groupQuestion) {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    try {
      autocomplete[customFormFields.name] =
        new window.google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */ (
            document.getElementById(customFormFields.name)
          ),
          { types: ["geocode"] }
        );
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete[customFormFields.name].addListener(
        "place_changed",
        this.fillInAddress.bind(this, customFormFields, groupQuestion)
      );
      autocomplete[customFormFields.name].setComponentRestrictions({
        country: this.props.configSettings.addressAutoComplete.countryCode,
      });
      var input = document.getElementById(customFormFields.name);
      window.google.maps.event.addDomListener(input, "keydown", (e) => {
        // If it's Enter
        if (e.keyCode === 13) {
          e.preventDefault();
        }
      });
      window.google.maps.event.addDomListener(input, "onchange", (e) => {
        // If it's onchange
        e.preventDefault();
      });
    } catch (e) {}
  }
  /** Fill the google autocomplete address in the group fields */
  fillInAddress(customFormFields, groupQuestion) {
    // Get the place details from the autocomplete object.
    this.state.IsContinue = false;
    var place = autocomplete[customFormFields.name].getPlace();
    var focusOut = this.props.configSettings.formSettings.defaultFocus;
    let addressValues = [];
    let that = this;
    if (place && place.address_components) {
      if (groupQuestion && groupQuestion.length > 0) {
        groupQuestion.forEach((element) => {
          let statePrefix = this.props.configSettings.fieldSettings.prefix;
          let stateSuffix = this.props.configSettings.fieldSettings.suffix;
          this.state[`${statePrefix}${element.stateName}${stateSuffix}`] = "";
          element.valid = true;
          this.state[`is${element.stateName}Valid`] = true;
          this.state[`show${element.stateName}Error`] = false;
          if (element.errorCode) {
            this.state[`show${element.stateName}${element.errorCode}`] = "";
          }
          addressValues.push("");
        });
      }

      let streetAdd = "";
      let aprtmentAdd = "";
      let city = "";
      let state = "";
      let zip = "";

      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          if (addressType === "street_number") {
            addressValues[0] = val;
            streetAdd = val;
          }
          if (addressType === "route") {
            addressValues[0] =
              addressValues[0] !== "" ? addressValues[0] + " " + val : val;
            aprtmentAdd = val;
          }
          if (addressType === "locality" || addressType === "postal_town") {
            addressValues[2] = val;
            city = val;
          }
          if (addressType === "administrative_area_level_1") {
            addressValues[3] = val;
            state = val;
          }
          if (addressType === "postal_code") {
            addressValues[4] = val;
            zip = val;
          }
          if (
            addressType === "country" &&
            that.props.configSettings.addressAutoComplete.countryLookup &&
            that.props.configSettings.addressAutoComplete.countryLookup.indexOf(
              val.toLowerCase()
            ) >= 0
          ) {
            addressValues[3] = val;
            state = val;
          }
          if (addressType === "intersection") {
            //) && that.props.configSettings.addressAutoComplete.countryLookup && that.props.configSettings.addressAutoComplete.countryLookup.indexOf(val.toLowerCase()) >= 0) {
            addressValues[0] = val;
            streetAdd = val;
          }
        }
      }
      if (!this.handlePOBoxAddress(streetAdd)) {
        let findState = this.props.configSettings.stateList.find(
          (o) => o.key.toLowerCase() === state.toLowerCase()
        ); //TODO: Change Configurable List Items
        if (
          (findState !== null && findState !== undefined) ||
          this.props.configSettings.addressAutoComplete.countryCode.indexOf(
            "uk"
          ) > -1
        ) {
          let stateObj = {};
          if (groupQuestion && groupQuestion.length > 0) {
            let i = 0;
            groupQuestion.forEach((element) => {
              let statePrefix = this.props.configSettings.fieldSettings.prefix;
              let stateSuffix = this.props.configSettings.fieldSettings.suffix;
              stateObj[`${statePrefix}${element.stateName}${stateSuffix}`] =
                addressValues[i];

              if (element.focusField != undefined)
                focusOut = element.focusField;

              if (addressValues[i] != "") {
                this.state[`show${element.stateName}Error`] = false;
                this.state[`is${element.stateName}Valid`] = true;
                element.valid = true;
              }
              element.value = addressValues[i];
              i++;
            });
          }
          stateObj.showInvalidAddressModal = false;
          stateObj.IsContinue = false;
          this.setState(stateObj);
        } else {
          //this.setState({ showInvalidAddressModal: true });
        }
      } else {
        this.state[`show${customFormFields.stateName}Message`] =
          customFormFields.POBoxMessage;
        //this.setState({ showAddressMessage: customFormFields.POBoxMessage, showStreedAddressError: false });
      }
    }
    //let validFlag =this.GroupQuestionValidation();
    // document.getElementById(focusOut).focus();
  }

  // BrowserForward(e, updated) {
  //     let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, updated);
  //     this.ContinueToNextPage(customFormFields);
  // }
  // BrowserBack(e, updated) {
  //     let customFormFields = this.GetFilteredData(this.props.versionConfigSettings.questions, updated);
  //     let groupQuestion =  this.props.versionConfigSettings.questions.filter(x=> x.pageNumber === updated && x.isAddressGroup === true);
  //     let currentPageState = updated;
  //     if (currentPageState >= 1 && currentPageState <= this.state.TotalPages) {
  //         this.setState({ currentPage: currentPageState });
  //         if (customFormFields.showConsent) {
  //             this.setState({ ShowConsent: true });
  //          } else {
  //              this.setState({ ShowConsent: false });
  //          }
  //         if (customFormFields.autoComplete) {
  //             setTimeout(() => {
  //                 this.initAutocomplete(customFormFields, groupQuestion);
  //             }, 1000);
  //         }
  //     }
  //     if (customFormFields.submitForm) {
  //         this.setState({ buttonText: 'View Pre-Qualified Offers' });
  //     } else {
  //         this.setState({ buttonText: 'Continue' });
  //     }
  // }

  Submit(e) {
    e.preventDefault();
    if (!this.state.initialDisabled) {
      var that = this;
      that.setState({ showModal: true });
      var second = 0;
      if (window.presubmit !== undefined) window.presubmit();
      if (window._paq) {
        window._paq.push([
          "setCustomDimension",
          (window.customDimensionId = 3),
          (window.customDimensionValue = that.state.mpUniqueClickID),
        ]);
        window._paq.push([
          "setCustomDimension",
          (window.customDimensionId = 8),
          (window.customDimensionValue = that.state.mpUniqueClickID),
        ]);
        window._paq.push([
          "setCustomDimension",
          (window.customDimensionId = 11),
          (window.customDimensionValue =
            that.state.selectedEstimatedCreditScore),
        ]);
        window._paq.push([
          "setCustomDimension",
          (window.customDimensionId = 12),
          (window.customDimensionValue = that.state.AnnualIncomeValue),
        ]);
        window._paq.push([
          "setCustomDimension",
          (window.customDimensionId = 14),
          (window.customDimensionValue = that.props.affiliateid
            ? that.props.affiliateid
            : null),
        ]);
        window._paq.push([
          "setCustomDimension",
          (window.customDimensionId = 19),
          (window.customDimensionValue = this.props.affiliateid
            ? this.props.affiliateid === "426464"
              ? "AcquireInteractive"
              : this.props.affiliateid
            : "Affiliate Application"),
        ]);
        window._paq.push([
          "trackEvent",
          "PLPQ",
          "PLPQ App Submit",
          this.props.affiliateid
            ? this.props.affiliateid === "426464"
              ? "AcquireInteractive"
              : this.props.affiliateid
            : "Affiliate Application",
        ]);
      }
      var x = setInterval(function () {
        if (second < 1) {
          if (!that.state.IsFormSubmitted) {
            document
              .getElementById(that.props.configSettings.formSettings.name)
              .submit();

            that.setState({ IsFormSubmitted: true });
            window.scrollTo(0, 0);
          }
        }
        second++;
        if (second > 5 && second <= 10) {
          that.setState({ loaderContent: "We're still checking..." });
        }
        if (second > 10 && second <= 15) {
          that.setState({ loaderContent: "Thank you for your patience..." });
        }
        if (second > 15) {
          that.setState({ loaderContent: "Just a few moments longer...." });
          clearInterval(x);
        }
      }, 1000);
    }
  }
  RemoveFromErrorList(value) {
    this.state.errorCountList.indexOf(value) !== -1 &&
      this.state.errorCountList.splice(
        this.state.errorCountList.indexOf(value),
        1
      );
  }
  /** Function to continue to next page */
  ContinueSummary(e) {
    if (e) e.preventDefault();
    let spQuestions = this.props.versionConfigSettings.questions.filter(
      (sp) => sp.summaryInfo && sp.summaryInfo.editable === true
    );
    //let errorCount = 0;
    this.state.errorCount = 0;
    let that = this;
    if (this.props.PostDataEX.request.borrowers.length === 1) {
      spQuestions = spQuestions.filter(
        (q) =>
          q.summaryInfo && q.summaryInfo.postData.indexOf("borrowers[0]") > -1
      );
    }
    that.setState({ ShowErrorMessage: false, consentMessage: false });

    if (spQuestions && spQuestions.length > 0 && this.state.IsSummaryPageEdit) {
      spQuestions.forEach((question) => {
        let validFlag = false;
        let showErrorValidation = that.showErrorValidationOnGroup();
        if (showErrorValidation) {
          validFlag = that.GroupQuestionValidation();
          that.setState({
            IsContinue: !validFlag,
            isValid: validFlag,
          });
        }
        let customValidation = true;

        if (question.parentId == undefined && e) {
          customValidation = that.handleCustomValidation(
            false,
            e.currentTarget,
            question.customValidation,
            question,
            question.value
          );
        }

        if (validFlag && customValidation && showErrorValidation) {
          CallGAEvent(
            "View Pre-Qualified Offers Button",
            "Application Submitted"
          );
          //View Pre-Qualified Offers
          let question = that.GetFilteredData(
            that.props.versionConfigSettings.questions,
            that.state.currentPage
          );

          let statePrefix = that.props.configSettings.fieldSettings.prefix;
          let stateSuffix = that.props.configSettings.fieldSettings.suffix;
          if (question.arrayValue && question.arrayValue !== "") {
            that.state[
              `${statePrefix}${question.arrayValue}${stateSuffix}`
            ].push(question.value);
          }
          if (question.loaderMessage) {
            that.setState({ loaderMessage: question.loaderMessage });
          } else that.setState({ loaderMessage: "" });

          //initialize states dynamically based on question name
          if (question.payloadkey) {
            let action = question.action;
            let apikey = question.apikey;
            var payloadarr = question.payloadkey;
            var payloadstr = "";
            if (question.type === "file-upload") {
              var fd = new FormData();
              for (let cvalidation in payloadarr) {
                var value =
                  that.state[
                    `${statePrefix}${that.GetPascalCase(
                      payloadarr[cvalidation]
                    )}${stateSuffix}`
                  ];
                if (value == "undefined" || value == undefined) {
                  value = payloadarr[cvalidation];
                }
                fd.append(cvalidation, value);
              }
              return that.handlePHPMethod(this, action, fd, question);
            } else {
              for (let cvalidation in payloadarr) {
                var value =
                  that.state[
                    `${statePrefix}${that.GetPascalCase(
                      payloadarr[cvalidation]
                    )}${stateSuffix}`
                  ];
                if (value == "undefined" || value == undefined) {
                  value = payloadarr[cvalidation];
                }
                payloadstr = payloadstr + cvalidation + "=" + value + "&";
              }
              payloadstr = payloadstr.substring(0, payloadstr.length - 1);
              return that.handlePHPMethod(this, action, payloadstr, question);
            }
          }
        }
        //check rules for question
        if (
          that.state[`is${question.stateName}Valid`] === false ||
          that.state[`show${question.stateName}Error`] === true ||
          (that.state[`show${question.stateName}Message`] !== undefined &&
            that.state[`show${question.stateName}Message`] !== "") ||
          (that.state[`show${question.stateName}${question.errorCode}`] !==
            undefined &&
            that.state[`show${question.stateName}${question.errorCode}`] !==
              false)
        ) {
          if (question.showCheckbox === true) {
            this.state.errorCountList.push(question.stateName);
          }
          // console.log('question',question.stateName)
          // console.log(that.state[`is${question.stateName}Valid`]);
          // if(that.state[`is${question.stateName}Valid`] === true && question.stateName==="HousingPayment"){
          if (that.state[`is${question.stateName}Valid`] === true) {
            this.state.errorCount = 0;
          } else {
            this.state.errorCount++;
          }
        }
      });
    }

    if (this.state.errorCount > 0) {
      that.setState({ ShowErrorMessage: true });
    } else {
      let consents = that.props.versionConfigSettings.questions.filter(
        (consent) =>
          consent.summaryInfo && consent.summaryInfo.isConsent === true && consent.summaryInfo.isMandatoryConsent === true
      );
      let borrowerCount = 0;
      let coBorrowerCount = 0;
      consents.forEach((borrower, index) => {
        let consent = consents[index];
        if (
          consent &&
          consent["name"] !== undefined &&
          document.getElementById(consent.name)
        ) {
          if (document.getElementById(consent.name).checked === false) {
            that.state[`is${consent.stateName}Valid`] = false;
            if (index === 0) {
              borrowerCount++;
            } else {
              coBorrowerCount++;
            }
          }
        }
      });
      if (borrowerCount > 0 || coBorrowerCount > 0) {
        this.setState({ consentMessage: true });
      } else {
        that.Submit(e);
      }
    }
  }

  ContinueToNextPage = (customFormFields) => {
    let autoCompleteQuestion = [];
    let groupQuestion = [];
    let currentPageState = this.state.currentPage;
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;

    if (
      customFormFields &&
      customFormFields.submitForm &&
      customFormFields.submitForm === true
    ) {
      let that = this;
      let newObj = [];
      that.props.versionConfigSettings.requestNode.filter((reqestHidden) => {
        newObj.push(that.renderHiddenRow(reqestHidden));
      });
      that.state.hiddenFieldsArray = newObj;
      that.Submit();
    } else {
      if (customFormFields.nextpage) {
        var isDefault = false;
        for (let npage in customFormFields.nextpage) {
          if (npage === customFormFields.value) {
            if (customFormFields.nextpage[npage] === "formSubmit") {
              let that = this;
              let newObj = [];
              that.state[`${statePrefix}FormSubmissionCount${stateSuffix}`] =
                customFormFields.formSubmissionCount;
              that.state[`${statePrefix}TransactionType${stateSuffix}`] =
                customFormFields.transactionType;
              that.props.versionConfigSettings.requestNode.filter(
                (reqestHidden) => {
                  newObj.push(that.renderHiddenRow(reqestHidden));
                }
              );
              that.state.hiddenFieldsArray = newObj;

              that.Submit();
            } else {
              currentPageState = this.GetPageNumberbyName(
                customFormFields.nextpage[npage]
              );
            }
            isDefault = true;
          }
        }
        if (!isDefault) {
          if (customFormFields.conditionalrules) {
            var questionPage = this.handleCustomDynamicRules(
              customFormFields.name,
              "onContinue"
            );
            if (questionPage != "") {
              currentPageState = this.GetPageNumberbyNameOnly(questionPage);
            } else {
              currentPageState = currentPageState + 1;
            }
          } else if (
            customFormFields.nextpage["Default"] !== undefined &&
            customFormFields.nextpage["Default"] !== ""
          ) {
            currentPageState = this.GetPageNumberbyName(
              customFormFields.nextpage["Default"]
            );
          } else {
            currentPageState = currentPageState + 1;
          }
        }
      } else {
        if (customFormFields.conditionalrules) {
          var questionPage = this.handleCustomDynamicRules(
            customFormFields.name,
            "onContinue"
          );
          if (questionPage != "") {
            currentPageState = this.GetPageNumberbyNameOnly(questionPage);
          } else {
            currentPageState = currentPageState + 1;
          }
        } else {
          currentPageState = currentPageState + 1;
        }
      }

      customFormFields = this.GetFilteredData(
        this.props.versionConfigSettings.questions,
        currentPageState
      );
      autoCompleteQuestion = this.props.versionConfigSettings.questions.filter(
        (x) =>
          x.pageNumber === currentPageState &&
          x.isAddressGroup === true &&
          x.autoComplete === true
      );
      groupQuestion = this.props.versionConfigSettings.questions.filter(
        (x) => x.pageNumber === currentPageState && x.isAddressGroup === true
      );

      this.setState({ currentPage: currentPageState });

      if (
        customFormFields.showConsent != undefined &&
        customFormFields.showConsent
      ) {
        this.setState({ ShowConsent: true });
      } else {
        this.setState({ ShowConsent: false });
      }
      window.history.pushState(
        "",
        "",
        `${this.props.configSettings.formSettings.urlPath}${currentPageState}`
      );
      this.getTitle(currentPageState);
      this.setState({ IsContinue: false });
    }
    if (customFormFields.type === "file-upload") {
      this.setState({ IsContinue: true });
    }
    setTimeout(() => {
      if (
        autoCompleteQuestion &&
        autoCompleteQuestion.length > 0 &&
        groupQuestion &&
        groupQuestion.length > 0
      ) {
        this.initAutocomplete(autoCompleteQuestion[0], groupQuestion);
      }
    }, 1000);

    if (customFormFields.submitForm) {
      let statePrefix = this.props.configSettings.fieldSettings.prefix;
      let stateSuffix = this.props.configSettings.fieldSettings.suffix;
      this.state[`${statePrefix}FormSubmissionCount${stateSuffix}`] =
        customFormFields.formSubmissionCount;
      this.setState({
        buttonText: customFormFields.buttonText,
        TransactionTypeValue: customFormFields.transactionType,
      });
    } else if (
      customFormFields.buttonText &&
      customFormFields.buttonText !== ""
    ) {
      this.setState({ buttonText: customFormFields.buttonText });
    } else {
      this.setState({
        buttonText: this.props.configSettings.formSettings.defaultButtonText,
      });
    }
    setTimeout(() => {
      if (document.getElementById(customFormFields.name)) {
        document.getElementById(customFormFields.name).focus();
        if (this.props.currentDevice === "Mobile") {
          document.getElementById(customFormFields.name).scrollIntoView();
        }
      } else {
        window.scrollTo(0, 0);
      }
    }, 100);
    this.setState({ isContinue: false });
  };

  getTitle(pageNumber) {
    let title = document.title.split("|");
    let filterTitle = this.props.configSettings.formSettings.title.filter(
      (element) => {
        if (title.length > 1) {
          return element.part1 === title[1] || element.part2 === title[1];
        } else {
          return element.part1 === title[0] || element.part2 === title[0];
        }
      }
    );
    if (filterTitle && filterTitle.length > 0) {
      if (filterTitle[0].language === "arabic") {
        //set arabic title
        document.title = `${filterTitle[0].part1}${filterTitle[0].part2.replace(
          "{{X}}",
          pageNumber
        )}`;
      } else {
        document.title = `${filterTitle[0].part1.replace("{{X}}", pageNumber)}${
          filterTitle[0].part2
        }`;
      }
    }
  }

  handlePOBoxAddress(address) {
    let hasPOBox = false;
    if (address) {
      let currentAddress = address.toLowerCase();
      const poBoxAddress = this.props.configSettings.POBox.filter((element) => {
        //TODO: POBox to config file
        return currentAddress.indexOf(element.value) > -1;
      });
      if (poBoxAddress.length > 0) {
        hasPOBox = true;
      }
    }
    return hasPOBox;
  }

  getIPAddress() {
    try {
      axios.get(`https://api.ipify.org`).then((response) => {
        if (response.data !== undefined) {
          this.setState({ IPAddress: response.data });
        }
      });
    } catch (error) {}
  }

  GetFilteredData(quesData, currentPageState) {
    const filteredQuestions = quesData.filter((question) => {
      if (question) {
        return question.pageNumber === currentPageState;
      }
      return filteredQuestions ? filteredQuestions[0] : null;
    });
    return filteredQuestions ? filteredQuestions[0] : null;
  }

  /**Handle Dynamic event which call from each component where we handle validation, custom validation and different state to continue to next question */
  handleDynamicEvent = (formcontrols, isFocus, event) => {
    this.state[
      `show${formcontrols.stateName}${formcontrols.errorCode}`
    ] = false;
    this.state[`is${formcontrols.stateName}Valid`] = true;
    this.state[`show${formcontrols.stateName}Error`] = false;
    this.state[`show${formcontrols.stateName}Message`] = "";
    var isValidValue = true;
    var value = "";
    var name = "";

    if (event && event.target) {
      if (
        event.target.type == "submit" ||
        formcontrols.summaryInfo.controlType === "fa-button"
      ) {
        name = event.currentTarget.name;
        value = event.currentTarget.id;
      } else {
        name = event.target.name;
        value = event.target.value;
      }
    }
    if (value && value !== undefined && formcontrols.type === "masked-text") {
      value = unformat(
        value,
        this.props.configSettings.fieldSettings.currencySymbol
      );
    }
    var formIsValid = false;
    var customValidation = true;
    var matchValidation = true;
    var rulesValidation = true;
    formcontrols.value = value;
    formcontrols.touched = true;
    formcontrols.valid = true;

    if (
      formcontrols.showCheckbox &&
      formcontrols.checkBoxStateName &&
      this.state[formcontrols.checkBoxStateName]
    ) {
      formIsValid = true;
      this.state[
        `show${formcontrols.stateName}${formcontrols.errorCode}`
      ] = false;
      this.state[`is${formcontrols.stateName}Valid`] = isValidValue;
      this.state[`show${formcontrols.stateName}Error`] = false;

      this.setState({
        IsContinue: false,
        isValid: formIsValid,
      });
      return;
    }

    if (formcontrols.validationRules === null) {
      formcontrols.valid = true;
      formIsValid = true;
    }
    if (!isFocus) {
      if (
        formcontrols.isPassword &&
        document.getElementById(formcontrols.name) !== null
      ) {
        document.getElementById(formcontrols.name).type = "password";
      }
      formcontrols.valid = validate(value, formcontrols.validationRules);
      isValidValue = formcontrols.valid;
      if (formcontrols.customValidation && formcontrols.valid) {
        customValidation = this.handleCustomValidation(
          false,
          event,
          formcontrols.customValidation,
          formcontrols,
          formcontrols.value
        );
      }
      // if(formcontrols.customEvent && formcontrols.valid)
      // {
      //     customValidation=this.handleCustomEvent(event,formcontrols.customEvent);
      // }

      if (formcontrols.match && formcontrols.valid) {
        matchValidation = this.handleMatch(false, event, formcontrols.match);
      }

      if (formcontrols.valid && matchValidation) {
        rulesValidation = this.handleDynamicRules(
          formcontrols.stateName,
          formcontrols
        );
      }

      if (
        matchValidation &&
        customValidation &&
        formcontrols.valid &&
        rulesValidation
      ) {
        this.state[`show${formcontrols.stateName}Error`] = false;
        this.state.errorCount--;
      } else if (formcontrols.valid) {
        this.state.errorCount = 0;
      } else {
        this.state.errorCount++;
      }
      this.handleDynamicFieldDisabled(formcontrols);
    } else {
      if (
        formcontrols.isPassword &&
        document.getElementById(formcontrols.name) !== null
      ) {
        document.getElementById(formcontrols.name).type = "tel";
      }
    }
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    this.state[`${statePrefix}${formcontrols.stateName}${stateSuffix}`] =
      formcontrols.value;

    if (
      formcontrols.valid &&
      customValidation &&
      matchValidation &&
      rulesValidation
    ) {
      formIsValid = true;
      this.setJSONValue(
        this.props.PostDataEX.request,
        formcontrols.summaryInfo.postData,
        formcontrols.value,
        formcontrols.name
      );
      this.state[
        `show${formcontrols.stateName}${formcontrols.errorCode}`
      ] = false;
      this.state[`is${formcontrols.stateName}Valid`] = isValidValue;
      this.state[`show${formcontrols.stateName}Error`] = false;
      this.setState({ IsContinue: false, isValid: formIsValid });
    } else {
      if (formcontrols.pattern === "date") {
        this.state[`show${formcontrols.stateName}Message`] = "";
        this.setState({
          IsContinue: true,
          isValid: false,
        });
        this.state[`show${formcontrols.stateName}Error`] = true;
      } else {
        this.state[
          `show${formcontrols.stateName}${formcontrols.errorCode}`
        ] = true;
        this.state[`is${formcontrols.stateName}Valid`] = isValidValue;
        this.state[`show${formcontrols.stateName}Error`] =
          customValidation && matchValidation ? false : true;
        formIsValid = false;

        this.setState({ IsContinue: true, isValid: formIsValid });
      }
    }
  };
  // handleCustomEvent(event,customEvent){

  // }

  /** This method will check if control have any dependency to disabled based on current value selected */
  handleDynamicFieldDisabled(formcontrols) {
    if (
      formcontrols.summaryInfo &&
      formcontrols.summaryInfo.disableDependentFields
    ) {
      let nextPage = formcontrols.nextpage[formcontrols.value];
      nextPage =
        nextPage === undefined ? formcontrols.nextpage["Default"] : nextPage;
      let that = this;
      let statePrefix = this.props.configSettings.fieldSettings.prefix;
      let stateSuffix = this.props.configSettings.fieldSettings.suffix;
      this.props.configSettings[formcontrols.listItem].forEach((option) => {
        let page = formcontrols.nextpage[option.key];
        if (document.getElementById(page)) {
          document.getElementById(page).disabled = false;
        }
      });

      formcontrols.summaryInfo.disableDependentFields.forEach((element) => {
        if (element.selectedValue === nextPage) {
          if (document.getElementById(element.disableName)) {
            document.getElementById(element.disableName).disabled =
              element.disabled;
            that.state[`show${element.stateName}Error`] = false;
            that.state[`is${element.stateName}Valid`] = true;
            if (element["defaultValue"] !== undefined) {
              that.state[`${statePrefix}${element.stateName}${stateSuffix}`] =
                element.defaultValue;
            }
          }
        }
      });
      if (document.getElementById(nextPage)) {
        document.getElementById(nextPage).focus();
      }
    }
  }

  /** To handle custom validation like email,string length,character,external validation, age etc.. */
  handleCustomValidation(
    isFocus,
    event,
    customValidation,
    customFormFields,
    controlValue
  ) {
    let eventValue = "";
    let ageMinMaxChanged = false;
    if (event && event.target && event.target.value) {
      eventValue = event.target.value;
    } else if (controlValue != "") {
      eventValue = controlValue;
    } else {
      eventValue = "";
    }

    let isValid = true;
    let arr = [];
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    arr = [];
    let crossverifyflag = true;
    for (let cvalidation in customValidation) {
      switch (cvalidation) {
        case "characters":
          if (eventValue.length > customValidation[cvalidation]) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "red",
            });
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
            crossverifyflag = false;
          }
          break;
        case "maxcharacter":
          if (eventValue.length <= customValidation[cvalidation]) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "red",
            });
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
            crossverifyflag = false;
          }
          break;

        case "lowercase letter":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
            crossverifyflag = false;
          }
          break;
        case "number":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
            crossverifyflag = false;
          }
          break;
        case "uppercase letter":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
            crossverifyflag = false;
          }
          break;
        case "special character":
          if (eventValue.match(customValidation[cvalidation].rules)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            isValid = true;
          } else {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "red",
            });
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
            crossverifyflag = false;
          }
          break;

        case "password":
          if (
            eventValue ==
            this.state[`${statePrefix}${cvalidation}${stateSuffix}`]
          ) {
            isValid = true;
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
          }
          break;
        case "phonenumber":
          if (
            eventValue
              .replace(" ", "")
              .match(customValidation[cvalidation].rules)
          ) {
            isValid = true;
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
          }
          break;
        case "SSN":
          if (
            eventValue
              .replace(" ", "")
              .match(customValidation[cvalidation].rules)
          ) {
            isValid = true;
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
          }
          break;
        case "externalValidation":
          if (isValid) {
            let isprevalidation = true;
            let apiURL = customValidation[cvalidation].apiURL;
            let apikey = customValidation[cvalidation].apikey;
            var payloadarr = customValidation[cvalidation].payloadkey;
            var validate = customValidation[cvalidation].validate;
            var payloadstr = "";
            var isValueOnly = customValidation[cvalidation].isvalueonly;
            var isEqualSign = customValidation[cvalidation].isequalsign;
            if (validate !== undefined) {
              for (let validValue in validate) {
                let sPrefix = this.props.configSettings.fieldSettings.prefix;
                let sSuffix = this.props.configSettings.fieldSettings.suffix;

                let arrayValue = this.state[`${validValue}`];
                let stateValue =
                  this.state[
                    `${sPrefix}${validate[validValue].name}${sSuffix}`
                  ];

                if (
                  isprevalidation &&
                  arrayValue != undefined &&
                  stateValue != undefined &&
                  arrayValue.length > 0 &&
                  arrayValue.indexOf(stateValue.toLowerCase()) > -1
                ) {
                  isprevalidation = true;
                } else {
                  isprevalidation = false;
                }
              }
            } else {
              isprevalidation = false;
            }
            if (!isprevalidation) {
              let isCallApi = true;
              for (let cvalidation in payloadarr) {
                var payloadName =
                  payloadarr[cvalidation].name === undefined
                    ? payloadarr[cvalidation]
                    : payloadarr[cvalidation].name;
                let payloadprefix =
                  this.props.configSettings.fieldSettings.prefix;
                let payloadsuffix =
                  this.props.configSettings.fieldSettings.suffix;
                var value =
                  this.state[`${payloadprefix}${payloadName}${payloadsuffix}`];
                if (value == "" || value == undefined) {
                  isCallApi = false;
                }
                if (!isValueOnly)
                  payloadstr =
                    payloadstr +
                    cvalidation +
                    (isEqualSign ? "=" : "") +
                    unformatwithoutspace(value) +
                    "&";
                else payloadstr = payloadstr + encodeURIComponent(value) + ",";
              }
              payloadstr = payloadstr.substring(0, payloadstr.length - 1);
              if (isCallApi) {
                isValid = this.handleExternalMethod(
                  customValidation[cvalidation].method,
                  apiURL,
                  apikey,
                  payloadstr,
                  validate,
                  customFormFields.stateName
                );
              }
              if (!isValid) {
                this.state[`show${customFormFields.stateName}Message`] =
                  customValidation[cvalidation].message;
                customFormFields.valid = false;
              }
            } else {
              isValid = true;
            }
          }
          break;
        case "minAge":
          if (
            customFormFields.summaryInfo &&
            customFormFields.summaryInfo.valuePattern !== "MM/DD/YYYY" &&
            !ageMinMaxChanged
          ) {
            eventValue = convertDateFormat(
              eventValue,
              customFormFields.summaryInfo.valuePattern,
              "MM/DD/YYYY"
            );
            ageMinMaxChanged = true;
          }
          if (
            isValid &&
            eventValue.match(customValidation[cvalidation].rules)
          ) {
            const age = calculateAge(new Date(eventValue), new Date());
            if (customValidation[cvalidation].value <= age) {
              this.state[`show${customFormFields.stateName}Error`] = false;
              this.state[`show${customFormFields.stateName}Message`] = "";
              isValid = true;
            } else {
              if (
                customValidation[cvalidation].value > age &&
                customValidation[cvalidation].value < age
              ) {
                this.state[`show${customFormFields.stateName}Error`] = true;
                this.state[`show${customFormFields.stateName}Message`] =
                  customFormFields.label + " should not be higher today date";
                isValid = false;
              } else {
                this.state[`show${customFormFields.stateName}Error`] = true;
                if (
                  customValidation[cvalidation].customMessage !== undefined ||
                  customValidation[cvalidation].customMessage !== ""
                )
                  this.state[`show${customFormFields.stateName}Message`] =
                    customValidation[cvalidation].customMessage;
                else
                  this.state[`show${customFormFields.stateName}Message`] =
                    customFormFields.label +
                    " should not be less than " +
                    customValidation[cvalidation].value;

                isValid = false;
              }
            }
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`show${customFormFields.stateName}Message`] =
              customFormFields.customMessage;
            isValid = false;
          }
          break;
        case "maxAge":
          if (
            customFormFields.summaryInfo &&
            customFormFields.summaryInfo.valuePattern !== "MM/DD/YYYY" &&
            !ageMinMaxChanged
          ) {
            eventValue = convertDateFormat(
              eventValue,
              customFormFields.summaryInfo.valuePattern,
              "MM/DD/YYYY"
            );
            ageMinMaxChanged = true;
          }
          if (
            isValid &&
            eventValue.match(customValidation[cvalidation].rules)
          ) {
            const age = calculateAge(new Date(eventValue), new Date());
            if (customValidation[cvalidation].value >= age) {
              arr.push({
                key: cvalidation,
                value: customValidation[cvalidation].value,
                color: "green",
              });
              this.state[`show${customFormFields.stateName}Message`] = "";
              isValid = true;
            } else {
              this.state[`show${customFormFields.stateName}Error`] = true;
              this.state[
                `show${customFormFields.stateName}${customFormFields.errorCode}`
              ] =
                customFormFields.label +
                " should not be greater than " +
                customValidation[cvalidation].value;
              if (
                customValidation[cvalidation].customMessage !== undefined ||
                customValidation[cvalidation].customMessage !== ""
              )
                this.state[`show${customFormFields.stateName}Message`] =
                  customValidation[cvalidation].customMessage;
              else
                this.state[`show${customFormFields.stateName}Message`] =
                  customFormFields.label +
                  " should not be greater than " +
                  customValidation[cvalidation].value;

              isValid = false;
            }
          } else {
            if (isValid) {
              this.state[`show${customFormFields.stateName}Error`] = true;
              this.state[`show${customFormFields.stateName}Message`] =
                customFormFields.customMessage;
            }
            isValid = false;
          }
          break;
        case "min-max":
          let minmax = customValidation[cvalidation].split("-");
          let val = unformat(
            eventValue,
            this.props.configSettings.fieldSettings.currencySymbol
          );
          if (
            parseInt(minmax[0]) <= parseInt(val) &&
            parseInt(minmax[1]) >= parseInt(val)
          ) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "green",
            });
            this.state[`show${customFormFields.stateName}Message`] = "";
            this.state[`show${customFormFields.stateName}Error`] = false;
            isValid = true;
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`show${customFormFields.stateName}Message`] =
              customFormFields.custommessage;
            isValid = false;
          }

          break;
        case "min":
          let mincustomvalue = customValidation[cvalidation];
          let mininputvalue = unformat(
            eventValue,
            this.props.configSettings.fieldSettings.currencySymbol
          );
          if (parseInt(mincustomvalue) <= parseInt(mininputvalue)) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation],
              color: "green",
            });
            this.state[`show${customFormFields.stateName}Message`] = "";
            this.state[`show${customFormFields.stateName}Error`] = false;
            isValid = true;
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`show${customFormFields.stateName}Message`] =
              customFormFields.custommessage;
            isValid = false;
          }
          break;
        case "max":
          if (
            customValidation[cvalidation] >
            unformat(
              eventValue,
              this.props.configSettings.fieldSettings.currencySymbol
            )
          ) {
            arr.push({
              key: cvalidation,
              value: customValidation[cvalidation].value,
              color: "green",
            });
            this.state[`show${customFormFields.stateName}Message`] = "";
            this.state[`show${customFormFields.stateName}Error`] = false;
            isValid = true;
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`show${customFormFields.stateName}Message`] =
              customFormFields.custommessage;
            isValid = false;
          }
          break;
        case "EmailAddress":
          if (
            eventValue
              .replace(" ", "")
              .match(customValidation[cvalidation].rules)
          ) {
            isValid = true;
          } else {
            this.state[`show${customFormFields.stateName}Error`] = true;
            this.state[`is${customFormFields.stateName}Valid`] = false;
            isValid = false;
          }
          break;
        default:
          isValid = true;
      }
    }
    if (arr.length > 0) this.setState({ customArray: arr });
    if (crossverifyflag === false) {
      isValid = false;
      this.state[`show${customFormFields.stateName}Error`] = true;
      this.state[`is${customFormFields.stateName}Valid`] = false;
    }
    return isValid;
  }

  /** Dynamic rules like compare 1 Question value with other or set value from 1 Question to other question */
  handleDynamicRules(fieldName, customFormFields) {
    // ruleName = {"field": "employeStartDate", "compareField" : "dateOfBirth" ,
    //"type":"Date,numberic,string", "operator":">,<,===,>=,<=,!=,","threshhold":"10"
    //,"thresholdType":"year","customMessage":"Start date should be less than Birthdate + 10 Years " }

    var isValid = true;
    let rules = this.props.versionConfigSettings["rules"];
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    for (let rule in rules) {
      var field = rules[rule].field;

      if (field.toLowerCase() === fieldName.toLowerCase()) {
        var compareField = rules[rule].compareField;
        var threshhold = rules[rule].threshhold;
        var threshholdtype = rules[rule].thresholdType;
        var operator = rules[rule].operator;
        var type = rules[rule].type;
        var customMessage = rules[rule].customMessage;
        var source = rules[rule].source;
        let stateValue = this.state[`${statePrefix}${fieldName}${stateSuffix}`];
        let compareValue = this.getValue(source, compareField);

        switch (operator) {
          case ">":
            if (threshhold != "" && threshholdtype != "") {
              if (type === "Date") {
                let valuePattern =
                  customFormFields.summaryInfo &&
                  customFormFields.summaryInfo.valuePattern
                    ? customFormFields.summaryInfo.valuePattern
                    : customFormFields.placeholder;
                compareValue = convertDateFormat(
                  compareValue,
                  valuePattern,
                  "MM/DD/YYYY"
                );
                var newDate = AddDate(
                  new Date(compareValue),
                  threshholdtype,
                  threshhold
                );
                if (
                  new Date(stateValue) > newDate &&
                  new Date(stateValue) < new Date()
                ) {
                  isValid = true;
                } else {
                  this.state[`show${field}Error`] = true;
                  this.state[`show${field}Message`] = customMessage;
                  isValid = false;
                }
              } else if (type === "Numeric") {
                let newValue = MathsCalculator(
                  compareValue,
                  threshhold.substring(1, threshhold.length),
                  threshhold.substring(0, 1)
                );
                if (stateValue > newValue) {
                  isValid = true;
                } else {
                  this.state[`show${field}Error`] = true;
                  this.state[`show${field}Message`] = customMessage;
                  isValid = false;
                }
              } else {
                isValid = true;
              }
            }
            break;
          case "<":
            if (type === "Date") {
              let valuePattern =
                customFormFields.summaryInfo &&
                customFormFields.summaryInfo.valuePattern
                  ? customFormFields.summaryInfo.valuePattern
                  : customFormFields.placeholder;
              compareValue = convertDateFormat(
                compareValue,
                valuePattern,
                "MM/DD/YYYY"
              );
              var newDate = AddDate(
                new Date(compareValue),
                threshholdtype,
                threshhold
              );
              if (
                new Date(stateValue) < newDate &&
                new Date(stateValue) < new Date()
              ) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else if (type === "Numeric") {
              let newValue = MathsCalculator(
                compareValue,
                threshhold.substring(1, threshhold.length),
                threshhold.substring(0, 1)
              );
              if (stateValue < newValue) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else {
              isValid = true;
            }
            break;
          case "=":
            if (type === "Date") {
              let valuePattern =
                customFormFields.summaryInfo &&
                customFormFields.summaryInfo.valuePattern
                  ? customFormFields.summaryInfo.valuePattern
                  : customFormFields.placeholder;
              compareValue = convertDateFormat(
                compareValue,
                valuePattern,
                "MM/DD/YYYY"
              );
              var newDate = AddDate(
                new Date(compareValue),
                threshholdtype,
                threshhold
              );
              if (
                new Date(stateValue) === newDate &&
                new Date(stateValue) < new Date()
              ) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else if (type === "Numeric") {
              let newValue = MathsCalculator(
                compareValue,
                threshhold.substring(1, threshhold.length),
                threshhold.substring(0, 1)
              );
              if (stateValue === newValue) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else {
              isValid = true;
            }
            break;
          case ">=":
            if (type === "Date") {
              let valuePattern =
                customFormFields.summaryInfo &&
                customFormFields.summaryInfo.valuePattern
                  ? customFormFields.summaryInfo.valuePattern
                  : customFormFields.placeholder;
              compareValue = convertDateFormat(
                compareValue,
                valuePattern,
                "MM/DD/YYYY"
              );
              var newDate = AddDate(
                new Date(compareValue),
                threshholdtype,
                threshhold
              );
              if (
                new Date(stateValue) >= newDate &&
                new Date(stateValue) < new Date()
              ) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else if (type === "Numeric") {
              let newValue = MathsCalculator(
                compareValue,
                threshhold.substring(1, threshhold.length),
                threshhold.substring(0, 1)
              );
              if (stateValue >= newValue) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else {
              isValid = true;
            }
            break;
          case "<=":
            if (type === "Date") {
              let valuePattern =
                customFormFields.summaryInfo &&
                customFormFields.summaryInfo.valuePattern
                  ? customFormFields.summaryInfo.valuePattern
                  : customFormFields.placeholder;
              compareValue = convertDateFormat(
                compareValue,
                valuePattern,
                "MM/DD/YYYY"
              );
              var newDate = AddDate(
                new Date(compareValue),
                threshholdtype,
                threshhold
              );
              if (
                new Date(stateValue) <= newDate &&
                new Date(stateValue) < new Date()
              ) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else if (type === "Numeric") {
              let newValue = MathsCalculator(
                compareValue,
                threshhold.substring(1, threshhold.length),
                threshhold.substring(0, 1)
              );
              if (stateValue <= newValue) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else if (type === "Sum") {
              var tempvalue = 0;
              var thresholdValue = 0;
              if (compareValue.length > 0) {
                for (var i = 0; i <= compareValue.length - 1; i++) {
                  tempvalue = MathsCalculator(
                    parseInt(
                      compareValue[i]
                        .substring(1, compareValue[i].length)
                        .replace(",", "")
                    ),
                    tempvalue,
                    "Plus"
                  );
                }
              } else tempvalue = 0;
              if (typeof threshhold === "string") {
                thresholdValue = this.getValue("State", threshhold);
              } else {
                thresholdValue = threshhold;
              }
              if (thresholdValue != "")
                thresholdValue = thresholdValue
                  .substring(1, thresholdValue.length)
                  .replace(",", "");

              stateValue = stateValue
                .substring(1, stateValue.length)
                .replace(",", "");
              var newValue = MathsCalculator(
                parseInt(thresholdValue),
                parseInt(tempvalue),
                threshholdtype
              );
              if (stateValue && parseInt(stateValue) <= newValue) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else if (type === "Minus") {
              var tempValue = 0;
              var thresholdValue = 0;
              var newValue = 0;
              if (compareField.length > 0) {
                var arrayValue = compareField.split(",");
                for (var i = 0; i <= arrayValue.length - 1; i++) {
                  var subArrayValue = arrayValue[i].split("-");
                  if (subArrayValue.length > 1) {
                    tempValue = this.getValue("State", subArrayValue[0]);
                    var calcValue = subArrayValue[1];
                    if (calcValue.indexOf("%") > -1) {
                      calcValue = calcValue.substring(0, calcValue.length - 1);
                      tempValue =
                        unformat(
                          tempValue,
                          this.props.configSettings.fieldSettings.currencySymbol
                        ) * parseFloat(calcValue);
                      tempValue = `${
                        this.props.configSettings.fieldSettings.currencySymbol
                      }${AmountFormatting(
                        tempValue,
                        customFormFields.thousandSeparator
                      )}`;
                    }
                  } else {
                    tempValue = this.getValue("State", arrayValue[i]);
                  }
                  if (tempValue === "") {
                    tempValue = "";
                    this.state[`${statePrefix}${arrayValue[i]}${stateSuffix}`] =
                      tempValue;
                  }
                  if (newValue === 0) {
                    newValue =
                      tempValue === ""
                        ? 0
                        : parseInt(
                            tempValue
                              .substring(1, tempValue.length)
                              .replace(",", "")
                          );
                  } else if (tempValue != undefined) {
                    newValue = MathsCalculator(
                      newValue,
                      tempValue === ""
                        ? 0
                        : parseInt(
                            tempValue
                              .substring(1, tempValue.length)
                              .replace(",", "")
                          ),
                      "Minus"
                    );
                  }
                }
              }
              stateValue = unFormatAmount(
                stateValue,
                this.props.configSettings.fieldSettings.currencySymbol,
                customFormFields.thousandSeparator
              );

              if (stateValue <= newValue) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else {
              isValid = true;
            }
            break;
          case "!=":
            if (type === "Date") {
              let valuePattern =
                customFormFields.summaryInfo &&
                customFormFields.summaryInfo.valuePattern
                  ? customFormFields.summaryInfo.valuePattern
                  : customFormFields.placeholder;
              compareValue = convertDateFormat(
                compareValue,
                valuePattern,
                "MM/DD/YYYY"
              );
              var newDate = AddDate(
                new Date(compareValue),
                threshholdtype,
                threshhold
              );
              if (new Date(stateValue) != newDate) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else if (type === "Numeric") {
              let newValue = MathsCalculator(
                compareValue,
                threshhold.substring(1, threshhold.length),
                threshhold.substring(0, 1)
              );
              if (stateValue != newValue) {
                isValid = true;
              } else {
                this.state[`show${field}Error`] = true;
                this.state[`show${field}Message`] = customMessage;
                isValid = false;
              }
            } else {
              isValid = true;
            }
          default:
            isValid = true;
        }
      }
    }
    return isValid;
  }
  handleCustomDynamicRules(fieldName, ruleson) {
    // {"field": "BankStatement", "compareField" : "BankLinking", "source":"State", "type":"question",
    //  "operator":"!=","threshhold":"nullable"
    // ,"thresholdType":"Value","customMessage":"","actionType":"css", "Action":"display:none"}
    var returnValue = "";
    let rules = this.props.versionConfigSettings["conditionalrules"];
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    let flag = true;
    for (let rule in rules) {
      var field = rules[rule].field;

      if (
        field.toLowerCase() === fieldName.toLowerCase() &&
        flag === true &&
        rules[rule].ruleson === ruleson
      ) {
        var compareField = rules[rule].compareField;
        var threshhold = rules[rule].threshhold;
        var threshholdtype = rules[rule].thresholdType;
        var operator = rules[rule].operator;
        var type = rules[rule].type;
        var source = rules[rule].source;
        var action = rules[rule].action;
        var actionType = rules[rule].actionType;
        let stateValue = this.state[`${statePrefix}${field}${stateSuffix}`];

        switch (operator) {
          case "!=":
            if (threshhold != "" && threshholdtype != "") {
              if (type === "question") {
                if (returnValue === "") {
                  returnValue = true;
                }
                let compareValue = this.getValue(source, compareField);

                if (threshhold == "null") {
                  if (compareValue != null) returnValue = false;
                } else {
                  var thresholdarray = threshhold.split(",");
                  if (thresholdarray.length > 1) {
                    for (var i = 0; i <= thresholdarray.length - 1; i++) {
                      if (
                        compareValue != null &&
                        returnValue &&
                        compareValue == thresholdarray[i]
                      ) {
                        returnValue = false;
                      }
                    }
                  } else {
                    if (
                      compareValue != null &&
                      returnValue &&
                      compareValue == thresholdarray[0]
                    ) {
                      returnValue = false;
                    }
                  }
                }
              } else {
                returnValue = true;
              }
            }

            break;

          case "-":
            if (threshhold != "" && threshholdtype != "") {
              if (type === "bulkquestion") {
                var newValue = 0;
                var threshholdValue = 0;
                if (
                  compareField != undefined &&
                  compareField != "" &&
                  compareField.length > 0
                ) {
                  var arrayValue = compareField.split(",");
                  for (var i = 0; i <= arrayValue.length - 1; i++) {
                    var tempValue = this.getValue("State", arrayValue[i]);
                    if (tempValue === "") {
                      tempValue = "";
                      this.state[
                        `${statePrefix}${arrayValue[i]}${stateSuffix}`
                      ] = tempValue;
                    }
                    if (tempValue != undefined)
                      newValue = MathsCalculator(
                        tempValue === ""
                          ? 0
                          : parseInt(
                              tempValue
                                .substring(1, tempValue.length)
                                .replace(",", "")
                            ),
                        newValue,
                        "Plus"
                      );
                  }
                }
                if (newValue) {
                  returnValue = newValue;
                } else {
                  returnValue = 0;
                }
              } else {
                if (flag) {
                  returnValue = true;
                }
              }
            }
            break;
          case "==":
            if (threshhold != "") {
              if (type === "list") {
                let array = [];
                array = this.props.configSettings[compareField];
                let ques = [];
                let grpQues = [];
                array.forEach((element, index) => {
                  if (
                    element.name == fieldName &&
                    flag &&
                    element.isRequire != false
                  ) {
                    flag = false;
                    returnValue = element.nextQuestion;
                    ques = this.state.Pages.filter((ex) => {
                      if (
                        ex &&
                        ex.props &&
                        ex.props.formFields &&
                        ex.props.formFields.name
                      ) {
                        return ex.props.formFields.name === returnValue;
                      } else {
                        return null;
                      }
                    });
                    if (ques && ques.length > 0) {
                      if (
                        ques[0].props &&
                        ques[0].props["parentName"] !== undefined
                      ) {
                        grpQues = this.state.Pages.filter((parent) => {
                          if (
                            parent &&
                            parent.props &&
                            parent.props.formFields
                          ) {
                            return (
                              parent.props.formFields.pageNumber ===
                              ques[0].props.formFields.pageNumber
                            );
                          } else {
                            return null;
                          }
                        });
                      }
                    }
                    if (grpQues && grpQues.length > 0) {
                      returnValue = grpQues[0].props.formFields.name;
                    } else {
                      var nextQuestion = array.find(
                        (x, i) => x.name == returnValue && x.isRequire == true
                      );
                      if (
                        nextQuestion === undefined ||
                        nextQuestion === null ||
                        nextQuestion === ""
                      ) {
                        var tempvalue = array.find(
                          (x, i) => x.isRequire == true && i > index
                        );
                        if (tempvalue !== undefined && tempvalue !== null) {
                          returnValue = tempvalue.name;
                        } else if (
                          tempvalue === undefined ||
                          tempvalue == null ||
                          tempvalue == ""
                        ) {
                          returnValue = element.finalQuestion;
                        }
                      }
                    }
                  }
                });
              }
              if (type === "equal") {
                if (action != "" && actionType == "nextpage" && flag) {
                  flag = false;
                  returnValue = action;
                }
              }
              if (type === "int") {
                var compareValue =
                  source == ""
                    ? compareField
                    : this.getValue(source, compareField);
                if (
                  stateValue == compareValue &&
                  actionType == "nextpage" &&
                  threshholdtype == "Value"
                ) {
                  flag = false;
                  returnValue = action;
                }
                if (
                  threshhold == compareValue &&
                  actionType == "nextpage" &&
                  threshholdtype == ""
                ) {
                  flag = false;
                  returnValue = action;
                }
              }
              if (type === "string") {
                var compareValue =
                  source == ""
                    ? compareField
                    : this.getValue(source, compareField);
                if (
                  stateValue == compareValue &&
                  actionType == "nextpage" &&
                  threshholdtype == "Value"
                ) {
                  flag = false;
                  returnValue = action;
                }
                if (
                  threshhold == compareValue &&
                  actionType == "nextpage" &&
                  threshholdtype == ""
                ) {
                  flag = false;
                  returnValue = action;
                }
              }
              if (type === "question") {
                if (returnValue === "") {
                  returnValue = false;
                }
                var compareValue = this.getValue(source, compareField);

                if (threshhold == "null") {
                  if (compareValue != null) returnValue = false;
                } else {
                  var thresholdarray = threshhold.split(",");
                  if (thresholdarray.length > 1) {
                    for (var i = 0; i <= thresholdarray.length - 1; i++) {
                      if (
                        compareValue != null &&
                        compareValue == thresholdarray[i]
                      ) {
                        returnValue = true;
                      }
                    }
                  } else {
                    if (
                      compareValue != null &&
                      compareValue === thresholdarray[0]
                    ) {
                      returnValue = true;
                    }
                  }
                }
              } else {
                if (flag) returnValue = "";
              }
            }
            break;
          default:
            returnValue = true;
        }
      }
    }
    return returnValue;
  }
  /** To call dynamic api from handle external method */
  handleExternalMethod(
    methodname,
    apiURL,
    apikey,
    payloadstr,
    validate,
    statename
  ) {
    let content = "";
    const method = this.funcMap[methodname];
    if (typeof method === "function") {
      content = method(apiURL, apikey, payloadstr, validate, statename);
    }
    return content;
  }
  /** To validate city state zip using AJAX method dynamically */
  ValidateCityStateZipAjax(
    apiEndpoint,
    apikey,
    payloadstr,
    validate,
    statename
  ) {
    var postalCodes = [];
    var cityCodes = [];
    var stateCodes = [];
    var isValid = true;
    var that = this;
    $.ajax({
      url: `${apiEndpoint}${payloadstr}&key=${apikey}`,
      success: function (response) {
        if (response) {
          if (response !== undefined) {
            if (response.results !== undefined && response.results.length > 0) {
              let address_components = response.results[0].address_components;
              if (address_components !== undefined) {
                address_components.forEach((address) => {
                  if (
                    that.props.configSettings.addressAutoComplete.countryCode.indexOf(
                      "uk"
                    ) > -1
                  ) {
                    if (address.types.indexOf("postal_town") >= 0) {
                      //Add zipcode into list.
                      cityCodes.push(address.long_name.toLowerCase());
                      that.setState({ cityCodeArray: cityCodes });
                    }
                  } else if (address.types.indexOf("locality") >= 0) {
                    //Add zipcode into list.
                    cityCodes.push(address.long_name.toLowerCase());
                    that.setState({ cityCodeArray: cityCodes });
                  }
                  if (address.types.indexOf("postal_code") >= 0) {
                    //Add zipcode into list.
                    postalCodes.push(address.long_name.toLowerCase());
                    that.setState({ zipCodeArray: postalCodes });
                  }
                  if (
                    address.types.indexOf("administrative_area_level_1") >= 0
                  ) {
                    stateCodes.push(address.long_name.toLowerCase());
                    that.setState({ stateCodeArray: stateCodes });
                  }
                  if (
                    address.types.indexOf("country") >= 0 &&
                    that.props.configSettings.addressAutoComplete
                      .countryLookup &&
                    that.props.configSettings.addressAutoComplete.countryLookup.indexOf(
                      address.long_name.toLowerCase()
                    ) >= 0
                  ) {
                    stateCodes = [];
                    stateCodes.push(address.long_name.toLowerCase());
                    that.setState({ stateCodeArray: stateCodes });
                  }
                });
              }
            }
          }
        }
      },
      async: false,
    });
    //        this.setState({ zipCodeArray: postalCodes, cityCodeArray: cityCodes, stateCodeArray: stateCodes });
    this.state.zipCodeArray = postalCodes;
    this.state.cityCodeArray = cityCodes;
    this.state.stateCodeArray = stateCodes;

    if (validate) {
      //initialize states dynamically based on question name
      for (let cvalidation in validate) {
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;

        let arrayValue = this.state[`${cvalidation}`];
        let stateValue =
          this.state[
            `${statePrefix}${validate[cvalidation].name}${stateSuffix}`
          ];

        if (
          arrayValue != undefined &&
          stateValue != undefined &&
          arrayValue.length > 0 &&
          arrayValue.indexOf(stateValue.toLowerCase()) > -1
        ) {
          this.state[`show${validate[cvalidation].name}Error`] = false;
        } else {
          if (stateValue == undefined || stateValue == "") {
            this.state[`is${validate[cvalidation].name}Valid`] = false;
          } else {
            this.state[`show${validate[cvalidation].name}Error`] = true;
          }
          if (validate[cvalidation].name === statename) isValid = false;
        }
      }
    }
    return isValid;
  }
  /** Common method to call any api */
  CommonValidationAPIAjax(apiEndpoint, apikey, payloadstr, validate) {
    var isValid = true;
    $.ajax({
      url: `${apiEndpoint}${payloadstr}&${apikey}`,
      success: function (response) {
        if (response) {
          if (response !== undefined) {
            isValid = response.valid;
          }
        }
      },
      async: false,
    });
    if (validate) {
      for (let cvalidation in validate) {
        let statePrefix = this.props.configSettings.fieldSettings.prefix;
        let stateSuffix = this.props.configSettings.fieldSettings.suffix;

        if (
          this.state[`${cvalidation}`].indexOf(
            this.state[
              `${this.statePrefix}{this.GetPascalCase(validate[cvalidation])}${stateSuffix}`
            ] > -1
          )
        ) {
          this.state[
            `show${this.GetPascalCase(validate[cvalidation].name)}Error`
          ] = false;
          this.state[
            `is${this.GetPascalCase(validate[cvalidation].name)}Valid`
          ] = true;
        } else {
          this.state[
            `show${this.GetPascalCase(validate[cvalidation])}Error`
          ] = true;
          this.state[
            `is${this.GetPascalCase(validate[cvalidation])}Valid`
          ] = false;
          isValid = false;
        }
      }
    }
    return isValid;
  }
  /** To match 1 field value with another field */
  handleMatch(isFocus, event, customValidation, fieldValue = "", fieldId = "") {
    let password = event === null ? fieldValue : event.target.value;
    let fieldName = event === null ? fieldId : event.currentTarget.id;
    let isValid = true;
    let arr = [];
    let statePrefix = "";
    let stateSuffix = "Value";
    arr = [];
    for (let cvalidation in customValidation) {
      if (
        password ==
        this.state[
          `${statePrefix}${this.GetPascalCase(cvalidation)}${stateSuffix}`
        ]
      ) {
        isValid = true;
        this.state[`is${this.GetPascalCase(fieldName)}Valid`] = true;
      } else {
        this.state[`show${this.GetPascalCase(fieldName)}Error`] = true;
        this.state[`is${this.GetPascalCase(fieldName)}Valid`] = false;
        isValid = false;
      }
    }

    return isValid;
  }
  showLoader() {
    this.setState({ isFetchInProgress: true });
  }
  hideLoader() {
    this.setState({ isFetchInProgress: false });
  }
  setLoaderMessage(message, delayMessageDisplay) {
    const that = this;
    let appendedMessage = "";
    if (delayMessageDisplay) {
      let brokenMessage = message.split("<br/>");
      if (brokenMessage && brokenMessage.length > 0)
        brokenMessage.forEach((element, i) => {
          setTimeout(() => {
            appendedMessage += element + "<br/>";
            that.setState({ loaderMessage: appendedMessage });
          }, i * 2000);
        });
    } else {
      that.setState({ loaderMessage: message });
    }
  }
  onCloseDynamicModal() {
    this.setState({ isDynamicModalPopup: false });
    if (
      this.state.nextFocusElement &&
      document.getElementById(this.state.nextFocusElement)
    )
      document.getElementById(this.state.nextFocusElement).focus();
  }
  /** To call PHP method from continue button */
  handlePHPMethod(event, action, payload, customFormFields) {
    let isSuccess = false;
    var that = this;
    that.showLoader();
    $.ajax({
      method: "POST",
      url: `${that.props.configSettings.themeConfig.apiurl}?action=` + action,
      data: payload,
      processData: false,
      success: function (response) {
        if (response) {
          let apiResponse = JSON.parse(response);
          if (apiResponse.status === "success") {
            isSuccess = true;
            that.setState({ phpErrorMessages: "" });
            that.ContinueToNextPage(customFormFields);
            that.setState({
              isValid: false,
              isContinue: false,
            });
            that.hideLoader();
            if (customFormFields.showDynamicModalPopup)
              that.setState({
                isDynamicModalPopup: true,
                dynamicModalPopupButtonText:
                  customFormFields.dynamicModalPopupButtonText,
                dynamicModalPopupContent:
                  customFormFields.dynamicModalPopupContent,
                nextFocusElement: customFormFields.nextFocusElement,
              });
          } else {
            that.hideLoader();
            if (apiResponse.message && apiResponse.message.length > 0) {
              that.setState({ phpErrorMessages: apiResponse.message[0] });
            }
          }
        }
      },
      async: true,
    });
    return isSuccess;
  }
  redirectQuestion(event, redirectid) {
    this.setState({
      isManualBankForm: true,
      isDisplay: true,
    });
    return false;
  }
  // To validation any question based on configuration from continue button
  showErrorValidationOnGroup() {
    let tempgroupQuestion = this.props.versionConfigSettings.questions.filter(
      (x) => x.pageNumber === this.state.currentPage && x.type !== "group"
    );
    let isTempValid = true;
    tempgroupQuestion.forEach((element) => {
      if (isTempValid) {
        if (
          this.state[`show${element.stateName}Error`] != undefined &&
          this.state[`show${element.stateName}Error`]
        ) {
          isTempValid = false;
          element.isValid = false;
        } else {
          element.isValid = true;
        }
      }
    });

    return isTempValid;
  }
  GroupQuestionValidation() {
    let tempgroupQuestion = this.props.versionConfigSettings.questions.filter(
      (x) => x.type !== "group" && x.summaryInfo !== undefined
    );
    let isTempValid = true;
    let statePrefix = this.props.configSettings.fieldSettings.prefix;
    let stateSuffix = this.props.configSettings.fieldSettings.suffix;
    let errorCount = 0;
    tempgroupQuestion.forEach((element) => {
      if (element.validationRules) {
        if (
          element.showCheckbox &&
          element.checkBoxStateName &&
          this.state[element.checkBoxStateName]
        ) {
          this.state[`show${element.stateName}Error`] = false;
          this.state[`show${element.stateName}${element.errorCode}`] = false;

          this.setState({
            IsContinue: true,
            isValid: true,
          });
          this.state[`is${element.stateName}Valid`] = true;
          isTempValid = true;
        } else if (element.validationRules.required) {
          if (
            !element.value ||
            element.value === "" ||
            element.value === "Select" ||
            element.value == "select"
          ) {
            isTempValid = false;
            this.setState({
              IsContinue: true,
              isValid: false,
            });
            this.state[`is${element.stateName}Valid`] = false;
            errorCount++;
          } else if (element.pattern === "date") {
            let date =
              this.state[`${statePrefix}${element.stateName}${stateSuffix}`];
            let valuePattern =
              element.summaryInfo && element.summaryInfo.valuePattern
                ? element.summaryInfo.valuePattern
                : element.placeholder;
            date = convertDateFormat(date, valuePattern, "MM/DD/YYYY");
            date = date.replace(/_/g, "");
            if (date.length < 10) {
              isTempValid = false;
              this.state[`show${element.stateName}Message`] = "";
              this.setState({
                IsContinue: true,
                isValid: false,
              });
              this.state[`show${element.stateName}Error`] = true;
              errorCount++;
            }
          } else {
            let matchValidation = true;
            if (element.match) {
              matchValidation = this.handleMatch(
                false,
                null,
                element.match,
                element.value,
                element.name
              );
              element.valid = matchValidation;
            }
            if (element.valid) {
              this.state[`show${element.stateName}Error`] = false;
              this.state[
                `show${element.stateName}${element.errorCode}`
              ] = false;

              this.setState({
                IsContinue: true,
                isValid: true,
              });
              this.state[`is${element.stateName}Valid`] = true;
            } else {
              isTempValid = false;
              this.state[`show${element.stateName}${element.errorCode}`] = true;
              errorCount++;
            }
          }
          if (element.stateName && isTempValid) {
            isTempValid = this.handleDynamicRules(element.stateName, element);
            if (!isTempValid) {
              this.setState({
                IsContinue: true,
                isValid: false,
              });
              errorCount++;
            }
          }
          //this.state[`is${element.stateName}Valid`] = isTempValid;
        }
      } else {
        /** If form Is valide then reset error count */
        // this.state.errorCount=0;
        this.setState({
          IsContinue: true,
          isValid: true,
        });
        this.state[`show${element.stateName}Error`] = false;
        this.state[`is${element.stateName}Valid`] = true;
      }
    });

    if (errorCount === 0) isTempValid = true;
    else isTempValid = false;
    return isTempValid;
  }
  renderHiddenRow(props) {
    var objectValue = "";
    var objectName = "";
    var that = this;
    objectName = props.name;
    if (props.valueType === "state") {
      let statePrefix = this.props.configSettings.fieldSettings.prefix;
      let stateSuffix = this.props.configSettings.fieldSettings.suffix;
      if (props.isPlain === "true") {
        objectValue = unformat(
          this.state[`${statePrefix}${props.value}${stateSuffix}`],
          this.props.configSettings.fieldSettings.currencySymbol
        );
      } else {
        objectValue = this.state[`${statePrefix}${props.value}${stateSuffix}`];
      }
    } else if (props.valueType === "window") {
      objectValue = window[props.value];
    } else if (props.valueType === "props") {
      objectValue = this.props[props.value];
    } else if (props.valueType === "props-qs") {
      let objQeuryStringValue = this.props.QueryStrings.find(
        (element) => element.key === props.value
      );
      objectValue = objQeuryStringValue ? objQeuryStringValue.value : "";
    } else if (props.valueType === "configNode") {
      let node = this.props.versionConfigSettings[props.value];
      let isAdditionalBorrower = false;

      let additionalJson = null;
      if (this.state[props.value]) {
        let jsonObj = this.createJSONObject(node, that)
          .replace(`",}`, `"}`)
          .replace(`],}`, `]}`);
        if (props.additionalBorrower) {
          if (
            this.state[props.additionalBorrower.stateName] ===
            props.additionalBorrower.stateValue
          ) {
            let additionalNode =
              this.props.versionConfigSettings[
                props.additionalBorrower.configNode
              ];
            additionalJson = this.createJSONObject(additionalNode, that)
              .replace(`",}`, `"}`)
              .replace(`],}`, `]}`);
            isAdditionalBorrower = true;
          }
        }
        if (!this.containsObject(jsonObj, this.state[props.value])) {
          this.state[props.value].push(jsonObj);
          if (isAdditionalBorrower)
            this.state[props.value].push(additionalJson);
          objectValue = `[${this.state[props.value]}]`;
        }
      } else {
        objectValue = [];
      }
    } else {
      objectValue = "";
    }
    return (
      <input
        type="hidden"
        name={objectName}
        value={objectValue !== undefined ? objectValue : ""}
      />
    );
  }
  createJSONObject(node, that) {
    let jsonObject = "{";
    if (node) {
      node.filter((item) => {
        var objectValue = "";
        var objectName = "";
        objectName = item.name;
        if (item.valueType === "state") {
          let statePrefix = that.props.configSettings.fieldSettings.prefix;
          let stateSuffix = that.props.configSettings.fieldSettings.suffix;
          if (
            that.state[`${statePrefix}${item.value}${stateSuffix}`] &&
            item.currentFormat &&
            item.newFormat
          ) {
            let upDate = convertDateFormat(
              that.state[`${statePrefix}${item.value}${stateSuffix}`],
              item.currentFormat,
              item.newFormat
            );
            objectValue = upDate;
          } else if (item.isPlain === "true") {
            objectValue = unformat(
              that.state[`${statePrefix}${item.value}${stateSuffix}`],
              this.props.configSettings.fieldSettings.currencySymbol
            );
          } else {
            let stateValueType =
              that.state[
                `${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`
              ];
            if (
              Array.isArray(
                that.state[
                  `${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`
                ]
              )
            ) {
              objectValue = that.state[
                `${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`
              ]
                ? that.state[`${statePrefix}${item.value}${stateSuffix}`]
                : [];
            } else {
              objectValue = that.state[
                `${statePrefix}${item.value}${that.props.configSettings.fieldSettings.suffix}`
              ]
                ? that.state[`${statePrefix}${item.value}${stateSuffix}`]
                : "";
            }
          }
        } else if (item.valueType === "window") {
          objectValue = window[item.value] ? window[item.value] : "";
        } else if (item.valueType === "props") {
          objectValue = that.props[item.value] ? that.props[item.value] : "";
        } else if (item.valueType === "props-qs") {
          objectValue = that.props.QueryStrings[item.value]
            ? that.props.QueryStrings[item.value]
            : "";
        } else if (item.valueType === "configNode") {
          let subNode = that.props.versionConfigSettings[item.value];
          if (that.state[item.value]) {
            let jsonObj = that
              .createJSONObject(subNode, that)
              .replace(`",}`, `"}`)
              .replace(`],}`, `]}`);
            if (!that.containsObject(jsonObj, that.state[item.value])) {
              that.state[item.value].push(jsonObj);
              objectValue = `[${that.state[item.value]}]`;
            }
          } else {
            objectValue = [];
          }
        } else {
          objectValue = "";
        }
        if (item.valueType === "configNode") {
          jsonObject += `"${objectName}":${
            objectValue !== undefined ? objectValue : ""
          },`;
        } else {
          jsonObject += `"${objectName}":"${
            objectValue !== undefined ? objectValue : ""
          }",`;
        }
      });
    }
    return jsonObject + "}";
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
    let pages = this.GetPagesByVersion();
    var summaryPageSections =
      this.props.versionConfigSettings.summaryPageSections;
    return (
      <div>
        <input
          type="hidden"
          name="request"
          value={JSON.stringify(this.props.PostDataEX.request)}
        />
        <input
          type="hidden"
          name="formSubmissionCount"
          value={this.props.formFields.formSubmissionCount}
        />
        <input
          type="hidden"
          name="transactionType"
          value={this.props.formFields.transactionType}
        />
        <span>
          <h1 className="big-heading">
            {this.props.configSettings.formSettings.summaryPageHeading1}
          </h1>
          <h5 className="heading">
            {this.props.configSettings.formSettings.summaryPageHeading2}
          </h5>
        </span>

        <div>
          {summaryPageSections.map((section) =>
            this.renderSummarySections(section, pages)
          )}
          {/* {!this.state.IsSummaryPageEdit ? (
            <div className="row">
              <a
                className="col-sm-5 credit-soup-line-height summarypageLink"
                tabIndex="3"
                onClick={this.ShowLoanAppForm.bind(this)}
              >
                <i
                  className="fa fa-edit edit-icon-size "
                  style={{ fontSize: "15px" }}
                ></i>{" "}
                <u>
                  {this.props.configSettings.formSettings.summaryPageEditLink}
                </u>{" "}
              </a>
            </div>
          ) : (
            ""
          )} */}
        </div>

        <center>
          <div className="all-error-message">
            {this.state.errorCount > 0 ? (
              <span className="formerror-agreement">
                {this.props.configSettings.formSettings.summaryPageErrorMessage}
              </span>
            ) : this.state.consentMessage === true ? (
              <span className="formerror-agreement">
                {
                  this.props.configSettings.formSettings
                    .summaryPageConsentMessage
                }
              </span>
            ) : (
              <span className="formerror-agreement">&nbsp;</span>
            )}
          </div>
          <div className="row" id="formbutton">
            <button
              type="submit"
              id="viewpreqoffers"
              name="viewpreqoffers"
              tabIndex="52"
              className="btn bc-primary"
              disabled={this.state.initialDisabled}
              onClick={this.ContinueSummary.bind(this)}
            >
              {this.props.formFields.buttonText}
            </button>
            {this.state.showModal && (
              <div
                id="myModal"
                className={`modal ${
                  this.state.showModal ? "displayblock" : ""
                }`}
              >
                <div className="modal-content">
                  <div className="wrapper loans">
                    <div className="trans-logo">
                      <img
                        src={this.props.configSettings.themeConfig.logo}
                        alt=""
                      />
                    </div>
                    <div className="trans-statment">
                      <img src={this.props.configSettings.lockImage} alt="" />
                      <h1>
                        {
                          this.props.configSettings.formSettings
                            .summaryPageSubmitPopupText
                        }
                      </h1>
                    </div>

                    <div
                      className={`${
                        this.props.currentBrowser === "safari"
                          ? "load-img-mobile-safari"
                          : "load-img"
                      }`}
                    >
                      <i
                        className={`fa fa-refresh fa-spin ${
                          this.props.currentBrowser === "safari"
                            ? " safari "
                            : ""
                        }`}
                      ></i>
                    </div>

                    <div className="website-text">
                      <p> {this.state.loaderContent}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* {this.state.showInvalidAddressModal &&
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
                            } */}
          </div>
        </center>
      </div>
    );
  }
}

export default ConfigurableSummaryPage;
