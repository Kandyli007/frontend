import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  status: string;
  comments: { name: string; comment: string; createdAt: string }[];
};

export default function ArticlePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchArticle = async (articleId: string) => {
    try {
      const res = await fetch(`${API_BASE}/articles/${articleId}`);
      const data = await res.json();
      setArticle(data);
    } catch (err) {
      console.error('Failed to fetch article details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle(id as string);
    }
    //in here it eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentName || !commentText) return;
    setFeedbackMsg(null);
    try {
      const res = await fetch(`${API_BASE}/articles/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: commentName, comment: commentText })
      });
      const data = await res.json();
      if (res.ok) {
        //and if it works then update the article state with the new comment
        setArticle(data.article);
        setCommentName('');
        setCommentText('');
        setFeedbackMsg('Comment added successfully.');
      } else {
        setFeedbackMsg(data.error || 'Failed to add comment.');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setFeedbackMsg('Failed to add comment due to an unexpected error.');
    }
  };

  const handleApproveReject = async (newStatus: 'approved' | 'rejected') => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/articles/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        //if on a success, then redirect back to admin page or home
        alert(`Article ${newStatus}.`);
        router.push(newStatus === 'approved' ? '/' : '/admin');
      } else {
        alert('Failed to update status.');
      }
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
        <Link href="/">← Back to Search</Link>
      </main>
    );
  }

  const isPending = article.status === 'pending';

  return (
    <>
      <Head>
        <title>{article.title} – Article Details</title>
      </Head>
      <header>
        <h1>Article Details</h1>
        <nav>
          <Link href="/">← Back to Search</Link>
          {/** if needed, link to submit or others can be added */}
        </nav>
      </header>
      <main>
        <section>
          <h2>{article.title}</h2>
          <p><strong>Authors:</strong> {article.authors}</p>
          {article.year && <p><strong>Year:</strong> {article.year}</p>}
          {article.sePractice && <p><strong>Practice:</strong> {article.sePractice}</p>}
          {article.type && <p><strong>Type:</strong> {article.type}</p>}
          {article.claim && <p><strong>Claim:</strong> {article.claim}</p>}
          {article.evidence && <p><strong>Evidence:</strong> {article.evidence}</p>}
          {article.participants && <p><strong>Participants:</strong> {article.participants}</p>}
          <p><strong>Status:</strong> {article.status.charAt(0).toUpperCase() + article.status.slice(1)}</p>

          {/* if this article is pending review and we are on admin (no auth, but assume admin access), show approve/reject buttons */}
          {isPending && (
            <div style={{ margin: '1rem 0' }}>
              <button onClick={() => handleApproveReject('approved')} style={{ marginRight: '1rem' }}>
                Approve
              </button>
              <button onClick={() => handleApproveReject('rejected')}>
                Reject
              </button>
            </div>
          )}
        </section>

        {/* comments/Reviews Section (only for approved articles typically) */}
        <section>
          <h3>Reviews</h3>
          {article.comments && article.comments.length > 0 ? (
            <div>
              {article.comments.map((c, idx) => (
                <div key={idx} className="review">
                  <p><strong>{c.name}</strong> (<em>{new Date(c.createdAt).toLocaleString()}</em>)</p>
                  <p>{c.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}

          {/* and only allow adding comments if article is approved */}
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
              <label>
                Comment:
                <textarea 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)} 
                  required 
                />
              </label>
              <button type="submit">Submit Review</button>
            </form>
          )}
          {feedbackMsg && <p><em>{feedbackMsg}</em></p>}
        </section>
      </main>
    </>
  );
}
