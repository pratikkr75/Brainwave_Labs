import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProjectProfile() {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [newInvestigator, setNewInvestigator] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

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

  const handleDeleteInvestigator = async (name,email) => {
    try {
        const deleteData = {
            projectCode,
            name:name,
            email:email
        };
        console.log(deleteData);
      const res = await axios.post(`http://localhost:8000/api/admin/project/deleteInvestigator`,deleteData);
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
    return <p>Loading project details...</p>;
  }

  return (
    <div>
      <h2>Project Title: {project.projectTitle}</h2>
      <p>Code: {project.projectCode}</p>
      <p>Start Date: {new Date(project.projectStartDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(project.projectEndDate).toLocaleDateString()}</p>
      <p>Admin: {project.projectAdmin.name} ({project.projectAdmin.email})</p>
      <h3>Investigators:</h3>
      <ul>
        {project.projectInvestigators.map(inv => (
          <li key={inv._id}>
            {inv.name} ({inv.email}) 
            <button onClick={() => handleDeleteInvestigator(inv.name,inv.email)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Project Details:</h3>
      <p>Completed: {project.projectCompledted ? "Yes" : "No"}</p>
      <p>Budget: Rs {project.projectBudget}</p>
      <p>Bank Details: Account Number: {project.projectBankDetails.accountNumber}, IFSC Code: {project.projectBankDetails.IFSC_Code}</p>
      
      <h3>Track:</h3>
      <p>{project.projectTrack}</p>

      <h3>Add Investigator:</h3>
     
      <input
        type="email"
        placeholder="Search by email"
        value={newInvestigator.email}
        onChange={(e) => setNewInvestigator({ ...newInvestigator, email: e.target.value })}
      />
      <button onClick={handleAddInvestigator}>Add Investigator</button>

      <h3>Update Project Details:</h3>
      <button onClick={() => handleUpdateProjectDetails({ projectBudget: 200000 })}>
        Update Budget to Rs 200,000
      </button>
    </div>
  );
}

export default ProjectProfile;
