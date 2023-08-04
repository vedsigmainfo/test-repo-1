import axios from "axios";
//import { constantVariables } from "./Validation/FormData";


export function SendEmail(emailSendEndpoint, payload) {
    axios.post(emailSendEndpoint ,payload).then(function(response){
         
    });
}


