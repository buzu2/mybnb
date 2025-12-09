import React from 'react';
import { useProperties } from '../contexts/PropertyContext';
import PropertyCard from '../components/PropertyCard';

const Apartments: React.FC = () => {
  const { properties } = useProperties();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Nossos Apartamentos</h1>
          <p className="text-gray-500 mt-2">Encontre o lugar perfeito para sua próxima estadia.</p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Nenhum apartamento encontrado no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Apartments;
