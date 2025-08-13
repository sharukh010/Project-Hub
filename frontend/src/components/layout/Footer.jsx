import React from 'react'
import { Link } from 'react-router-dom'
import { Code2, Github, Twitter, Linkedin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Project Hub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Learn by exploring real projects with detailed explanations and working code.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/posts" className="text-gray-400 hover:text-white">All Projects</Link></li>
              <li><Link to="/posts?difficulty=Beginner" className="text-gray-400 hover:text-white">Beginner</Link></li>
              <li><Link to="/posts?difficulty=Intermediate" className="text-gray-400 hover:text-white">Intermediate</Link></li>
              <li><Link to="/posts?difficulty=Advanced" className="text-gray-400 hover:text-white">Advanced</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/posts?category=Web App" className="text-gray-400 hover:text-white">Web Apps</Link></li>
              <li><Link to="/posts?category=Mobile App" className="text-gray-400 hover:text-white">Mobile Apps</Link></li>
              <li><Link to="/posts?category=API" className="text-gray-400 hover:text-white">APIs</Link></li>
              <li><Link to="/posts?category=Game" className="text-gray-400 hover:text-white">Games</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Project Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer