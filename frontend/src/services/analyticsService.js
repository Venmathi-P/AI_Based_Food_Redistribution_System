import api from "./api";

// =====================================================
// GET SUSTAINABILITY IMPACT
// =====================================================

export const getSustainabilityImpact = async () => {

    const response = await api.get(
        "/analytics/impact"
    );

    return response.data;
};