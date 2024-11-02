import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";

function InvestigatorUploadFile() {
    const [projectInvestigator, setProjectInvestigator] = useState({ name: "", email: "" });
    const [reportName, setReportName] = useState("");
    const [file, setFile] = useState(null);
    const [projectFiles, setProjectFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { projectCode } = useParams();
    const navigate = useNavigate();

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.investigatorId) {
            setProjectInvestigator({
              name: `${decodedToken.firstname} ${decodedToken.lastname}`,
              email: decodedToken.email,
            });
          } else {
            navigate("/api/investigator/login");
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          navigate("/api/investigator/login");
        }
      } else {
        navigate("/api/investigator/login");
      }
    };

    fetchAndDecodeToken();
    fetchProjectFiles();
  }, [navigate, projectCode]);

  const fetchProjectFiles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/${projectCode}/projectFiles`
      );
      setProjectFiles(response.data.files);
    } catch (error) {
      console.error("Failed to fetch project files:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = {
            file,
            // uploadedBy:projectAdmin.email,
            projectCode,
  
            // role:"Admin
        }

      await axios.post(
        `http://localhost:8000/api/admin/project/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchProjectFiles();
      setFile(null);
      setReportName(''); // Clear the report name after successful upload
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleViewFile = async (fileName) => {
    try {
      setLoading(true);
      // Make a GET request to fetch the file
      const response = await axios.get(
        `http://localhost:8000/api/admin/files/${fileName}`,
        {
          responseType: 'blob' // Important: tells axios to expect binary data
        }
      );

      // Create a blob URL and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Error viewing file:", error);
      setError("Failed to view file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
    <Box sx={{ backgroundColor: "#e1f5fe", borderRadius: 2, p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Upload a File
        </Typography>
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "white", // White background
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Button variant="outlined" component="label">
                Select File
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                    hidden
                />
            </Button>
            {file && (
                <Typography variant="body2" color="textSecondary">
                    Selected File: {file.name}
                </Typography>
            )}
            <TextField
                label="File Name"
                variant="outlined"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter file name here"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    alignSelf: "flex-start",
                    backgroundColor: "#1976d2",
                    ":hover": { backgroundColor: "#115293" },
                }}
            >
                Upload
            </Button>
        </Box>
    </Box>

    <Box sx={{ backgroundColor: "#f3e5f5", borderRadius: 2, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Project Files
        </Typography>
        {loading && <CircularProgress />}
        <Grid container spacing={2}>
            {Array.isArray(projectFiles) &&
                projectFiles.map((file, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 2,
                                boxShadow: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                p: 2,
                                backgroundColor: "white", // White background
                            }}
                        >
                            <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography
                                variant="body2"
                                noWrap
                                align="center"
                                sx={{ mt: 1, fontWeight: "medium" }}
                            >
                                {file.fileName}
                            </Typography>
                            <IconButton
                                variant="contained"
                                color="primary"
                                onClick={() => handleViewFile(file.fileName)}
                                disabled={loading}
                                sx={{
                                    mt: 1,
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    ":hover": { backgroundColor: "#115293" },
                                    fontSize: "20px", // Smaller eye icon
                                }}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    </Box>

    <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>
            {error}
        </Alert>
    </Snackbar>
</Container>
);
}


export default InvestigatorUploadFile;
