import { Link } from 'react-router-dom';

const Games = () => {
  return (
    <main>
      <h1>Games & Activities</h1>
      
      <section>
        <a 
          href="https://brady-newhard.github.io/little-mermaid-match-game/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          The Little Mermaid Match Game
        </a>
        <br />
        <a 
          href="https://mendezugenbuehler.github.io/memory-game/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Power Up via Memory Game
        </a>
        <br />
        <a href="https://brady-newhard.github.io/tic-tac-toe/"
        target="_blank"
        rel="noopener noreferrer"
        >
          Tic Tac Toe
        </a>
        <br />
        <a href="https://licenseplates.app/"
        target="_blank"
        rel="noopener noreferrer"
        >
          The License Plate Game
        </a>

      </section>

      <section>
        <h2>Account Access</h2>
        <Link to="/sign-up">
          <button>Sign Up</button>
        </Link>
        {' '}
        <Link to="/sign-in">
          <button>Sign In</button>
        </Link>
      </section>
    </main>
  );
};

export default Games; 