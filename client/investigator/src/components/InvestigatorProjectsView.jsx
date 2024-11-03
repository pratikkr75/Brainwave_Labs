import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyProjectsView = ({ name, email }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/investigator/getAllProjects?' + new URLSearchParams({
          name: name,
          email: email
        }));
        const data = await res.json();
        setProjects(data);
        setFilteredProjects(data);
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
    setCurrentPage(1); // Reset to first page on search
  };

  const handleViewClick = (projectCode) => {
    navigate(`/api/investigator/console/project/${projectCode}`);
  };

  const handleUploadFile = (projectCode) => {
    navigate(`/api/investigator/console/project/uploads/${projectCode}`);
  };

  const handleTask = (projectCode)=>{
    navigate(`/api/investigator/console/project/tasks/${projectCode}`);
  }

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Lexend Deca', sans-serif",
      backgroundColor: '#f8f9fa'
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      fontWeight: '500',
      color: '#2c3e50'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '2rem'
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      outline: 'none',
      fontFamily: "'Lexend Deca', sans-serif",
      transition: 'border-color 0.2s',
      backgroundColor: 'white'
    },
    projectCard: {
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }
    },
    projectTitle: {
      fontSize: '1.4rem',
      marginBottom: '1rem',
      fontWeight: '400',
      color: '#2c3e50'
    },
    projectDetail: {
      fontSize: '1.1rem',
      marginBottom: '0.7rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#4a5568'
    },
    label: {
      color: '#718096',
      fontWeight: '400'
    },
    value: {
      fontWeight: '400',
      color: '#2d3748'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem',
      justifyContent: 'flex-end'
    },
    button: {
      padding: '0.5rem 1.2rem',
      backgroundColor: '#2196f3',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontFamily: "'Lexend Deca', sans-serif",
      fontWeight: '400',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#1976d2'
      }
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '2rem'
    },
    pageButton: {
      padding: '0.5rem 1rem',
      border: '1px solid #e0e0e0',
      backgroundColor: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontFamily: "'Lexend Deca', sans-serif",
      fontSize: '0.9rem',
      transition: 'all 0.2s',
    },
    activePageButton: {
      backgroundColor: '#2196f3',
      color: 'white',
      border: '1px solid #2196f3'
    },
    noProjects: {
      textAlign: 'center',
      padding: '2rem',
      color: '#718096',
      fontSize: '1.1rem'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Projects</h1>
      
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by Project Code"
          value={searchText}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      <div>
        {currentProjects.length > 0 ? (
          currentProjects.map((project) => (
            <div key={project.projectCode} style={styles.projectCard}>
              <h2 style={styles.projectTitle}>{project.projectTitle}</h2>
              
              <div style={styles.projectDetail}>
                <span style={styles.label}>Code:</span>
                <span style={styles.value}>{project.projectCode}</span>
              </div>
              
              <div style={styles.projectDetail}>
                <span style={styles.label}>Duration:</span>
                <span style={styles.value}>{project.projectDuration} months</span>
              </div>
              
              <div style={styles.projectDetail}>
                <span style={styles.label}>Budget:</span>
                <span style={styles.value}>Rs {project.projectBudget}</span>
              </div>

              <div style={styles.buttonContainer}>
                <button 
                  onClick={() => handleViewClick(project.projectCode)} 
                  style={styles.button}
                >
                  UPDATE
                </button>
                <button 
                  onClick={() => handleUploadFile(project.projectCode)} 
                  style={styles.button}
                >
                  UPLOAD FILE
                </button>
                <button 
                  onClick={() => handleTask(project.projectCode)} 
                  style={styles.button}
                >
                  TASKS
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noProjects}>No projects found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                ...styles.pageButton,
                ...(currentPage === index + 1 ? styles.activePageButton : {})
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectsView;