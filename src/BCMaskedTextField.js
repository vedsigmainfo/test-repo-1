import React, { Component } from "react";
import MaskedFormControl from 'react-bootstrap-maskedinput'
class BCMaskedTextField extends Component {
    getMask(){
        let mask = this.props.patterns.find(item => item.field === this.props.formFields.pattern);
        return mask ? mask.pattern : "";
    }

    onCheckboxChange = (event) =>{
        this.props.handleCheckboxEvent(this.props.formFields,true, event)
    }
    componentDidMount(){
        let that = this;
        if(document.getElementById(that.props.name)) {
            document.getElementById(that.props.name).onkeypress = function(e) { 
                if(e.keyCode === 13 || e.charCode === 13) {
                    that.props.onKeyDown(e);
                }                
            };
        }
    }
    render() {
        const names = [ 'state', 'zipcode'];
        const masking = this.getMask();
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
            <div className={`${this.props.columnStyle}`}>
                {(this.props.formFields.showCheckbox || this.props.formFields.showCheckbox  ==='true') &&
                   <div className={this.props.css[this.props.type].checkboxContainer}>      
                        <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                       <input className={`${this.props.css[this.props.type].checkbox} ${this.props.disabled ? this.props.css[this.props.type].fieldDisabled : ''}`} name="currentPosition" id="chk-currentPosition" type="checkbox" checked={this.props.IsCheckboxChecked ? true : false} onChange={this.onCheckboxChange.bind(this)} ></input>
                       <p className={this.props.css[this.props.type].checkboxTitle} name="currentPosition" id="currentPosition"> {this.props.formFields.checkBoxText}</p>
                   </div>
                }
                {this.props.formFields.showTitle && <h2 className={this.props.css[this.props.type].title}>{this.props.formFields.title}
                    {this.props.showTooltip && <a className={this.props.css[this.props.type].tooltip}><span className={this.props.css[this.props.type].tooltipText} style={tooltipTextStyle}>List your total available income including wages, retirement, investments, and rental properties. You are not required to disclose income that is alimony, child support or separate maintenance unless you want to use that income to qualify for a loan. If applicable, include self-employment salary. For total commission earnings, provide an annual average. Increase non-taxable income/benefits by 25%.</span><i className={this.props.css[this.props.type].tooltipIcon}></i></a>}
                </h2>}
                
                <div className={this.props.css[this.props.type].fieldContainer}>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                    <MaskedFormControl  mask={masking} 
                        className={`${this.props.css[this.props.type].field} ${errorMsg !== "" ? this.props.css[this.props.type].hasError : ''} ${names.indexOf(this.props.name) === -1 ? '' : this.props.css[this.props.type].errorMargin} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        maxLength={this.props.maxLength} disabled={this.props.disabled}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        onTouchEnd={this.props.HandleSelectedOption.bind(this, true)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.formFields.value}
                        min={this.props.min} max={this.props.max} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                        onKeyPress={this.props.onKeyDown}
                        
                        />
                </div>
               
                <div className={this.props.css[this.props.type].errorBlockHeight}>
                {errorMsg? 
                     <span className={this.props.css[this.props.type].errorBlockSpan}>
                       
                        <span>{errorMsg}</span> 
                    </span>:''}
                   
                </div>
            </div>
        );
    }
}
export default BCMaskedTextField;