import { Link } from 'react-router-dom';
import { FiHome, FiMessageSquare } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 text-white">
            <FiHome className="text-blue-500" size={24} />
            <span className="font-semibold text-lg">AI Agent Router</span>
          </Link>
          
          <Link 
            to="/chat" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            <FiMessageSquare color='white' />
            <span className="text-white">Chat</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 