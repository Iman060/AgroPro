import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Check, TrendingUp, Clock, Radar, BarChart3, Eye, Lock, Database, History } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="text-green-500 text-3xl">🌾</div>
              <h2 className="text-lg font-bold tracking-tight">AgroPro</h2>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-8">
              <div className="flex items-center gap-8">
                <Link to="/about" className="text-gray-300 hover:text-green-500 transition-colors text-sm font-medium">Haqqımızda</Link>
                <Link to="/contact" className="text-gray-300 hover:text-green-500 transition-colors text-sm font-medium">Əlaqə</Link>
                <span className="text-gray-500 text-sm">|</span>
                <span className="text-white text-sm font-bold">AZ</span>
              </div>
              <Link 
                to="/profile"
                className="flex items-center justify-center px-4 h-9 bg-green-500 hover:bg-green-600 rounded-lg transition-all text-slate-950 text-sm font-bold"
              >
                Giriş
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950">
            <div className="px-4 py-4 space-y-3">
              <Link to="/about" className="block text-gray-300 hover:text-green-500 transition-colors text-sm font-medium">Haqqımızda</Link>
              <Link to="/contact" className="block text-gray-300 hover:text-green-500 transition-colors text-sm font-medium">Əlaqə</Link>
              <Link 
                to="/profile"
                className="block px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-all text-slate-950 text-sm font-bold text-center"
              >
                Giriş
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] -z-10"></div>
          
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 w-fit mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Yeni nəsil idarəetmə</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Ferma idarəetməsini <span className="text-green-500">ağıllı şəkildə</span> idarə edin
              </h1>
              
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 font-light">
                Əkin sahələri, məhsul partiyaları, suvarma hadisələri və qeydləri tək paneldən izləyin. Məlumatları qərara çevirin.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                <Link 
                  to="/profile"
                  className="flex items-center justify-center rounded-lg h-12 px-8 bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20 transition-all text-slate-950 text-base font-bold"
                >
                  Giriş et
                </Link>
                <Link 
                  to="/dashboard"
                  className="flex items-center justify-center rounded-lg h-12 px-8 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white transition-all text-base font-bold group"
                >
                  İdarə Paneli
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-400 mt-2">
                <div className="flex items-center gap-1">
                  <Check className="text-green-500" size={18} />
                  <span>Pulsuz istifadə</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="text-green-500" size={18} />
                  <span>Real vaxt izləmə</span>
                </div>
              </div>
            </div>

            {/* Farm Image */}
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="relative w-full h-full rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800&q=80" 
                  alt="Green farming field with crops"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-400">Real vaxt izləmə</span>
                  </div>
                  <p className="text-xs text-gray-300">Sahələrinizi və məhsullarınızı bir paneldən idarə edin</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof with Farm Images */}
        <section className="py-16 border-y border-slate-800 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-gray-400 text-sm font-semibold uppercase tracking-widest mb-12">
              Real kənd təsərrüfatı prosesləri üçün hazırlanıb
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" 
                  alt="Green farming"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm">🌱 AgroTech</p>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" 
                  alt="Irrigation system"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm">💧 Suvarma.az</p>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" 
                  alt="Green fields"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm">🌾 GreenField</p>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" 
                  alt="Organic farming"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm">☀️ OrganicLife</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Əsas İmkanlar</h2>
              <p className="text-gray-400 text-lg">
                Fermanızı idarə etmək üçün lazım olan bütün alətlər bir yerdə. Mürəkkəb prosesləri sadələşdirin.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "📊",
                  title: "Sahə və Məhsul Partiyası İdarəetməsi",
                  description: "Hər bir sahənin və məhsul partiyasının statusunu real vaxt rejimində izləyin. Status tarixçəsi və məhsul dövriyyəsini asanlıqla idarə edin.",
                  image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                },
                {
                  icon: "💧",
                  title: "Hadisə əsaslı Suvarma Sistemi",
                  description: "Suvarma hadisələrini planlaşdırın və icra edin. Gecikmələri avtomatik aşkar edin və kritik vəziyyətləri izləyin.",
                  image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                },
                {
                  icon: "📝",
                  title: "Qeydlər və Audit Tarixçəsi",
                  description: "Bütün əməliyyatların tam tarixçəsini saxlayın. Gübrələmə, xəstəlik, müşahidə və yığım proseslərini detallı qeyd edin.",
                  image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-0 rounded-2xl bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-colors overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-lg bg-slate-800/90 backdrop-blur flex items-center justify-center group-hover:bg-green-500 group-hover:text-slate-950 transition-colors text-3xl">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Necə işləyir?</h2>
              <p className="text-gray-400">Dörd sadə addımda fermanızı rəqəmsallaşdırın.</p>
            </div>
            
            <div className="relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-800"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {[
                  { num: 1, title: "Sahəni və məhsul partiyasını əlavə et", desc: "Sahələrinizi qeydiyyata alın və hər bir məhsul partiyasını sistemə daxil edin." },
                  { num: 2, title: "Status və suvarmanı planla", desc: "Vegetasiya dövrünə uyğun suvarma planı yaradın və status dəyişikliklərini izləyin." },
                  { num: 3, title: "Qeydləri saxla", desc: "Gündəlik fəaliyyətləri, müşahidələri və əməliyyatları sistemə daxil edin." },
                  { num: 4, title: "Paneldən hər şeyi izlə", desc: "İdarə panelindən bütün məlumatları görün, analitik hesabatlar alın və bildirişlərə nəzarət edin." }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className={`w-24 h-24 rounded-full ${i === 0 ? 'bg-slate-900 border-2 border-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-900 border-2 border-slate-700'} flex items-center justify-center text-2xl font-bold md:mx-auto`}>
                      {step.num}
                    </div>
                    <div className="md:text-center">
                      <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:h-[600px] bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80" 
                  alt="Green farming field with modern agriculture"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-slate-900/40 to-slate-900/80"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-700">
                  <div className="flex items-center gap-4 mb-2">
                    <TrendingUp className="text-green-500" />
                    <span className="font-bold">Məhsuldarlıq Artımı</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 w-[75%] h-full rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Keçən il</span>
                    <span className="text-green-500 font-bold">+24%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Fermanızın gələcəyini bu gündən qurun
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Ənənəvi üsullardan rəqəmsal idarəetməyə keçid edin və nəticələri dərhal görün.
                  </p>
                </div>
                
                <div className="grid gap-8">
                  {[
                    { icon: Clock, title: "Vaxta qənaət", desc: "Avtomatlaşdırılmış hesabatlar və tapşırıqlar sayəsində idarəetməyə sərf olunan vaxtı 40% azaldın." },
                    { icon: Radar, title: "Risklərin erkən aşkarlanması", desc: "Problemləri böyümədən əvvəl aşkar edin. Xəstəlik və suvarma gecikmələri risklərini öncədən görün." },
                    { icon: BarChart3, title: "Məlumat əsaslı qərarlar", desc: "Hisslərə deyil, dəqiq rəqəmlərə əsaslanaraq qərar verin. Gəlirliliyi artırın." },
                    { icon: Eye, title: "Şəffaf idarəetmə", desc: "Bütün əməliyyatların tam tarixçəsi. Kimin nə vaxt nə etdiyi hər zaman qeydiyyatdadır." }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex-shrink-0 flex items-center justify-center text-green-500">
                        <benefit.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                        <p className="text-gray-400">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="py-16 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-2xl font-bold mb-4">Məlumatlarınız bizim üçün dəyərlidir</h3>
                <p className="text-gray-400">
                  Biz kənd təsərrüfatı məlumatlarının təhlükəsizliyinə və bütövlüyünə zəmanət veririk.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                {[
                  { icon: Lock, text: "Etibarlı infrastruktur" },
                  { icon: History, text: "Məlumatlar silinmir" },
                  { icon: Database, text: "Strukturlaşdırılmış data" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon className="text-green-500" size={20} />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden flex flex-col items-center text-center px-4">
          <div className="absolute inset-0 -z-10">
            <img 
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" 
              alt="Farm landscape"
              className="w-full h-full object-cover opacity-20"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80';
              }}
            />
            <div className="absolute inset-0 bg-green-500/5"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 max-w-3xl relative z-10">
            Ferma idarəetməsində nəzarəti əlinizə alın
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl relative z-10">
            Bu gün minlərlə fermer kimi siz də işinizi asanlaşdırın. Bizimlə inkişaf edin.
          </p>
          <Link 
            to="/profile"
            className="flex items-center justify-center rounded-lg h-14 px-10 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all text-slate-950 text-lg font-bold relative z-10"
          >
            Giriş et
          </Link>
          <p className="mt-4 text-sm text-gray-400 relative z-10">Pulsuz istifadə</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌾</span>
                <span className="font-bold text-xl">AgroPro</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Kənd təsərrüfatı üçün müasir həllər. Məhsuldarlığı artırın, xərcləri azaldın.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Platforma</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/about" className="text-gray-400 hover:text-green-500 transition-colors text-sm">Haqqımızda</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-green-500 transition-colors text-sm">İdarə Paneli</Link></li>
                <li><Link to="/fields" className="text-gray-400 hover:text-green-500 transition-colors text-sm">Sahələr</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Dəstək</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/contact" className="text-gray-400 hover:text-green-500 transition-colors text-sm">Əlaqə</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-green-500 transition-colors text-sm">Haqqımızda</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">Təlimatlar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Hüquqi</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">Məxfilik siyasəti</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">İstifadə şərtləri</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2024 AgroPro. Bütün hüquqlar qorunur.</p>
            <div className="flex items-center gap-4">
              <span className="font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800 text-sm">AZ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
