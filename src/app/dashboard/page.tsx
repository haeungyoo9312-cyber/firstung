import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: '대시보드 - Firebase App Hosting',
  description: '사용자 대시보드',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="dashboard-page">
        <DashboardContent />
      </main>
    </ProtectedRoute>
  );
}
