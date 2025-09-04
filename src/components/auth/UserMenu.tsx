'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  if (!user) {
    return (
      <div className="auth-buttons">
        <Link href="/login" className="login-button">
          로그인
        </Link>
        <Link href="/signup" className="signup-button">
          회원가입
        </Link>
      </div>
    );
  }

  return (
    <div className="user-menu">
      <button 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="user-name">
          {user.displayName || user.email}
        </span>
        <span className="user-avatar">
          {user.displayName ? user.displayName[0].toUpperCase() : '👤'}
        </span>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <Link 
            href="/profile" 
            className="user-menu-item"
            onClick={() => setIsOpen(false)}
          >
            프로필
          </Link>
          <Link 
            href="/dashboard" 
            className="user-menu-item"
            onClick={() => setIsOpen(false)}
          >
            대시보드
          </Link>
          <button 
            onClick={handleLogout}
            className="user-menu-item logout-item"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
