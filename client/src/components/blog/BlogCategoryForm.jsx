// import { useState } from 'react';
// import api from '../utils/api';
// import toast from 'react-hot-toast';

// export default function BlogCategoryForm({ categories, onCreated }) {
//   const [name, setName] = useState('');
//   const [parent, setParent] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/blog-categories', {
//         name,
//         parent: parent || null
//       });

//       toast.success('Category created');
//       setName('');
//       setParent('');
//       onCreated();

//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error creating category');
//     }
//   };

//   // flatten tree for dropdown
//   const flatten = (nodes, arr = []) => {
//     nodes.forEach(n => {
//       arr.push(n);
//       if (n.children) flatten(n.children, arr);
//     });
//     return arr;
//   };

//   const flat = flatten(categories);

//   return (
//     <form onSubmit={handleSubmit} className="p-4 border rounded-xl space-y-3">

//       <input
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Category Name"
//         className="w-full border p-2 rounded"
//         required
//       />

//       <select
//         value={parent}
//         onChange={(e) => setParent(e.target.value)}
//         className="w-full border p-2 rounded"
//       >
//         <option value="">Main Category</option>
//         {flat.map(cat => (
//           <option key={cat._id} value={cat._id}>
//             {cat.name}
//           </option>
//         ))}
//       </select>

//       <button className="bg-primary-600 text-white px-4 py-2 rounded">
//         Add Category
//       </button>

//     </form>
//   );
// }


import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function BlogCategoryForm({ editItem, categories, onSaved }) {
  const [name, setName] = useState(editItem?.name || '');
  const [parent, setParent] = useState('');

  // flatten categories for dropdown
  const flatten = (nodes, arr = []) => {
    nodes.forEach(n => {
      arr.push(n);
      if (n.children) flatten(n.children, arr);
    });
    return arr;
  };

  const flat = flatten(categories);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editItem) {
        await api.put(`/blog-categories/${editItem._id}`, { name });
        toast.success('Updated');
      } else {
        await api.post('/blog-categories', {
          name,
          parent: parent || null
        });
        toast.success('Created');
      }

      onSaved();
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="label">Category Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
      </div>

      {!editItem && (
        <div>
          <label className="label">Parent Category</label>
          <select
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            className="input"
          >
            <option value="">Main Category</option>
            {flat.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end">
        <button className="btn-primary">
          {editItem ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}