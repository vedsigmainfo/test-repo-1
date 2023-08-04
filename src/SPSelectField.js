import React, { Component } from "react"; 

class SPSelectField extends Component {
    render() {
        const names = [ 'state','employmentStatus','housingStatus','creditScore','employerState', 'salaryPeriod' ];
        const showTitle = false; //'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        if(!this.props.showError && this.props.showError !== undefined )
        var errorMsg = "";
        
        if(!this.props.showError && this.props.showError !== undefined )
        errorMsg = "required"; //this.props.formFields.required;
        else if (this.props.showErrorMessage && (this.props.customMessage ==='' || this.props.customMessage === undefined  ))
        errorMsg = this.props.formFields.errormessage;
        else if (this.props.customMessage)
        errorMsg = this.props.customMessage;
        else
        errorMsg = "";
        return (  
            <div className={`${this.props.formFields.summaryInfo.columnStyle}`}>
                <h2 className={this.props.css[this.props.type].sptitle}>{this.props.formFields.summaryInfo.title}
                {errorMsg? 
                     <span className={this.props.css[this.props.type].sperrorBlockSpan}>
                       
                        <span>{errorMsg}</span> 
                    </span>:''}
                </h2>
                {/* {this.props.formFields.showTitle && <h2 className={this.props.css[this.props.type].title}>{this.props.formFields.summaryInfo.title}</h2> } */}
                <div className={this.props.css[this.props.type].spfieldContainer}>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                    <input type="hidden" name={this.props.name} id={this.props.name} value={this.props.SelectedValue}  />
                    <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                    <select tabIndex={this.props.tabIndex} className= {`${this.props.css[this.props.formFields.summaryInfo.controlType].spField} ${this.props.disabled ? this.props.css[this.props.type].fieldDisabled : ''} ${errorMsg !=='' ? this.props.css[this.props.type].hasError : ''} ${names.indexOf(this.props.name) === -1 || errorMsg ==='' ? '' : this.props.css[this.props.type].errorMargin } ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        onTouchEnd={this.props.HandleSelectedOption.bind(this, true)}
                        disabled={this.props.disabled}
                        value={this.props.SelectedValue} autoFocus={false}
                        onChange={this.props.HandleSelectedOption.bind(this, true)}
                        id={`${this.props.name}`}
                        name={`${this.props.name}`}
                        onKeyDown={this.props.onKeyDown}
                    >

                    {this.props.ListData.map(element => {
                        return <option key={element.key}
                            value={element.key} dangerouslySetInnerHTML={{ __html: `${element.label}` }}></option>
                    })}

                    </select>
                </div>
                 
            </div>
        );
    }
}
export default SPSelectField;