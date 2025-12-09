
import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const About: React.FC = () => {
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
    <div className="bg-white min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quem Somos</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Redefinindo a experiência de aluguel por temporada com foco em qualidade e hospitalidade.
          </p>
        </div>

        {/* Content Block 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <img 
              src="https://nandosilvadev.site/wp-content/uploads/2025/12/image-quem-somos.jpg" 
              alt="Sala de estar decorada MyBnB Flats" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
              style={{ maxHeight: 'none' }}
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-[#d65066] mb-6">Nossa História</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              A MYBNB Flats nasceu com o objetivo de oferecer hospedagens modernas, bem decoradas e com atendimento rápido, somos atualmente Super Host no Airbnb e temos notas máximas em outras plataformas. Trabalhamos com apartamentos completos, localizados em áreas estratégicas de Petrolina, ideais para quem busca praticidade e conforto em viagens de trabalho ou lazer.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Prezamos por limpeza, organização, Wi-Fi rápido e comunicação imediata com o hóspede. Nossa proposta é simples: entregar uma experiência de hospedagem que seja bonita, funcional e melhor do que o padrão encontrado nas plataformas tradicionais.
            </p>
          </div>
        </div>

        {/* Value Prop */}
        <div className="bg-gray-50 rounded-3xl p-12 text-center mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Nossa Proposta de Valor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4">
              <div className="w-16 h-16 bg-[#e8a633]/20 text-[#e8a633] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Conforto de Casa</h3>
              <p className="text-gray-500">Cozinhas equipadas, internet rápida e espaços pensados para viver, não apenas dormir.</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 bg-[#d65066]/20 text-[#d65066] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Serviço de Hotel</h3>
              <p className="text-gray-500">Roupas de cama premium, amenities de banho e equipe de limpeza profissional.</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Segurança Total</h3>
              <p className="text-gray-500">Imóveis em condomínios seguros e processo de reserva transparente e confiável.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <HelpCircle className="text-[#e8a633]" /> Perguntas Frequentes
            </h2>
            <p className="text-gray-500 mt-2">Tire suas dúvidas sobre nossa hospedagem.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg bg-gray-50 open:bg-white open:shadow-md transition-all duration-300">
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

      </div>
    </div>
  );
};

export default About;
