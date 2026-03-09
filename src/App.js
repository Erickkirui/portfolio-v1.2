import './App.css';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import AboutMe from './Pages/AboutMe';
import ChatApp from './Components/Terminalchat/ChatApp';

function App() {
  return (
    <Router>
      <Navigation />
      <div className='main'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/se-chat" element={<ChatApp />} />
        </Routes>
      </div>
       <section id="contact-section">
          <Footer />
       </section>
      
    </Router>
  );
}

export default App;
