import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Globe, MonitorSmartphone, Target, MessageSquare, Cpu, Database, TrendingUp, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';

const CAROUSEL_IMAGES = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920'
];

const LandingPage = () => {
    const { addLead } = useCrm();
    const [formData, setFormData] = useState({ name: '', phone: '', company: '', businessType: '' });
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [submitStatus, setSubmitStatus] = useState('idle'); // idle | submitting | success

    // Auto-play carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImgIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');

        // Simulating network delay and wiring straight to our Global Context!
        setTimeout(() => {
            addLead({
                id: 'LP-' + Date.now(),
                columnId: 'new',
                name: formData.name,
                phone: formData.phone,
                company: formData.company,
                cnpj: '',
                email: '',
                notes: `Capturado via Landing Page. Nicho: ${formData.businessType}`,
                date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
                value: 0
            });

            setSubmitStatus('success');
            setFormData({ name: '', phone: '', company: '', businessType: '' });

            setTimeout(() => setSubmitStatus('idle'), 6000);
        }, 1200);
    };

    const nextImg = () => setCurrentImgIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    const prevImg = () => setCurrentImgIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);

    return (
        <div className="landing-page">
            {/* 1. HERO SECTION */}
            <section style={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6rem 0 4rem 0'
            }}>
                {/* Background Image Carousel */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentImgIndex}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${CAROUSEL_IMAGES[currentImgIndex]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    </AnimatePresence>
                    {/* Dark Overlay to make text readable */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(10, 37, 64, 0.8) 0%, rgba(10, 37, 64, 0.95) 100%)',
                        zIndex: 1
                    }} />
                </div>

                {/* Carousel Navigation Arrows */}
                <button onClick={prevImg} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: 'rgba(255,255,255,0.7)', padding: '1rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    <ChevronLeft size={48} />
                </button>
                <button onClick={nextImg} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: 'rgba(255,255,255,0.7)', padding: '1rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    <ChevronRight size={48} />
                </button>

                {/* Pagination Dots */}
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
                    {CAROUSEL_IMAGES.map((_, i) => (
                        <div key={i} style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: i === currentImgIndex ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.4)',
                            transition: 'all 0.3s ease', cursor: 'pointer',
                            transform: i === currentImgIndex ? 'scale(1.2)' : 'scale(1)'
                        }} onClick={() => setCurrentImgIndex(i)} />
                    ))}
                </div>

                {/* Hero Content Overlay */}
                <div className="container" style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-full)', color: '#93C5FD', fontWeight: 600, fontSize: '0.875rem' }}
                    >
                        A NOVA GERAÇÃO DO MARKETING DIGITAL
                    </motion.div>

                    <motion.h1
                        className="text-5xl"
                        style={{ maxWidth: '900px', marginBottom: '1.5rem', lineHeight: '1.1', color: 'white' }}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Transforme sua empresa em uma <span style={{ color: 'var(--accent-secondary)', textShadow: '0 0 20px rgba(59,130,246,0.5)' }}>máquina de vendas</span> com IA, automação e tráfego
                    </motion.h1>

                    <motion.p
                        className="text-xl"
                        style={{ maxWidth: '700px', marginBottom: '3rem', color: '#cbd5e1', lineHeight: '1.7' }}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Ajudamos pequenas empresas e óticas a capturar mais leads e aumentar o faturamento usando sistemas inteligentes e tecnologia de ponta.
                    </motion.p>

                    <motion.div
                        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="btn btn-primary btn-animated" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem', animation: 'pulse-glow 2s infinite' }}>
                            <MessageSquare size={20} /> Falar no WhatsApp
                        </a>
                        <a href="#contact" className="btn btn-animated" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                            Agendar Reunião
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* 2. TRUST SECTION */}
            <section className="section" style={{ padding: '3rem 0', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                <div className="container flex justify-center flex-wrap" style={{ gap: '3rem' }}>
                    <div className="flex items-center" style={{ gap: '0.75rem', fontSize: '1.125rem', fontWeight: '500' }}>
                        <CheckCircle color="var(--success)" size={24} /> Estratégias focadas em resultados
                    </div>
                    <div className="flex items-center" style={{ gap: '0.75rem', fontSize: '1.125rem', fontWeight: '500' }}>
                        <CheckCircle color="var(--success)" size={24} /> Crescimento guiado por automação
                    </div>
                    <div className="flex items-center" style={{ gap: '0.75rem', fontSize: '1.125rem', fontWeight: '500' }}>
                        <CheckCircle color="var(--success)" size={24} /> Sistemas escaláveis
                    </div>
                </div>
            </section>

            {/* 3. SERVICES GRID */}
            <section id="services" className="section bg-primary">
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h2 className="text-4xl text-gradient">Soluções Completas de Crescimento</h2>
                        <p className="text-lg text-secondary" style={{ marginTop: '1rem' }}>Tudo que você precisa para dominar o mercado</p>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <ServiceCard icon={<Globe />} title="Criação de Sites" description="Sites otimizados para performance e focados em alta conversão para sua marca." />
                        <ServiceCard icon={<MonitorSmartphone />} title="Landing Pages" description="Funis precisos criados especificamente para capturar leads e gerar vendas." />
                        <ServiceCard icon={<Target />} title="Tráfego Pago" description="Campanhas no Google e Meta Ads baseadas em dados para escalar sua aquisição." />
                        <ServiceCard icon={<MessageSquare />} title="Automação no WhatsApp" description="Robôs inteligentes que respondem, nutrem e fecham vendas 24h por dia." />
                        <ServiceCard icon={<Cpu />} title="Soluções com IA" description="Usamos Inteligência Artificial para otimizar operações e personalizar a experiência do cliente." />
                        <ServiceCard icon={<Database />} title="CRM & Sistemas Customizados" description="Ferramentas internas feitas sob medida para gerenciar suas operações e vendas." />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <ServiceCard icon={<TrendingUp />} title="Gestão Completa de Crescimento" description="Uma parceria completa onde nós gerenciamos e escalamos todo o seu digital." featured={true} />
                    </div>
                </div>
            </section>

            {/* 4. DIFFERENTIATOR SECTION */}
            <section className="section" style={{ backgroundColor: 'var(--accent-primary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 60%)' }} />
                <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <h2 className="text-4xl md:text-5xl" style={{ marginBottom: '2rem' }}>"Nós não vendemos serviços.<br />Nós construímos <span style={{ color: 'var(--accent-secondary)' }}>sistemas de crescimento</span>."</h2>
                        <p className="text-xl" style={{ color: '#cbd5e1', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                            Diferente de agências tradicionais que apenas sobem anúncios ou criam sites bonitos, a NexaFlow arquiteta estruturas de receita. Alinhamos automação, posicionamento de marca e marketing inteligente para garantir escala previsível.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 5. PROCESS SECTION */}
            <section id="process" className="section bg-primary">
                <div className="container">
                    <h2 className="text-4xl text-center text-gradient" style={{ marginBottom: '4rem' }}>Como Escalamos seu Negócio</h2>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', position: 'relative' }}>
                        <ProcessStep number="1" title="Diagnóstico" desc="Análise profunda das suas métricas atuais, gargalos e oportunidades de mercado." />
                        <ProcessStep number="2" title="Planejamento" desc="Criação de um funil customizado e arquitetura de automação de vendas." />
                        <ProcessStep number="3" title="Execução" desc="Implementação dos sistemas, lançamento de campanhas e refinos na estrutura." />
                        <ProcessStep number="4" title="Escala" desc="Análise de dados contínua para otimizar performance e crescer exponencialmente." />
                    </div>
                </div>
            </section>

            {/* 6 & 7. CTA & LEAD FORM SECTION */}
            <section id="contact" className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div className="grid responsive-grid" style={{ gap: '4rem', alignItems: 'center' }}>

                        <div className="cta-content">
                            <h2 className="text-5xl" style={{ marginBottom: '1.5rem', lineHeight: '1.2' }}>Pronto para faturar mais?</h2>
                            <p className="text-lg" style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                                Agende uma consultoria gratuita ou fale imediatamente pelo WhatsApp. Vamos discutir como criar o seu sistema de crescimento.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', width: '100%', maxWidth: '350px' }}>
                                <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="btn btn-primary btn-animated" style={{ padding: '1.25rem', justifyContent: 'center', animation: 'pulse-glow 2s infinite', width: '100%' }}>
                                    <MessageSquare size={20} /> Chamar no WhatsApp
                                </a>
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>ou</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-2xl" style={{ marginBottom: '2rem' }}>Agendar Estratégia</h3>
                            {submitStatus === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        padding: '2rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)',
                                        border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-lg)', marginTop: '1rem'
                                    }}
                                >
                                    <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
                                    <h4 className="text-xl font-bold" style={{ marginBottom: '0.5rem', color: 'var(--success)' }}>Sucesso!</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>Sua solicitação foi enviada. Nossa equipe entrará em contato em breve para agendarmos sua estratégia.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome</label>
                                        <input type="text" required className="input-field" placeholder="Seu nome" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={submitStatus === 'submitting'} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Telefone / WhatsApp</label>
                                        <input type="tel" required className="input-field" placeholder="(11) 99999-9999" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} disabled={submitStatus === 'submitting'} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome da Empresa</label>
                                        <input type="text" required className="input-field" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} disabled={submitStatus === 'submitting'} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tipo de Negócio</label>
                                        <select required className="input-field" value={formData.businessType} onChange={e => setFormData({ ...formData, businessType: e.target.value })} style={{ appearance: 'none' }} disabled={submitStatus === 'submitting'}>
                                            <option value="" disabled>Selecione seu nicho</option>
                                            <option value="Ótica">Ótica</option>
                                            <option value="Negócio Local">Negócio Local</option>
                                            <option value="E-commerce">E-commerce</option>
                                            <option value="Serviços">Prestador de Serviços</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                    <button type="submit" disabled={submitStatus === 'submitting'} className="btn btn-primary btn-animated" style={{ marginTop: '1rem', width: '100%', opacity: submitStatus === 'submitting' ? 0.7 : 1 }}>
                                        {submitStatus === 'submitting' ? 'Enviando...' : <><ArrowRight size={18} /> Solicitar Consultoria</>}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

// Helper Components
const ServiceCard = ({ icon, title, description, featured = false }) => {
    return (
        <motion.div
            className="card"
            style={{
                border: featured ? '2px solid var(--accent-secondary)' : '1px solid var(--border-color)',
                maxWidth: featured ? '600px' : '100%',
                width: '100%'
            }}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
        >
            <div style={{
                width: '56px', height: '56px', borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
            }}>
                {icon}
            </div>
            <h3 className="text-xl" style={{ marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{description}</p>
        </motion.div>
    );
};

const ProcessStep = ({ number, title, desc }) => {
    return (
        <motion.div
            style={{ position: 'relative', padding: '2rem', zIndex: 1 }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--grad-primary)', color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
            }}>
                {number}
            </div>
            <h3 className="text-xl" style={{ marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </motion.div>
    );
};

export default LandingPage;
