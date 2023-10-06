import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import imageLiveUrl from "./urlConverter/imageLiveUrl";
import { useGridApiContext } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

function ImageEditInputCell(props) {
  const { id, field, fieldUpdated, value, mode } = props;
  const apiRef = useGridApiContext();

  const handleFileChange = (event) => {
    const file = event.target?.files?.[0];

    if (!file) {
      apiRef.current.setEditCellValue({
        id,
        field: fieldUpdated,
        value: false,
      });
      return;
    }

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageValue = reader.result;
        apiRef.current.setEditCellValue({
          id,
          field: fieldUpdated,
          value: true,
        });
        apiRef.current.setEditCellValue({
          id,
          field,
          value: { file, dataURL: imageValue, isUpdate: true },
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRef = (element) => {
    if (element) {
      const input = element.querySelector('input[type="file"]');
      input?.focus();
    }
  };

  if (mode === "edit") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
        <input
          ref={handleRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Box>
    );
  }

  console.log("Value");
  console.log(value);
}

const renderImageEditInputCell = (params) => {
  const { field, fieldUpdated } = params;
  return (
    <ImageEditInputCell {...params} mode="edit" fieldUpdated={fieldUpdated} />
  );
};

function DocEditInputCell(props) {
  const { id, field, fieldUpdated, value, mode } = props;
  const apiRef = useGridApiContext();

  const handleFileChange = (event) => {
    const file = event.target?.files?.[0];

    if (!file) {
      apiRef.current.setEditCellValue({
        id,
        field: fieldUpdated,
        value: false,
      });
      return;
    }

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageValue = reader.result;
        apiRef.current.setEditCellValue({
          id,
          field: fieldUpdated,
          value: true,
        });
        apiRef.current.setEditCellValue({
          id,
          field,
          value: { file, dataURL: imageValue, isUpdate: true },
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRef = (element) => {
    if (element) {
      const input = element.querySelector('input[type="file"]');
      input?.focus();
    }
  };

  if (mode === "edit") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
        <input
          ref={handleRef}
          type="file"
          // accept =all types of documents
          // name="PdfDoc"
          accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
          onChange={handleFileChange}
        />
      </Box>
    );
  }

  console.log("Value");
  console.log(value);
}

const renderDocEditInputCell = (params) => {
  const { field, fieldUpdated } = params;
  return (
    <DocEditInputCell {...params} mode="edit" fieldUpdated={fieldUpdated} />
  );
};



const GTINCell = (params) => {
  const style = {
    backgroundColor: "rgb(21 128 61)",
    color: "white",
    borderRadius: "30px",
    padding: "2px 5px",
  };
  return <div style={style}>{params.value}</div>;
};



export const shipmentVerificationColumn = [
  {
    field: "shipment_id",
    headerName: "Shipment ID",
    width: 180,
    editable: false,
  },
  {
    field: "vendor_id",
    headerName: "Vendor ID",
    width: 180,
    editable: false,
  },
  {
    field: "customer_id",
    headerName: "Customer ID",
    width: 180,
    editable: false,
  },
  {
    field: "status",
    headerName: "Status",
    width: 180,
    editable: false,
  },




];





export const verifiedProductColumn = [
  {
    field: "shipment_id",
    headerName: "Shipment ID",
    width: 180,
    editable: false,
  },
  {
    field: "vendor_id",
    headerName: "Vendor ID",
    width: 180,
    editable: false,
  },
  {
    field: "customer_id",
    headerName: "Customer ID",
    width: 180,
    editable: false,
  },
  {
    field: "status",
    headerName: "Status",
    width: 180,
    editable: false,
  },






];


export const ShipmentDocColumns = [
  {
    field: "document_id",
    headerName: "Document Id",
    width: 180,
  },
  // {
  //   field: "shipment_id",
  //   headerName: "Shipment Id",
  //   width: 180,

  // },
  {
    field: "document_type",
    headerName: "Document type",
    width: 180,
  },


  // {
  //   field: "document_url",
  //   headerName: "Document",
  //   width: 180,
  //   renderCell: (params) => {
  //     console.log("params");
  //     console.log(params);

  //     return (
  //       <InsertDriveFileIcon
  //         style={{
  //           color: "primary",
  //           width: "40px",
  //           height: "40px",
  //           cursor: "pointer",
  //         }}
  //       />
  //     );
  //   },


  // },
  {
    field: "document_url",
    headerName: "Document",
    width: 180,
    renderCell: (params) => {
      console.log("params");
      console.log(params);

      // Assuming 'params.row.is_verified' contains the true/false value
      const isVerified = params.row.is_verified;

      // Define the color based on the 'isVerified' value
      const iconColor = isVerified ? "green" : "red";

      return (
        <InsertDriveFileIcon
          style={{
            color: iconColor,
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
        />
      );
    },
  },

  {
    field: "is_verified",
    headerName: "Is Verified",
    width: 150,
    editable: false,  // Making this non-editable as it's a custom rendered cell
    renderCell: (params) => (
      <Button
        variant="contained"
        style={{
          borderRadius: '50px',  // Rounded border
          padding: '2px 12px',
          color: 'white',  // White text color
          fontSize: '0.8rem',
          backgroundColor: params.value ? 'green' : 'red',  // Green for verified, Red for not verified
        }}
      >
        {params.value ? 'Verified' : 'Not Verified'}
      </Button>
    ),
  }



]

export const shipmentProductsColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 120,
    editable: true,
  },
  {
    field: "shipment_id",
    headerName: "Shipment ID",
    width: 150,
    editable: true,
  },
  {
    field: "productnameenglish",
    headerName: "Product Name (English)",
    width: 220,
    editable: true,
  },
  {
    field: "productnamearabic",
    headerName: "Product Name (Arabic)",
    width: 220,
    editable: true,
  },
  {
    field: "BrandName",
    headerName: "Brand Name",
    width: 180,
    editable: true,
  },
  {
    field: "BrandNameAr",
    headerName: "Brand Name (Arabic)",
    width: 180,
    editable: true,
  },
  {
    field: "unit",
    headerName: "Unit",
    width: 120,
    editable: true,
  },
  {
    field: "member_id",
    headerName: "Member ID",
    width: 150,
    editable: true,
  },
  {
    field: "barcode",
    headerName: "Barcode",
    width: 180,
    editable: true,
  },
  {
    field: "front_image",
    headerName: "Front Image",
    width: 220,  // You might want to render this as an image or link
    editable: true,
  },
  {
    field: "back_image",
    headerName: "Back Image",
    width: 220,  // Similarly, you might want to render this as an image or link
    editable: true,
  },

  // {
  //   field: "is_verified",
  //   headerName: "Is Verified",
  //   width: 150,
  //   editable: false,  // Making this non-editable as it's a custom rendered cell
  //   renderCell: (params) => (
  //     <Button
  //       variant="contained"
  //       style={{
  //         borderRadius: '50px',  // Rounded border
  //         padding: '2px 12px',
  //         color: 'white',  // White text color
  //         fontSize: '0.8rem',
  //         backgroundColor: params.value ? 'green' : 'red',  // Green for verified, Red for not verified
  //       }}
  //     >
  //       {params.value ? 'Verified' : 'Not Verified'}
  //     </Button>
  //   ),
  // },

  {
    field: "is_verified",
    headerName: "Is Verified",
    renderCell: (params) => {
      const status = params.row.is_verified;
      let borderColor, textColor;

      switch (status) {
        case true: // assuming status is a boolean true
          borderColor = "green";
          textColor = "green";
          break;
        case false: // assuming status is a boolean false
          borderColor = "crimson";
          textColor = "crimson";
          break;
        default:
          borderColor = "crimson";
          textColor = "crimson";
      }

      return (
        <div
          style={{
            border: `2px solid ${borderColor}`,
            color: textColor,
            padding: "2px",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "50px",
            textAlign: "center",
          }}
        >
          {status ? "Verified" : "Not Verified"}
        </div>
      );
    },
    width: 180,
  },

];
