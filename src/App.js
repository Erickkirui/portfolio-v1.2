import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import AboutMe from './Pages/AboutMe';
import ChatApp from './Components/Terminalchat/ChatApp';

function Layout() {
  const location = useLocation();

  // Hide layout for both /se-chat and /se-chat/:roomCode
  const hideLayout = location.pathname.startsWith("/se-chat");

  return (
    <>
      {!hideLayout && <Navigation />}

      <div className='main'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/se-chat" element={<ChatApp />} />
          <Route path="/se-chat/:roomCode" element={<ChatApp />} />
        </Routes>
      </div>

      {!hideLayout && (
        <section id="contact-section">
          <Footer />
        </section>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;