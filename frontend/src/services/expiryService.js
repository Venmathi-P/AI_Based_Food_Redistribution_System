import api from "./api";


export const getExpiryAlerts = (business_id)=>{

    return api.get(
        `/inventory/expiry-alerts/${business_id}`
    );

};