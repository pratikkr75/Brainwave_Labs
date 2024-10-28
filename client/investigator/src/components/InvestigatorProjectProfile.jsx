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
  const [editMode, setEditMode] = useState({
    field: null,
    value: "",
    open: false,
  });
  const [requestMode, setRequestMode] = useState({
    field: null,
    open: false,
    reason: "",
    newValue: "",
  });
  const navigate = useNavigate();
  const [investigator, setInvestigator] = useState({ name: "", email: "" });
  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.investigatorId) {
            setInvestigator({
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
  }, [navigate]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/investigator/project/${projectCode}`
        );
        setProject(res.data);
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = (field, currentValue) => {
    setEditMode({
      field,
      value: currentValue,
      open: true,
    });
  };

  const handleCloseEdit = () => {
    setEditMode({
      field: null,
      value: "",
      open: false,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedData = { [editMode.field]: editMode.value };
      await axios.put(
        `http://localhost:8000/api/projects/${projectCode}`,
        updatedData
      );
      setProject((prev) => ({ ...prev, [editMode.field]: editMode.value }));
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleRequest = (field) => {
    setRequestMode({
      field,
      open: true,
      reason: "",
      newValue: "",
    });
  };

  const handleCloseRequest = () => {
    setRequestMode({
      field: null,
      open: false,
      reason: "",
      newValue: "",
    });
  };

  const handleSubmitRequest = async () => {
    try {
      // Send the request reason and new value to the backend or log it
      let fieldToUpdate = requestMode.field;
      fieldToUpdate = fieldToUpdate.replace(/\s+/g, '');
      fieldToUpdate = "project" + fieldToUpdate;
      console.log(fieldToUpdate);
      let RequestData={
        investigatorEmail: investigator.email,
        projectCode: projectCode,
        fieldToUpdate:fieldToUpdate,
        newValue: requestMode.newValue,
        message:requestMode.reason
      }
      console.log(RequestData);
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, color: "primary.main" }}>
          Project Profile
        </Typography>

        <TableContainer>
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
                { label: "Project Account Number", value: project.projectBankDetails.AccountNumber, editable: true },
                { label: "IFSC Code", value: project.projectBankDetails.IFSC_Code, editable: true },
                { label: "Project Track", value: project.projectTrack, editable: true },
              ].map((row) => (
                <TableRow key={row.label}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: "bold", width: "30%" }}>
                    {row.label}
                  </TableCell>
                  <TableCell sx={{ width: "50%" }}>{row.value}</TableCell>
                  {row.editable && !row.requestable && (
                    <TableCell sx={{ width: "10%" }}>
                      <IconButton
                        onClick={() =>
                          handleEdit(
                            row.label.toLowerCase().replace(" ", ""),
                            row.value
                          )
                        }
                        sx={{ "&:hover": { color: "primary.main" } }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  )}
                  {row.requestable && (
                    <TableCell sx={{ width: "10%" }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRequest(row.label)}
                      >
                        Request Change
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
            onChange={(e) => setEditMode((prev) => ({ ...prev, value: e.target.value }))}
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
