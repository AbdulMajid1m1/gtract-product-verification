import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import imageLiveUrl from "./urlConverter/imageLiveUrl";
import { useGridApiContext } from "@mui/x-data-grid";
import { Box } from "@mui/material";

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


  {
    field: "document_url",
    headerName: "Document",
    width: 180,
    renderCell: (params) => {
      console.log("params");
      console.log(params);

      return (
        <InsertDriveFileIcon
          style={{
            color: "primary",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
        />
      );
    },


  },
]