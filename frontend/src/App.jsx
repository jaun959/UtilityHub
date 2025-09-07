import { useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import setAuthToken from './utils/setAuthToken';
import { ToastContainer } from 'react-toastify';
import Base64TextConverter from './components/Base64TextConverter.jsx';
import ImageFlipper from './components/ImageFlipper.jsx';
import ImageToBase64Converter from './components/ImageToBase64Converter.jsx';
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import ImageToolsPage from './pages/ImageToolsPage.jsx';
import PdfToolsPage from './pages/PdfToolsPage.jsx';
import TextToolsPage from './pages/TextToolsPage.jsx';
import WebToolsPage from './pages/WebToolsPage.jsx';
import Footer from './components/Footer.jsx';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== '') {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          setAuthToken(null);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        } else {
          setAuthToken(token);
          dispatch({ type: 'LOGIN', payload: { token, user: decoded.user } });
        }
      } catch (error) {
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
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Utility Hub Logo" className="h-10 mr-2" />
            <span className="text-2xl font-bold text-gray-800 hidden md:block">Utility Hub</span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li><Link to="/images" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L20 16m-2-6a2 2 0 100-4 2 2 0 000 4z" /></svg>Images</Link></li>
              <li><Link to="/pdfs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDFs</Link></li>
              <li><Link to="/text" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Text</Link></li>
              <li><Link to="/web" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Web</Link></li>
              {state.isAuthenticated ? (
                <li>
                  <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Logout</button>
                </li>
              ) : (
                <li><Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Login</Link></li>
              )}
            </ul>
          </nav>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg pb-4 py-2">
            <ul className="flex flex-col items-center space-y-2">
              <li className="w-full"><Link to="/images" className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200 items-center justify-center" onClick={() => setMobileMenuOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L20 16m-2-6a2 2 0 100-4 2 2 0 000 4z" /></svg>Images</Link></li>
              <li className="w-full"><Link to="/pdfs" className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200 items-center justify-center" onClick={() => setMobileMenuOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDFs</Link></li>
              <li className="w-full"><Link to="/text" className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200 items-center justify-center" onClick={() => setMobileMenuOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Text</Link></li>
              <li className="w-full"><Link to="/web" className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200 items-center justify-center" onClick={() => setMobileMenuOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Web</Link></li>
              {state.isAuthenticated ? (
                <li className="w-full">
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Logout</button>
                </li>
              ) : (
                <li className="w-full"><Link to="/login" className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center justify-center" onClick={() => setMobileMenuOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Login</Link></li>
              )}
            </ul>
          </div>
        )}
      </header>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/images" element={<ImageToolsPage />} />
          <Route path="/pdfs" element={<PdfToolsPage />} />
          <Route path="/text" element={<TextToolsPage />} />
          <Route path="/web" element={<WebToolsPage />} />

          <Route path="/text/base64-converter" element={<Base64TextConverter />} />
          <Route path="/images/flipper" element={<ImageFlipper />} />
          <Route path="/images/image-to-base64" element={<ImageToBase64Converter />} />

          <Route
            path="/protected-example"
            element={
              <PrivateRoute>
                <div>This is a protected page!</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;