import React from 'react';
import { FaGithub, FaLinkedin, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Prasun Kumar Jha',
    role: 'Developer',
    description: 'Full Stack Developer with expertise in modern web technologies.',
    avatar: 'https://ui-avatars.com/api/?name=Prasoon+Jha&background=3b82f6&color=fff&size=200',
    social: {
      github: 'https://github.com/prasoonjha',
      linkedin: 'https://linkedin.com/in/prasoonjha'
    }
  },
  {
    name: 'Piyush Ranjan',
    role: 'Developer',
    description: 'Passionate about building scalable and efficient applications.',
    avatar: 'https://ui-avatars.com/api/?name=Piyush+Ranjan&background=10b981&color=fff&size=200',
    social: {
      github: 'https://github.com/piyushranjan',
      linkedin: 'https://linkedin.com/in/piyushranjan'
    }
  },
  {
    name: 'Mr. Sujoy Madhav Roy',
    role: 'Project Guide',
    description: 'Mentoring and guiding the team with valuable insights and expertise.',
    avatar: 'https://ui-avatars.com/api/?name=Sujoy+Roy&background=8b5cf6&color=fff&size=200',
    icon: <FaChalkboardTeacher className="text-3xl" />
  }
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary mb-4">About Our Project</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are building an innovative platform designed to help users prepare for technical interviews through practice problems and mock interviews.
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <figure className="px-10 pt-10">
                  <div className="avatar">
                    <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={member.avatar} alt={member.name} />
                    </div>
                  </div>
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-2xl">{member.name}</h3>
                  <div className="badge badge-primary badge-lg mb-2">{member.role}</div>
                  <p className="text-gray-600 mb-4">{member.description}</p>
                  <div className="card-actions justify-center">
                    {member.social ? (
                      <div className="flex gap-4">
                        <a 
                          href={member.social.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-circle hover:bg-gray-100"
                          aria-label={`${member.name}'s GitHub`}
                        >
                          <FaGithub className="text-2xl" />
                        </a>
                        <a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-circle hover:bg-blue-50"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <FaLinkedin className="text-2xl text-[#0A66C2]" />
                        </a>
                      </div>
                    ) : (
                      <div className="text-primary">
                        <FaChalkboardTeacher className="text-4xl mx-auto" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">About the Project</h2>
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Our platform is designed to help aspiring software engineers prepare for technical interviews by providing:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Curated list of coding problems with detailed solutions</li>
              <li>Interactive coding environment with multiple language support</li>
              <li>Mock interview simulations with real-time feedback</li>
              <li>Performance tracking and progress analytics</li>
            </ul>
            <p className="text-lg">
              Built with modern web technologies, our platform aims to make technical interview preparation more accessible and effective for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;