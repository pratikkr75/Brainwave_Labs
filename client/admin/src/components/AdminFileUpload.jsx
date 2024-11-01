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
  CardContent,
  CardMedia,
  Box,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function AdminFileUpload() {
  const [projectAdmin, setProjectAdmin] = useState({ name: "", email: "" });
  const [reportName, setReportName] = useState("");
  const [file, setFile] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);

  const { projectCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.adminId) {
            setProjectAdmin({
              name: `${decodedToken.firstname} ${decodedToken.lastname}`,
              email: decodedToken.email,
            });
          } else {
            navigate("/api/admin/login");
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          navigate("/api/admin/login");
        }
      } else {
        navigate("/api/admin/login");
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
            uploadedBy:projectAdmin.email,
            projectCode,
            role:"Admin"
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
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload a File
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Button variant="outlined" component="label" sx={{ marginBottom: 2 }}>
          Select File
          <input
            type="file"
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
            hidden
          />
        </Button>
        {file && (
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
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
        <Button type="submit" variant="contained" color="primary">
          Upload
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Project Files
      </Typography>

      {Array.isArray(projectFiles) && projectFiles.length > 0 && (
        <Grid container spacing={2}>
          {projectFiles.map((file, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card sx={{ maxWidth: 120, textAlign: "center" }}>
                <CardMedia>
                  <PictureAsPdfIcon
                    sx={{ fontSize: 50, color: "red", marginTop: 2 }}
                  />
                </CardMedia>
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {file.fileName}
                  </Typography>
                </CardContent>
                <Button
                  size="small"
                  component="a"
                  href={`http://localhost:8000/files/${file.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: "none" }}
                >
                  View
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default AdminFileUpload;
