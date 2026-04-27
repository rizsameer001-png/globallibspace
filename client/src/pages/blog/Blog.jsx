import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl, imgOnError } from '../../utils/image';
import { LoadingSpinner, Pagination } from '../../components/ui/index';
import BannerSlot from '../../components/ui/BannerSlot';
import { MagnifyingGlassIcon, ListBulletIcon, Squares2X2Icon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

function BlogCard({ post, view }) {
  const isGrid = view==='grid';
  return (
    <Link to={`/blog/${post.slug||post._id}`}
      className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg overflow-hidden transition-all flex ${isGrid?'flex-col':'flex-row items-start'}`}>
      <div className={`overflow-hidden bg-gradient-to-br from-primary-50 to-blue-100 flex-shrink-0 ${isGrid?'h-48 w-full':'h-32 w-44 sm:w-52'}`}>
        <img src={getImageUrl(post.coverImage)} alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" onError={imgOnError}/>
      </div>
      <div className={`flex flex-col flex-1 ${isGrid?'p-5':'p-4'}`}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="badge badge-blue text-xs">{post.category}</span>
          {post.subCategory && <span className="badge badge-gray text-xs">{post.subCategory}</span>}
          {post.featured && <span className="badge bg-yellow-100 text-yellow-700 text-xs">★ Featured</span>}
        </div>
        <h3 className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors ${isGrid?'line-clamp-2 text-base mb-2':'line-clamp-2 text-sm sm:text-base mb-1.5'}`}>{post.title}</h3>
        {post.excerpt && <p className={`text-sm text-gray-500 leading-relaxed ${isGrid?'line-clamp-2 flex-1':'line-clamp-2 flex-1'}`}>{post.excerpt}</p>}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span>{post.author?.name||'Library'}</span>
            {post.readTime && (
              <span className="flex items-center space-x-1"><ClockIcon className="h-3 w-3"/><span>{post.readTime} min</span></span>
            )}
          </div>
          {post.publishedAt && <span>{format(new Date(post.publishedAt),'MMM d, yyyy')}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts]       = useState([]);
  const [pagination, setPagination] = useState({ page:1, pages:1, total:0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search')||'');
  const [category, setCategory] = useState(searchParams.get('category')||'');
  const [subCat, setSubCat]     = useState('');
  const [view, setView]         = useState('grid');
  const [page, setPage]         = useState(1);
  const timer = useRef(null);

  useEffect(()=>{
    clearTimeout(timer.current);
    timer.current = setTimeout(fetchPosts, search ? 350 : 0);
    return ()=>clearTimeout(timer.current);
  },[page, category, subCat, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: view==='grid'?9:8 });
      if (search)   p.set('search', search);
      if (category) p.set('category', category);
      if (subCat)   p.set('subCategory', subCat);
      const { data } = await api.get(`/blogs?${p}`);
      setPosts(data.posts||[]);
      setPagination(data.pagination||{});
      setCategories(data.categories||[]);
    } catch {}
    finally { setLoading(false); }
  };

  const setFilter = (cat, sub='') => { setCategory(cat); setSubCat(sub); setPage(1); };
  const clearFilters = () => { setCategory(''); setSubCat(''); setSearch(''); setPage(1); };

  const currentSubcats = categories.find(c=>c._id===category)?.subCategories?.filter(Boolean)||[];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Library Blog</h1>
        <p className="text-primary-200 mb-7">Reading tips, author spotlights & library news</p>
        <div className="relative max-w-lg mx-auto">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
          <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
            placeholder="Search posts…" className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none shadow-lg"/>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <BannerSlot placement="books_top" className="mb-8 h-28" dismissable/>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">Categories</h3>
                {(category||search) && <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">Clear</button>}
              </div>
              <ul className="space-y-0.5">
                <li>
                  <button onClick={()=>setFilter('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category?'bg-primary-600 text-white font-medium':'text-gray-700 hover:bg-gray-50'}`}>
                    All Posts
                  </button>
                </li>
                {categories.map(cat=>(
                  <li key={cat._id}>
                    <button onClick={()=>setFilter(cat._id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${category===cat._id?'bg-primary-600 text-white font-medium':'text-gray-700 hover:bg-gray-50'}`}>
                      <span>{cat._id}</span>
                      <span className={`text-xs ${category===cat._id?'text-primary-100':'text-gray-400'}`}>{cat.count}</span>
                    </button>
                    {/* Subcategories */}
                    {category===cat._id && cat.subCategories?.filter(Boolean).length>0 && (
                      <ul className="ml-3 mt-1 space-y-0.5">
                        {cat.subCategories.filter(Boolean).map(s=>(
                          <li key={s}>
                            <button onClick={()=>setSubCat(subCat===s?'':s)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${subCat===s?'text-primary-600 font-semibold bg-primary-50':'text-gray-500 hover:bg-gray-50'}`}>
                              › {s}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">{pagination.total} post{pagination.total!==1?'s':''}</p>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button onClick={()=>setView('grid')} className={`p-2 ${view==='grid'?'bg-primary-600 text-white':'text-gray-500 hover:bg-gray-50'}`}>
                  <Squares2X2Icon className="h-4 w-4"/>
                </button>
                <button onClick={()=>setView('list')} className={`p-2 ${view==='list'?'bg-primary-600 text-white':'text-gray-500 hover:bg-gray-50'}`}>
                  <ListBulletIcon className="h-4 w-4"/>
                </button>
              </div>
            </div>

            {loading ? <LoadingSpinner/> : posts.length===0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium">No posts found</p>
                <button onClick={clearFilters} className="text-sm text-primary-600 mt-2 hover:underline">Clear filters</button>
              </div>
            ) : (
              <>
                <div className={view==='grid'?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5':'space-y-4'}>
                  {posts.map(post=><BlogCard key={post._id} post={post} view={view}/>)}
                </div>
                <Pagination page={pagination.page} pages={pagination.pages} onPageChange={p=>{ setPage(p); window.scrollTo({top:0,behavior:'smooth'}); }}/>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
