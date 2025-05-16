import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/articles/${id}`);
      setArticle(res.data);
      setError('');
    } catch (err) {
      setError('文章未找到或已删除');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await axios.patch(`${BASE_URL}/articles/${id}/review`, { status });
      fetchArticle(); // 重新加载最新状态
    } catch (err) {
      alert('更新失败');
    }
  };

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  if (loading) return <p>加载中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p><strong>作者：</strong>{article.authors || '未知'}</p>
      <p><strong>摘要：</strong>{article.abstract || '无摘要'}</p>
      <p><strong>状态：</strong>{article.status}</p>
      <p><strong>创建时间：</strong>{new Date(article.createdAt).toLocaleString()}</p>

      {article.status === 'pending' && (
        <>
          <button onClick={() => updateStatus('approved')}>✅ 批准</button>
          <button onClick={() => updateStatus('rejected')}>❌ 拒绝</button>
        </>
      )}

<Link href={`/article/${article._id}/edit`}>
  <button>✏️ 编辑</button>
</Link>

      <h3>评论</h3>
<ul>
  {article.comments?.length > 0 ? (
    article.comments
      .slice()
      .reverse()
      .map((comment, i) => (
        <li key={i}>
          <p><strong>{comment.author}</strong>: {comment.content}</p>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
        </li>
      ))
  ) : (
    <p>暂无评论</p>
  )}
</ul>
<h4>添加评论</h4>
<form
  onSubmit={async (e) => {
    e.preventDefault();
    const author = e.target.author.value;
    const content = e.target.content.value;
    if (!author || !content) return;

    try {
      await axios.post(`${BASE_URL}/articles/${id}/comments`, {
        author,
        content,
      });
      fetchArticle();
      e.target.reset();
    } catch {
      alert('提交失败');
    }
  }}
>
  <input name="author" placeholder="昵称" required />
  <br />
  <textarea name="content" placeholder="写下你的评论" required />
  <br />
  <button type="submit">提交评论</button>
</form>


      <br /><br />
      <Link href="/">← 返回首页</Link>
    </div>
  );
}
