import React, { useEffect, useState } from "react";
import "./Profile.css";
import SideNav from "../SideNav/SideNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LuGlobe } from "react-icons/lu";
import { CgDanger } from "react-icons/cg";
import { IoIosChatboxes } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa6";

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
      <div className="first-row">
        <div className="image-and-name">
          <div className="profile_img_holder">
              {imageLoaded ? (
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  onError={handleImageError} // Handle error loading image
                />
              ) : (
                <div className="placeholder_img">
                  {" "}
                  {/* Placeholder for missing image */}
                  <p>Image not available</p>
                </div>
              )}
            </div>
        </div>
        <div className="name-and-info">
          <div className="user-name-info">{userData.username}</div>
        <div className="main-stats">
        <div className="employee-id empInfoCard">
            <div className="empInfoLabel">Employee ID</div>
            <div className="empInfoNumber">E947509</div>
          </div>

          <div className="camp-created empInfoCard">
            <div className="empInfoLabel">Campaigns Created</div>
            <div className="empInfoNumber">{campaignCount}</div>
          </div>

          <div className="role empInfoCard">
            <div className="empInfoLabel">Employee Role</div>
            <div className="empInfoNumber">SDE 1</div>
          </div>
        </div>
        </div>
      </div>

      <div className="second-row">
        <div className="social-media">
              <div className="personal-info-heading-link">IMPORTANT LINKS</div>
              <div>
                <hr/>

                <div className="imp-link-link">
                  <div className="logo-link">
                    <LuGlobe /> 
                  </div>
                  <div className="link-label-link">
                    Company Website
                  </div>
                </div>
                <hr/>

                <div className="imp-link-link">
                  <div className="logo-link">
                  <CgDanger />
                  </div>
                  <div className="link-label-link">
                    Raise Complaints
                  </div>
                </div>
                <hr/>

                <div className="imp-link-link">
                  <div className="logo-link">
                  <IoIosChatboxes />
                  </div>
                  <div className="link-label-link">
                    HR Query Ticket
                  </div>
                </div>
                <hr/>
                <div className="imp-link-link">
                
                  <div className="logo-link">
                  <a href="https://www.linkedin.com/in/harsh--jain">
                    <FaLinkedin />
                  </a>
                  </div>
                  <a className="link-label-link" href="https://www.linkedin.com/in/harsh--jain">
                    Your Linkedin
                  </a>
                </div>
                
              </div>
        </div>
        
        <div className="personal-details">
        <div className="personal-info-heading-perso">Personal Details</div>
        <div>
                <hr/>

                <div className="imp-link-link">
                  <div className="info-label">
                    Phone: 
                  </div>
                  <div className="link-label-link">
                    +91 9958959486
                  </div>
                </div>
                <hr/>


                <div className="imp-link-link">
                  <div className="info-label">
                  Email:
                  </div>
                  <div className="link-label-link">
                  {userData.email}
                  </div>
                </div>
                <hr/>
                <div className="imp-link-link">
                  <div className="info-label">
                  Date of Joining:
                  </div>
                  <div className="link-label-link">
                    Jan 20th 2024
                  </div>
                </div>
                <hr/>
                <div className="imp-link-link">
                  <div className="info-label">
                  Manager:
                  </div>
                  <div className="link-label-link">
                    Nilesh Kanthed
                  </div>
                </div>
                <hr/>
                <div className="imp-link-link">
                  <div className="info-label">
                  Region:
                  </div>
                  <div className="link-label-link">
                    APAC-India
                  </div>
                </div>
                
              </div>
        </div>
      </div>
      
        
        

        <div className="profile-details">
          
        </div>

        {/* <div className="profile_info_wrapper">
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
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
