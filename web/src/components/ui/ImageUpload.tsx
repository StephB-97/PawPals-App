'use client';

import { useRef, useState } from 'react';

type Props = {
  onUploaded: (url: string) => void;
};

export default function ImageUpload({ onUploaded }: Props) {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset || cloud === 'REPLACE_ME') {
      setError('Image upload is not configured. Check Cloudinary environment variables.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
      if (!res.ok || !data.secure_url) {
        const msg =
          data.error?.message ||
          'Upload failed. Please check your connection and try again.';
        throw new Error(msg);
      }

      setImage(data.secure_url);
      onUploaded(data.secure_url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong with the upload. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const remove = () => {
    setImage('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-md">
      {error ? (
        <p className="mb-2 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {!image ? (
        <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={handleChange}
          />
          {loading ? 'Uploading…' : 'Upload Photo 📷'}
        </label>
      ) : (
        <div className="relative">
          <button type="button" onClick={remove} className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-sm">
            Remove
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Uploaded" className="h-56 w-full rounded-xl object-cover" />
        </div>
      )}
    </div>
  );
}
