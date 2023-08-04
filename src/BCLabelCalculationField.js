import React, { Component } from "react"; 
class BCLabelCalculationField extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        if(document.getElementById('viewpreqoffers')) {
            document.getElementById('viewpreqoffers').focus();
        }
    }
    getHtmlTag(element, isTitle) {
        let value = isTitle ? element.title : this.props.currentState[`${this.props.statePrefix}${element.value}${this.props.stateSuffix}`] !== '' ? this.props.currentState[`${this.props.statePrefix}${element.value}${this.props.stateSuffix}`] : 0;
        if(element.htmlTag === 'h2') {
            return <h2 className="fieldname">{value}</h2>;
        } else if(element.htmlTag === 'h6') {
            return <h6 className="fieldname">{value}</h6>;
        } else {
            return <p className="fieldname">{value}</p>;
        }
    }
    render() {
        //let value = this.props.currentState[`${this.props.statePrefix}${this.props.formFields.detail.list[0].value}${this.props.stateSuffix}`] !== "" ? this.props.currentState[`${this.props.statePrefix}${this.props.formFields.detail.list[1].value}${this.props.stateSuffix}`] : `${this.props.configSettings.fieldSettings.currencySymbol}0`;
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
                <div className={`form-group`}>
                    {this.props.formFields.showTitle && <h2 className="fieldname">{this.props.formFields.title}</h2>}
                    <br /><br />
                    {
                        this.props.formFields.detail.list.map((element,index) => (
                            <div className="row">
                                <div className={`${element.titleColumnCss}`}>
                                    { this.getHtmlTag(element, true)}
                                </div>
                                <div className={`${element.valueColumnCss}`}>
                                    { this.getHtmlTag(element, false)}
                                </div>
                            </div>
                        ) )
                    }
                    <div className={this.props.css[this.props.type].errorBlockHeight}>
                    {errorMsg? 
                        <span className={this.props.css[this.props.type].errorBlockSpan}>
                        
                            <span>{errorMsg}</span> 
                        </span>:''}
                    </div>
                </div>
            </div>
        );
    }
}

export default BCLabelCalculationField;