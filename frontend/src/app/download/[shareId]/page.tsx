'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudArrowDownIcon, DocumentIcon } from '@heroicons/react/24/outline';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface DownloadPageProps {
  params: {
    shareId: string
  }
}

interface FileInfo {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  uploader: string
}

export default function DownloadPage({ params }: DownloadPageProps) {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShareInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/download/${params.shareId}`);
        setFile(response.data.file);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setRequiresPassword(true);
        } else {
          setError(err.response?.data?.message || 'Failed to load file');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShareInfo();
  }, [params.shareId]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/download/${params.shareId}/file`,
        { params: { password } }
      );
      window.location.href = response.data.downloadUrl;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Download failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading file...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {file && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{file.fileName}</h1>
              <p className="text-slate-600 dark:text-slate-300">{Math.round(file.fileSize / 1024 / 1024)} MB</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Uploaded by:</span>
                <span className="font-medium text-slate-900 dark:text-white">{file.uploader}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Upload date:</span>
                <span className="font-medium text-slate-900 dark:text-white">{new Date(file.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {requiresPassword && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Enter Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password required"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              onClick={handleDownload}
              className="w-full btn btn-primary py-3 flex items-center justify-center gap-2 font-medium"
            >
              <CloudArrowDownIcon className="w-5 h-5" />
              Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
