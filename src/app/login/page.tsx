import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: '로그인 - Firebase App Hosting',
  description: '로그인하여 서비스를 이용하세요.',
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <LoginForm />
    </main>
  );
}
