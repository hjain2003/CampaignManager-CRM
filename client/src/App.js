import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import CampaignH from './components/CampaignHistory/CampaignH';
import CreateCampaign from './components/CreateCampaign/CreateCampaign';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/campaignHistory' element={<CampaignH/>}/>
      <Route path='/createCampaign' element={<CreateCampaign/>}/>
    </Routes>

    </>
  );
}

export default App;
