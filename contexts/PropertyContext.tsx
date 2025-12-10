
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, Amenity, Review, SiteSettings } from '../types';
import { supabase } from '../supabaseClient';

// --- MOCK DATA FOR FALLBACK ---
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Flat Luxo Beira Rio',
    description: 'Apartamento com vista incrível para o Rio São Francisco. Decoração moderna, cozinha completa e todo conforto para sua estadia. Ideal para casais ou viagens de negócios.',
    location: 'Orla, Petrolina',
    price: 250,
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['wifi', 'ac', 'tv', 'kitchen', 'parking'],
    availableDates: [],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Studio Moderno Centro',
    description: 'Studio prático e aconchegante no coração da cidade. Perto de tudo, ideal para viajantes a negócios ou casais que buscam praticidade.',
    location: 'Centro, Petrolina',
    price: 180,
    capacity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['wifi', 'ac', 'tv', 'kitchen'],
    availableDates: [],
    isFeatured: true
  },
  {
    id: '3',
    title: 'Apartamento Família Garden',
    description: 'Espaço amplo com área externa privativa. Perfeito para famílias com crianças. Condomínio com segurança 24h e área de lazer.',
    location: 'Jardim Amazonas, Petrolina',
    price: 320,
    capacity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
       'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['wifi', 'ac', 'tv', 'kitchen', 'parking', 'pool'],
    availableDates: [],
    isFeatured: false
  }
];

const MOCK_AMENITIES: Amenity[] = [
  { id: 'wifi', label: 'Wi-Fi Rápido', icon: 'wifi' },
  { id: 'ac', label: 'Ar Condicionado', icon: 'wind' },
  { id: 'tv', label: 'Smart TV', icon: 'tv' },
  { id: 'kitchen', label: 'Cozinha Equipada', icon: 'coffee' },
  { id: 'parking', label: 'Estacionamento', icon: 'car' },
  { id: 'pool', label: 'Piscina', icon: 'droplets' },
  { id: 'gym', label: 'Academia', icon: 'dumbbell' },
  { id: '24h', label: 'Portaria 24h', icon: 'lock' }
];

const MOCK_REVIEWS: Review[] = [
  { id: '1', propertyId: '1', userName: 'Ana Souza', rating: 5, comment: 'Excelente estadia! Tudo muito limpo e organizado.', date: '2023-10-15' },
  { id: '2', propertyId: '1', userName: 'Carlos Lima', rating: 4, comment: 'Muito bom, mas o checkin atrasou um pouco.', date: '2023-09-20' },
  { id: '3', propertyId: '2', userName: 'Mariana Costa', rating: 5, comment: 'Localização perfeita para quem precisa resolver coisas no centro.', date: '2023-11-05' }
];

const MOCK_SETTINGS: SiteSettings = {
  googleTagId: '',
  facebookPixelId: ''
};

interface PropertyContextType {
  properties: Property[];
  amenities: Amenity[];
  reviews: Review[];
  settings: SiteSettings;
  loading: boolean;
  isUsingMocks: boolean;
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addAmenity: (amenity: Omit<Amenity, 'id'>) => Promise<void>;
  deleteAmenity: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  getPropertyReviews: (propertyId: string) => Review[];
  getPropertyAverageRating: (propertyId: string) => number;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isUsingMocks, setIsUsingMocks] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Tentando conectar ao Supabase...");
        
        // Fetch Properties
        const { data: propsData, error: propsError } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (propsError) throw propsError;
        
        // Fetch Amenities
        const { data: amensData, error: amensError } = await supabase
          .from('amenities')
          .select('*');
        
        if (amensError) throw amensError;
        
        // Fetch Reviews
        const { data: revsData, error: revsError } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (revsError) throw revsError;

        // Fetch Settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        // Handle settings: if table exists but empty, or error (we fallback later)
        if (settingsData) {
          setSettings({
            googleTagId: settingsData.google_tag_id || '',
            facebookPixelId: settingsData.facebook_pixel_id || ''
          });
        }

        // Set data if successful
        setProperties(propsData || []);
        setAmenities(amensData || []);
        setReviews(revsData || []);
        setIsUsingMocks(false);
        console.log("Dados carregados do Supabase com sucesso.");

      } catch (error) {
        console.warn("Falha ao carregar do Supabase (tabelas podem não existir ou erro de conexão). Carregando dados Mock.");
        // console.error(error); // Keep clean console for user
        
        // Fallback to Mock Data
        setProperties(MOCK_PROPERTIES);
        setAmenities(MOCK_AMENITIES);
        setReviews(MOCK_REVIEWS);
        setSettings(MOCK_SETTINGS);
        setIsUsingMocks(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addProperty = async (newProp: Omit<Property, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([newProp])
        .select();

      if (error) throw error;
      if (data) {
        setProperties(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error("Erro ao adicionar imóvel:", error);
      // Fallback local update
      const mockId = Math.random().toString(36).substr(2, 9);
      setProperties(prev => [{ ...newProp, id: mockId } as Property, ...prev]);
      alert("Erro ao salvar no banco. Imóvel salvo apenas localmente (demo).");
    }
  };

  const updateProperty = async (id: string, updatedProp: Partial<Property>) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(updatedProp)
        .eq('id', id);

      if (error) throw error;
      setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updatedProp } : p)));
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
      // Fallback local update
      setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updatedProp } : p)));
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
      // Fallback local delete
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const addAmenity = async (newAmenity: Omit<Amenity, 'id'>) => {
    try {
      const id = newAmenity.label.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15) + '_' + Math.floor(Math.random() * 1000);
      const amenityWithId = { ...newAmenity, id };
      
      const { data, error } = await supabase
        .from('amenities')
        .insert([amenityWithId])
        .select();

      if (error) throw error;
      if (data) setAmenities(prev => [...prev, data[0]]);
    } catch (error) {
      console.error("Erro ao adicionar comodidade:", error);
       // Fallback
       const id = newAmenity.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
       setAmenities(prev => [...prev, { ...newAmenity, id }]);
    }
  };

  const deleteAmenity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('amenities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAmenities(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Erro ao deletar comodidade:", error);
      // Fallback
      setAmenities(prev => prev.filter(a => a.id !== id));
    }
  };

  // Review Logic
  const addReview = async (newReview: Omit<Review, 'id' | 'date'>) => {
    try {
      const reviewPayload = {
        ...newReview,
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewPayload])
        .select();

      if (error) throw error;
      if (data) setReviews(prev => [data[0], ...prev]);
    } catch (error) {
      console.error("Erro ao adicionar avaliação:", error);
      // Fallback
      const reviewPayload = {
        ...newReview,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0]
      };
      setReviews(prev => [reviewPayload, ...prev]);
    }
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

  // Settings Logic
  const updateSettings = async (newSettings: SiteSettings) => {
    try {
      // Upsert into site_settings table (ensure only id=1 exists)
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1, // Single row constraint
          google_tag_id: newSettings.googleTagId,
          facebook_pixel_id: newSettings.facebookPixelId
        });

      if (error) throw error;
      setSettings(newSettings);
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      // Fallback
      setSettings(newSettings);
      alert("Erro ao salvar no banco. Configuração salva localmente.");
    }
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      amenities,
      reviews,
      settings,
      loading,
      isUsingMocks,
      addProperty, 
      updateProperty, 
      deleteProperty,
      addAmenity,
      deleteAmenity,
      addReview,
      getPropertyReviews,
      getPropertyAverageRating,
      updateSettings
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
