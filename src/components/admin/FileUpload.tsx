'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, FileText, ImageIcon, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function FileUpload({ value, onChange, accept = 'image/*', label = 'Fichier' }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const isImage = accept.includes('image');
  const isPDF = accept.includes('pdf');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload échoué');
      const data = await res.json();
      onChange(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-700">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative group">
          {isImage ? (
            <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <Image 
                src={value} 
                alt="preview" 
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <button
                onClick={() => onChange('')}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-ige-green/30 bg-ige-greenSoft">
              <FileText className="w-5 h-5 text-ige-greenDark" />
              <a href={value} target="_blank" rel="noreferrer" className="text-xs text-ige-greenDark font-semibold hover:underline truncate flex-1">
                Fichier chargé — Cliquer pour voir
              </a>
              <button onClick={() => onChange('')} className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-ige-violet hover:bg-ige-violetSoft/30 transition-all"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-ige-violet animate-spin" />
              <p className="text-xs text-slate-500">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isImage ? <ImageIcon className="w-8 h-8 text-slate-400" /> : <FileText className="w-8 h-8 text-slate-400" />}
              <p className="text-xs font-semibold text-slate-600">Cliquer ou glisser-déposer</p>
              <p className="text-xs text-slate-400">{isImage ? 'PNG, JPG, WebP, SVG — max 10 Mo' : 'PDF — max 10 Mo'}</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Or URL */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">ou URL directe</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <input
        type="text"
        placeholder="https://..."
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-ige-violet"
      />
    </div>
  );
}
