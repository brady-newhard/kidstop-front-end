import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to KidStop</h1>
      
      <div className="landing-card">
        <h2>What is KidStop?</h2>
        <p>
          KidStop is your one-stop destination for finding and sharing the best playgrounds
          and kid-friendly locations in your area. Whether you're looking for a place with swings,
          slides, or water features, KidStop helps you discover the perfect spot for your kids.
        </p>
        <p>Sign up now—or sign in—to unlock your well-deserved escape on the super-secret dashboard!</p>
        
        <div className="landing-buttons">
          <Link to="/sign-up">
            <button>Sign Up</button>
          </Link>
          <Link to="/sign-in">
            <button>Sign In</button>
          </Link>
        </div>
      </div>

      <div className="landing-grid">
        <div className="landing-feature-card">
          <h3>Find Playgrounds</h3>
          <p>Discover kid-friendly locations near you with our interactive map.</p>
          <Link to="/sign-in">
            <button>Sign In to Explore</button>
          </Link>
        </div>

        <div className="landing-feature-card">
          <h3>Your Favorites</h3>
          <p>View and manage your favorite playgrounds and locations.</p>
          <Link to="/sign-in">
            <button>Sign In to View</button>
          </Link>
        </div>

        <div className="landing-feature-card">
          <h3>Add a Playground</h3>
          <p>Know a great playground? Share it with the KidStop community!</p>
          <Link to="/sign-in">
            <button>Sign In to Contribute</button>
          </Link>
        </div>
      </div>

      <div className="landing-feature-list">
        <h2>Features</h2>
        <ul>
          <li>Interactive map to find playgrounds near you</li>
          <li>Filter by amenities like swings, slides, water features, and more</li>
          <li>Read and leave reviews for playgrounds</li>
          <li>Save your favorite locations</li>
          <li>Add new playgrounds to help other parents</li>
        </ul>
      </div>
    </div>
  );
};

export default Landing;
