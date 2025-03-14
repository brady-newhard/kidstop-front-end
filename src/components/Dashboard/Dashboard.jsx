import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const dashboardItems = [
    {
      title: 'Find KidStops',
      icon: '🐶🛝',
      path: '/playgroundfinder',
      description: 'Search for playgrounds and dog parks near you'
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
    }
  ];

  if (!user) return <main><h1>Loading...</h1></main>;

  return (
    <main>
      <h1>Welcome, {user?.firstName || user?.username || 'Guest'}!</h1>
      
      <div>
        {dashboardItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
          >
            <div>
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
