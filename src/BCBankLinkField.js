import React, { Component } from "react"; 
import $ from "jquery";

class BCBankLinkField extends Component {
    constructor(props){
        super(props);
        this.state = {
            plaidKey: '',
            selectAccount: '',
            env: '',
            apiVersion: '',
            clientName: '',
            product: [],
            webhook: '',
            language: this.props.formFields.defaultLanguage,
        }        
    }
    componentDidMount(){
        this.setState({ language: this.props.formFields.defaultLanguage });
        this.getPlaidKey();
    }
    getPlaidKey = () => {
        const that = this;
        $.ajax({
            method: "GET",
            url: `${this.props.apiurl}?action=`+this.props.formFields.action,
            success: function (response) {
                if(response){
                    console.log(response)

                    let apiResponse = JSON.parse(response);
                     that.state.plaidKey = apiResponse.response.plaidLinkToken; 

                }
            },
            error: function(a,b,c) {
        
            },
            async: false
        }); 
    }

    sendPlaidResponseToDV = (public_token,metadata) => {
        const that = this;
        console.log("public_token: ",public_token);
        console.log("metadata: ",metadata);
        // The onSuccess function is called when the user has successfully
        // authenticated and selected an account to use. 
        that.props.showLoader(); 
        console.log("????????? INSIDE  ONSUCCESS ?????????");
        if(that.props.formFields.loaderMessage)
        that.props.setLoaderMessage(that.props.formFields.loaderMessage, that.props.formFields.delayMessageDisplay);  
        $.ajax({
            method: "POST",
            url: `${that.props.apiurl}?action=los_engine_process_plaidResponseDV`,
            data: {pt : public_token, md : metadata, id:Math.random(), formSubmissionCount: that.props.formFields.formSubmissionCount},
            success: function (response) {  
                that.props.hideLoader();
            },
            error: function(a,b,c) {
                console.log(a);
                console.log(b);
                console.log(c);
                that.props.hideLoader();
                that.props.onPlaidSuccess(this, "error");
            },
            async: true
        });
    }

    plaidHandler(e){
        const that = this;
        // let selectAccount = that.state.selectAccount !== '' ? that.state.selectAccount : this.state.selectAccount;
        // let env = that.state.env !== '' ? that.state.env : this.state.env;
        // let apiVersion = that.state.apiVersion !== '' ? that.state.apiVersion : this.state.apiVersion;
        // let clientName = that.state.clientName !== '' ? that.state.clientName : this.state.clientName;
        // let plaidKey = that.state.plaidKey !== '' ? that.state.plaidKey : this.state.plaidKey;
        // let product = that.state.product && that.state.product !== undefined && that.state.product.length > 0 ? that.state.product : this.state.product;
        // let webhook = that.state.webhook !== '' ? that.state.webhook : this.state.webhook;
        // let language = that.state.language;

        let selectAccount = true;
        let env = "sandbox";
        let apiVersion = "v2";
        let clientName = "GDSLink";
        // let plaidKey = "link-sandbox-09885813-ded7-45f8-89bf-f8b2c9ad4a94";
        let plaidKey = that.state.plaidKey !== '' ? that.state.plaidKey : this.state.plaidKey;
        let product = ["auth","transactions","identity"];
        let webhook = "https://dev.gds.primerates.com/webhooks/p_responses.php";
        let language = "en";

        var linkHandler = window.Plaid.create({
            selectAccount: selectAccount,
            env: env,   //'sandbox',
            apiVersion: apiVersion, //'v2',
            clientName:clientName,  /// 'Client Name',
            token: plaidKey,
            product: product, // ['auth', 'transactions', 'identity'],
            webhook: webhook,  //'https://dev.gds.primerates.com/webhooks/p_responses.php',
            language: language,
            onLoad: function() {
              // The Link module finished loading.
            },
            onSuccess: function(public_token, metadata) {
                that.sendPlaidResponseToDV(public_token, metadata);
            },
            onExit: function(err, metadata) {
                console.log("????????? INSIDE  onexit ?????????");
                if (err === null) {   
                    err="exit";   
                }
                that.sendPlaidResponseToDV(err, metadata);
            },
          });
        setTimeout(() => {
            linkHandler.open();
        }, 2000);
          
    }
    render() {
		const redirect = this.props.formFields.redirect; 
      
           return (  

            <div className="container-box-content" id="mainboxcontent">
            <h3 className="alignCenter">{this.props.formFields.title}</h3>  
            <p className="alignJustify">{this.props.formFields.plaidDescription}</p>
            <div className="col-sm-12 col-xs-12 button-control-align">
                <button type="button" id="withPlaid" name="withPlaid" className="btn bc-primary" 
                onClick={this.plaidHandler.bind(this)}>{this.props.formFields.plaidButtonText}</button>
            </div>
            <p className="alignJustify">{this.props.formFields.bankDescription}</p>
            <div className="col-sm-12 col-xs-12 button-control-align">
                <a type="button" id="withoutPlaid" name="withoutPlaid" onClick={this.props.HandleSelectedOption.bind(this)} >{this.props.formFields.bankButtonText}</a>
            </div>
            </div>
        );
    }
}

export default BCBankLinkField;