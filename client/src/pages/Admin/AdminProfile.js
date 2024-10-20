import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [employeeId, setEmployeeId] = useState();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const empId = decodedToken.userId;
          setEmployeeId(empId)
          const employeeResponse = await axios.get(`http://localhost:8000/api/employee?empId=${empId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setProfileData(employeeResponse.data.user);
        } catch (err) {
          setError(err.response ? err.response.data.message : err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No token found');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      await axios.put(`http://localhost:8000/api/change-password/${employeeId}`, {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowModal(false);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setError(null);
      toast.success('Password changed successfully!');
    } catch (error) {
      console.log(error)
      const errorMessage = error.response && error.response.data ? error.response.data.error : "An error occurred. Please try again.";
    toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: '#6C63FF' }}>Profile</h2>
      {profileData ? (
        <div className="p-4 shadow-sm">
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Employee ID:</strong> {profileData.employeeID}</p>
          <p><strong>Designation:</strong> {profileData.designation}</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Change Password
          </Button>
        </div>
      ) : (
        <div>No profile data available</div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter current password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                className='mb-3'
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className='mb-3'
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className='mb-3'
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminProfile;
