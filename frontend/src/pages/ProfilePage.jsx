import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPosts, deletePost } from '../api/posts';
import PostCard from '../components/common/PostCard';
import ConfirmModal from '../components/common/ConfirmModal';
import { PostCardSkeleton } from '../components/common/Skeleton';
import {
  User,
  Mail,
  BookOpen,
  PenSquare,
  LogOut,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await getUserPosts(user.id);
        setPosts(Array.isArray(data) ? [...data].reverse() : []);
      } catch (err) {
        console.error('Failed to load user posts:', err);
        toast.error('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user]);

  const handleDeletePost = async () => {
    if (!deleteId) return;
    try {
      await deletePost(deleteId);
      setPosts((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success('Story deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete story');
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Profile Card Header */}
        <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-100/50 via-purple-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-3xl uppercase shadow-lg shadow-indigo-200">
                {user?.username?.[0] || 'U'}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                  <Sparkles className="w-3 h-3" /> Author Member
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user?.username}
                </h1>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/create"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
              >
                <PenSquare className="w-4 h-4" />
                Write Story
              </Link>
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Stories Published</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{posts.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Account Status</div>
              <div className="text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active & Verified
              </div>
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your Published Stories</h2>
              <p className="text-sm text-slate-500 mt-0.5">Manage, update, or remove stories you've written.</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {posts.map((post) => (
                <div key={post._id} className="relative group/card flex flex-col">
                  <PostCard post={post} />
                  {/* Management Bar overlay/footer */}
                  <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 pl-2">Story Actions:</span>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/edit/${post._id}`}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(post._id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No stories written yet</h3>
              <p className="text-sm text-slate-500 mt-1">
                You haven't published any stories yet. Share your thoughts with the world today!
              </p>
              <Link
                to="/create"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
              >
                <PenSquare className="w-3.5 h-3.5" />
                Write Your First Story
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Story Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeletePost}
        title="Delete Story?"
        message="Are you sure you want to delete this story? This will permanently delete it from the database."
        confirmText="Yes, Delete"
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out of your MiniBlog account?"
        confirmText="Log Out"
        confirmColor="danger"
      />
    </div>
  );
};

export default ProfilePage;
