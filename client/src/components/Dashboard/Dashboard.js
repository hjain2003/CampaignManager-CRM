import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SideNav from '../SideNav/SideNav';
import './Dashboard.css';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedChart, setSelectedChart] = useState('customerCount');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (userData && userData.googleIdToken) {
      fetchCustomerData();
    }
  }, [userData, selectedChart]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/customer/all', {
        headers: {
          Authorization: `Bearer ${userData.googleIdToken}`
        }
      });

      const data = response.data;
      processChartData(data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    const monthlyData = data.reduce((acc, customer) => {
      const month = new Date(customer.lastVisited).toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!acc[month]) {
        acc[month] = { customerCount: 0, revenue: 0 };
      }

      acc[month].customerCount += 1;
      acc[month].revenue += customer.orderValueTillDate;

      return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
    const chartLabels = sortedMonths;
    const chartValues = sortedMonths.map((month) => monthlyData[month][selectedChart === 'customerCount' ? 'customerCount' : 'revenue']);

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: selectedChart === 'customerCount' ? 'Customer Count by Month' : 'Revenue by Month',
          data: chartValues,
          fill: false,
          backgroundColor: selectedChart === 'customerCount' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
          borderColor: selectedChart === 'customerCount' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    });
  };

  return (
    <div className='full_screen_container'>
      <SideNav />
      <div className='dashboard_content'>
        <div>
          <label>Select Chart: </label>
          <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
            <option value="customerCount">Customer Count by Month</option>
            <option value="revenue">Revenue by Month</option>
          </select>
        </div>

        {loading ? (
          <p>Loading chart...</p>
        ) : (
          chartData && (
            <div className="chart-container">
              {selectedChart === 'customerCount' ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Month'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Customer Count'
                        }
                      }
                    }
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
                          text: 'Month'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Revenue'
                        }
                      }
                    }
                  }}
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
