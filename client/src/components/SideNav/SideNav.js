import React, { useEffect, useState } from 'react';
import './SideNav.css';
import xenologo from '../../xenologo.png';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai'; // Dashboard icon
import { FiList } from 'react-icons/fi'; // Campaign History icon
import { MdAddCircleOutline } from 'react-icons/md'; // Create Campaign icon
import { FaUserAlt } from 'react-icons/fa'; // Profile icon

const SideNav = () => {
  const [userData, setUserData] = useState(null);
  const [activeLink, setActiveLink] = useState('Dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleNavClick = (link) => {
    setActiveLink(link);
    // You can navigate to different routes if needed
    switch (link) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Campaign History':
        navigate('/dashboard');
        break;
      case 'Create Campaign':
        navigate('/dashboard');
        break;
      case 'Profile':
        navigate('/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleLogout=()=>{
    localStorage.clear();
    navigate('/login');
  }
  return (
    <div className='nav_container'>
      {/* Company logo */}
      <div className="logo_section">
        <img src={xenologo} alt="Company Logo" className="company_logo"/> &nbsp; CRM
      </div>
      <hr/>

      {/* Navigation Links */}
      <div className="nav_links">
        <p 
          className={`nav_link ${activeLink === 'Dashboard' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Dashboard')}
        >
          <AiOutlineHome className="nav_icon" /> Dashboard
        </p>
        <p 
          className={`nav_link ${activeLink === 'Campaign History' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Campaign History')}
        >
          <FiList className="nav_icon" /> Campaign History
        </p>
        <p 
          className={`nav_link ${activeLink === 'Create Campaign' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Create Campaign')}
        >
          <MdAddCircleOutline className="nav_icon" /> Create Campaign
        </p>
        <p 
          className={`nav_link ${activeLink === 'Profile' ? 'active' : ''}`} 
          onClick={() => handleNavClick('Profile')}
        >
          <FaUserAlt className="nav_icon" /> Profile
        </p>

      </div>

      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      {/* User Profile Section */}
      {userData && (
        <div className="user_info">
          <img src={userData.profilePic || 'default-profile.png'} alt="Profile" className="profile_pic" />
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
