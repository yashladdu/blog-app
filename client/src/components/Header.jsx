import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import { UserContext } from '../userContext';

function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get("http://localhost:5000/profile", {withCredentials: true});
        const userInfo = result.data;
        if (userInfo) {
          setUserInfo(userInfo);
        } else {
          setUserInfo(null); // ✅ Fix: If no user data, reset state
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    }
    fetchUser();
  }, []);

  async function logout() {
    await axios.post("http://localhost:5000/logout", {}, {withCredentials: true});
    setUserInfo(null);
    <Navigate to={"/"} />
  }

  return (
    <header>
        <Link to="/" className="logo">MyBlog</Link>
        <nav className='btn-row'>
          {!userInfo ? (
            <>
              <Link to="/login" className='btn'>Login</Link>
              <Link to="/register" className='btn'>Register</Link>
            </> 
          ) : (
            <>
              <Link to="/create" className='btn'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Post</Link> 
              <a className='btn' onClick={logout}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout</a>
            </>
          )}
        </nav>
    </header>
  )
}

export default Header