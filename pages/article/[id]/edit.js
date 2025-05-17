import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditArticle() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
  });

  useEffect(() => {
    if (id) {
      axios.get(`${BASE_URL}/articles/${id}`).then(res => {
        setFormData({
          title: res.data.title,
          authors: res.data.authors || '',
          abstract: res.data.abstract || '',
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${BASE_URL}/articles/${id}`, formData);
      router.push(`/article/${id}`);
    } catch {
      alert('Save failed');
    }
  };

  return (
    <div>
      <h1>Edit Article</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
        />
        
        <label style={{ display: 'block', marginBottom: '8px' }}>Authors:</label>
        <input
          type="text"
          value={formData.authors}
          onChange={e => setFormData({ ...formData, authors: e.target.value })}
          style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
        />
        
        <label style={{ display: 'block', marginBottom: '8px' }}>Abstract:</label>
        <textarea
          value={formData.abstract}
          onChange={e => setFormData({ ...formData, abstract: e.target.value })}
          style={{ width: '100%', padding: '8px', height: '150px', marginBottom: '20px' }}
        />
        
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>Save Changes</button>
      </form>
    </div>
  );
}
