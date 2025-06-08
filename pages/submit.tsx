import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';


export default function SubmitPage() {
  // here is to readf the backend address from the evironment variables 
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');      
  // and the journal/conference Name
  const [year, setYear] = useState('');
  const [doi, setDOI] = useState('');              
  //here is the DOI or URL
  const [description, setDescription] = useState('');
  //and a breif decribtion
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    
    const newArticle = {
    //in here it will construct the backend articles
      title,
      authors,
      year: year ? Number(year) : undefined,
      sePractice: '',              
      
      claim: description,          
      //here to breif describe as claim
      evidence: '',                
      //and describe as evidence for later use
      type: journal,               
      //here make the “Journal/Conference” as type
      participants: '',            
      //leave as blank

      excerpt,
      content,
    };

    try {
      const res = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Article submitted successfully for review.');
        //it will clear the table
        setTitle('');
        setAuthors('');
        setJournal('');
        setYear('');
        setDOI('');
        setDescription('');
        setExcerpt('');
        setContent('');
      } else {
        setMessage(data.error || 'Submission failed. Please check your input.');
      }
    } catch (err) {
      console.error('Error submitting article:', err);
      setMessage('Submission failed due to an unexpected error.');
    }
  };

  return (
    <>
      <Head>
        <title>Submit Article - SPEED</title>
      </Head>
      <header>
        <h1>Submit a New Article</h1>
        <nav>
          <Link href="/">← Back to Search</Link>
        </nav>
      </header>
      <main>
        <section className="submission-form">
          <h2>Submit a New Article</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Authors:
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                required
              />
            </label>
            <label>
              Journal/Conference Name:
              <input
                type="text"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
            </label>
            <label>
              Year:
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
            <label>
              DOI (URL):
              <input
                type="text"
                value={doi}
                onChange={(e) => setDOI(e.target.value)}
              />
            </label>
            <label>
              Short Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label>
  Excerpt:
  <textarea
    value={excerpt}
    onChange={e => setExcerpt(e.target.value)}
    required
  />
</label>

<label>
  Content:
  <textarea
    value={content}
    onChange={e => setContent(e.target.value)}
    required
  />
</label>

            <button type="submit">Submit</button>
          </form>
          {message && <p><em>{message}</em></p>}
        </section>
      </main>
    </>
  );
}
