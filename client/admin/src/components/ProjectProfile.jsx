import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

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
} from '@mui/material';

function ProjectProfile() {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [projectAdmin, setProjectAdmin] = useState({ name: "Admin Name", email: "admin@example.com" });

  const [newInvestigator, setNewInvestigator] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

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
            navigate('/api/admin/login');
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          navigate('/api/admin/login');
        }
      } else {
        navigate('/api/admin/login');
      }
    };

    fetchAndDecodeToken();
  }, [navigate]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/admin/project/${projectCode}`);
        setProject(res.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectCode]);

  const handleAddInvestigator = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/admin/project/${projectCode}/investigator`, newInvestigator);
      setProject(prev => ({ ...prev, projectInvestigators: [...prev.projectInvestigators, res.data] }));
      setNewInvestigator({ name: '', email: '' }); // Reset form
    } catch (error) {
      console.error("Error adding investigator:", error);
    }
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

  const handleUpdateProjectDetails = async (updatedDetails) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/admin/project/${projectCode}`, updatedDetails);
      setProject(res.data);
    } catch (error) {
      console.error("Error updating project details:", error);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Project Title: {project.projectTitle}
        </Typography>
        <Typography variant="h6">Code: {project.projectCode}</Typography>
        <Typography variant="body1">Start Date: {new Date(project.projectStartDate).toLocaleDateString()}</Typography>
        <Typography variant="body1">End Date: {new Date(project.projectEndDate).toLocaleDateString()}</Typography>
        <Typography variant="body1">Admin: {project.projectAdmin.name} ({project.projectAdmin.email})</Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>Investigators:</Typography>
        <List>
          {project.projectInvestigators.map(inv => (
            <ListItem key={inv._id}>
              <ListItemText primary={`${inv.name} (${inv.email})`} />
              <Button variant="outlined" color="error" onClick={() => handleDeleteInvestigator(inv.name, inv.email)}>
                Delete
              </Button>
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" sx={{ mt: 2 }}>Project Details:</Typography>
        <Typography variant="body1">Completed: {project.projectCompledted ? "Yes" : "No"}</Typography>
        <Typography variant="body1">Budget: Rs {project.projectBudget}</Typography>
        <Typography variant="body1">Bank Details: Account Number: {project.projectBankDetails.accountNumber}, IFSC Code: {project.projectBankDetails.IFSC_Code}</Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>Track:</Typography>
        <Typography variant="body1">{project.projectTrack}</Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>Add Investigator:</Typography>
        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={newInvestigator.email}
            onChange={(e) => setNewInvestigator({ ...newInvestigator, email: e.target.value })}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <Button variant="contained" onClick={handleAddInvestigator}>
            Add Investigator
          </Button>
        </Box>

        <Typography variant="h5" sx={{ mt: 2 }}>Update Project Details:</Typography>
        <Button variant="contained" onClick={() => handleUpdateProjectDetails({ projectBudget: 200000 })}>
          Update Budget to Rs 200,000
        </Button>
      </Paper>
    </Container>
  );
}

export default ProjectProfile;
