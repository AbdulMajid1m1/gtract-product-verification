import * as React from 'react';
import { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import newRequest from '../../utils/userRequest';
import Swal from 'sweetalert2';
import { SnackbarContext } from '../../Contexts/SnackbarContext';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const theme = createTheme({
    palette: {
        primary: {
            main: '#1E3B8B',
        },
    },
});



const docType = [
    "Certificate of Conformity",
    "Commercial Sales Invoice",
    "Product Test Certificate",
    "Barcode Certificate",
    "Company License",
    "GLN Certificate"
]
function CustomLoadingButton({ loading, children, ...otherProps }) {
    return (
        <Button {...otherProps} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : children}
        </Button>
    );
}

export default function ShipmentDocUploadPopup({ open, onClose, productId, closeDocPopup, refectDocList }) {
    const [documentType, setDocumentType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const { openSnackbar } = React.useContext(SnackbarContext);


    const handleDocumentTypeChange = (event) => {
        setDocumentType(event.target.value);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile || !documentType) {
            openSnackbar('Please select a file and document type', 'error');

        }


        setUploading(true);

        // Prepare the form data
        const formData = new FormData();
        formData.append('product_id', productId);
        formData.append('document_type', documentType);
        formData.append('document', selectedFile);
        try {
            // Send the request to the backend
            const response = await newRequest.post('/insertShipmentDocument', formData);
            console.log(response);
            const responseData = response?.data;

            setUploaded(true);
            openSnackbar('Document uploaded successfully', 'success');
            refectDocList();
            closeDocPopup();


        } catch (error) {
            console.log(error);
            openSnackbar(error?.response?.data?.message || 'Failed to upload document', 'error');
        } finally {
            setUploading(false);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={closeDocPopup} maxWidth="sm" fullWidth>
                <DialogTitle>Select Document Type and Upload</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select the document type and upload the corresponding file.
                    </DialogContentText>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="document-type-label">Document Type</InputLabel>
                        <Select
                            labelId="document-type-label"
                            id="document-type-select"
                            value={documentType}
                            onChange={handleDocumentTypeChange}
                            label="Document Type"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {docType.map((doc) => (
                                <MenuItem key={doc} value={doc}>
                                    {doc}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <div style={{ marginTop: 20 }}>

                        {selectedFile && (
                            <div style={{ marginTop: 10, color: 'blue' }}>{selectedFile.name}</div>
                        )}
                        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth>
                            Upload file
                            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                        </Button>
                        {uploaded && <div style={{ marginTop: 20, color: 'green' }}>File uploaded successfully!</div>}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDocPopup} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} color="primary" disabled={uploading}>
                        {uploading ? <CircularProgress size={24} /> : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
