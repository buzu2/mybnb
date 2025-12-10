
import React, { useState, useEffect } from 'react';
import { useProperties } from '../contexts/PropertyContext';
import { Property, DateRange } from '../types';
import { supabase } from '../supabaseClient';
import { Edit2, Trash2, Plus, X, Save, LogOut, Upload, Image as ImageIcon, Calendar, Video, Settings, Wifi, Wind, Tv, Coffee, Car, Droplets, Dumbbell, Lock, Sun, Umbrella, Loader2, Database, Key, BarChart, Mail } from 'lucide-react';

const Admin: React.FC = () => {
  const { properties, amenities, settings, addProperty, updateProperty, deleteProperty, addAmenity, deleteAmenity, isUsingMocks, updateSettings } = useProperties();
  const [session, setSession] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingAmenities, setIsManagingAmenities] = useState(false);
  const [isManagingSettings, setIsManagingSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSqlConfig, setShowSqlConfig] = useState(false);

  // Settings State
  const [marketingSettings, setMarketingSettings] = useState({ googleTagId: '', facebookPixelId: '' });

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{type: 'success' | 'error' | '', msg: string}>({ type: '', msg: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Login State
  const [email, setEmail] = useState('surfads01@gmail.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

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

  useEffect(() => {
    // Initial Session Check with robust error handling
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Erro na sessão (Token inválido/expirado). Realizando logout para limpar estado.", error.message);
          // If token is invalid, force sign out to clear storage and prevent loops
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(data.session);
        }
      } catch (err) {
        console.error("Erro inesperado na autenticação:", err);
        setSession(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESH_REVOKED') {
        setSession(null);
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update local settings state when context settings load
  useEffect(() => {
    setMarketingSettings({
      googleTagId: settings.googleTagId || '',
      facebookPixelId: settings.facebookPixelId || ''
    });
  }, [settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Auto-create logic for the specific requested admin user if they don't exist
        if (email === 'surfads01@gmail.com' && error?.message && error.message.includes('Invalid login credentials')) {
          console.log("Tentando criar usuário admin automaticamente...");
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) throw signUpError;

          if (signUpData.session) {
             // Login successful after creation
             return;
          } else if (signUpData.user) {
             alert("Usuário criado com sucesso! Se você não conseguir entrar automaticamente, verifique seu e-mail para confirmar o cadastro (Padrão do Supabase).");
             return;
          }
        }
        throw error;
      }
    } catch (error: any) {
       let msg = 'Erro ao fazer login';
       if (error?.message) msg = error.message;
       else if (error?.error_description) msg = error.error_description;
       
       if (msg.includes('Invalid login credentials') && email === 'surfads01@gmail.com') {
          msg = 'Senha incorreta. Se você criou a conta com a senha antiga (123456), tente ela, ou use "Esqueci minha senha" para redefinir para "adminmybnb".';
       }
       setLoginError(msg);
    }
  };

  const handleRecoverPassword = async () => {
    if (!email) {
      setLoginError("Digite seu e-mail para recuperar a senha.");
      return;
    }
    setIsRecovering(true);
    setLoginError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin',
      });
      if (error) throw error;
      alert(`Email de recuperação enviado para ${email}. Verifique sua caixa de entrada.`);
    } catch (error: any) {
      setLoginError(error.message || "Erro ao enviar email de recuperação.");
    } finally {
      setIsRecovering(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'As senhas não coincidem.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', msg: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordStatus({ type: '', msg: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordStatus({ type: 'success', msg: 'Senha atualizada com sucesso!' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
         setShowPasswordModal(false);
         setPasswordStatus({ type: '', msg: '' });
      }, 2000);

    } catch (error: any) {
      setPasswordStatus({ type: 'error', msg: error.message || 'Erro ao atualizar senha.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const startEdit = (property: Property) => {
    setIsCreating(false);
    setIsManagingAmenities(false);
    setIsManagingSettings(false);
    setIsEditing(property.id);
    setFormData(property);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startCreate = () => {
    setIsEditing(null);
    setIsManagingAmenities(false);
    setIsManagingSettings(false);
    setIsCreating(true);
    setFormData(initialFormState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setIsEditing(null);
    setIsCreating(false);
    setIsManagingAmenities(false);
    setIsManagingSettings(false);
    setFormData(initialFormState);
    setUrlInput('');
    setDateInput({ startDate: '', endDate: '' });
    setIsSaving(false);
  };

  // Generic File Upload to Supabase Storage
  const uploadToSupabase = async (file: File, bucket: 'images' | 'videos'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Erro ao fazer upload do arquivo.');
      return null;
    }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 10 - formData.gallery.length;
    if (remainingSlots <= 0) {
      alert("Limite de 10 imagens atingido.");
      return;
    }

    setIsUploading(true);
    // Cast to File[] to avoid 'unknown' type issue in loop
    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];
    const newUrls: string[] = [];

    for (const file of filesToProcess) {
       const publicUrl = await uploadToSupabase(file, 'images');
       if (publicUrl) newUrls.push(publicUrl);
    }

    setFormData(prev => ({
       ...prev,
       gallery: [...prev.gallery, ...newUrls]
    }));
    
    setIsUploading(false);
    e.target.value = '';
  };

  // Video File Upload Logic
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
       alert("O arquivo de vídeo é muito grande (Máx. 50MB recomendado).");
       return;
    }

    setIsUploading(true);
    const publicUrl = await uploadToSupabase(file, 'videos');
    if (publicUrl) {
       setFormData(prev => ({ ...prev, videoUrl: publicUrl }));
    }
    setIsUploading(false);
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
      availableDates: [...(prev.availableDates || []), dateInput]
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
  const handleCreateAmenity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName) return;
    await addAmenity({
      label: newAmenityName,
      icon: newAmenityIcon
    });
    setNewAmenityName('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.gallery.length === 0) {
      alert("É necessário adicionar pelo menos uma imagem na galeria.");
      return;
    }

    setIsSaving(true);

    const finalData = {
      ...formData,
      imageUrl: formData.gallery[0], // First image is always the cover
    };

    if (isEditing) {
      await updateProperty(isEditing, finalData);
    } else {
      if (!formData.title) {
        alert("Título é obrigatório.");
        setIsSaving(false);
        return;
      }
      await addProperty(finalData);
    }
    cancelForm();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(marketingSettings);
    setIsSaving(false);
    setIsManagingSettings(false);
    alert('Configurações de marketing atualizadas com sucesso!');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este imóvel?')) {
      await deleteProperty(id);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      const newAmenities = currentAmenities.includes(amenityId)
        ? currentAmenities.filter(a => a !== amenityId)
        : [...currentAmenities, amenityId];
      return { ...prev, amenities: newAmenities };
    });
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCEF]">
        <Loader2 className="animate-spin text-[#d65066]" size={48} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCEF]">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Painel Administrativo</h2>
          {loginError && (
             <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">{loginError}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                required
                placeholder="adminmybnb"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#d65066] text-white py-2 px-4 rounded-md hover:bg-[#c03e53] transition font-bold"
            >
              Entrar
            </button>
            <div className="text-center mt-2">
               <button 
                 type="button" 
                 onClick={handleRecoverPassword}
                 disabled={isRecovering}
                 className="text-sm text-gray-500 hover:text-[#d65066] flex items-center justify-center gap-1 w-full"
               >
                 {isRecovering ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />} 
                 Esqueci minha senha
               </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCEF] pb-20">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Imóveis</h1>
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
             <button 
               onClick={() => setShowPasswordModal(true)} 
               className="text-gray-500 hover:text-[#d65066] flex items-center gap-2 text-sm border border-gray-200 px-3 py-1 rounded transition"
             >
               <Key size={16}/> Alterar Senha
             </button>
             <button 
               onClick={() => setShowSqlConfig(!showSqlConfig)} 
               className="text-gray-500 hover:text-blue-600 flex items-center gap-2 text-sm border border-gray-200 px-3 py-1 rounded transition"
             >
               <Database size={16}/> Configurar BD
             </button>
             <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm border border-gray-200 px-3 py-1 rounded transition">
               <LogOut size={16}/> Sair
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Database Config Alert */}
        {(isUsingMocks || showSqlConfig) && (
           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg shadow-sm">
              <div className="flex flex-col">
                 <div className="flex items-center mb-2">
                    <div className="flex-shrink-0">
                       <Settings className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                       <h3 className="text-sm font-bold text-yellow-800">
                          {isUsingMocks ? 'Banco de Dados não configurado (Modo Mock Ativo)' : 'Configuração SQL do Banco de Dados'}
                       </h3>
                    </div>
                    {showSqlConfig && (
                       <button onClick={() => setShowSqlConfig(false)} className="ml-auto text-yellow-600 hover:text-yellow-800"><X size={16}/></button>
                    )}
                 </div>
                 <div className="mt-2 text-sm text-yellow-700 ml-8">
                    <p className="mb-2">
                       Copie o código SQL abaixo e execute no <strong>SQL Editor</strong> do seu painel Supabase para criar as tabelas necessárias:
                    </p>
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded text-xs overflow-x-auto select-all">
{`-- 1. Tabela de Propriedades
create table if not exists properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  location text,
  price numeric,
  capacity numeric,
  "imageUrl" text,
  gallery text[],
  "videoUrl" text,
  amenities text[],
  "availableDates" jsonb default '[]'::jsonb,
  "isFeatured" boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tabela de Comodidades
create table if not exists amenities (
  id text primary key,
  label text,
  icon text
);

-- 3. Tabela de Avaliações
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  "propertyId" uuid references properties(id) on delete cascade,
  "userName" text,
  rating numeric,
  comment text,
  date text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Configurações do Site (Marketing)
create table if not exists site_settings (
  id int primary key default 1,
  google_tag_id text,
  facebook_pixel_id text,
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict do nothing;

-- 5. Buckets
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict do nothing;

-- 6. Políticas RLS
alter table properties enable row level security;
create policy "Public view" on properties for select using (true);
create policy "Auth insert" on properties for insert with check (auth.role() = 'authenticated');
create policy "Auth update" on properties for update using (auth.role() = 'authenticated');
create policy "Auth delete" on properties for delete using (auth.role() = 'authenticated');

alter table amenities enable row level security;
create policy "Public view" on amenities for select using (true);
create policy "Auth all" on amenities for all using (auth.role() = 'authenticated');

alter table reviews enable row level security;
create policy "Public view" on reviews for select using (true);
create policy "Public insert" on reviews for insert with check (true);

alter table site_settings enable row level security;
create policy "Public view settings" on site_settings for select using (true);
create policy "Auth update settings" on site_settings for update using (auth.role() = 'authenticated');

-- Storage Policies
create policy "Public Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Auth Upload Images" on storage.objects for insert with check ( bucket_id = 'images' AND auth.role() = 'authenticated' );
create policy "Public Videos" on storage.objects for select using ( bucket_id = 'videos' );
create policy "Auth Upload Videos" on storage.objects for insert with check ( bucket_id = 'videos' AND auth.role() = 'authenticated' );`}
                    </pre>
                 </div>
              </div>
           </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Alterar Senha</h2>
                   <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={24} />
                   </button>
                </div>
                
                {passwordStatus.msg && (
                   <div className={`p-3 rounded mb-4 text-sm ${passwordStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {passwordStatus.msg}
                   </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                      <input 
                         type="password" 
                         required
                         minLength={6}
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                      <input 
                         type="password" 
                         required
                         minLength={6}
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#d65066] focus:border-[#d65066]"
                      />
                   </div>
                   <button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className="w-full bg-[#d65066] text-white py-2 rounded-md hover:bg-[#c03e53] font-bold transition disabled:opacity-50 flex justify-center items-center gap-2"
                   >
                      {isUpdatingPassword ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
                      Atualizar Senha
                   </button>
                </form>
             </div>
          </div>
        )}

        {/* Marketing Settings Section */}
        {isManagingSettings && (
           <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border-l-4 border-indigo-500">
             <div className="flex justify-between mb-6">
               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BarChart size={20} /> Configurações de Marketing (Pixel & Analytics)
               </h2>
               <button onClick={() => setIsManagingSettings(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
             </div>
             
             <div className="bg-indigo-50 p-4 rounded-lg mb-6 text-sm text-indigo-800">
                Insira os IDs fornecidos pelas plataformas. Os scripts serão injetados automaticamente no site.
             </div>

             <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Google Tag Manager / Analytics ID</label>
                   <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-500 px-3 py-2 rounded-l-md border border-r-0 border-gray-300">G- ou GTM-</span>
                      <input 
                         type="text" 
                         value={marketingSettings.googleTagId}
                         onChange={e => setMarketingSettings({...marketingSettings, googleTagId: e.target.value})}
                         placeholder="Ex: XXXXXXXX"
                         className="w-full border border-gray-300 rounded-r-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                   </div>
                   <p className="text-xs text-gray-500 mt-1">Exemplo: G-12345ABCDE</p>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Facebook Pixel ID</label>
                   <input 
                      type="text" 
                      value={marketingSettings.facebookPixelId}
                      onChange={e => setMarketingSettings({...marketingSettings, facebookPixelId: e.target.value})}
                      placeholder="Ex: 123456789012345"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                   />
                   <p className="text-xs text-gray-500 mt-1">Apenas o número do ID.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Salvar Configurações
                </button>
             </form>
           </div>
        )}

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
        {(isCreating || isEditing) && !isManagingAmenities && !isManagingSettings && (
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
                          disabled={isUploading}
                       />
                       <label 
                          htmlFor="videoUpload" 
                          className="cursor-pointer flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium text-sm transition h-full whitespace-nowrap"
                       >
                          {isUploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16} />} 
                          Upload Vídeo
                       </label>
                     </div>
                   </div>
                   
                   {formData.videoUrl && (
                      <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                         <span className="font-bold">Vídeo selecionado!</span>
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
                <p className="text-xs text-gray-500 mb-4">A primeira imagem será usada como capa.</p>

                {/* Add Image Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                   <div className="flex-grow flex gap-2">
                      <input 
                         type="url" 
                         placeholder="Cole um link de imagem (https://...)" 
                         value={urlInput}
                         onChange={e => setUrlInput(e.target.value)}
                         className="flex-grow border border-gray-300 rounded-md p-2 text-sm"
                         disabled={formData.gallery.length >= 10 || isUploading}
                      />
                      <button 
                         type="button" 
                         onClick={handleAddUrl}
                         disabled={!urlInput || formData.gallery.length >= 10 || isUploading}
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
                         disabled={formData.gallery.length >= 10 || isUploading}
                      />
                      <label 
                         htmlFor="fileUpload" 
                         className={`cursor-pointer flex items-center gap-2 bg-[#d65066] text-white px-4 py-2 rounded-md hover:bg-[#c03e53] font-medium text-sm transition ${formData.gallery.length >= 10 || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                         {isUploading ? <Loader2 className="animate-spin" size={18}/> : <Upload size={18} />} 
                         Upload Fotos
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
                  
                  {formData.gallery.length === 0 && !isUploading && (
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
                 <p className="text-xs text-gray-500 mb-4">Adicione os intervalos de datas em que o imóvel está disponível.</p>
                 
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

                 {(formData.availableDates || []).length > 0 ? (
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
                <button 
                  type="submit" 
                  disabled={isSaving || isUploading}
                  className="flex items-center gap-2 bg-[#d65066] text-white px-6 py-2 rounded-md hover:bg-[#c03e53] font-bold disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Salvar Imóvel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Area */}
        {!isCreating && !isEditing && !isManagingAmenities && !isManagingSettings && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <div className="flex gap-4">
                  <h3 className="font-bold text-gray-700 pt-2">Imóveis ({properties.length})</h3>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => setIsManagingSettings(true)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition font-medium text-sm">
                     <BarChart size={18} /> Marketing
                  </button>
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
                            <img className="h-10 w-10 rounded-full object-cover" src={prop.imageUrl || 'https://via.placeholder.com/150'} alt="" />
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
