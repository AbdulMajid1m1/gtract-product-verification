import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import InventoryItems from "./Pages/InventoryItems/InventoryItems";
import Login from "./Pages/Login/Login";
import DataTableProvider from "./Contexts/DataTableContext";
import { CurrentUserProvider } from "./Contexts/CurrentUserContext";
import { SnackbarProvider } from "./Contexts/SnackbarContext";
import ShipmentVerification from "./Pages/ShipmentVerification/ShipmentVerification";
import VerifiedProduct from "./Pages/VerifiedProduct/VerifiedProduct";
import VerifyShipment from "./Pages/VerifyShipment/VerifyShipment";
import ShipmentDocUpload from "./Pages/ShipmentDocUpload/ShipmentDocUpload";
import GtinJourney from "./Pages/GtinJourney/GtinJourney";

const App = () => {
  const MainLayout = ({ children }) => {
    return (
      <div className="main-layout-container">
        <Sidebar />
        <span className="right-layout">{children}</span>
      </div>
    );
  };
  return (
    <>
      <DataTableProvider>
        <SnackbarProvider>
          <CurrentUserProvider>

            <div>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/gtin-journey" element={<GtinJourney />} /> 

                  <Route
                    path="/*"
                    element={
                      <MainLayout>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/shipment-verification" element={<ShipmentVerification />} />
                          <Route path="/verified-product" element={<VerifiedProduct />} />
                          <Route path="/verify-shipment" element={<VerifyShipment />} />
                          <Route path="/shipment-docs/:productId" element={<ShipmentDocUpload />} />
                          {/* <Route path="/inventory-items" element={<InventoryItems />} /> */}
                        </Routes>
                      </MainLayout>
                    }
                  />
                </Routes>
              </BrowserRouter>


            </div>
          </CurrentUserProvider>
        </SnackbarProvider>
      </DataTableProvider>


    </>
  );
};

export default App;