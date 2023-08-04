import axios from "axios";

//Local only
//const configJsonPath = "/static/json/PL_LA_Configuration.json";


// Production only
// const configJsonPath = "/wp-content/plugins/prime-rates-loan-applications/json/versionconfig.json"; // DEPLOY

// demo server
//DEMO_DEPLOY const configJsonPath = "/pr_loans/wp-content/plugins/prime-rates-loan-applications/breadcrumb/static/json/PL_LA_Configuration.json";

let Configuration = null;
let VersionConfiguration= null;
let VehicleDataConfiguration = null;

function getConfigurationJson() {
    const promise = axios.get(window.EngineAppConfigPath );
    return promise.then(result => {        
        return { Configuration: result.data };
    });
}
function getVersionConfigurationJson() {
    const promise = axios.get(window.EngineAppVersionConfigPath );
    return promise.then(result => {        
        return { VersionConfiguration: result.data };
    });
}

function getVehicleDataConfiguration() {
    if(window.autoVehicleDataConfigPath && window.autoVehicleDataConfigPath !== '') {
        const promise = axios.get(window.autoVehicleDataConfigPath);
        return promise.then(result => {        
            return { VehicleDataConfiguration: result.data };
        });
    } else {
        return { VehicleDataConfiguration: null };
    }    
}

export { Configuration, getConfigurationJson, VersionConfiguration, getVersionConfigurationJson, VehicleDataConfiguration, getVehicleDataConfiguration }