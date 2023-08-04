import React, { Component } from "react"; 
import $ from "jquery";
class BCDocusign extends Component {
    constructor(props){
        super(props);
        this.state = {
            docusignUrl: window.docusignUrl,
        }        
    }
    onProceedToDocusign = () =>{
        //const docusignUrl = this.props.docusignUrl;
        // window.open(window.docusignUrl, "_blank", "toolbar=no,scrollbars=yes,resizable=yes,top=80,left=200,width=1000,height=560");
        window.location.href = window.docusignUrl;
    }
    componentDidMount(){
        if(this.props.formFields.onPageLoad) {
            this.getDocusignURL();
        }        
    }
    /** get docusing URL from API - which fetches it from LF services */
    getDocusignURL = () => {
        const that = this;
        var payload = {formSubmissionCount : that.props.formFields.formSubmissionCount};
        that.showLoader();
        $.ajax({
            method: "POST",
            url: `${that.props.configSettings.themeConfig.apiurl}?action=`+that.props.formFields.action,
            data: payload,
            processData: false,        
            success: function (response) {
                if(response){
                    let apiResponse = JSON.parse(response);
                    if(apiResponse.status === 'success'){
                        that.setState({ docusignUrl: apiResponse.message});
                        that.hideLoader();
                    }
                    else{
                        that.hideLoader();
                    }
                }
            },
            async: true
        });  
    }
    showLoader(){
        this.setState({isFetchInProgress: true});
    }
    hideLoader(){
        this.setState({isFetchInProgress: false});
    }
    render() {
        const showTitle = 'showTitle' in this.props && this.props['showTitle'] === false ? false : true;
        return (  
            <div className={`${this.props.columnStyle}`}>
                <span>
                    {this.props.formFields.showTitle &&  <h2 className={this.props.css[this.props.type].title}>{this.props.formFields.title}</h2> }
                    <div className={this.props.css[this.props.type].fieldContainer} >
                        <p className={this.props.css[this.props.type].docusigntext}>{this.props.formFields.description}</p>
                        <br/>
                        {
                            this.state.isFetchInProgress &&
                            <div id="" className={`${this.props.configSettings.css.modalPopup.container} ${this.state.isFetchInProgress ? this.props.configSettings.css.modalPopup.class : ''}`}>
                                <div className={this.props.configSettings.css.modalPopup.contentContainer}>
                                    <div className={this.props.configSettings.css.modalPopup.wrapper}>
                                        <div className={this.props.configSettings.css.modalPopup.logo}>
                                            <img src={this.props.configSettings.modalTransitionPage.logo} alt={this.props.configSettings.modalTransitionPage.theme_name} width= "250px" />
                                        </div>
                                        <div className={this.props.configSettings.css.modalPopup.content}>
                                            <h4 className="alignCenter" dangerouslySetInnerHTML={{ __html: `${this.props.formFields.loaderMessage}` }}></h4>
                                        </div>
                                        <div className={`${this.props.currentDevice === 'Mobile' ? this.props.configSettings.css.modalPopup.refreshPanelMobile : this.props.configSettings.css.modalPopup.refreshPanel}`}>
                                            <i className={this.props.configSettings.css.modalPopup.refreshIcon}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <button type="button" id={this.props.formFields.name} key={this.props.formFields.name} name={this.props.formFields.name} className={this.props.css[this.props.type].field} onClick={this.onProceedToDocusign.bind(this)}>{this.props.formFields.buttonText}</button>
                    </div>
                </span> 
            </div>
        );
    }
}
export default BCDocusign;