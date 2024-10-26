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
  InputAdornment,
  Grid,
} from '@mui/material';

function CreateProject({name,email}) {
  
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
          params: { searchText: searchText },
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
    setProjectInvestigators(prev => prev.filter(inv => inv.email !== investigator.email));
    setAllInvestigators(prev => [...prev, investigator]);
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
    try {
      const res = await axios.post('http://localhost:8000/api/admin/creatproject', projectData);
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
    <Container maxWidth="md">
      <Box sx={{ overflow: 'hidden'}}>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Create New Project</Typography>
          <form onSubmit={handleCreateProject}>
            <TextField
              fullWidth
              margin="normal"
              label="Project Code"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              placeholder="Enter project code here"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter project title here"
            />
            <Typography variant="subtitle1" gutterBottom>Project Admin (Name and Email)</Typography>
            <TextField fullWidth margin="normal" value={projectAdmin.name} disabled />
            <TextField fullWidth margin="normal" value={projectAdmin.email} disabled />
            <Typography variant="subtitle1" gutterBottom>Search new Investigators here</Typography>
            <Box component="form" onSubmit={handleSearchInvestigators} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                margin="normal"
                label="Search Investigator by Email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Enter investigator's email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="contained" onClick={handleSearchInvestigators} type="button">Search</Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {allInvestigators.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Matching Investigators:</Typography>
                <List>
                  {allInvestigators.map((investigator, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${investigator.firstname} ${investigator.lastname} (${investigator.email})`} />
                      <Button variant="outlined" onClick={() => handleAddInvestigator(investigator)} type="button">Add</Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Selected Investigators:</Typography>
              {projectInvestigators.length > 0 ? (
                projectInvestigators.map((investigator, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${investigator.name} (${investigator.email})`} />
                    <Button variant="outlined" onClick={() => handleRemoveInvestigator(investigator)} type="button">Remove</Button>
                  </ListItem>
                ))
              ) : (
                <Typography>No investigators added yet</Typography>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Project Start Date"
                  type="date"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Project End Date"
                  type="date"
                  value={projectEndDate}
                  onChange={(e) => setProjectEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Project Duration (in months)"
                  type="number"
                  value={projectDuration}
                  onChange={(e) => setProjectDuration(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Project Track"
                  value={projectTrack}
                  onChange={(e) => setProjectTrack(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Bank Account Number"
                  value={projectBankDetails.accountNumber}
                  onChange={(e) => setProjectBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="IFSC Code"
                  value={projectBankDetails.IFSC_Code}
                  onChange={(e) => setProjectBankDetails(prev => ({ ...prev, IFSC_Code: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Project Budget"
                  type="number"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(Number(e.target.value))}
                  placeholder="Enter the project budget"
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" color="primary" type="submit" fullWidth>Create Project</Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateProject;
