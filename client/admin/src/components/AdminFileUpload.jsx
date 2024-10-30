import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
function AdminFileUpload() {
    const [projectAdmin, setProjectAdmin] = useState({ name: "", email: "" });
    const [reportName,setReportName] = useState("");
    const [file, setFile] = useState(null);

    const {projectCode} = useParams();
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

  const handleSubmit = async(e)=>{
       e.prevenDefault();
       try{
            const FileData = {
                file,
                uploadedBy:projectAdmin.email,
                projectCode,
                role:"Admin"
            }
            const res = axios.post('http://localhost:8000/api/admin/projectUpload', FileData)
       }catch{

       }
  }
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
        />
        <br />


        <input
        type="text"
          value={reportName} 
          onChange={(e) => setReportName(e.target.value)}
          placeholder='Enter File Name here'
        />
        <br/>


        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default AdminFileUpload