
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';

type Article = {
  _id: string;
  title: string;
  authors: string;
  year?: number;
  sePractice?: string;
  claim?: string;
  evidence?: string;
  type?: string;
  participants?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: { name: string; comment: string; createdAt: string }[];
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchArticle = async (articleId: string) => {
    try {
      const res = await axios.get<Article>(`${BASE_URL}/articles/${articleId}`);
      setArticle(res.data);
    } catch (err) {
      console.error('Failed to fetch article details', err);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchArticle(id);
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentName || !commentText) return;
    try {
      const res = await axios.post<Article>(
        `${BASE_URL}/articles/${id}/comments`,
        { author: commentName, content: commentText }
      );
      setArticle(res.data);
      setCommentName('');
      setCommentText('');
      setFeedbackMsg('Comment added successfully.');
    } catch (err) {
      console.error('Error adding comment:', err);
      setFeedbackMsg('Failed to add comment.');
    }
  };

  const updateStatus = async (status: 'approved' | 'rejected') => {
    if (!id) return;
    try {
      await axios.patch(`${BASE_URL}/articles/${id}/status`, { status });
      alert(`Article ${status}.`);
      router.push(status === 'approved' ? '/' : '/review');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Could not update status.');
    }
  };

  if (loading) return <p>Loading article…</p>;
  if (!article) return <p>Article not found. <Link href="/">← Back</Link></p>;

  const isPending = article.status === 'pending';

  return (
    <>
      <Head><title>{article.title}</title></Head>
      <div className="detail-card">
        <h1>Article Details</h1>
        <p><strong>Title:</strong> {article.title}</p>
        <p><strong>Authors:</strong> {article.authors}</p>
        {article.year && <p><strong>Year:</strong> {article.year}</p>}
        {article.sePractice && <p><strong>Practice:</strong> {article.sePractice}</p>}
        {article.type && <p><strong>Type:</strong> {article.type}</p>}
        {article.claim && <p><strong>Claim:</strong> {article.claim}</p>}
        {article.evidence && <p><strong>Evidence:</strong> {article.evidence}</p>}
        {article.participants && <p><strong>Participants:</strong> {article.participants}</p>}
        <p><strong>Status:</strong> {article.status}</p>

        {isPending && (
          <div style={{ margin: '1rem 0' }}>
            <button onClick={() => updateStatus('approved')}>Approve</button>
            <button onClick={() => updateStatus('rejected')} style={{ marginLeft: '1rem' }}>
              Reject
            </button>
          </div>
        )}

        <h3>Reviews</h3>
        {article.comments.length > 0 ? (
          article.comments.map((c, i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <p>
                <strong>{c.name}</strong> (
                {new Date(c.createdAt).toLocaleString()})
              </p>
              <p>{c.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {!isPending && (
          <form onSubmit={handleAddComment} style={{ marginTop: '1rem' }}>
            <h4>Leave a Review:</h4>
            <label>
              Name:<br />
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
              />
            </label>
            <label>
              Comment:<br />
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
              />
            </label>
            <button type="submit" style={{ marginTop: '0.5rem' }}>Submit Review</button>
            {feedbackMsg && <p><em>{feedbackMsg}</em></p>}
          </form>
        )}
      </div>
    </>
  );
}
