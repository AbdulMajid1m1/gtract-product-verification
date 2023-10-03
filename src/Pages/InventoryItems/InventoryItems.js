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
import ShipmentVerification from "../ShipmentVerification/ShipmentVerification";


const InventoryItems = () => {
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
        const response = await newRequest.get("/getGs1ProdProductsbyMemberId?memberId=" + currentUser?.user?.id);
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





  // const handleDelete = async (row) => {
  //   try {
  //     const deleteResponse = await phpRequest.delete('/delete/GTIN', {
  //       data: {
  //         user_id: currentUser?.user?.id, // TODO: change it to currentUser?.user?.id
  //         // user_id: "3", // TODO: change it to currentUser?.user?.id
  //         product_id: row?.product_id,
  //       },
  //     });
  //     console.log(deleteResponse.data);
  //     // Handle the success message or update the data accordingly
  //     const successMessage = deleteResponse.data.message;
  //     openSnackbar(successMessage);


  //     // Update the datagrid Table after deletion
  //     setData(prevData => prevData.filter(item => item.product_id !== row?.product_id));


  //   } catch (err) {
  //     console.log(err);
  //     // Handle the error message or error case
  //     openSnackbar('Something Is Wrong The Data not deleted.')
  //   }
  // };





  const fileInputRef = useRef(null);







  return (
    <div>
      {/* <SideBar /> */}

      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


      <div className="p-3 h-full sm:ml-72">
        {/* <div className='h-10 w-full mb-6 bg-[#1E3B8B] rounded'>
          <p className='sm:text-2xl sm:py-0 py-2 sm:px-10 px-10 text-white font-medium'>GS1 Traceability System</p>
        </div> */}

        <div className='h-auto w-full shadow-xl'>
          <div style={{ marginLeft: '-11px', marginRight: '-11px' }}>

            <DataTable data={data} title="Inventory Items" columnsName={shipmentVerificationColumnd}
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
              //   {
              //     label: "Digital Links",
              //     icon: (
              //       <VisibilityIcon
              //         fontSize="small"
              //         color="action"
              //         style={{ color: "rgb(37 99 235)" }}
              //       />
              //     ),
              //     action: handleDigitalUrlInfo,
              //   }
              //   ,
              //   {
              //     label: "Delete",
              //     icon: <DeleteIcon fontSize="small" style={{ color: '#FF0032' }} />
              //     ,
              //     action: handleDelete,
              //   }
              //   ,
              //   {
              //     label: "Print GTIN",
              //     icon: <DeleteIcon fontSize="small" style={{ color: '#FF0032' }} />
              //     ,
              //     action: handleGtinPage,
              //   }

              // ]}
              uniqueId="priceCheckerId"

            />
          </div>





        </div>
      </div>
    </div>
  )
}

export default InventoryItems