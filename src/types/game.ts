export interface GameServer {
  id: string;
  name: string;
  currency: string; // 게임 내 화폐 단위 (아데나, 메소, 골드 등)
  lowestPrice: number; // 최저가 (1만원당 게임머니)
  averagePrice: number; // 평균가 (1만원당 게임머니)
  lastUpdated: string;
  updateTime: string; // HH:MM 형식
  trend: 'up' | 'down' | 'stable';
  priceHistory: PricePoint[]; // 차트용 데이터
}

export interface PricePoint {
  date: string;
  price: number;
  type: 'lowest' | 'average';
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  category: string; // PC게임, 모바일게임
  servers: GameServer[];
}

export interface GamePriceData {
  [gameId: string]: Game;
}
