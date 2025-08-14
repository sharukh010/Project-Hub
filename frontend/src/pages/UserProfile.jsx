import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  User, 
  MapPin, 
  Calendar, 
  Github, 
  Linkedin, 
  Globe,
  BookOpen,
  Eye,
  Heart
} from 'lucide-react'
import { usersAPI } from '../services/api'
import PostCard from '../components/posts/PostCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'

function UserProfile() {
  const { username } = useParams()

  const { data, isLoading, error } = useQuery(
    ['userProfile', username],
    () => usersAPI.getUserProfile(username),
    {
      retry: false
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-4">User not found</p>
          <Link to="/posts">
            <Button>Browse Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const user = data.data.user
  const posts = data.data.posts
  const totalPosts = data.data.totalPosts

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.username}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {user.profile.experience} Developer
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {user.profile.bio && (
                <p className="text-gray-600 mt-4">{user.profile.bio}</p>
              )}

              {/* Skills */}
              {user.profile.skills && user.profile.skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill) => (
                      <span key={skill} className="tag-blue text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center space-x-4 mt-4">
                {user.profile.github && (
                  <a
                    href={user.profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {user.profile.linkedin && (
                  <a
                    href={user.profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {user.profile.website && (
                  <a
                    href={user.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{totalPosts}</span>
              </div>
              <p className="text-gray-600">Projects</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{totalViews}</span>
              </div>
              <p className="text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{totalLikes}</span>
              </div>
              <p className="text-gray-600">Total Likes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Projects by {user.username}
          </h2>
          <p className="text-gray-600">
            {totalPosts} {totalPosts === 1 ? 'project' : 'projects'} shared
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600">
              {user.username} hasn't shared any projects yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile