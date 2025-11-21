import Layout from '@/components/layouts/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { withAuth } from '../hocs/withAuth';

const Home = withAuth(() => {
  const { user } = useAuth();
  return (
    <Layout>
      <section>
        <h1 className="text-4xl font-bold">Hi, {user?.name}</h1>
      </section>
      <section className="mt-10">
        <div className="px-10 py-16 bg-linear-to-r from-blue-600 to-blue-800 text-white rounded-md">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Menemukan fasilitas kampus yang rusak?</h2>
            <p className="text-accent">
              Segera laporkan melalui platform MyITS Lapor dan bantu kami meningkatkan kualitas
              fasilitas di kampus kita!
            </p>
          </div>
          <div className="mt-10">
            <Button size="xl" variant="secondary">
              Lapor Kerusakan!
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
});

export default Home;
