import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import PlaygroundsPage from './components/PlaygroundSearch/PlaygroundSearch';
import PlaygroundList from './components/PlaygroundList/PlaygroundList';
import PlaygroundDetails from './components/PlaygroundDetails/PlaygroundDetails';
import PlaygroundForm from './components/PlaygroundForm/PlaygroundForm';
import CommentForm from './components/CommentForm/CommentForm';

import * as playgroundService from './services/playgroundService';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);
  const [playgrounds, setPlaygrounds] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAllPlaygrounds = async () => {
      const playgroundsData = await playgroundService.index();
      setPlaygrounds(playgroundsData);
    };
    if (user) fetchAllPlaygrounds();
  }, [user]);
  
  const handleAddPlayground = async (playgroundFormData) => {
    const newPlayground = await playgroundService.create(playgroundFormData);
    setPlaygrounds([newPlayground, ...playgrounds]);
    navigate('/playgrounds');
  };

  const handleDeletePlayground = async (playgroundId) => {
  const deletedPlayground = await playgroundService.deletePlayground(playgroundId);
  setPlaygrounds(playgrounds.filter(playground => playground._id !== playgroundId));
  navigate('/playgrounds');
  }
  const handleUpdatePlayground = async (playgroundId, playgroundFormData) => {
    const updatedPlayground = await playgroundService.update(playgroundId, playgroundFormData);
    setPlaygrounds(playgrounds.map(playground => playground._id === playgroundId ? updatedPlayground : playground));
    navigate(`/playgrounds/${playgroundId}`);
  };

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
            <Route path='/playgrounds/new' element={<PlaygroundForm handleAddPlayground={handleAddPlayground} />} />
            <Route path='/playgrounds/:playgroundId/edit' element={<PlaygroundForm handleUpdatePlayground={handleUpdatePlayground} />} />
            <Route path='/playgrounds/:playgroundId' element={
              <PlaygroundDetails handleDeletePlayground={handleDeletePlayground} />
            } />
            <Route path='/playgrounds/:playgroundId/comments' element={<CommentForm />} />
            <Route path='/playgrounds/:playgroundId/comments/:commentId/edit' element={<CommentForm />} />
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
