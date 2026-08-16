import { useState } from "react";
import { trainAIModels } from "../services/aiService";


function AITraining() {

    const [training, setTraining] = useState(false);

    const [result, setResult] = useState(null);

    const [error, setError] = useState("");


    // =====================================================
    // TRAIN MODELS
    // =====================================================

    const trainModels = async () => {

        setTraining(true);

        setResult(null);

        setError("");


        try {

            console.log(
                "[AI] Starting model training..."
            );


            /*
             * Backend workflow:
             *
             * /ai/train
             *
             *     ↓
             *
             * Read inventory database
             *
             *     ↓
             *
             * Get current/manual/bulk inventory
             *
             *     ↓
             *
             * Combine with historical training data
             *
             *     ↓
             *
             * Create/update training dataset
             *
             *     ↓
             *
             * Find unique products
             *
             *     ↓
             *
             * Train/update models
             *
             *     ↓
             *
             * Save models
             *
             *     ↓
             *
             * Update product_mapping.csv
             */


            const data =
                await trainAIModels();


            console.log(
                "[AI] Training completed:",
                data
            );


            setResult(data);


        } catch (err) {

            console.error(
                "[AI] Training error:",
                err
            );


            setError(
                err.message ||
                "AI model training failed."
            );


        } finally {

            setTraining(false);

        }

    };


    return (

        <div className="card shadow">

            <div className="card-body">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h5 className="mb-1">
                            🤖 AI Demand Forecasting
                        </h5>

                        <p className="text-muted mb-0">

                            Train AI models using historical
                            and current inventory data.

                        </p>

                    </div>


                    <button
                        className="btn btn-primary"
                        onClick={trainModels}
                        disabled={training}
                    >

                        {training
                            ? "⏳ Training..."
                            : "🚀 Train AI Models"
                        }

                    </button>

                </div>


                {/* ================================================= */}
                {/* TRAINING PROGRESS */}
                {/* ================================================= */}

                {training && (

                    <div className="alert alert-info mt-3 mb-0">

                        <strong>
                            🤖 AI training is in progress...
                        </strong>

                        <br />

                        The system is:

                        <ul className="mb-0 mt-2">

                            <li>
                                Reading current inventory
                            </li>

                            <li>
                                Combining inventory with historical data
                            </li>

                            <li>
                                Updating the training dataset
                            </li>

                            <li>
                                Finding all unique products
                            </li>

                            <li>
                                Training Prophet models
                            </li>

                            <li>
                                Updating product mappings
                            </li>

                            <li>
                                Saving trained models
                            </li>

                        </ul>

                    </div>

                )}


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div className="alert alert-danger mt-3">

                        <strong>
                            ❌ Training failed
                        </strong>

                        <br />

                        {error}

                    </div>

                )}


                {/* ================================================= */}
                {/* SUCCESS */}
                {/* ================================================= */}

                {result && result.success && (

                    <div className="alert alert-success mt-3 mb-0">

                        <h6>
                            ✅ AI Models Trained Successfully
                        </h6>


                        <p className="mb-2">

                            Models trained:

                            <strong className="ms-2">

                                {result.models_trained}

                            </strong>

                        </p>


                        {result.processed_dataset && (

                            <p className="mb-2">

                                Processed dataset:

                                <br />

                                <small>
                                    {result.processed_dataset}
                                </small>

                            </p>

                        )}


                        {result.product_mapping && (

                            <p className="mb-2">

                                Product mapping:

                                <br />

                                <small>
                                    {result.product_mapping}
                                </small>

                            </p>

                        )}


                        {result.performance_file && (

                            <p className="mb-2">

                                Performance file:

                                <br />

                                <small>
                                    {result.performance_file}
                                </small>

                            </p>

                        )}


                        {/* ================================================= */}
                        {/* MODEL LIST */}
                        {/* ================================================= */}

                        {result.models && (

                            <>

                                <h6 className="mt-3">
                                    Trained Models
                                </h6>


                                <div>

                                    {result.models.map(
                                        (model, index) => (

                                            <span
                                                key={index}
                                                className="badge bg-secondary me-2 mb-2"
                                            >

                                                {model}

                                            </span>

                                        )
                                    )}

                                </div>

                            </>

                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


export default AITraining;