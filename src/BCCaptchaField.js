import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
class BCCaptchaField extends Component {
 
    constructor(props){
        super(props);
    }

    render() {
        if(!this.props.showError && this.props.showError !== undefined )
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
                {/* <input type="hidden" name={this.props.formFields.name} value={this.state.captchaValue} /> */}
                <ReCAPTCHA 
                    sitekey={this.props.configSettings.themeConfig.captchaSiteKey} 
                    onChange={this.props.HandleSelectedOption.bind(this, false )}
                /> 
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
export default BCCaptchaField;