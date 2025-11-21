import Layout from '@/components/layouts/Layout';
import { withAuth } from '@/hocs/withAuth';

const Report = withAuth(() => {
  return <Layout>Report</Layout>;
});

export default Report;
