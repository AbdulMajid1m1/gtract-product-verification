import React, { useContext, useEffect, useRef, useState } from "react";
import { ProductsDataColumn, shipmentVerificationColumn } from "../../utils/datatablesource";

import { useNavigate } from "react-router-dom";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import LinkIcon from '@mui/icons-material/Link';
import newRequest from "../../utils/userRequest";
import DataTable from "../../Components/Datatable/Datatable";
import { SnackbarContext } from "../../Contexts/SnackbarContext";
import { CurrentUserContext } from "../../Contexts/CurrentUserContext";


const ShipmentVerification = () => {
  const [data, setData] = useState([]);


  const { openSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]); // for the map markers
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate()
  console.log(currentUser)

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



  return (
    <div>


      <div className="p-3 h-full sm:ml-72">

        <div className='h-auto w-full shadow-xl'>
          <div style={{ marginLeft: '-11px', marginRight: '-11px' }}>

            <DataTable data={data} title="Shipment Verification" columnsName={shipmentVerificationColumn}
              loading={isLoading}
              secondaryColor="secondary"


              // dropDownOptions={[
              //   {
              //     label: "View",
              //     icon: (
              //       <VisibilityIcon
              //         fontSize="small"
              //         color="action"
              //         style={{ color: "rgb(37 99 235)" }}
              //       />
              //     ),
              //     action: handleView,
              //   },
              //   {
              //     label: "Edit",
              //     icon: <EditIcon fontSize="small" color="action" style={{ color: "rgb(37 99 235)" }} />
              //     ,
              //     action: handleEdit

              //   },
              // ]}
              uniqueId="shipmentVerification"

            />
          </div>





        </div>
      </div>
    </div>
  )
}

export default ShipmentVerification