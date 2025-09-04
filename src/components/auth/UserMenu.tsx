'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { profile, isSetupComplete } = useProfile();
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

  const displayName = profile?.basicInfo?.nickname || 
                     user.displayName || 
                     user.email?.split('@')[0];

  return (
    <div className="user-menu">
      <button 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="user-name">
          {displayName}
          {!isSetupComplete && <span className="setup-indicator">!</span>}
        </span>
        <span className="user-avatar">
          {displayName ? displayName[0].toUpperCase() : '👤'}
        </span>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          {!isSetupComplete && (
            <div className="setup-notice">
              프로필 설정을 완료해주세요
            </div>
          )}
          
          <Link 
            href="/profile" 
            className={`user-menu-item ${!isSetupComplete ? 'highlighted' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            ⚙️ 프로필 설정
            {!isSetupComplete && <span className="menu-badge">설정 필요</span>}
          </Link>
          
          <Link 
            href="/dashboard" 
            className="user-menu-item"
            onClick={() => setIsOpen(false)}
          >
            📊 대시보드
          </Link>

          {profile?.favoriteGames && profile.favoriteGames.length > 0 && (
            <>
              <div className="menu-divider"></div>
              <div className="menu-section-title">관심 게임</div>
              {profile.favoriteGames.map(game => (
                <Link
                  key={game.gameId}
                  href={`/dashboard?game=${game.gameId}`}
                  className="user-menu-item favorite-game"
                  onClick={() => setIsOpen(false)}
                >
                  {game.gameIcon} {game.gameName}
                </Link>
              ))}
            </>
          )}
          
          <div className="menu-divider"></div>
          
          <button 
            onClick={handleLogout}
            className="user-menu-item logout-item"
          >
            🚪 로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
