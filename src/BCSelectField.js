import React, { Component } from "react"; 

class BCSelectField extends Component {
    render() {
        const names = [ 'state','employmentStatus','housingStatus','creditScore','employerState', 'salaryPeriod' ];
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
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
                {this.props.formFields.showTitle && <h2 className={this.props.css[this.props.type].title}>{this.props.formFields.title}</h2> }

                <h3 className="alignCenter">{this.props.formFields.titlebold}</h3>  
                <p className="alignJustify">{this.props.formFields.description}</p>
                <p className="alignJustify">{this.props.formFields.description2}</p>

                <div className={this.props.css[this.props.type].fieldContainer}>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                    <select tabIndex={this.props.tabIndex} className= {`${this.props.css[this.props.type].field} ${this.props.disabled ? this.props.css[this.props.type].fieldDisabled : ''} ${errorMsg !=='' ? this.props.css[this.props.type].hasError : ''} ${names.indexOf(this.props.name) === -1 || errorMsg ==='' ? '' : this.props.css[this.props.type].errorMargin } ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        onFocus={this.props.HandleSelectedOption.bind(this, true)}
                        onBlur={this.props.HandleSelectedOption.bind(this, false)}
                        onTouchEnd={this.props.HandleSelectedOption.bind(this, true)}
                        disabled={this.props.disabled}
                        value={this.props.SelectedValue} autoFocus={this.props.AutoFocus}
                        onChange={this.props.HandleSelectedOption.bind(this, false)}
                        id={`${this.props.name}`}
                        name={`${this.props.name}`}
                    >

                    {this.props.ListData.map(element => {
                        return <option key={element.key}
                            value={element.key}>
                            {element.label}
                        </option>
                    })}

                    </select>
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
export default BCSelectField;