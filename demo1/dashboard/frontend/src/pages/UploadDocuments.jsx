import React, { useState } from 'react';
import { apiService } from '../services/api';

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please choose a PDF or DOCX file first.');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const result = await apiService.uploadDocument(file);
      setMessage(`Uploaded successfully: ${result.filename}`);
      setFile(null);
      event.target.reset();
    } catch (error) {
      setMessage(error.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Upload Documents</h1>
      <p className="text-slate-400">Send legal PDFs or DOCX files into Supabase through the database service.</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-500"
        />

        <button
          type="submit"
          disabled={isUploading}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? 'Uploading...' : 'Upload to Database'}
        </button>
      </form>

      {message && <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-200">{message}</div>}
    </div>
  );
};

export default UploadDocuments;
