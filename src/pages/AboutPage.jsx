import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, CheckCircle, Target, Zap, Shield, Users, Award, Heart, Globe, Database, BarChart3, Eye } from 'lucide-react';

export default function AboutPage() {
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
        <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] -z-10"></div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 w-fit mx-auto mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Haqqımızda</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
              AgroPro <span className="text-green-500">Haqqında</span>
            </h1>
            
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light">
              Kənd təsərrüfatı idarəetməsini asanlaşdıran müasir platforma. Fermerlərə məhsullarını, 
              suvarma cədvəllərini və kənd təsərrüfatı məlumatlarını effektiv şəkildə idarə etməyə kömək edirik.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Farm management"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <Target className="text-green-500" size={32} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">Missiyamız</h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Fermerlərə məhsullarını, suvarma cədvəllərini və kənd təsərrüfatı məlumatlarını 
                  effektiv şəkildə idarə etməyə kömək etmək. Texnologiyadan istifadə edərək, 
                  kənd təsərrüfatı proseslərini sadələşdiririk və daha yaxşı qərarlar qəbul etməyə 
                  imkan yaradırıq.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
                    <Heart className="text-green-500" size={18} />
                    <span className="text-sm font-medium">Fermerlər üçün</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
                    <Globe className="text-green-500" size={18} />
                    <span className="text-sm font-medium">Azərbaycan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nə Təklif Edirik</h2>
              <p className="text-gray-400 text-lg">
                Kənd təsərrüfatı idarəetməsi üçün lazım olan bütün alətlər bir yerdə
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: "Tam Məhsul və Sahə İdarəetməsi",
                  description: "Bütün sahələrinizi və məhsul partiyalarınızı bir paneldən idarə edin. Status tarixçəsi və trend analizi ilə məlumat əsaslı qərarlar qəbul edin."
                },
                {
                  icon: Zap,
                  title: "İntelligent Suvarma Planlaşdırması",
                  description: "Avtomatik suvarma planlaşdırması və gecikmə xəbərdarlıqları. Məhsullarınızın su ehtiyacını optimal şəkildə idarə edin."
                },
                {
                  icon: Shield,
                  title: "Qeydlər və Müşahidələr Sistemi",
                  description: "Gündəlik fəaliyyətləri, müşahidələri və əməliyyatları detallı qeyd edin. Gübrələmə, xəstəlik və yığım proseslərini izləyin."
                },
                {
                  icon: Database,
                  title: "JSON Məlumat İdxalı",
                  description: "Xarici məlumatları asanlıqla idxal edin. Konflikt həll etmə və audit tarixçəsi ilə məlumatlarınızın bütövlüyünü qoruyun."
                },
                {
                  icon: BarChart3,
                  title: "Status Tarixçəsi və Trend Analizi",
                  description: "Məhsul statuslarının tam tarixçəsi. Trend analizi ilə gələcək performansı proqnozlaşdırın və riskləri azaldın."
                },
                {
                  icon: Eye,
                  title: "Real Vaxt Monitorinq",
                  description: "Sahələrinizi və məhsullarınızı real vaxt rejimində izləyin. Kritik vəziyyətləri dərhal aşkar edin və tədbir görün."
                }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-slate-950 transition-colors">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Texnologiyalar</h2>
              <p className="text-gray-400 text-lg">
                Sistemimiz müasir və etibarlı texnologiyalardan istifadə edir
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "React", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                { name: "Tailwind CSS", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
                { name: "React Router", color: "bg-green-500/10 text-green-400 border-green-500/20" },
                { name: "ApexCharts", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                { name: "Lucide Icons", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
                { name: "Modern UI/UX", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" }
              ].map((tech, idx) => (
                <span 
                  key={idx}
                  className={`px-6 py-3 rounded-full border font-semibold text-sm ${tech.color} transition-all hover:scale-105`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Fermerlər üçün",
                  description: "Hər bir fermerin ehtiyaclarını anlayırıq və onlara ən yaxşı həlləri təqdim edirik."
                },
                {
                  icon: Award,
                  title: "Keyfiyyət",
                  description: "Yüksək keyfiyyətli kod və istifadəçi təcrübəsi bizim prioritetimizdir."
                },
                {
                  icon: Heart,
                  title: "Dəyərlər",
                  description: "Şəffaflıq, etibarlılıq və innovasiya bizim əsas dəyərlərimizdir."
                }
              ].map((value, i) => {
                const Icon = value.icon;
                return (
                  <div key={i} className="text-center p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-green-500/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <Icon className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
            Bizimlə birlikdə kənd təsərrüfatınızı inkişaf etdirin
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl relative z-10">
            Bu gün minlərlə fermer kimi siz də işinizi asanlaşdırın. Bizimlə inkişaf edin.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link 
              to="/profile"
              className="flex items-center justify-center rounded-lg h-14 px-10 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all text-slate-950 text-lg font-bold"
            >
              Giriş et
            </Link>
            <Link 
              to="/contact"
              className="flex items-center justify-center rounded-lg h-14 px-10 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white transition-all text-lg font-bold"
            >
              Əlaqə
            </Link>
          </div>
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
