import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileContent from '@/components/profile/ProfileContent';

export const metadata: Metadata = {
  title: '프로필 - Firebase App Hosting',
  description: '사용자 프로필 관리',
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main className="profile-page">
        <ProfileContent />
      </main>
    </ProtectedRoute>
  );
}
