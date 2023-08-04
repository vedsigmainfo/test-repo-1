import React, { Component } from "react"; 

class BCLoginField extends Component {
    
    render() {
        const errorClass = 'has-error';
        const names = [ 'state', 'businessState','ownerState','employmentStatus','housingStatus','creditScore','employerState', 'salaryPeriod' ];
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        const inputType = this.props.name === 'email' ? "text" : "password";
        const inputMode= 'inputMode' in this.props ? this.props.inputMode : "";  
        const placeHolder = this.props.formFields.placeholder; //.replace("{{X}}", this.props.OwnerCount);
        //let character1 = this.props.name === 'password' ? (this.state[`${(inputType)}Strengthcharacter`]==null ? this.state[`${(inputType)}Strengthcharacter`]:false) :false;
        let character1 = ''
        if( this.props[`${(inputType)}Strengthcharacter`] != undefined && this.props[`${(inputType)}Strengthcharacter`] )
        {
            character1 =this.props[`${(inputType)}Strengthcharacter`];
        }
        let character = this.props.PasswordStrengthChar;
        let lowercase = this.props.PasswordStrengthLower;
        let number = this.props.PasswordStrengthNumber;
        let special = this.props.PasswordStrengthSpecial;
        let upercase = this.props.PasswordStrengthUper;
        let arr=this.props.customArray;
        
        return (  
            <div className={`${this.props.columnStyle}`}>
                {this.props.formFields.showTitle && <h2 className="fieldname">{this.props.formFields.title}</h2> }
               
                <div className={`form-group`} >
                {this.props.name === 'password' ? <span>
                    <span >Please enter a password with:</span>
                    <ul style={{"textAlign":"left"}}>
                        {/* { arr  ? arr.map((key,value)=>dangerouslySetInnerHTML={ __html: (key.message) } ):''} */}
                      
                        { arr  ? arr.map((key,value)=><li style={{"color": key.color}}>At least <b>{key.value} {key.key}</b></li>):''} 
                        
                        {/* <li style={{"color": `${character ? 'green' : 'red'}`}}>At least <b>8 characters</b></li>
                        <li style={{"color": `${lowercase ? 'green' : 'red'}`}}>At least one <b>lowercase letter</b></li> */}
                        {/* <li style={{"color": `${upercase ? 'green' : 'red'}`}}>At least one <b>uppercase letter</b></li>
                        <li style={{"color": `${number ? 'green' : 'red'}`}}>At least one <b>number</b></li>
                        <li style={{"color": `${special ? 'green' : 'red'}`}}>At least one <b>special</b> character</li> */}
                    </ul>
                <input name={ this.props.name === 'email' || this.props.name === 'password' || this.props.name === 'verifyPassword' ? '' : this.props.name} required="" className={`  form-control  ${this.props.IsNumeric ? ' number ' : ''}  ${!this.props.showError || !this.props.showErrorMessage || !this.props.showCodeErrorMessage ? errorClass : ''} ${names.indexOf(this.props.name) === -1 ? '' : 'address-margin'} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.handleChangeEvent}
                        onFocus={this.props.handleChangeEvent}
                        maxLength={this.props.max} disabled={this.props.disabled}
                        onBlur={this.props.handleChangeEvent}
                        onTouchEnd={this.props.handleChangeEvent}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={placeHolder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                    /> </span> :
                    <input name={ this.props.name === 'email' || this.props.name === 'password' || this.props.name === 'verifyPassword' ? '' : this.props.name} required="" className={`  form-control  ${this.props.IsNumeric ? ' number ' : ''}  ${!this.props.showError || !this.props.showErrorMessage || !this.props.showCodeErrorMessage ? errorClass : ''} ${names.indexOf(this.props.name) === -1 ? '' : 'address-margin'} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onChange={this.props.handleChangeEvent}
                        onFocus={this.props.handleChangeEvent}
                        maxLength={this.props.max} disabled={this.props.disabled}
                        onBlur={this.props.handleChangeEvent}
                        onTouchEnd={this.props.handleChangeEvent}
                        tabIndex={this.props.tabIndex} inputMode={inputMode}
                        placeholder={placeHolder} type={inputType} value={this.props.value}
                        min={this.props.min} id={this.props.name}
                        autoFocus={this.props.AutoFocus}
                    />  
                }
                </div>
                <div className="error-height">
                    <span className={`formerror ${this.props.name === "Email" ? 'top-margin-error-message has-error-mac' : ''} `} >
                        <span >{!this.props.showError && this.props.formFields.required}</span>
                        <span className="">{!this.props.showErrorMessage && this.props.formFields.errormessage}</span>
                    </span>
                </div>
            </div>
      
        );
    }
}

export default BCLoginField;