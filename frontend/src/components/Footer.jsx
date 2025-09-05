import React from 'react';
import { FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Utility Hub. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="https://github.com/gaureshpai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-1">
            <FaGithub className="h-5 w-5" />
            <span>GitHub</span>
          </a>
          <a href="https://gauresh.is-a.dev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-1">
            <FaGlobe className="h-5 w-5" />
            <span>Website</span>
          </a>
          <a href="https://linkedin.com/in/gaureshpai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-1">
            <FaLinkedin className="h-5 w-5" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;