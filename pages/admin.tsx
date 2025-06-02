import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type ArticleSummary = {
  _id: string;
  title: string;
  authors: string;
  sePractice?: string;
  year?: number;
};

export default function AdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [pendingArticles, setPendingArticles] = useState<ArticleSummary[]>([]);

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_BASE}/articles?status=pending`);
      const data = await res.json();
      setPendingArticles(data);
    } catch (err) {
      console.error('Failed to fetch pending articles', err);
    }
  };

  useEffect(() => {
    fetchPending();
    // and then ferch eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        setPendingArticles(prev => prev.filter(item => item._id !== id));
      } else {
        alert('Failed to approve article.');
      }
    } catch (err) {
      console.error('Error approving article:', err);
      alert('Error occurred while approving.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) {
        setPendingArticles(prev => prev.filter(item => item._id !== id));
      } else {
        alert('Failed to reject article.');
      }
    } catch (err) {
      console.error('Error rejecting article:', err);
      alert('Error occurred while rejecting.');
    }
  };

  return (
    <>
      <Head>
        <title>Admin – Pending Articles</title>
      </Head>
      <header>
        <h1>Pending Article Approvals</h1>
        <nav>
          <Link href="/">← Back to Search</Link>
        </nav>
      </header>
      <main>
        <section>
          <h2>Pending Submissions</h2>
          {pendingArticles.length === 0 ? (
            <p>No pending articles at the moment.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>Practice</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingArticles.map(article => (
                  <tr key={article._id}>
                    <td>
                      <Link href={`/article/${article._id}`}>
                        {article.title}
                      </Link>
                    </td>
                    <td>{article.authors}</td>
                    <td>{article.sePractice || ''}</td>
                    <td>{article.year || ''}</td>
                    <td>
                      <button onClick={() => handleApprove(article._id)} style={{ marginRight: '0.5rem' }}>
                        Approve
                      </button>
                      <button onClick={() => handleReject(article._id)}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
