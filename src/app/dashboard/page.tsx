import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: '게임 시세 대시보드 - 모바일 게임 시세 확인',
  description: '실시간 모바일 게임 서버별 게임머니 시세를 확인하세요',
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
