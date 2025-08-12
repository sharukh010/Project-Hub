import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import PostDetail from './pages/PostDetail'
import Posts from './pages/Posts'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import SavedPosts from './pages/SavedPosts'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/users/:username" element={<UserProfile />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute>
              <SavedPosts />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App