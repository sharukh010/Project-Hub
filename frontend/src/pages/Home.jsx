import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Code2, Users, BookOpen } from 'lucide-react';
import { postsAPI } from '../services/api';
import  userAuth  from '../contexts/AuthContext'
import PostCard from '../components/posts/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

function Home() {
  const { user } = userAuth();

  const {
    data: recentPosts,
    isLoading: recentLoading,
    isError: recentError,
  } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: () => postsAPI.getPosts({ limit: 6, sort: 'newest' }),
  });

  

  return (
    <div className="min-h-screen">
      {/* ✅ Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 py-20 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn by Building{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Real Projects
            </span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover how experienced developers build projects with detailed explanations, 
            working code, and step-by-step insights. Perfect for beginners ready to level up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/posts">
              <Button size="lg" className="w-full sm:w-auto bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                Explore Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {!user && (
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-indigo-600">
                  Join Community
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      
      {/* ✅ Recent Projects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Projects</h2>
            <Link to="/posts">
              <Button variant="outline">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>

          {recentLoading ? (
            <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : recentError ? (
            <p className="text-center text-red-500">Failed to load latest projects.</p>
          ) : recentPosts?.data.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.data.posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No projects yet.</p>
          )}
        </div>
      </section>

      {/* ✅ CTA Section */}
      <section className="py-16 bg-indigo-600 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Project?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Help other developers learn by sharing your project with detailed explanations and insights from your development journey.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
