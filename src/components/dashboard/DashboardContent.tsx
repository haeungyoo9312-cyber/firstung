'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">대시보드</h1>
        <p className="dashboard-welcome">
          안녕하세요, {user?.displayName || user?.email}님!
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>사용자 정보</h2>
          <div className="user-info">
            <p><strong>이메일:</strong> {user?.email}</p>
            <p><strong>이름:</strong> {user?.displayName || '설정되지 않음'}</p>
            <p><strong>UID:</strong> {user?.uid}</p>
          </div>
          <Link href="/profile" className="card-button">
            프로필 수정
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Quick Links</h2>
          <div className="quick-links">
            <Link href="/ssg" className="quick-link">
              SSG 데모 보기
            </Link>
            <Link href="/ssr" className="quick-link">
              SSR 데모 보기
            </Link>
            <Link href="/isr" className="quick-link">
              ISR 데모 보기
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>앱 통계</h2>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">1</span>
              <span className="stat-label">활성 사용자</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">데모 페이지</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Firebase 연동</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>최근 활동</h2>
          <div className="activity">
            <p>🎉 Firebase Authentication 설정 완료</p>
            <p>🔐 로그인 기능 구현 완료</p>
            <p>📱 대시보드 접속</p>
          </div>
        </div>
      </div>
    </div>
  );
}
