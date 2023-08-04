import React, { Component } from "react";
import CurrencyFormat from 'react-currency-format';
import { AmountFormatting } from "./Validation/RegexList";
class TextField extends Component {
     
    render() {
        const errorClass = 'has-error';
        const names = [ 'state', 'zipCode','employerName'];
        const tooltipTextStyle = this.props.isFocused ? { visibility: "visible" } : {};
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        const inputType = 'inputType' in this.props ? this.props.inputType : "text";
        const inputMode= 'inputMode' in this.props ? this.props.inputMode : "";      
        let minAmount = this.props.isMinChanged ? 2000 : this.props.min; 
        let currencySymbol = this.props.configSettings.fieldSettings.currencySymbol;
        return (
            <div className={`${this.props.columnStyle}`}>
                {showTitle && names.indexOf(this.props.name) === -1 && <h2 className="fieldname">{this.props.formFields.title}
                    {this.props.showToolTip && <a className="loan-app info-tooltip"><span className="tooltiptext tooltip-top-margin-anualincome" style={tooltipTextStyle}>List your total available income including wages, retirement, investments, and rental properties. You are not required to disclose income that is alimony, child support or separate maintenance unless you want to use that income to qualify for a loan. If applicable, include self-employment salary. For total commission earnings, provide an annual average. Increase non-taxable income/benefits by 25%.</span><i className={`fa fa-info-circle`}></i></a>}
                </h2>}
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                <div className={`form-group ${this.props.name === 'firstname' || this.props.name === 'lastname'
                || this.props.name === 'address1' || this.props.name === 'appartment' || this.props.name === 'city'
                || this.props.name === 'state' || this.props.name === 'zipCode' || this.props.name === 'SSN'
                || this.props.name === 'employerName' || this.props.name === 'position' ||this.props.name === 'salaryAmount' ||  this.props.name === 'salaryPeriod' 
                || this.props.name === 'employerAddress1' || this.props.name === 'employerAddress2' || this.props.name === 'employerCity'
                || this.props.name === 'employerState' || this.props.name === 'employerZipCode'
                ? ' mobile-text-bottom ' : ''}`}>
                    
                    {this.props.name === "loanAmount" || this.props.name === 'annualIncome' || this.props.name === "housingPayment" || this.props.name === "salaryAmount" ?
                    <CurrencyFormat name={this.props.name} required="" className={`form-control ${this.props.IsNumeric ? ' number ' : ''}  ${!this.props.showError || !this.props.showErrorMessage || !this.props.showCodeErrorMessage ? errorClass : ''} ${names.indexOf(this.props.name) === -1 ? '' : 'address-margin'} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.handleChangeEvent.bind(this, true)}
                        thousandSeparator={true}
                        prefix={'$'}
                        onFocus={this.props.handleChangeEvent.bind(this, true)}
                        maxLength={this.props.max} disabled={this.props.disabled}
                        onBlur={this.props.handleChangeEvent.bind(this, false)}
                        onTouchEnd={this.props.handleChangeEvent.bind(this, true)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}/>
                    :
                    <input name={this.props.name === 'primaryPhoneNumber' || this.props.name === 'employerPhoneNumber' ? '' : this.props.name} required="" className={`  form-control  ${this.props.IsNumeric ? ' number ' : ''}  ${!this.props.showError || !this.props.showErrorMessage || !this.props.showCodeErrorMessage ? errorClass : ''} ${names.indexOf(this.props.name) === -1 ? '' : 'address-margin'} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.handleChangeEvent.bind(this, true)}
                        onFocus={this.props.handleChangeEvent.bind(this, true)}
                        maxLength={this.props.max} disabled={this.props.disabled}
                        onBlur={this.props.handleChangeEvent.bind(this, false)}
                        onTouchEnd={this.props.handleChangeEvent.bind(this, true)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                        />
                }
                </div>
                 <div className="error-height">
                    <span className={`formerror `}  >
                        <span className="">{!this.props.showError && this.props.showError !== undefined && this.props.formFields.required}</span>
                        { this.props.customeMessage !== '' ? <span className="">{!this.props.showErrorMessage && this.props.showErrorMessage !== undefined && this.props.customeMessage}</span> :
                        <span className="">{!this.props.showErrorMessage && this.props.formFields.errormessage}</span> }
                        {this.props.name === 'loanamount' ? <span className="">{!this.props.showCodeErrorMessage && ` ${this.props.formFields.errormessagecode} ${currencySymbol + AmountFormatting(minAmount)} and ${currencySymbol + AmountFormatting(this.props.max)}`}</span> :
                        <span className="">{!this.props.showCodeErrorMessage && this.props.showCodeErrorMessage !== undefined&& ` ${this.props.formFields.errormessagecode} ${this.props.max ? `${currencySymbol + AmountFormatting(minAmount)} and ${currencySymbol + AmountFormatting(this.props.max)}` : ''}`}</span> }
                    </span>
                </div>
            </div>
        );
    }
}

export default TextField;