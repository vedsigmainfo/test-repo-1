import React, { Component } from "react"; 

class FAButtonField extends Component {
    componentDidMount() {
        if(document.getElementById(this.props.ListData[0].key)) {
            document.getElementById(this.props.ListData[0].key).focus();
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
                    {this.props.formFields.showTitle && <h2 className="fieldname">{this.props.formFields.title}</h2>}
                    <div id="mydiv1">
                        <div className={this.props.css[this.props.type].fieldContainer} >
                            {this.props.ListData.map((element, index) => {
                                return <button type="button" key={`${element.tabIndex + index}`} tabIndex={`${index + 1}`} id={element.key} 
                                name={element.key} className={this.props.css[this.props.type].field} onKeyDown={this.onKeyPress.bind(this, true)} onClick={this.props.HandleSelectedOption.bind(this)}>
                                    <span> <i type="button" name={element.key} tabIndex={`${index + 1}`} id={element.key} className={element.icon}></i></span> 
                                    <span><p id={element.key} name={element.key} className={this.props.css[this.props.type].fabuttontext}  dangerouslySetInnerHTML={{ __html: `${element.label}` }}></p></span></button>
                            })}
                            <div className={this.props.css[this.props.type].errorBlockHeight}>
                                <span className={this.props.css[this.props.type].errorBlockSpanMargin} ></span>
                            </div>               
                        </div>
                    </div>
                </span> 
                }
            </div>
        );
    }
}
export default FAButtonField;