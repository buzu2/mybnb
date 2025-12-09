
import React, { useState } from 'react';
import { useProperties } from '../contexts/PropertyContext';
import { Property, DateRange } from '../types';
import { Edit2, Trash2, Plus, X, Save, LogOut, Upload, Image as ImageIcon, Calendar, Video, Settings, Wifi, Wind, Tv, Coffee, Car, Droplets, Dumbbell, Lock, Sun, Umbrella } from 'lucide-react';

const Admin: React.FC = () => {
  const { properties, amenities, addProperty, updateProperty, deleteProperty, addAmenity, deleteAmenity } = useProperties();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingAmenities, setIsManagingAmenities] = useState(false);

  // Login Mock
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Form State
  const initialFormState: Omit<Property, 'id'> = {
    title: '',
    description: '',
    location: '',
    price: 0,
    capacity: 2,
    imageUrl: '',
    gallery: [],
    videoUrl: '',
    amenities: [],
    availableDates: [],
    isFeatured: false,
  };
  const [formData, setFormData] = useState<Omit<Property, 'id'>>(initialFormState);
  const [urlInput, setUrlInput] = useState('');
  
  // Date Range Input State
  const [dateInput, setDateInput] = useState<DateRange>({ startDate: '', endDate: '' });

  // New Amenity State
  const [newAmenityName, setNewAmenityName] = useState('');
  const [newAmenityIcon, setNewAmenityIcon] = useState('check');

  const iconOptions = [
    { key: 'wifi', label: 'Wi-Fi', component: <Wifi size={18}/> },
    { key: 'wind', label: 'Ar Cond.', component: <Wind size={18}/> },
    { key: 'tv', label: 'TV', component: <Tv size={18}/> },
    { key: 'coffee', label: 'Cozinha', component: <Coffee size={18}/> },
    { key: 'car', label: 'Carro', component: <Car size={18}/> },
    { key: 'droplets', label: 'Piscina', component: <Droplets size={18}/> },
    { key: 'dumbbell', label: 'Academia', component: <Dumbbell size={18}/> },
    { key: 'lock', label: 'Segurança', component: <Lock size={18}/> },
    { key: 'sun', label: 'Sol/Praia', component: <Sun size={18}/> },
    { key: 'umbrella', label: 'Lazer', component: <Umbrella size={18}/> },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (loginUser === 'adminmybnb' && loginPass === 'adminmybnb') {
      setIsLoggedIn(true);
    } else {
      alert('Usuário ou senha inválidos.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginUser('');
    setLoginPass('');
  };

  const startEdit = (property: Property) => {
    setIsCreating(false);
    setIsManagingAmenities(false);
    setIsEditing(property.id);
    setFormData(property);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startCreate = () => {
    setIsEditing(null);
    setIsManagingAmenities(false);
    setIsCreating(true);
    setFormData(initialFormState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setIsEditing(null);
    setIsCreating(false);
    setIsManagingAmenities(false);
    setFormData(initialFormState);
    setUrlInput('');
    setDateInput({ startDate: '', endDate: '' });
  };

  // Image Handling Logic
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (formData.gallery.length >= 10) {
      alert("Limite de 10 imagens atingido.");
      return;
    }
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, urlInput.trim()] }));
    setUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 10 - formData.gallery.length;
    if (remainingSlots <= 0) {
      alert("Limite de 10 imagens atingido.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          if (prev.gallery.length >= 10) return prev;
          return {
            ...prev,
            gallery: [...prev.gallery, reader.result as string]
          };
        });
      };
      reader.readAsDataURL(file as Blob);
    });
    
    // Reset input
    e.target.value = '';
  };

  // Video File Upload Logic
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 50MB for demo environment purposes)
    if (file.size > 50 * 1024 * 1024) {
       alert("O arquivo de vídeo é muito grande (Máx. 50MB neste ambiente de demonstração).");
       return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
       setFormData(prev => ({ ...prev, videoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleMoveImageToCover = (index: number) => {
    if (index === 0) return;
    const newGallery = [...formData.gallery];
    const [movedImage] = newGallery.splice(index, 1);
    newGallery.unshift(movedImage);
    setFormData({ ...formData, gallery: newGallery });
  };

  // Date Logic
  const handleAddDateRange = () => {
    if (!dateInput.startDate || !dateInput.endDate) {
      alert("Selecione a data de início e fim.");
      return;
    }
    if (new Date(dateInput.startDate) > new Date(dateInput.endDate)) {
      alert("A data final deve ser maior que a data inicial.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      availableDates: [...prev.availableDates, dateInput]
    }));
    setDateInput({ startDate: '', endDate: '' });
  };

  const handleRemoveDateRange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index)
    }));
  };

  // Amenity Management
  const handleCreateAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName) return;
    addAmenity({
      label: newAmenityName,
      icon: newAmenityIcon
    });
    setNewAmenityName('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.gallery.length === 0) {
      alert("É necessário adicionar pelo menos uma imagem na galeria.");
      return;
    }

    const finalData = {
      ...formData,
      imageUrl: formData.gallery[0], // First image is always the cover
    };

    if (isEditing) {
      updateProperty(isEditing, finalData);
    } else {
      // Basic validation
      if (!formData.title) {
        alert("Título é obrigatório.");
        return;
      }
      addProperty(finalData);
    }
    cancelForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este imóvel?')) {
      deleteProperty(id);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities: currentAmenities };
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCEF]">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Painel Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuário</label>
              <input 
                type="text" 
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input 
                type="password" 
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                placeholder=""
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#d65066] text-white py-2 px-4 rounded-md hover:bg-[#c03e53] transition font-bold"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCEF] pb-20">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Imóveis</h1>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm">
            <LogOut size={16}/> Sair
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Amenity Management Section */}
        {isManagingAmenities && (
           <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border-l-4 border-blue-500">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                   <Settings size={20} /> Catálogo de Comodidades
                </h2>
                <button onClick={() => setIsManagingAmenities(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Create New */}
                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4">Adicionar Nova Comodidade</h3>
                    <form onSubmit={handleCreateAmenity} className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Nome da Comodidade</label>
                          <input 
                             type="text" 
                             value={newAmenityName}
                             onChange={e => setNewAmenityName(e.target.value)}
                             placeholder="Ex: Jacuzzi Privativa"
                             className="w-full border border-gray-300 rounded-md p-2"
                             required
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Ícone Representativo</label>
                          <div className="grid grid-cols-5 gap-2">
                             {iconOptions.map(opt => (
                                <button
                                   key={opt.key}
                                   type="button"
                                   onClick={() => setNewAmenityIcon(opt.key)}
                                   className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 hover:bg-white transition ${newAmenityIcon === opt.key ? 'bg-white border-blue-500 text-blue-500 ring-1 ring-blue-500' : 'border-gray-200 text-gray-500'}`}
                                >
                                   {opt.component}
                                   <span className="text-[10px]">{opt.label}</span>
                                </button>
                             ))}
                          </div>
                       </div>
                       <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-bold">
                          Adicionar ao Catálogo
                       </button>
                    </form>
                 </div>

                 {/* List Existing */}
                 <div>
                    <h3 className="font-bold text-gray-700 mb-4">Comodidades Existentes</h3>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                       {amenities.map(amenity => (
                          <div key={amenity.id} className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-lg">
                             <div className="flex items-center gap-3">
                                <span className="p-2 bg-gray-100 rounded-full text-gray-600">
                                   {iconOptions.find(i => i.key === amenity.icon)?.component || <Settings size={18}/>}
                                </span>
                                <span className="font-medium text-gray-800">{amenity.label}</span>
                             </div>
                             <button 
                                onClick={() => deleteAmenity(amenity.id)}
                                className="text-red-400 hover:text-red-600 p-2"
                                title="Excluir do catálogo"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Property Form Area */}
        {(isCreating || isEditing) && !isManagingAmenities && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border-l-4 border-[#e8a633]">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
              </h2>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título do Imóvel</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Localização (Bairro, Cidade)</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preço (Diária R$)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacidade (Pessoas)</label>
                  <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição Completa</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
              </div>

              {/* Video URL Input */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                 <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Video size={16} /> Link ou Arquivo de Vídeo (Opcional)
                 </label>
                 
                 <div className="flex flex-col gap-3">
                   <div className="flex flex-col md:flex-row gap-2">
                     <input 
                        type="url" 
                        placeholder="Cole um link (YouTube, Vimeo ou URL direto)" 
                        value={formData.videoUrl || ''} 
                        onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                        className="flex-grow border border-gray-300 rounded-md p-2 text-sm" 
                     />
                     <div className="relative">
                       <input 
                          type="file" 
                          id="videoUpload" 
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                       />
                       <label 
                          htmlFor="videoUpload" 
                          className="cursor-pointer flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium text-sm transition h-full whitespace-nowrap"
                       >
                          <Upload size={16} /> Upload Vídeo
                       </label>
                     </div>
                   </div>
                   <div className="text-xs text-gray-500">
                     Suporta links (YouTube, Vimeo) ou upload de arquivo direto (.mp4, .mov, etc).
                   </div>
                   
                   {formData.videoUrl && (
                      <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                         <span className="font-bold">Vídeo selecionado!</span>
                         {formData.videoUrl.startsWith('data:') ? '(Arquivo Local)' : '(URL Externa)'}
                      </div>
                   )}
                 </div>
              </div>

              {/* Gallery Manager */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Galeria de Fotos (Máx. 10)
                  <span className="text-xs font-normal text-gray-500 ml-2">
                     {formData.gallery.length}/10 imagens
                  </span>
                </label>
                <p className="text-xs text-gray-500 mb-4">A primeira imagem será usada como capa (capa principal). Clique em uma imagem para torná-la a capa.</p>

                {/* Add Image Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                   <div className="flex-grow flex gap-2">
                      <input 
                         type="url" 
                         placeholder="Cole um link de imagem (https://...)" 
                         value={urlInput}
                         onChange={e => setUrlInput(e.target.value)}
                         className="flex-grow border border-gray-300 rounded-md p-2 text-sm"
                         disabled={formData.gallery.length >= 10}
                      />
                      <button 
                         type="button" 
                         onClick={handleAddUrl}
                         disabled={!urlInput || formData.gallery.length >= 10}
                         className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
                      >
                         <Plus size={18} />
                      </button>
                   </div>
                   
                   <div className="relative">
                      <input 
                         type="file" 
                         id="fileUpload" 
                         multiple 
                         accept="image/*"
                         onChange={handleFileUpload}
                         className="hidden"
                         disabled={formData.gallery.length >= 10}
                      />
                      <label 
                         htmlFor="fileUpload" 
                         className={`cursor-pointer flex items-center gap-2 bg-[#d65066] text-white px-4 py-2 rounded-md hover:bg-[#c03e53] font-medium text-sm transition ${formData.gallery.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                         <Upload size={18} /> Upload Fotos
                      </label>
                   </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.gallery.map((img, idx) => (
                    <div key={idx} className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-[#e8a633]' : 'border-gray-200'}`}>
                       <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                       
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <button 
                             type="button" 
                             onClick={() => handleRemoveImage(idx)}
                             className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                             title="Remover"
                          >
                             <Trash2 size={16} />
                          </button>
                          {idx !== 0 && (
                             <button 
                                type="button" 
                                onClick={() => handleMoveImageToCover(idx)}
                                className="bg-[#e8a633] text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-[#d6952e]"
                             >
                                Definir Capa
                             </button>
                          )}
                       </div>
                       
                       {idx === 0 && (
                          <div className="absolute top-0 left-0 bg-[#e8a633] text-white text-xs font-bold px-2 py-1 rounded-br-lg">
                             CAPA
                          </div>
                       )}
                    </div>
                  ))}
                  
                  {formData.gallery.length === 0 && (
                     <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                        <ImageIcon size={48} className="mx-auto mb-2 opacity-30" />
                        <p>Nenhuma imagem adicionada</p>
                     </div>
                  )}
                </div>
              </div>
              
              {/* Date Availability Manager */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                 <label className="block text-sm font-bold text-gray-800 mb-2">
                    Datas Disponíveis
                 </label>
                 <p className="text-xs text-gray-500 mb-4">Adicione os intervalos de datas em que o imóvel está disponível para aluguel.</p>
                 
                 <div className="flex flex-col sm:flex-row items-end gap-3 mb-4">
                    <div className="w-full sm:w-auto">
                       <label className="block text-xs text-gray-500 mb-1">Data Início</label>
                       <input 
                          type="date" 
                          value={dateInput.startDate}
                          onChange={e => setDateInput({...dateInput, startDate: e.target.value})}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
                       />
                    </div>
                    <div className="w-full sm:w-auto">
                       <label className="block text-xs text-gray-500 mb-1">Data Fim</label>
                       <input 
                          type="date" 
                          value={dateInput.endDate}
                          onChange={e => setDateInput({...dateInput, endDate: e.target.value})}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
                       />
                    </div>
                    <button 
                       type="button" 
                       onClick={handleAddDateRange}
                       className="bg-[#d65066] text-white px-4 py-2 rounded-md hover:bg-[#c03e53] font-medium text-sm flex items-center gap-1"
                    >
                       <Plus size={16} /> Adicionar
                    </button>
                 </div>

                 {formData.availableDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                       {formData.availableDates.map((range, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                             <Calendar size={14} className="text-gray-400" />
                             <span className="text-sm text-gray-700">
                                {new Date(range.startDate).toLocaleDateString('pt-BR')} até {new Date(range.endDate).toLocaleDateString('pt-BR')}
                             </span>
                             <button 
                                type="button" 
                                onClick={() => handleRemoveDateRange(idx)}
                                className="ml-2 text-red-500 hover:text-red-700"
                             >
                                <X size={14} />
                             </button>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <p className="text-sm text-gray-400 italic">Nenhuma data específica cadastrada.</p>
                 )}
              </div>

              <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Comodidades</label>
                    <button 
                       type="button" 
                       onClick={() => {
                          setIsCreating(false);
                          setIsEditing(null);
                          setIsManagingAmenities(true);
                       }}
                       className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                       <Settings size={12} /> Gerenciar Opções
                    </button>
                 </div>
                 <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {amenities.map(amenity => (
                       <button
                          type="button"
                          key={amenity.id}
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 transition ${formData.amenities.includes(amenity.id) ? 'bg-[#d65066] text-white border-[#d65066] shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:border-[#d65066]'}`}
                       >
                          {formData.amenities.includes(amenity.id) && <span className="text-xs">✓</span>}
                          {amenity.label}
                       </button>
                    ))}
                    {amenities.length === 0 && (
                       <p className="text-gray-400 text-sm">Nenhuma comodidade cadastrada. Clique em "Gerenciar Opções".</p>
                    )}
                 </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <input 
                    type="checkbox" 
                    id="featured" 
                    checked={formData.isFeatured} 
                    onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                    className="rounded text-[#d65066] focus:ring-[#d65066]"
                 />
                 <label htmlFor="featured" className="text-sm text-gray-700 font-medium">Destacar na Home?</label>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={cancelForm} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Cancelar</button>
                <button type="submit" className="flex items-center gap-2 bg-[#d65066] text-white px-6 py-2 rounded-md hover:bg-[#c03e53] font-bold">
                  <Save size={18} /> Salvar Imóvel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Area */}
        {!isCreating && !isEditing && !isManagingAmenities && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <div className="flex gap-4">
                  <h3 className="font-bold text-gray-700 pt-2">Imóveis ({properties.length})</h3>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => setIsManagingAmenities(true)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition font-medium text-sm">
                     <Settings size={18} /> Comodidades
                  </button>
                  <button onClick={startCreate} className="flex items-center gap-2 bg-[#e8a633] text-white px-4 py-2 rounded-md hover:bg-[#d6952e] transition font-medium text-sm">
                     <Plus size={18} /> Novo Apartamento
                  </button>
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imóvel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={prop.imageUrl} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{prop.title}</div>
                            {prop.isFeatured && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Destaque</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prop.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        R$ {prop.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => startEdit(prop)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                           <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(prop.id)} className="text-red-600 hover:text-red-900">
                           <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
