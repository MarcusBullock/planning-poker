import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import SessionPage from './components/session/SessionPage';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/session/:code" element={<SessionPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
