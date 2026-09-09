import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, User as UserIcon } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export const calculateReadTime = (content) => {
  if (!content) return '1 min read';
  // Strip HTML tags for word counting
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const PostCard = ({ post }) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImage = '/assets/images/noimage.jpg';
  const displayImage = imgError || !post?.image ? fallbackImage : post.image;
  const authorName = post?.author?.username || 'MiniBlogger';
  const readTime = calculateReadTime(post?.content || post?.excerpt);

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
      <Link to={`/post/${post._id}`} className="block relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={post.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
          </div>

          <Link to={`/post/${post._id}`} className="block group/title">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover/title:text-indigo-600 transition-colors leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="mt-2.5 text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {post.excerpt || post.content?.replace(/<[^>]*>?/gm, '').slice(0, 120)}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-[11px] uppercase">
              {authorName[0]}
            </div>
            <span className="font-medium text-slate-700">{authorName}</span>
          </div>
          <Link
            to={`/post/${post._id}`}
            className="font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
          >
            Read story →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
