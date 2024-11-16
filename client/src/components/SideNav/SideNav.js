import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideNav.css';
import xenologo from '../../xenologo.png';
import { AiOutlineHome } from 'react-icons/ai';
import { FiList } from 'react-icons/fi';
import { MdAddCircleOutline } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';

const SideNav = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('Dashboard');
  const location = useLocation();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    // console.log(userData.profilePic);
  }, []);

  // Determine active link based on current path
  useEffect(() => {
    const pathToLink = {
      '/dashboard': 'Dashboard',
      '/campaignHistory': 'Campaign History',
      '/createCampaign': 'Create Campaign',
      '/profile': 'Profile',
    };
    setActiveLink(pathToLink[location.pathname] || 'Dashboard');
  }, [location.pathname]);

  const handleNavClick = (link, path) => {
    setActiveLink(link);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className='nav_container'>
      {/* Company logo */}
      <div className="logo_section">
        <img src={xenologo} alt="Company Logo" className="company_logo" /> &nbsp; CRM
      </div>
      <hr />

      {/* Navigation Links */}
      <div className="nav_links">
        <p 
          className={`nav_link ${activeLink === 'Dashboard' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Dashboard', '/dashboard')}
        >
          <AiOutlineHome className="nav_icon" /> Dashboard
        </p>
        <p 
          className={`nav_link ${activeLink === 'Campaign History' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Campaign History', '/campaignHistory')}
        >
          <FiList className="nav_icon" /> Campaign History
        </p>
        <p 
          className={`nav_link ${activeLink === 'Create Campaign' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Create Campaign', '/createCampaign')}
        >
          <MdAddCircleOutline className="nav_icon" /> Create Campaign
        </p>
        <p 
          className={`nav_link ${activeLink === 'Profile' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Profile', '/profile')}
        >
          <FaUserAlt className="nav_icon" /> Profile
        </p>
      </div>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      {/* User Profile Section */}
      {userData && (
        <div className="user_info">
          <img src={userData.profilePic} alt="Profile" className="profile_pic" />
          <div className="user_details">
            <p className="user_name">{userData.username}</p>
            <p className="user_email">{userData.email}</p>
          </div>
        </div>
      )}
      <button id="logout" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SideNav;
