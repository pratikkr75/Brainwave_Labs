import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

function CreateProject({name, email}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [projectCode, setProjectCode] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectAdmin, setProjectAdmin] = useState({ name: name, email: email});
  const [projectInvestigators, setProjectInvestigators] = useState([]);
  const [allInvestigators, setAllInvestigators] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectDuration, setProjectDuration] = useState(0);
  const [projectTrack, setProjectTrack] = useState("");
  const [projectBankDetails, setProjectBankDetails] = useState({ accountNumber: "", IFSC_Code: "" });
  const [projectBudget, setProjectBudget] = useState(0);

  const handleSearchInvestigators = async (e) => {
    e.preventDefault();
    if (searchText) {
      try {
        const response = await axios.get('http://localhost:8000/api/findInvestigator/', {
          params: { searchText: searchText , projectCode:projectCode},
        });
        setAllInvestigators(response.data);
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
    }
  };

  const handleRemoveInvestigator = (investigator) => {
    const removedInvestigator = projectInvestigators.find(inv => inv.email === investigator.email);
    setProjectInvestigators(prev => prev.filter(inv => inv.email !== investigator.email));
    if (removedInvestigator) {
      setAllInvestigators(prev => [...prev, { 
        firstname: removedInvestigator.name.split(" ")[0], 
        lastname: removedInvestigator.name.split(" ")[1], 
        email: removedInvestigator.email 
      }]);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const projectData = {
      projectCode,
      projectTitle,
      projectAdmin,
      projectInvestigators,
      projectStartDate,
      projectEndDate,
      projectDuration,
      projectTrack,
      projectBankDetails,
      projectBudget,
    };
    projectAdmin.name = name;
    projectAdmin.email = email;
    setProjectAdmin(projectAdmin);
    try {
      const res = await axios.post('http://localhost:8000/api/admin/createproject', projectData);
      alert(res.data.message);
    } catch (error) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        backendErrors.forEach((err) => alert(err.message));
      } else {
        alert(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 1, sm: 2 },
        px: { xs: 0.5, sm: 2 },
        width: '100%',
        maxWidth: '100% !important'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 1, sm: 1, md: 3 },
          borderRadius: 2,
          backgroundColor: '#ffffff',
          width: '100%'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 600,
            color: theme.palette.primary.main 
          }}
        >
          Create New Project
        </Typography>

        <form onSubmit={handleCreateProject}>
          <Grid container spacing={3}>
            {/* Basic Project Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Code"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                placeholder="Enter project code"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Admin Information */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Project Admin Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        value={name} 
                        label="Admin Name"
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        value={email} 
                        label="Admin Email"
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Investigator Search */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Add Investigators
                  </Typography>
                  <Box component="form" onSubmit={handleSearchInvestigators}>
                    <TextField
                      fullWidth
                      label="Search Investigator by Email"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Enter investigator's email"
                      sx={{ mb: 2 }}
                    />
                    <Button 
                      fullWidth
                      variant="contained" 
                      onClick={handleSearchInvestigators}
                      startIcon={<SearchIcon />}
                      sx={{ 
                        borderRadius: 2,
                        mb: 2
                      }}
                    >
                      Search
                    </Button>
                  </Box>

                  {/* Search Results */}
                  {allInvestigators.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Matching Investigators:
                      </Typography>
                      <List>
                        {allInvestigators.map((investigator, index) => (
                          <ListItem 
                            key={index}
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 1,
                              mb: 1
                            }}
                          >
                            <ListItemText 
                              primary={`${investigator.firstname} ${investigator.lastname}`}
                              secondary={investigator.email}
                            />
                            <Button
                              variant="outlined"
                              onClick={() => handleAddInvestigator(investigator)}
                              startIcon={<PersonAddIcon />}
                              size={isMobile ? "small" : "medium"}
                              sx={{ minWidth: { xs: '70px', sm: '100px' } }}
                            >
                              {!isMobile && "Add"}
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Selected Investigators */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Selected Investigators:
                    </Typography>
                    {projectInvestigators.length > 0 ? (
                      <List>
                        {projectInvestigators.map((investigator, index) => (
                          <ListItem 
                            key={index}
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 1,
                              mb: 1
                            }}
                          >
                            <ListItemText 
                              primary={investigator.name}
                              secondary={investigator.email}
                            />
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleRemoveInvestigator(investigator)}
                              startIcon={<PersonRemoveIcon />}
                              size={isMobile ? "small" : "medium"}
                              sx={{ minWidth: { xs: '90px', sm: '120px' } }}
                            >
                              {!isMobile && "Remove"}
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No investigators added yet
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Project Details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Start Date"
                type="date"
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project End Date"
                type="date"
                value={projectEndDate}
                onChange={(e) => setProjectEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Duration (months)"
                type="number"
                value={projectDuration}
                onChange={(e) => setProjectDuration(Number(e.target.value))}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Track"
                value={projectTrack}
                onChange={(e) => setProjectTrack(e.target.value)}
                placeholder="Enter project track"
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Bank Details */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Bank Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Bank Account Number"
                        value={projectBankDetails.accountNumber}
                        onChange={(e) => setProjectBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="IFSC Code"
                        value={projectBankDetails.IFSC_Code}
                        onChange={(e) => setProjectBankDetails(prev => ({ ...prev, IFSC_Code: e.target.value }))}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Project Budget */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Budget"
                type="number"
                value={projectBudget}
                onChange={(e) => setProjectBudget(Number(e.target.value))}
                placeholder="Enter the project budget"
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size={isMobile ? "medium" : "large"}
              sx={{
                minWidth: { xs: '100%', sm: '200px' },
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Create Project
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateProject;