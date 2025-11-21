'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/libs/api';
import type { APIResponse } from '@/types/api';
import type { RegisterResponse } from '@/types/auth';
import { registerValidator, type RegisterValidator } from '@/validators/auth-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Register() {
  const form = useForm<RegisterValidator>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(registerValidator),
  });

  const navigate = useNavigate();

  const { mutate } = useMutation<
    RegisterResponse,
    unknown,
    RegisterValidator,
    { toastId?: string | number }
  >({
    mutationFn: async (values: RegisterValidator) => {
      const res = await api.post<RegisterResponse>('/auth/register', values);
      return res.data;
    },
    onMutate() {
      const id = toast.loading('Membuat akun...');
      return { toastId: id };
    },
    onSuccess(_data, _variables, context) {
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.success('Akun berhasil dibuat. Silakan masuk.');
      navigate('/auth/login');
    },
    onError(err, _variables, context) {
      if (context?.toastId) toast.dismiss(context.toastId);
      let message = 'Pendaftaran gagal. Silakan coba lagi.';
      try {
        const e = err as AxiosError<APIResponse<unknown>> | undefined;
        message = e?.response?.data?.message ?? message;
      } catch {
        /* ignore */
      }
      toast.error(message);
    },
  });

  function onSubmit(values: RegisterValidator) {
    mutate(values);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/myits-lapor-logo.png" alt="MyITS Lapor" className="mx-auto h-14 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold">Buat akun</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Isi formulir untuk membuat akun baru.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 bg-card/50 border border-input rounded-lg p-6 shadow-sm"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata sandi</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Pilih kata sandi" {...field} />
                  </FormControl>
                  <FormDescription>
                    Pilih kata sandi yang aman (minimal 6 karakter).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Membuat...' : 'Buat akun'}
              </Button>
              <Button variant="ghost" type="button" asChild>
                <Link to="/auth/login" className="px-3 py-2">
                  Masuk
                </Link>
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Dengan membuat akun Anda menyetujui ketentuan platform.
        </p>
      </div>
    </div>
  );
}
