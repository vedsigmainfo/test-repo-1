import React, { Component } from "react";
import CurrencyFormat from 'react-currency-format';
class SPTextField extends Component {
        render() {
        const names = [ 'state', 'zipCode','employerName'];
        let tooltipTextStyle =  !this.props.isFocused ? { visibility: "visible" } : {};
        const showTitle = false; //'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        const inputType = 'inputType' in this.props ? this.props.inputType : "text";
        const inputMode= 'inputMode' in this.props ? this.props.inputMode : "";      
        var errorMsg = "";
         
        if(!this.props.showError && this.props.showError !== undefined )
        {
            errorMsg = "required";//this.props.formFields.required;
            tooltipTextStyle = { visibility: "visible" };
        }
        else if (this.props.showErrorMessage && (this.props.customMessage ==='' || this.props.customMessage === undefined  ))
        { 
            errorMsg = this.props.formFields.errormessage; 
            tooltipTextStyle = { visibility: "visible" };
        }
        else if (this.props.customMessage)
        {
            tooltipTextStyle = { visibility: "visible" };
            errorMsg = this.props.customMessage;
        }
        else
        {
            errorMsg = "";
            tooltipTextStyle = {};
        }

        return (
            <div className={`${this.props.formFields.summaryInfo.columnStyle}` }>
                <h2 className={this.props.css[this.props.type].sptitle}>{this.props.formFields.summaryInfo.title}

                   <a className="loan-app info-tooltip">
                        <span className={`sptooltiptext tooltip-top-margin-spcontrols `}  style={tooltipTextStyle} >{errorMsg}</span>
                    </a>
                </h2>
                <div className={`${this.props.css[this.props.type].spfieldContainer}`}>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                    {this.props.formFields.isNumber ?
                    <CurrencyFormat name={this.props.name} required=""
                      className={`${this.props.css[this.props.type].spField} 
                      ${errorMsg !== "" ? this.props.css[this.props.type].hasError : ''} ${names.indexOf(this.props.name) === -1 ? '' : this.props.css[this.props.type].errorMargin} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        thousandSeparator={true}
                        prefix={this.props.configSettings.fieldSettings.currencySymbol}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        maxLength={this.props.maxLength} disabled={!this.props.formFields.summaryInfo.editable}
                        max={this.props.max}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={false} 
                        onKeyDown={this.props.onKeyDown}/>
                    :
                    <input name={this.props.name} required=""
                       className={`${this.props.css[this.props.type].spField}  ${errorMsg !=='' || this.props.showErrorMessage || this.props.showCodeErrorMessage 
                       ? this.props.css[this.props.type].hasError : ''} 
           
                       ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        maxLength={this.props.max} disabled={!this.props.formFields.summaryInfo.editable}
                        onKeyDown={(e)=> e.keyCode === 13 ? e.preventDefault(): ''}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                        onKeyDown={this.props.onKeyDown}
                        />
                }
                </div>
                 {/* {errorMsg === <div className={this.props.css[this.props.type].errorBlockHeight}></div> ? '':
                    <div className={this.props.css[this.props.type].errorBlockHeight}>
                        
                       
                    </div>
                } */}
            </div>
        );
    }
}
export default SPTextField;