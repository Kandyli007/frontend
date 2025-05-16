import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/articles', {
        params: { search, page, limit: 5 },
      });
      setArticles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:3001/articles/${id}/review`, { status });
    fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
  }, [search, page]);

  return (
    <div>
      <h1>文章列表</h1>
      <input
        placeholder="搜索标题"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul>
        {articles.map(article => (
          <li key={article._id}>
            {/* 文章标题点击可跳转详情页 */}
            <Link href={`/article/${article._id}`}>
              <strong style={{ cursor: 'pointer', color: 'blue' }}>
                {article.title}
              </strong>
            </Link>
            {' '}— 状态: {article.status}
            {article.status === 'pending' && (
              <>
                <button onClick={() => updateStatus(article._id, 'approved')}>批准</button>
                <button onClick={() => updateStatus(article._id, 'rejected')}>拒绝</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPage(prev => Math.max(1, prev - 1))}>上一页</button>
        <span> 第 {page} 页 </span>
        <button onClick={() => setPage(prev => prev + 1)}>下一页</button>
      </div>
    </div>
  );
}
