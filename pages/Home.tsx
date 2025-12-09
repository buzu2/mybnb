import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, HelpCircle, ChevronDown } from 'lucide-react';
import { useProperties } from '../contexts/PropertyContext';
import PropertyCard from '../components/PropertyCard';

const Home: React.FC = () => {
  const { properties } = useProperties();
  const featuredProperties = properties.filter(p => p.isFeatured).slice(0, 3);

  const faqs = [
    {
      question: "Como funciona o check-in automático?",
      answer: "Os apartamentos não têm chaves físicas, as portas possuem fechadura eletrônica e após a sua reserva confirmada será enviada uma senha personalizada e única para você."
    },
    {
      question: "O apartamento é equipado com roupa de cama e banho?",
      answer: "Sim, fornecemos tudo o que você precisa para uma estadia confortável."
    },
    {
      question: "O apartamento é equipado panelas, fogão e utensílios de cozinha?",
      answer: "Sim, a cozinha é completa e tem o básico que você precisará."
    },
    {
      question: "O apartamento possui ferro de passar e secador de cabelo?",
      answer: "Sim, você terá esses itens a disposição."
    },
    {
      question: "A região é segura?",
      answer: "Sim. Os flats ficam em áreas centrais, movimentadas e de fácil acesso, além disto o prédio tem segurança 24 hrs com portaria."
    },
    {
      question: "Como funciona o estacionamento?",
      answer: "O prédio possui vagas disponíveis e não precisa agendar, instruções de como usar a vaga de estacionamento serão enviadas após a reserva."
    },
    {
      question: "Há limite de horário para check-in?",
      answer: "Sim. Apesar da portaria funcionar 24hrs, o suporte ao checking através do WhatsApp funciona até as 22:00."
    },
    {
      question: "Aceita pets?",
      answer: "Não, de nenhum porte ou tipo."
    },
    {
      question: "Como faço a reserva?",
      answer: "Basta clicar no botão de WhatsApp e informar suas datas."
    },
    {
      question: "Tem Wi-Fi?",
      answer: "Sim. Todas as unidades possuem internet rápida."
    },
    {
      question: "Posso cancelar a reserva?",
      answer: "As regras podem variar. Consulte pelo WhatsApp antes de reservar."
    },
    {
      question: "Posso realizar atendimentos de trabalho?",
      answer: "Não. E visitas são controladas e devem ser autorizadas antes."
    },
    {
      question: "Quais os horários de Check-in e Check-out?",
      answer: "O check-in começa as 14:00 e o check-out é até as 12:00."
    },
    {
      question: "Os horários de Check-in e Check-out podem ser modificados?",
      answer: "Não, você não pode entrar antes das 14:00 ou sair depois das 12:00 a não ser que adicione reservas adicionais."
    },
    {
      question: "Tem café da manhã ou serve refeições?",
      answer: "Não. Como não somos um hotel não temos esses serviços."
    },
    {
      question: "Os apartamentos são compartilhados?",
      answer: "Não, você aluga o apartamento e fica apenas você e as pessoas que estão hospedadas com você."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Interior de apartamento de luxo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Aluguel por temporada em Petrolina <br className="hidden md:block"/>com conforto e decoração incrível.
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Flats completos, localização estratégica e atendimento imediato pelo WhatsApp
          </p>
          <Link 
            to="/apartments" 
            className="inline-flex items-center gap-2 bg-[#d65066] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#c03e53] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Ver Apartamentos <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-20 bg-[#FFFCEF]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <img 
            src="https://i.postimg.cc/hjX3ZGrM/logo-super.png" 
            alt="MyBnB Flats Logo" 
            className="mx-auto h-32 mb-6"
          />
          <span className="text-[#e8a633] font-bold uppercase tracking-widest text-sm mb-3 block">Nossa Proposta</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Design, Conforto e Praticidade</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Oferecemos uma curadoria exclusiva de imóveis para temporada. Cada apartamento é pensado para que você tenha a experiência de um hotel com o calor e a liberdade de uma casa. Check-in simplificado, suporte 24h e localizações estratégicas.
          </p>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-20 bg-[#FFFCEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Destaques</h2>
              <p className="text-gray-500">Os imóveis mais desejados pelos nossos hóspedes.</p>
            </div>
            <Link to="/apartments" className="hidden md:flex items-center text-[#d65066] font-semibold hover:underline">
              Ver todos <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/apartments" className="inline-block px-6 py-3 border-2 border-[#d65066] text-[#d65066] font-bold rounded-full hover:bg-[#d65066] hover:text-white transition">
              Ver todos os imóveis
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#FFFCEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">O que dizem nossos hóspedes</h2>
            <div className="w-20 h-1 bg-[#e8a633] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition duration-300">
              <Quote className="text-[#d65066] mb-4 w-10 h-10 opacity-20" />
              <p className="text-gray-600 italic mb-6 flex-grow">
                “Apartamento impecável, limpo e muito bem decorado. Atendimento rápido e atencioso. Voltarei sempre.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fcece9] text-[#d65066] rounded-full flex items-center justify-center font-bold text-sm">
                  AN
                </div>
                <div>
                  <div className="font-bold text-gray-900">Ana</div>
                  <div className="text-xs text-gray-500">São Paulo</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition duration-300">
              <Quote className="text-[#d65066] mb-4 w-10 h-10 opacity-20" />
              <p className="text-gray-600 italic mb-6 flex-grow">
                “Ótima localização, internet rápida e check-in super prático. Perfeito para quem vem a trabalho.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fcece9] text-[#d65066] rounded-full flex items-center justify-center font-bold text-sm">
                  MA
                </div>
                <div>
                  <div className="font-bold text-gray-900">Marcos</div>
                  <div className="text-xs text-gray-500">Recife</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition duration-300">
              <Quote className="text-[#d65066] mb-4 w-10 h-10 opacity-20" />
              <p className="text-gray-600 italic mb-6 flex-grow">
                “A estadia foi excelente! O flat é ainda melhor do que nas fotos.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fcece9] text-[#d65066] rounded-full flex items-center justify-center font-bold text-sm">
                  JÚ
                </div>
                <div>
                  <div className="font-bold text-gray-900">Júlia</div>
                  <div className="text-xs text-gray-500">Salvador</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#FFFCEF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <HelpCircle className="text-[#e8a633]" /> Perguntas Frequentes
            </h2>
            <p className="text-gray-500 mt-2">Tire suas dúvidas sobre nossa hospedagem.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg bg-white open:shadow-md transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-900 group-hover:text-[#d65066] transition-colors [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start text-left gap-3">
                    <span className="font-bold text-[#e8a633]">{index + 1}.</span>
                    {faq.question}
                  </span>
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180 ml-2">
                    <ChevronDown size={20} />
                  </span>
                </summary>

                <div className="px-4 pb-4 pt-0 text-gray-600 leading-relaxed ml-8 border-t border-transparent group-open:border-gray-100 group-open:pt-2">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials / Trust Proof (Extra based on Airbnb style) */}
      <section className="py-20 bg-[#d65066] text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center text-center gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-white/80">Hospedagens Realizadas</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2 flex justify-center items-center gap-2">4.9 <Star fill="white" size={28}/></div>
            <div className="text-white/80">Avaliação Média</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-white/80">Suporte ao Hóspede</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;