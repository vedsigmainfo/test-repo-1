import React, { Component } from "react";
class BCLabelField extends Component {
  componentDidMount() {
    if (document.getElementById("viewpreqoffers")) {
      document.getElementById("viewpreqoffers").focus();
    }
  }
  render() {
    return (
      <div className={`${this.props.columnStyle}`}>
        <div className={`form-group`}>
          {this.props.formFields.showTitle &&
            this.props.formFields.rel === "thankyou" && (
              <h3 className="alignCenter">{this.props.formFields.title}</h3>
            )}
            <h3 className="alignCenter">{this.props.formFields.titlebold}</h3>  
          {this.props.formFields.description &&
            this.props.formFields.rel === "thankyou" &&
            this.props.formFields.description !== "" && (
              <p
                className="alignJustify"
                dangerouslySetInnerHTML={{
                  __html: `${this.props.formFields.description}`,
                }}
              ></p>
            )}

          {this.props.formFields.name === "hr" &&
            this.props.formFields.rel !== "thankyou" && (
              <hr className="hr-style" />
            )}
          {this.props.formFields.name !== "hr" &&
            this.props.formFields.rel !== "thankyou" && (
              <h2
                className={`${
                  this.props.formFields.name === "totalExpense" ||
                  this.props.formFields.name === "totalValue"
                    ? " monthlyexpense_lable "
                    : " fieldname "
                }`}
              >
                {this.props.formFields.title &&
                  this.props.formFields.title.replace(
                    "{{X}}",
                    this.props.value !== undefined && this.props.value !== ""
                      ? this.props.value
                      : 0
                  )}
              </h2>
            )}
          {this.props.formFields.name !== "hr" &&
            this.props.formFields.rel !== "thankyou" &&
            this.props.formFields.description && (
              <span>
                <br /> <br />
                {this.props.formFields.isSignature ? (
                  <div
                    className="fieldname-des"
                    dangerouslySetInnerHTML={{
                      __html: `${this.props.formFields.description}`,
                    }}
                  ></div>
                ) : (
                  <h2 className="fieldname-des">
                    {this.props.formFields.description}
                  </h2>
                )}
              </span>
            )}
        </div>
      </div>
    );
  }
}

export default BCLabelField;
