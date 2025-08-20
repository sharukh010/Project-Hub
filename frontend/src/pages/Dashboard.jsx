import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Eye, Heart, BookOpen, TrendingUp, Edit, Trash2 } from 'lucide-react'
import { postsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/posts/PostCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import Pagination from '../components/posts/Pagination'

function Dashboard() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)

  // FIX: use object form for useQuery
  const { data: myPosts, isLoading } = useQuery({
    queryKey: ['myPosts', currentPage],
    queryFn: () => postsAPI.getMyPosts({ page: currentPage, limit: 6 }),
    keepPreviousData: true
  })

  const { data: stats } = useQuery({
    queryKey: ['myStats', currentPage],
    queryFn: () => {
      if (myPosts?.data.posts) {
        const posts = myPosts.data.posts
        return {
          totalPosts: myPosts.data.pagination.totalPosts,
          totalViews: posts.reduce((sum, post) => sum + post.views, 0),
          totalLikes: posts.reduce((sum, post) => sum + post.likesCount, 0),
          publishedPosts: posts.filter(post => post.isPublished).length
        }
      }
      return null
    },
    enabled: !!myPosts?.data.posts
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage your projects and track your progress
            </p>
          </div>
          <Link to="/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Posts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Posts</h2>
            <Link to="/create" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              Create new post →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : myPosts?.data.posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts.data.posts.map((post) => (
                  <DashboardPostCard key={post._id} post={post} />
                ))}
              </div>

              {myPosts.data.pagination && myPosts.data.pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={myPosts.data.pagination.currentPage}
                    totalPages={myPosts.data.pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">
                Share your first project with the community!
              </p>
              <Link to="/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom PostCard component for Dashboard with edit/delete actions
function DashboardPostCard({ post }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'difficulty-beginner'
      case 'Intermediate': return 'difficulty-intermediate'
      case 'Advanced': return 'difficulty-advanced'
      default: return 'tag-blue'
    }
  }

  return (
    <article className="card hover:shadow-md transition-shadow duration-200">
      {post.featuredImage && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`tag ${getDifficultyColor(post.difficulty)}`}>
            {post.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            {post.category}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link 
            to={`/posts/${post.slug}`}
            className="hover:text-primary-600 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-blue text-xs">
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {post.views}
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {post.likesCount}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              post.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Created {new Date(post.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/edit/${post._id}`}
              className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span className="text-sm">Edit</span>
            </Link>

            <Link
              to={`/posts/${post.slug}`}
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">View</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default Dashboard