import React, { useState } from 'react'
import axios from "axios";
import { Navigate } from 'react-router-dom';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setFirstEmail] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState(false);

    async function register(event) {
        event.preventDefault();
        setError("");
        try {
            await axios.post("https://blog-app-backend-wiia.onrender.com/register", {firstName, lastName, email, password});
            alert("Registration successful.");
            setRedirect(true); 
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error); // Display backend error message
            } else {
                setError("Server error. Please check your connection.");
            }
        }   
    }

    if (redirect) {
        return <Navigate to={"/login"} /> 
    }
  return (
    <form className='register' onSubmit={register}>
        <h1>Register</h1>
        {error && <p style={{ color: "red", textAlign: "center"}}>{error}</p>}
        <div className="form-container">
            <input 
                type="text" 
                placeholder='First Name' 
                value={firstName} 
                onChange={event => setFirstName(event.target.value)}
            />
            <input 
                type="text" 
                placeholder='Last Name' 
                value={lastName} 
                onChange={event => setFirstEmail(event.target.value)}
            />
            <input 
                type="text" 
                placeholder='Email' 
                value={email} 
                onChange={event => setEmail(event.target.value)}
            />
            <input 
                type="text" 
                placeholder='Password'
                value={password} 
                onChange={event => setPassword(event.target.value)}
            />
            <button>Register</button>
        </div>
    </form>
  )
}

export default Register