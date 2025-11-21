import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/libs/api';
import type { APIResponse } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  description: z.string().min(1, 'Deskripsi diperlukan').max(1000),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  reportId: string | number;
  triggerLabel?: string;
  onAdded?: () => void;
};

export default function AddProgressDialog({
  reportId,
  triggerLabel = 'Tambah Progress',
  onAdded,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<Array<File | null>>([]);
  const [previews, setPreviews] = React.useState<Array<string | null>>([]);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { description: '' },
  });

  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const res = await api.post(`/reports/${reportId}/progress`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Progress ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['report', String(reportId)] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      reset();
      setFiles([null]);
      setOpen(false);
      onAdded?.();
    },
    onError: (err: AxiosError<APIResponse<null>>) => {
      toast.error(err?.response?.data?.message ?? err?.message ?? 'Gagal menambahkan progress');
    },
  });

  const addSlot = () => {
    if (files.length >= 5) return;
    setFiles((s) => [...s, null]);
  };

  const removeSlot = (index: number) => {
    setFiles((s) => s.filter((_, i) => i !== index));
  };

  const setFileAt = (index: number, file: File | null) => {
    setFiles((s) => s.map((f, i) => (i === index ? file : f)));
  };

  const onSubmit = (values: FormValues) => {
    const form = new FormData();
    if (values.description) form.append('description', values.description);
    files.forEach((f) => {
      if (f) form.append('photos', f);
    });

    mutation.mutate(form);
  };

  React.useEffect(() => {
    const current = files.map((f) => (f ? URL.createObjectURL(f) : null));
    setPreviews(current);

    return () => {
      current.forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, [files]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Progress</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi</label>
            <Textarea {...register('description')} placeholder="Deskripsikan progres" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Foto (opsional, max 5)</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{files.filter(Boolean).length}/5</p>
                <Button type="button" size="sm" onClick={addSlot} disabled={files.length >= 5}>
                  Tambah Foto
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              {files.map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileAt(idx, e.target.files?.[0] ?? null)}
                  />
                  {previews[idx] && (
                    <img
                      src={previews[idx] ?? undefined}
                      alt={`preview-${idx}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSlot(idx)}>
                    Hapus
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
