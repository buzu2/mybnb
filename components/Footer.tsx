import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://i.postimg.cc/tgyPJvwH/logo-ajust.png" 
                alt="MyBnB Flats" 
                className="h-24 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Proporcionando experiências únicas de hospedagem com conforto, 
              estilo e a melhor localização para suas viagens.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#e8a633]">Navegação</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Quem Somos</Link></li>
              <li><Link to="/apartments" className="hover:text-white transition">Apartamentos</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Acesso Administrativo</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#e8a633]">Contato</h4>
            <p className="text-gray-400 mb-2 flex items-center gap-2">
              <Mail size={18} className="text-[#d65066]" />
              reservas@mybnbflats.imb.br
            </p>
            <p className="text-gray-400 mb-4 flex items-center gap-2">
              <Phone size={18} className="text-[#d65066]" />
              +55 (87) 99176-5540
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/mybnbflats/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-400 hover:text-[#d65066] transition"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 MyBnB Flats. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;