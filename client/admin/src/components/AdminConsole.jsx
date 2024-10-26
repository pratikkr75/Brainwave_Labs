import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import MyProjectsView from '../components/MyProjectsView';

function AdminConsole() {
  const [currentView, setCurrentView] = useState('createProject');
  const [projectCode, setProjectCode] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectAdmin, setProjectAdmin] = useState({ name: "Admin Name", email: "admin@example.com" });
  const [projectInvestigators, setProjectInvestigators] = useState([]);
  const [allInvestigators, setAllInvestigators] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectDuration, setProjectDuration] = useState(0);
  const [projectTrack, setProjectTrack] = useState("");
  const [projectBankDetails, setProjectBankDetails] = useState({ accountNumber: "", IFSC_Code: "" });
  const [projectBudget, setProjectBudget] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.adminId) {
            setProjectAdmin({
              name: `${decodedToken.firstname} ${decodedToken.lastname}`,
              email: decodedToken.email,
            });
          } else {
            navigate('/api/admin/login'); // Redirect if unauthorized
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          navigate('/api/admin/login'); // Redirect if decoding fails
        }
      } else {
        navigate('/api/admin/login'); // Redirect if no token
      }
    };

    fetchAndDecodeToken();
  }, [navigate]);

  async function handleSearchInvestigators() {
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
  }

  function handleAddInvestigator(investigator) {
    if (!projectInvestigators.some(inv => inv.email === investigator.email)) {
      const newInvestigator = { name: investigator.firstname + " " + investigator.lastname, email: investigator.email };
      setProjectInvestigators([...projectInvestigators, newInvestigator]);
      setAllInvestigators(allInvestigators.filter(inv => inv.email !== investigator.email));
    }
  }

  function handleRemoveInvestigator(investigator) {
    setProjectInvestigators(projectInvestigators.filter(inv => inv.email !== investigator.email));
    setAllInvestigators([...allInvestigators, investigator]);
  }

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
      const res = await axios.post('http://localhost:8000/api/admin/createProject', projectData);
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

  const CreateProjectView = () => (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <form onSubmit={handleCreateProject}>
        <Typography variant="h5" gutterBottom>Create New Project</Typography>
        
        <TextField
          fullWidth
          margin="normal"
          label="Project Code"
          value={projectCode}
          placeholder="Enter project code here"
          onChange={(e) => setProjectCode(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Project Title"
          value={projectTitle}
          placeholder="Enter project title here"
          onChange={(e) => setProjectTitle(e.target.value)}
        />
        <Typography variant="subtitle1" gutterBottom>Project Admin (Name and Email)</Typography>
        <TextField fullWidth margin="normal" value={projectAdmin.name} readOnly />
        <TextField fullWidth margin="normal" value={projectAdmin.email} readOnly />
        
        <TextField
          fullWidth
          margin="normal"
          label="Search Investigator by Email"
          value={searchText}
          placeholder="Enter investigator's email"
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" onClick={handleSearchInvestigators}>Search</Button>
              </InputAdornment>
            ),
          }}
        />

        {allInvestigators.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Matching Investigators:</Typography>
            <List>
              {allInvestigators.map((investigator, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${investigator.firstname} ${investigator.lastname} (${investigator.email})`} />
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
        <Typography variant="h6" gutterBottom>Project Bank Details:</Typography>
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
      </form>
    </Paper>
  );

  const ProfileView = () => <Paper><h2>Profile</h2></Paper>;

  return (
    <Container component="main" maxWidth="md" sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4f6f8',
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
        {currentView === 'myProjects' && <MyProjectsView email={projectAdmin.email} name={projectAdmin.name} />}
        {currentView === 'profile' && <ProfileView />}
      </Box>
    </Container>
  );
}

export default AdminConsole;
