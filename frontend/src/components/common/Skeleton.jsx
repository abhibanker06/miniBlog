import React from 'react';

export const PostCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-soft animate-pulse flex flex-col h-full">
    <div className="h-48 bg-slate-200 w-full" />
    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="h-5 w-20 bg-slate-200 rounded-full" />
        <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-5/6 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </div>
    </div>
  </div>
);

export const PostDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-8">
    <div className="space-y-4">
      <div className="h-6 w-24 bg-slate-200 rounded-full" />
      <div className="h-10 w-4/5 bg-slate-200 rounded-lg" />
      <div className="flex gap-4">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-5 w-24 bg-slate-200 rounded" />
      </div>
    </div>
    <div className="w-full h-80 bg-slate-200 rounded-2xl" />
    <div className="space-y-3">
      <div className="h-4 w-full bg-slate-200 rounded" />
      <div className="h-4 w-full bg-slate-200 rounded" />
      <div className="h-4 w-3/4 bg-slate-200 rounded" />
    </div>
  </div>
);
