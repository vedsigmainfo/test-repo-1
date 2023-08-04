import React, { Component } from "react";
class CheckBoxField extends Component {
    render() {
        const {name} = this.props;
        const {Title} = this.props;
        return (
            <div className={`${this.props.columnStyle}`}>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                <input className={` ${this.props.currentDevice !== 'Web' ? this.props.css[this.props.type].fieldMobile : this.props.css[this.props.type].field}`} name={name} id={`chk-${name}`} type="checkbox" key={`input-${this.props.keyID}`}
                onChange={this.props.handleOnChange.bind(this)} />
                <p className={this.props.css[this.props.type].title} name={name} id={name}  key={`p-chk-${this.props.keyID}`}> {Title}</p>
            </div>
        );
    }
}
export default CheckBoxField;