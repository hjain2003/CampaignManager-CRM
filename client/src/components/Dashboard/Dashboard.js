import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MdAddCircleOutline } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

import SideNav from "../SideNav/SideNav";
import Campaign from "../Campaign/Campaign";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedChart, setSelectedChart] = useState("customerCount");
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (userData && userData.googleIdToken && userData.profilePic) {
      fetchCustomerData();
      fetchCampaignHistory();
    }
  }, [userData, selectedChart]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/customer/all", {
        headers: {
          Authorization: `Bearer ${userData.googleIdToken}`,
        },
      });

      const data = response.data;
      processChartData(data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignHistory = async () => {
    try {
      if (!userData || !userData.googleIdToken) return;
      const response = await axios.get("http://localhost:5000/campaign/history", {
        headers: {
          Authorization: `Bearer ${userData.googleIdToken}`,
        },
      });

      const allCampaigns = response.data.campaigns;

      // Sort campaigns by creation date and get the three most recent
      const recentCampaigns = allCampaigns
        .slice()
        .reverse()
        .slice(0, 3)
        .map((campaign) => ({
          ...campaign,
          audienceSize: campaign.targetAudience.length,
          filters: JSON.stringify(campaign.filtersUsed),
        }));

      setCampaigns(recentCampaigns);
    } catch (error) {
      console.error("Error fetching campaign history", error);
    }
  };

  const processChartData = (data) => {
    const monthlyData = data.reduce((acc, customer) => {
      const month = new Date(customer.lastVisited).toLocaleString("default", { month: "short", year: "numeric" });

      if (!acc[month]) {
        acc[month] = { customerCount: 0, revenue: 0 };
      }

      acc[month].customerCount += 1;
      acc[month].revenue += customer.orderValueTillDate;

      return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
    const chartLabels = sortedMonths;
    const chartValues = sortedMonths.map(
      (month) => monthlyData[month][selectedChart === "customerCount" ? "customerCount" : "revenue"]
    );

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: selectedChart === "customerCount" ? "Customer Count by Month" : "Revenue by Month",
          data: chartValues,
          fill: false,
          backgroundColor: selectedChart === "customerCount" ? "rgb(117, 184, 243)" : "rgb(117, 184, 243)",
          borderColor: selectedChart === "customerCount" ? "rgb(75, 192, 192)" : "rgb(78, 142, 240)",
          tension: 0.1,
        },
      ],
    });
  };

  const navigateToCreateCampaign = () => {
    navigate("/createCampaign");
  };

  return (
    <div className="full_screen_container">
      <SideNav />
      <div className="dashboard_content">
        <div>
          <label className="select-chart-label">Select Chart: </label>
          <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
            <option value="customerCount">Customer Visits by Month</option>
            <option value="revenue">Customer Spend by Month</option>
          </select>
        </div>

        {loading ? (
          <p>Loading chart...</p>
        ) : (
          chartData && (
            <div className="chart-container">
              {selectedChart === "customerCount" ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Month",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Customer Count",
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Month",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Revenue",
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          )
        )}
        <br />
        <div className="recent-campaigns-header-section">
          <div className="recent-campaigns-heading">Recent Campaigns</div>
          <div className="create-campaign-shortcut" onClick={navigateToCreateCampaign}>
            <MdAddCircleOutline className="create-camp-icon-short" /> Create New Campaign
          </div>
        </div>
        <br />
        <div className="recent_campaign_container">
          {campaigns.length > 0 ? (
            campaigns.map((campaign, index) => (
              <Campaign
                key={index}
                campaignId={campaign._id}
                name={campaign.name}
                date={campaign.createdDate}
                description={campaign.description}
                status={campaign.status}
                msg={campaign.msgTemplate}
                filters={campaign.filters}
                audienceSize={campaign.targetAudience.length}
              />
            ))
          ) : (
            <p className="no-campaign-message">No campaigns created yet</p>
          )}
          {campaigns.length > 0 && (
            <span className="arrow-button" onClick={() => navigate("/campaignHistory")}>
              <MdKeyboardArrowRight className="arrow-icon" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
