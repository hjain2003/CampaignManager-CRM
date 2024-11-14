import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import SideNav from "../SideNav/SideNav";
import axios from "axios";
import "./CreateCampaign.css";
import { useNavigate } from "react-router-dom";

const STEP = 100;
const MIN = 0;
const MAX = 15000;

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    minOrderValue: 500,
    maxOrderValue: 4000,
    lastVisitedBefore: "",
    lastVisitedAfter: "",
    minVisitCount: ""
  });
  const [orderRange, setOrderRange] = useState([500, 4000]);
  const [customers, setCustomers] = useState([]);
  const [showCustomers, setShowCustomers] = useState(false);
  const [createBox, setCreateBox] = useState(false);

  // State for the input fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [msgTemplate, setMsgTemplate] = useState("");

  useEffect(() => {
    // Sync the filter min and max values with orderRange
    setFilters((prevFilters) => ({
      ...prevFilters,
      minOrderValue: orderRange[0],
      maxOrderValue: orderRange[1]
    }));
  }, [orderRange]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

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
      fetchCustomers();
    }
  }, [userData]);

  const fetchCustomers = async () => {
    const params = new URLSearchParams(filters).toString();
    try {
      const response = await axios.get(
        `http://localhost:5000/customer/filter?${params}`,
        {
          headers: {
            Authorization: `Bearer ${userData.googleIdToken}`
          }
        }
      );
      setCustomers(response.data);
      setShowCustomers(true);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const saveFilters = () => {
    fetchCustomers();
  };

  const openCreateBox = () => {
    setCreateBox(true);
  };

  const closeCreateBox = () => {
    setCreateBox(false);
  };


  const handleCreateCampaign = async () => {
    const targetAudience = customers.map((customer) => customer._id);
    console.log(customers);
    try {
      const response = await axios.post(
        "http://localhost:5000/campaign/create",
        {
          name,
          description,
          msgTemplate,
          targetAudience,
          filtersUsed: filters,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.googleIdToken}`
          }
        }
      );
    //   setApiResponse("Campaign created successfully!");
      closeCreateBox();
    } catch (error) {
    //   setApiResponse("Error creating campaign. Please try again.");
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div className="full_screen_container" id="createspecific">
      <SideNav />
      <div className="dashboard_content">
        {createBox && (
          <div className="create_box">
            <button className="close_button" id="create_close" onClick={closeCreateBox}>
              Close
            </button>
            <br />
            <h3>CREATE CAMPAIGN</h3>
            <br />
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter suitable name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />

            <label>Description</label>
            <textarea
              rows={8}
              placeholder="Enter suitable description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />

            <label>Filters Used</label>
            <div>
              {Object.entries(filters).map(([key, value]) => (
                value && value !== "" && (
                  <div key={key}>
                    <strong>{key.replace(/([A-Z])/g, ' $1')}</strong>: {value}
                  </div>
                )
              ))}
            </div>
            <br />

            <label>Email Message Template</label>
            <textarea
              rows={8}
              placeholder="Enter suitable Email template"
              value={msgTemplate}
              onChange={(e) => setMsgTemplate(e.target.value)}
            />
            <br />

            <button onClick={handleCreateCampaign}>Create Campaign</button>
          </div>
        )}

        <h2>Create Campaign</h2>
        <br />
        <div className="filter_section">
          <h3>Set Filters</h3>

          {/* Order Range Slider */}
          <div className="filter_item">
            <label>Order Value Range:</label>
            <Range
              values={orderRange}
              step={STEP}
              min={MIN}
              max={MAX}
              onChange={(values) => setOrderRange(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    height: "6px",
                    width: "100%",
                    background: getTrackBackground({
                      values: orderRange,
                      colors: ["#ccc", "#007bff", "#ccc"],
                      min: MIN,
                      max: MAX
                    }),
                    borderRadius: "4px"
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props, index }) => (
                <div
                  {...props}
                  style={{
                    height: "16px",
                    width: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#007bff",
                    outline: "none"
                  }}
                >
                  <div className="slider_value">{orderRange[index]}</div>
                </div>
              )}
            />
            <div className="slider_marks">
              {[MIN, 2000, 4000, 6000, 8000, 10000, 12000, 14000, MAX].map(
                (value) => (
                  <span key={value} className="slider_mark">
                    {value}
                  </span>
                )
              )}
            </div>
            <p>
              Range: {orderRange[0]} - {orderRange[1]}
            </p>
          </div>

          <div className="filter_item">
            <label>Last Visited Before:</label>
            <input
              type="date"
              name="lastVisitedBefore"
              value={filters.lastVisitedBefore}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter_item">
            <label>Last Visited After:</label>
            <input
              type="date"
              name="lastVisitedAfter"
              value={filters.lastVisitedAfter}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter_item">
            <label>Minimum Visit Count:</label>
            <input
              type="number"
              name="minVisitCount"
              min="0"
              value={filters.minVisitCount}
              onChange={handleFilterChange}
            />
          </div>

          <button onClick={saveFilters}>Save Filters</button> &nbsp;&nbsp;&nbsp;
          <button onClick={openCreateBox}>Create Campaign</button>
        </div>

        {showCustomers && (
          <div className="customer_list">
            <h3>Customers Matching Filters ({customers.length})</h3>
            {customers.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Order Value</th>
                    <th>Last Visit</th>
                    <th>Total Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.orderValueTillDate}</td>
                      <td>{new Date(customer.lastVisited).toLocaleDateString()}</td>
                      <td>{customer.totalVisitCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No customers match the selected filters.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
