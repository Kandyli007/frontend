import { useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Submit() {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/articles`, { title, authors, abstract });
      setMessage('Submission Successful!');
      setTitle('');
      setAuthors('');
      setAbstract('');
    } catch (err) {
      setMessage('Submission Failed');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Submit Article</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Authors:</label>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Abstract:</label>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            style={{ width: '100%', padding: '8px', height: '150px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '20px',
            color: message === 'Submission Successful!' ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
