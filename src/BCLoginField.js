import React, { Component } from "react"; 

class BCLoginField extends Component {
    
    render() {
        const errorClass = 'has-error';
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        const inputType = this.props.name === 'email' || this.props.name === 'user-email' ? "text" : "password";
        const inputMode= 'inputMode' in this.props ? this.props.inputMode : "";  
        const placeHolder = this.props.formFields.placeholder; //.replace("{{X}}", this.props.OwnerCount);
        const customPrefix = this.props.formFields.customValidationPrefix;
        var errorMsg = "";
        
        if(!this.props.showError && this.props.showError !== undefined )
        errorMsg = this.props.formFields.required;
        else if (this.props.showErrorMessage && (this.props.customMessage ==='' || this.props.customMessage === undefined  ))
        errorMsg = this.props.formFields.errormessage;
        else if (this.props.customMessage)
        errorMsg = this.props.customMessage;
        else
        errorMsg = "";
        
        let arr=this.props.customArray;
        const isDisabled = this.props.formFields.isDisabled && (this.props.value!== undefined && this.props.value != '') ? true: false;
        
        return (  
            <div className={`${this.props.columnStyle}`}>
                {this.props.formFields.showTitle && <h3 className={this.props.css[this.props.type].loginheadertext}>{this.props.formFields.title}</h3>}
                <h4 className={this.props.css[this.props.type].loginheadertext}>{this.props.formFields.description}</h4>
                <div className={`form-group ${this.props.name === 'email' ? this.props.css[this.props.type].prefilledemailtextbox : ''}`} >
                <h4 className={this.props.css[this.props.type].emailtitle}>{this.props.formFields.fieldtitle}</h4>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                {this.props.name === 'password' ? <span> 
                   
                    <ul className={this.props.css[this.props.type].errormessagelist}>
                    <span className={this.props.css[this.props.type].errorheadingText} >{this.props.formFields.requiredTitle}</span>
                    <div id="message">
                        { arr !== undefined && arr && arr.length > 0 ? arr.map((key,value)=><p key={value} className={key.color === 'green' ? this.props.css.login.validpass : this.props.css.login.invalidpass}>{customPrefix} <b>{key.value} {key.label}</b></p>):''} 
                    </div>                    
                    </ul>
                <input name={ this.props.name} required="" 
                 className={`form-control  ${errorMsg !=='' || this.props.showErrorMessage
                 ? this.props.css[this.props.type].hasError : ''} 
                     ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.handleChangeEvent.bind(this,  this.props.name==='password' ||this.props.name==='verifyPassword' ? false:true )}
                       onFocus={this.props.handleChangeEvent.bind(this, true)}
                        maxLength={this.props.max} disabled={this.props.disabled}
                        onBlur={this.props.handleChangeEvent.bind(this, false)}
                        //onTouchEnd={this.props.handleChangeEvent}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={placeHolder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name} 
                        autoFocus={this.props.AutoFocus}
                        onKeyDown={this.props.onKeyDown}
                    /> </span> :
                    <input name={ this.props.name === 'email' 
                    || this.props.name === 'verifyPassword' ? '' : this.props.name} required=""
                     className={`  form-control  ${errorMsg !== ""  ? errorClass : ''}
                        ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.handleChangeEvent.bind(this, true)}
                         onFocus={this.props.handleChangeEvent.bind(this, true)}
                        maxLength={this.props.max} disabled={this.props.disabled}
                        onBlur={this.props.handleChangeEvent.bind(this, false)}
                        //onTouchEnd={this.props.handleChangeEvent}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={placeHolder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                        onKeyDown={this.props.onKeyDown}
                    />  
                }
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

export default BCLoginField;