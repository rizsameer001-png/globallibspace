import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { getImageUrl, imgOnError } from '../../utils/image';
import {
  BookOpenIcon, UserCircleIcon, Bars3Icon, XMarkIcon,
  MagnifyingGlassIcon, ArrowRightOnRectangleIcon,
  ChevronDownIcon, ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

// ── Mega Menu ──────────────────────────────────────────────────────────────────
// function MegaMenu({ categories, open, onClose }) {
//   if (!open) return null;
//   const genreGroups = [
//     { label:'Literature',    items:['Fiction','Classic Literature','Poetry','Drama'] },
//     { label:'Knowledge',     items:['Science','History','Philosophy','Biography'] },
//     { label:'Practical',     items:['Technology','Self Help','Business','Law'] },
//     { label:'For Everyone',  items:['Children','Religion','Travel','Art'] },
//   ];
//   return (
//     <>
//       <div className="fixed inset-0 z-30" onClick={onClose}/>
//       <div className="absolute top-full left-0 right-0 z-40 bg-white shadow-2xl border-t-2 border-primary-600">
//         <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
//           {/* Genre columns */}
//           <div className="col-span-8 grid grid-cols-4 gap-6">
//             {genreGroups.map(grp=>(
//               <div key={grp.label}>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{grp.label}</p>
//                 <ul className="space-y-1.5">
//                   {grp.items.map(item=>{
//                     const cat = categories.find(c=>c.name===item);
//                     return (
//                       <li key={item}>
//                         <Link to={cat?`/books?category=${cat._id}`:`/books?search=${item}`}
//                           onClick={onClose}
//                           className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 hover:translate-x-0.5 transition-all group">
//                           <span className="text-base">{cat?.icon||'📚'}</span>
//                           <span>{item}</span>
//                         </Link>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             ))}
//           </div>
//           {/* Featured quick links */}
//           <div className="col-span-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-5">
//             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Access</p>
//             <div className="space-y-3">
//               {[
//                 { to:'/books', label:'All Books', sub:'Browse full catalogue', icon:'📖' },
//                 { to:'/books?bookType=digital', label:'E-Books & PDFs', sub:'Download or read online', icon:'💻' },
//                 { to:'/authors', label:'Authors', sub:'Explore author profiles', icon:'✍️' },
//                 { to:'/blog', label:'Blog', sub:'Tips, news & spotlights', icon:'📰' },
//               ].map(l=>(
//                 <Link key={l.to} to={l.to} onClick={onClose}
//                   className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-primary-200 border border-transparent transition-all group">
//                   <span className="text-xl">{l.icon}</span>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{l.label}</p>
//                     <p className="text-xs text-gray-400">{l.sub}</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

function MegaMenu({ categories, open, onClose }) {
  if (!open) return null;

  const genreGroups = [
    { label:'Literature', items:['Fiction','Classic Literature','Poetry','Drama'] },
    { label:'Knowledge', items:['Science','History','Philosophy','Biography'] },
    { label:'Practical', items:['Technology','Self Help','Business','Law'] },
    { label:'For Everyone', items:['Children','Religion','Travel','Art'] },
  ];

  return (
    <div className="absolute top-full left-0 mt-2 w-[900px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
      
      <div className="p-6 grid grid-cols-12 gap-6">

        {/* LEFT SIDE */}
        <div className="col-span-8 grid grid-cols-2 gap-6">
          {genreGroups.map(grp => (
            <div key={grp.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                {grp.label}
              </p>

              <ul className="space-y-1">
                {grp.items.map(item => {
                  const cat = categories.find(c => c.name === item);
                  return (
                    <li key={item}>
                      <Link
                        to={cat ? `/books?category=${cat._id}` : `/books?search=${item}`}
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                      >
                        <span>{cat?.icon || '📚'}</span>
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-4 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
            Quick Access
          </p>

          <div className="space-y-2">
            {[
              { to:'/books', label:'All Books' },
              { to:'/books?bookType=digital', label:'E-Books' },
              { to:'/authors', label:'Authors' },
              { to:'/blog', label:'Blog' },
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={onClose}
                className="block text-sm text-gray-700 hover:text-primary-600"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Navbar ──────────────────────────────────────────────────────────────────────
export default function PublicLayout() {
  const { user, logout }   = useAuth();
  const navigate           = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [megaOpen, setMegaOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [categories, setCategories] = useState([]);
  const [logo, setLogo]   = useState(null);
  const [siteName, setSiteName] = useState('City Library');
  const searchRef = useRef(null);

  useEffect(()=>{
    api.get('/cms/settings').then(({data})=>{ if(data.settings){ setLogo(data.settings.logo); setSiteName(data.settings.siteName||'City Library'); } }).catch(()=>{});
    api.get('/categories').then(({data})=>setCategories(data.categories||[])).catch(()=>{});
    const fn = ()=>setScrolled(window.scrollY>20);
    window.addEventListener('scroll',fn);
    return ()=>window.removeEventListener('scroll',fn);
  },[]);

  useEffect(()=>{ if(searchOpen) setTimeout(()=>searchRef.current?.focus(),100); },[searchOpen]);

  const handleSearch = (e) => { e.preventDefault(); if(searchVal.trim()){ navigate(`/books?search=${encodeURIComponent(searchVal)}`); setSearchOpen(false); setSearchVal(''); } };
  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  const navLinkCls = ({isActive}) =>
    `text-sm font-medium transition-colors ${isActive?'text-primary-600':'text-gray-700 hover:text-primary-600'}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top bar (announcement) ─────────────────────────────────────── */}
      <div className="bg-primary-700 text-white text-center text-xs py-2 px-4">
        📚 New arrivals every week — <Link to="/books" className="underline font-medium hover:text-yellow-300">Browse latest books</Link>
      </div>

      {/* ── Main Navbar ────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled?'bg-white shadow-md':'bg-white/95 backdrop-blur'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 mr-2">
              {logo
                ? <img src={getImageUrl(logo)} alt={siteName} className="h-12 w-auto object-contain" onError={imgOnError}/>
                : <div className="flex items-center space-x-2">
                    <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
                      <BookOpenIcon className="h-5 w-5 text-white"/>
                    </div>
                    <span className="font-extrabold text-gray-900 text-lg hidden sm:block">{siteName}</span>
                  </div>
              }
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center space-x-6 flex-1">
              <NavLink to="/" end className={navLinkCls}>Home</NavLink>

              {/* Books with mega menu */}
              <div className="relative">
               {/* <button onClick={()=>setMegaOpen(!megaOpen)} */}
                <button onClick={() => setMegaOpen(prev => !prev)}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${megaOpen?'text-primary-600':'text-gray-700 hover:text-primary-600'}`}>
                  <span>Books</span>
                  <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${megaOpen?'rotate-180':''}`}/>
                </button>
                <MegaMenu categories={categories} open={megaOpen} onClose={()=>setMegaOpen(false)}/>
              </div>

              <NavLink to="/authors" className={navLinkCls}>Authors</NavLink>
              <NavLink to="/blog"    className={navLinkCls}>Blog</NavLink>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-2 ml-auto">
              {/* Search toggle */}
              <button onClick={()=>setSearchOpen(!searchOpen)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5"/>
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={()=>setDropOpen(!dropOpen)}
                    className="flex items-center space-x-2 pl-1 pr-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    <div className="h-7 w-7 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                    <ChevronDownIcon className={`h-3.5 w-3.5 text-gray-400 hidden sm:block transition-transform ${dropOpen?'rotate-180':''}`}/>
                  </button>
                  {dropOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={()=>setDropOpen(false)}/>
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                        <div className="p-1">
                          <Link to="/profile" onClick={()=>setDropOpen(false)} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                            <UserCircleIcon className="h-4 w-4"/> <span>Profile</span>
                          </Link>
                          {user.role==='member' && <>
                            <Link to="/my-books" onClick={()=>setDropOpen(false)} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                              <BookOpenIcon className="h-4 w-4"/><span>My Books</span>
                            </Link>
                            <Link to="/my-downloads" onClick={()=>setDropOpen(false)} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                              <ArrowDownTrayIcon className="h-4 w-4"/><span>My Downloads</span>
                            </Link>
                          </>}
                          {['admin','manager'].includes(user.role) && (
                            <Link to="/admin" onClick={()=>setDropOpen(false)} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                              <span>⚙️</span><span>Admin Panel</span>
                            </Link>
                          )}
                        </div>
                        <div className="p-1 border-t border-gray-100">
                          <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                            <ArrowRightOnRectangleIcon className="h-4 w-4"/><span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">Login</Link>
                  <Link to="/register" className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors shadow-sm">Register</Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button onClick={()=>setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100">
                {menuOpen ? <XMarkIcon className="h-5 w-5"/> : <Bars3Icon className="h-5 w-5"/>}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <input ref={searchRef} value={searchVal} onChange={e=>setSearchVal(e.target.value)}
                placeholder="Search books, authors, ISBN…"
                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"/>
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg font-medium">Search</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            {[{to:'/',label:'Home',end:true},{to:'/books',label:'Books'},{to:'/authors',label:'Authors'},{to:'/blog',label:'Blog'}].map(l=>(
              <NavLink key={l.to} to={l.to} end={l.end} onClick={()=>setMenuOpen(false)}
                className={({isActive})=>`block px-3 py-2.5 rounded-xl text-sm font-medium ${isActive?'bg-primary-50 text-primary-700':'text-gray-700 hover:bg-gray-50'}`}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/profile" onClick={()=>setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">Profile</NavLink>
                {user.role==='member' && <>
                  <NavLink to="/my-books" onClick={()=>setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">My Books</NavLink>
                  <NavLink to="/my-downloads" onClick={()=>setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">My Downloads</NavLink>
                </>}
                {['admin','manager'].includes(user.role) && <NavLink to="/admin" onClick={()=>setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">Admin Panel</NavLink>}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-medium">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={()=>setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">Login</Link>
                <Link to="/register" onClick={()=>setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700">Register</Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet/></main>

      {/* Footer */}
      {/*<footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-white"/>
              </div>
              <span className="font-bold text-lg">{siteName}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Your gateway to knowledge and stories. Discover, read, and grow.</p>
          </div>
          {[
            { title:'Library', links:[{to:'/books',l:'Browse Books'},{to:'/authors',l:'Authors'},{to:'/blog',l:'Blog'}] },
            { title:'Account', links:[{to:'/login',l:'Login'},{to:'/register',l:'Register'},{to:'/profile',l:'My Profile'}] },
            { title:'Info',    links:[{to:'/',l:'About Us'},{to:'/',l:'Contact'},{to:'/',l:'Privacy Policy'}] },
          ].map(col=>(
            <div key={col.title}>
              <p className="font-semibold text-gray-300 mb-3 text-sm">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(l=>(
                  <li key={l.l}><Link to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors">{l.l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>*/}

      <footer className="relative bg-gray-950 text-gray-300 mt-16 overflow-hidden">

  {/* Soft background glow */}
  <div className="absolute inset-0">
    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary-600/10 blur-[120px]" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px]" />
  </div>

  <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">

    {/* ── BRAND BLOCK ───────────────────────────────────────── */}
    <div className="md:col-span-4">

      <div className="flex items-center gap-3 mb-5 group">

        {logo ? (
          <img
            src={getImageUrl(logo)}
            alt={siteName}
            className="h-10 w-auto object-contain transition group-hover:scale-105"
            onError={imgOnError}
          />
        ) : (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <BookOpenIcon className="h-5 w-5 text-white" />
          </div>
        )}

        <span className="text-white font-semibold text-lg tracking-tight">
          {siteName}
        </span>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
        A modern SaaS-grade library platform for discovering books, authors, and knowledge with speed, simplicity, and elegance.
      </p>

      {/* Trust badges */}
      <div className="flex gap-2 mt-5 flex-wrap">
        {['Fast', 'Secure', 'Scalable'].map((t) => (
          <span
            key={t}
            className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
          >
            {t}
          </span>
        ))}
      </div>
    </div>

    {/* ── LINKS GRID ───────────────────────────────────────── */}
{/*    {[
      {
        title: 'Platform',
        links: ['Books', 'Authors', 'Blog'],
      },
      {
        title: 'Account',
        links: ['Login', 'Register', 'Profile'],
      },
      {
        title: 'Support',
        links: ['Help Center', 'Contact', 'Privacy Policy'],
      },
    ].map((col) => (
      <div key={col.title} className="md:col-span-2">

        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {col.title}
        </h4>

        <ul className="space-y-3">
          {col.links.map((l) => (
            <li key={l}>
              <Link
                to="#"
                className="text-sm text-gray-400 hover:text-white transition relative group"
              >
                <span className="relative">
                  {l}
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-primary-500 group-hover:w-full transition-all duration-300" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}*/}

    {[
  {
    title: 'Platform',
    links: [
      { to: '/books', l: 'Books' },
      { to: '/authors', l: 'Authors' },
      { to: '/blog', l: 'Blog' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', l: 'Login' },
      { to: '/register', l: 'Register' },
      { to: '/profile', l: 'Profile' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/help', l: 'Help Center' },
      { to: '/contact', l: 'Contact' },
      { to: '/privacy', l: 'Privacy Policy' },
    ],
  },
].map((col) => (
  <div key={col.title} className="md:col-span-2">

    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
      {col.title}
    </h4>

    <ul className="space-y-3">
      {col.links.map((l) => (
        <li key={l.l}>
          <Link
            to={l.to}
            className="text-sm text-gray-400 hover:text-white transition relative group"
          >
            <span className="relative">
              {l.l}
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-primary-500 group-hover:w-full transition-all duration-300" />
            </span>
          </Link>
        </li>
      ))}
    </ul>

  </div>
))}

    {/* ── NEWSLETTER / CTA BLOCK ───────────────────────────── */}

  </div>

  {/* ── BOTTOM BAR ───────────────────────────────────────── */}
  <div className="relative border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row  items-center justify-center gap-3 text-xs text-gray-500">

      <p>
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </p>

      <div className="flex gap-5">
        <span className="hover:text-white cursor-pointer transition">Terms</span>
        <span className="hover:text-white cursor-pointer transition">Privacy</span>
        <span className="hover:text-white cursor-pointer transition">Cookies</span>
      </div>

    </div>
  </div>

</footer>
    </div>
  );
}
