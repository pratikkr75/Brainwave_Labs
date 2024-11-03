import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Stack,
  InputAdornment,
  Box,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function MyProjectsView({ name, email }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = isMobile ? 3 : 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/getAllProjectsAdmin', {
          params: { name, email },
        });
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [name, email]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = projects.filter((project) =>
      project.projectCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateClick = (projectCode) => {
    navigate(`project/${projectCode}`);
  };

  const handleUploadFile = (projectCode) => {
    navigate(`project/uploads/${projectCode}`);
  };
  
  const handleAssignTask = (projectCode)=>{
    navigate(`project/assign/tasks/${projectCode}`);
  };

  const ProjectCard = ({ project }) => (
    <Card
      elevation={2}
      sx={{
        width: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom noWrap
                  fontFamily={"'Lexend Deca', sans-serif"}
>
          {project.projectTitle}
        </Typography>
        <Stack spacing={isMobile ? 0.5 : 1}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary"fontSize={"0.9rem"}
                      fontFamily={"'Lexend Deca', sans-serif"}
>
              <strong>Code:</strong>
            </Typography>
            <Typography variant="body2" color="text.primary" fontSize={"1rem"}
                      fontFamily={"'Lexend Deca', sans-serif"}
>
              {project.projectCode}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary"fontSize={"0.9rem"}
                      fontFamily={"'Lexend Deca', sans-serif"}
>
              <strong>Duration:</strong>
            </Typography>
            <Typography variant="body2" color="text.primary" fontSize={"1rem"}
                      fontFamily={"'Lexend Deca', sans-serif"}
>
              {project.projectDuration} months
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" 
            color="text.secondary" fontSize={"0.9rem"} fontFamily={"'Lexend Deca', sans-serif"}
            >
              <strong>Budget:</strong>
            </Typography>
            <Typography variant="body2" color="text.primary" fontSize={"1rem"}
                      fontFamily={"'Lexend Deca', sans-serif"}
>
              Rs {project.projectBudget.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ padding: 2, justifyContent: isMobile ? 'center' : 'flex-end' }}>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={1}
          width={isMobile ? "100%" : "auto"}
          fontFamily={"'Lexend Deca', sans-serif"}

        >
          <Button
            variant="contained"
            size="small"
            sx={{ 
              fontFamily: "'Lexend Deca', sans-serif",
              textTransform: 'none' 
            }}

            onClick={() => handleUpdateClick(project.projectCode)}
            fullWidth={isMobile}
          >
            Update
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleUploadFile(project.projectCode)}
            fullWidth={isMobile}
            sx={{ 
              fontFamily: "'Lexend Deca', sans-serif",
              textTransform: 'none' 
            }}

          >
            Upload File
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleAssignTask(project.projectCode)}
            fullWidth={isMobile}
            sx={{ 
              fontFamily: "'Lexend Deca', sans-serif",
              textTransform: 'none' 
            }}

          >
            Tasks
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper
        elevation={3}
        fontFamily={"'Lexend Deca', sans-serif"}

        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
          fontFamily={"'Lexend Deca', sans-serif"}
        >
          My Projects
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Search by Project Code"
          variant="outlined"
          fontFamily={"'Lexend Deca', sans-serif"}
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {currentProjects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary"
                      fontFamily={"'Lexend Deca', sans-serif"}
>
              No projects found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {currentProjects.map((project) => (
              <Grid item xs={12} key={project.projectCode}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            fontFamily:"'Lexend Deca', sans-serif"

          }}
        >
          {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "contained" : "outlined"}
              onClick={() => paginate(i + 1)}
              size={isMobile ? "small" : "medium"}
              fontFamily={"'Lexend Deca', sans-serif"}

              sx={{
                minWidth: { xs: '36px', sm: '40px' },
                height: { xs: '36px', sm: '40px' },
              }}
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
