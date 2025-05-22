import React, { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [splunkQuery, setSplunkQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateQuery = async () => {
    setLoading(true);
    setError('');
    setSplunkQuery('');

    try {
      const response = await fetch('/api/generate-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSplunkQuery(data.splunk_query);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(splunkQuery)
      .then(() => {
        // Optional: Show a success message or change button text
        console.log('Splunk query copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy Splunk query: ', err);
        // Optional: Show an error message to the user
        setError('Failed to copy query to clipboard.');
      });
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>RAG Splunk Query Playground</h1>
      </header>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="naturalLanguageQuestion" className="form-label">Your Natural Language Question:</label>
            <textarea
              className="form-control"
              id="naturalLanguageQuestion"
              rows="3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Show me all failed login attempts for app_service"
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="contextEventDetails" className="form-label">Provide Context (Sample Logs / Event Details):</label>
            <textarea
              className="form-control"
              id="contextEventDetails"
              rows="10"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste sample log data or event schema details here..."
            ></textarea>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="generatedSplunkQuery" className="form-label">Generated Splunk Query:</label>
            <textarea
              className="form-control"
              id="generatedSplunkQuery"
              rows="5"
              value={splunkQuery}
              readOnly
              placeholder="Your Splunk query will appear here..."
            ></textarea>
          </div>
          {splunkQuery && (
            <button
              className="btn btn-outline-secondary btn-sm mb-3"
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </button>
          )}
        </div>
      </div>

      <div className="text-center mb-3">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleGenerateQuery}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="visually-hidden">Loading...</span> Generating...
            </>
          ) : (
            'Generate Splunk Query'
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
