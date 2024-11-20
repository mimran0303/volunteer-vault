"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const VolunteerHistoryPage = () => {
    const [volunteerHistory, setVolunteerHistory] = useState([]);
    const [error, setError] = useState("");

    // Fetch volunteer history data
    const fetchVolunteerHistory = async () => {
        try {
            const response = await axios.get("http://localhost:8080/retrieveHistory", {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setVolunteerHistory(response.data); // Set the fetched data to state
        } catch (err) {
            console.error("Error fetching volunteer history:", err);
            setError("Error fetching volunteer history. Please try again later.");
        }
    };

    // Fetch the data on component mount
    useEffect(() => {
        fetchVolunteerHistory();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Volunteer History</h2>

            {error && <p className="text-red-500">{error}</p>}

            {volunteerHistory.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Volunteer Name</th>
                            <th className="py-2 px-4 border-b">Event Name</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Skills Required</th>
                            <th className="py-2 px-4 border-b">Urgency</th>
                            <th className="py-2 px-4 border-b">Event Date</th>
                            <th className="py-2 px-4 border-b">Participation Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteerHistory.map((entry) => (
                            <tr key={entry.history_id}>
                                <td className="py-2 px-4 border-b">{entry.volunteer_name}</td>
                                <td className="py-2 px-4 border-b">{entry.event_name}</td>
                                <td className="py-2 px-4 border-b">{entry.event_description}</td>
                                <td className="py-2 px-4 border-b">{entry.location}</td>
                                <td className="py-2 px-4 border-b">{entry.required_skills}</td>
                                <td className="py-2 px-4 border-b">{entry.urgency}</td>
                                <td className="py-2 px-4 border-b">{new Date(entry.event_date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{entry.participation_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No volunteer history available.</p>
            )}
        </div>
    );
};

export default VolunteerHistoryPage;
