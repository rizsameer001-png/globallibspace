
// import { useEffect, useState } from 'react';
// import api from '../../utils/api';

// import BlogCategoryForm from '../../components/BlogCategoryForm';
// import BlogCategoryTree from '../../components/BlogCategoryTree';

// export default function BlogCategories() {
//   const [categories, setCategories] = useState([]);

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get('/blog-categories');
//       setCategories(res.data.categories || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="p-6 space-y-6">

//       <h1 className="text-2xl font-bold">Blog Categories</h1>

//       <BlogCategoryForm
//         categories={categories}
//         onCreated={fetchCategories}
//       />

//       <BlogCategoryTree categories={categories} />

//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import api from '../../utils/api';

import BlogCategoryForm from '../../components/BlogCategoryForm';
import BlogCategoryTree from '../../components/BlogCategoryTree';

export default function BlogCategories() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/blog-categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Blog Categories</h1>

      <BlogCategoryForm
        categories={categories}
        onCreated={fetchCategories}
      />

      <BlogCategoryTree
        categories={categories}
        onUpdated={fetchCategories}
      />

    </div>
  );
}