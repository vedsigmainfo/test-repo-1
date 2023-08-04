import React, { Component } from "react"; 

class BCBackButton extends Component {
    componentDidMount() {
        if(document.getElementById('viewpreqoffers')) {
            document.getElementById('viewpreqoffers').focus();
        }
    }
    onKeyPress = (e) =>{
        if(e.which === 13)
            this.props.HandleSelectedOption(e);
    }
    render() {
        return (  
            <div className={`${this.props.columnStyle}`}>
                {!this.props.ShowConsent && <span>
                    {this.props.formFields.showTitle &&  <h2 className={this.props.css[this.props.type].title}>{this.props.formFields.title}</h2> }
                    {this.props.formFields.description && <p className="fieldname-des alignJustify"> <br />{this.props.formFields.description}</p>} 
                    <div className={this.props.css[this.props.type].fieldContainer} >
                        {/* <input type="hidden" name={this.props.name} id={this.props.name} value={this.props.SelectedValue}  /> */}
                        {this.props.ListData.map((element, index) => {
                            return <button type="button" key={`${element.tabIndex + index}`} tabIndex={`${index + 1}`} id={element.key} name={element.key} className={this.props.css[this.props.type].field} onKeyDown={this.onKeyPress.bind(this, true)} onClick={this.props.HandleSelectedOption.bind(this)}>{element.label}</button>
                        })}
                        <div className={this.props.css[this.props.type].errorBlockHeight}>
                            <span className={this.props.css[this.props.type].errorBlockSpanMargin} ></span>
                        </div>               
                    </div>
                </span> 
                }
            </div>
        );
    }
}
export default BCButtonField;