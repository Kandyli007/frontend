
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type Article = {
  _id: string;
  title: string;
  authors: string;
  excerpt: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: { content: string; author?: string }[];
};

export default function ReviewPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchPending = async () => {
    const res = await fetch(`${API}/articles?status=pending`);
    const data: Article[] = await res.json();
    setArticles(data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await fetch(`${API}/articles/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchPending();
  };

  const addComment = async (id: string, content: string) => {
    await fetch(`${API}/articles/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Moderator', content }),
    });
    fetchPending();
  };

  return (
    <>
      <Head>
        <title>Review Pending Articles</title>
      </Head>
      <header>
        <h1>Pending Articles for Review</h1>
        <nav>
          <Link href="/">← Home</Link>
        </nav>
      </header>
      <main>
        {articles.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No articles at the moment.</p>
        ) : (
          articles.map((art) => (
            <div key={art._id} className="review-card">
              <h2>{art.title}</h2>
              <p><strong>Author:</strong> {art.authors}</p>
              <p><strong>Excerpt:</strong> {art.excerpt}</p>
              <div style={{ margin: '1rem 0' }}>
                <button onClick={() => updateStatus(art._id, 'approved')}>
                  Approve
                </button>
                <button onClick={() => updateStatus(art._id, 'rejected')} style={{ marginLeft: '1rem' }}>
                  Reject
                </button>
              </div>
              <div>
                <h4>Comments</h4>
                <ul>
                  {art.comments.map((c, i) => (
                    <li key={i}>
                      <strong>{c.author || 'Anonymous'}:</strong> {c.content}
                    </li>
                  ))}
                </ul>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = e.currentTarget;
                    const inp = f.elements.namedItem('comment') as HTMLInputElement;
                    addComment(art._id, inp.value);
                    inp.value = '';
                  }}
                  style={{ marginTop: '0.5rem' }}
                >
                  <input
                    name="comment"
                    placeholder="Add comment…"
                    required
                    style={{ width: '70%', padding: '0.5rem' }}
                  />
                  <button type="submit" style={{ marginLeft: '0.5rem' }}>
                    Add
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}


