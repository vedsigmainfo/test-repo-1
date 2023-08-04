import React from 'react';
import ReactDOM from 'react-dom';

///////////////////////////////////// Comment the below for dev - START /////////////////////////////////////

import { isValidInteger } from "./Validation/RegexList"; 
import './bootstrap.css';
import './primeratebootstrap.css';
import './Open-sans.css';
import './transition-gdsbank.css';
import './BCStyles-gdsbank-base.css';
import './BCStyles-creditCorp-base.css';
import ConfigurableBreadcrumb from './ConfigurableBreadcrumb';
import Configuration from "./json/GDS_LOS_CC_ConfigurationV001.json";
import VersionConfiguration from "./json/GDS_LOS_CC_Engine_Version_Config_V001.json";
import VehicleDataConfiguration from './json/YearMakeModel.json';

////////////////////////////////////// Comment for dev - END  ///////////////////////////////////////////



///////////////////////////////////// Uncomment for dev - START ////////////////////////////////////////

// import ConfigurableBreadcrumb from './ConfigurableBreadcrumb';
// import { Configuration, getConfigurationJson, VersionConfiguration, getVersionConfigurationJson, VehicleDataConfiguration, getVehicleDataConfiguration } from "./Configuration"; 

////////////////////////////////////// Uncomment for dev - END //////////////////////////////////////////

init();

function init() {
var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        let settings = null;
        let versionSettings = null;
        let vehicleData = null;
        //let breadscrumbSetting = null;
        if (process.env.NODE_ENV !== 'production') {
            settings = Configuration;
            versionSettings = VersionConfiguration;
            if(window.autoVehicleDataConfigPath !== '')
                vehicleData = VehicleDataConfiguration;
            //versionConfigSettings = versionConfig;
            routePath(settings, versionSettings, vehicleData);
        } else {
            // Uncomment the below code to create a build for dev
            //  const promise1 = getConfigurationJson(); 
            //  const promise2 = getVersionConfigurationJson(); 
            //  const promise3 = getVehicleDataConfiguration(); 
            //  Promise.all([promise1, promise2, promise3]).then(function(values) {
            //     if(values && values.length > 2) {
                    
            //  routePath(values[0].Configuration, values[1].VersionConfiguration, values[2].VehicleDataConfiguration);
            //     }
            //  });
        }
    }
});
}
function routePath(settings, versionSettings, vehicleData) {
    // const offersPart = '/offers';
    //const pathParts = window.location.pathname.split(offersPart);
    const currentBrowser = detectBrowser();
    const currentOS = detectOS();
    const currentDevice = detectDevice() ? 'Mobile' : detectTab() ? 'Tab' : 'Web';
    var version = getParam("v");
    var interval = setInterval(function() {
        if(document.readyState === 'complete') {
            clearInterval(interval);
            GetTitle(1,settings);
        var allQueryStrings = GetDynamicQueryString(versionSettings.queryStrings);
        if(window.location.pathname.toLocaleLowerCase().indexOf('/app-page-1') > -1 || window.location.pathname.toLocaleLowerCase().indexOf('/app-page-14') > -1){
                ReactDOM.render(<ConfigurableBreadcrumb key={1} 
                configSettings={settings}                 
                currentBrowser={currentBrowser} 
                currentOS={currentOS}
                currentDevice={currentDevice}
                PostData={window.postData}
                PostDataEX = {window.postDataEngine}
                versionConfigSettings={versionSettings}
                filteredVersion={GetVersion(versionSettings.versions, version)}
                QueryStrings={allQueryStrings}
                SenderDomain={window.location.host}
                vehicleData={vehicleData}
                />, document.getElementById('root'));
            
            HideLoadingPage();
            callGoogleTagManager();
        } else {
            if(window.CoBorrowerRequired) {
                window.location.href = `${settings.formSettings.urlPath}14`; //'/los-application/app-page-14';
            } else {
                window.location.href = `${settings.formSettings.urlPath}1`;
            }
        }
    }
    }, 100);    

}
function GetTitle(page,settings) {
    let title = document.title.split('|');
            let filterTitle = settings.formSettings.title.filter(element => {
                if(title.length > 1) {
                    return element.part1 === title[1] || element.part2 === title[1];
                } else {
                    return element.part1 === title[0] || element.part2 === title[0];
                }
            })
            if(filterTitle && filterTitle.length > 0) {
                if(filterTitle[0].language === "arabic") {
                    //set arabic title
                    document.title = `${filterTitle[0].part1}${filterTitle[0].part2.replace("{{X}}",page)}`;
                } else {
                    document.title = `${filterTitle[0].part1.replace("{{X}}",page)}${filterTitle[0].part2}`;
                }
            }
}

function GetVersion(versions, version) {
    let filteredVersion = '';
    let currentVersion = version;
    if (currentVersion && currentVersion !== '') {
        filteredVersion = versions.filter(version => {
            if (version && currentVersion) {
                return currentVersion.toLowerCase() === version.versionNumber.toLowerCase();
            }
            return filteredVersion ? filteredVersion[0] : null;
        });
    } else {
        currentVersion = 'default';
        filteredVersion = versions.filter(version => {
            if (version && currentVersion) {
                return currentVersion.toLowerCase() === version.versionNumber.toLowerCase();
            }
            return filteredVersion ? filteredVersion[0] : null;
        });
    }    
    return filteredVersion;
}
function detectBrowser() {
    var browser = (function(agent){
        switch(true){
            case agent.indexOf("edge") > -1: return "edge";
            case agent.indexOf("opr") > -1 && !!window.opr: return "opera";
            case agent.indexOf("chrome") > -1 && !!window.chrome: return "chrome";
            case agent.indexOf("trident") > -1: return "ie";
            case agent.indexOf("firefox") > -1: return "firefox";
            case agent.indexOf("safari") > -1: return "safari";
            default: return "other";
        }
    })(window.navigator.userAgent.toLowerCase());

    return browser;
}
function detectOS() {
    var browser = (function(agent){
        switch(true){
            case agent.indexOf("windows nt 10.0") > -1 : return "Windows 10";
            case agent.indexOf("windows nt 6.2") > -1 : return "Windows 8";
            case agent.indexOf("windows nt 6.1") > -1 : return "Windows 7";
            // case agent.indexOf("windows nt 6.1") > -1 : return "Windows Vista";
            case agent.indexOf("windows nt 5.1") > -1 : return "Windows XP";
            case agent.indexOf("windows nt 5.0") > -1 : return "Windows 2000";
            case agent.indexOf("android") > -1: return "Android";
            case agent.indexOf("mac") > -1: return "Mac/iOS";
            case agent.indexOf("x11") > -1: return "UNIX";
            case agent.indexOf("linux") > -1: return "Linux";
            default: return "other";
        }
    })(window.navigator.userAgent.toLowerCase());

    return browser;
}
function detectDevice() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function detectTab() {
    var check = false;
    check = ((function(a){if(/ipad|android.+\d safari|tablet/i.test(a))return true})(navigator.userAgent||navigator.vendor||window.opera))? true:false;
    return check;
}
function HideLoadingPage() {
    try {
        document.getElementById("wptime-plugin-preloader").style.display = "none"; //.style.display = "none";
    }
    catch(e) {}
}
function callGoogleTagManager() {
    if(window.dataLayer !== undefined) {
        window.dataLayer.push({'event': 'optimize.activate'});
    }
}
function GetDynamicQueryString(queryStringArray) {
    var dynamicQueryString = []; 
    if(queryStringArray && queryStringArray !== undefined && queryStringArray !== null) {
        queryStringArray.filter(qs => {
            if (qs) {
                dynamicQueryString.push({
                    key: qs.acceptName,
                    value:  getParam(qs.acceptName),
                    postName: qs.postName,
                    isQuestion: qs.isQuestion
                });
            }
        });
    }
    return dynamicQueryString;
}
function getParam( name )
{
    name = name.replace(/[\\[]/,"\\[").replace(/[\]]/,"\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.search );
    if( results == null )
        return "";
    else
        return results[1];
}
// ReactDOM.render(< , document.getElementById('root'));
// <LoanApplicationForm /> <PrequalifiedOffers />
// <MainPanelContainer />
// ReactDOM.render(<MainPanelContainer />, document.getElementById('root'));

 /* 
//registerServiceWorker();
 */     