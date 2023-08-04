import React, { Component } from "react"; 

class SPRadioField extends Component {
    
    onKeyPress = (e) =>{
        if(e.which === 13)
            this.props.HandleSelectedOption(e);
    }
    render() {
        return (  
            <div className={`${this.props.formFields.summaryInfo.columnStyle}`}>
                <h2 className={this.props.css[this.props.type].sptitle}>{this.props.formFields.summaryInfo.title}</h2>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                {this.props.ListData.map((element, index) => {
                    return <div>
                        <input type="radio" 
                            onChange={this.props.HandleSelectedOption.bind(this, true)}
                            defaultChecked={!index&&'checked'} 
                            key={`${element.tabIndex + index}`} 
                            id={element.key} 
                            name={this.props.formFields.name}
                            value={element.key}  
                            onKeyDown={this.onKeyPress.bind(this, true)}/>
                        <label for={element.key}>&nbsp;{element.text}</label>
                    </div>
                })}
                    
            </div>

        );
    }
}
export default SPRadioField;