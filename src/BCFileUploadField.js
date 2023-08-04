import React, { Component } from "react"; 
class BCFileUploadField extends Component {
    render() {
        let fileArray;
        if(this.props.value){
            fileArray=this.props.value.map((val,key)=>{
                return <span key={key} className={`file-list-${key}`}><span className="sel-filename">{val.name}</span>
                <p className="close" data-id={val.name} onClick={this.props.removeSeletedFile.bind(this,this.props.formFields,val.name)}>X</p></span>
            });
        }
      const errorClass = 'has-error';
        return (  
            <div className={`${this.props.columnStyle}`}>  
             {this.props.formFields.header && <h2 className="header">{this.props.formFields.header}</h2>}
                {this.props.formFields.description && <p className="fieldname-des"> <br />{this.props.formFields.description}</p>}
                {this.props.formFields.description2 && <p className="alignJustify"> <br />{this.props.formFields.description2}</p>}
                {window.applicationRequiredAction&& <p className="fieldname-des" dangerouslySetInnerHTML={{ __html: window.applicationRequiredAction }} />}
             {this.props.formFields.showTitle && <p className="fieldname">{this.props.formFields.title}</p>}              
                <div className={`form-group`}>
                <label htmlFor={this.props.formFields.name} className={'adaCompliance'}>{this.props.formFields.name}</label>
                  <input name={this.props.name} id={this.props.name} required=""
                        className= {`loan-app form-control form-group  ${this.props.disabled ? 'select-disabled' : ''} ${!this.props.showError ? errorClass : ''} ${this.props.controlCss !== undefined ? this.props.controlCss : ''}`}
                        value={this.props.SelectedValue}
                        multiple = "multiple"
                        type ={this.props.inputType}
                        placeholder={this.props.formFields.placeholder}
                        onChange={this.props.handleChangeEvent.bind(this, true, this.props.formFields)}
                        tabIndex={this.props.tabIndex}
                        onBlur={this.props.handleChangeEvent.bind(this, false, this.props.formFields)}
                        autoFocus={this.props.formFields.focus}
                        //onClick={this.props.handleClickEvent.bind(this, true, this.props.formFields)}
                    />
                    </div>
                    <div className="documentList">
                        {fileArray && fileArray} 
                    </div>
                    <div className="error-height">
                    <span className={`formerror `}  >
                        <span className="">{this.props.showError && this.props.showError !== undefined && this.props.formFields.required}</span>
                        { this.props.customeMessage !== '' ? <span className="">{this.props.showErrorMessage && this.props.showErrorMessage !== undefined && this.props.customeMessage}</span> :
                        <span className="">{this.props.showErrorMessage && this.props.formFields.errormessage}</span> }
                    </span>
                </div>
               </div>
        );
    }
}

export default BCFileUploadField;