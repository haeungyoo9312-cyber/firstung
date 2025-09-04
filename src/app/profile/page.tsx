'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BasicInfoForm from '@/components/profile/BasicInfoForm';
import FavoriteGamesForm from '@/components/profile/FavoriteGamesForm';
import NotificationSettingsForm from '@/components/profile/NotificationSettingsForm';
import { UserBasicInfo, FavoriteGame, NotificationSettings, CreateProfileInput } from '@/types/profile';

type TabType = 'basic' | 'favorites' | 'notifications';

export default function ProfilePage() {
  const { user } = useAuth();
  const { 
    profile, 
    isLoading, 
    createProfile,
    updateProfile, 
    updateNotificationSettings,
    addFavoriteGame,
    removeFavoriteGame 
  } = useProfile();
  
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [isSaving, setIsSaving] = useState(false);

  const handleBasicInfoSave = async (data: Partial<UserBasicInfo>) => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      if (!profile) {
        // 프로필이 없으면 새로 생성
        const basicInfo = {
          nickname: data.nickname!,
          platform: data.platform!,
          activeTimeZone: data.activeTimeZone!
        };
        const profileInput: CreateProfileInput = { basicInfo };
        await createProfile(profileInput);
      } else {
        // 기존 프로필 업데이트
        const updatedBasicInfo = { ...profile.basicInfo, ...data } as UserBasicInfo;
        await updateProfile({ basicInfo: updatedBasicInfo });
      }
      alert('기본 정보가 저장되었습니다.');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFavoriteGamesSave = async (favorites: FavoriteGame[]) => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      if (!profile) {
        alert('기본 정보를 먼저 설정해주세요.');
        setActiveTab('basic');
        return;
      }
      
      await updateProfile({ favoriteGames: favorites });
      alert('관심 게임 설정이 저장되었습니다.');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSave = async (settings: NotificationSettings) => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      if (!profile) {
        alert('기본 정보를 먼저 설정해주세요.');
        setActiveTab('basic');
        return;
      }
      
      await updateNotificationSettings(settings);
      alert('알림 설정이 저장되었습니다.');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    {
      id: 'basic' as const,
      label: '기본 정보',
      icon: '👤',
      description: '닉네임, 플랫폼, 활동시간 설정'
    },
    {
      id: 'favorites' as const,
      label: '관심 게임',
      icon: '🎮',
      description: '자주 확인하는 게임과 서버 설정'
    },
    {
      id: 'notifications' as const,
      label: '알림 설정',
      icon: '🔔',
      description: '시세 변동 및 업데이트 알림 설정'
    }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="profile-page">
          <div className="profile-loading">
            <div className="loading-spinner large">⏳</div>
            <p>프로필 정보를 불러오는 중...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="profile-title">프로필 설정</h1>
            <p className="profile-subtitle">
              개인화된 게임 시세 서비스를 위한 설정을 관리하세요
            </p>
          </div>

          {/* 프로필 요약 */}
          {profile && (
            <div className="profile-summary">
              <div className="summary-card">
                <div className="summary-info">
                  <h3 className="summary-nickname">{profile.basicInfo.nickname}</h3>
                  <div className="summary-details">
                    <span className="summary-platform">
                      {profile.basicInfo.platform === 'PC' ? '💻' : 
                       profile.basicInfo.platform === '모바일' ? '📱' : '🎮'} 
                      {profile.basicInfo.platform}
                    </span>
                    <span className="summary-games">
                      🎮 {profile.favoriteGames.length}개 관심 게임
                    </span>
                    <span className="summary-join-date">
                      📅 {new Date(profile.basicInfo.joinDate).toLocaleDateString('ko-KR')} 가입
                    </span>
                  </div>
                </div>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-value">{profile.activity.totalLogins}</span>
                    <span className="stat-label">총 접속</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{profile.activity.lastViewedGames.length}</span>
                    <span className="stat-label">최근 조회</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 탭 네비게이션 */}
          <div className="profile-tabs">
            <div className="tab-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <div className="tab-content">
                    <span className="tab-label">{tab.label}</span>
                    <span className="tab-description">{tab.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="profile-content">
            {activeTab === 'basic' && (
              <BasicInfoForm
                initialData={profile?.basicInfo}
                onSave={handleBasicInfoSave}
                isLoading={isSaving}
                userId={user?.uid}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoriteGamesForm
                initialFavorites={profile?.favoriteGames || []}
                onSave={handleFavoriteGamesSave}
                isLoading={isSaving}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettingsForm
                initialSettings={profile?.notificationSettings}
                onSave={handleNotificationSave}
                isLoading={isSaving}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
