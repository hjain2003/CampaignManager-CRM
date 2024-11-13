import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import './Dashboard.css';  // Make sure to add any styling for the dashboard content

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData)); 
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='full_screen_container'>
      <SideNav />
      <div className='dashboard_content'>
        {/* {userData ? (
          <>
            <h1>Welcome, {userData.username}</h1>
            <p>Email: {userData.email}</p>
            {userData.profilePic && <img src={userData.profilePic} alt="Profile" />}
          </>
        ) : (
          <p>Loading user data...</p>
        )} */}
      </div>
    </div>
  );
};

export default Dashboard;
