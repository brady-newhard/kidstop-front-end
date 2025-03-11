import { useEffect, useState, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as userService from '../../services/userService';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    // Add detailed debugging logs
    console.log('Full user object:', user);
    console.log('User properties:', Object.keys(user || {}));
    console.log('firstName value:', user?.firstName);
    console.log('User payload from token:', JSON.parse(atob(localStorage.getItem('token').split('.')[1])).payload);
    
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        console.log('Fetched users:', fetchedUsers);
        setUsers(fetchedUsers);
      } catch (err) {
        console.log('Error fetching users:', err)
      }
    }
    if (user) fetchUsers();
  }, [user]);

  if (!user) return <main><h1>Loading...</h1></main>;

  return (
    <main>
      <h1>Welcome, {user?.firstName || user?.username || 'Guest'}</h1>
      <p>
        This is the dashboard page where you can see a list of all the users.
      </p>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </main>
  );
};

export default Dashboard;
