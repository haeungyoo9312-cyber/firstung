import { GamePriceData } from '@/types/game';

// 차트용 더미 데이터 생성 함수
const generatePriceHistory = (basePrice: number, days: number = 7) => {
  const history = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const variation = Math.random() * 0.1 - 0.05; // ±5% 변동
    const lowestPrice = Math.floor(basePrice * (1 + variation));
    const averagePrice = Math.floor(lowestPrice * 1.05); // 평균가는 최저가의 105%
    
    history.push(
      {
        date: date.toISOString().split('T')[0],
        price: lowestPrice,
        type: 'lowest' as const
      },
      {
        date: date.toISOString().split('T')[0],
        price: averagePrice,
        type: 'average' as const
      }
    );
  }
  return history;
};

const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0].substring(0, 5)
  };
};

export const gameData: GamePriceData = {
  // PC게임
  lineage: {
    id: 'lineage',
    name: '리니지',
    icon: '🏰',
    category: 'PC게임',
    servers: [
      {
        id: 'ken01',
        name: '켄라우헬',
        currency: '아데나',
        lowestPrice: 850000,
        averagePrice: 880000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(850000)
      },
      {
        id: 'dep01',
        name: '데포로쥬',
        currency: '아데나',
        lowestPrice: 820000,
        averagePrice: 845000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(820000)
      }
    ]
  },
  lineage2: {
    id: 'lineage2',
    name: '리니지2',
    icon: '🏹',
    category: 'PC게임',
    servers: [
      {
        id: 'aden',
        name: '아덴',
        currency: '아데나',
        lowestPrice: 780000,
        averagePrice: 810000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(780000)
      }
    ]
  },
  maplestory: {
    id: 'maplestory',
    name: '메이플스토리',
    icon: '🍁',
    category: 'PC게임',
    servers: [
      {
        id: 'reboot',
        name: '리부트',
        currency: '메소',
        lowestPrice: 45000,
        averagePrice: 48000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(45000)
      },
      {
        id: 'scania',
        name: '스카니아',
        currency: '메소',
        lowestPrice: 42000,
        averagePrice: 46000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(42000)
      }
    ]
  },
  dungeon_fighter: {
    id: 'dungeon_fighter',
    name: '던전앤파이터',
    icon: '⚔️',
    category: 'PC게임',
    servers: [
      {
        id: 'anton',
        name: '안톤',
        currency: '골드',
        lowestPrice: 15000,
        averagePrice: 16800,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(15000)
      }
    ]
  },
  aion: {
    id: 'aion',
    name: '아이온',
    icon: '🪶',
    category: 'PC게임',
    servers: [
      {
        id: 'siel',
        name: '시엘',
        currency: '키나',
        lowestPrice: 28000,
        averagePrice: 31000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(28000)
      }
    ]
  },
  blade_and_soul: {
    id: 'blade_and_soul',
    name: '블레이드앤소울',
    icon: '⚡',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 22000,
        averagePrice: 24500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(22000)
      }
    ]
  },
  dk_online: {
    id: 'dk_online',
    name: 'DK온라인',
    icon: '🗡️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 19000,
        averagePrice: 21000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(19000)
      }
    ]
  },
  troy_online: {
    id: 'troy_online',
    name: '트로이온라인',
    icon: '🏛️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 16000,
        averagePrice: 18000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(16000)
      }
    ]
  },
  ban_online: {
    id: 'ban_online',
    name: '반온라인',
    icon: '🎯',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 13000,
        averagePrice: 15000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(13000)
      }
    ]
  },
  league_of_legends: {
    id: 'league_of_legends',
    name: '리그오브레전드',
    icon: '⚔️',
    category: 'PC게임',
    servers: [
      {
        id: 'kr',
        name: '한국 서버',
        currency: 'RP',
        lowestPrice: 9500,
        averagePrice: 10200,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(9500)
      }
    ]
  },
  baram: {
    id: 'baram',
    name: '바람의나라',
    icon: '🌪️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '냥',
        lowestPrice: 18000,
        averagePrice: 19500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(18000)
      }
    ]
  },
  tera: {
    id: 'tera',
    name: '테라',
    icon: '🗡️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 13500,
        averagePrice: 15200,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(13500)
      }
    ]
  },
  sudden_attack: {
    id: 'sudden_attack',
    name: '서든어택',
    icon: '🔫',
    category: 'PC게임',
    servers: [
      {
        id: 'main',
        name: '통합서버',
        currency: 'SP',
        lowestPrice: 8500,
        averagePrice: 9200,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(8500)
      }
    ]
  },
  magu_magu: {
    id: 'magu_magu',
    name: '마구마구',
    icon: '⚾',
    category: 'PC게임',
    servers: [
      {
        id: 'main',
        name: '통합서버',
        currency: '포인트',
        lowestPrice: 7000,
        averagePrice: 7800,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(7000)
      }
    ]
  },
  world_of_warcraft: {
    id: 'world_of_warcraft',
    name: '월드오브크래프트',
    icon: '🐉',
    category: 'PC게임',
    servers: [
      {
        id: 'azshara',
        name: '아즈샤라',
        currency: '골드',
        lowestPrice: 25000,
        averagePrice: 27500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(25000)
      }
    ]
  },
  mabinogi: {
    id: 'mabinogi',
    name: '마비노기',
    icon: '🧚',
    category: 'PC게임',
    servers: [
      {
        id: 'mari',
        name: '마리',
        currency: '골드',
        lowestPrice: 35000,
        averagePrice: 38000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(35000)
      }
    ]
  },
  dark_eden: {
    id: 'dark_eden',
    name: '다크에덴',
    icon: '🧛',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '노아',
        lowestPrice: 21000,
        averagePrice: 23000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(21000)
      }
    ]
  },
  mabinogi_heroes: {
    id: 'mabinogi_heroes',
    name: '마비노기영웅전',
    icon: '⚔️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 18000,
        averagePrice: 20000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(18000)
      }
    ]
  },
  sangukji_w: {
    id: 'sangukji_w',
    name: '삼국지W',
    icon: '🏺',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 14000,
        averagePrice: 16000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(14000)
      }
    ]
  },
  baseball_9dan: {
    id: 'baseball_9dan',
    name: '야구9단',
    icon: '⚾',
    category: 'PC게임',
    servers: [
      {
        id: 'main',
        name: '통합서버',
        currency: '포인트',
        lowestPrice: 6500,
        averagePrice: 7200,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(6500)
      }
    ]
  },
  sd_sangukji: {
    id: 'sd_sangukji',
    name: 'SD삼국지',
    icon: '🏮',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 12000,
        averagePrice: 13500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(12000)
      }
    ]
  },
  rift: {
    id: 'rift',
    name: '리프트',
    icon: '🌊',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 15500,
        averagePrice: 17000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(15500)
      }
    ]
  },
  finding_neverland: {
    id: 'finding_neverland',
    name: '파인딩네버랜드',
    icon: '🧚‍♀️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 11000,
        averagePrice: 12500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(11000)
      }
    ]
  },
  nine_sword_online: {
    id: 'nine_sword_online',
    name: '구검온라인',
    icon: '⚔️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 13500,
        averagePrice: 15000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(13500)
      }
    ]
  },
  rule_the_sky: {
    id: 'rule_the_sky',
    name: '룰더스카이',
    icon: '☁️',
    category: 'PC게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 9500,
        averagePrice: 11000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(9500)
      }
    ]
  },
  cyphers: {
    id: 'cyphers',
    name: '사이퍼즈',
    icon: '🥷',
    category: 'PC게임',
    servers: [
      {
        id: 'main',
        name: '통합서버',
        currency: '사이',
        lowestPrice: 7500,
        averagePrice: 8200,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(7500)
      }
    ]
  },
  diablo3: {
    id: 'diablo3',
    name: '디아블로3',
    icon: '👹',
    category: 'PC게임',
    servers: [
      {
        id: 'asia',
        name: 'Asia',
        currency: '골드',
        lowestPrice: 12000,
        averagePrice: 13500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(12000)
      }
    ]
  },

  // 모바일게임
  lineage_m: {
    id: 'lineage_m',
    name: '리니지M',
    icon: '🏰',
    category: '모바일게임',
    servers: [
      {
        id: 'ken01',
        name: '켄라우헬',
        currency: '아데나',
        lowestPrice: 950000,
        averagePrice: 980000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(950000)
      },
      {
        id: 'dep01',
        name: '데포로쥬',
        currency: '아데나',
        lowestPrice: 920000,
        averagePrice: 945000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(920000)
      }
    ]
  },
  lineage2m: {
    id: 'lineage2m',
    name: '리니지2M',
    icon: '🏹',
    category: '모바일게임',
    servers: [
      {
        id: 'aden01',
        name: '아덴01',
        currency: '아데나',
        lowestPrice: 780000,
        averagePrice: 810000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(780000)
      }
    ]
  },
  lineage_w: {
    id: 'lineage_w',
    name: '리니지W',
    icon: '⚔️',
    category: '모바일게임',
    servers: [
      {
        id: 'aden',
        name: '아덴',
        currency: '아데나',
        lowestPrice: 850000,
        averagePrice: 880000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(850000)
      }
    ]
  },
  maplestory_m: {
    id: 'maplestory_m',
    name: '메이플스토리M',
    icon: '🍀',
    category: '모바일게임',
    servers: [
      {
        id: 'scania_m',
        name: '스카니아',
        currency: '메소',
        lowestPrice: 35000,
        averagePrice: 38000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(35000)
      }
    ]
  },
  aimo: {
    id: 'aimo',
    name: '아이모',
    icon: '💎',
    category: '모바일게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 25000,
        averagePrice: 27000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(25000)
      }
    ]
  },
  elgard: {
    id: 'elgard',
    name: '엘가드',
    icon: '🛡️',
    category: '모바일게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 22000,
        averagePrice: 24500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(22000)
      }
    ]
  },
  chaos_bane: {
    id: 'chaos_bane',
    name: '카오스베인',
    icon: '🌀',
    category: '모바일게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 18000,
        averagePrice: 20000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(18000)
      }
    ]
  },
  com2us_baseball_2012: {
    id: 'com2us_baseball_2012',
    name: '컴투스프로야구2012',
    icon: '⚾',
    category: '모바일게임',
    servers: [
      {
        id: 'main',
        name: '통합서버',
        currency: '포인트',
        lowestPrice: 5500,
        averagePrice: 6200,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(5500)
      }
    ]
  },
  monarch: {
    id: 'monarch',
    name: '모나크',
    icon: '👑',
    category: '모바일게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 16000,
        averagePrice: 18000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(16000)
      }
    ]
  },
  hero_age_30: {
    id: 'hero_age_30',
    name: '영웅시대30',
    icon: '🛡️',
    category: '모바일게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 14500,
        averagePrice: 16500,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'stable',
        priceHistory: generatePriceHistory(14500)
      }
    ]
  },
  cheongpung_myeongwol: {
    id: 'cheongpung_myeongwol',
    name: '청풍명월',
    icon: '🌙',
    category: '모바일게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 12500,
        averagePrice: 14000,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'up',
        priceHistory: generatePriceHistory(12500)
      }
    ]
  },
  sinseon_do: {
    id: 'sinseon_do',
    name: '신선도',
    icon: '🧙‍♂️',
    category: '모바일게임',
    servers: [
      {
        id: 'server1',
        name: '1서버',
        currency: '골드',
        lowestPrice: 11000,
        averagePrice: 12800,
        lastUpdated: getCurrentDateTime().date,
        updateTime: getCurrentDateTime().time,
        trend: 'down',
        priceHistory: generatePriceHistory(11000)
      }
    ]
  }
};
