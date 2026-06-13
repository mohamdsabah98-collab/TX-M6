'use client';

import { useState } from 'react';
import axios from 'axios';
import { LinkIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import QRCode from 'qrcode.react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ShareLink {
  id: string;
  shareLink: string;
  isPublic: boolean;
  hasPassword: boolean;
  expiresAt: string | null;
  downloadCount: number;
  createdAt: string;
}

export default function ShareModal({
  fileId,
  fileName,
  onClose,
}: {
  fileId: string
  fileName: string
  onClose: () => void
}) {
  const [shares, setShares] = useState<ShareLink[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedShare, setSelectedShare] = useState<ShareLink | null>(null);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/share/${fileId}/generate`,
        {
          isPublic,
          password: password || null,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShares([response.data.share, ...shares]);
      setPassword('');
      setExpiresAt('');
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Share File</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Generate New Share */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Generate New Share Link</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">Public Link</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty for no password"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Expires At (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={generateShareLink}
                disabled={loading}
                className="w-full btn btn-primary py-2 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Share Link'}
              </button>
            </div>
          </div>

          {/* Existing Shares */}
          {shares.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Active Share Links</h3>
              <div className="space-y-3">
                {shares.map((share) => (
                  <div key={share.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                        {share.isPublic && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Public</span>}
                        {share.hasPassword && <LockClosedIcon className="w-4 h-4 text-green-600" />}
                        {share.expiresAt && <span className="text-xs text-slate-500">Expires: {new Date(share.expiresAt).toLocaleDateString()}</span>}
                      </div>
                      <button
                        onClick={() => setSelectedShare(share)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={share.shareLink}
                        readOnly
                        className="flex-1 px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(share.shareLink)}
                        className="btn btn-secondary py-2 px-4 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
