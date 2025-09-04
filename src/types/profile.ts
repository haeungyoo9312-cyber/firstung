// 사용자 프로필 관련 타입 정의

// 기본 정보
export interface UserBasicInfo {
  nickname: string;
  platform: 'PC' | '모바일' | 'PC+모바일';
  activeTimeZone: 'morning' | 'afternoon' | 'evening' | 'night' | 'allday';
  profileImage?: string;
  joinDate: string;
  lastLoginDate: string;
}

// 관심 게임/서버 설정
export interface FavoriteGame {
  gameId: string;
  gameName: string;
  gameIcon: string;
  favoriteServers: string[]; // 서버 ID 배열
  addedDate: string;
  priority: number; // 1-5, 높을수록 중요
}

// 알림 설정
export interface NotificationSettings {
  priceAlert: {
    enabled: boolean;
    thresholdPercentage: number; // 5%, 10%, 15% 등
    priceIncrease: boolean; // 가격 상승 알림
    priceDecrease: boolean; // 가격 하락 알림
  };
  updateAlert: {
    enabled: boolean;
    frequency: 'realtime' | 'hourly' | 'daily'; // 업데이트 알림 빈도
  };
  weeklyReport: {
    enabled: boolean;
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    time: string; // HH:MM 형식
  };
  browserPush: boolean;
  emailNotification: boolean;
}

// 사용자 활동 통계
export interface UserActivity {
  totalLogins: number;
  favoriteGamesCount: number;
  lastViewedGames: string[]; // 최근 조회한 게임 ID (최대 10개)
  searchHistory: string[]; // 검색 기록 (최대 20개)
  mostViewedServers: {
    gameId: string;
    serverId: string;
    viewCount: number;
  }[];
}

// 통합 프로필 인터페이스
export interface UserProfile {
  userId: string;
  basicInfo: UserBasicInfo;
  favoriteGames: FavoriteGame[];
  notificationSettings: NotificationSettings;
  activity: UserActivity;
  createdAt: string;
  updatedAt: string;
}

// 프로필 업데이트용 타입 (부분 업데이트)
export type UserProfileUpdate = Partial<Omit<UserProfile, 'userId' | 'createdAt'>>;

// 프로필 생성시 필수 데이터  
export interface CreateProfileData {
  userId: string;
  basicInfo: Pick<UserBasicInfo, 'nickname' | 'platform' | 'activeTimeZone'>;
}

// 프로필 생성 시 사용자가 제공하는 데이터
export type CreateProfileInput = Omit<CreateProfileData, 'userId'>;

// Firebase Firestore 문서 구조
export interface ProfileDocument {
  // Firestore에 저장될 때의 구조
  userId: string;
  basicInfo: UserBasicInfo;
  favoriteGames: FavoriteGame[];
  notificationSettings: NotificationSettings;
  activity: UserActivity;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

// 관심 게임 추가/제거를 위한 타입
export interface FavoriteGameAction {
  action: 'add' | 'remove' | 'update';
  gameData?: Omit<FavoriteGame, 'addedDate'>;
  gameId?: string;
}


// 프로필 초기화용 기본값
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  priceAlert: {
    enabled: true,
    thresholdPercentage: 10,
    priceIncrease: true,
    priceDecrease: true,
  },
  updateAlert: {
    enabled: true,
    frequency: 'daily',
  },
  weeklyReport: {
    enabled: false,
    day: 'monday',
    time: '09:00',
  },
  browserPush: true,
  emailNotification: false,
};

export const DEFAULT_USER_ACTIVITY: UserActivity = {
  totalLogins: 1,
  favoriteGamesCount: 0,
  lastViewedGames: [],
  searchHistory: [],
  mostViewedServers: [],
};

// 프로필 유효성 검증 규칙
export const PROFILE_VALIDATION = {
  nickname: {
    minLength: 2,
    maxLength: 20,
    pattern: /^[가-힣a-zA-Z0-9_-]+$/,
  },
  favoriteGames: {
    maxCount: 5,
  },
  favoriteServers: {
    maxCountPerGame: 10,
  },
  thresholdPercentage: {
    min: 1,
    max: 50,
  },
} as const;
