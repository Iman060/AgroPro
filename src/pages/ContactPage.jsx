import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Mail, Phone, MapPin, Send, MessageCircle, Clock, Wheat } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { emailjsConfig } from '../config/emailjs';

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if EmailJS is configured
      if (emailjsConfig.publicKey === 'YOUR_PUBLIC_KEY') {
        // Fallback: Use mailto link if EmailJS is not configured
        const mailtoLink = `mailto:omemmedzade@std.beu.edu.az?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Ad: ${formData.name}\nEmail: ${formData.email}\n\nMesaj:\n${formData.message}`)}`;
        window.location.href = mailtoLink;
        toast.success('Email proqramınız açılır...');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
        return;
      }

      // Send email using EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: emailjsConfig.recipientEmail,
      };

      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.publicKey
      );

      toast.success('Mesajınız uğurla göndərildi!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Email göndərmə xətası:', error);
      toast.error('Mesaj göndərilərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <Wheat size={32} className="text-green-500" />
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
        <section className="relative flex flex-col items-center justify-center min-h-[50vh] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] -z-10"></div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 w-fit mx-auto mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Bizimlə Əlaqə</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
              Bizimlə <span className="text-green-500">Əlaqə</span> Saxlayın
            </h1>
            
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light">
              Suallarınız, təklifləriniz və dəstək üçün buradayıq. Mesajınızı göndərin, biz sizə tezliklə cavab verəcəyik.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Əlaqə Məlumatları</h2>
                  <p className="text-gray-400 text-lg">
                    Bizimlə əlaqə saxlayın. Komandamız sizə kömək etmək üçün hazırdır.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors border border-green-500/20">
                      <Mail className="text-green-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <a 
                        href="mailto:omemmedzade@std.beu.edu.az" 
                        className="text-gray-400 hover:text-green-500 transition-colors"
                      >
                        omemmedzade@std.beu.edu.az
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                      <Phone className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Telefon</h3>
                      <a 
                        href="tel:+994123456789" 
                        className="text-gray-400 hover:text-green-500 transition-colors"
                      >
                        +994 12 345 67 89
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                      <MapPin className="text-purple-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Ünvan</h3>
                      <p className="text-gray-400">Bakı, Azərbaycan</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-green-500" size={20} />
                    <h3 className="font-bold">İş Saatları</h3>
                  </div>
                  <div className="space-y-2 text-gray-400">
                    <p>Bazar ertəsi - Cümə: 09:00 - 18:00</p>
                    <p>Şənbə - Bazar: Qeyri-iş günü</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="text-green-500" size={28} />
                  <h2 className="text-3xl font-bold">Mesaj Göndər</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                      Ad
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-950 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Adınızı daxil edin"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-950 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                      Mövzu
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-950 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Mesajın mövzusu"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                      Mesaj
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      rows="5"
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-950 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Mesajınızı buraya yazın..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg transition-all font-bold text-base ${
                      isSubmitting
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-slate-950 shadow-lg shadow-green-500/20 hover:shadow-green-500/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                        <span>Göndərilir...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Mesajı Göndər</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: MessageCircle,
                  title: "Tez Cavab",
                  description: "24 saat ərzində cavab veririk"
                },
                {
                  icon: Clock,
                  title: "7/24 Dəstək",
                  description: "Həftənin 7 günü, günün 24 saatı"
                },
                {
                  icon: Mail,
                  title: "Email Dəstəyi",
                  description: "Email vasitəsilə dəstək alın"
                }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-green-500/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-green-500" size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wheat size={24} />
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
