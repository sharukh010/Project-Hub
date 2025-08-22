import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye, Clock, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsAPI } from '../../services/api'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import toast from 'react-hot-toast'

function DashboardPostCard({ post }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const queryClient = useQueryClient()

  const deletePostMutation = useMutation({
    mutationFn: postsAPI.deletePost,
    onSuccess: () => {
      toast.success('Post deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['myPosts'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setShowDeleteModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete post')
    }
  })

  const handleDelete = () => {
    deletePostMutation.mutate(post._id)
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
    <>
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
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime} min
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
              Created {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/edit/${post._id}`}
                className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span className="text-sm">Edit</span>
              </Link>

              <Link
                to={`/posts/${post.slug}`}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">View</span>
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Delete "{post.title}"?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone. This will permanently delete your post and remove all associated data.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">This will delete:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>The post content and metadata</li>
                  <li>All likes and saves from other users</li>
                  <li>Post analytics and view counts</li>
                  <li>Associated comments (if implemented)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deletePostMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deletePostMutation.isPending}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DashboardPostCard