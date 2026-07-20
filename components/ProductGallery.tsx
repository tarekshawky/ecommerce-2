"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const cover = images[active];

  return (
    <div>
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-300 text-sm">
            No image
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <button
              key={url + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                i === active ? "border-accent" : "border-transparent hover:border-gray-200"
              }`}
            >
              <Image src={url} alt={`${name} ${i + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
