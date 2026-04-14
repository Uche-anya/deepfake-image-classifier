import type { PredictionResponse } from '../api/deepFakeApi';

interface ResultCardProps {
    result: PredictionResponse;
}

// Whether you named this file Results.tsx or ResultCard.tsx, the component name here should match!
export const ResultCard = ({ result }: ResultCardProps) => {

    // FIX: We use result.error here, matching the TypeScript interface perfectly
    if (result.error) {
        return <p className="error-text">{result.error}</p>;
    }

    return (
        <div className={`result-box ${result.prediction}`}>
            <h2>{result.prediction}</h2>
            <p>Confidence: {result.confidence}</p>
        </div>
    );
};



