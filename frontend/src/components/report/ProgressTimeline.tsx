import { baseURL } from '@/libs/api';
import { useEffect, useState } from 'react';

export type Progress = {
  id: string;
  description?: string;
  photos?: string[];
  createdAt: string;
};

export default function ProgressTimeline({ progresses }: { progresses: Progress[] }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxSrc]);

  if (!progresses || progresses.length === 0) {
    return <div className="mt-3 text-sm text-slate-500">Belum ada progress.</div>;
  }

  const items = [...progresses].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div>
      <ol className="relative border-l border-slate-200 mt-4">
        {items.map((p) => (
          <li key={p.id} className="mb-6 ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-white">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <time className="mb-1 text-sm font-normal text-slate-500 block">
              {new Date(p.createdAt).toLocaleString('id-ID')}
            </time>
            <p className="text-sm text-slate-700">{p.description}</p>

            {p.photos && p.photos.length > 0 && (
              <div className="mt-2 flex gap-2">
                {p.photos.map((ph) => (
                  <button
                    key={ph}
                    type="button"
                    onClick={() => setLightboxSrc(`${baseURL}/${ph}`)}
                    className="rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img
                      src={`${baseURL}/${ph}`}
                      alt={ph}
                      className="h-24 w-24 object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>

      {lightboxSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setLightboxSrc(null)} />
          <div className="relative z-10 max-h-[90vh] max-w-[90vw] p-4">
            <img
              src={lightboxSrc}
              alt="Foto progress"
              className="max-h-[85vh] max-w-[85vw] object-contain rounded bg-white"
            />
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-3 -right-3 rounded-full bg-white p-2 shadow"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
