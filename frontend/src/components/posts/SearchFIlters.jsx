import React from 'react'
import { Search, Filter } from 'lucide-react'

function SearchFilters({ 
  searchQuery, 
  setSearchQuery, 
  difficulty, 
  setDifficulty, 
  category, 
  setCategory,
  sortBy,
  setSortBy,
  onSearch 
}) {
  const categories = [
    'All',
    'Web App',
    'Mobile App', 
    'API',
    'Desktop App',
    'Game',
    'CLI Tool',
    'Library',
    'Other'
  ]

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <div className="card p-6 mb-8">
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff === 'All' ? '' : diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={onSearch}
              className="w-full btn-primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters