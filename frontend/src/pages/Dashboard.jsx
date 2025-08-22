// src/pages/Dashboard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Eye, Heart, BookOpen, TrendingUp } from 'lucide-react'
import { postsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import DashboardPostCard from '../components/posts/DashboardPostCard' // Updated import
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import Pagination from '../components/posts/Pagination'

function Dashboard() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)

  const { data: myPosts, isLoading } = useQuery({
    queryKey: ['myPosts', currentPage],
    queryFn: () => postsAPI.getMyPosts({ page: currentPage, limit: 6 }),
    keepPreviousData: true
  })

  const { data: stats } = useQuery({
    queryKey: ['myStats'],
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

export default Dashboard