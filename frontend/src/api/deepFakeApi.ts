export interface PredictionResponse {
    filename?: string;
    prediction: "REAL" | "FAKE";
    confidence: string;
    error?: string;
}

const API_URL = "http://127.0.0.1:8000";

export const analyzeImage = async (imageFile: File): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data: PredictionResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return {
            prediction: "FAKE",
            confidence: "0%",
            error: "Failed to connect to the prediction server. Is FastAPI running?"
        };
    }
};








