// import React, { useState } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { Bookmark, Search, Filter } from 'lucide-react'
// import { usersAPI } from '../services/api'
// import PostCard from '../components/posts/PostCard'
// import LoadingSpinner from '../components/ui/LoadingSpinner'

// function SavedPosts() {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [filterCategory, setFilterCategory] = useState('')
//   const [filterDifficulty, setFilterDifficulty] = useState('')

//   const { data: savedPostsData, isLoading, error } = useQuery(
//     'savedPosts',
//     usersAPI.getSavedPosts
//   )

//   const savedPosts = savedPostsData?.data.savedPosts || []

//   // Filter posts based on search and filters
//   const filteredPosts = savedPosts.filter(post => {
//     const matchesSearch = searchQuery === '' || 
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
//     const matchesCategory = filterCategory === '' || post.category === filterCategory
//     const matchesDifficulty = filterDifficulty === '' || post.difficulty === filterDifficulty
    
//     return matchesSearch && matchesCategory && matchesDifficulty
//   })

//   const categories = ['All', 'Web App', 'Mobile App', 'API', 'Desktop App', 'Game', 'CLI Tool', 'Library', 'Other']
//   const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600">Error loading saved posts: {error.message}</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <div className="flex items-center space-x-3 mb-2">
//             <Bookmark className="h-8 w-8 text-primary-600" />
//             <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
//           </div>
//           <p className="text-lg text-gray-600">
//             {savedPosts.length} {savedPosts.length === 1 ? 'project' : 'projects'} saved for later reading
//           </p>
//         </div>

//         {savedPosts.length > 0 && (
//           <div className="card p-6 mb-8">
//             <div className="space-y-4">
//               {/* Search Bar */}
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search saved posts..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Filters */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category
//                   </label>
//                   <select
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   >
//                     {categories.map((category) => (
//                       <option key={category} value={category === 'All' ? '' : category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Difficulty
//                   </label>
//                   <select
//                     value={filterDifficulty}
//                     onChange={(e) => setFilterDifficulty(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   >
//                     {difficulties.map((difficulty) => (
//                       <option key={difficulty} value={difficulty === 'All' ? '' : difficulty}>
//                         {difficulty}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex items-end">
//                   <div className="text-sm text-gray-600">
//                     {filteredPosts.length} of {savedPosts.length} posts
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Posts Grid */}
//         {savedPosts.length === 0 ? (
//           <div className="text-center py-12">
//             <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No saved posts yet</h3>
//             <p className="text-gray-600 mb-6">
//               Start saving interesting projects to read them later!
//             </p>
//             <a
//               href="/posts"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
//             >
//               Browse Projects
//             </a>
//           </div>
//         ) : filteredPosts.length === 0 ? (
//           <div className="text-center py-12">
//             <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No posts match your filters</h3>
//             <p className="text-gray-600">
//               Try adjusting your search query or filters to find posts.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredPosts.map((post) => (
//               <PostCard key={post._id} post={post} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SavedPosts

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bookmark, Search, Filter } from 'lucide-react'
import { usersAPI } from '../services/api'
import PostCard from '../components/posts/PostCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function SavedPosts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')

  // FIX: use object form for useQuery
  const { data: savedPostsData, isLoading, error } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: usersAPI.getSavedPosts
  })

  const savedPosts = savedPostsData?.data.savedPosts || []

  // Filter posts based on search and filters
  const filteredPosts = savedPosts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === '' || post.category === filterCategory
    const matchesDifficulty = filterDifficulty === '' || post.difficulty === filterDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = ['All', 'Web App', 'Mobile App', 'API', 'Desktop App', 'Game', 'CLI Tool', 'Library', 'Other']
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

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
          <p className="text-red-600">Error loading saved posts: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Bookmark className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
          </div>
          <p className="text-lg text-gray-600">
            {savedPosts.length} {savedPosts.length === 1 ? 'project' : 'projects'} saved for later reading
          </p>
        </div>

        {savedPosts.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search saved posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category === 'All' ? '' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty === 'All' ? '' : difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    {filteredPosts.length} of {savedPosts.length} posts
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {savedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No saved posts yet</h3>
            <p className="text-gray-600 mb-6">
              Start saving interesting projects to read them later!
            </p>
            <a
              href="/posts"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Projects
            </a>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts match your filters</h3>
            <p className="text-gray-600">
              Try adjusting your search query or filters to find posts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedPosts