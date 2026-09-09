import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../api/posts';
import PostCard from '../components/common/PostCard';
import { PostCardSkeleton } from '../components/common/Skeleton';
import { Search, Sparkles, SlidersHorizontal, RefreshCw, XCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Other'];
const POSTS_PER_PAGE = 6;

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts();
      // Reverse so newest posts show first
      setPosts(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Unable to reach the blog server. Please check your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts by category and search keyword
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchTerm.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesQuery =
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        post.author?.username?.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [posts, selectedCategory, searchTerm]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/50 border-b border-slate-200/60">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Discover & Share Insights
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Where thoughts turn into{' '}
            <span className="text-gradient">lasting stories.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A clean space for creators, thinkers, and engineers. Read curated stories or share your
            unique perspective with our growing community.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/create"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
            >
              Start Writing
            </Link>
            <a
              href="#explore"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-soft transition-colors"
            >
              Explore Stories
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls: Search and Category Pills */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Latest Stories</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} available
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(POSTS_PER_PAGE);
                }}
                placeholder="Search stories, tags, authors..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-soft"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setVisibleCount(POSTS_PER_PAGE);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-soft'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-xl mx-auto my-12">
            <p className="text-sm font-medium text-rose-800">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && displayedPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {displayedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayedPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No stories match your criteria</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find anything matching your search or category filter. Try refining your keywords.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-soft hover:shadow-md transition-all inline-flex items-center gap-2"
            >
              Load More Stories
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
