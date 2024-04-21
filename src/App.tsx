import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import BrigadeList from './Components/Brigade/BrigadeList';
import HighChart from './Components/HighChart/HighChart';
import { Menu } from 'antd';
import './styles/Menu.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationMenu />
        <Routes>
          <Route path="/" element={<Navigate to="/brigades" replace />} />
          <Route path="/brigades" element={<BrigadeList />} />
          <Route path="/highChart" element={<HighChart />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


function NavigationMenu() {
  const navigate = useNavigate(); // Hook для программной навигации

  const handleClick = (e: { key: string; }) => {
    const key = e.key;
    if (key === 'brigades') {
      navigate('/brigades');
    } else if (key === 'highChart') {
      navigate('/highChart');
    }
  };

  return (
    <Menu
      className='menu-navigation'
      mode="horizontal"
      onClick={handleClick}
      items={[
        {
          label: 'Бригады',
          key: 'brigades'
        },
        {
          label: 'График',
          key: 'highChart'
        }
      ]}
    />
  );
}

export default App;
