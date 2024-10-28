import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PendingRequests({ adminEmail }) {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]); // State to hold filtered requests
    const [statusFilter, setStatusFilter] = useState("Pending"); // State to track the current filter

    // Fetch pending requests for the specified admin email
    useEffect(() => {
        async function displayRequests() {
            try {
                const res = await axios.get('http://localhost:8000/api/admin/pendingRequests', {
                    params: { adminEmail: adminEmail }
                });
                setRequests(res.data);
                setFilteredRequests(res.data.filter(request => request.status === statusFilter)); // Initial filter
                console.log(res.data);
            } catch (err) {
                console.error("Error fetching requests:", err);
            }
        }

        displayRequests();
    }, [adminEmail]); // Add adminEmail to the dependency array

    // Update filtered requests when status filter changes
    useEffect(() => {
        setFilteredRequests(requests.filter(request => request.status === statusFilter));
    }, [statusFilter, requests]);

    // Function to handle accepting a request
    const handleAccept = async (projectCode, fieldToUpdate, newValue, requestId) => {
        try {
            await axios.put(`http://localhost:8000/api/admin/acceptRequest`, {
                projectCode, fieldToUpdate, newValue, requestId
            });
            alert("Change Updated");
            // Refresh the list after action
            setRequests(prevRequests => prevRequests.map(request => 
                request._id === requestId ? { ...request, status: "Accepted" } : request
            ));
        } catch (err) {
            console.error("Error accepting request:", err);
        }
    };

    // Function to handle rejecting a request
    const handleReject = async (requestId) => {
        try {
            await axios.post('http://localhost:8000/api/admin/rejectRequest', {
                requestId
            });
            // Refresh the list after action
            setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } catch (err) {
            console.error("Error rejecting request:", err);
        }
    };

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
                        <p><strong>Message:</strong> {request.message}</p>
                        <p><strong>Requested By:</strong> {request.investigatorEmail}</p>
                        <p><strong>Status:</strong> {request.status}</p>
                        {request.status === "Pending" && (
                            <>
                                <button onClick={() => handleAccept(request.projectCode, request.fieldToUpdate, request.newValue, request._id)}>
                                    Accept
                                </button>
                                <button onClick={() => handleReject(request._id)}>Reject</button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default PendingRequests;
