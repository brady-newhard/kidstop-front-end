import { Link } from 'react-router-dom';
import './Games.css';

const Games = () => {
  // Simple game data with just title, icon and URL
  const gamesList = [
    {
      id: 'mermaid-match',
      title: 'The Little Mermaid Match Game',
      icon: '🧜‍♀️',
      url: 'https://brady-newhard.github.io/little-mermaid-match-game/'
    },
    {
      id: 'memory-game',
      title: 'Power Up Memory Game',
      icon: '🍄',
      url: 'https://mendezugenbuehler.github.io/memory-game/'
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      icon: '⭕',
      url: 'https://brady-newhard.github.io/tic-tac-toe/'
    },
    {
      id: 'license-plate',
      title: 'The License Plate Game',
      icon: '🚗',
      url: 'https://licenseplates.app/'
    }
  ];

  return (
    <main className="games-container">
      <div className="games-header">
        <h1 className="games-title">Games & Activities</h1>
      </div>
      
      <div className="games-list">
        {gamesList.map((game) => (
          <a 
            key={game.id}
            href={game.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="game-button"
          >
            <span className="game-icon">{game.icon}</span>
            {game.title}
          </a>
        ))}
      </div>
    </main>
  );
};

export default Games; 