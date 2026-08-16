import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const aiApi = axios.create({
    baseURL: API_BASE_URL,
});


/* =========================================================
   ANALYZE INVENTORY
========================================================= */

export const analyzeInventoryWithAI = async (inventoryId) => {

    try {

        const response = await aiApi.post(
            `/ai/analyze/${inventoryId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "AI analysis error:",
            error
        );

        if (error.response) {

            throw new Error(
                error.response.data?.detail ||
                `AI analysis failed (${error.response.status})`
            );

        }

        throw new Error(
            "Unable to connect to the backend. Make sure FastAPI is running."
        );

    }

};


/* =========================================================
   TRAIN AI MODELS
========================================================= */

export const trainAIModels = async () => {

    try {

        const response = await aiApi.post(
            "/ai/train"
        );

        return response.data;

    } catch (error) {

        console.error(
            "AI training error:",
            error
        );

        if (error.response) {

            throw new Error(
                error.response.data?.detail ||
                `AI training failed (${error.response.status})`
            );

        }

        throw new Error(
            "Unable to connect to the backend. Make sure FastAPI is running."
        );

    }

};