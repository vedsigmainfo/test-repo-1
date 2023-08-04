import React, { Component } from "react";
import MaskedFormControl from 'react-bootstrap-maskedinput'
class SPMaskedTextCheckBoxField extends Component {
    getMask(){
        let mask = this.props.patterns.find(item => item.field === this.props.formFields.pattern);
        return mask ? mask.pattern : "";
    }

    onCheckboxChange = (event) =>{
        this.props.handleCheckboxEvent(this.props.formFields,true, event)
    }
    getInputType() {
        let inputType = "text";
        if(this.props.formFields.isPassword){
            if(this.props.isFocused) {
                inputType = "tel";
            } else {
                inputType = "password";
            }
        }
        return inputType;
    }
    render() {
        const names = [ 'state', 'zipcode'];
        const masking = this.getMask();
        let tooltipTextStyle = {};// !this.props.isFocused ? { visibility: "visible" } : {};
        const showTitle = false; //'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        //const inputType = 'inputType' in this.props ? this.props.inputType : "text";
        const inputMode= 'inputMode' in this.props ? this.props.inputMode : "";
        let inputType = this.getInputType();
        var errorMsg = "";
        if(!this.props.showError && this.props.showError !== undefined )
        {
            errorMsg = 'required'; // this.props.formFields.required;
            tooltipTextStyle = { visibility: "visible" };
        }
        else if (this.props.showErrorMessage && (this.props.customMessage ==='' || this.props.customMessage === undefined  ))
        {
            errorMsg = this.props.formFields.errormessage;
            tooltipTextStyle = { visibility: "visible" };
        }
        else if (this.props.customMessage)
        {
            errorMsg = this.props.customMessage;
            tooltipTextStyle = { visibility: "visible" };
        }
        else
        {
            tooltipTextStyle = { };
            errorMsg = "";
        }

        return (
            <div className={`${this.props.formFields.summaryInfo.columnStyle}`}>
                <h2 className={this.props.css[this.props.type].sptitle}>{this.props.formFields.summaryInfo.title}
                    <a className="loan-app info-tooltip">
                        <span className={`sptooltiptext tooltip-top-margin-spcontrols `}  style={tooltipTextStyle} >{errorMsg}</span>
                    </a>
                </h2>
                {(this.props.formFields.showCheckbox || this.props.formFields.showCheckbox  ==='true') &&
                   <div className={this.props.css[this.props.type].spcheckboxContainer}>      
                        <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                       <input className={`${this.props.css[this.props.type].checkbox} ${this.props.disabled ? this.props.css[this.props.type].fieldDisabled : ''}`} name={`chk-${this.props.name}`} id={`chk-${this.props.name}`} type="checkbox" checked={this.props.IsCheckboxChecked ? true : false} onChange={this.onCheckboxChange.bind(this)} ></input>
                       <p className={`${this.props.css[this.props.type].checkboxTitle} `} name={`p-${this.props.name}`} id={`p-${this.props.name}`}> {this.props.formFields.checkBoxText}</p>
                   </div>
                }
                {/* {this.props.formFields.showTitle && <h2 className={this.props.css[this.props.type].title}>{this.props.formFields.summaryInfo.title}
                    {this.props.showTooltip && <a className={this.props.css[this.props.type].tooltip}><span className={this.props.css[this.props.type].tooltipText} style={tooltipTextStyle}>List your total available income including wages, retirement, investments, and rental properties. You are not required to disclose income that is alimony, child support or separate maintenance unless you want to use that income to qualify for a loan. If applicable, include self-employment salary. For total commission earnings, provide an annual average. Increase non-taxable income/benefits by 25%.</span><i className={this.props.css[this.props.type].tooltipIcon}></i></a>}
                </h2>} */}
                
                <div className={this.props.css[this.props.type].spfieldContainer}>
                   
                    <MaskedFormControl  mask={masking} 
                            className={`${this.props.css[this.props.type].spField} ${errorMsg !== "" ? this.props.css[this.props.type].hasError : ''}  `}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        maxLength={this.props.maxLength} disabled={this.props.IsCheckboxChecked ? true : false}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        onTouchEnd={this.props.HandleSelectedOption.bind(this, true)}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={this.props.formFields.placeholder} type={inputType} value={this.props.formFields.value}
                        min={this.props.min} max={this.props.max} id={this.props.name}
                        autoFocus={false} onKeyDown={this.props.onKeyDown}
                        />
                </div>
            </div>
        );
    }
}
export default SPMaskedTextCheckBoxField;