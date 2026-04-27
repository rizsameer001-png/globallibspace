import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl, imgOnError } from '../../utils/image';
import { LoadingSpinner } from '../../components/ui/index';
import BannerSlot from '../../components/ui/BannerSlot';
import { ArrowLeftIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

function SimilarCard({ post }) {
  return (
    <Link to={`/blog/${post.slug||post._id}`}
      className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="h-14 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img src={getImageUrl(post.coverImage)} alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform" onError={imgOnError}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2 transition-colors">{post.title}</p>
        {post.publishedAt && <p className="text-xs text-gray-400 mt-1">{format(new Date(post.publishedAt),'MMM d, yyyy')}</p>}
      </div>
    </Link>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost]     = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0,0);
    api.get(`/blogs/${slug}`)
      .then(({ data }) => { setPost(data.post); setSimilar(data.similar||[]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner/>;
  if (!post) return <div className="text-center py-20 text-gray-400">Post not found. <Link to="/blog" className="text-primary-600 underline">Back to Blog</Link></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover */}
{/*      {post.coverImage && (
        <div className="w-full h-64 sm:h-96 overflow-hidden">
          <img src={getImageUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover" onError={imgOnError}/>
        </div>
      )}*/}

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main article ─────────────────────────────────────────────── */}
          <article className="flex-1 max-w-none">
            <Link to="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
              <ArrowLeftIcon className="h-4 w-4 mr-1"/>Back to Blog
            </Link>
            {post.coverImage && (
                <div className="max-w-4xl mb-6">
                  <img
                    src={getImageUrl(post.coverImage)}
                    className="w-full h-[250px] object-cover rounded-xl"
                  />
                </div>
              )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
              {/* Meta */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-blue">{post.category}</span>
                {post.subCategory && <span className="badge badge-gray">{post.subCategory}</span>}
                {post.tags?.map(t=><span key={t} className="badge bg-gray-100 text-gray-600">#{t}</span>)}
                {post.featured && <span className="badge bg-yellow-100 text-yellow-700">★ Featured</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-5">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-100 text-sm text-gray-500">
                {post.author?.name && <span className="font-medium text-gray-700">By {post.author.name}</span>}
                {post.publishedAt && <span>{format(new Date(post.publishedAt),'MMMM d, yyyy')}</span>}
                {post.readTime && <span className="flex items-center space-x-1"><ClockIcon className="h-4 w-4"/><span>{post.readTime} min read</span></span>}
                <span className="flex items-center space-x-1"><EyeIcon className="h-4 w-4"/><span>{post.views||0} views</span></span>
              </div>

              {/* Rich content */}
              <div
                className="prose prose-lg max-w-none text-gray-800"
                style={{ lineHeight:'1.8' }}
                dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt||''}</p>` }}
              />

              {/* Image gallery */}
              {post.images?.length>0 && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Photo Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {post.images.map((img,i)=>(
                      <div key={i} className="rounded-xl overflow-hidden shadow-sm">
                        <img src={getImageUrl(img.url)} alt={img.caption||`Image ${i+1}`}
                          className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" onError={imgOnError}/>
                        {img.caption && <p className="text-xs text-gray-500 px-2 py-1.5 bg-gray-50 text-center">{img.caption}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Banner mid-article */}
            <div className="mt-6">
              <BannerSlot placement="book_detail" className="h-24 sm:h-32" dismissable/>
            </div>
          </article>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="lg:w-72 flex-shrink-0 space-y-5">
            {/* Banner sidebar */}
            <BannerSlot placement="sidebar" className="min-h-[160px]"/>

            {/* Similar posts */}
            {similar.length>0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4">Related Posts</h3>
                <div className="space-y-1 divide-y divide-gray-50">
                  {similar.map(p=><SimilarCard key={p._id} post={p}/>)}
                </div>
              </div>
            )}

            {/* Category link */}
            <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5">
              <h3 className="font-bold text-primary-900 mb-3">More in {post.category}</h3>
              <Link to={`/blog?category=${post.category}`}
                className="inline-flex items-center text-sm text-primary-700 font-medium hover:underline">
                Browse {post.category} posts →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Prose styles */}
      <style>{`
        .prose h2 { font-size:1.5rem; font-weight:700; margin:1.5rem 0 0.75rem; color:#111827; }
        .prose h3 { font-size:1.2rem; font-weight:600; margin:1.25rem 0 0.5rem; color:#1f2937; }
        .prose p  { margin:0.75rem 0; color:#374151; }
        .prose blockquote { border-left:4px solid #2563eb; padding:12px 20px; background:#eff6ff; border-radius:6px; margin:1rem 0; font-style:italic; }
        .prose ul { list-style:disc; padding-left:1.5rem; margin:0.75rem 0; }
        .prose ol { list-style:decimal; padding-left:1.5rem; margin:0.75rem 0; }
        .prose li { margin:0.3rem 0; }
        .prose a  { color:#2563eb; text-decoration:underline; }
        .prose img{ max-width:100%; border-radius:10px; margin:1rem 0; }
        .prose hr { border:1px solid #e5e7eb; margin:1.5rem 0; }
        .prose iframe { width:100%; min-height:315px; border-radius:10px; margin:1rem 0; }
      `}</style>
    </div>
  );
}
