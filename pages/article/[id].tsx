

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentName || !commentText) return;
    setFeedbackMsg(null);
    try {
      const res = await axios.post<{ article: Article }>(
        `${BASE_URL}/articles/${id}/comments`,
        { name: commentName, comment: commentText }
      );
      setArticle(res.data.article);
      setCommentName('');
      setCommentText('');
      setFeedbackMsg('Comment added successfully.');
    } catch (err) {
      console.error('Error adding comment:', err);
      setFeedbackMsg('Failed to add comment due to an unexpected error.');
    }
  };


  const updateStatus = async (status: 'approved' | 'rejected') => {
     //in here we make the status variables with only approve and reject
    if (!id) return;
    try {
      await axios.patch(`${BASE_URL}/articles/${id}/status`, { status });
      alert(`Article ${status}.`);
      router.push(status === 'approved' ? '/' : '/admin');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error: could not update article status.');
    }
  };

  if (loading) {
    return (
      <main>
        <p>Loading article...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main>
        <p>Article not found.</p>
        <a href="/">← Back to Search</a>
      </main>
    );
  }

  const isPending = article.status === 'pending';

  return (
    <>
      <h1>Article Details</h1>
      <p>
        <strong>Title:</strong> {article.title}
      </p>
      <p>
        <strong>Authors:</strong> {article.authors}
      </p>
      {article.year && (
        <p>
          <strong>Year:</strong> {article.year}
        </p>
      )}
      {article.sePractice && (
        <p>
          <strong>Practice:</strong> {article.sePractice}
        </p>
      )}
      {article.type && (
        <p>
          <strong>Type:</strong> {article.type}
        </p>
      )}
      {article.claim && (
        <p>
          <strong>Claim:</strong> {article.claim}
        </p>
      )}
      {article.evidence && (
        <p>
          <strong>Evidence:</strong> {article.evidence}
        </p>
      )}
      {article.participants && (
        <p>
          <strong>Participants:</strong> {article.participants}
        </p>
      )}
      <p>
        <strong>Status:</strong>{' '}
        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
      </p>

      {isPending && (
        <div style={{ margin: '1rem 0' }}>
          <button
            onClick={() => updateStatus('approved')}
            style={{ marginRight: '1rem' }}
          >
            Approve
          </button>
          <button onClick={() => updateStatus('rejected')}>Reject</button>
        </div>
      )}

      <h3>Reviews</h3>
      {article.comments.length > 0 ? (
        article.comments.map((c, i) => (
          <div key={i}>
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
            Name:
            <input
              type="text"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Comment:
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit Review</button>
          {feedbackMsg && <p><em>{feedbackMsg}</em></p>}
        </form>
      )}
    </>
  );
}
