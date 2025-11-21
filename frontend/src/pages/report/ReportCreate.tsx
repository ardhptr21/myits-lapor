import Layout from '@/components/layouts/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { withAuth } from '@/hocs/withAuth';
import reportCreateValidator, { type ReportCreateValidator } from '@/validators/report-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ZodError } from 'zod';
import { z } from 'zod';
// textarea not required for this form
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/libs/api';
import type { ReportCreateResponse } from '@/types/report';
import { useMutation } from '@tanstack/react-query';
import { Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type FormValues = Omit<ReportCreateValidator, 'photos'>;

const MAX_PHOTOS = 5;

const ReportCreateInner = () => {
  const fieldsSchema = reportCreateValidator.omit({ photos: true });

  const form = useForm<FormValues>({
    resolver: zodResolver(fieldsSchema),
    defaultValues: { title: '', location: '', priority: 'low' },
  });
  const { handleSubmit, formState, control, setError } = form;
  const navigate = useNavigate();

  const [photos, setPhotos] = useState<Array<{ file?: File; preview?: string }>>([{}]);
  const fileInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.preview) URL.revokeObjectURL(p.preview);
      });
    };
  }, [photos]);

  const mutation = useMutation<ReportCreateResponse, unknown, FormValues & { photos: File[] }>({
    mutationFn: async (data: FormValues & { photos: File[] }) => {
      const fd = new FormData();
      fd.append('title', data.title);
      fd.append('location', data.location);
      fd.append('priority', data.priority);
      data.photos.forEach((f) => fd.append('photos', f));

      const res = await api.post<ReportCreateResponse>('/reports', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onMutate() {
      const id = toast.loading('Membuat laporan...');
      return { toastId: id };
    },
    onSuccess() {
      toast.success('Laporan berhasil dibuat');
      navigate('/reports');
    },
    onError(err) {
      let message = 'Gagal membuat laporan. Silakan coba lagi.';
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = err as any;
        message = e?.response?.data?.message ?? message;
      } catch (e) {
        void e;
      }
      toast.error(message);
    },
  });

  function handleAddPhoto() {
    if (photos.length >= MAX_PHOTOS) return;
    setPhotos((s) => [...s, {}]);
  }

  function handleRemovePhoto(index: number) {
    setPhotos((s) => {
      const next = [...s];
      const removed = next.splice(index, 1)[0];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return next;
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotos((s) => {
      const next = [...s];
      if (next[index]?.preview) URL.revokeObjectURL(next[index]!.preview);
      next[index] = { file, preview: URL.createObjectURL(file) };
      return next;
    });
  }

  function onSubmit(values: FormValues) {
    const selectedFiles = photos.map((p) => p.file).filter(Boolean) as File[];
    const parsed = reportCreateValidator.safeParse({ ...values, photos: selectedFiles });
    if (!parsed.success) {
      const tree = z.treeifyError(parsed.error as ZodError<unknown>) as Record<
        string,
        { _errors?: string[] }
      >;
      for (const key of Object.keys(tree)) {
        const msg = tree[key]?._errors?.[0];
        if (!msg) continue;
        if (key === 'photos') {
          toast.error(msg);
        } else {
          setError(key as keyof FormValues, { type: 'manual', message: msg });
        }
      }
      return;
    }

    mutation.mutate({ ...values, photos: selectedFiles });
  }

  return (
    <Layout>
      <section className="mx-auto px-4 sm:px-6 md:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Buat Laporan</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul laporan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-40"
                      placeholder="Deskripsikan lokasi / alamat lengkap"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioritas</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Foto (maks {MAX_PHOTOS})</label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="border rounded p-2 flex flex-col items-center w-full">
                    {p.preview ? (
                      <img
                        src={p.preview}
                        alt={`foto-${idx}`}
                        className="h-40 sm:h-36 md:h-28 w-full object-cover mb-2 rounded"
                      />
                    ) : (
                      <div className="h-40 sm:h-36 md:h-28 w-full bg-muted mb-2 rounded flex items-center justify-center text-sm text-muted-foreground">
                        Preview
                      </div>
                    )}

                    <input
                      ref={(el) => {
                        fileInputsRef.current[idx] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, idx)}
                    />

                    <div className="w-full flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputsRef.current[idx]?.click()}
                        className="flex-1"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Pilih
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => handleRemovePhoto(idx)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <div className="flex items-center justify-center border rounded">
                    <Button type="button" variant="ghost" onClick={handleAddPhoto}>
                      <Plus className="mr-2 h-4 w-4" /> Tambah Foto
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Membuat...' : 'Buat Laporan'}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </Layout>
  );
};

const ReportCreate = withAuth(ReportCreateInner);

export default ReportCreate;
