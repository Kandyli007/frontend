import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [practice, setPractice] = useState('');

  const fetchArticles = async () => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (practice) queryParams.append('sePractice', practice);

    const res = await fetch(`/api/articles?${queryParams.toString()}`);
    const data = await res.json();
    setArticles(data);
  };

  useEffect(() => {
    fetchArticles();
  }, [search, practice]);

  return (
    <>
      <header>
        <h1>SPEED Article Search</h1>
        <nav>
          <Link href="/admin">
            <button style={{ float: 'right' }}>Admin View</button>
          </Link>
        </nav>
      </header>

      <main>
        <div className="search-section">
          <input
            type="text"
            id="searchInput"
            className="search-bar"
            placeholder="Search by keywords (e.g., author, practice, claim)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            id="practiceFilter"
            value={practice}
            onChange={(e) => setPractice(e.target.value)}
          >
            <option value="">All SE Practices</option>
            <option value="Test-Driven Development">Test-Driven Development</option>
            <option value="Code Reviews">Code Reviews</option>
            <option value="Pair Programming">Pair Programming</option>
            <option value="Agile">Agile</option>
            <option value="Continuous Integration">Continuous Integration</option>
            <option value="Continuous Deployment">Continuous Deployment</option>
          </select>

          <button onClick={fetchArticles}>Search</button>

          <h2>All Articles</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Authors</th>
                <th>Year</th>
                <th>Practice</th>
                <th>Claim</th>
                <th>Evidence</th>
                <th>Type</th>
                <th>Participants</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td>
                    <Link href={`/article/${article._id}`}>{article.title}</Link>
                  </td>
                  <td>{article.authors}</td>
                  <td>{article.year}</td>
                  <td>{article.sePractice}</td>
                  <td>{article.claim}</td>
                  <td>{article.evidence}</td>
                  <td>{article.type}</td>
                  <td>{article.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

