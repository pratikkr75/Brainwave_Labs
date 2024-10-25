import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';

function MyProjectsView({ name, email }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5; // Adjust as needed
  const navigate = useNavigate();

  // Fetch all projects for the admin on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/getAllProjectsAdmin', {
          params: { name: name, email: email }
        });
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [name, email]);

  // Handle search input to filter projects by project code
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = projects.filter((project) =>
      project.projectCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Update button
  const handleUpdateClick = async (projectCode) => {
    navigate(`/api/admin/project/${projectCode}`);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>My Projects</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Search by Project Code"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
        />

        <List sx={{ mt: 2 }}>
          {currentProjects.length ? (
            currentProjects.map((project) => (
              <ListItem key={project.projectCode} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: '4px', padding: 2 }}>
                <ListItemText
                  primary={<Typography variant="h6">{project.projectTitle}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body1">Code: {project.projectCode}</Typography>
                      <Typography variant="body1">Duration: {project.projectDuration} months</Typography>
                      <Typography variant="body1">Budget: Rs {project.projectBudget}</Typography>
                    </>
                  }
                />
                <Button variant="contained" onClick={() => handleUpdateClick(project.projectCode)}>Update</Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1">No projects found</Typography>
          )}
        </List>

        {/* Pagination */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
            <Button
              key={i}
              variant="outlined"
              onClick={() => paginate(i + 1)}
              sx={{ mx: 0.5 }}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}

export default MyProjectsView;
