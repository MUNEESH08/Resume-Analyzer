import React, { useState } from 'react';
import './ResumeUpload.css';

function ResumeUpload() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF resume.');
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    const res = await fetch("http://localhost:5000/api/resume/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setAnalysis(data.analysis);
    setLoading(false);
  };

  const formatAnalysis = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Bold lines like **Heading** or numbered **bold items**
      const boldMatch = line.match(/^\d+\.\s*\*\*(.*?)\*\*/);
      const headingMatch = line.match(/^\*\*(.*?)\*\*$/);

      if (boldMatch) {
        return (
          <p key={index} style={{ fontWeight: 'bold', color: '#ddd', marginBottom: '0.5rem' }}>{boldMatch[0].replace(/\*\*/g, '')}</p>
        );
      }

      if (headingMatch) {
        return (
          <p key={index} style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#ccc', marginBottom: '0.75rem' }}>{headingMatch[1]}</p>
        );
      }

      return <p key={index} style={{ color: '#aaa', marginBottom: '0.4rem' }}>{line}</p>;
    });
  };

  return (
    <div className="upload-container dark-mode">
      <h2 className="title">AI Resume Analyzer</h2>
      <p className="subtitle">Upload your PDF resume to receive personalized feedback and suggestions.</p>
      <input className="file-input" type="file" accept=".pdf" onChange={handleUpload} />
      {loading && <div className="loader">Analyzing your resume...</div>}
      {analysis && (
        <div className="analysis-result">
          <h3 style={{ color: '#eee' }}>AI Analysis:</h3>
          <div>{formatAnalysis(analysis)}</div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;