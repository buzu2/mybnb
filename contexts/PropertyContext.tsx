
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, Amenity, Review } from '../types';

interface PropertyContextType {
  properties: Property[];
  amenities: Amenity[];
  reviews: Review[];
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addAmenity: (amenity: Omit<Amenity, 'id'>) => void;
  deleteAmenity: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getPropertyReviews: (propertyId: string) => Review[];
  getPropertyAverageRating: (propertyId: string) => number;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const INITIAL_AMENITIES: Amenity[] = [
  { id: 'wifi', label: 'Wi-Fi de alta velocidade', icon: 'wifi' },
  { id: 'ac', label: 'Ar Condicionado Split', icon: 'wind' },
  { id: 'tv', label: 'Smart TV', icon: 'tv' },
  { id: 'kitchen_full', label: 'Cozinha equipada (geladeira, cooktop, micro-ondas, utensílios)', icon: 'coffee' },
  { id: 'parking_priv', label: 'Estacionamento gratuito e privativo', icon: 'car' },
  { id: 'pool', label: 'Piscina', icon: 'droplets' },
  { id: 'gym', label: 'Academia', icon: 'dumbbell' },
];

const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Loft Moderno no Centro',
    description: 'Um loft incrível com vista para a cidade. Design minimalista, cozinha completa e perto de tudo. Ideal para casais ou viajantes a negócios que buscam conforto e praticidade.',
    location: 'Centro, Petrolina',
    price: 250,
    capacity: 2,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    gallery: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=10', 'https://picsum.photos/800/600?random=11'],
    videoUrl: '',
    amenities: ['wifi', 'ac', 'kitchen_full', 'tv'],
    availableDates: [],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Flat Aconchegante Beira Rio',
    description: 'Relaxe com a vista do Rio São Francisco. Apartamento espaçoso, ideal para quem quer curtir a orla e os restaurantes próximos.',
    location: 'Orla, Petrolina',
    price: 300,
    capacity: 4,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    gallery: ['https://picsum.photos/800/600?random=2', 'https://picsum.photos/800/600?random=12'],
    videoUrl: '',
    amenities: ['wifi', 'pool', 'parking_priv', 'kitchen_full', 'ac'],
    availableDates: [],
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Apartamento Luxo Areia Branca',
    description: 'Sofisticação e elegância no bairro nobre. Acabamentos de alto padrão e segurança 24h.',
    location: 'Areia Branca, Petrolina',
    price: 550,
    capacity: 4,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    gallery: ['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=13'],
    videoUrl: '',
    amenities: ['wifi', 'ac', 'gym', 'parking_priv'],
    availableDates: [],
    isFeatured: true,
  },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', propertyId: '1', userName: 'Ana Souza', rating: 5, comment: 'Lugar incrível! Muito limpo e organizado.', date: '2023-10-15' },
  { id: 'r2', propertyId: '1', userName: 'Carlos Mendes', rating: 4, comment: 'Ótima localização, mas o check-in poderia ser mais cedo.', date: '2023-11-02' },
  { id: 'r3', propertyId: '2', userName: 'Fernanda Lima', rating: 5, comment: 'A vista é maravilhosa. Recomendo demais!', date: '2023-12-10' },
];

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('mybnb_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [amenities, setAmenities] = useState<Amenity[]>(() => {
    const saved = localStorage.getItem('mybnb_amenities');
    return saved ? JSON.parse(saved) : INITIAL_AMENITIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mybnb_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('mybnb_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('mybnb_amenities', JSON.stringify(amenities));
  }, [amenities]);

  useEffect(() => {
    localStorage.setItem('mybnb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addProperty = (newProp: Omit<Property, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setProperties(prev => [...prev, { ...newProp, id }]);
  };

  const updateProperty = (id: string, updatedProp: Partial<Property>) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updatedProp } : p)));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const addAmenity = (newAmenity: Omit<Amenity, 'id'>) => {
    const id = newAmenity.label.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15) + '_' + Math.floor(Math.random() * 1000);
    setAmenities(prev => [...prev, { ...newAmenity, id }]);
  };

  const deleteAmenity = (id: string) => {
    setAmenities(prev => prev.filter(a => a.id !== id));
  };

  // Review Logic
  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    setReviews(prev => [review, ...prev]);
  };

  const getPropertyReviews = (propertyId: string) => {
    return reviews.filter(r => r.propertyId === propertyId);
  };

  const getPropertyAverageRating = (propertyId: string) => {
    const propReviews = getPropertyReviews(propertyId);
    if (propReviews.length === 0) return 0;
    const sum = propReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return parseFloat((sum / propReviews.length).toFixed(1));
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      amenities,
      reviews,
      addProperty, 
      updateProperty, 
      deleteProperty,
      addAmenity,
      deleteAmenity,
      addReview,
      getPropertyReviews,
      getPropertyAverageRating
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
