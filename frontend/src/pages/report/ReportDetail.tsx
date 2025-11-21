import Loading from '@/components/common/Loading';
import Layout from '@/components/layouts/Layout';
import AddProgressDialog from '@/components/report/AddProgressDialog';
import ProgressTimeline, { type Progress } from '@/components/report/ProgressTimeline';
import ReportDeleteDialog from '@/components/report/ReportDeleteDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { withAuth } from '@/hocs/withAuth';
import { useAuth } from '@/hooks/useAuth';
import { api, baseURL } from '@/libs/api';
import type { Report } from '@/types/report';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

type AdminActionsProps = {
  editHref: string;
  onDelete: () => void;
  isDeleting: boolean;
  status?: string;
  onToggle?: () => void;
  isToggling?: boolean;
};

function ReportDetails({ report }: { report: Report }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium">Detail Laporan</h3>
      <dl className="mt-3 text-sm text-slate-600 space-y-2">
        <div>
          <dt className="font-medium">Lokasi</dt>
          <dd>{report.location}</dd>
        </div>
        <div>
          <dt className="font-medium">Dilaporkan</dt>
          <dd>{report.reporter?.name}</dd>
        </div>
        <div>
          <dt className="font-medium">Dibuat</dt>
          <dd>{new Date(report.createdAt).toLocaleString('id-ID')}</dd>
        </div>
      </dl>
    </div>
  );
}

function AdminActions({
  editHref,
  onDelete,
  isDeleting,
  status,
  onToggle,
  isToggling,
}: AdminActionsProps) {
  const toggleLabel =
    status === 'pending'
      ? 'Start Progress'
      : status === 'in-progress'
      ? 'Mark as Done'
      : 'toggle status';

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium">Aksi</h3>
      <div className="mt-3 flex flex-col gap-2">
        <Button variant="secondary" asChild>
          <Link to={editHref}>Edit Laporan</Link>
        </Button>

        {onToggle && (status === 'pending' || status === 'in-progress') && (
          <Button onClick={onToggle} disabled={isToggling}>
            {isToggling ? 'Memproses...' : toggleLabel}
          </Button>
        )}

        <ReportDeleteDialog onDelete={onDelete} isDeleting={isDeleting} />
      </div>
    </div>
  );
}

function ReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [selected, setSelected] = useState<number>(0);

  const {
    data: report,
    isLoading,
    error,
  } = useQuery<Report | null, Error>({
    queryKey: ['report', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/reports/${id}`);
      return res.data?.data ?? null;
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/reports/${id}`);
    },
    onSuccess: () => {
      toast.success('Laporan dihapus');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      navigate('/reports');
    },
    onError: (err) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      toast.error(e?.response?.data?.message ?? e?.message ?? 'Gagal menghapus laporan');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/reports/${id}/toggle-status`);
    },
    onSuccess: () => {
      toast.success('Status diperbarui');
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (err) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      toast.error(e?.response?.data?.message ?? e?.message ?? 'Gagal mengubah status');
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate(undefined, {
      onSettled() {
        setIsDeleting(false);
      },
    });
  };

  const handleToggle = () => {
    toggleMutation.mutate();
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-red-600">Gagal memuat data laporan.</div>
        </div>
      </Layout>
    );

  if (!report) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-sm text-slate-600">Laporan tidak ditemukan.</div>
          <div className="mt-4">
            <Link to="/reports">
              <Button>Kembali ke Daftar</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const photos = report.photos ?? [];
  const selectedUrl = photos.length ? `${baseURL}/${photos[selected]}` : undefined;

  const priorityVariant =
    report.priority === 'high'
      ? 'destructive'
      : report.priority === 'medium'
      ? 'warning'
      : 'secondary';

  return (
    <Layout>
      <div className="mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{report.title}</h1>
            <p className="text-sm text-slate-500">oleh {report.reporter?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={priorityVariant}>{report.priority}</Badge>
            <Badge variant="outline">{report.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden border">
              {selectedUrl ? (
                <img
                  src={selectedUrl}
                  alt={`Foto ${selected + 1}`}
                  className="w-full h-[480px] object-contain bg-slate-100"
                />
              ) : (
                <div className="h-[480px] flex items-center justify-center text-slate-400">
                  Tidak ada foto
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {photos.length ? (
                photos.map((p, idx) => {
                  const url = `${baseURL}/${p}`;
                  const isActive = idx === selected;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelected(idx)}
                      className={`rounded-md overflow-hidden border ${
                        isActive ? 'border-primary' : 'border'
                      } bg-white`}
                    >
                      <img
                        src={url}
                        alt={`Thumb ${idx + 1}`}
                        className="h-24 w-full object-cover"
                      />
                    </button>
                  );
                })
              ) : (
                <div className="text-sm text-slate-500">Tidak ada foto untuk ditampilkan.</div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Riwayat Progress</h2>
                {user?.role === 'admin' && report.status === 'in-progress' && (
                  <AddProgressDialog reportId={report.id} />
                )}
              </div>
              <ProgressTimeline
                progresses={(report as unknown as { progresses?: Progress[] }).progresses ?? []}
              />
            </div>
          </div>

          <aside className="space-y-4">
            <ReportDetails report={report} />

            {user?.role === 'admin' && (
              <AdminActions
                editHref={`/reports/${report.id}/edit`}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                status={report.status}
                onToggle={handleToggle}
                isToggling={toggleMutation.status === 'pending'}
              />
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}

const ReportDetailPage = withAuth(ReportDetail);
export default ReportDetailPage;
