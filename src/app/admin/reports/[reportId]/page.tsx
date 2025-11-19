
import ReportDetailClientPage from './client-page';

// This function is required for static export with dynamic routes.
// It tells Next.js which report IDs to pre-render at build time.
// Since reports are dynamic, we can't know them at build time, so we return an empty array.
// This means no report detail pages will be pre-built.
export async function generateStaticParams() {
  return [];
}

export default function ReportDetailPage({ params }: { params: { reportId: string } }) {
  return <ReportDetailClientPage params={params} />;
}
