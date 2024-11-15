import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './Campaign.css';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Campaign = ({ name, date, description, status, filters, audienceSize, msg, campaignId }) => {
  const navigate = useNavigate();
  const [openviewbox, setviewbox] = useState(false);
  const [sendingMails, setSendingMails] = useState(false);  // Track sending state
  const [error, setError] = useState(null); // Track errors if any
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
    } else {
      navigate('/login');
    }
  }, [navigate]);



  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const statusStyle = {
    backgroundColor: status === 'Active' ? 'green' : status === 'Completed' ? 'grey' : 'transparent',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    textAlign: 'center',
    width: 'fit-content',
    margin: '0 auto',
  };

  // Handler to toggle popup view box
  const handleOpenPopup = () => {
    setviewbox(true);
  };

  const handleClosePopup = () => {
    setviewbox(false);
  };

  const renderFilters = (filters) => {
    try {
      const filterObj = JSON.parse(filters); // Convert filters string back to object
      return (
        <ul>
          {Object.keys(filterObj).map((key) => (
            <li key={key} style={{ color: 'rgb(0, 52, 175)' }}>
              <strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> {filterObj[key]}
            </li>
          ))}
        </ul>
      );
    } catch (e) {
      console.error('Error parsing filters', e);
      return <p>Invalid filter data</p>;
    }
  };

  // Send emails handler
  const handleSendEmails = async () => {
    console.log(campaignId);
   

    if (!userData.googleIdToken) {
      setError('User is not logged in.');
      return;
    }

    try {
      setSendingMails(true);
      setError(null); // Reset error state

      const response = await axios.post(`http://localhost:5000/campaign/${campaignId}/send-emails`, {}, {
        headers: {
          Authorization: `Bearer ${userData.googleIdToken}`,
        },
      });

      if (response.status === 200) {
        alert('Emails sent successfully!');
      }
    } catch (error) {
      setError('Failed to send emails. Please try again.');
      console.error('Error sending emails', error);
    } finally {
      setSendingMails(false);
    }
  };

  return (
    <>
      {openviewbox && (
        <div className='view_box'>
          <button className="close_button" onClick={handleClosePopup}><RxCross2 /></button>
          <h2>Campaign Details</h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Date Created:</strong> {formattedDate}</p>
          <p><strong>Filters Used:</strong> <div className='filters-used-part'>{renderFilters(filters)}</div></p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Audience Segment Size:</strong> {audienceSize} customers</p>
          <p><strong>Message Template:</strong> {msg}</p>
          
          {/* Show sending button */}
          <button
            className="send_button"
            onClick={handleSendEmails}
            disabled={sendingMails}  // Disable button if mails are being sent
          >
            {sendingMails ? 'Sending...' : 'Send Mails'}
          </button>
          
          {/* Error handling */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      <div className='campaign_card'>
        <button className="popup_icon_button" onClick={handleOpenPopup} aria-label="Open details">
          <FaExternalLinkAlt />
        </button>

        <h3>{name}</h3><br />
        <p><strong>Date:</strong> {formattedDate}</p><br />
        <p><strong>Description:</strong> {description}</p><br />
        <p style={statusStyle} className='card_status'><strong>Status:</strong> {status}</p>
      </div>
    </>
  );
};

export default Campaign;
