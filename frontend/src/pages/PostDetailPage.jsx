import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, deletePost, getRelatedPosts, getAllPosts } from '../api/posts';
import { getComments, addComment, deleteComment } from '../api/comments';
import { useAuth } from '../context/AuthContext';
import CategoryBadge from '../components/common/CategoryBadge';
import PostCard, { calculateReadTime } from '../components/common/PostCard';
import ConfirmModal from '../components/common/ConfirmModal';
import { PostDetailSkeleton } from '../components/common/Skeleton';
import { ArrowLeft, Calendar, Clock, Edit3, Trash2, Send, MessageSquare, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if current user is author of this post
  const isAuthor = Boolean(
    user && post?.author && (post.author._id === user.id || post.author.id === user.id || post.author === user.id)
  );

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchPostData = async () => {
      try {
        setLoading(true);
        const [postData, commentsData] = await Promise.all([
          getPostById(id),
          getComments(id).catch(() => []),
        ]);

        if (!isMounted) return;
        setPost(postData);
        setComments(Array.isArray(commentsData) ? [...commentsData].reverse() : []);

        // Fetch related posts or fallback to latest
        try {
          const related = await getRelatedPosts(id);
          if (related && related.length > 0) {
            setRelatedPosts(related.slice(0, 3));
          } else {
            const all = await getAllPosts();
            const filtered = all.filter((p) => p._id !== id).reverse().slice(0, 3);
            setRelatedPosts(filtered);
          }
        } catch {
          // If related fetch fails, ignore
        }
      } catch (err) {
        console.error('Failed to load post details:', err);
        toast.error('Failed to load story.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPostData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      toast.success('Story deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete story');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isAuthenticated) {
      toast.error('Please log in to leave a comment');
      navigate('/auth');
      return;
    }

    try {
      setSubmittingComment(true);
      const newComment = await addComment({ content: commentText.trim(), postId: id });
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment removed');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to remove comment');
    }
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900">Story Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The story you are looking for may have been removed or does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const authorName = post.author?.username || 'MiniBlogger';
  const readTime = calculateReadTime(post.content);
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Back button header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all stories
        </Link>
      </div>

      {/* Main Post Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Post Header */}
        <header className="space-y-4 pb-8 border-b border-slate-200/80">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CategoryBadge category={post.category} />

            {/* Author Actions: Edit and Delete buttons */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${post._id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-soft"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  Edit Story
                </Link>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 flex-wrap pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {authorName[0]}
              </div>
              <span className="font-semibold text-slate-800">{authorName}</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {readTime}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && !imgError && (
          <div className="my-8 rounded-3xl overflow-hidden shadow-card border border-slate-200/70 bg-slate-100">
            <img
              src={post.image}
              alt={post.title}
              onError={() => setImgError(true)}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Excerpt Lead */}
        {post.excerpt && (
          <div className="my-6 p-5 rounded-2xl bg-indigo-50/50 border-l-4 border-indigo-500 text-slate-700 italic font-serif text-lg leading-relaxed">
            "{post.excerpt}"
          </div>
        )}

        {/* Post Content */}
        <div
          className="prose prose-slate prose-lg max-w-none py-6 leading-relaxed text-slate-700 prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-slate-400" />
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <section className="mt-16 pt-12 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              Comments ({comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          <div className="mb-10 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
            {isAuthenticated ? (
              <form onSubmit={handleAddComment} className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">
                  Leave a comment as <span className="text-indigo-600">{user.username}</span>
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or feedback respectfully..."
                  rows={3}
                  required
                  className="w-full p-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-600 mb-3">Sign in to share your thoughts on this story.</p>
                <Link
                  to="/auth"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Log In to Comment
                </Link>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">
                No comments yet. Be the first to start the conversation!
              </p>
            ) : (
              comments.map((comment) => {
                const commentAuthorName = comment.author?.username || 'Anonymous';
                const isCommentAuthor =
                  user &&
                  comment.author &&
                  (comment.author._id === user.id || comment.author.id === user.id || comment.author === user.id);

                return (
                  <div
                    key={comment._id}
                    className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {commentAuthorName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{commentAuthorName}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>

                    {isCommentAuthor && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200/80">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Related Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <PostCard key={related._id} post={related} />
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
        title="Delete Story?"
        message="Are you sure you want to delete this story? This action cannot be undone and will permanently remove your content."
        confirmText="Yes, Delete"
      />
    </div>
  );
};

export default PostDetailPage;
