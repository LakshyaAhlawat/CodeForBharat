// About.jsx
const team = [
  {
    name: "Shubham Tandon",
    role: "Frontend Developer",
    image: "/assets/shubham.jpg",
    bio: "Focused on building the UI/UX and React integration of the game hub, including Landing, Leaderboard, and About pages.",
  },
  {
    name: "Lakshya Ahlawat",
    role: "Backend Developer",
    image: "/assets/neha.jpg",
    bio: "Built the REST API and database logic to track scores per player and game. Integrated the backend with the frontend using Express.",
  },
  {
    name: "Shriya Devarakonda",
    role: "Game Developer",
    image: "/assets/amit.jpg",
    bio: "Created core game logic in JavaScript and Phaser for multiple games including Flappy Bird and Platformer.",
  },
  {
    name: "Shabdgya Jha",
    role: "Front & QA",
    image: "/assets/kriti.jpg",
    bio: "Designed UI components, icons, and helped with playtesting and debugging across devices.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-4" data-aos="fade-down">
          👨‍💻 About This Project
        </h1>
        <p
          className="text-lg max-w-3xl mx-auto text-white/90"
          data-aos="fade-up"
        >
          Our hackathon project is a browser-based game hub where users can play
          multiple JavaScript games, compete with others, and track scores in a
          global leaderboard.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center" data-aos="fade-up">
          🧰 Tech Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white/90 text-lg">
          <div
            className="bg-white/10 p-4 rounded-xl text-center"
            data-aos="zoom-in"
          >
            <strong>Frontend</strong>
            <p>React, Tailwind CSS, React Router</p>
          </div>
          <div
            className="bg-white/10 p-4 rounded-xl text-center"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <strong>Games</strong>
            <p>JavaScript + Phaser.js</p>
          </div>
          <div
            className="bg-white/10 p-4 rounded-xl text-center"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <strong>Backend</strong>
            <p>Node.js, Express.js</p>
          </div>
          <div
            className="bg-white/10 p-4 rounded-xl text-center"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <strong>Database</strong>
            <p>MongoDB</p>
          </div>
          <div
            className="bg-white/10 p-4 rounded-xl text-center"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <strong>Deployment</strong>
            <p>Vercel (frontend) + Render (backend)</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8" data-aos="fade-up">
          👥 Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white/10 rounded-xl p-4 text-center shadow-md backdrop-blur transition hover:scale-105 hover:shadow-xl"
              data-aos="zoom-in"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-2 border-white"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-indigo-200 text-sm mb-2">{member.role}</p>
              <p className="text-sm text-white/80">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
    