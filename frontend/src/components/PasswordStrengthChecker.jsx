import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState('');
  const [strengthScore, setStrengthScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkStrength = async (pwd) => {
    if (pwd.length === 0) {
      setStrengthScore(0);
      setFeedback([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/password-strength`, { password: pwd });
      setStrengthScore(res.data.score);
      setFeedback(res.data.feedback);
    } catch (err) {
      console.error('Error checking password strength:', err);
      setStrengthScore(0);
      setFeedback(['Error checking strength.']);
      toast.error('Failed to check password strength.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedCheckStrengthRef = useRef(debounce(checkStrength, 500));

  useEffect(() => {
    debouncedCheckStrengthRef.current(password);
  }, [password]);

  const getStrengthColor = (score) => {
    if (score === 0) return 'text-gray-500';
    if (score <= 2) return 'text-red-500';
    if (score === 3) return 'text-yellow-500';
    if (score >= 4) return 'text-green-500';
    return 'text-gray-500';
  };

  const getStrengthText = (score) => {
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Moderate';
    if (score === 3) return 'Strong';
    if (score >= 4) return 'Very Strong';
    return 'Unknown';
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Password Strength Checker</h2>
      <div className="mb-4">
        <label htmlFor="passwordInput" className="block mb-2 text-sm font-medium text-gray-900">Enter Password</label>
        <input
          type="password"
          id="passwordInput"
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Type your password here..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {password.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-white shadow">
          <h3 className="text-xl font-bold mb-2">Strength:
            <span className={`${getStrengthColor(strengthScore)} ml-2`}>
              {getStrengthText(strengthScore)}
            </span>
          </h3>
          {loading && <p className="text-gray-500">Checking strength...</p>}
          {feedback.length > 0 && (
            <ul className="list-disc list-inside text-gray-700 mt-2">
              {feedback.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthChecker;