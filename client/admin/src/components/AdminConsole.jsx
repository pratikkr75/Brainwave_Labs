import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

function AdminConsole() {
  const [currentView, setCurrentView] = useState('createProject'); // Control which view is displayed
  const [projectCode, setProjectCode] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectAdmin, setProjectAdmin] = useState({ name: "Admin Name", email: "admin@example.com" });
  const [projectInvestigators, setProjectInvestigators] = useState([]);
  const [allInvestigators, setAllInvestigators] = useState([]); // Stores fetched investigators
  const [searchText, setSearchText] = useState(""); // Stores the search input
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectDuration, setProjectDuration] = useState(0); // Duration as number
  const [projectTrack, setProjectTrack] = useState("");
  const [projectBankDetails, setProjectBankDetails] = useState({ accountNumber: "", IFSC_Code: "" }); // Bank details now include IFSC
  const [projectBudget, setProjectBudget] = useState(0);

  // Fetch investigators from backend based on projectCode and searchText
  async function handleSearchInvestigators() {
    if (searchText) {
      try {
        const response = await axios.get('http://localhost:8000/api/findInvestigator/', {
          params: { searchText: searchText },
        });
        setAllInvestigators(response.data); // Set the fetched investigators
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    } else {
      alert("Please enter Search Text to search investigators.");
    }
  }

  // Add selected investigator to projectInvestigators list and remove from matching investigators
  function handleAddInvestigator(investigator) {
    if (!projectInvestigators.some(inv => inv.email === investigator.email)) {
      const newInvestigator = { name: investigator.firstname + " " + investigator.lastname, email: investigator.email };
      setProjectInvestigators([...projectInvestigators, newInvestigator]);
      setAllInvestigators(allInvestigators.filter(inv => inv.email !== investigator.email));
    }
  }

  // Remove selected investigator from projectInvestigators list
  function handleRemoveInvestigator(investigator) {
    setProjectInvestigators(projectInvestigators.filter(inv => inv.email !== investigator.email));
    setAllInvestigators([...allInvestigators, investigator]);
  }

  // Handle project creation form submission
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
    console.log(projectData);
    try {
      const res = await axios.post('http://localhost:8000/api/admin/creatproject', projectData);
      console.log(res);
      alert(res.data.message);
    } catch (error) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        backendErrors.forEach((err) => {
          console.log(err);
          alert(err.message);
        });
      } else {
        alert(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  // Views
  const CreateProjectView = () => (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Create Project</Typography>
      <Box component="form" onSubmit={handleCreateProject}>
        <TextField
          fullWidth
          margin="normal"
          label="Project Code"
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
        <Typography variant="subtitle1">Project Admin:</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Admin Name"
          value={projectAdmin.name}
          readOnly
        />
        <TextField
          fullWidth
          margin="normal"
          label="Admin Email"
          value={projectAdmin.email}
          readOnly
        />
        <TextField
          fullWidth
          margin="normal"
          label="Search Investigator by Email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearchInvestigators}>Search</Button>

        {allInvestigators.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Matching Investigators:</Typography>
            <List>
              {allInvestigators.map((investigator, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${investigator.name} (${investigator.email})`} />
                  <Button variant="outlined" onClick={() => handleAddInvestigator(investigator)}>Add</Button>
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
                <Button variant="outlined" onClick={() => handleRemoveInvestigator(investigator)}>Remove</Button>
              </ListItem>
            ))
          ) : (
            <Typography>No investigators added yet</Typography>
          )}
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Project Start Date"
          type="date"
          value={projectStartDate}
          onChange={(e) => setProjectStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Project End Date"
          type="date"
          value={projectEndDate}
          onChange={(e) => setProjectEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Project Duration (in months)"
          type="number"
          value={projectDuration}
          onChange={(e) => setProjectDuration(Number(e.target.value))}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Project Track"
          value={projectTrack}
          onChange={(e) => setProjectTrack(e.target.value)}
        />
        <Typography variant="h6">Project Bank Details:</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Bank Account Number"
          value={projectBankDetails.accountNumber}
          onChange={(e) => setProjectBankDetails({ ...projectBankDetails, accountNumber: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="IFSC Code"
          value={projectBankDetails.IFSC_Code}
          onChange={(e) => setProjectBankDetails({ ...projectBankDetails, IFSC_Code: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Project Budget"
          type="number"
          value={projectBudget}
          onChange={(e) => setProjectBudget(Number(e.target.value))}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create Project</Button>
      </Box>
    </Paper>
  );

  const MyProjectsView = () => <h2>My Projects</h2>;
  const ProfileView = () => <h2>Profile</h2>;

  return (
    <Container component="main" maxWidth="md" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Admin Console</Typography>
        <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
          <List>
            <ListItem button onClick={() => setCurrentView('createProject')}>
              <ListItemText primary="Create Project" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => setCurrentView('myProjects')}>
              <ListItemText primary="My Projects" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => setCurrentView('profile')}>
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Paper>

        {/* Render the selected view */}
        {currentView === 'createProject' && <CreateProjectView />}
        {currentView === 'myProjects' && <MyProjectsView />}
        {currentView === 'profile' && <ProfileView />}
      </Box>
    </Container>
  );
}

export default AdminConsole;
