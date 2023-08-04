import React, { Component } from "react"; 
import $ from "jquery";
import axios from "axios";

class BCPinwheelLinkField extends Component {
    constructor(props){
        super(props); 
    }

    
    componentDidMount(){
        this.setState({ language: this.props.formFields.defaultLanguage });
        // this.getPlaidKey();
    }

    sendPinwheelResponseToDV = () => {
        const that = this;
        console.log("public_token: ");
        console.log("metadata: ");
        // The onSuccess function is called when the user has successfully
        // authenticated and selected an account to use. 
        that.props.showLoader(); 
        console.log("????????? INSIDE  ONSUCCESS ?????????");
        if(that.props.formFields.loaderMessage)
        that.props.setLoaderMessage(that.props.formFields.loaderMessage, that.props.formFields.delayMessageDisplay);  
        $.ajax({
            method: "POST",
            url: `${that.props.apiurl}?action=los_engine_process_pinwheelResponseDV`,
            data: {formSubmissionCount: that.props.formFields.formSubmissionCount},
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

    getPinwheelToken = () => {
        let token = "";
        let payload = {"transactionType": "PinwheelToken"};
        const that=this;
        $.ajax({
            method: "POST",
            url: `${this.props.apiurl}?action=`+this.props.formFields.action,
            data: payload,
            success: function (res) {
                // console.log("responseType: ", typeof res);
                // console.log("response: ",res);
                // console.log("parsed: ",JSON.parse(res));
                const response = JSON.parse(res);
                // console.log("res: ",response);
                token = response.response.pwnToken;

                // console.log("token: ",token);
            
                window.Pinwheel.open({ linkToken: token, 
                     onEvent: that.sendPinwheelResponseToDV()
                });
            },
            async: true
        });  
    }

    // tempfunction = () => {
    //     window.Pinwheel.open({ linkToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InJlcXVpcmVkX2pvYnMiOlsiZGlyZWN0X2RlcG9zaXRfYWxsb2NhdGlvbnMiXSwib3JnX25hbWUiOiJ3YWxsZXQgd2l6YXJkIiwiYWxsb2NhdGlvbiI6eyJ0eXBlIjpudWxsLCJ2YWx1ZSI6bnVsbCwidGFyZ2V0cyI6W119LCJjYXJkIjpudWxsLCJwbGF0Zm9ybV9rZXkiOm51bGwsInNraXBfaW50cm9fc2NyZWVuIjpmYWxzZSwic2tpcF9leGl0X3N1cnZleSI6ZmFsc2UsImVtcGxveWVyX2lkIjpudWxsLCJkaXNhYmxlX2RpcmVjdF9kZXBvc2l0X3NwbGl0dGluZyI6ZmFsc2UsInBsYXRmb3JtX2lkIjpudWxsLCJza2lwX2RlcG9zaXRfY29uZmlybWF0aW9uIjpudWxsLCJwbGF0Zm9ybV90eXBlIjpudWxsLCJsYW5ndWFnZSI6ImVuIiwiZW5kX3VzZXJfaWQiOm51bGwsImFjY291bnRfaWQiOm51bGwsImRvY3VtZW50X3VwbG9hZHMiOm51bGwsImVuYWJsZV9vZmZsaW5lX3N3aXRjaGVzIjpmYWxzZSwiZW5hYmxlX2NhcmRfc3dpdGNoIjpmYWxzZSwiZW5hYmxlX3NtYXJ0X2JyYW5jaCI6ZmFsc2UsInNtYXJ0X2JyYW5jaCI6bnVsbCwiZW5hYmxlX3VzZXJfaW5wdXRfYmFua19pbmZvIjpmYWxzZSwibW9kZSI6InNhbmRib3giLCJhcGlfa2V5IjoiYzc0NGYyZDViY2YyNjY4NWUxZmFiYjRmYjdhNjU5MDg4NzE5NWM2MDkxYzMzYmY2ZDJjMWExY2VjODllNmI3OCIsInRva2VuX2lkIjoiYWIyOGE3NzQtNGYxNC00M2RmLWI4NTUtZTM3YWJkYTAzMDYzIiwiam9iIjoiZGlyZWN0X2RlcG9zaXRfYWxsb2NhdGlvbnMiLCJfdWlkIjpudWxsLCJ3b3Jrc3BhY2VfbmFtZSI6IkNyZWRpdCBDb3JwIn0sImlhdCI6MTY4NDQwMjk1NywiZXhwIjoxNjg0NDA2NTU3fQ.4CPEEHkzy1hXKs6e5Ntd5ykyWwZMUNP21SV6Q2Vs7yM", 
    //         onEvent: console.log
    //    });
    // }

    render() {
           return (  

            <div className="container-box-content" id="mainboxcontent">
            <h3 className="alignCenter">{this.props.formFields.title}</h3>  
            <p className="alignJustify">{this.props.formFields.pinwheelDescription}</p>
            <div className="col-sm-12 col-xs-12 button-control-align">
                <button type="button"className="btn bc-primary" onClick={this.getPinwheelToken}>{this.props.formFields.pinwheelButtonText}</button>
            </div>
            <p className="alignJustify">{this.props.formFields.bankDescription}</p>
            <div className="col-sm-12 col-xs-12 button-control-align">
                <a type="button" className="bc-anchor" onClick={this.props.HandleSelectedOption.bind(this)}>{this.props.formFields.bankButtonText}</a>
            </div>
            </div>
        );
    }
}

export default BCPinwheelLinkField;