import React, { Component } from "react"; 

class BCSingleButtonField extends Component {
    
   
    render() {
        //const errorClass = 'has-error';
        const names = [ 'state' ];
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        //const autoHeight = this.props.autoHeight ? ' auto-height ' : '';
        return (  
            <div className={`${this.props.columnStyle}`}>
                {!this.props.ShowConsent && <span>
                {showTitle && names.indexOf(this.props.name) === -1 && <h2 className="fieldname"></h2> }
                
                <div className={`form-group`} >
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                <input type="hidden" name={this.props.name} id={this.props.name} value={this.props.SelectedValue}  />
              
                 <button type="submit"  tabIndex="1" id={this.props.name} name={this.props.name} className='btn bc-primary ' onClick={this.props.HandleSelectedOption.bind(this, true)}>{this.props.Title}</button>
               
                <div className="error-height">
                    <span className={`formerror ${this.props.name === "state" ? 'top-margin-error-message has-error-mac' : ''} `} >
                      
                    </span>
                </div>
              
                </div>
                </span> }
            </div>
      
        );
    }
}

export default BCSingleButtonField;