'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudArrowUpIcon, DocumentIcon, TrashIcon, PencilIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface File {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  shareCount: number;
}

export default function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: any[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Add new file to list
      setFiles([response.data.file, ...files]);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {isDragActive ? 'Drop files here...' : 'Drag and drop files'}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">or click to select files</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Maximum file size: 5 GB</p>

        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Files List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Files</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <DocumentIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-300">No files yet. Upload your first file above!</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <DocumentIcon className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-white truncate">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{formatFileSize(file.fileSize)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{formatDate(file.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{file.shareCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Share">
                          <ShareIcon className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Rename">
                          <PencilIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete">
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
