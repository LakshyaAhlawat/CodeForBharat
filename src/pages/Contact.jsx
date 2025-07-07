import { useState, useEffect } from "react";
import AOS from "aos";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    contactReason: "feedback"
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate floating contact icons
    const generateFloatingIcons = () => {
      const icons = [];
      for (let i = 0; i < 20; i++) {
        icons.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 4 + Math.random() * 6,
          icon: ['📧', '💬', '📞', '💌', '🌟', '✨', '💫'][Math.floor(Math.random() * 7)]
        });
      }
      setFloatingIcons(icons);
    };

    window.addEventListener('mousemove', handleMouseMove);
    generateFloatingIcons();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        contactReason: "feedback"
      });
    }, 5000);
  };

  const contactReasons = [
    { value: "feedback", label: "💭 General Feedback", icon: "💬" },
    { value: "bug", label: "🐛 Bug Report", icon: "🔧" },
    { value: "feature", label: "✨ Feature Request", icon: "💡" },
    { value: "business", label: "💼 Business Inquiry", icon: "🤝" },
    { value: "support", label: "🆘 Technical Support", icon: "⚙️" },
    { value: "partnership", label: "🤝 Partnership", icon: "🌟" }
  ];

  const socialLinks = [
    { name: "Email", icon: "📧", href: "mailto:contact@codeto-bharat.com", color: "from-red-500 to-pink-600" },
    { name: "Discord", icon: "💬", href: "#", color: "from-indigo-500 to-purple-600" },
    { name: "Twitter", icon: "🐦", href: "#", color: "from-blue-400 to-cyan-500" },
    { name: "LinkedIn", icon: "💼", href: "#", color: "from-blue-600 to-blue-800" },
    { name: "GitHub", icon: "⚡", href: "#", color: "from-gray-700 to-gray-900" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultimate Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Floating contact icons */}
        {floatingIcons.map((icon) => (
          <div
            key={icon.id}
            className="absolute text-2xl opacity-30 animate-float"
            style={{
              left: `${icon.x}px`,
              top: `${icon.y}px`,
              animationDelay: `${icon.delay}s`,
              animationDuration: `${icon.duration}s`,
            }}
          >
            {icon.icon}
          </div>
        ))}

        {/* Multi-layer animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-pink-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-6000"></div>
        </div>

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        {/* Advanced mouse follower gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/20 to-transparent rounded-full pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Ultimate Enhanced Header */}
          <div className="text-center mb-16 sm:mb-20" data-aos="fade-down">
            <div className="relative inline-block mb-12">
              {/* Floating contact particles */}
              <div className="absolute -top-12 -left-12 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute -top-8 -right-16 w-4 h-4 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-10 left-16 w-8 h-8 bg-cyan-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-12 -right-12 w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-3000"></div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                💬 Get In Touch
              </h1>
              
              <div className="text-2xl sm:text-3xl lg:text-4xl max-w-4xl mx-auto text-gray-300 leading-relaxed">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                  Let's Create Something Amazing Together
                </span>
                <br />
                <span className="text-lg sm:text-xl lg:text-2xl">
                  Your ideas, feedback, and collaboration fuel our innovation
                </span>
              </div>
            </div>

            {/* Enhanced decorative separator */}
            <div className="flex items-center justify-center mb-12">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <div className="w-12 h-12 mx-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full animate-ping"></div>
              </div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
            {/* Enhanced Contact Form */}
            <div 
              className="relative"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    📝 Send us a Message
                  </h2>
                  <p className="text-gray-300 text-lg">
                    We typically respond within 24 hours. Your message matters to us!
                  </p>
                </div>

                {submitted ? (
                  <div 
                    className="text-center py-16"
                    data-aos="zoom-in"
                  >
                    <div className="text-8xl mb-8 animate-bounce">✅</div>
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-xl text-gray-300 mb-8">
                      Thank you for reaching out! We'll get back to you soon.
                    </p>
                    <div className="flex justify-center items-center gap-3 text-gray-500">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce animation-delay-500"></div>
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce animation-delay-1000"></div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Reason Selection */}
                    <div>
                      <label className="block text-lg font-semibold mb-4 text-gray-200">
                        🎯 What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {contactReasons.map((reason) => (
                          <button
                            key={reason.value}
                            type="button"
                            onClick={() => setFormData({...formData, contactReason: reason.value})}
                            className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                              formData.contactReason === reason.value
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 border border-gray-600/50"
                            }`}
                          >
                            <div className="text-lg mb-1">{reason.icon}</div>
                            <div className="text-xs">{reason.label.split(' ').slice(1).join(' ')}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Form Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-gray-200">
                          👤 Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-gray-200">
                          📧 Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-3 text-gray-200">
                        📋 Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                        placeholder="Brief description of your message"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-3 text-gray-200">
                        💬 Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="6"
                        className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50 resize-none"
                        placeholder="Tell us more about your inquiry, feedback, or how we can help you..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-6 px-8 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 text-xl">
                        {isLoading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            🚀 Send Message
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Enhanced Contact Information & Social Links */}
            <div 
              className="space-y-8"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              {/* Contact Info Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
                  <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    🌟 Let's Connect
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-2xl hover:bg-gray-600/30 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl">
                        📧
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">Email Us</h4>
                        <p className="text-gray-300">contact@codeto-bharat.com</p>
                        <p className="text-sm text-gray-400">We respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-2xl hover:bg-gray-600/30 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl">
                        🌍
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">Global Community</h4>
                        <p className="text-gray-300">Building games worldwide</p>
                        <p className="text-sm text-gray-400">Join our growing community</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-2xl hover:bg-gray-600/30 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl">
                        ⚡
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">Quick Support</h4>
                        <p className="text-gray-300">Fast & reliable assistance</p>
                        <p className="text-sm text-gray-400">Get help when you need it</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
                  <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                    🚀 Follow Our Journey
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={social.name}
                        href={social.href}
                        className={`group relative overflow-hidden bg-gradient-to-r ${social.color} p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl text-center`}
                        data-aos="zoom-in"
                        data-aos-delay={600 + index * 100}
                      >
                        <div className="relative z-10">
                          <div className="text-4xl mb-3 group-hover:animate-bounce">{social.icon}</div>
                          <h4 className="text-xl font-bold text-white mb-2">{social.name}</h4>
                          <p className="text-sm text-white/80">Connect with us</p>
                        </div>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </a>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl border border-gray-600/50">
                    <h4 className="text-xl font-bold text-white mb-3 text-center">🎮 Join Our Gaming Community</h4>
                    <p className="text-gray-300 text-center mb-4">
                      Stay updated with the latest features, game releases, and community events!
                    </p>
                    <div className="flex justify-center">
                      <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-lg">
                        🔔 Get Notified
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced FAQ Section */}
          <div 
            className="mt-20 sm:mt-24"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
                <h3 className="text-3xl lg:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  ❓ Frequently Asked Questions
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      icon: "🎮",
                      question: "How do I create my first game?",
                      answer: "Simply choose a template from our collection and start customizing! Our intuitive editor makes game creation accessible to everyone."
                    },
                    {
                      icon: "🔧",
                      question: "Can I report bugs or issues?",
                      answer: "Absolutely! Use our contact form above or report issues directly in our Discord community. We fix bugs quickly and keep you updated."
                    },
                    {
                      icon: "💡",
                      question: "How can I suggest new features?",
                      answer: "We love feature requests! Share your ideas through our contact form, and our development team will review and consider them for future updates."
                    },
                    {
                      icon: "🤝",
                      question: "Are partnerships available?",
                      answer: "Yes! We're open to collaborations, sponsorships, and partnerships. Reach out to discuss how we can work together to grow the gaming community."
                    }
                  ].map((faq, index) => (
                    <div 
                      key={index}
                      className="p-6 bg-gray-700/30 rounded-2xl hover:bg-gray-600/30 transition-all duration-300 hover:scale-105"
                      data-aos="fade-up"
                      data-aos-delay={900 + index * 100}
                    >
                      <div className="text-4xl mb-4 text-center">{faq.icon}</div>
                      <h4 className="text-xl font-bold text-white mb-3">{faq.question}</h4>
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
