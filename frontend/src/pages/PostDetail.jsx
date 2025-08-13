// src/pages/PostDetail.jsx
import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Heart, 
  Eye, 
  Clock, 
  Github, 
  ExternalLink, 
  Calendar,
  User,
  Bookmark,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { postsAPI, usersAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/posts/PostCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

function PostDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data, isLoading, error } = useQuery(
    ['post', slug],
    () => postsAPI.getPost(slug),
    {
      retry: false,
      onError: (err) => {
        if (err.response?.status === 404) {
          navigate('/posts')
        }
      }
    }
  )

  const likeMutation = useMutation(postsAPI.likePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', slug])
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update like')
    }
  })

  const saveMutation = useMutation(usersAPI.savePost, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['post', slug])
      toast.success(data.data.message)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save post')
    }
  })

  const deleteMutation = useMutation(postsAPI.deletePost, {
    onSuccess: () => {
      toast.success('Post deleted successfully')
      navigate('/dashboard')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete post')
    }
  })

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts')
      return
    }
    likeMutation.mutate(data.data.post._id)
  }

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save posts')
      return
    }
    saveMutation.mutate(data.data.post._id)
  }

  const handleDelete = () => {
    deleteMutation.mutate(data.data.post._id)
    setShowDeleteModal(false)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'difficulty-beginner'
      case 'Intermediate': return 'difficulty-intermediate'
      case 'Advanced': return 'difficulty-advanced'
      default: return 'tag-blue'
    }
  }

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
          <p className="text-gray-600 mb-4">Post not found</p>
          <Link to="/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    )
  }

  const post = data.data.post
  const relatedPosts = data.data.relatedPosts
  const isAuthor = user?._id === post.author._id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className={`tag ${getDifficultyColor(post.difficulty)}`}>
                {post.difficulty}
              </span>
              <span className="text-sm text-gray-500">{post.category}</span>
            </div>
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link to={`/edit/${post._id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views} views
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime} min read
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isLiked 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={likeMutation.isLoading}
              >
                <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likesCount}</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isSaved 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={saveMutation.isLoading}
              >
                <Bookmark className={`h-5 w-5 ${post.isSaved ? 'fill-current' : ''}`} />
                <span>Save</span>
              </button>

              <a
                href={post.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>Repository</span>
              </a>

              {post.liveDemo && (
                <a
                  href={post.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Link to={`/users/${post.author.username}`} className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{post.author.username}</h3>
                <p className="text-sm text-gray-600">{post.author.profile.experience} Developer</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/posts?tags=${tag}`}
                  className="tag-blue hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost._id} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
              loading={deleteMutation.isLoading}
            >
              Delete Post
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PostDetail