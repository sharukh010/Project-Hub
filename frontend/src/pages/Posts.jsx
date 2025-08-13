import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { postsAPI } from '../services/api'
import PostList from '../components/posts/PostList'
import SearchFilters from '../components/posts/SearchFilters'
import Pagination from '../components/posts/Pagination'

function Posts() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

  const { data, isLoading, error } = useQuery(
    ['posts', currentPage, searchQuery, difficulty, category, sortBy],
    () => postsAPI.getPosts({
      page: currentPage,
      limit: 12,
      search: searchQuery || undefined,
      difficulty: difficulty || undefined,
      category: category || undefined,
      sort: sortBy
    }),
    {
      keepPreviousData: true
    }
  )

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (difficulty) params.set('difficulty', difficulty)
    if (category) params.set('category', category)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    if (currentPage > 1) params.set('page', currentPage.toString())
    
    setSearchParams(params)
  }, [searchQuery, difficulty, category, sortBy, currentPage, setSearchParams])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Projects
          </h1>
          <p className="text-lg text-gray-600">
            Discover projects with detailed explanations and learn how they're built
          </p>
        </div>

        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onSearch={handleSearch}
        />

        <PostList
          posts={data?.data.posts}
          loading={isLoading}
          error={error}
        />

        {data?.data.pagination && (
          <Pagination
            currentPage={data.data.pagination.currentPage}
            totalPages={data.data.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}

export default Posts

