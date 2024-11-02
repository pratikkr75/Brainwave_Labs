import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ProjectProfile = () => {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({ field: null, value: "", open: false });
  const [requestMode, setRequestMode] = useState({ field: null, open: false, reason: "", newValue: "" });
  const navigate = useNavigate();
  const [investigator, setInvestigator] = useState({ name: "", email: "" });
  const [bankDetails, setBankDetails] = useState({ accountNumber: "", IFSC_Code: "" });

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.investigatorId) {
            setInvestigator({ name: `${decodedToken.firstname} ${decodedToken.lastname}`, email: decodedToken.email });
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
  }, [navigate]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/admin/project/${projectCode}`);
        setProject(res.data);
        setBankDetails(res.data.projectBankDetails);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectCode]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleEdit = (field, currentValue) => {
    setEditMode({ field, value: currentValue || "", open: true });
  };

  const handleCloseEdit = () => {
    setEditMode({ field: null, value: "", open: false });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedBankDetails = { ...bankDetails, [editMode.field]: editMode.value || "" };
      const updatedProject = { ...project, projectBankDetails: updatedBankDetails };

      const response = await axios.put(`http://localhost:8000/api/admin/project/${projectCode}`, updatedProject);
      setProject(response.data);
      setBankDetails(updatedBankDetails);
      handleCloseEdit();
      window.location.reload();
    } catch (error) {
      console.error("Error saving project changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleRequest = (field) => {
    setRequestMode({ field, open: true, reason: "", newValue: "" });
  };

  const handleCloseRequest = () => {
    setRequestMode({ field: null, open: false, reason: "", newValue: "" });
  };

  const handleSubmitRequest = async () => {
    try {
      let fieldToUpdate = requestMode.field.replace(/\s+/g, '');
      fieldToUpdate = "project" + fieldToUpdate;

      const RequestData = {
        investigatorEmail: investigator.email,
        projectCode,
        fieldToUpdate,
        newValue: requestMode.newValue,
        message: requestMode.reason,
      };

      const res = await axios.post('http://localhost:8000/api/investigator/project/request', RequestData);
      alert(res.data.message);
      handleCloseRequest();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(error.response.data.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, color: "primary.main", fontFamily: "'Lexend Deca', sans-serif" }}>
          Project Profile
        </Typography>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {[
                { label: "Project Code", value: project.projectCode },
                { label: "Project Title", value: project.projectTitle },
                { label: "Project Admin", value: project.projectAdmin.name },
                { label: "Start Date", value: formatDate(project.projectStartDate) },
                { label: "End Date", value: formatDate(project.projectEndDate), editable: true, requestable: true },
                { label: "Duration", value: project.projectDuration },
                { label: "Budget", value: project.projectBudget, editable: true, requestable: true },
                { label: "Bank Account Number", value: bankDetails.accountNumber, editable: true },
                { label: "IFSC Code", value: bankDetails.IFSC_Code, editable: true },
              ].map((row) => (
                <TableRow key={row.label}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: "bold", width: "30%", fontFamily: "'Lexend Deca', sans-serif" }}>
                    {row.label}
                  </TableCell>
                  <TableCell sx={{ width: "50%", fontFamily: "'Lexend Deca', sans-serif" }}>{row.value}</TableCell>
                  {row.editable && !row.requestable && (
                    <TableCell sx={{ width: "10%" }}>
                      <IconButton onClick={() => handleEdit(row.label, row.value)} sx={{ "&:hover": { color: "primary.main" } }}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  )}
                  {row.requestable && (
                    <TableCell sx={{ width: "20%" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRequest(row.label)}
                        sx={{
                          backgroundColor: "secondary.main",
                          color: "white",
                          width:"100%",
    
                          "&:hover": {
                            backgroundColor: "secondary.dark",
                          },
                        }}
                      >
                        Request 
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editMode.open} onClose={handleCloseEdit}>
        <DialogTitle>Edit {editMode.field}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={editMode.value}
            onChange={(e) => handleEdit(editMode.field, e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Change Dialog */}
      <Dialog open={requestMode.open} onClose={handleCloseRequest}>
        <DialogTitle>Request for Change in {requestMode.field}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={2}
            label="Reason for Request"
            value={requestMode.reason}
            onChange={(e) => setRequestMode((prev) => ({ ...prev, reason: e.target.value }))}
          />
          <TextField
            margin="dense"
            fullWidth
            label="New Value"
            value={requestMode.newValue}
            onChange={(e) => setRequestMode((prev) => ({ ...prev, newValue: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequest}>Cancel</Button>
          <Button onClick={handleSubmitRequest} variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectProfile;

