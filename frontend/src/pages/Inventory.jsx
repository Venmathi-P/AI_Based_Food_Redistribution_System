import InventoryForm from "../components/InventoryForm";
import InventoryTable from "../components/InventoryTable";
import CSVUpload from "../components/CSVUpload";
import ExpiryAlert from "../components/ExpiryAlert";
import BusinessLayout from "../layouts/BusinessLayout";
import POSSync from "../components/POSSync";
function Inventory() {

    return (

        <BusinessLayout>

            <div className="container-fluid">

                <h2 className="mb-4">
                    📦 Inventory Management
                </h2>
                

                {/* Top Row */}

                <div className="row mb-4">

                    <div className="col-md-6">

                        <InventoryForm />

                    </div>

                    <div className="col-md-6">

                        <CSVUpload />
                        <POSSync />

                        <div className="mt-3">
                            <ExpiryAlert />
                        </div>

                    </div>

                </div>

                {/* Inventory Table */}

                <div className="card shadow">

                    <div className="card-body">

                        <InventoryTable />

                    </div>

                </div>

            </div>

        </BusinessLayout>

    );

}

export default Inventory;