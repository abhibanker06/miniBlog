import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Mini<span className="text-indigo-600">Blog</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              A clean, thoughtful, and clutter-free publishing platform for developers, thinkers, and creators.
              Share insights, discover fresh viewpoints, and connect with a community that cares about good writing.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Explore Stories
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Write a Story
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Author Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4">Architecture</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Crafted with React, Tailwind CSS, Vite, Node.js, Express, and MongoDB.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              JWT Bearer Secured
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MiniBlog. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
