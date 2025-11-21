import { baseURL } from '@/libs/api';
import type { Report } from '@/types/report';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function ReportCard({ report }: { report: Report }) {
  const thumb =
    report.photos && report.photos.length ? `${baseURL}/${report.photos[0]}` : undefined;

  return (
    <Link
      to={`/reports/${report.id}`}
      className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition"
      aria-label={`Buka detail laporan ${report.title}`}
    >
      <div className="aspect-4/3 border-b w-full bg-slate-100 flex items-center justify-center overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={`Foto laporan ${report.title}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-sm text-slate-400">Tidak ada foto</div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-slate-900">{report.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{report.location}</p>
          </div>

          <div className="text-xs text-slate-700 whitespace-nowrap">
            {(() => {
              const p = report.priority ?? 'low';
              const variant =
                p === 'high' ? 'destructive' : p === 'medium' ? 'warning' : 'secondary';
              return <Badge variant={variant}>{p}</Badge>;
            })()}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div>{report.status ?? 'pending'}</div>
          <div>{report.createdAt ? new Date(report.createdAt).toLocaleString() : ''}</div>
        </div>
      </div>
    </Link>
  );
}
