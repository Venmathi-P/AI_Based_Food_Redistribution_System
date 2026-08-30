import api from "./api";

export const getNGODashboardStats = async () => {

    const response = await api.get(
        "/ngo-analytics/dashboard"
    );

    return response.data;
};