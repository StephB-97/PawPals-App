"use client";

import { useState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function TestUploadPage() {
  const [url, setUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-semibold">Image upload test</h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Sprint 1: Cloudinary via <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">ImageUpload</code>.
          Open the browser console to see the URL when upload completes.
        </p>

        <ImageUpload
          onUploaded={(secureUrl) => {
            console.log("Cloudinary secure_url:", secureUrl);
            setUrl(secureUrl);
          }}
        />

        {url ? (
          <div className="mt-8 break-all text-sm">
            <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">Last uploaded URL</p>
            <code className="block rounded bg-zinc-200 p-3 text-xs dark:bg-zinc-900">{url}</code>
          </div>
        ) : null}
      </div>
    </div>
  );
}
