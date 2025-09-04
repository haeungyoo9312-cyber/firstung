'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  UserProfile, 
  CreateProfileData,
  CreateProfileInput, 
  UserProfileUpdate, 
  FavoriteGame,
  NotificationSettings 
} from '@/types/profile';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserProfile, 
  addFavoriteGame as addFavoriteGameApi,
  removeFavoriteGame as removeFavoriteGameApi,
  updateFavoriteGameServers,
  updateNotificationSettings as updateNotificationSettingsApi,
  updateUserActivity,
  checkProfileExists,
  isProfileSetupComplete
} from '@/lib/profile';

interface ProfileContextType {
  // 프로필 상태
  profile: UserProfile | null;
  isLoading: boolean;
  isSetupComplete: boolean;
  
  // 프로필 관리 함수
  createProfile: (data: CreateProfileInput) => Promise<void>;
  updateProfile: (updates: UserProfileUpdate) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // 관심 게임 관리
  addFavoriteGame: (gameData: Omit<FavoriteGame, 'addedDate'>) => Promise<void>;
  removeFavoriteGame: (gameId: string) => Promise<void>;
  updateGameServers: (gameId: string, serverIds: string[]) => Promise<void>;
  
  // 알림 설정 관리
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  
  // 활동 기록
  recordActivity: (type: 'login' | 'gameView' | 'search', data?: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // 프로필 조회
  const loadProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
      
      if (userProfile) {
        const setupComplete = await isProfileSetupComplete(userId);
        setIsSetupComplete(setupComplete);
      } else {
        setIsSetupComplete(false);
      }
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      setProfile(null);
      setIsSetupComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 새로고침
  const refreshProfile = async () => {
    if (user?.uid) {
      await loadProfile(user.uid);
    }
  };

  // 프로필 생성
  const createProfile = async (data: CreateProfileInput) => {
    if (!user?.uid) {
      throw new Error('로그인이 필요합니다.');
    }
    
    try {
      setIsLoading(true);
      const profileData: CreateProfileData = { 
        ...data, 
        userId: user.uid 
      };
      const newProfile = await createUserProfile(profileData);
      setProfile(newProfile);
      setIsSetupComplete(true);
    } catch (error) {
      console.error('프로필 생성 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 업데이트
  const updateProfile = async (updates: UserProfileUpdate) => {
    if (!user?.uid || !profile) {
      throw new Error('사용자 정보가 없습니다.');
    }

    try {
      setIsLoading(true);
      await updateUserProfile(user.uid, updates);
      
      // 로컬 상태 업데이트
      setProfile(prev => prev ? {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString()
      } : null);

      // 설정 완료 상태 체크
      const setupComplete = await isProfileSetupComplete(user.uid);
      setIsSetupComplete(setupComplete);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 관심 게임 추가
  const addFavoriteGame = async (gameData: Omit<FavoriteGame, 'addedDate'>) => {
    if (!user?.uid) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      await addFavoriteGameApi(user.uid, gameData);
      await refreshProfile(); // 프로필 새로고침
    } catch (error) {
      console.error('관심 게임 추가 실패:', error);
      throw error;
    }
  };

  // 관심 게임 제거
  const removeFavoriteGame = async (gameId: string) => {
    if (!user?.uid) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      await removeFavoriteGameApi(user.uid, gameId);
      await refreshProfile(); // 프로필 새로고침
    } catch (error) {
      console.error('관심 게임 제거 실패:', error);
      throw error;
    }
  };

  // 게임 서버 업데이트
  const updateGameServers = async (gameId: string, serverIds: string[]) => {
    if (!user?.uid) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      await updateFavoriteGameServers(user.uid, gameId, serverIds);
      await refreshProfile(); // 프로필 새로고침
    } catch (error) {
      console.error('관심 서버 업데이트 실패:', error);
      throw error;
    }
  };

  // 알림 설정 업데이트
  const updateNotificationSettings = async (settings: NotificationSettings) => {
    if (!user?.uid) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      await updateNotificationSettingsApi(user.uid, settings);
      
      // 로컬 상태 업데이트
      setProfile(prev => prev ? {
        ...prev,
        notificationSettings: settings,
        updatedAt: new Date().toISOString()
      } : null);
    } catch (error) {
      console.error('알림 설정 업데이트 실패:', error);
      throw error;
    }
  };

  // 활동 기록
  const recordActivity = async (
    type: 'login' | 'gameView' | 'search', 
    data?: string
  ) => {
    if (!user?.uid) return;

    try {
      await updateUserActivity(user.uid, type, data);
      
      // 로그인 활동인 경우 프로필 새로고침
      if (type === 'login') {
        await refreshProfile();
      }
    } catch (error) {
      console.error('활동 기록 실패:', error);
      // 활동 기록 실패는 중요하지 않으므로 에러를 던지지 않음
    }
  };

  // 사용자 변경 시 프로필 로드
  useEffect(() => {
    if (user?.uid) {
      loadProfile(user.uid);
    } else {
      setProfile(null);
      setIsSetupComplete(false);
    }
  }, [user?.uid]);

  // 로그인 시 활동 기록
  useEffect(() => {
    if (user?.uid && profile) {
      recordActivity('login');
    }
  }, [user?.uid, profile?.userId, recordActivity]);

  const value: ProfileContextType = {
    // 상태
    profile,
    isLoading,
    isSetupComplete,
    
    // 함수
    createProfile,
    updateProfile,
    refreshProfile,
    addFavoriteGame,
    removeFavoriteGame,
    updateGameServers,
    updateNotificationSettings,
    recordActivity,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// 프로필 컨텍스트 훅
export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

// 프로필 존재 여부 확인 훅
export function useProfileStatus() {
  const { user } = useAuth();
  const { profile, isSetupComplete, isLoading } = useProfile();
  
  return {
    hasProfile: !!profile,
    isSetupComplete,
    isLoading,
    needsSetup: user && (!profile || !isSetupComplete),
  };
}
