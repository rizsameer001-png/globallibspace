import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../utils/api';
import { Modal, ConfirmDialog, LoadingSpinner, EmptyState, Pagination } from '../../components/ui/index';
import CloudinaryUploader from '../../components/ui/CloudinaryUploader';
import { getImageUrl, imgOnError } from '../../utils/image';
import toast from 'react-hot-toast';
import {
  PlusIcon, PencilIcon, TrashIcon, EyeIcon,
  ListBulletIcon, Squares2X2Icon, MagnifyingGlassIcon,
  BoldIcon, ItalicIcon, LinkIcon, PhotoIcon,
  CodeBracketIcon, ListBulletIcon as ListIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';



// const CATS = ['General','Reviews','Authors','News','Tips','Events','Announcements'];
// const SUBCATS = { General:['All','Updates'], Reviews:['Books','E-Books','Classic'], Authors:['Spotlight','Interview'], News:['Library','Digital'], Tips:['Reading','Research'], Events:['Workshop','Exhibition'], Announcements:['New Arrivals','System'] };

// ── Rich Text Toolbar ──────────────────────────────────────────────────────────
function execCmd(cmd, val=null){ document.execCommand(cmd, false, val); }

function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
  const el = editorRef.current;
  if (!el) return;

  // ✅ Click image → select it
  const handleClick = (e) => {
    if (e.target.tagName === 'IMG') {
      const range = document.createRange();
      range.selectNode(e.target);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  el.addEventListener('click', handleClick);

  return () => el.removeEventListener('click', handleClick);
}, []);

//ADD DELETE SUPPORT
  useEffect(() => {
  const el = editorRef.current;
  if (!el) return;

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const node = sel.anchorNode?.parentNode;

      if (node?.tagName === 'IMG') {
        e.preventDefault();
        node.remove();
        onChange(el.innerHTML);
      }
    }
  };

  el.addEventListener('keydown', handleKeyDown);

  return () => el.removeEventListener('keydown', handleKeyDown);
}, []);


    // ✅ ADD THIS HERE (cursor tracking)
  let savedRange = null;

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedRange) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }
  };

  const [linkUrl, setLinkUrl] = useState('');
  const [showLink, setShowLink] = useState(false);

  useEffect(()=>{
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const handleInput = () => onChange(editorRef.current.innerHTML);

  const insertLink = () => {
    if (!linkUrl) return;
    execCmd('createLink', linkUrl);
    setShowLink(false); setLinkUrl('');
    handleInput();
  };

  const insertImage = (url) => {
    restoreSelection(); // ✅ IMPORTANT
    execCmd('insertHTML', `<img src="${url}" style="max-width:100%;border-radius:8px;margin:8px 0;" alt="image"/>`);
    handleInput();
  };

  const insertVideo = () => {
    const url = prompt('YouTube URL:');
    if (!url) return;
    const id = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
    if (id) {
      execCmd('insertHTML', `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:12px 0;"><iframe src="https://www.youtube.com/embed/${id}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>`);
      handleInput();
    }
  };

  const insertQuote = () => { execCmd('formatBlock','blockquote'); handleInput(); };
  const insertDivider = () => { execCmd('insertHTML','<hr style="margin:16px 0;border:1px solid #e5e7eb;"/>'); handleInput(); };

  const tools = [
    { icon:'B', title:'Bold',      fn:()=>execCmd('bold'),           cls:'font-bold' },
    { icon:'I', title:'Italic',    fn:()=>execCmd('italic'),         cls:'italic' },
    { icon:'U', title:'Underline', fn:()=>execCmd('underline'),      cls:'underline' },
    { icon:'H1',title:'Heading 1', fn:()=>{execCmd('formatBlock','h2');handleInput();}, cls:'font-bold text-base' },
    { icon:'H2',title:'Heading 2', fn:()=>{execCmd('formatBlock','h3');handleInput();}, cls:'font-bold' },
    { icon:'¶', title:'Paragraph', fn:()=>{execCmd('formatBlock','p');handleInput();} },
    { icon:'•', title:'Bullet list',fn:()=>execCmd('insertUnorderedList') },
    { icon:'1.',title:'Number list',fn:()=>execCmd('insertOrderedList') },
    { icon:'"', title:'Blockquote',fn:insertQuote },
    { icon:'—', title:'Divider',   fn:insertDivider },
    { icon:'🎥',title:'YouTube',   fn:insertVideo },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {tools.map((t,i)=>(
          <button key={i} type="button" title={t.title} onClick={t.fn}
            className={`px-2.5 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors ${t.cls||''}`}>
            {t.icon}
          </button>
        ))}
        <button type="button" title="Insert Link" onClick={()=>setShowLink(!showLink)}
          className="px-2.5 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center">
          🔗
        </button>
        {/* Image uploader inline */}
        <div className="relative">
          <label className="px-2.5 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center" title="Insert Image">
            🖼️
            <input type="file" accept="image/*" className="hidden" onChange={async e=>{
              const file = e.target.files?.[0]; if(!file) return;
              try {
                const { data:sig } = await api.get('/cloudinary/sign',{ params:{ folder:'lms/blog-content', resource_type:'image' } });
                const fd = new FormData(); fd.append('file',file); fd.append('api_key',sig.apiKey); fd.append('timestamp',sig.timestamp); fd.append('signature',sig.signature); fd.append('folder',sig.folder);
                const r = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,{ method:'POST', body:fd });
                const d = await r.json();
                if(d.secure_url){ insertImage(d.secure_url); toast.success('Image inserted'); }
              } catch { toast.error('Image upload failed'); }
              e.target.value='';
            }}/>
          </label>
        </div>
        <button type="button" onClick={()=>{ execCmd('removeFormat'); handleInput(); }}
          className="px-2.5 py-1.5 text-sm rounded-lg hover:bg-red-100 text-red-500 transition-colors">✕ Clear</button>
      </div>

      {/* Link inserter */}
      {showLink && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-200">
          <input value={linkUrl} onChange={e=>setLinkUrl(e.target.value)}
            placeholder="https://..." className="input flex-1 text-sm py-1.5"/>
          <button type="button" onClick={insertLink} className="btn-primary text-sm px-3 py-1.5">Insert</button>
          <button type="button" onClick={()=>setShowLink(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={saveSelection}   // ✅ ADD
        onKeyUp={saveSelection}  // ✅ ADD
        className="min-h-[320px] p-5 text-gray-800 text-sm leading-relaxed focus:outline-none overflow-y-auto"
        style={{ maxHeight:480 }}
        data-placeholder="Start writing your blog post…"
      />

      <style>{`
        [contenteditable]:empty:before { content:attr(data-placeholder); color:#9ca3af; }
        [contenteditable] h2 { font-size:1.4rem; font-weight:700; margin:12px 0 6px; }
        [contenteditable] h3 { font-size:1.15rem; font-weight:600; margin:10px 0 5px; }
        [contenteditable] blockquote { border-left:4px solid #2563eb; padding:8px 16px; background:#eff6ff; border-radius:4px; margin:10px 0; font-style:italic; }
        [contenteditable] ul { list-style:disc; padding-left:24px; margin:8px 0; }
        [contenteditable] ol { list-style:decimal; padding-left:24px; margin:8px 0; }
        [contenteditable] a { color:#2563eb; text-decoration:underline; }
        [contenteditable] p { margin:6px 0; }
        [contenteditable] img { max-width:100%; border-radius:8px; margin:8px 0; }
      `}</style>
    </div>
  );
}

// ── Blog Post Form ─────────────────────────────────────────────────────────────
// function PostForm({ editPost, onSaved, onClose }) 
function PostForm({ editPost, categories, onSaved, onClose }) // ✅ ADDED categories
{
  const EMPTY = { title:'', excerpt:'', content:'', category:'General', subCategory:'', tags:'', status:'draft', featured:false, coverImage:'', coverPublicId:'', images:[] };
  const [form, setForm] = useState(editPost ? {
    ...EMPTY,
    title: editPost.title||'', excerpt: editPost.excerpt||'', content: editPost.content||'',
    category: editPost.category||'General', subCategory: editPost.subCategory||'',
    tags: editPost.tags?.join(', ')||'', status: editPost.status||'draft',
    featured: editPost.featured||false, coverImage: editPost.coverImage||'',
    coverPublicId: editPost.coverPublicId||'', images: editPost.images||[],
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // ✅ ADD HERE ↓↓↓ (THIS IS THE CORRECT PLACE)

  const getOptions = (cats) => {
    const arr = [];

    cats.forEach(c => {
      arr.push({
        label: c.name,
        category: c.name,
        subCategory: ''
      });

      if (c.children) {
        c.children.forEach(s => {
          arr.push({
            label: `${c.name} / ${s.name}`,
            category: c.name,
            subCategory: s.name
          });
        });
      }
    });

    return arr;
  };

  const options = getOptions(categories || []);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
      let res;
      if (editPost) {
        res = await api.put(`/blogs/${editPost._id}`, payload);
      } else {
        res = await api.post('/blogs', payload);
      }
      toast.success(editPost ? 'Post updated!' : 'Post created!');
      onSaved?.(res.data.post);
    } catch(err) { toast.error(err.response?.data?.message||'Save failed'); }
    finally { setSaving(false); }
  };

  const addImage = (results) => {
    const newImgs = results.map(r=>({ url:r.secureUrl, publicId:r.publicId, caption:'' }));
    set('images', [...form.images, ...newImgs]);
  };

  const removeImage = (i) => set('images', form.images.filter((_,idx)=>idx!==i));

  // const subCats = SUBCATS[form.category] || ['All'];

  return (
    <form onSubmit={handleSave}>
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {['content','meta','images'].map(t=>(
          <button key={t} type="button" onClick={()=>setActiveTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab===t?'bg-white shadow text-primary-700':'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab==='content' && (
        <div className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input text-base font-semibold" required value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Post title…"/>
          </div>
          <div>
            <label className="label">Excerpt <span className="text-gray-400 font-normal">(shown in listings)</span></label>
            <textarea className="input" rows={2} value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} placeholder="Short summary…"/>
          </div>
          <div>
            <label className="label">Content</label>
            <RichEditor value={form.content} onChange={v=>set('content',v)}/>
          </div>
        </div>
      )}

      {activeTab==='meta' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
{/*            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e=>{ set('category',e.target.value); set('subCategory',''); }}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>*/}
{/*            <div>
              <label className="label">Sub-Category</label>
              <select className="input" value={form.subCategory} onChange={e=>set('subCategory',e.target.value)}>
                <option value="">None</option>
                {subCats.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>*/}
            <div>
            <label className="label">Category</label>

            <select
              className="input"
              value={`${form.category}__${form.subCategory}`}
              onChange={(e) => {
                const selected = options.find(
                  o => `${o.category}__${o.subCategory}` === e.target.value
                );

                if (selected) {
                  set('category', selected.category);
                  set('subCategory', selected.subCategory);
                }
              }}
            >
              <option value="">Select Category</option>

              {options.map((opt, i) => (
                <option key={i} value={`${opt.category}__${opt.subCategory}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>set('status',e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)} className="rounded text-primary-600"/>
              <label className="text-sm font-medium text-gray-700">Featured Post</label>
            </div>
          </div>
          <div>
            <label className="label">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
            <input className="input" value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="reading, tips, fiction"/>
          </div>
          <div>
            <label className="label">Cover Image</label>
            <CloudinaryUploader folder="lms/blog" resourceType="image" accept="image/*"
              multiple={false} showUrlInput currentUrl={form.coverImage}
              onRemove={()=>{ set('coverImage',''); set('coverPublicId',''); }}
              onUploaded={r=>{ set('coverImage',r[0].secureUrl); set('coverPublicId',r[0].publicId||''); }}/>
          </div>
        </div>
      )}

      {activeTab==='images' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Upload multiple images to use in your post. After upload, copy the URL and use the 🖼️ button in the editor.</p>
          <CloudinaryUploader folder="lms/blog-gallery" resourceType="image" accept="image/*"
            multiple showUrlInput label="Upload Gallery Images" onUploaded={addImage}/>
          {form.images.length>0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images.map((img,i)=>(
                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200">
                  <img src={getImageUrl(img.url)} alt={img.caption} className="h-28 w-full object-cover" onError={imgOnError}/>
                  <div className="p-2">
                    <input value={img.caption} onChange={e=>set('images',form.images.map((x,idx)=>idx===i?{...x,caption:e.target.value}:x))}
                      className="input text-xs py-1" placeholder="Caption…"/>
                  </div>
                  <button type="button" onClick={()=>removeImage(i)}
                    className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-5 mt-5 border-t border-gray-100">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : editPost ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}

// ── Main ManageBlogs ───────────────────────────────────────────────────────────
export default function ManageBlogs() {
  const [posts, setPosts]           = useState([]);
  const [pagination, setPagination] = useState({ page:1, pages:1, total:0 });
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [view, setView]             = useState('list');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editPost, setEditPost]     = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [blogCategories, setBlogCategories] = useState([]);



  // useEffect(()=>{ fetchPosts(); }, [page, statusFilter]);
    useEffect(() => {
      fetchPosts();
      fetchBlogCategories();   // ✅ NEW
      }, [page, statusFilter]);

  // const fetchBlogCategories = async () => {
  //     try {
  //       const res = await api.get('/blog-categories');
  //       setBlogCategories(res.data.categories || []);
  //     } catch (err) {
  //       console.error('Category load failed');
  //     }
  //   };
    const fetchBlogCategories = async () => {
      const res = await api.get('/blog-categories');
      setBlogCategories(res.data.categories || []);
    };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit:15 });
      if (statusFilter) p.set('status', statusFilter);
      const { data } = await api.get(`/blogs/admin/all?${p}`);
      setPosts(data.posts||[]);
      setPagination(data.pagination||{});
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditPost(null); setModalOpen(true); };
  const openEdit   = (p) => { setEditPost(p); setModalOpen(true); };

  const handleDelete = async () => {
    try {
      await api.delete(`/blogs/${deleteId}`);
      setPosts(prev=>prev.filter(p=>p._id!==deleteId));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleteId(null); }
  };

  const filtered = search ? posts.filter(p=>p.title.toLowerCase().includes(search.toLowerCase())) : posts;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center space-x-1">
          <PlusIcon className="h-4 w-4"/><span>New Post</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts…" className="input pl-9"/>
        </div>
        <select value={statusFilter} onChange={e=>setStatus(e.target.value)} className="input w-36">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button onClick={()=>setView('list')} className={`p-2 ${view==='list'?'bg-primary-600 text-white':'text-gray-500 hover:bg-gray-50'}`}>
            <ListBulletIcon className="h-4 w-4"/>
          </button>
          <button onClick={()=>setView('grid')} className={`p-2 ${view==='grid'?'bg-primary-600 text-white':'text-gray-500 hover:bg-gray-50'}`}>
            <Squares2X2Icon className="h-4 w-4"/>
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner/> : filtered.length===0 ? <EmptyState title="No posts found"/> : view==='list' ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="table-base">
            <thead><tr>{['Cover','Title','Category','Status','Views','Date','Actions'].map(h=><th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(post=>(
                <tr key={post._id} className="hover:bg-gray-50">
                  {/*<td className="td"><div className="h-10 w-14 rounded overflow-hidden bg-gray-100"><img src={getImageUrl(post.coverImage)} alt="" className="h-full w-full object-cover" onError={imgOnError}/></div></td>*/}
                  <td className="td">
                    <div className="w-20 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={getImageUrl(post.coverImage)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={imgOnError}
                      />
                    </div>
                  </td>
                  <td className="td font-medium max-w-[200px]">
                    <div className="truncate">{post.title}</div>
                    {post.featured && <span className="badge bg-yellow-100 text-yellow-700 text-xs">Featured</span>}
                  </td>
                  <td className="td text-sm text-gray-600">
                    {post.category}{post.subCategory?` › ${post.subCategory}`:''}
                  </td>
                  <td className="td"><span className={`badge ${post.status==='published'?'badge-green':'badge-gray'}`}>{post.status}</span></td>
                  <td className="td text-sm text-center">{post.views||0}</td>
                  <td className="td text-xs text-gray-500">{post.publishedAt?format(new Date(post.publishedAt),'MMM d, yyyy'):'—'}</td>
                  <td className="td">
                    <div className="flex items-center space-x-1">
                      <a href={`/blog/${post.slug||post._id}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"><EyeIcon className="h-4 w-4"/></a>
                      <button onClick={()=>openEdit(post)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><PencilIcon className="h-4 w-4"/></button>
                      <button onClick={()=>setDeleteId(post._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="h-4 w-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(post=>(
            <div key={post._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img src={getImageUrl(post.coverImage)} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" onError={imgOnError}/>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-blue text-xs">{post.category}</span>
                  <span className={`badge text-xs ${post.status==='published'?'badge-green':'badge-gray'}`}>{post.status}</span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-3">{post.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.views||0} views</span>
                  <div className="flex space-x-1">
                    <button onClick={()=>openEdit(post)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><PencilIcon className="h-3.5 w-3.5"/></button>
                    <button onClick={()=>setDeleteId(post._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><TrashIcon className="h-3.5 w-3.5"/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage}/>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)}
        title={editPost?`Edit: ${editPost.title}`:'New Blog Post'} size="xl">
        {/*<PostForm editPost={editPost}*/}
          <PostForm 
          editPost={editPost}
          categories={blogCategories}   // ✅ ADDED
          onSaved={post=>{
            if(editPost) setPosts(prev=>prev.map(p=>p._id===post._id?post:p));
            else setPosts(prev=>[post,...prev]);
            setModalOpen(false);
          }}
          onClose={()=>setModalOpen(false)}/>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Post" message="Delete this blog post permanently?" danger/>
    </div>
  );
}
