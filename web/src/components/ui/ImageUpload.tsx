"use client";

import { useRef, useState } from "react";

type Props = {
  onUpload: (url: string) => void;
};

export default function ImageUpload({ onUpload }: Props) {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    setImage(data.secure_url);
if (onUpload) {
  onUpload(data.secure_url);
}
    setLoading(false);
  };

  const remove = () => {
    setImage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-md">
      {!image ? (
        <label className="flex h-56 cursor-pointer flex-col items-center justify-center border-2 border-dashed rounded-xl">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />
          {loading ? "Uploading..." : "Upload Photo 📷"}
        </label>
      ) : (
        <div className="relative">
          <button onClick={remove} className="absolute right-2 top-2">
            X
          </button>
          <img src={image} className="h-56 w-full object-cover rounded-xl" />
        </div>
      )}
    </div>
  );
}