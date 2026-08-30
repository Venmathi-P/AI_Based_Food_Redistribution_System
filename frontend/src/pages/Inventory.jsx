import InventoryForm from "../components/InventoryForm";
import InventoryTable from "../components/InventoryTable";
import CSVUpload from "../components/CSVUpload";
import BusinessLayout from "../layouts/BusinessLayout";
import POSSync from "../components/POSSync";
import AITraining from "../components/AITraining";

function Inventory() {

    return (

        <BusinessLayout>

            <div className="container-fluid fb-animate-in">

                <div className="fb-page-header">
                    <div>
                        <h2>📦 Inventory Management</h2>
                        <p>Track stock, upload in bulk, and train the AI model on your inventory.</p>
                    </div>
                </div>


                {/* ========================================= */}
                {/* INVENTORY INPUT */}
                {/* ========================================= */}

                <div className="row mb-4 g-4">

                    {/* Manual Inventory */}

                    <div className="col-md-6">

                        <InventoryForm />

                    </div>


                    {/* Bulk CSV + POS */}

                    <div className="col-md-6">

                        <CSVUpload />

                        <POSSync />

                    </div>

                </div>


                {/* ========================================= */}
                {/* AI TRAINING */}
                {/* BELOW MANUAL + BULK/POS */}
                {/* ========================================= */}

                <div className="row mb-4 g-4">

                    <div className="col-12">

                        <AITraining />

                    </div>

                </div>


                {/* ========================================= */}
                {/* INVENTORY TABLE */}
                {/* ========================================= */}

                <div className="card">

                    <div className="card-body">

                        <InventoryTable />

                    </div>

                </div>

            </div>

        </BusinessLayout>

    );

}

export default Inventory;