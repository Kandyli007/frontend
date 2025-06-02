// pages/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type Article = {
  _id: string;
  title: string;
  authors: string;
  year?: number;
  sePractice?: string;
  type?: string;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchText, setSearchText] = useState('');
  const [practiceFilter, setPracticeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/articles`;
      const params: string[] = [];
      if (searchText) params.push(`search=${encodeURIComponent(searchText)}`);
      if (practiceFilter) params.push(`sePractice=${encodeURIComponent(practiceFilter)}`);
      if (params.length) {
        url += '?' + params.join('&');
      }

      const res = await fetch(url);
      const data: Article[] = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
      setArticles([]); 
      //if the request go wrong, then keeo the table as empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //and extract the articles when reload in first time
    fetchArticles();
    //here is to eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <>
      <Head>
        <title>SPEED Article Search</title>
      </Head>
      <header>
        <h1>SPEED Article Search</h1>
        <nav>
          <Link href="/submit">Submit Article</Link>
        </nav>
      </header>
      <main>
        <section className="search-section">
          <form onSubmit={handleSearch}>
            <input
              className="search-bar"
              type="text"
              placeholder="Search articles..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="filters">
              <select
                value={practiceFilter}
                onChange={(e) => setPracticeFilter(e.target.value)}
              >
                <option value="">All SE Practices</option>
                <option value="Test-Driven Development">Test-Driven Development</option>
                <option value="Code Reviews">Code Reviews</option>
                <option value="Pair Programming">Pair Programming</option>
                <option value="Agile">Agile</option>
                <option value="Continuous Integration">Continuous Integration</option>
                <option value="Continuous Deployment">Continuous Deployment</option>
                <option value="Version Control">Version Control</option>
                <option value="Defensive Programming">Defensive Programming</option>
                <option value="Refactoring">Refactoring</option>
                <option value="Behaviour Driven Development">Behaviour Driven Development</option>
              </select>
              <button type="submit">Search</button>
            </div>
          </form>

          <h2>All Articles</h2>

          {loading ? (
            <p>Loading...</p>
          ) : articles.length === 0 ? (
            <p>No articles found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>Year</th>
                  <th>Practice</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td>
                      <Link href={`/article/${article._id}`}>
                        {article.title}
                      </Link>
                    </td>
                    <td>{article.authors}</td>
                    <td>{article.year || ''}</td>
                    <td>{article.sePractice || ''}</td>
                    <td>{article.type || ''}</td>
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
