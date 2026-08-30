import api from "./api";

// Get AI-matched donations for the logged-in NGO
export const getNGOMatches = async () => {
    const response = await api.get(
        "/ngo-requirements/matches"
    );

    return response.data;
};