import { useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Submit() {
  const [form, setForm] = useState({
    title: '',
    authors: '',
    year: '',
    sePractice: '',
    claim: '',
    evidence: '',
    type: '',
    participants: '',
    abstract: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/articles`, form);
      setMessage('Submission Successful!');
      setForm({
        title: '',
        authors: '',
        year: '',
        sePractice: '',
        claim: '',
        evidence: '',
        type: '',
        participants: '',
        abstract: '',
      });
    } catch (err) {
      setMessage('Submission Failed');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1>Submit Article</h1>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Title', name: 'title' },
          { label: 'Authors', name: 'authors' },
          { label: 'Year', name: 'year', type: 'number' },
          { label: 'SE Practice', name: 'sePractice' },
          { label: 'Claim', name: 'claim' },
          { label: 'Evidence', name: 'evidence' },
          { label: 'Type', name: 'type' },
          { label: 'Participants', name: 'participants' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name} style={{ marginBottom: '15px' }}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>
        ))}

        <div style={{ marginBottom: '15px' }}>
          <label>Abstract:</label>
          <textarea
            name="abstract"
            value={form.abstract}
            onChange={handleChange}
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
