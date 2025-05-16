import { useState } from 'react';
import axios from 'axios';

export default function Submit() {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/articles', { title, authors, abstract });
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
