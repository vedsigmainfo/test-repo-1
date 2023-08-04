import React, { Component } from "react";
class BCConsentField extends Component {


    componentDidMount() {
        
        if(document.getElementById(this.props.formFields.errorId)) {
            document.getElementById(this.props.formFields.errorId).style.display = 'none';
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value || this.props.showError !== prevProps.showError) {
          
            this.showMessage();
        }
      }

    ConsentCheckChange(e) {
        this.props.value = document.getElementById(this.props.configSettings.formSettings.name)[this.props.formFields.name].checked;
    }
    showMessage() {
        if(document.getElementById(this.props.formFields.errorId)) {
            if(this.props.value) {
                document.getElementById(this.props.formFields.errorId).style.display = 'none';
            } else {
                document.getElementById(this.props.formFields.errorId).style.display = 'block';
            }
            
        }
        
    }
    render() {
        const {name} = this.props;
        const {Title} = this.props;
        return (
            <div className={`${this.props.columnStyle}`}>
                {this.props.formFields.showTitle && 
                    <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                        <div className={` message-allignment col-md-12 `}>
                        { 
                            (this.props.formFields.makeLink) ?<div className="fieldname"  dangerouslySetInnerHTML={{ __html: `${this.props.formFields.linkDescription}` }}></div> :
                            <h2 className="fieldname">{this.props.formFields.title}</h2> 
                        }
                           
                        </div>
                    </div>
                }
                {this.props.currentDevice === 'Mobile' && this.props.formFields.showButton && this.props.formFields.type !== 'summary' &&
                    <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>
                        <div className={`verify-button ${this.props.currentDevice !== 'Mobile' ? ' wrapper ' : ''}`}>
                            <button type="submit" id="viewpreqoffers" name="viewpreqoffers" className=" btn bc-primary " >{this.props.buttonText}</button>
                        </div> 
                    </div>
                }
                <div className={this.props.configSettings.css.mainContainer.row.rowPanel}>

                    <div className={" col-md-12 "}>
                    <div className="checkbox">
                            <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                            <input name={this.props.formFields.name} id={this.props.formFields.name} 
                            checked={this.props.value} value={this.props.value} 
                            className={`checkbox pre-checkbox ${!this.props.value ? 'has-error' : ''}`} 
                            type="checkbox" 
                            onChange={this.props.HandleSelectedOption.bind(this, false)}
                            onKeyDown={this.props.onKeyDown}
                            />
                            <div className="alignCenter" dangerouslySetInnerHTML={{ __html: `${this.props.formFields.consentText}` }}></div>
                    </div>
                    </div>

                </div>

                
            </div>
        );
    }
}
export default BCConsentField;