import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

// All styled components remain the same
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(to right bottom, #ffffff, #fafafa)",
}));

const ProjectTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

const DetailCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function ProjectProfile() {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [newInvestigator, setNewInvestigator] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingEndDate, setIsEditingEndDate] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    IFSC_Code: "",
  });
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);

  // States for tracking changes and saving status
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/admin/project/${projectCode}`
        );
        setProject(res.data);
        setBankDetails(res.data.projectBankDetails);
        setEndDate(new Date(res.data.projectEndDate).toISOString().split('T')[0]);
        setBudget(res.data.projectBudget);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setSnackbar({
          open: true,
          message: "Error fetching project details",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectCode]);

  // Existing functions remain the same
  const handleAddInvestigator = async () => {
    // ... existing code ...
  };

  const handleDeleteInvestigator = async (name, email) => {
    // ... existing code ...
  };

  const handleEditBankDetails = () => {
    setIsEditingBank(true);
  };

  const handleSaveBankDetails = () => {
    setProject((prev) => ({
      ...prev,
      projectBankDetails: bankDetails,
    }));
    setIsEditingBank(false);
    setHasUnsavedChanges(true);
  };

  // New handlers for End Date
  const handleEditEndDate = () => {
    setIsEditingEndDate(true);
  };

  const handleSaveEndDate = () => {
    setProject((prev) => ({
      ...prev,
      projectEndDate: new Date(endDate).toISOString(),
    }));
    setIsEditingEndDate(false);
    setHasUnsavedChanges(true);
  };

  // New handlers for Budget
  const handleEditBudget = () => {
    setIsEditingBudget(true);
  };

  const handleSaveBudget = () => {
    setProject((prev) => ({
      ...prev,
      projectBudget: Number(budget),
    }));
    setIsEditingBudget(false);
    setHasUnsavedChanges(true);
  };

  const handleSaveAllChanges = async () => {
    setIsSaving(true);
    try {
      const updatedProject = {
        ...project,
        projectBankDetails: bankDetails,
        projectEndDate: new Date(endDate).toISOString(),
        projectBudget: Number(budget),
      };

      const response = await axios.put(
        `http://localhost:8000/api/admin/project/${projectCode}`,
        updatedProject
      );
      
      setProject(response.data);
      window.location.reload(true);

      setHasUnsavedChanges(false);

      setSnackbar({
        open: true,
        message: "Project updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving project changes:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error saving changes",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper>
        <ProjectTitle variant="h4">{project.projectTitle}</ProjectTitle>

        <Grid container spacing={3}>
          {/* Project Overview Card */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Overview
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Code: {project.projectCode}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Duration: {new Date(project.projectStartDate).toLocaleDateString()} -
                  {isEditingEndDate ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="date"
                        size="small"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveEndDate}
                        variant="contained"
                        size="small"
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {" "}{new Date(project.projectEndDate).toLocaleDateString()}
                      <IconButton onClick={handleEditEndDate} size="small">
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Status:{" "}
                  <Chip
                    label={project.projectCompledted ? "Completed" : "In Progress"}
                    color={project.projectCompledted ? "success" : "warning"}
                    size="small"
                  />
                </Typography>
              </CardContent>
            </DetailCard>
          </Grid>

          {/* Financial Details Card */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                  <AttachMoneyIcon sx={{ mr: 1 }} /> Financial Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Budget: Rs{" "}
                  {isEditingBudget ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveBudget}
                        variant="contained"
                        size="small"
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {project.projectBudget}
                      <IconButton onClick={handleEditBudget} size="small">
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <AccountBalanceIcon sx={{ mr: 1 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    {isEditingBank ? (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="Account Number"
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            setBankDetails((prev) => ({
                              ...prev,
                              accountNumber: e.target.value,
                            }))
                          }
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="IFSC Code"
                          value={bankDetails.IFSC_Code}
                          onChange={(e) =>
                            setBankDetails((prev) => ({
                              ...prev,
                              IFSC_Code: e.target.value,
                            }))
                          }
                        />
                        <Button
                          startIcon={<SaveIcon />}
                          onClick={handleSaveBankDetails}
                          variant="contained"
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="body1">
                          Account: {project.projectBankDetails.accountNumber}
                        </Typography>
                        <Typography variant="body1">
                          IFSC: {project.projectBankDetails.IFSC_Code}
                        </Typography>
                        <IconButton
                          onClick={handleEditBankDetails}
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </DetailCard>
          </Grid>
        </Grid>

        {/* Rest of the component remains exactly the same */}
        <SectionTitle variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          <TrackChangesIcon sx={{ mr: 1 }} /> Project Track
        </SectionTitle>
        <Typography variant="body1" sx={{ ml: 4 }}>
          {project.projectTrack}
        </Typography>

        <SectionTitle variant="h5">Project Team</SectionTitle>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Admin: {project.projectAdmin.name} ({project.projectAdmin.email})
          </Typography>
        </Box>

        <List>
          {project.projectInvestigators.map((inv) => (
            <StyledListItem key={inv._id}>
              <ListItemText primary={inv.name} secondary={inv.email} />
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteInvestigator(inv.name, inv.email)}
                size="small"
              >
                Remove
              </Button>
            </StyledListItem>
          ))}
        </List>

        <Box sx={{ mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add New Investigator
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              value={newInvestigator.email}
              onChange={(e) =>
                setNewInvestigator({
                  ...newInvestigator,
                  email: e.target.value,
                })
              }
              fullWidth
            />
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddInvestigator}
            >
              Add
            </Button>
          </Box>
        </Box>

        {/* Save Changes Button */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {hasUnsavedChanges && (
            <Typography variant="body2" color="warning.main" sx={{ mr: 2 }}>
              You have unsaved changes
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveAllChanges}
            disabled={!hasUnsavedChanges || isSaving}
            sx={{ minWidth: 150 }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </StyledPaper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProjectProfile;