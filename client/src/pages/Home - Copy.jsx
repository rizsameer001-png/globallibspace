import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import api from '../utils/api';
import { BookCard } from '../components/ui/index';
import BannerSlot from '../components/ui/BannerSlot';
import { getImageUrl, imgOnError } from '../utils/image';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon, ArrowRightIcon, SparklesIcon,
  BookOpenIcon, CheckIcon, CreditCardIcon, UserGroupIcon,
  ChevronLeftIcon, ChevronRightIcon, ClockIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// ── Horizontal scroll hook ─────────────────────────────────────────────────────
function useHScroll(ref) {
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  return scroll;
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, link, linkLabel = 'View All' }) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link}
          className="flex-shrink-0 flex items-center space-x-1 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors group">
          <span>{linkLabel}</span>
          <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// ── Plan card ──────────────────────────────────────────────────────────────────
function PlanCard({ plan, formatPrice, featured }) {
  const { user } = useAuth();
  return (
    <div className={`relative flex flex-col rounded-3xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${
      featured
        ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-200 scale-105'
        : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-black px-5 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
            ★ Best Value
          </span>
        </div>
      )}
      <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${featured ? 'text-primary-200' : 'text-primary-500'}`}>{plan.name}</div>
      <div className={`text-5xl font-black mb-1 ${featured ? 'text-white' : 'text-gray-900'}`}>
        {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
      </div>
      {plan.price > 0 && <p className={`text-sm mb-6 ${featured ? 'text-primary-200' : 'text-gray-400'}`}>per {plan.duration} days</p>}
      {plan.price === 0 && <p className={`text-sm mb-6 ${featured ? 'text-primary-200' : 'text-gray-400'}`}>forever</p>}
      <ul className="space-y-3 flex-1 mb-8">
        {[
          `Borrow up to ${plan.borrowingLimit} books`,
          `${plan.duration}-day membership`,
          plan.ebookAccess ? '✓ E-Books & PDF access' : '✗ Physical books only',
          'Email due-date reminders',
          'Online account & history',
        ].map((item, i) => (
          <li key={i} className={`flex items-start space-x-2.5 text-sm ${featured ? 'text-primary-100' : item.startsWith('✗') ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
            <CheckIcon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${featured ? 'text-green-300' : item.startsWith('✗') ? 'text-gray-300' : 'text-green-500'}`} />
            <span>{item.replace(/^[✓✗] /, '')}</span>
          </li>
        ))}
      </ul>
      <Link to={user ? '/profile' : '/register'}
        className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all ${
          featured
            ? 'bg-white text-primary-700 hover:bg-primary-50 shadow-lg'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
        }`}>
        {user ? 'Manage Plan' : 'Get Started'}
      </Link>
    </div>
  );
}

// ── Blog card ──────────────────────────────────────────────────────────────────
function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug || post._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-50 to-blue-100">
        <img src={getImageUrl(post.coverImage)} alt={post.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" onError={imgOnError} />
        {post.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur text-primary-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{post.category}</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">{post.title}</h3>
        {post.excerpt && <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed">{post.excerpt}</p>}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
          <span className="font-medium">{post.author?.name || 'Library'}</span>
          {post.readTime && (
            <span className="flex items-center space-x-1"><ClockIcon className="h-3 w-3" /><span>{post.readTime} min</span></span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { user }        = useAuth();
  const { formatPrice } = useCurrency();
  const navigate        = useNavigate();
  const [search, setSearch]   = useState('');
  const [books,  setBooks]    = useState([]);
  const [cats,   setCats]     = useState([]);
  const [cms,    setCms]      = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [plans,  setPlans]    = useState([]);
  const [blogs,  setBlogs]    = useState([]);
  const [featured, setFeatured] = useState([]);
  const booksRef   = useRef(null);
  const authorsRef = useRef(null);
  const scrollBooks   = useHScroll(booksRef);
  const scrollAuthors = useHScroll(authorsRef);

  useEffect(() => {
    api.get('/books/popular').then(({ data }) => setBooks(data.books || [])).catch(() => {});
    api.get('/categories').then(({ data }) => setCats(data.categories?.slice(0, 8) || [])).catch(() => {});
    api.get('/memberships').then(({ data }) => setPlans(data.plans || [])).catch(() => {});
    api.get('/blogs?limit=3&featured=true').then(({ data }) => setBlogs(data.posts || [])).catch(() => {});
    api.get('/authors/featured').then(({ data }) => setFeatured(data.authors?.slice(0, 6) || [])).catch(() => {});
    api.get('/cms').then(({ data }) => {
      setCms(data.cms);
      setTestimonials(data.cms?.testimonials?.filter(t => t.isActive) || []);
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/books?search=${encodeURIComponent(search)}`);
  };

  const handleReserve = async (bookId) => {
    if (!user) { toast.error('Please login to reserve books'); navigate('/login'); return; }
    try { await api.post('/circulation/reserve', { bookId }); toast.success('Book reserved!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Reservation failed'); }
  };

  return (
    <div className="bg-gray-50">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0f172a] text-white min-h-[600px] flex items-center">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-600/30 blur-[120px] animate-pulse" />
          <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-violet-600/20 blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <SparklesIcon className="h-4 w-4 text-yellow-400" />
              <span className="text-white/90">10,000+ books — grow your mind today</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
              Your library,
              <span className="block bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                reimagined.
              </span>
            </h1>

            <p className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
              {cms?.heroSubtitle || 'Discover, reserve, and read thousands of books online. Physical or digital — your knowledge journey starts here.'}
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch}
              className="flex gap-2 max-w-2xl bg-white/10 backdrop-blur border border-white/20 p-1.5 rounded-2xl shadow-2xl">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Title, author, ISBN…"
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none" />
              </div>
              <button type="submit"
                className="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl transition-colors text-sm shadow-lg whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[['10K+', 'Books'], ['5K+', 'Members'], ['500+', 'Authors'], ['50+', 'Categories']].map(([n, l]) => (
                <div key={l} className="text-center sm:text-left">
                  <p className="text-2xl font-black text-white">{n}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative book stack (right side, desktop) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden xl:flex items-center justify-center pointer-events-none opacity-20">
          <div className="relative">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute rounded-xl bg-gradient-to-br from-primary-400 to-violet-600 shadow-2xl"
                style={{ width: 140, height: 200, transform: `rotate(${(i - 2) * 8}deg) translateY(${i * 10}px)`, zIndex: i, opacity: 0.6 + i * 0.08 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ HERO BANNER AD ════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 relative z-10">
        <BannerSlot placement="home_hero" className="shadow-2xl rounded-2xl" dismissable />
      </div>

      {/* ══ CATEGORIES ════════════════════════════════════════════════════════ */}
      {cats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-10">
          <SectionHeader title="Browse by Genre" link="/books" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {cats.map(cat => (
              <Link key={cat._id} to={`/books?category=${cat._id}`}
                className="group flex flex-col items-center p-4 bg-white border-2 border-transparent rounded-2xl hover:border-primary-200 hover:bg-primary-50 hover:shadow-md transition-all text-center">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{cat.icon || '📚'}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-primary-700 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══ POPULAR BOOKS (horizontal scroll) ════════════════════════════════ */}
      {books.length > 0 && (
        <section className="bg-white py-16 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-7">
              <div>
                <SectionHeader title="Popular Books" subtitle="Most borrowed and read this month" link="/books" />
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button onClick={() => scrollBooks(-1)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button onClick={() => scrollBooks(1)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div ref={booksRef} className="flex space-x-4 overflow-x-auto pb-3 scrollbar-hide snap-x">
              {books.map(book => (
                <div key={book._id} className="flex-shrink-0 w-44 snap-start">
                  <BookCard book={book} onReserve={handleReserve}
                    priceDisplay={book.isDigitalSale ? formatPrice(book.digitalPrice) : null} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ MIDDLE BANNER ═════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BannerSlot placement="home_middle" className="h-36 sm:h-44 rounded-2xl" />
      </div>

      {/* ══ FEATURED AUTHORS ══════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">Our Collection</p>
                <h2 className="text-3xl font-extrabold">Featured Authors</h2>
              </div>
              <Link to="/authors"
                className="flex items-center space-x-1 text-sm font-semibold text-primary-300 hover:text-white transition-colors group">
                <span>All Authors</span><ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div ref={authorsRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
              {featured.map(a => (
                <Link key={a._id} to={`/authors/${a.slug || a._id}`}
                  className="group text-center">
                  <div className="relative mx-auto mb-3 h-24 w-24">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity blur-sm scale-110" />
                    <img src={getImageUrl(a.avatar)} alt={a.name}
                      className="relative h-full w-full rounded-full object-cover object-top border-2 border-white/20 group-hover:border-primary-400 transition-all"
                      onError={imgOnError} />
                  </div>
                  <p className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors leading-tight">{a.name}</p>
                  {a.nationality && <p className="text-xs text-white/40 mt-0.5">{a.nationality}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY CHOOSE US ═════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Why us?</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Everything you need to read more</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(cms?.featuresSection?.length ? cms.featuresSection : [
            { icon: '📚', title: 'Vast Collection',     description: 'Over 10,000 books across all genres and subjects.' },
            { icon: '🎧', title: 'Read Aloud (TTS)',    description: 'Listen to books with natural voice narration.' },
            { icon: '📱', title: 'Mobile Friendly',     description: 'Access your library from any device, anywhere.' },
            { icon: '🔔', title: 'Smart Reminders',     description: 'Never miss a due date with smart notifications.' },
          ]).map((f, i) => (
            <div key={i}
              className="relative bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform duration-200">{f.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MEMBERSHIP PLANS ══════════════════════════════════════════════════ */}
      {plans.length > 0 && (
        <section className="bg-gradient-to-b from-white via-primary-50/30 to-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Membership</p>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Flexible plans for every reader. Cancel anytime.</p>
            </div>
            <div className={`grid gap-6 items-center ${
              plans.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
              plans.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' :
              'sm:grid-cols-3'
            }`}>
              {plans.map((plan, i) => (
                <PlanCard key={plan._id} plan={plan} formatPrice={formatPrice}
                  featured={plans.length > 1 && i === Math.floor(plans.length / 2)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ BLOG POSTS ════════════════════════════════════════════════════════ */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <SectionHeader title="From Our Blog" subtitle="Tips, author spotlights & library news" link="/blog" linkLabel="All Posts" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {blogs.map(post => <BlogCard key={post._id} post={post} />)}
          </div>
        </section>
      )}

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="bg-[#0f172a] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Reviews</p>
              <h2 className="text-3xl font-extrabold text-white">What our members say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-7">
                  <div className="flex text-yellow-400 mb-4">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => <StarIcon key={j} className="h-4 w-4" />)}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed italic mb-6">"{t.comment}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ BOTTOM BANNER ═════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BannerSlot placement="home_bottom" className="h-32 rounded-2xl" />
      </div>

      {/* ══ CTA ═══════════════════════════════════════════════════════════════ */}
      {!user && (
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-violet-700 text-white py-20 text-center">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative max-w-2xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold mb-4">{cms?.ctaTitle || 'Join thousands of readers'}</h2>
            <p className="text-primary-100 mb-10 text-lg">{cms?.ctaDescription || 'Get unlimited access to our library — start free today.'}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/register"
                className="px-8 py-4 bg-white text-primary-700 rounded-2xl font-black hover:bg-primary-50 transition-colors shadow-xl text-sm">
                Start for Free →
              </Link>
              <Link to="/books"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold hover:bg-white/10 transition-colors text-sm">
                Browse Books
              </Link>
            </div>
          </div>
        </section>
      )}

      <style>{`.scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; } .scrollbar-hide::-webkit-scrollbar { display:none; }`}</style>
    </div>
  );
}
