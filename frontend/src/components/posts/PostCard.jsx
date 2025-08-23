import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye, Clock, Github, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import  useAuth  from '../../contexts/AuthContext'
// import { useMutation, useQueryClient } from 'react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsAPI, usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

function PostCard({ post }) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: postsAPI.likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', post.slug] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update like')
    }
  })

  const saveMutation = useMutation({
    mutationFn: usersAPI.savePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] })
      toast.success(data.data.message)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save post')
    }
  })

  const handleLike = (e) => {
    e.preventDefault()
    console.log('Like clicked')
    if (!isAuthenticated) {
      toast.error('Please login to like posts')
      return
    }
    likeMutation.mutateAsync(post._id)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to save posts')
      return
    }
    saveMutation.mutate(post._id)
  }

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
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime} min
            </span>
          </div>
          <span>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to={`/users/${post.author.username}`} className="flex items-center space-x-2 hover:opacity-80">
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {post.author.username}
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                post.isLiked 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              disabled={likeMutation.isLoading}
            >
              <Heart 
                className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} 
              />
              <span className="text-sm">{post.likesCount}</span>
            </button>

            <a
              href={post.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>

            <Link
              to={`/posts/${post.slug}`}
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostCard