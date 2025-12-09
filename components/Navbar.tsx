import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Brand colors
  const primaryColor = '#d65066';

  const isActive = (path: string) => location.pathname === path ? `text-[${primaryColor}] font-bold` : 'text-gray-600 hover:text-gray-900';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-28">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="https://i.postimg.cc/tgyPJvwH/logo-ajust.png" 
                alt="MyBnB Flats" 
                className="h-24 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/about" className={isActive('/about')}>Quem Somos</Link>
            <Link to="/apartments" className={isActive('/apartments')}>Apartamentos</Link>
            <Link to="/admin" className={isActive('/admin')}>Admin</Link>
            <a 
              href="https://wa.me/5587991765540" 
              target="_blank" 
              rel="noreferrer"
              className={`flex items-center gap-2 bg-[${primaryColor}] text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity`}
            >
              <MessageCircle size={18} />
              <span>Fale Conosco</span>
            </a>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
            <Link to="/about" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Quem Somos</Link>
            <Link to="/apartments" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Apartamentos</Link>
            <Link to="/admin" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Painel Admin</Link>
            <a 
              href="https://wa.me/5587991765540"
              target="_blank" 
              rel="noreferrer"
              className={`block w-full text-center mt-4 px-5 py-3 rounded-md font-medium text-white bg-[${primaryColor}]`}
            >
              Fale Conosco no WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;