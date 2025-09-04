import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  UserProfile, 
  CreateProfileData, 
  UserProfileUpdate, 
  FavoriteGame, 
  FavoriteGameAction,
  NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_USER_ACTIVITY,
  PROFILE_VALIDATION
} from '@/types/profile';

// 프로필 컬렉션 참조
const PROFILES_COLLECTION = 'userProfiles';

/**
 * 새로운 사용자 프로필 생성
 */
export async function createUserProfile(data: CreateProfileData): Promise<UserProfile> {
  try {
    if (!data.userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }
    
    const now = new Date().toISOString();
    
    const newProfile: UserProfile = {
      userId: data.userId,
      basicInfo: {
        ...data.basicInfo,
        profileImage: '',
        joinDate: now,
        lastLoginDate: now,
      },
      favoriteGames: [],
      notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
      activity: DEFAULT_USER_ACTIVITY,
      createdAt: now,
      updatedAt: now,
    };

    const profileRef = doc(db, PROFILES_COLLECTION, data.userId);
    
    // Firestore에 저장할 때는 Timestamp 사용
    const firestoreData = {
      ...newProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(profileRef, firestoreData);
    
    console.log('✅ 프로필 생성 완료:', data.userId);
    return newProfile;
  } catch (error) {
    console.error('❌ 프로필 생성 실패:', error);
    throw new Error('프로필 생성에 실패했습니다.');
  }
}

/**
 * 사용자 프로필 조회
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const profileRef = doc(db, PROFILES_COLLECTION, userId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      console.log('프로필이 존재하지 않습니다:', userId);
      return null;
    }

    const data = profileSnap.data();
    
    // Firestore Timestamp를 ISO 문자열로 변환
    const profile: UserProfile = {
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as UserProfile;

    return profile;
  } catch (error) {
    console.error('❌ 프로필 조회 실패:', error);
    throw new Error('프로필 조회에 실패했습니다.');
  }
}

/**
 * 프로필 존재 여부 확인
 */
export async function checkProfileExists(userId: string): Promise<boolean> {
  try {
    const profileRef = doc(db, PROFILES_COLLECTION, userId);
    const profileSnap = await getDoc(profileRef);
    return profileSnap.exists();
  } catch (error) {
    console.error('❌ 프로필 존재 확인 실패:', error);
    return false;
  }
}

/**
 * 사용자 프로필 업데이트 (부분 업데이트)
 */
export async function updateUserProfile(
  userId: string, 
  updates: UserProfileUpdate
): Promise<void> {
  try {
    const profileRef = doc(db, PROFILES_COLLECTION, userId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(profileRef, updateData);
    console.log('✅ 프로필 업데이트 완료:', userId);
  } catch (error) {
    console.error('❌ 프로필 업데이트 실패:', error);
    throw new Error('프로필 업데이트에 실패했습니다.');
  }
}

/**
 * 관심 게임 추가
 */
export async function addFavoriteGame(
  userId: string, 
  gameData: Omit<FavoriteGame, 'addedDate'>
): Promise<void> {
  try {
    // 현재 프로필 확인
    const profile = await getUserProfile(userId);
    if (!profile) {
      throw new Error('사용자 프로필을 찾을 수 없습니다.');
    }

    // 최대 개수 확인
    if (profile.favoriteGames.length >= PROFILE_VALIDATION.favoriteGames.maxCount) {
      throw new Error(`관심 게임은 최대 ${PROFILE_VALIDATION.favoriteGames.maxCount}개까지 추가할 수 있습니다.`);
    }

    // 중복 확인
    const isDuplicate = profile.favoriteGames.some(game => game.gameId === gameData.gameId);
    if (isDuplicate) {
      throw new Error('이미 관심 게임으로 등록되어 있습니다.');
    }

    const newFavoriteGame: FavoriteGame = {
      ...gameData,
      addedDate: new Date().toISOString(),
    };

    const profileRef = doc(db, PROFILES_COLLECTION, userId);
    
    await updateDoc(profileRef, {
      favoriteGames: arrayUnion(newFavoriteGame),
      'activity.favoriteGamesCount': increment(1),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ 관심 게임 추가 완료:', gameData.gameId);
  } catch (error) {
    console.error('❌ 관심 게임 추가 실패:', error);
    throw error;
  }
}

/**
 * 관심 게임 제거
 */
export async function removeFavoriteGame(userId: string, gameId: string): Promise<void> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      throw new Error('사용자 프로필을 찾을 수 없습니다.');
    }

    const gameToRemove = profile.favoriteGames.find(game => game.gameId === gameId);
    if (!gameToRemove) {
      throw new Error('관심 게임 목록에서 찾을 수 없습니다.');
    }

    const profileRef = doc(db, PROFILES_COLLECTION, userId);
    
    await updateDoc(profileRef, {
      favoriteGames: arrayRemove(gameToRemove),
      'activity.favoriteGamesCount': increment(-1),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ 관심 게임 제거 완료:', gameId);
  } catch (error) {
    console.error('❌ 관심 게임 제거 실패:', error);
    throw error;
  }
}

/**
 * 관심 게임의 서버 목록 업데이트
 */
export async function updateFavoriteGameServers(
  userId: string, 
  gameId: string, 
  serverIds: string[]
): Promise<void> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      throw new Error('사용자 프로필을 찾을 수 없습니다.');
    }

    // 서버 개수 제한 확인
    if (serverIds.length > PROFILE_VALIDATION.favoriteServers.maxCountPerGame) {
      throw new Error(`게임당 관심 서버는 최대 ${PROFILE_VALIDATION.favoriteServers.maxCountPerGame}개까지 설정할 수 있습니다.`);
    }

    const updatedFavoriteGames = profile.favoriteGames.map(game => {
      if (game.gameId === gameId) {
        return { ...game, favoriteServers: serverIds };
      }
      return game;
    });

    await updateUserProfile(userId, { favoriteGames: updatedFavoriteGames });
    console.log('✅ 관심 서버 업데이트 완료:', gameId);
  } catch (error) {
    console.error('❌ 관심 서버 업데이트 실패:', error);
    throw error;
  }
}

/**
 * 알림 설정 업데이트
 */
export async function updateNotificationSettings(
  userId: string,
  settings: NotificationSettings
): Promise<void> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      throw new Error('사용자 프로필을 찾을 수 없습니다.');
    }

    await updateUserProfile(userId, { notificationSettings: settings });
    console.log('✅ 알림 설정 업데이트 완료:', userId);
  } catch (error) {
    console.error('❌ 알림 설정 업데이트 실패:', error);
    throw error;
  }
}

/**
 * 사용자 활동 기록 업데이트
 */
export async function updateUserActivity(
  userId: string,
  activityType: 'login' | 'gameView' | 'search',
  data?: string
): Promise<void> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) return;

    const updates: any = {};

    switch (activityType) {
      case 'login':
        updates['basicInfo.lastLoginDate'] = new Date().toISOString();
        updates['activity.totalLogins'] = increment(1);
        break;
        
      case 'gameView':
        if (data) {
          // 최근 조회 게임 업데이트 (중복 제거 후 최대 10개)
          const lastViewedGames = [data, ...profile.activity.lastViewedGames.filter(id => id !== data)].slice(0, 10);
          updates['activity.lastViewedGames'] = lastViewedGames;
        }
        break;
        
      case 'search':
        if (data) {
          // 검색 기록 업데이트 (중복 제거 후 최대 20개)
          const searchHistory = [data, ...profile.activity.searchHistory.filter(term => term !== data)].slice(0, 20);
          updates['activity.searchHistory'] = searchHistory;
        }
        break;
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      const profileRef = doc(db, PROFILES_COLLECTION, userId);
      await updateDoc(profileRef, updates);
    }
  } catch (error) {
    console.error('❌ 활동 기록 업데이트 실패:', error);
    // 활동 기록은 중요하지 않으므로 에러를 던지지 않음
  }
}

/**
 * 닉네임 중복 확인
 */
export async function checkNicknameAvailable(nickname: string, excludeUserId?: string): Promise<boolean> {
  try {
    const profilesRef = collection(db, PROFILES_COLLECTION);
    const q = query(profilesRef, where('basicInfo.nickname', '==', nickname));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return true; // 사용 가능
    }

    // 자신의 프로필은 제외
    if (excludeUserId) {
      const isOwnProfile = querySnapshot.docs.some(doc => doc.id === excludeUserId);
      return querySnapshot.docs.length === 1 && isOwnProfile;
    }

    return false; // 이미 사용 중
  } catch (error) {
    console.error('❌ 닉네임 중복 확인 실패:', error);
    return false;
  }
}

/**
 * 프로필 초기 설정 여부 확인
 */
export async function isProfileSetupComplete(userId: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) return false;

    // 기본 정보가 모두 설정되어 있는지 확인
    const { nickname, platform, activeTimeZone } = profile.basicInfo;
    return !!(nickname && platform && activeTimeZone);
  } catch (error) {
    console.error('❌ 프로필 설정 완료 확인 실패:', error);
    return false;
  }
}

/**
 * 닉네임 유효성 검증
 */
export function validateNickname(nickname: string): { isValid: boolean; error?: string } {
  const { minLength, maxLength, pattern } = PROFILE_VALIDATION.nickname;
  
  if (!nickname) {
    return { isValid: false, error: '닉네임을 입력해주세요.' };
  }
  
  if (nickname.length < minLength) {
    return { isValid: false, error: `닉네임은 ${minLength}자 이상이어야 합니다.` };
  }
  
  if (nickname.length > maxLength) {
    return { isValid: false, error: `닉네임은 ${maxLength}자 이하여야 합니다.` };
  }
  
  if (!pattern.test(nickname)) {
    return { isValid: false, error: '닉네임은 한글, 영문, 숫자, -, _만 사용할 수 있습니다.' };
  }
  
  return { isValid: true };
}
