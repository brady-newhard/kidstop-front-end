import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <main>
      <h1>Welcome to the KidStop—where families roam free, paws explore happily, and parents recharge effortlessly. Discover playgrounds, dog parks, endless games, and curated media—all in one joyful journey. Your family adventure, simplified.</h1>
      <p>Sign up now—or sign in—to unlock your well-deserved escape on the super-secret dashboard!</p>
      
      <div>
        <Link to="/sign-up">
          <button>Sign Up</button>
        </Link>
        {' '}
        <Link to="/sign-in">
          <button>Sign In</button>
        </Link>
      </div>
    </main>
  );
};

export default Landing;
