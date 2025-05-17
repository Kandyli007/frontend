import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/articles`, {
        params: { search, page, limit: 5 },
      });
      setArticles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${BASE_URL}/articles/${id}/review`, { status });
      fetchArticles(); // Reload the list after status update
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search, page]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Article List</h1>
      
      <input
        placeholder="Search by title"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '20px' }}
      />
      
      <ul>
        {articles.map(article => (
          <li key={article._id} style={{ marginBottom: '15px' }}>
            {/* Article title click navigates to details page */}
            <Link href={`/article/${article._id}`}>
              <strong style={{ cursor: 'pointer', color: 'blue' }}>
                {article.title}
              </strong>
            </Link> 
            — Status: {article.status}

            {article.status === 'pending' && (
              <>
                <button
                  onClick={() => updateStatus(article._id, 'approved')}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '5px 10px',
                    marginLeft: '10px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(article._id, 'rejected')}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '5px 10px',
                    marginLeft: '10px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Previous Page
        </button>
        
        <span> Page {page} </span>
        
        <button
          onClick={() => setPage(prev => prev + 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
