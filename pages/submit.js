import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SubmitPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');    
  //here is our journal/Conference Name
  const [year, setYear] = useState('');
  const [doi, setDOI] = useState('');            
  //here is our DOI or URL
  const [description, setDescription] = useState(''); 
  //and then the short description

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    //in here we will construct the new article object from form fields
    const newArticle = {
      title,
      authors,
      year: year ? Number(year) : undefined,
      sePractice: '',      
      //in this simple form, not explicitly captured
      claim: description,  
      //and then we will treat the "Short Description" as the claim for simplicity
      evidence: '',        
      //also we can use description for both claim/evidence or extend form
      type: journal,       
      //then map "Journal/Conference Name" to type or separate field as needed
      participants: '',    
      //last not captured in this form
    };
    try {
      const res = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });
      const data = await res.json();
      if (res.ok) {
        //if it success then clear form and show message
        setMessage('Article submitted successfully for review.');
        setTitle(''); setAuthors(''); setJournal(''); setYear(''); setDOI(''); setDescription('');
      } else {
        //and if the server returned an error message
        setMessage(data.error || 'Submission failed. Please check the input.');
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
            <button type="submit">Submit</button>
          </form>
          {message && <p><em>{message}</em></p>}
        </section>
      </main>
    </>
  );
}
