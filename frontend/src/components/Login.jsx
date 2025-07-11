import React, { useState } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardText,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { saveToken, saveUser } from '../utils/auth';
import api from '../utils/api';

const Login = ({setLoggedIn}) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = () => {
    if (!formData.username || !formData.password) {
      setError('Both fields are required.');
      return;
    }

    loginUser();
  };

  const loginUser = async () => {
    try {
      const res = await api.post('/api/auth/login', formData);
  //console.log(res?.data?.token)
      saveToken(res?.data?.token);
      saveUser(res?.data?.user);
      setLoggedIn(true);
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard style={{ maxWidth: '400px', width: '100%' }}>
        <MDBCardHeader className="text-center">
          <h4>Login</h4>
        </MDBCardHeader>
        <MDBCardBody>
          {error && (
            <MDBCardText className="text-danger mb-3">{error}</MDBCardText>
          )}

          <MDBInput
            label="Username"
            name="username"
            type="text"
            className="mb-4"
            value={formData.username}
            onChange={handleChange}
          />
          <MDBInput
            label="Password"
            name="password"
            type="password"
            className="mb-4"
            value={formData.password}
            onChange={handleChange}
          />
          <MDBBtn className="w-100" onClick={handleClick}>
            Login
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
