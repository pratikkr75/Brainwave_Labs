import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InvestigatorRequest( investigatorEmail ) {
    console.log(investigatorEmail);
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]); // State to hold filtered requests
    const [statusFilter, setStatusFilter] = useState("Pending"); // State to track the current filter

    // Fetch pending requests for the specified admin email
    useEffect(() => {
        async function displayRequests() {
            try {
                const res = await axios.get('http://localhost:8000/api/investigator/pendingRequests', {
                    params: { investigatorEmail:investigatorEmail }
                });
                setRequests(res.data);
                console.log(requests);
                setFilteredRequests(res.data.filter(request => request.status === statusFilter)); // Initial filter
                console.log(res.data);
            } catch (err) {
                console.error("Error fetching requests:", err);
            }
        }

        displayRequests();
    }, [investigatorEmail]); 

    // Update filtered requests when status filter changes
    useEffect(() => {
        setFilteredRequests(requests.filter(request => request.status === statusFilter));
    }, [statusFilter, requests]);

    return (
        <div>
            <h2>Requests</h2>
            <div>
                <button onClick={() => setStatusFilter("Pending")}>Pending</button>
                <button onClick={() => setStatusFilter("Accepted")}>Accepted</button>
                <button onClick={() => setStatusFilter("Declined")}>Declined</button>
            </div>
            {filteredRequests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                filteredRequests.map(request => (
                    <div key={request._id} className="request-item">
                        <p><strong>Project Code:</strong> {request.projectCode}</p>
                        <p><strong>Field to Update:</strong> {request.fieldToUpdate}</p>
                        <p><strong>New Value:</strong> {request.newValue}</p>
                        <p><strong>Your Message:</strong> {request.message}</p>
                        <p><strong>Project Admin:</strong> {request.adminEmail}</p>
                        <p><strong>Status:</strong> {request.status}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default InvestigatorRequest;
