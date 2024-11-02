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
  InputAdornment,
  Stack,
  useTheme,
  useMediaQuery
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
  const [projectInvestigators, setProjectInvestigators] = useState([]);
  const [allInvestigators, setAllInvestigators] = useState([]);
  const [newInvestigator,setnewInvestigators] = useState([]);
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
  const [searchText,setSearchText] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


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
        setProjectInvestigators(res.data.projectInvestigators);
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

  const handleSearchInvestigators = async (e) => {
    e.preventDefault();
    if (searchText) {
      try {
        console.log(searchText);
        const response = await axios.get('http://localhost:8000/api/findInvestigator/', {
          params: { searchText: searchText, projectCode:projectCode },
        });
        setAllInvestigators(response.data);
        console.log(allInvestigators);
      } catch (error) {
        alert(error.response?.data?.message || 'Error fetching investigators');
      }
    } else {
      alert("Please enter Search Text to search investigators.");
    }
  };

  const handleAddInvestigator = (investigator) => {
    if (!projectInvestigators.some(inv => inv.email === investigator.email)) {
      const newInvestigator = { name: investigator.firstname + " " + investigator.lastname, email: investigator.email };
      setProjectInvestigators(prev => [...prev, newInvestigator]);
      setAllInvestigators(prev => prev.filter(inv => inv.email !== investigator.email));
      setHasUnsavedChanges(true); 
      setnewInvestigators(prev => [...prev, newInvestigator]);

    }
  };

  const handleRemoveInvestigator = (investigator) => {
    const removedInvestigator = projectInvestigators.find(inv => inv.email === investigator.email);
    setProjectInvestigators(prev => prev.filter(inv => inv.email !== investigator.email));
    setnewInvestigators(prev => prev.filter(inv => inv.email !== investigator.email));

    if (removedInvestigator) {
      setAllInvestigators(prev => [...prev, { 
        firstname: removedInvestigator.name.split(" ")[0], 
        lastname: removedInvestigator.name.split(" ")[1], 
        email: removedInvestigator.email 
      }]);
    }
    console.log(projectInvestigators);
  };
  const handleDeleteInvestigator = async (name, email) => {
    try {
      const deleteData = {
        projectCode,
        name: name,
        email: email
      };
      console.log(deleteData);
      const res = await axios.post(`http://localhost:8000/api/admin/project/deleteInvestigator`, deleteData);
      setProject(prev => ({
        ...prev,
        projectInvestigators: prev.projectInvestigators.filter(inv => inv.email !== email),
      }));
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error deleting investigator:", error);
    }
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
        projectInvestigators : projectInvestigators
      };

      const response = await axios.put(
        `http://localhost:8000/api/admin/project/${projectCode}`,
        updatedProject
      );
      
      setProject(response.data);
      window.location.reload(true);
      setAllInvestigators([]);
      setProjectInvestigators(project.projectInvestigators);
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
  const ListItemComponent = ({ 
    primary, 
    secondary, 
    buttonText, 
    onButtonClick, 
    buttonColor = "primary",
    buttonVariant = "contained" 
  }) => (
    <ListItem
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        padding: isMobile ? 2 : 2,
        gap: isMobile ? 2 : 0
      }}
    >
      <ListItemText
        primary={primary}
        secondary={secondary}
        sx={{
          margin: 0,
          '& .MuiListItemText-primary': {
            wordBreak: 'break-word'
          },
          '& .MuiListItemText-secondary': {
            wordBreak: 'break-word'
          }
        }}
      />
      <Box sx={{ 
        width: isMobile ? '100%' : 'auto',
        display: 'flex',
        justifyContent: isMobile ? 'flex-end' : 'flex-end'
      }}>
        <Button
          variant={buttonVariant}
          color={buttonColor}
          onClick={onButtonClick}
          size="small"
          startIcon={buttonText === "Remove" ? <DeleteIcon /> : null}
          sx={{
            minWidth: isMobile ? '100px' : '100px'
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </ListItem>
  );

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 4 } }}>
    <StyledPaper>
      <ProjectTitle variant="h4" gutterBottom align="center"  fontFamily={"'Lexend Deca', sans-serif"}>
        {project.projectTitle}
      </ProjectTitle>

      <Grid container spacing={4}>
        {/* Project Overview Card */}
        <Grid item xs={12} md={6}>
          <DetailCard>
            <CardContent>
              <Typography variant="h6" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
                Project Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
                Code: {project.projectCode}
              </Typography>
              <Typography variant="body1" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
                Duration: {new Date(project.projectStartDate).toLocaleDateString()} -
                {isEditingEndDate ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
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
              <Typography variant="body1" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
                Status:{" "}
                <Chip
                  label={project.projectCompleted ? "Completed" : "In Progress"}
                  color={project.projectCompleted ? "success" : "warning"}
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
      <Typography
        variant="h6"
        gutterBottom
        fontFamily={"'Lexend Deca', sans-serif"}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <AttachMoneyIcon sx={{ mr: 1 }} /> Financial Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Budget Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body1"  fontFamily={"'Lexend Deca', sans-serif"}>Budget: Rs {project.projectBudget}</Typography>
        {isEditingBudget ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              type="number"
              size="small"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              sx={{ maxWidth: "100px" }}
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
          <IconButton onClick={handleEditBudget} size="small" sx={{ padding: 0 }}>
            <EditIcon />
          </IconButton>
        )}
      </Box>

      {/* Bank Details Section */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}  fontFamily={"'Lexend Deca', sans-serif"}>
        <AccountBalanceIcon sx={{ mr: 1 }} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body1"  fontFamily={"'Lexend Deca', sans-serif"}>
                Account: {project.projectBankDetails.accountNumber}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1"  fontFamily={"'Lexend Deca', sans-serif"}>
                  IFSC: {project.projectBankDetails.IFSC_Code}
                </Typography>
                <IconButton onClick={handleEditBankDetails} size="small" sx={{ padding: 0 }}>
                  <EditIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </CardContent>
  </DetailCard>
</Grid>

</Grid>
      {/* Spacer for future content */}
      <Box sx={{ mt: 4 }}>
        {/** Additional content or components would be added here **/}
      </Box>
    </StyledPaper>

        {/* Rest of the component remains exactly the same */}
        {/* <SectionTitle variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          <TrackChangesIcon sx={{ mr: 1 }} /> Project Track
        </SectionTitle>
        <Typography variant="body1" sx={{ ml: 4 }}>
          {project.projectTrack}
        </Typography> */}

<Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 2,
        width: '100%'
      }}
    >
      <Stack spacing={3}>
        {/* Project Team Header */}
        <Typography variant="h5" component="h2"  fontFamily={"'Lexend Deca', sans-serif"}>
          Project Team
        </Typography>

        {/* Admin Section */}
        <Box>
          <Typography variant="h6" color="primary" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
            Project Administrator
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.50',
              wordBreak: 'break-word'
            }}
          >
            <Typography variant="subtitle1"  fontFamily={"'Lexend Deca', sans-serif"}>
              {project.projectAdmin.name}
            </Typography>
            <Typography variant="body2" color="text.secondary"  fontFamily={"'Lexend Deca', sans-serif"}>
              {project.projectAdmin.email}
            </Typography>
          </Paper>
        </Box>

        {/* Current Investigators Section */}
        <Box>
          <Typography variant="h6" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
            Current Investigators
          </Typography>
          <List sx={{ p: 0 }}>
            {project.projectInvestigators.map((inv) => (
              <ListItemComponent
                key={inv._id}
                primary={inv.name}
                secondary={inv.email}
                buttonText="Remove"
                buttonColor="error"
                buttonVariant="outlined"
                fontFamily={"'Lexend Deca', sans-serif"}
                onButtonClick={() => handleDeleteInvestigator(inv.name, inv.email)}
              />
            ))}
          </List>
        </Box>

        {/* Search Section */}
        <Box>
          <Typography variant="h6" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
            Add New Investigators
          </Typography>
         <Box 
                component="form" 
                onSubmit={handleSearchInvestigators}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Search Investigator by Email"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Enter investigator's email"
                  sx={{
                    margin: 0,
                    '& .MuiInputBase-root': {
                      borderRadius: 1
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearchInvestigators}
                  fullWidth={isMobile}
                  sx={{ 
                    width: isMobile ? '100%' : 'auto',
                    alignSelf: isMobile ? 'stretch' : 'flex-end',
                    px: 3,
                    py: 1,
                  }}
                >
                  Search
                </Button>
              </Box>
           
        </Box>

        {/* Search Results */}
        {allInvestigators.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
              Matching Investigators
            </Typography>
            <List sx={{ p: 0 }}>
              {allInvestigators.map((investigator, index) => (
                <ListItemComponent
                  key={index}
                  primary={`${investigator.firstname} ${investigator.lastname}`}
                  secondary={investigator.email}
                  buttonText="Add"
                  onButtonClick={() => handleAddInvestigator(investigator)}
                />
              ))}
            </List>
          </Box>
        )}

        {/* Selected Investigators */}
        <Box>
          <Typography variant="h6" gutterBottom  fontFamily={"'Lexend Deca', sans-serif"}>
            Selected Investigators
          </Typography>
          {projectInvestigators.length > 0 ? (
            <List sx={{ p: 0 }}>
              {projectInvestigators.map((investigator, index) => (
                <ListItemComponent
                  key={index}
                  primary={investigator.name}
                  secondary={investigator.email}
                  buttonText="Remove"
                  buttonColor="error"
                  buttonVariant="outlined"
                  onButtonClick={() => handleRemoveInvestigator(investigator)}
                />
              ))}
            </List>
          ) : (
            <Typography color="text.secondary"  fontFamily={"'Lexend Deca', sans-serif"}>
              No investigators added yet
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
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
            <Typography variant="body2"  fontFamily={"'Lexend Deca', sans-serif"} color="warning.main" sx={{ mr: 2 }}>
              You have unsaved changes
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveAllChanges}
            disabled={!hasUnsavedChanges || isSaving}
            sx={{ minWidth: 150 }}
            fontFamily={"'Lexend Deca', sans-serif"}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>

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