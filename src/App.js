import './App.css';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import AboutMe from './Pages/AboutMe';

function App() {
  return (
    <Router>
      <Navigation />
      <div className='main'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-me" element={<AboutMe />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
