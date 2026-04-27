import { useRef } from 'react';
import { BookOpenIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { getImageUrl, imgOnError, PLACEHOLDER } from '../../utils/image';


// ── BookCard ───────────────────────────────────────────────────────────────────
// export const BookCard = ({ book, onReserve, reserved, priceDisplay }) => {
//   const available  = (book.availableCopies || 0) > 0;
//   const coverSrc   = getImageUrl(book.coverImage);
//   const isDigital  = book.bookType === 'digital' || book.bookType === 'both';
//   const isPhysical = book.bookType === 'physical' || book.bookType === 'both' || !book.bookType;

//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
//       <Link to={`/books/${book._id}`} className="block">
//         <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
//           <img
//             src={coverSrc}
//             alt={book.title}
//             className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
//             onError={imgOnError}
//             loading="lazy"
//           />
//           {isDigital && (
//             <div className="absolute top-2 left-2">
//               <span className="badge bg-purple-600 text-white text-xs">
//                 {book.ebookFormat ? book.ebookFormat.toUpperCase() : 'Digital'}
//               </span>
//             </div>
//           )}
//           {priceDisplay && (
//             <div className="absolute top-2 right-2">
//               <span className="badge bg-yellow-500 text-white text-xs font-bold">{priceDisplay}</span>
//             </div>
//           )}
//         </div>
//       </Link>

//       <div className="p-3 flex flex-col flex-1">
//         <Link to={`/books/${book._id}`}>
//           <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-primary-600 line-clamp-2 transition-colors">
//             {book.title}
//           </h3>
//         </Link>
//         <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">
//           {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
//         </p>
//         <div className="mt-auto flex items-center justify-between">
//           {isPhysical && (
//             <span className={`badge text-xs ${available ? 'badge-green' : 'badge-red'}`}>
//               {available ? 'Available' : 'Unavailable'}
//             </span>
//           )}
//           {!isPhysical && isDigital && (
//             <span className="badge bg-purple-100 text-purple-700 text-xs">E-Book</span>
//           )}
//           {onReserve && isPhysical && (
//             <button
//               onClick={e => { e.preventDefault(); onReserve(book._id); }}
//               className="text-primary-600 hover:text-primary-800 transition-colors ml-auto"
//               title={reserved ? 'Reserved' : 'Reserve'}
//             >
//               {reserved
//                 ? <BookmarkSolid className="h-5 w-5" />
//                 : <BookmarkIcon  className="h-5 w-5" />
//               }
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const BookCard = ({ book, onReserve, reserved, priceDisplay }) => {
//   const available = (book.availableCopies || 0) > 0;
//   const coverSrc = getImageUrl(book.coverImage);

//   const isDigital =
//     book.bookType === 'digital' || book.bookType === 'both';
//   const isPhysical =
//     book.bookType === 'physical' ||
//     book.bookType === 'both' ||
//     !book.bookType;

//   return (
//     <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

//       {/* Glow effect */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary-100/0 via-primary-50/0 to-primary-100/0 group-hover:from-primary-100/40 group-hover:via-transparent group-hover:to-violet-100/40 transition-all duration-500" />

//       {/* Image */}
//       <Link to={`/books/${book._id}`} className="block relative">
//         <div className="relative h-52 overflow-hidden bg-gray-100">
//           <img
//             src={coverSrc}
//             alt={book.title}
//             onError={imgOnError}
//             loading="lazy"
//             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Dark overlay on hover */}
//           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />

//           {/* Badges */}
//           <div className="absolute top-2 left-2 flex flex-col gap-1">
//             {isDigital && (
//               <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-purple-600 text-white shadow">
//                 {book.ebookFormat ? book.ebookFormat.toUpperCase() : 'E-BOOK'}
//               </span>
//             )}

//             {!available && isPhysical && (
//               <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-red-500 text-white shadow">
//                 OUT OF STOCK
//               </span>
//             )}
//           </div>

//           {/* Price badge */}
//           {priceDisplay && (
//             <div className="absolute top-2 right-2">
//               <span className="px-2 py-1 text-[10px] font-extrabold rounded-full bg-yellow-400 text-black shadow-md">
//                 {priceDisplay}
//               </span>
//             </div>
//           )}
//         </div>
//       </Link>

//       {/* Content */}
//       <div className="p-4 flex flex-col flex-1">

//         {/* Title */}
//         <Link to={`/books/${book._id}`}>
//           <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
//             {book.title}
//           </h3>
//         </Link>

//         {/* Author */}
//         <p className="text-xs text-gray-500 mt-1 line-clamp-1">
//           {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
//         </p>

//         {/* Bottom row */}
//         <div className="mt-4 flex items-center justify-between">

//           {/* Status */}
//           {isPhysical && (
//             <span
//               className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
//                 available
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-red-100 text-red-600'
//               }`}
//             >
//               {available ? 'Available' : 'Unavailable'}
//             </span>
//           )}

//           {isDigital && !isPhysical && (
//             <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
//               Digital
//             </span>
//           )}

//           {/* Actions */}
//           <div className="flex items-center gap-2 ml-auto">

//             {/* Reserve Button */}
//             {onReserve && isPhysical && (
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   onReserve(book._id);
//                 }}
//                 className={`p-2 rounded-full transition-all ${
//                   reserved
//                     ? 'bg-primary-600 text-white'
//                     : 'bg-gray-100 hover:bg-primary-100 hover:text-primary-600'
//                 }`}
//                 title={reserved ? 'Reserved' : 'Reserve'}
//               >
//                 {reserved ? (
//                   <BookmarkSolid className="h-4 w-4" />
//                 ) : (
//                   <BookmarkIcon className="h-4 w-4" />
//                 )}
//               </button>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


export const BookCard = ({ book, onReserve, reserved, priceDisplay }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  const available = (book.availableCopies || 0) > 0;
  const coverSrc = getImageUrl(book.coverImage);
  const isDigital = book.bookType === 'digital' || book.bookType === 'both';
  const isPhysical = book.bookType === 'physical' || book.bookType === 'both' || !book.bookType;

  return (
  //   <div
  //     ref={cardRef}
  //     onMouseMove={handleMouseMove}
  //     onMouseLeave={handleMouseLeave}
  //     className="
  //       bg-white rounded-2xl border border-gray-100 shadow-md
  //       transition-transform duration-200 ease-out
  //       will-change-transform
  //       hover:shadow-2xl
  //       overflow-hidden flex flex-col group
  //     "
  //   >
  //     <Link to={`/books/${book._id}`} className="block">
  //       <div className="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
  //         <img
  //           src={coverSrc}
  //           alt={book.title}
  //           className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
  //           onError={imgOnError}
  //           loading="lazy"
  //         />

  //         {isDigital && (
  //           <div className="absolute top-2 left-2">
  //             <span className="px-2 py-1 text-xs rounded-full bg-purple-600 text-white shadow">
  //               DIGITAL
  //             </span>
  //           </div>
  //         )}

  //         {priceDisplay && (
  //           <div className="absolute top-2 right-2">
  //             <span className="px-2 py-1 text-xs rounded-full bg-yellow-500 text-white font-bold shadow">
  //               {priceDisplay}
  //             </span>
  //           </div>
  //         )}

  //         {/* subtle shine effect */}
  //         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-tr from-white/10 to-transparent" />
  //       </div>
  //     </Link>

  //     <div className="p-3 flex flex-col flex-1">
  //       <Link to={`/books/${book._id}`}>
  //         <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
  //           {book.title}
  //         </h3>
  //       </Link>

  //       <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">
  //         {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
  //       </p>

  //       <div className="mt-auto flex items-center justify-between">
  //         {isPhysical && (
  //           <span className={`text-xs px-2 py-1 rounded-full ${
  //             available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
  //           }`}>
  //             {available ? 'Available' : 'Unavailable'}
  //           </span>
  //         )}

  //         {!isPhysical && isDigital && (
  //           <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
  //             E-Book
  //           </span>
  //         )}

  //         {onReserve && isPhysical && (
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               onReserve(book._id);
  //             }}
  //             className="ml-auto text-primary-600 hover:text-primary-800 transition"
  //           >
  //             {reserved ? (
  //               <BookmarkSolid className="h-5 w-5" />
  //             ) : (
  //               <BookmarkIcon className="h-5 w-5" />
  //             )}
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

    <div
  ref={cardRef}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  className="
    bg-white rounded-2xl border border-gray-100 shadow-md
    transition-transform duration-200 ease-out
    hover:shadow-2xl overflow-hidden flex flex-col group
    p-2   /* ← NEW outer padding */
  "
>
  <Link to={`/books/${book._id}`} className="block">
    
    {/* 📚 COVER WRAPPER */}
    <div className="relative h-60 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
      
      {/* ✨ INNER PADDING for cover */}
      <div className="absolute inset-2 rounded-lg overflow-hidden">
        <img
          src={coverSrc}
          alt={book.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
          onError={imgOnError}
          loading="lazy"
        />
      </div>

      {/* BADGES */}
      {isDigital && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 text-xs rounded-full bg-purple-600 text-white shadow">
            DIGITAL
          </span>
        </div>
      )}

      {priceDisplay && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500 text-white font-bold shadow">
            {priceDisplay}
          </span>
        </div>
      )}

      {/* subtle shine */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-tr from-white/10 to-transparent" />
    </div>
  </Link>

  {/* 📄 CONTENT */}
  <div className="px-3 pt-3 pb-2 flex flex-col flex-1">
    
    <Link to={`/books/${book._id}`}>
      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
        {book.title}
      </h3>
    </Link>

    <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-1">
      {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
    </p>

    <div className="mt-auto flex items-center justify-between">
      {isPhysical && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {available ? 'Available' : 'Unavailable'}
        </span>
      )}

      {!isPhysical && isDigital && (
        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
          E-Book
        </span>
      )}

      {onReserve && isPhysical && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onReserve(book._id);
          }}
          className="ml-auto text-primary-600 hover:text-primary-800 transition"
        >
          {reserved
            ? <BookmarkSolid className="h-5 w-5" />
            : <BookmarkIcon className="h-5 w-5" />
          }
        </button>
      )}
    </div>
  </div>
</div>
);
};


// ── Modal ──────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

// ── Pagination ─────────────────────────────────────────────────────────────────
export const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  const delta = 2;
  const range = [];
  for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) range.push(i);
  return (
    <div className="flex items-center justify-center flex-wrap gap-1 mt-6">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors">
        ‹ Prev
      </button>
      {range[0] > 1 && <>
        <button onClick={() => onPageChange(1)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">1</button>
        {range[0] > 2 && <span className="px-1 text-gray-400">…</span>}
      </>}
      {range.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${p === page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:bg-gray-50'}`}>
          {p}
        </button>
      ))}
      {range[range.length - 1] < pages && <>
        {range[range.length - 1] < pages - 1 && <span className="px-1 text-gray-400">…</span>}
        <button onClick={() => onPageChange(pages)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">{pages}</button>
      </>}
      <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors">
        Next ›
      </button>
    </div>
  );
};

// ── LoadingSpinner ──────────────────────────────────────────────────────────────
export const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-3" />
    <p className="text-sm">{text}</p>
  </div>
);

// ── EmptyState ─────────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon = BookOpenIcon, title = 'Nothing here', description = '' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Icon className="h-12 w-12 mb-3 text-gray-300" />
    <p className="font-medium text-gray-500">{title}</p>
    {description && <p className="text-sm mt-1 text-center max-w-xs">{description}</p>}
  </div>
);

// ── StatCard ───────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon: Icon, color = 'blue', sub }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600', red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="card flex items-center space-x-4">
      <div className={`p-3 rounded-xl flex-shrink-0 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

// ── ConfirmDialog ──────────────────────────────────────────────────────────────
export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, danger }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{message}</p>
    <div className="flex justify-end space-x-3">
      <button onClick={onClose} className="btn-secondary">Cancel</button>
      <button onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>Confirm</button>
    </div>
  </Modal>
);
