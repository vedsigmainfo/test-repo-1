import React, { Component } from "react";
import CurrencyFormat from 'react-currency-format';
class BCTextField extends Component {
        render() {
        const names = [ 'state', 'zipCode','employerName'];
        const tooltipTextStyle = this.props.isFocused ? { visibility: "visible" } : {};
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        const inputType = 'inputType' in this.props ? this.props.inputType : "text";
        const inputMode= 'inputMode' in this.props ? this.props.inputMode : "";      
        var errorMsg = "";
        
        if(!this.props.showError && this.props.showError !== undefined )
        errorMsg = this.props.formFields.required;
        else if (this.props.showErrorMessage && (this.props.customMessage ==='' || this.props.customMessage === undefined  ))
        errorMsg = this.props.formFields.errormessage;
        else if (this.props.customMessage)
        errorMsg = this.props.customMessage;
        else
        errorMsg = "";

        return (
            <div className={`${this.props.columnStyle}` }>
                {showTitle && names.indexOf(this.props.name) === -1 && 
                <h2 className={this.props.css[this.props.type].title}>{this.props.formFields.title}
                    {this.props.showToolTip && <a className={this.props.css[this.props.type].tooltip}>
                        <span className={this.props.formFields.tooltipcssclass} style={tooltipTextStyle} dangerouslySetInnerHTML={{ __html: `${this.props.formFields.tooltipText}` }}>
                        </span>
                             <i className={this.props.css[this.props.type].tooltipIcon}></i></a>}
                </h2>}
                <h3 className="alignCenter">{this.props.formFields.titlebold}</h3>
                {this.props.formFields.description && <p className="fieldname-des"> <br />{this.props.formFields.description}</p>}
                <div className={`${this.props.css[this.props.type].fieldContainer}`}>
                    <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                    {this.props.formFields.isNumber ?
                    <CurrencyFormat name={this.props.name} required=""
                      className={`${this.props.css[this.props.type].field} 
                      ${errorMsg !== "" ? this.props.css[this.props.type].hasError : ''} ${names.indexOf(this.props.name) === -1 ? '' : this.props.css[this.props.type].errorMargin} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        thousandSeparator={this.props.formFields.thousandSeparator !== undefined ? this.props.formFields.thousandSeparator : ','}
                        prefix={this.props.configSettings.fieldSettings.currencySymbol}
                        onFocus={this.props.HandleSelectedOption.bind(this, false)}
                        maxLength={this.props.maxLength} disabled={this.props.disabled}
                        max={this.props.max}
                        decimalSeparator={this.props.formFields.decimalSeparator !== undefined ? this.props.formFields.decimalSeparator : '.'}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                        onKeyDown={this.props.onKeyDown}
                        />
                    :
                    <input name={this.props.name} required=""
                       className={`${this.props.css[this.props.type].field}  ${errorMsg !=='' || this.props.showErrorMessage || this.props.showCodeErrorMessage 
                       ? this.props.css[this.props.type].hasError : ''} 
           
                       ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        maxLength={this.props.max} disabled={this.props.disabled}
                        onKeyDown={(e)=> e.keyCode === 13 ? e.preventDefault(): ''}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                        // onKeyDown={this.props.onKeyDown}
                        />
                }
                </div>
                 {errorMsg === <div className={this.props.css[this.props.type].errorBlockHeight}></div> ? '':
                 <div className={this.props.css[this.props.type].errorBlockHeight}>
                    
                    {errorMsg? 
                     <span className={this.props.css[this.props.type].errorBlockSpan}>
                       
                        <span>{errorMsg}</span> 
                    </span>:''}
                </div>
        }
            </div>
        );
    }
}
export default BCTextField;