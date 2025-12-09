
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Wifi, Tv, Coffee, Car, Wind, Droplets, CheckCircle, Share2, Heart, Play, Dumbbell, Lock, Sun, Umbrella, X, ChevronLeft, ChevronRight, Calendar, Maximize2, Star, MessageSquare } from 'lucide-react';
import { useProperties } from '../contexts/PropertyContext';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, amenities, getPropertyReviews, getPropertyAverageRating, addReview } = useProperties();
  const property = properties.find(p => p.id === id);
  // -1 for video, 0+ for gallery images
  const [activeMedia, setActiveMedia] = useState(0);

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Review Form State
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Close lightbox on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Apartamento não encontrado</h2>
          <Link to="/apartments" className="text-[#d65066] hover:underline">Voltar para lista</Link>
        </div>
      </div>
    );
  }

  // Get Reviews
  const reviews = getPropertyReviews(property.id);
  const averageRating = getPropertyAverageRating(property.id);
  const reviewCount = reviews.length;

  // Helper to determine if it is an embeddable service (YouTube/Vimeo)
  const isEmbedService = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  // Helper to extract embed URL from common video links
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  };

  // Icon mapping helper
  const getIcon = (key: string) => {
    switch (key) {
      case 'wifi': return <Wifi size={20} />;
      case 'tv': return <Tv size={20} />;
      case 'kitchen': 
      case 'coffee': return <Coffee size={20} />;
      case 'parking':
      case 'car': return <Car size={20} />;
      case 'ac':
      case 'wind': return <Wind size={20} />;
      case 'pool':
      case 'droplets': return <Droplets size={20} />;
      case 'gym':
      case 'dumbbell': return <Dumbbell size={20} />;
      case 'lock': return <Lock size={20} />;
      case 'sun': return <Sun size={20} />;
      case 'umbrella': return <Umbrella size={20} />;
      default: return <CheckCircle size={20} />;
    }
  };

  const getAmenityDetails = (amenityId: string) => {
    const amenity = amenities.find(a => a.id === amenityId);
    if (amenity) {
      return { label: amenity.label, icon: getIcon(amenity.icon) };
    }
    // Fallback for legacy ids if not found in dynamic list
    return { label: amenityId, icon: <CheckCircle size={20}/> };
  };

  const whatsappMessage = `Olá, tenho interesse no *${property.title}* que vi no site. Poderia me dar mais informações?`;
  const whatsappLink = `https://wa.me/5587991765540?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Calendar Logic
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const checkAvailability = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0); // Normalize time

    if (!property.availableDates || property.availableDates.length === 0) {
       return false;
    }

    return property.availableDates.some(range => {
       // Append time to ensure correct local date comparison if strictly parsing
       const start = new Date(range.startDate + 'T00:00:00'); 
       const end = new Date(range.endDate + 'T23:59:59');
       return checkDate >= start && checkDate <= end;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysCount; day++) {
      const isAvailable = checkAvailability(day);
      days.push(
        <div 
          key={day} 
          className={`h-10 flex items-center justify-center rounded-md text-sm font-medium border ${
            isAvailable 
              ? 'bg-green-100 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-300 border-red-100 line-through'
          }`}
          title={isAvailable ? 'Disponível' : 'Indisponível'}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Lightbox Navigation
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (activeMedia + 1) % property.gallery.length;
    setActiveMedia(nextIndex);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (activeMedia - 1 + property.gallery.length) % property.gallery.length;
    setActiveMedia(prevIndex);
  };

  // Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    addReview({
      propertyId: property.id,
      userName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment
    });

    // Reset form
    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      
      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-8 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px]">
          <div className="lg:col-span-3 h-full relative group bg-black rounded-2xl overflow-hidden">
             {activeMedia === -1 && property.videoUrl ? (
                isEmbedService(property.videoUrl) ? (
                  <iframe 
                    src={getEmbedUrl(property.videoUrl)} 
                    title="Video Tour" 
                    className="w-full h-full" 
                    allowFullScreen
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                ) : (
                  // Fallback to HTML5 video for direct files or data URIs
                  <video 
                    src={property.videoUrl} 
                    controls 
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  >
                    Seu navegador não suporta a tag de vídeo.
                  </video>
                )
             ) : (
                <div 
                  className="w-full h-full relative cursor-zoom-in" 
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img 
                    src={property.gallery[activeMedia] || property.imageUrl} 
                    alt="Main View" 
                    className="w-full h-full object-cover rounded-2xl shadow-sm hover:opacity-95 transition-opacity"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={14} /> Ampliar
                  </div>
                </div>
             )}
          </div>
          <div className="hidden lg:flex flex-col gap-4 h-full">
             {/* Thumbnail list - limited to 2 for layout */}
            {property.gallery.slice(0, 2).map((img, idx) => (
              <div 
                key={idx} 
                className={`relative h-1/2 cursor-pointer overflow-hidden rounded-xl ${activeMedia === idx ? 'ring-2 ring-[#d65066]' : ''}`}
                onClick={() => setActiveMedia(idx)}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
             
             {/* Video Thumbnail */}
             {property.videoUrl && (
                <div 
                   className={`relative h-1/2 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer group hover:bg-gray-200 transition ${activeMedia === -1 ? 'ring-2 ring-[#d65066]' : ''}`}
                   onClick={() => setActiveMedia(-1)}
                >
                   <Play fill="#d65066" className="text-[#d65066] w-12 h-12 group-hover:scale-110 transition-transform" />
                   <span className="absolute bottom-2 text-xs text-gray-500 font-medium">Ver Vídeo Tour</span>
                </div>
             )}
             
             {/* Fallback if no video to fill space or just empty */}
             {!property.videoUrl && property.gallery.length > 2 && (
                <div 
                  className={`relative h-1/2 cursor-pointer overflow-hidden rounded-xl ${activeMedia === 2 ? 'ring-2 ring-[#d65066]' : ''}`}
                  onClick={() => setActiveMedia(2)}
                >
                  <img src={property.gallery[2]} alt="Thumb 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  {property.gallery.length > 3 && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl" onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}>
                        +{property.gallery.length - 3}
                     </div>
                  )}
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center text-gray-500">
                    <MapPin size={18} className="mr-1 text-[#d65066]" />
                    {property.location}
                  </div>
                  {reviewCount > 0 && (
                     <div className="flex items-center text-gray-700 font-medium">
                        <Star size={16} fill="#e8a633" className="text-[#e8a633] mr-1" />
                        {averageRating} <span className="text-gray-400 font-normal ml-1">({reviewCount} avaliações)</span>
                     </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"><Share2 size={20}/></button>
                 <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"><Heart size={20}/></button>
              </div>
            </div>
            
            <div className="flex gap-6 border-y border-gray-100 py-6 my-6">
              <div className="flex items-center gap-2">
                <Users className="text-gray-400" />
                <span className="font-medium text-gray-700">{property.capacity} Hóspedes</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                 <span className="font-medium text-gray-700">1 Quarto</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                 <span className="font-medium text-gray-700">1 Banheiro</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre este espaço</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">O que este lugar oferece</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities.map(amenityId => {
                const details = getAmenityDetails(amenityId);
                return (
                  <div key={amenityId} className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-0.5 flex-shrink-0">{details.icon}</span>
                    <span className="leading-snug">{details.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
             <h3 className="text-xl font-bold text-gray-900 mb-6">Localização</h3>
             
             <div className="flex items-start gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                <MapPin className="text-[#d65066] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Endereço</h4>
                  <p className="text-gray-600">{property.location}</p>
                </div>
             </div>

             {/* Google Maps Embed (No Key Required for basic search) */}
             <div className="w-full h-96 rounded-xl overflow-hidden shadow-sm bg-gray-100 relative">
                <iframe
                  title="Localização do Imóvel"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                ></iframe>
             </div>
             
             <div className="mt-6">
                <h4 className="font-semibold mb-3">Pontos de Interesse Próximos:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                   <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Supermercado Pão de Açúcar</span>
                      <span className="font-medium">5 min a pé</span>
                   </li>
                   <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Metrô Estação Central</span>
                      <span className="font-medium">10 min a pé</span>
                   </li>
                   <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Parque da Cidade</span>
                      <span className="font-medium">15 min de carro</span>
                   </li>
                </ul>
             </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-10 border-t border-gray-200">
             <div className="flex items-center gap-2 mb-8">
                <Star fill="#e8a633" className="text-[#e8a633]" size={28} />
                <h3 className="text-2xl font-bold text-gray-900">
                   {reviewCount > 0 ? `${averageRating} · ${reviewCount} avaliações` : 'Avaliações'}
                </h3>
             </div>

             {/* Review List */}
             {reviews.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {reviews.map(review => (
                     <div key={review.id} className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                 {review.userName.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-gray-900">{review.userName}</div>
                                 <div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('pt-BR')}</div>
                              </div>
                           </div>
                           <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={14} fill={i < review.rating ? "#e8a633" : "none"} className={i < review.rating ? "text-[#e8a633]" : "text-gray-300"} />
                              ))}
                           </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                           "{review.comment}"
                        </p>
                     </div>
                  ))}
               </div>
             ) : (
               <div className="text-center py-8 bg-gray-50 rounded-xl mb-12">
                  <MessageSquare size={48} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Este imóvel ainda não possui avaliações. Seja o primeiro a avaliar!</p>
               </div>
             )}

             {/* Add Review Form */}
             <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Deixe sua avaliação</h4>
                <form onSubmit={handleSubmitReview}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                         <input 
                            type="text" 
                            required
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                            placeholder="Ex: João Silva"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Sua Nota</label>
                         <div className="flex gap-2 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                               <button 
                                  key={star}
                                  type="button"
                                  onClick={() => setNewReviewRating(star)}
                                  className="focus:outline-none transition-transform hover:scale-110"
                               >
                                  <Star 
                                     size={28} 
                                     fill={star <= newReviewRating ? "#e8a633" : "none"} 
                                     className={star <= newReviewRating ? "text-[#e8a633]" : "text-gray-300"} 
                                  />
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seu Comentário</label>
                      <textarea 
                         required
                         rows={4}
                         value={newReviewComment}
                         onChange={(e) => setNewReviewComment(e.target.value)}
                         className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                         placeholder="Conte como foi sua estadia..."
                      ></textarea>
                   </div>
                   <button 
                      type="submit" 
                      disabled={isSubmittingReview}
                      className="bg-[#d65066] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#c03e53] transition disabled:opacity-50"
                   >
                      {isSubmittingReview ? 'Enviando...' : 'Publicar Avaliação'}
                   </button>
                </form>
             </div>
          </div>

        </div>

        {/* Sidebar Sticky CTA */}
        <div className="lg:col-span-1 relative z-20">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
             <div className="flex justify-between items-end mb-6">
                <div>
                   <span className="text-2xl font-bold text-gray-900">R$ {property.price}</span>
                   <span className="text-gray-500 text-sm"> / noite</span>
                </div>
                <button 
                  onClick={() => setShowCalendar(true)}
                  className="text-xs text-[#d65066] font-bold underline cursor-pointer hover:text-[#c03e53]"
                >
                   ver disponibilidade
                </button>
             </div>

             <div className="space-y-4 mb-6">
                <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-[#d65066] transition" onClick={() => setShowCalendar(true)}>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Datas</label>
                   <div className="text-sm text-gray-700 flex justify-between items-center">
                      <span>Ver calendário</span>
                      <Calendar size={14} className="text-gray-400"/>
                   </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Hóspedes</label>
                   <div className="text-sm text-gray-700">{property.capacity} hóspedes</div>
                </div>
             </div>

             <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full bg-[#d65066] text-white text-center font-bold py-3 rounded-lg hover:bg-[#c03e53] transition shadow-md hover:shadow-lg mb-4"
             >
                Reservar via WhatsApp
             </a>
             
             <p className="text-xs text-center text-gray-400">
                Você não será cobrado ainda. A negociação é feita diretamente com o proprietário.
             </p>
          </div>
        </div>

      </div>

      {/* Availability Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCalendar(false)}></div>
           
           {/* Modal Content */}
           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 animate-[fadeIn_0.2s_ease-out]">
              <button 
                 onClick={() => setShowCalendar(false)}
                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                 <X size={24} />
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">Disponibilidade</h2>
              <p className="text-sm text-gray-500 mb-6">Consulte os dias livres para sua estadia.</p>
              
              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-6">
                 <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ChevronLeft size={20} />
                 </button>
                 <span className="text-lg font-bold text-gray-800 capitalize">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                 </span>
                 <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ChevronRight size={20} />
                 </button>
              </div>
              
              {/* Legend */}
              <div className="flex gap-4 mb-4 text-xs">
                 <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span className="text-gray-600">Disponível</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-50 border border-red-100 rounded"></div>
                    <span className="text-gray-600">Indisponível</span>
                 </div>
              </div>

              {/* Grid Header */}
              <div className="grid grid-cols-7 mb-2">
                 {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">
                       {day}
                    </div>
                 ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                 {renderCalendar()}
              </div>
              
              <button 
                onClick={() => setShowCalendar(false)}
                className="w-full mt-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
              >
                 Fechar Calendário
              </button>
           </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {isLightboxOpen && activeMedia >= 0 && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
            title="Fechar"
          >
            <X size={32} />
          </button>

          <button 
             onClick={handlePrevImage}
             className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full z-50 transition"
             title="Anterior"
          >
             <ChevronLeft size={48} />
          </button>

          <div className="max-w-6xl max-h-[90vh] p-4 relative flex items-center justify-center">
            <img 
               src={property.gallery[activeMedia] || property.imageUrl} 
               alt={`Gallery full ${activeMedia}`} 
               className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
               {activeMedia + 1} / {property.gallery.length}
            </div>
          </div>

          <button 
             onClick={handleNextImage}
             className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full z-50 transition"
             title="Próxima"
          >
             <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
