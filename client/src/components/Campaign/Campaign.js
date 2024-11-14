import React, { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './Campaign.css';

const Campaign = ({ name, date, description, status, filters, audienceSize, msg }) => {
  const [openviewbox, setviewbox] = useState(false);
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
            <li key={key}>
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

  return (
    <>
      {openviewbox && (
        <div className='view_box'>
          <button className="close_button" onClick={handleClosePopup}>Close</button>
          <h2>Campaign Details</h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Date Created:</strong> {formattedDate}</p>
          <p><strong>Filters Used:</strong> {renderFilters(filters)}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Audience Segment Size:</strong> {audienceSize} customers</p>
          <p><strong>Message Template:</strong> {msg}</p>
          <button className="send_button" onClick={() => alert("Mails sent!")}>Send Mails</button>
        </div>
      )}

      <div className='campaign_card'>
        <button className="popup_icon_button" onClick={handleOpenPopup} aria-label="Open details">
          <FaExternalLinkAlt />
        </button>
        
        <h3>{name}</h3><br />
        <p><strong>Date:</strong> {formattedDate}</p><br />
        <p><strong>Description:</strong> {description}</p><br />
        <p style={statusStyle}><strong>Status:</strong> {status}</p>
      </div>
    </>
  );
};

export default Campaign;
