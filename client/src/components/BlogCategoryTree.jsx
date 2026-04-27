// export default function BlogCategoryTree({ categories }) {

//   const renderTree = (nodes, level = 0) => {
//     return nodes.map(node => (
//       <div key={node._id} style={{ marginLeft: level * 20 }} className="py-1">
//         📁 {node.name}
//         {node.children?.length > 0 && renderTree(node.children, level + 1)}
//       </div>
//     ));
//   };

//   return (
//     <div className="p-4 border rounded-xl">
//       {categories.length === 0 ? (
//         <p className="text-gray-500">No categories found</p>
//       ) : (
//         renderTree(categories)
//       )}
//     </div>
//   );
// }

import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function BlogCategoryTree({ categories, onUpdated }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/blog-categories/${id}`, { name: editName });
      toast.success('Updated');
      setEditingId(null);
      onUpdated();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await api.delete(`/blog-categories/${id}`);
      toast.success('Deleted');
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete');
    }
  };

  const renderTree = (nodes, level = 0) =>
    nodes.map(node => (
      <div key={node._id} style={{ marginLeft: level * 20 }} className="py-2 flex items-center justify-between group">

        {/* LEFT */}
        <div className="flex items-center space-x-2">
          📁
          {editingId === node._id ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
          ) : (
            <span>{node.name}</span>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="space-x-2 opacity-0 group-hover:opacity-100 transition">

          {editingId === node._id ? (
            <>
              <button onClick={() => saveEdit(node._id)} className="text-green-600">💾</button>
              <button onClick={() => setEditingId(null)} className="text-gray-500">✖</button>
            </>
          ) : (
            <>
              <button onClick={() => startEdit(node)} className="text-blue-600">✏️</button>
              <button onClick={() => deleteCategory(node._id)} className="text-red-600">🗑</button>
            </>
          )}

        </div>

        {/* CHILDREN */}
        {node.children?.length > 0 && (
          <div className="w-full">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));

  return (
    <div className="p-4 border rounded-xl">
      {categories.length === 0
        ? <p className="text-gray-500">No categories found</p>
        : renderTree(categories)
      }
    </div>
  );
}