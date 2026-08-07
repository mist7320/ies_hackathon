import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const result = await apiService.getDocuments();
        setDocuments(result.documents || []);
      } catch (err) {
        setError(err.message || 'Failed to load documents.');
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Documents</h1>

      {loading && <p className="text-slate-400">Loading documents...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4">
          {documents.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
              No documents found yet.
            </div>
          ) : (
            documents.map((document) => (
              <div key={document.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{document.title || 'Untitled Document'}</h2>
                    <p className="text-sm text-slate-400">
                      {document.document_type} • {document.status} • {document.language}
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                    {document.page_count ?? 'N/A'} pages
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Documents;
