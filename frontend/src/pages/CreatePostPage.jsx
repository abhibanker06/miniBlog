import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  Send,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['technology', 'lifestyle', 'travel', 'food', 'health', 'design', 'business', 'other'];

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('technology');
  const [imageUrl, setImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const editorRef = useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contentHtml = editorRef.current?.innerHTML || '';

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!excerpt.trim()) {
      toast.error('Please enter a brief excerpt');
      return;
    }
    if (!contentHtml.trim() || contentHtml === '<br>') {
      toast.error('Please write some content for your story');
      return;
    }

    try {
      setSubmitting(true);
      const postData = {
        title: title.trim(),
        category,
        image: imageUrl.trim() || undefined,
        excerpt: excerpt.trim(),
        content: contentHtml,
        tags: tags.trim(),
      };

      const created = await createPost(postData);
      toast.success('Story published successfully!');
      navigate(`/post/${created._id || ''}`);
    } catch (err) {
      console.error('Failed to create post:', err);
      toast.error(err?.response?.data?.error || 'Failed to publish story. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const parsedTags = tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen py-10 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Back
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Story Studio
          </div>
        </div>

        {/* Studio Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-10 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create a New Story</h1>
            <p className="text-sm text-slate-500 mt-1">
              Craft your thoughts with rich formatting, imagery, and tags.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Story Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exploring Modern Web Architecture in 2026"
              required
              className="w-full px-4 py-3.5 text-lg font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>

          {/* Category & Image URL in 2 cols */}
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
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Featured Image Live Preview */}
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

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Excerpt (Summary) <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief 1-2 sentence hook that explains what readers will discover in this post..."
              rows={2}
              required
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Story Content <span className="text-rose-500">*</span>
            </label>

            {/* Toolbar */}
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

            {/* Editable Canvas */}
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[300px] p-5 bg-white border border-t-0 border-slate-200 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 prose prose-slate max-w-none text-slate-800"
              style={{ minHeight: '300px' }}
              data-placeholder="Begin writing your story here..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. react, tailwind, webdev, nodejs"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
            {parsedTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                {parsedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
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
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Publishing Story...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
