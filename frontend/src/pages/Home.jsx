// // import React from 'react'
// // import { Link } from 'react-router-dom'
// // import { useQuery } from '@tanstack/react-query'
// // import { ArrowRight, Code2, Users, BookOpen, Github } from 'lucide-react'
// // import { postsAPI } from '../services/api'
// // import PostCard from '../components/posts/PostCard'
// // import LoadingSpinner from '../components/ui/LoadingSpinner'
// // import Button from '../components/ui/Button'

// // function Home() {
// //   const { data: featuredPosts, isLoading: featuredLoading } = useQuery(
// //     'featuredPosts',
// //     postsAPI.getFeaturedPosts
// //   )

// //   const { data: recentPosts, isLoading: recentLoading } = useQuery(
// //     'recentPosts',
// //     () => postsAPI.getPosts({ limit: 6, sort: 'newest' })
// //   )

// //   const { data: stats } = useQuery('platformStats', postsAPI.getPlatformStats)

// //   return (
// //     <div className="min-h-screen">
// //       {/* Hero Section */}
// //       <section className="gradient-bg py-20">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
// //           <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
// //             Learn by Building{' '}
// //             <span className="text-gradient">Real Projects</span>
// //           </h1>
// //           <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
// //             Discover how experienced developers build projects with detailed explanations, 
// //             working code, and step-by-step insights. Perfect for beginners ready to level up.
// //           </p>
// //           <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //             <Link to="/posts">
// //               <Button size="lg" className="w-full sm:w-auto">
// //                 Explore Projects
// //                 <ArrowRight className="ml-2 h-5 w-5" />
// //               </Button>
// //             </Link>
// //             <Link to="/register">
// //               <Button variant="outline" size="lg" className="w-full sm:w-auto">
// //                 Join Community
// //               </Button>
// //             </Link>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Stats Section */}
// //       {stats && (
// //         <section className="py-16 bg-white">
// //           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
// //               <div>
// //                 <div className="flex justify-center mb-4">
// //                   <BookOpen className="h-12 w-12 text-primary-600" />
// //                 </div>
// //                 <h3 className="text-3xl font-bold text-gray-900 mb-2">
// //                   {stats.data.totalPosts}+
// //                 </h3>
// //                 <p className="text-gray-600">Project Tutorials</p>
// //               </div>
// //               <div>
// //                 <div className="flex justify-center mb-4">
// //                   <Users className="h-12 w-12 text-primary-600" />
// //                 </div>
// //                 <h3 className="text-3xl font-bold text-gray-900 mb-2">
// //                   {stats.data.totalUsers}+
// //                 </h3>
// //                 <p className="text-gray-600">Active Developers</p>
// //               </div>
// //               <div>
// //                 <div className="flex justify-center mb-4">
// //                   <Code2 className="h-12 w-12 text-primary-600" />
// //                 </div>
// //                 <h3 className="text-3xl font-bold text-gray-900 mb-2">
// //                   {stats.data.categoryStats.length}+
// //                 </h3>
// //                 <p className="text-gray-600">Technologies</p>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //       )}

// //       {/* Featured Projects */}
// //       <section className="py-16 bg-gray-50">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl font-bold text-gray-900 mb-4">
// //               Featured Projects
// //             </h2>
// //             <p className="text-lg text-gray-600">
// //               Hand-picked projects with exceptional explanations and learning value
// //             </p>
// //           </div>

// //           {featuredLoading ? (
// //             <div className="flex justify-center">
// //               <LoadingSpinner size="lg" />
// //             </div>
// //           ) : featuredPosts?.data.posts.length > 0 ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
// //               {featuredPosts.data.posts.map((post) => (
// //                 <PostCard key={post._id} post={post} />
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-12">
// //               <p className="text-gray-600">No featured projects yet.</p>
// //             </div>
// //           )}
// //         </div>
// //       </section>
// //       {/* Recent Projects */}
// //       <section className="py-16 bg-white">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex items-center justify-between mb-12">
// //             <div>
// //               <h2 className="text-3xl font-bold text-gray-900 mb-4">
// //                 Latest Projects
// //               </h2>
// //               <p className="text-lg text-gray-600"> </p>
// //               </div>
// //             <Link to="/posts">
// //               <Button variant="outline">
// //                 View All Projects
// //                 <ArrowRight className="ml-2 h-4 w-4" />
// //               </Button>
// //             </Link>
// //           </div>

// //           {recentLoading ? (
// //             <div className="flex justify-center">
// //               <LoadingSpinner size="lg" />
// //             </div>
// //           ) : recentPosts?.data.posts.length > 0 ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //               {recentPosts.data.posts.map((post) => (
// //                 <PostCard key={post._id} post={post} />
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-12">
// //               <p className="text-gray-600">No projects yet.</p>
// //             </div>
// //           )}
// //         </div>
// //       </section>

// //       {/* CTA Section */}
// //       <section className="py-16 bg-primary-600">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
// //           <h2 className="text-3xl font-bold text-white mb-4">
// //             Ready to Share Your Project?
// //           </h2>
// //           <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
// //             Help other developers learn by sharing your project with detailed explanations 
// //             and insights from your development journey.
// //           </p>
// //           <Link to="/register">
// //             <Button variant="secondary" size="lg">
// //               Get Started Today
// //             </Button>
// //           </Link>
// //         </div>
// //       </section>
// //     </div>
// //   )
// // }

// // export default Home

// import React from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { postsAPI } from '../services/api'

// function Home() {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['posts'],
//     queryFn: postsAPI.getAll, // Replace with your actual fetch function
//   })

//   if (isLoading) return <div>Loading...</div>
//   if (error) return <div>Error: {error.message}</div>

//   return (
//     <div>
//       <h1>All Posts</h1>
//       {data?.posts?.length ? (
//         data.posts.map(post => (
//           <div key={post._id}>
//             <h2>{post.title}</h2>
//             <p>{post.content}</p>
//           </div>
//         ))
//       ) : (
//         <div>No posts found.</div>
//       )}
//     </div>
//   )
// }

// export default Home


import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { postsAPI } from '../services/api'

function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postsAPI.getAll, // Make sure this function exists and fetches posts
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>All Posts</h1>
      {data?.posts?.length ? (
        data.posts.map(post => (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <div>No posts found.</div>
      )}
    </div>
  )
}

export default Home