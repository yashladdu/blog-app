import axios from 'axios';
import React,{useContext, useState} from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../userContext';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(event) {
        event.preventDefault();
        setError("");
        try {
            const result = await axios.post("https://blog-app-backend-wiia.onrender.com/login", {email, password}, {withCredentials: true});
            if (result.data) {              
                setUserInfo(result.data);
                setRedirect(true);       
            } else {
                setError("Wrong Credentials")
            }   
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error); // Display backend error message
            } else {
                setError("Server error. Please check your connection.");
            }
        }
    }

    if (redirect) {
        return <Navigate to={"/"} /> 
    }

  return (
    <form className='login' onSubmit={login}>
        <h1>Login</h1>
        <div className="form-container">
            {error && <p style={{ color: "red", textAlign: "center"}}>{error}</p>}
            <input type="text" placeholder='Email' value={email} onChange={event =>setEmail( event.target.value)}/>
            <input type="password" placeholder='Password' value={password} onChange={event => setPassword(event.target.value)}/>
            <button>Login</button>
        </div>
        
    </form>
  )
}

export default Login