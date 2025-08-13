import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Upload, X, Eye } from 'lucide-react'
import { postsAPI, uploadAPI } from '../services/api'
import Input from '../components/ui/Input'
import TextArea from '../components/ui/TextArea'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

function CreatePost() {
  const navigate = useNavigate()
  const [featuredImage, setFeaturedImage] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      difficulty: 'Beginner',
      category: 'Web App'
    }
  })

  const watchedContent = watch('content', '')
  const watchedTitle = watch('title', '')

  const createPostMutation = useMutation(postsAPI.createPost, {
    onSuccess: (data) => {
      toast.success('Post created successfully!')
      navigate(`/posts/${data.data.post.slug}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create post')
    }
  })

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setImageUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await uploadAPI.uploadImage(formData)
      setFeaturedImage(response.data.imageUrl)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = (data) => {
    if (tags.length === 0) {
      toast.error('Please add at least one tag')
      return
    }

    const postData = {
      ...data,
      tags,
      featuredImage
    }

    createPostMutation.mutate(postData)
  }

  const categories = [
    'Web App',
    'Mobile App',
    'API',
    'Desktop App',
    'Game',
    'CLI Tool',
    'Library',
    'Other'
  ]

  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Post
          </h1>
          <p className="text-lg text-gray-600">
            Share your project with detailed explanations to help others learn
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <Input
                label="Project Title"
                placeholder="e.g., Building a Real-time Chat App with React and Socket.io"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 200,
                    message: 'Title must be less than 200 characters'
                  }
                })}
                error={errors.title?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    className="input"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                  {errors.difficulty && (
                    <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="input"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <Input
                label="GitHub Repository URL"
                placeholder="https://github.com/username/repository"
                {...register('githubRepo', {
                  required: 'GitHub repository URL is required',
                  pattern: {
                    value: /^https:\/\/github\.com\/[\w\-_]+\/[\w\-_]+$/,
                    message: 'Please provide a valid GitHub repository URL'
                  }
                })}
                error={errors.githubRepo?.message}
              />

              <Input
                label="Live Demo URL (Optional)"
                placeholder="https://your-project-demo.com"
                {...register('liveDemo')}
                error={errors.liveDemo?.message}
              />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Image</h2>
            
            <div className="space-y-4">
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-gray-600">Upload a featured image for your post</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={imageUploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                  >
                    {imageUploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Technologies & Tags</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (Technologies, frameworks, etc.)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 input"
                    maxLength={20}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add up to 10 tags. Press Enter or click Add to add a tag.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Content</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={!watchedContent}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
            
            <TextArea
              label="Write your detailed explanation"
              placeholder="Explain how you built this project, what challenges you faced, what you learned, and provide step-by-step insights that would help beginners understand your approach..."
              rows={20}
              {...register('content', {
                required: 'Content is required',
                minLength: {
                  value: 100,
                  message: 'Content must be at least 100 characters'
                }
              })}
              error={errors.content?.message}
            />
            <p className="text-sm text-gray-500 mt-2">
              Use Markdown formatting for better readability. Include code snippets, images, and detailed explanations.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createPostMutation.isLoading}
              disabled={createPostMutation.isLoading}
            >
              Publish Post
            </Button>
          </div>
        </form>

        {/* Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Preview"
          size="xl"
        >
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{watchedTitle || 'Your Post Title'}</h1>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{watchedContent}</pre>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default CreatePost