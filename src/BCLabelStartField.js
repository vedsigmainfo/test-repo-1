import React, { Component } from "react"; 
class BCLabelStartField extends Component {
    componentDidMount() {
        if(this.props.formFields.focus && document.getElementById('viewpreqoffers')) {
            document.getElementById('viewpreqoffers').focus();
        }
    }
    render() {
        return (  
            <div className={`${this.props.columnStyle}`}>
                <h2 className="fieldname">{this.props.formFields.title}</h2>
                {this.props.formFields.description &&
                    <span>
                       <br /><p className="fieldname-des"><b>{this.props.formFields.description}</b></p>
                    </span>
                }
                {this.props.formFields.paragraphs && this.props.formFields.paragraphs.length > 0 && 
                    <div>
                        {this.props.formFields.paragraphs.map((element, index) => {
                            return  <span key={`para-${index}`}>
                                <b><p className="paragraph" dangerouslySetInnerHTML={{ __html: `${element.head}` }}></p></b>
                                <p className="detail-para" dangerouslySetInnerHTML={{ __html: `${element.detail}` }}></p>
                            </span>
                        })}
                    </div>
                }
                {/* <div className={`form-group`}>
                    {this.props.formFields.showTitle && <h2 className="fieldname">{this.props.formFields.title}</h2>}
                    {this.props.formFields.description && this.props.formFields.description !== '' && <h3 className="fieldname-des">{this.props.formFields.description}</h3>}
                </div> */}
            </div>
        );
    }
}

export default BCLabelStartField;