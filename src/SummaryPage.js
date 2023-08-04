import React, { Component } from "react";
import { formFields, formHeaders, constantVariables } from "./Validation/FormData";
import { GetPhoneMask, GetSSNMask, capitalizeFirstLetter, AmountFormatting } from "./Validation/RegexList";
import { defaultValues, stateList, housingList, employmentList, estimatedCreditScoreList, timeAtCurrentAddressList } from "./AppData";
class SummaryPage extends Component {
    constructor(props) {
        super(props);
    }

    getHousingKey(label) {
        const selectedHousing = housingList.filter((housing) => {
            return housing.label.toLowerCase() === label.toLowerCase() || housing.key.toLowerCase() === label.toLowerCase();
        });
        return selectedHousing[0].label;
    }

    getStatelist(label) {
        const selectedstate = stateList.filter((state) => {
            return state.label.toLowerCase() === label.toLowerCase() || state.key.toLowerCase() === label.toLowerCase();
        });
        return selectedstate[0].label;
    }

    getEstimatedCreditScoreKey(label) {
        const selectedEstimatedCreditScore = estimatedCreditScoreList.filter((estimatedCreditScore) => {
            return estimatedCreditScore.label.toLowerCase() === label.toLowerCase() || estimatedCreditScore.key.toLowerCase() === label.toLowerCase();
        });
        return selectedEstimatedCreditScore[0].label;
    }
    getEmploymentKey(label) {
        const selectedEmployment = employmentList.filter((employment) => {
            return employment.label.toLowerCase() === label.toLowerCase() || employment.key.toLowerCase() === label.toLowerCase();
        });
        return selectedEmployment[0].label;
    }
    render() {
        const housing = this.props.PostData && this.props.PostData.housing ? this.getHousingKey(this.props.PostData.housing) : defaultValues.defaultSelect;
        const state = this.props.PostData && this.props.PostData.state ? this.getStatelist(this.props.PostData.state) : defaultValues.defaultSelect; 
        const creditscore = this.props.PostData && this.props.PostData.creditscore ? this.getEstimatedCreditScoreKey(this.props.PostData.creditscore) : defaultValues.defaultSelect;
        const borrowerEmployment = this.props.PostData && this.props.PostData.employment ? this.getEmploymentKey(this.props.PostData.employment) : defaultValues.defaultSelect;
        const coborrowerEmployment = this.props.PostData && this.props.PostData.employment ? this.getEmploymentKey(this.props.PostData.employment) : defaultValues.defaultSelect;
       
        const cbhousing = this.props.PostData && this.props.PostData.cbhousing ? this.getHousingKey(this.props.PostData.cbhousing) : defaultValues.defaultSelect;
        const cbstate = this.props.PostData && this.props.PostData.cbstate ? this.getStatelist(this.props.PostData.cbstate) : defaultValues.defaultSelect;
        const cbcreditscore = this.props.PostData && this.props.PostData.cbcreditscore ? this.getEstimatedCreditScoreKey(this.props.PostData.cbcreditscore) : defaultValues.defaultSelect;
        const cbemployment = this.props.PostData && this.props.PostData.cbemployment ? this.getEmploymentKey(this.props.PostData.cbemployment) : defaultValues.defaultSelect;
    

        return (
            <div>
                <span> <h5 className="heading">Almost finished! Please review your application information. Once you have confirmed that it is correct,click 'Submit Application' and we'll take it from here.</h5></span>

                <div id="summarypageid" className={this.props.columnStyle}>
                    <span> <h4 className="summaryPage-leftalign">Loan Information</h4></span>
                    <span>
                        <div className=" summaryPage-leftalign" style={{ display: "inline-block", float: "left" }}>
                            <p className={`credit-soup-line-height`} style={{ marginLeft: "25px" }}> Loan Purpose : <b>{this.props.PostData.loanPurpose}</b></p>
                            <p className={`credit-soup-line-height`} style={{ marginLeft: "25px" }} > Loan Amount: <b>{`$${AmountFormatting(this.props.PostData.loanamount)}`}</b></p>
                            
                        </div>
                        <div><button className="editbutton" >Edit</button></div>

                    </span>
                    <hr className="hr-size" />
                    <span> <h4 className="summaryPage-leftalign">Borrower 1</h4></span>
                    <span>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Borrower Name: <b>{capitalizeFirstLetter(this.props.PostData.firstname) + " " + (this.props.PostData.lastname)}</b></p>
                            {/* <p className={` credit-soup-line-height col-sm-6`} > Last Name: <b>{capitalizeFirstLetter(this.props.PostData.lastname)}</b></p> */}
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Housing Status: <b>{housing}</b></p>
                            {/* <p className={` credit-soup-line-height col-sm-4`} >{formFields.TimeAtCurrentAddress.title}: <b>{this.props.PostData.selectedTimeAtCurrentAddress}</b></p> */}

                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Address: <b>{this.props.PostData.streetaddress + ", " + this.props.PostData.city + ", " + state + ", " + this.props.PostData.zipcode}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} >Housing Payment: <b>{this.props.PostData.HousingPaymentValue}</b></p>
                            {/* <p className={` credit-soup-line-height col-sm-6`} > Home Address2: <b>{this.props.PostData.appartment}</b></p> */}
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Phone Number: <b>{GetPhoneMask(this.props.PostData.phonenumber)}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Date of Birth: <b>{this.props.PostData.birthdate}</b></p>
                        </div>

                        {/* <div className=" summaryPage-leftalign">
                <p className={` credit-soup-line-height col-sm-4`} > City: <b>{this.props.PostData.city}</b></p>
                <p className="col-sm-4 credit-soup-line-height" >State: <b>{state}</b></p>
                <p className="col-sm-4 credit-soup-line-height" >Zip code: <b>{this.props.PostData.zipcode}</b></p>
            </div> */}
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Credit Score: <b>{creditscore}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > {formFields.Emailaddress.title} <b><u>{this.props.PostData.email}</u></b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > SSN: <b>{`XXX-XX-${this.props.PostData.ssn !== null && this.props.PostData.ssn !== undefined && this.props.PostData.ssn.length > 4 ? this.props.PostData.ssn.substr(this.props.PostData.ssn.length - 4) : this.props.PostData.ssn}`}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Employment Status: <b>{borrowerEmployment}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Annual Income: <b>{`$${AmountFormatting(this.props.PostData.annualincome)}`}</b></p>
                        </div>
                        <div><button className="editbutton" >Edit</button></div>
                    </span>
                    <br></br>

                    <span> <h6 className="summaryPage-leftalign summarypage-textindent">Employment Information</h6></span>
                    <span>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Employer Name: <b>{capitalizeFirstLetter(this.props.EmploymentData.borrower.employerName)}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} >Position / Title: <b>{capitalizeFirstLetter(this.props.EmploymentData.borrower.position)}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Start Date: <b>{this.props.EmploymentData.borrower.startDate}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > End Date: <b>{this.props.EmploymentData.borrower.endDate}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Salary Amount:<b>{`$${AmountFormatting(this.props.EmploymentData.borrower.salaryAmount)}`}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Salary Period: <b>{this.props.EmploymentData.borrower.salaryFrequency}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Address1: <b>{this.props.EmploymentData.borrower.employerStreetAddress + ", " + this.props.EmploymentData.borrower.employerCity + ", " + this.props.EmploymentData.borrower.employerState + ", " + this.props.EmploymentData.borrower.employerZipcode}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Address2: <b>{this.props.EmploymentData.borrower.appartment}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-4`} > City: <b>{this.props.EmploymentData.borrower.employerCity}</b></p>
                            <p className="col-sm-4 credit-soup-line-height" > State: <b>{this.props.EmploymentData.borrower.employerState}</b></p>
                            <p className="col-sm-4 credit-soup-line-height" > Zip Code: <b>{this.props.EmploymentData.borrower.employerZipcode}</b></p>
                        </div>


                        {/* <div className=" summaryPage-leftalign">
                        <p className={` credit-soup-line-height col-sm-6`} > Phone Number: <b>{GetPhoneMask(this.props.EmploymentData.borrower.employerPhone)}</b></p>
                    </div> */}
                    </span>

                    <div className="terms-checkbox ">
                        <input type="checkbox" className="checkboxicon" required />
                        <p>I concent to GDS Bank conducting a hard credit pull. I acknowledge [<a href="">add legal data here.]</a></p>
                    </div>
                    <hr className="hr-size" />
                    <span> <h4 className="summaryPage-leftalign">Borrower 2</h4></span>
                    <span>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Name: <b>{capitalizeFirstLetter(this.props.PostData.cbfirstname) + " " + (this.props.PostData.cblastname)}</b></p>
                            {/* <p className={` credit-soup-line-height col-sm-6`} > Last Name: <b>{capitalizeFirstLetter(this.props.PostData.lastname)}</b></p> */}
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Housing Status: <b>{cbhousing}</b></p>
                            {/* <p className={` credit-soup-line-height col-sm-4`} >{formFields.TimeAtCurrentAddress.title}: <b>{this.props.PostData.selectedTimeAtCurrentAddress}</b></p> */}

                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Address: <b>{this.props.PostData.streetaddress + ", " + this.props.PostData.city + ", " + state + ", " + this.props.PostData.zipcode}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} >Housing Payment: <b>{this.props.PostData.HousingPaymentValue}</b></p>

                            {/* <p className={` credit-soup-line-height col-sm-6`} > Home Address2: <b>{this.props.PostData.appartment}</b></p> */}
                        </div>
                        <div className=" summaryPage-leftalign">

                            <p className={` credit-soup-line-height col-sm-6`} > Phone Number: <b>{GetPhoneMask(this.props.PostData.cbphonenumber)}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Date of Birth: <b>{this.props.PostData.cbbirthdate}</b></p>
                        </div>

                        {/* <div className=" summaryPage-leftalign">
                <p className={` credit-soup-line-height col-sm-4`} > City: <b>{this.props.PostData.city}</b></p>
                <p className="col-sm-4 credit-soup-line-height" >State: <b>{state}</b></p>
                <p className="col-sm-4 credit-soup-line-height" >Zip code: <b>{this.props.PostData.zipcode}</b></p>
            </div> */}
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Credit Score: <b>{cbcreditscore}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > {formFields.Emailaddress.title} <b><u>{this.props.PostData.cbemail}</u></b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > SSN: <b>{`XXX-XX-${this.props.PostData.cbssn !== null && this.props.PostData.cbssn !== undefined && this.props.PostData.cbssn.length > 4 ? this.props.PostData.cbssn.substr(this.props.PostData.cbssn.length - 4) : this.props.PostData.cbssn}`}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Employment Status: <b>{cbemployment}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Annual Income: <b>{`$${AmountFormatting(this.props.PostData.cbannualincome)}`}</b></p>
                        </div>
                        <div><button className="editbutton" >Edit</button></div>
                    </span>

                    <span> <h6 className="summaryPage-leftalign summarypage-textindent">Employment Information</h6></span>
                    <span>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Name: <b>{capitalizeFirstLetter(this.props.EmploymentData.coborrower.cbemployerName)}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Position / Title: <b>{capitalizeFirstLetter(this.props.EmploymentData.coborrower.cbposition)}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Start Date: <b>{this.props.EmploymentData.coborrower.cbstartDate}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > End Date: <b>{this.props.EmploymentData.coborrower.cbendDate}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Salary Amount:<b>{`$${AmountFormatting(this.props.EmploymentData.coborrower.cbsalaryAmount)}`}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Salary Period: <b>{this.props.EmploymentData.coborrower.cbsalaryFrequency}</b></p>
                        </div>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Address1: <b> {this.props.EmploymentData.coborrower.cbemployerStreetAddress + ", " + this.props.EmploymentData.coborrower.cbemployerCity + ", " + this.props.EmploymentData.coborrower.cbemployerState + ", " + this.props.EmploymentData.coborrower.cbemployerZipcode}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Address2: <b>{this.props.EmploymentData.coborrower.cbappartment}</b></p>
                           
                        </div>
                        {/* <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-4`} > City: <b>{this.props.EmploymentData.cbemployerCity}</b></p>
                            <p className="col-sm-4 credit-soup-line-height" > State: <b>{this.props.EmploymentData.cbemployerState}</b></p>
                            <p className="col-sm-4 credit-soup-line-height" > Zip Code: <b>{this.props.EmploymentData.cbemployerZipcode}</b></p>
                        </div> */}
                        {/* <div className=" summaryPage-leftalign">
                        <p className={` credit-soup-line-height col-sm-6`} > Phone Number: <b>{GetPhoneMask(this.props.EmploymentData.cbemployerPhone)}</b></p>
                    </div> */}
                    </span>
                    <div className="terms-checkbox ">
                        <input type="checkbox" className="checkboxicon" required />
                        <p>I concent to GDS Bank conducting a hard credit pull. I acknowledge [<a href="">add legal data here.]</a></p>
                    </div>
                    <hr className="hr-size" />
                    <span> <h4 className="summaryPage-leftalign">Bank Information</h4></span>
                    <span>
                        <div className=" summaryPage-leftalign">
                            <p className={` credit-soup-line-height col-sm-6`} > Routing Number: <b>{this.props.BankData.routingNumber}</b></p>
                            <p className={` credit-soup-line-height col-sm-6`} > Account Number: <b>{this.props.BankData.accountNumber}</b></p>
                        </div>
                        <div><button className="editbutton" >Edit</button></div>
                    </span>
                    <div className="terms-checkbox ">
                        <input type="checkbox" className="checkboxicon" required />
                        <p>I concent to GDS Bank conducting a hard credit pull. I acknowledge [<a href="">add legal data here.</a>]</p>
                    </div>

                </div>
                <hr className="hr-size" />

                <div className="  col-sm-12 col-xs-12 button-control-align   center-align "><button type="submit" className=" btn bc-primary ">Submit Application</button></div>
            </div>
        );
    }

}

export default SummaryPage;