import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import SessionPageWrapper from './components/session/SessionPageWrapper';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/session/:code" element={<SessionPageWrapper />} />
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
};

export default App;
