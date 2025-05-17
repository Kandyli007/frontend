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
      alert('保存失败');
    }
  };

  return (
    <div>
      <h1>编辑文章</h1>
      <form onSubmit={handleSubmit}>
        <label>标题：</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <br />

        <label>作者：</label>
        <input
          type="text"
          value={formData.authors}
          onChange={e => setFormData({ ...formData, authors: e.target.value })}
        />
        <br />

        <label>摘要：</label>
        <textarea
          value={formData.abstract}
          onChange={e => setFormData({ ...formData, abstract: e.target.value })}
        />
        <br />

        <button type="submit">保存修改</button>
      </form>
    </div>
  );
}
