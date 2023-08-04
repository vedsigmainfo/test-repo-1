import React, { Component } from "react"; 

class SelectField extends Component {
    
    render() {
        const errorClass = 'has-error';
        const names = [ 'state','employmentStatus','housingStatus','creditScore','employerState', 'salaryPeriod' ];
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        //const autoHeight = this.props.autoHeight ? ' auto-height ' : '';
        return (  
            <div className={`${this.props.columnStyle}`}>
                {showTitle && names.indexOf(this.props.name) === -1 && <h2 className="fieldname">{this.props.formFields.title}</h2> }
               
                <div className={`form-group`} >
                {/* <input type="hidden" name={this.props.name} id={this.props.name} value={this.props.SelectedValue}  /> */}
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                <select tabIndex={this.props.tabIndex} className= {`loan-app form-control form-group  ${this.props.disabled ? 'select-disabled' : ''} ${!this.props.showError ? errorClass : ''} ${names.indexOf(this.props.name) === -1 || !this.props.showError ? '' : 'address-margin' } ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                    onFocus={this.props.OnDropdownClick}
                    onBlur={this.props.HandleSelectedOption.bind(this, false)}
                    onTouchEnd={this.props.HandleSelectedOption.bind(this, true)}
                    disabled={this.props.disabled}
                    value={this.props.SelectedValue} autoFocus={this.props.AutoFocus}
                    onChange={this.props.HandleSelectedOption.bind(this, true)}
                    id={`${this.props.name}`}
                >

                {this.props.ListData.map(element => {
                    return <option key={element.key}
                        value={element.key}>
                        {element.label}
                    </option>
                })}

                </select>
                </div>
                <div className="error-height">
                    <span className={`formerror ${this.props.name === "state" ? 'top-margin-error-message has-error-mac' : ''} `} >
                        <span >{!this.props.showError && this.props.formFields.required}</span>
                    </span>
                </div>
                {/* {this.props.name === "state" && <p className="fieldname">Don't see your state listed? 
                    <a className="loan-app info-tooltip" disabled={this.props.disabled}>   
                        <span className="tooltiptext tooltip-top-margin-state">If your state is missing, it means we haven't opened for business there just yet. Please check back soon.</span>
                            <i className="fa fa-info-circle" ></i></a> </p>} */}
                {/* HTML dropdown start */}
                    {/* <span className="formerror " >
                        <span >{!this.props.showError && this.props.formFields.required}</span>
                    </span> */}
                
            </div>
      
        );
    }
}

export default SelectField;