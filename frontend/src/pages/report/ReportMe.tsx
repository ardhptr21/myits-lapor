import Layout from '@/components/layouts/Layout';
import { withAuth } from '@/hocs/withAuth';

const ReportMe = withAuth(() => {
  return <Layout>ReportMe</Layout>;
});

export default ReportMe;
