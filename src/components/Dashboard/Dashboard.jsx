import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const dashboardItems = [
    {
      title: 'Find KidStops',
      icon: '🛝',
      path: '/playgroundfinder',
      description: 'Search for playgrounds and dog parks near you'
    },
    {
      title: 'Favorite KidStops',
      icon: '⭐',
      path: '/playgrounds',
      description: 'Your saved playgrounds and dog parks'
    },
    {
      title: 'Add a KidStop',
      icon: '➕',
      path: '/playgrounds/new',
      description: 'Share a new playground or dog park'
    },
    {
      title: 'Games',
      icon: '🎮',
      path: '/games',
      description: 'Fun games and activities for kids'
    },
    {
      title: 'Media',
      icon: '🎥',
      path: '/media',
      description: 'Entertainment from KidStops'
    },
    {
      title: 'Parent Portal',
      icon: '👪',
      path: '/parent-portal',
      description: 'Parent resources and tools'
    },
  ];

  if (!user) return <main><h1>Loading...</h1></main>;

  return (
    <main className="dasboard-container">
      <h1 className="dasboard-title">Welcome back, {user?.firstName || user?.username || 'Guest'}! Ready for your well-deserved break? Let's find your next KidStop adventure! </h1>
      
      <div className="dasboard-grid">
        {dashboardItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className="dasboard-feature-card"
          >
            <div className="dashboard-icon">
              {item.icon}
            </div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
