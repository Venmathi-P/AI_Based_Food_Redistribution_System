import axios from "axios";
import api from "./api";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const donateFood = async (inventoryId) => {
  const response = await API.post(`/donations/${inventoryId}`);
  return response.data;
};

export const getPendingDonations = async () => {
  const response = await API.get("/donations/pending");
  return response.data;
};

export const getAllDonations = async () => {
  const response = await API.get("/donations");
  return response.data;
};
export const acceptDonation = async (donationId, ngoId) => {

    const response = await API.put(
        `/donations/${donationId}/accept/${ngoId}`
    );

    return response.data;

};
export const getAcceptedDonations = async (ngoId) => {
    const response = await API.get(
        `/donations/accepted/${ngoId}`
    );

    return response.data;
};
export const schedulePickup = async (
    donationId,
    pickupDate,
    pickupTime
) => {

    const response = await API.put(
        `/donations/${donationId}/schedule`,
        null,
        {
            params: {
                pickup_date: pickupDate,
                pickup_time: pickupTime
            }
        }
    );

    return response.data;
};
export const getScheduledDonations = async () => {
    const response = await API.get("/donations/scheduled");
    return response.data;
};
export const completePickup = async (donationId) => {

    const response = await API.put(
        `/donations/${donationId}/complete`
    );

    return response.data;
};


export const getHistory = async () => {

    const response = await API.get(
        "/donations/history"
    );

    return response.data;
};


