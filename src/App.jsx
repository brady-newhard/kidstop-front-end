import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import PlaygroundsPage from './components/PlaygroundSearch/PlaygroundSearch';
import PlaygroundList from './components/PlaygroundList/PlaygroundList';
import PlaygroundDetails from './components/PlaygroundDetails/PlaygroundDetails';
import * as playgroundService from './services/playgroundService';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);
  const [playgrounds, setPlaygrounds] = useState([]);

  useEffect(() => {
    const fetchAllPlaygrounds = async () => {
      const playgroundsData = await playgroundService.index();
      setPlaygrounds(playgroundsData);
    };
    if (user) fetchAllPlaygrounds();
  }, [user]);
  
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            {/* Protected routes (available only to signed-in users) */}
            <Route path='/playgroundfinder' element={<PlaygroundsPage />} />
            <Route path='/playgrounds' element={<PlaygroundList playgrounds={playgrounds} />} />
            <Route path='/playgrounds/:id' element={<PlaygroundDetails />} />
            <Route path='/playgrounds/new' element={<h1>New KidStop</h1>} />
          </>
        ) : (
          <>
            {/* Non-user routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
