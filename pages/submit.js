import { useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Submit() {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/articles`, { title, authors, abstract }); // 用反引号包裹
      setMessage('提交成功！');
      setTitle('');
      setAuthors('');
      setAbstract('');
    } catch (err) {
      setMessage('提交失败');
    }
  };

  return (
    <div>
      <h1>提交文章</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>标题：</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>作者：</label>
          <input value={authors} onChange={e => setAuthors(e.target.value)} />
        </div>
        <div>
          <label>摘要：</label>
          <textarea value={abstract} onChange={e => setAbstract(e.target.value)} />
        </div>
        <button type="submit">提交</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
