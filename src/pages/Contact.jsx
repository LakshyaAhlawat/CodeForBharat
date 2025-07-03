import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In production: send data to backend here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 text-black">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-4">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Have feedback, found a bug, or want to share game ideas? We'd love to
          hear from you!
        </p>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold">
            ✅ Thank you! Your message has been submitted.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Message</label>
              <textarea
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
