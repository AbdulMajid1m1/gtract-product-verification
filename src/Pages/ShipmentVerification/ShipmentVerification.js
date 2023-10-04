import React, { useContext, useEffect, useState } from "react";
import { shipmentVerificationColumn } from "../../utils/datatablesource";

import { useNavigate } from "react-router-dom";
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import newRequest from "../../utils/userRequest";
import DataTable from "../../Components/Datatable/Datatable";
import { SnackbarContext } from "../../Contexts/SnackbarContext";


const ShipmentVerification = () => {
  const [data, setData] = useState([]);


  const { openSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]); // for the map markers
  const navigate = useNavigate()
 
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newRequest.get("/getAllSubmittedShipmentRequests");
        console.log(response.data);
        setData(response?.data || []);
        setIsLoading(false)

      } catch (err) {

        console.log(err);
        setIsLoading(false)
        openSnackbar(err?.response?.data?.message || 'Something Is Wrong', 'error')
      }
    };

    fetchData(); // Calling the function within useEffect, not inside itself
  }, []); // Empty array dependency ensures this useEffect runs once on component mount


  const handleView = (row) => {
    navigate('/verify-shipment')
  }

  const handleEdit = (row) => {
    navigate('/verify-shipment')
  }



  return (
    <div>


      <div className="p-3 h-full sm:ml-72">

        <div className='h-auto w-full shadow-xl'>
          <div style={{ marginLeft: '-11px', marginRight: '-11px' }}>

            <DataTable data={data} title="Shipment Verification" columnsName={shipmentVerificationColumn}
              loading={isLoading}
              secondaryColor="secondary"


              dropDownOptions={[
                {
                  label: "Verify Shipment",
                  icon: (
                    <VerifiedIcon
                      fontSize="small"
                      color="action"
                      style={{ color: "rgb(37 99 235)" }}
                    />
                  ),
                  action: handleView,
                },
                {
                  label: "Approve Shipment",
                  icon: <CheckCircleIcon fontSize="small" color="action" style={{ color: "rgb(37 99 235)" }} />
                  ,
                  action: handleEdit

                },
              ]}
              uniqueId="shipmentVerification"

            />
          </div>





        </div>
      </div>
    </div>
  )
}

export default ShipmentVerification