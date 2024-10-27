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
  const [projectAdmin, setProjectAdmin] = useState({
    name: "Admin Name",
    email: "admin@example.com",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    field: null,
    value: "",
    open: false,
  });
  const [newInvestigator, setNewInvestigator] = useState({
    name: "",
    email: "",
  });
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
  }, [navigate]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/admin/project/${projectCode}`
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
      const res = await axios.put(
        `http://localhost:8000/api/admin/project/${projectCode}`,
        updatedData
      );
      setProject((prev) => ({ ...prev, [editMode.field]: editMode.value }));
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleAddInvestigator = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/admin/project/${projectCode}/investigator`,
        newInvestigator
      );
      setProject((prev) => ({
        ...prev,
        projectInvestigators: [...prev.projectInvestigators, res.data],
      }));
      setNewInvestigator({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding investigator:", error);
    } 
  };

  const handleDeleteInvestigator = async (name, email) => {
    try {
      const deleteData = { projectCode, name, email };
      await axios.post(
        `http://localhost:8000/api/admin/project/deleteInvestigator`,
        deleteData
      );
      setProject((prev) => ({
        ...prev,
        projectInvestigators: prev.projectInvestigators.filter(
          (inv) => inv.email !== email
        ),
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting investigator");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, color: "primary.main" }}
        >
          {project.projectTitle}
        </Typography>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {[
                { label: "Project Code", value: project.projectCode },
                {
                  label: "Start Date",
                  value: new Date(
                    project.projectStartDate
                  ).toLocaleDateString(),
                },
                {
                  label: "End Date",
                  value: new Date(project.projectEndDate).toLocaleDateString(),
                },
                { label: "Budget", value: `Rs ${project.projectBudget}` },
                {
                  label: "Status",
                  value: project.projectCompledted ? "Completed" : "Ongoing",
                },
                { label: "Track", value: project.projectTrack },
                {
                  label: "Account Number",
                  value: project.projectBankDetails.accountNumber,
                },
                {
                  label: "IFSC Code",
                  value: project.projectBankDetails.IFSC_Code,
                },
              ].map((row) => (
                <TableRow key={row.label}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: "bold", width: "30%" }}
                  >
                    {row.label}
                  </TableCell>
                  <TableCell sx={{ width: "60%" }}>{row.value}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Project Investigators
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {project.projectInvestigators.map((inv) => (
                <TableRow key={inv.email}>
                  <TableCell>{inv.name}</TableCell>
                  <TableCell>{inv.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() =>
                        handleDeleteInvestigator(inv.name, inv.email)
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={newInvestigator.email}
            onChange={(e) =>
              setNewInvestigator({ ...newInvestigator, email: e.target.value })
            }
          />
          <Button variant="contained" onClick={handleAddInvestigator}>
            Add Investigator
          </Button>
        </Box>
      </Paper>

      <Dialog open={editMode.open} onClose={handleCloseEdit}>
        <DialogTitle>Edit {editMode.field}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={editMode.value}
            onChange={(e) =>
              setEditMode((prev) => ({ ...prev, value: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectProfile;
