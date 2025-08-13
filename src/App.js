import React from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import About from './pages/About';
import Subdomains from './pages/Subdomains';

import { useState } from 'react';
import Attack from './pages/Attack';
import VulnCheck from './pages/VulnCheck';
import Targets from './pages/Targets';
import Results from './pages/Results';

function App() {
  const [route, setRoute] = useState('Overview');
  
  const renderPage = () => {
  switch(route) {
    case 'overview': return <Overview />;
    case 'attack': return <Attack />;
    case 'subdomains': return <Subdomains />;
    case 'vulncheck': return <VulnCheck />;
    case 'results': return <Results />;
    case 'targets': return <Targets />;
    default: return <Overview />;
  }
}

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} />
      <main className="main">
        {route === 'overview' && <Overview />}
        {route === 'about' && <About />}
        {route === 'attack' && <Attack />}
        {route === 'subdomains' && <Subdomains/>}
        {route === 'vulncheck' && <VulnCheck/>}
        {route === 'targets' && <Targets/>}
        {route === 'results' && <Results/>}

      </main>
    </div>
  );
}

export default App;
