import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setEmail(""); // clear input on success
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("Something went wrong! Please try again.");
    }
  };

  return (
    <footer className="bg-white dark:bg-black text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">MeroByapar</h3>
            <p className="text-sm opacity-80 mb-4">
              Simplifying business management for stores, retailers, and entrepreneurs.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition">
                <FaLinkedin size={20} />
              </a>
              <a href="https://github.com/2024-manoj/MeroByapar" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">FAQ</Link></li>
              <li><Link to="/help" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Kathmandu, Nepal</li>
              <li>📞 +977 1234567890</li>
              <li>✉️ info@merobyapar.com</li>
              <li>🕒 Mon-Fri: 9AM - 6PM</li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-sm opacity-80 mb-4">Get the latest updates and offers</p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-6 py-2 bg-gray-800 dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition">
                Subscribe
              </button>
            </form>
            {message && <p className="mt-2 text-sm">{message}</p>}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="opacity-80">© {currentYear} MeroByapar. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Terms</Link>
            <Link to="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;