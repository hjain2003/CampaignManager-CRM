import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CampaignH.css';
import SideNav from '../SideNav/SideNav';
import Campaign from '../Campaign/Campaign';

const CampaignH = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Most Recent');

  useEffect(() => {
    fetchCampaignHistory();
  }, []);

  const fetchCampaignHistory = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      const parsedData = storedUserData ? JSON.parse(storedUserData) : null;
      const token = parsedData?.googleIdToken;

      if (token) {
        const response = await axios.get('https://campaign-backend-beta.vercel.app/campaign/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allCampaigns = response.data.campaigns.map(campaign => ({
          ...campaign,
          audienceSize: campaign.targetAudience.length,
          filters: JSON.stringify(campaign.filtersUsed),
          successRate: calculateSuccessRate(campaign), 
        }));

        setCampaigns(allCampaigns);
        applyFilter('Most Recent', allCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaign history', error);
    }
  };

  const calculateSuccessRate = (campaign) => {
    if (campaign.status !== 'Completed' || !campaign.commLogs) return null;
    const { msgsSentCount, msgsFailedCount } = campaign.commLogs;
    const totalMessages = msgsSentCount + msgsFailedCount;
    return totalMessages > 0 ? ((msgsSentCount / totalMessages) * 100).toFixed(2) : 0;
  };

  const applyFilter = (filter, campaignsData = campaigns) => {
    let sortedCampaigns;

    switch (filter) {
      case 'Most Recent':
        sortedCampaigns = [...campaignsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      case 'Oldest':
        sortedCampaigns = [...campaignsData].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      case 'Active':
        sortedCampaigns = campaignsData.filter(campaign => campaign.status === 'Active');
        break;

      case 'Completed':
        sortedCampaigns = campaignsData.filter(campaign => campaign.status === 'Completed');
        break;

      case 'Success Rate':
        sortedCampaigns = [...campaignsData]
          .filter(campaign => campaign.status === 'Completed' && campaign.successRate !== null) 
          .sort((a, b) => b.successRate - a.successRate);
        break;

      default:
        sortedCampaigns = campaignsData;
        break;
    }

    if (filter === 'Most Recent') {
      sortedCampaigns.reverse();
    }

    setFilteredCampaigns(sortedCampaigns);
    setActiveFilter(filter);
  };



  return (
    <>
      <div className="full_screen_container">
        <SideNav />
        <div className="dashboard_content" id="campaign_specific">
          <h2>Campaign History</h2>
          <br />
          <div className="history_filters">
            {['Most Recent', 'Oldest', 'Active', 'Completed', 'Success Rate'].map((filter) => (
              <span
                key={filter}
                className={activeFilter === filter ? 'active_filter' : ''}
                onClick={() => applyFilter(filter)}
              >
                {filter}
              </span>
            ))}
          </div>
          <br />
          <div className="campaign_cards_holder">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign, index) => (
                <Campaign
                  key={index}
                  campaignId={campaign._id}
                  name={campaign.name}
                  date={campaign.createdDate}
                  description={campaign.description}
                  status={campaign.status}
                  msg={campaign.msgTemplate}
                  filters={campaign.filters}
                  audienceSize={campaign.audienceSize}
                />
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignH;
