import React, { useEffect, useState } from "react";
import "./Profile.css";
import SideNav from "../SideNav/SideNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignCount, setCampaignCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(true); // Track if the image is loaded

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userData && userData.googleIdToken) {
      fetchCampaignHistory();
    }
  }, [userData]);

  const fetchCampaignHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/campaign/history", {
        headers: {
          Authorization: `Bearer ${userData.googleIdToken}`,
        },
      });
      setCampaigns(response.data.campaigns);
      setCampaignCount(response.data.campaigns.length);
    } catch (error) {
      console.error("Error fetching campaign history:", error);
    }
  };

  const handleImageError = () => {
    setImageLoaded(false); // Set to false if the image fails to load
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full_screen_container">
      <SideNav />
      <div className="dashboard_content" id="fontchanger">
        <div className="profile_img_holder">
          {imageLoaded ? (
            <img 
              src={userData.profilePic} 
              alt="Profile" 
              onError={handleImageError} // Handle error loading image
            />
          ) : (
            <div className="placeholder_img"> {/* Placeholder for missing image */}
              <p>Image not available</p>
            </div>
          )}
        </div>
        <br />
        <h2 align="center">{userData.username}</h2>
        <br/>
        <hr /><br/>
        <div className="profile_info_wrapper">
          <div className="profile_row">
            <div className="profile_col">
              <label><b>Role</b></label>
              SDE 1 
            </div>
            <div className="profile_col">
              <label><b>Email</b></label>
              {userData.email}
            </div>
            <div className="profile_col">
              <label><b>CRM_ID</b></label>
              EMP-652910
            </div>
            <div className="profile_col">
              <label><b>Campaigns Created</b></label>
              {campaignCount}
            </div>
          </div>

          <br/><br/>
          <div className="profile_row">
            <div className="profile_col">
              <label><b>Hours</b></label>
              17
            </div>
            <div className="profile_col">
              <label><b>Phone No</b></label>
              +91 9958959486
            </div>
            <div className="profile_col">
              <label><b>DOB</b></label>
              June 13th 2003
            </div>
            <div className="profile_col">
              <label><b>Linkedin Profile</b></label>
              <a href="https://www.linkedin.com/in/harsh--jain">Harsh--Jain</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
