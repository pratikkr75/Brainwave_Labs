import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectProfile from './ProjectProfile';
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

  //update button
  const handleUpdateClick =async (projectCode)=>{
         navigate(`/api/admin/project/${projectCode}`);
  }

  return (
    <div>
      <h2>My Projects</h2>
      <div>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by Project Code"
        />
      </div>

      <div>
        {currentProjects.length ? (
          currentProjects.map((project) => (
            <div key={project.projectCode}>
              <h3>{project.projectTitle}</h3>
              <p>Code: {project.projectCode}</p>
              <p>Duration: {project.projectDuration} months</p>
              <p>Budget: Rs {project.projectBudget}</p>
              <button onClick={() => handleUpdateClick(project.projectCode)}>Update</button> {/* Update Button */}
              {/* Add more project details as needed */}
            </div>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </div>

      {/* Pagination */}
      <div>
        {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyProjectsView;
