// src/components/PatientDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PatientDetails.css'; // Importing the CSS file

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: ''
    });

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:7070/patients/${id}`);
                setPatient(response.data.patient);
                setMedicalHistory(response.data.medicalHistory);
                setFormData({
                    name: response.data.patient.name,
                    email: response.data.patient.email,
                    age: response.data.patient.age
                });
                setLoading(false);
            } catch (err) {
                setError('Error fetching patient details');
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:7070/patients/${id}`, formData);
            setPatient(response.data.patient);
            setShowUpdateForm(false);
        } catch (err) {
            console.error('Error updating patient details:', err);
            // Handle error
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:7070/patients/${id}`);
            navigate('/patient-list');
        } catch (err) {
            console.error('Error deleting patient:', err);
            // Handle error
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="patient-details-container">
            <h1>Patient Details</h1>
            {patient && (
                <div className="patient-info">
                    <p><strong>ID:</strong> {patient.id}</p>
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <button onClick={() => setShowUpdateForm(true)}>Update Details</button>
                    <button onClick={handleDelete}>Delete Patient</button>
                </div>
            )}
            {showUpdateForm && (
                <div className="update-form">
                    <h2>Update Patient Details</h2>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Age:</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            )}
            <h2>Medical History</h2>
            {medicalHistory ? (
                <ul className="medical-history-list">
                        {Object.entries(medicalHistory).map(([key, value]) => (
                            (typeof value === 'boolean' && value) && <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</li>
                        ))}
                </ul>
            ) : (
                <p>No medical history available.</p>
            )}
        </div>
    );
};

export default PatientDetails;
