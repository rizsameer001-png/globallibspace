// import { useEffect, useState } from 'react';
// import api from '../../utils/api';
// import toast from 'react-hot-toast';
// import { Modal, ConfirmDialog, LoadingSpinner, EmptyState } from '../../components/ui';
// import {
//   PlusIcon, PencilIcon, TrashIcon
// } from '@heroicons/react/24/outline';

// export default function ManageBlogCategories() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);

//   // 🔹 FETCH
//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/blog-categories');
//       setCategories(res.data.categories || []);
//     } catch {
//       toast.error('Failed to load categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // 🔹 FLATTEN (for table)
//   const flatten = (nodes, parent = '') => {
//     let arr = [];
//     nodes.forEach(n => {
//       arr.push({
//         _id: n._id,
//         name: n.name,
//         parent,
//       });
//       if (n.children) {
//         arr = arr.concat(flatten(n.children, n.name));
//       }
//     });
//     return arr;
//   };

//   const flat = flatten(categories);

//   // 🔹 CREATE / EDIT OPEN
//   const openCreate = () => {
//     setEditItem(null);
//     setModalOpen(true);
//   };

//   const openEdit = (cat) => {
//     setEditItem(cat);
//     setModalOpen(true);
//   };

//   // 🔹 DELETE
//   const handleDelete = async () => {
//     try {
//       await api.delete(`/blog-categories/${deleteId}`);
//       toast.success('Deleted');
//       fetchCategories();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Delete failed');
//     } finally {
//       setDeleteId(null);
//     }
//   };

//   return (
//     <div>
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Blog Categories</h1>
//         <button onClick={openCreate} className="btn-primary flex items-center space-x-1">
//           <PlusIcon className="h-4 w-4" />
//           <span>Add Category</span>
//         </button>
//       </div>

//       {/* TABLE */}
//       {loading ? <LoadingSpinner /> : flat.length === 0 ? (
//         <EmptyState title="No categories found" />
//       ) : (
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
//           <table className="table-base">
//             <thead>
//               <tr>
//                 <th className="th">Name</th>
//                 <th className="th">Parent</th>
//                 <th className="th">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {flat.map(cat => (
//                 <tr key={cat._id}>
//                   <td className="td font-medium">{cat.name}</td>
//                   <td className="td text-gray-500">{cat.parent || '—'}</td>
//                   <td className="td">
//                     <div className="flex space-x-1">
//                       <button onClick={() => openEdit(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
//                         <PencilIcon className="h-4 w-4" />
//                       </button>
//                       <button onClick={() => setDeleteId(cat._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
//                         <TrashIcon className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* MODAL */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Category' : 'New Category'}>
//         <CategoryForm
//           editItem={editItem}
//           categories={categories}
//           onSaved={() => {
//             fetchCategories();
//             setModalOpen(false);
//           }}
//         />
//       </Modal>

//       {/* DELETE */}
//       <ConfirmDialog
//         open={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         title="Delete Category"
//         message="Delete this category?"
//         danger
//       />
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Modal, ConfirmDialog, LoadingSpinner, EmptyState } from '../../components/ui';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import BlogCategoryForm from '../../components/BlogCategoryForm';

export default function ManageBlogCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 FETCH
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blog-categories');
      setCategories(res.data.categories || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 FLATTEN (for table)
  const flatten = (nodes, parent = '') => {
    let arr = [];
    nodes.forEach(n => {
      arr.push({ _id: n._id, name: n.name, parent });
      if (n.children) arr = arr.concat(flatten(n.children, n.name));
    });
    return arr;
  };

  const flat = flatten(categories);

  // 🔹 ACTIONS
  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditItem(cat);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/blog-categories/${deleteId}`);
      toast.success('Deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Categories</h1>
        <button onClick={openCreate} className="btn-primary flex items-center space-x-1">
          <PlusIcon className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* TABLE */}
      {loading ? <LoadingSpinner /> : flat.length === 0 ? (
        <EmptyState title="No categories found" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th className="th">Name</th>
                <th className="th">Parent</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flat.map(cat => (
                <tr key={cat._id}>
                  <td className="td font-medium">{cat.name}</td>
                  <td className="td text-gray-500">{cat.parent || '—'}</td>
                  <td className="td">
                    <div className="flex space-x-1">
                      <button onClick={() => openEdit(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(cat._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Category' : 'New Category'}>
        <BlogCategoryForm
          editItem={editItem}
          categories={categories}
          onSaved={() => {
            fetchCategories();
            setModalOpen(false);
          }}
        />
      </Modal>

      {/* DELETE */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Delete this category?"
        danger
      />
    </div>
  );
}