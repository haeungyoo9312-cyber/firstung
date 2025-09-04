'use client';

interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
}

interface GameSelectorProps {
  games: Game[];
  selectedGame: string;
  onGameSelect: (gameId: string) => void;
}

export default function GameSelector({ games, selectedGame, onGameSelect }: GameSelectorProps) {
  return (
    <div className="game-selector">
      <h2 className="selector-title">게임 선택</h2>
      
      {/* PC게임 */}
      <div className="category-section">
        <h3 className="category-title">PC게임</h3>
        <div className="game-tabs">
          {games.filter(game => game.category === 'PC게임').map((game) => (
            <button
              key={game.id}
              className={`game-tab ${selectedGame === game.id ? 'active' : ''}`}
              onClick={() => onGameSelect(game.id)}
            >
              <span className="game-icon">{game.icon}</span>
              <span className="game-name">{game.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 모바일게임 */}
      <div className="category-section">
        <h3 className="category-title">모바일게임</h3>
        <div className="game-tabs">
          {games.filter(game => game.category === '모바일게임').map((game) => (
            <button
              key={game.id}
              className={`game-tab ${selectedGame === game.id ? 'active' : ''}`}
              onClick={() => onGameSelect(game.id)}
            >
              <span className="game-icon">{game.icon}</span>
              <span className="game-name">{game.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
