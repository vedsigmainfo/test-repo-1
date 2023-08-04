import React, { Component } from "react";
import MaskedFormControl from 'react-bootstrap-maskedinput'
class SPMaskedTextField extends Component {
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
                
                <div className={this.props.css[this.props.type].spfieldContainer}>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                    <MaskedFormControl  mask={masking} 
                            className={`${this.props.css[this.props.type].spField} ${errorMsg !== "" ? this.props.css[this.props.type].hasError : ''}  `}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        maxLength={this.props.maxLength} disabled={!this.props.formFields.summaryInfo.editable}
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
export default SPMaskedTextField;