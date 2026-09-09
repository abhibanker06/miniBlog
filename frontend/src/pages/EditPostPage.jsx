import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  ArrowLeft,
  Sparkles,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['technology', 'lifestyle', 'travel', 'food', 'health', 'design', 'business', 'other'];

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('technology');
  const [imageUrl, setImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);

        // Verify author
        const authorId = data.author?._id || data.author?.id || data.author;
        if (user && authorId && authorId !== user.id) {
          toast.error('You are not authorized to edit this story');
          navigate('/');
          return;
        }

        setTitle(data.title || '');
        setCategory(data.category || 'technology');
        setImageUrl(data.image || '');
        setExcerpt(data.excerpt || '');
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '');

        if (editorRef.current) {
          editorRef.current.innerHTML = data.content || '';
        }
      } catch (err) {
        console.error('Failed to load post for editing:', err);
        toast.error('Could not load story data');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  // Set editor content once ready
  const setContentInitially = (node) => {
    if (node && !editorRef.current) {
      editorRef.current = node;
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const contentHtml = editorRef.current?.innerHTML || '';

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!excerpt.trim()) {
      toast.error('Please enter an excerpt');
      return;
    }

    try {
      setSaving(true);
      await updatePost(id, {
        title: title.trim(),
        category,
        image: imageUrl.trim() || undefined,
        excerpt: excerpt.trim(),
        content: contentHtml,
        tags: tags.trim(),
      });

      toast.success('Story updated successfully!');
      navigate(`/post/${id}`);
    } catch (err) {
      console.error('Failed to update post:', err);
      toast.error(err?.response?.data?.error || 'Failed to update story');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white shadow-soft border border-slate-100 text-slate-600 text-sm font-medium">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          Loading story for editing...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between pb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Back
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Editing Story
          </div>
        </div>

        <form onSubmit={handleUpdate} className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-10 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Story</h1>
            <p className="text-sm text-slate-500 mt-1">Make changes and publish updates to your story.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Story Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3.5 text-lg font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all capitalize text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreviewError(false);
                }}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          {imageUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56 flex items-center justify-center">
              {!imagePreviewError ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={() => setImagePreviewError(true)}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="p-6 text-center text-xs text-rose-500">
                  Image URL failed to load. Please verify the URL.
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Excerpt (Summary) <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              required
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Story Content <span className="text-rose-500">*</span>
            </label>

            <div className="flex items-center flex-wrap gap-1 p-2 bg-slate-100/80 border border-slate-200 rounded-t-2xl">
              <button
                type="button"
                onClick={() => formatText('bold')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('italic')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => formatText('formatBlock', '<h2>')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('formatBlock', '<h3>')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => formatText('insertUnorderedList')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('insertOrderedList')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('formatBlock', '<blockquote>')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('formatBlock', '<pre>')}
                className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-700 transition-colors"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={setContentInitially}
              contentEditable
              className="min-h-[300px] p-5 bg-white border border-t-0 border-slate-200 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 prose prose-slate max-w-none text-slate-800"
              style={{ minHeight: '300px' }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Updates...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
