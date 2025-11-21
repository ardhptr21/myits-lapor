'use client';
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
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/libs/api';
import type { APIResponse } from '@/types/api';
import type { LoginResponse } from '@/types/auth';
import { loginValidator, type LoginValidator } from '@/validators/auth-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
  const form = useForm<LoginValidator>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginValidator),
  });

  const navigate = useNavigate();
  const { getUser } = useAuth();

  const { mutate } = useMutation<
    LoginResponse,
    unknown,
    LoginValidator,
    { toastId?: string | number }
  >({
    mutationFn: async (values: LoginValidator) => {
      const res = await api.post<LoginResponse>('/auth/login', values);
      return res.data;
    },
    onMutate() {
      const id = toast.loading('Masuk...');
      return { toastId: id };
    },
    onSuccess(data, _variables, context) {
      if (context?.toastId) toast.dismiss(context.toastId);
      const payload = data.data;
      const token =
        payload && typeof payload.token !== 'undefined' ? String(payload.token) : undefined;
      if (token) localStorage.setItem('@myitslapor/token', token);
      void getUser();
      toast.success('Berhasil masuk');
      navigate('/');
    },
    onError(err, _variables, context) {
      if (context?.toastId) toast.dismiss(context.toastId);
      let message = 'Gagal masuk. Silakan coba lagi.';
      try {
        const e = err as AxiosError<APIResponse<unknown>> | undefined;
        message = e?.response?.data?.message ?? message;
      } catch {
        /* ignore */
      }
      toast.error(message);
    },
  });

  function onSubmit(values: LoginValidator) {
    mutate(values);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/myits-lapor-logo.png" alt="MyITS Lapor" className="mx-auto h-14 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold">Masuk ke akun Anda</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masukkan email dan kata sandi Anda untuk melanjutkan.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 bg-card/50 border border-input rounded-lg p-6 shadow-sm"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
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
                    <Input type="password" placeholder="Kata sandi Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Masuk...' : 'Masuk'}
              </Button>
              <Button variant="ghost" type="button" asChild>
                <Link to="/auth/register" className="px-3 py-2">
                  Daftar
                </Link>
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Dengan masuk Anda menyetujui ketentuan platform.
        </p>
      </div>
    </div>
  );
}
