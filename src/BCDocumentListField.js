import axios from 'axios';
import React, { Component } from "react"; 
class BCDocumentListField extends Component {
    renderRow(key,setValue) {
        var values='';
        var finalValue = ''
        if(setValue && key.value !== '')
        {
            return (
                <li className={finalValue}>{key.value}</li>
            );
        }
    }
    render() {
        const names = [ 'state', 'zipCode','employerName'];
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        let arr=this.props.list;
        let url = this.props.configSettings.formSettings["documentListURL"] !== undefined ? this.props.configSettings.formSettings.documentListURL : '';
        let description = this.props.formFields.description && this.props.formFields.description !== '' ? this.props.formFields.description.replace("<URL>", url) : '';
        return (  
            <div className={`${this.props.columnStyle}`}>
                {this.props.formFields.header  && names.indexOf(this.props.name) === -1 && <h2 className="header">{this.props.formFields.header}</h2>}
                {showTitle && names.indexOf(this.props.name) === -1 && <p className="documentlistheader">{this.props.formFields.title}</p>}
                {description && this.props.currentDevice === 'Web' && 
                    <p className="documentlist-des" dangerouslySetInnerHTML={{ __html: `${description}` }}></p>
                } 
                <div>
                    <ul>
                        { arr !== undefined && arr && arr.length > 0 ? (arr.map((key,value)=>(  
                            this.renderRow(key,key.isRequire)))) : ''}
                    </ul>
                </div>
            </div>
        );
    }
}

export default BCDocumentListField;