import ReportCard from '@/components/cards/ReportCard';
import Layout from '@/components/layouts/Layout';
import { Button } from '@/components/ui/button';
import { withAuth } from '@/hocs/withAuth';
import { api } from '@/libs/api';
import type { Report as ReportType } from '@/types/report';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const Report = withAuth(() => {
  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery<ReportType[], Error>({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await api.get('/reports/me');
      return (res.data?.data ?? []) as ReportType[];
    },
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Laporan Saya</h1>
            <p className="text-sm text-slate-500">Daftar laporan yang Anda telah kirimkan.</p>
          </div>

          <div>
            <Link to="/reports/create">
              <Button>Buat Laporan</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">Gagal memuat laporan.</div>
        ) : reports.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
            <p className="text-slate-600">Belum ada laporan.</p>
            <div className="mt-4">
              <Link to="/reports/create">
                <Button>Buat Laporan Pertama</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}, 'user');

export default Report;
