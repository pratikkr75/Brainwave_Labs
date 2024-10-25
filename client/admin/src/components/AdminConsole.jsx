import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <form onSubmit={handleCreateProject}>
        <div>
          <label>Project Code:</label>
          <input type="text" value={projectCode} placeholder="Enter project code here" onChange={(e) => setProjectCode(e.target.value)} />
        </div>
        <div>
          <label>Project Title:</label>
          <input type="text" value={projectTitle} placeholder="Enter project title here" onChange={(e) => setProjectTitle(e.target.value)} />
        </div>
        <div>
          <label>Project Admin (Name and Email):</label>
          <input type="text" value={projectAdmin.name} readOnly />
          <input type="email" value={projectAdmin.email} readOnly />
        </div>
        <div>
          <label>Search Investigator by Email:</label>
          <input type="text" value={searchText} placeholder="Enter investigator's email" onChange={(e) => setSearchText(e.target.value)} />
          <button type="button" onClick={handleSearchInvestigators}>Search</button>
        </div>

        {allInvestigators.length > 0 && (
          <div>
            <h3>Matching Investigators:</h3>
            {allInvestigators.map((investigator, index) => (
              <div key={index}>
                <span>{investigator.name} ({investigator.email})</span>
                <button type="button" onClick={() => handleAddInvestigator(investigator)}>Add</button>
              </div>
            ))}
          </div>
        )}

        <div>
          <h4>Selected Investigators:</h4>
          {projectInvestigators.length > 0 ? (
            projectInvestigators.map((investigator, index) => (
              <div key={index}>
                <p>{investigator.name} ({investigator.email})</p>
                <button type="button" onClick={() => handleRemoveInvestigator(investigator)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No investigators added yet</p>
          )}
        </div>

        <div>
          <label>Project Start Date:</label>
          <input type="date" value={projectStartDate} onChange={(e) => setProjectStartDate(e.target.value)} />
        </div>
        <div>
          <label>Project End Date:</label>
          <input type="date" value={projectEndDate} onChange={(e) => setProjectEndDate(e.target.value)} />
        </div>
        <div>
          <label>Project Duration (in months):</label>
          <input type="number" value={projectDuration} placeholder="Enter project duration" onChange={(e) => setProjectDuration(Number(e.target.value))} />
        </div>
        <div>
          <label>Project Track:</label>
          <input type="text" value={projectTrack} placeholder="Enter project track" onChange={(e) => setProjectTrack(e.target.value)} />
        </div>
        <div>
          <label>Project Bank Details:</label>
          <input type="text" value={projectBankDetails.accountNumber} placeholder="Enter bank account number" onChange={(e) => setProjectBankDetails({ ...projectBankDetails, accountNumber: e.target.value })} />
          <input type="text" value={projectBankDetails.IFSC_Code} placeholder="Enter IFSC code" onChange={(e) => setProjectBankDetails({ ...projectBankDetails, IFSC_Code: e.target.value })} />
        </div>
        <div>
          <label>Project Budget:</label>
          <input type="number" value={projectBudget} placeholder="Enter project budget" onChange={(e) => setProjectBudget(Number(e.target.value))} />
        </div>

        <button type="submit">Create Project</button>
      </form>
    </div>
  );

  const MyProjectsView = () => <h2>My Projects</h2>;
  const ProfileView = () => <h2>Profile</h2>;

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <h3>Admin Console</h3>
        <ul>
          <li onClick={() => setCurrentView('createProject')}>Create Project</li>
          <li onClick={() => setCurrentView('myProjects')}>My Projects</li>
          <li onClick={() => setCurrentView('profile')}>Profile</li>
        </ul>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        {currentView === 'createProject' && <CreateProjectView />}
        {currentView === 'myProjects' && <MyProjectsView />}
        {currentView === 'profile' && <ProfileView />}
      </div>
    </div>
  );
}

export default AdminConsole;
