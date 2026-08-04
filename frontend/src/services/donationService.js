import api from "./api";

// Donate Food
export const donateFood = async (inventoryId) => {
    const response = await api.post(`/donations/${inventoryId}`);
    return response.data;
};

// Business Donations
export const getPendingDonations = async () => {
    const response = await api.get("/donations/pending");
    return response.data;
};

export const getAllDonations = async () => {
    const response = await api.get("/donations");
    return response.data;
};

// NGO Accept
export const acceptDonation = async (donationId) => {
    const response = await api.put(
        `/donations/${donationId}/accept`
    );
    return response.data;
};

// Accepted Donations
export const getAcceptedDonations = async () => {

    const response = await api.get(
        "/donations/accepted"
    );

    return response.data;
};

// Schedule Pickup
export const schedulePickup = async (
    donationId,
    pickupDate,
    pickupTime
) => {

    const response = await api.put(
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

// Scheduled Donations
export const getScheduledDonations = async () => {

    const response = await api.get(
        "/donations/scheduled"
    );

    return response.data;
};

// Complete Pickup
export const completePickup = async (donationId) => {

    const response = await api.put(
        `/donations/${donationId}/complete`
    );

    return response.data;
};

// History
export const getHistory = async () => {

    const response = await api.get(
        "/donations/history"
    );

    return response.data;
};