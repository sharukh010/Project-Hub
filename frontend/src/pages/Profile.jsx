import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { User, Mail, Globe, Github, Linkedin, Lock, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usersAPI, authAPI } from '../services/api'
import Input from '../components/ui/Input'
import TextArea from '../components/ui/TextArea'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

function Profile() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      bio: user?.profile?.bio || '',
      skills: user?.profile?.skills?.join(', ') || '',
      experience: user?.profile?.experience || 'Beginner',
      github: user?.profile?.github || '',
      linkedin: user?.profile?.linkedin || '',
      website: user?.profile?.website || ''
    }
  })

  // Password form
  const passwordForm = useForm()

  const updateProfileMutation = useMutation(usersAPI.updateProfile, {
    onSuccess: (data) => {
      updateUser(data.data.user)
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    }
  })

  const updatePasswordMutation = useMutation(authAPI.updatePassword, {
    onSuccess: () => {
      toast.success('Password updated successfully!')
      setShowPasswordModal(false)
      passwordForm.reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update password')
    }
  })

  const handleProfileSubmit = (data) => {
    const profileData = {
      ...data,
      skills: data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(Boolean) : []
    }
    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = (data) => {
    updatePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600">
            Manage your profile information and account security
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user?.username}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <TextArea
                  label="Bio"
                  placeholder="Tell others about yourself..."
                  rows={4}
                  {...profileForm.register('bio', {
                    maxLength: {
                      value: 500,
                      message: 'Bio must be less than 500 characters'
                    }
                  })}
                  error={profileForm.formState.errors.bio?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Skills"
                    placeholder="React, Node.js, Python..."
                    {...profileForm.register('skills')}
                    error={profileForm.formState.errors.skills?.message}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      {...profileForm.register('experience')}
                      className="input"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        {...profileForm.register('github')}
                        className="input pl-10"
                      />
                    </div>

                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        {...profileForm.register('linkedin')}
                        className="input pl-10"
                      />
                    </div>

                    <div className="relative md:col-span-2">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        {...profileForm.register('website')}
                        className="input pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={updateProfileMutation.isLoading}
                    disabled={updateProfileMutation.isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                  <p className="text-gray-600 mb-4">
                    Keep your account secure by using a strong password
                  </p>
                  <Button
                    onClick={() => setShowPasswordModal(true)}
                    variant="outline"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Created:</span>
                      <span className="text-gray-900">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">
                        {new Date(user?.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
        >
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              {...passwordForm.register('currentPassword', {
                required: 'Current password is required'
              })}
              error={passwordForm.formState.errors.currentPassword?.message}
            />

            <Input
              label="New Password"
              type="password"
              {...passwordForm.register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={passwordForm.formState.errors.newPassword?.message}
            />

            <Input
              label="Confirm New Password"
              type="password"
              {...passwordForm.register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: value => 
                  value === passwordForm.watch('newPassword') || 'Passwords do not match'
              })}
              error={passwordForm.formState.errors.confirmPassword?.message}
            />

            <div className="flex items-center justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updatePasswordMutation.isLoading}
                disabled={updatePasswordMutation.isLoading}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Profile