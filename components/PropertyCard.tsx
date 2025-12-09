
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Wifi, Star } from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../contexts/PropertyContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { getPropertyAverageRating } = useProperties();
  const rating = getPropertyAverageRating(property.id);

  return (
    <Link to={`/apartments/${property.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider">
          R$ {property.price} / dia
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center text-[#d65066] text-sm font-medium">
            <MapPin size={16} className="mr-1" />
            {property.location}
          </div>
          {rating > 0 && (
             <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                <Star size={12} fill="#e8a633" className="text-[#e8a633]"/>
                {rating}
             </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#d65066] transition-colors line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
          {property.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-gray-500 text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users size={16} /> {property.capacity} Pessoas
            </span>
            {property.amenities.includes('wifi') && (
              <span className="flex items-center gap-1">
                <Wifi size={16} /> Wi-Fi
              </span>
            )}
          </div>
          <span className="text-[#e8a633] font-semibold group-hover:underline">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
