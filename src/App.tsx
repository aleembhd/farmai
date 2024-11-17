import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sprout, Droplets, Bug, Menu, MessageCircle, LineChart } from 'lucide-react';
import { translations } from './translations';
import LanguageSelector from './components/LanguageSelector';
import FeatureCard from './components/FeatureCard';
import HowItWorks from './components/HowItWorks';
import TestimonialCarousel from './components/TestimonialCarousel';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CropSelection from './pages/CropSelection';
import DiseasePrediction from './pages/DiseasePrediction';
import ImageAnalysis from './components/ImageAnalysis';

// Language context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
});

// Language Provider Component
function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Main App Component
function HomePage() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const t = translations[language as keyof typeof translations] || translations.english;

  // Add error boundary for undefined translations
  if (!t || !t.nav) {
    console.error('Translation missing for:', language);
    return <div>Loading...</div>;
  }

  // Update the mobile navigation click handlers
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    const headerOffset = 64; // height of your header
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">FarmAI</span>
            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-green-600 transition-colors"
              onClick={(e) => handleNavClick(e, 'features')}
            >
              {t.nav.features}
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-600 hover:text-green-600 transition-colors"
              onClick={(e) => handleNavClick(e, 'how-it-works')}
            >
              {t.nav.how_it_works}
            </a>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-green-600 transition-colors"
              onClick={(e) => handleNavClick(e, 'about')}
            >
              {t.nav.about}
            </a>
            <a 
              href="#contact" 
              className="text-gray-600 hover:text-green-600 transition-colors"
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              {t.nav.contact}
            </a>
            <a 
              href="#faq" 
              className="text-gray-600 hover:text-green-600 transition-colors"
              onClick={(e) => handleNavClick(e, 'faq')}
            >
              FAQ
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t transform transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-4 py-4 space-y-4 bg-white">
              <a 
                href="#features" 
                className="block text-gray-600 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                onClick={(e) => handleNavClick(e, 'features')}
              >
                {t.nav.features}
              </a>
              <a 
                href="#how-it-works" 
                className="block text-gray-600 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                onClick={(e) => handleNavClick(e, 'how-it-works')}
              >
                {t.nav.how_it_works}
              </a>
              <a 
                href="#about" 
                className="block text-gray-600 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                onClick={(e) => handleNavClick(e, 'about')}
              >
                {t.nav.about}
              </a>
              <a 
                href="#contact" 
                className="block text-gray-600 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                {t.nav.contact}
              </a>
              <a 
                href="#faq" 
                className="block text-gray-600 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                onClick={(e) => handleNavClick(e, 'faq')}
              >
                FAQ
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-20 lg:py-32 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  {t.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
                              transition-colors w-full sm:w-auto flex items-center justify-center space-x-2"
                  >
                    <span>Chatbot</span>
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button 
                    className="px-8 py-3 border border-green-600 text-green-600 rounded-lg 
                              hover:bg-green-50 transition-colors w-full sm:w-auto flex items-center justify-center space-x-2"
                  >
                    <span>Predictions</span>
                    <LineChart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/header-img.jpeg"
                    alt="Traditional and Modern Farming Methods"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t.features.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-auto max-w-7xl">
              <FeatureCard
                Icon={Sprout}
                title={t.features.cropSelection.title}
                description={t.features.cropSelection.description}
                iconColor="text-green-600"
                buttonColor="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/crop-selection')}
              />
              <FeatureCard
                Icon={Droplets}
                title={t.features.fertilizerAdvice.title}
                description={t.features.fertilizerAdvice.description}
                iconColor="text-blue-600"
                buttonColor="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  console.log('Fertilizer Advice clicked');
                }}
              />
              <FeatureCard
                Icon={Bug}
                title={t.features.diseasePrediction.title}
                description={t.features.diseasePrediction.description}
                iconColor="text-red-600"
                buttonColor="bg-red-600 hover:bg-red-700"
                onClick={() => navigate('/disease-prediction')}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks howItWorks={t.howItWorks} />

        {/* Testimonials Section */}
        <TestimonialCarousel testimonials={t.testimonials} />
      </main>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t.about.title}</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">{t.about.mission.title}</h3>
                  <p className="text-gray-600">{t.about.mission.description}</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">{t.about.whyChooseUs.title}</h3>
                  <p className="text-gray-600">{t.about.whyChooseUs.description}</p>
                </div>
                
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                  <h3 className="text-xl font-semibold text-amber-700 mb-3">{t.about.approach.title}</h3>
                  <p className="text-gray-600">{t.about.approach.description}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/about-us-img.png"
                    alt="About FarmAI"
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t.contact.title}</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.contact.form.message}
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
                  >
                    {t.contact.form.submit}
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">{t.contact.connect.title}</h3>
                  <p className="text-gray-600">{t.contact.connect.description}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">{t.contact.office.title}</h3>
                  <address className="not-italic text-gray-600 space-y-2">
                    {t.contact.office.address.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </address>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">{t.contact.info.title}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>{t.contact.info.email}</p>
                    <p>{t.contact.info.phone}</p>
                    <p>{t.contact.info.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t.faq.title}</h2>
            
            <div className="space-y-4">
              {t.faq.questions.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-lg border border-gray-200 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-6">
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    <span className="ml-6 flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">{t.footer.copyright}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                {t.footer.terms}
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                {t.footer.privacy}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Export the wrapped component
export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crop-selection" element={<CropSelection />} />
        <Route path="/disease-prediction" element={<DiseasePrediction />} />
        <Route path="/plant-analysis" element={<ImageAnalysis />} />
      </Routes>
    </LanguageProvider>
  );
}