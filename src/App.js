import './App.css';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Navigation from './Components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <div className='main'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
