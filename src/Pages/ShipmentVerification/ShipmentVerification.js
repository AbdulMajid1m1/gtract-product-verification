import React, { useContext, useEffect, useState } from "react";
import { shipmentVerificationColumn } from "../../utils/datatablesource";

import { useNavigate } from "react-router-dom";
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import newRequest from "../../utils/userRequest";
import DataTable from "../../Components/Datatable/Datatable";
import { SnackbarContext } from "../../Contexts/SnackbarContext";
import Swal from "sweetalert2";


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

  const handleShipmentApproval = async (row) => {
    try {
      const response = await newRequest.put('/updateShipmentRequestStatus', {
        shipment_id: row.shipment_id,
        status: 'approved'
      });

      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'Okay',
        timer: 2000,
        timerProgressBar: true,
      });

      // on approve, remove the row from the table
      const newData = data.filter((item) => item.shipment_id !== row.shipment_id);
      setData(newData);

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error?.response?.data?.message || 'An error occurred while approving shipment',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  };



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
                  action: handleShipmentApproval

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