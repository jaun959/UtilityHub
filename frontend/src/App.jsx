import React, { useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import setAuthToken from './utils/setAuthToken';

// Import Auth components
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';

// Import Page Components
import HomePage from './pages/HomePage.jsx';
import ImageToolsPage from './pages/ImageToolsPage.jsx';
import PdfToolsPage from './pages/PdfToolsPage.jsx';
import TextToolsPage from './pages/TextToolsPage.jsx';
import WebToolsPage from './pages/WebToolsPage.jsx';

// A simple PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated, navigate]);

  return state.isAuthenticated ? children : null;
};

function App() {
  const { state, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== '') {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Logout user if token is expired
          setAuthToken(null);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        } else {
          setAuthToken(token);
          dispatch({ type: 'LOGIN', payload: { token, user: decoded.user } });
        }
      } catch (error) {
        // Handle invalid token (e.g., malformed JWT)
        console.error("Error decoding token:", error);
        setAuthToken(null);
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800"><Link to="/">Utility Hub</Link></h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/images" className="text-blue-600 hover:underline">Images</Link></li>
              <li><Link to="/pdfs" className="text-blue-600 hover:underline">PDFs</Link></li>
              <li><Link to="/text" className="text-blue-600 hover:underline">Text</Link></li>
              <li><Link to="/web" className="text-blue-600 hover:underline">Web</Link></li>
              {state.isAuthenticated ? (
                <li>
                  <button onClick={handleLogout} className="text-blue-600 hover:underline focus:outline-none">Logout</button>
                </li>
              ) : (
                <li><Link to="/login" className="text-blue-600 hover:underline">Login</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/images" element={<ImageToolsPage />} />
        <Route path="/pdfs" element={<PdfToolsPage />} />
        <Route path="/text" element={<TextToolsPage />} />
        <Route path="/web" element={<WebToolsPage />} />
        {/* Protected routes example */}
        <Route
          path="/protected-example"
          element={
            <PrivateRoute>
              <div>This is a protected page!</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;