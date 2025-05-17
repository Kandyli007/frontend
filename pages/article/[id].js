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
      setError('Article not found or has been deleted');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await axios.patch(`${BASE_URL}/articles/${id}/review`, { status });
      fetchArticle(); // Reload with the latest status
    } catch {
      alert('Update failed');
    }
  };

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p><strong>Author:</strong> {article.authors || 'Unknown'}</p>
      <p><strong>Abstract:</strong> {article.abstract || 'No abstract available'}</p>
      <p><strong>Status:</strong> {article.status}</p>
      <p><strong>Created at:</strong> {new Date(article.createdAt).toLocaleString()}</p>

      {article.status === 'pending' && (
        <>
          <button onClick={() => updateStatus('approved')} style={{ padding: '8px 16px', marginRight: '10px' }}>✅ Approve</button>
          <button onClick={() => updateStatus('rejected')} style={{ padding: '8px 16px' }}>❌ Reject</button>
        </>
      )}

      <Link href={`/article/${article._id}/edit`}>
        <button style={{ marginTop: '15px', padding: '8px 16px' }}>✏️ Edit</button>
      </Link>

      <h3>Comments</h3>
      <ul>
        {article.comments?.length > 0 ? (
          article.comments
            .slice()
            .reverse()
            .map((comment, i) => (
              <li key={i} style={{ marginBottom: '10px' }}>
                <p><strong>{comment.author}</strong>: {comment.content}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </li>
            ))
        ) : (
          <p>No comments yet</p>
        )}
      </ul>

      <h4>Add a Comment</h4>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const author = e.target.author.value;
          const content = e.target.content.value;
          if (!author || !content) return;

          try {
            await axios.post(`${BASE_URL}/articles/${id}/comments`, { author, content });
            fetchArticle();
            e.target.reset();
          } catch {
            alert('Submission failed');
          }
        }}
        style={{ marginTop: '20px' }}
      >
        <input name="author" placeholder="Your Name" required style={{ padding: '8px', width: '100%' }} />
        <br />
        <textarea name="content" placeholder="Write your comment" required style={{ padding: '8px', width: '100%', marginTop: '10px' }} />
        <br />
        <button type="submit" style={{ padding: '8px 16px', marginTop: '10px' }}>Submit Comment</button>
      </form>

      <br />
      <Link href="/" style={{ textDecoration: 'none', color: 'blue' }}>← Back to Home</Link>
    </div>
  );
}
