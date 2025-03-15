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
import Games from './components/Games/Games';
import Media from './components/Media/Media';
import ParentPortal from './components/ParentPortal/ParentPortal';

import * as playgroundService from './services/playgroundService';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);
  const [playgrounds, setPlaygrounds] = useState([]);
  const [commentUpdated, setCommentUpdated] = useState(false);
  const navigate = useNavigate();
  
  const fetchAllPlaygrounds = async () => {
    try {
      console.log('Fetching all playgrounds...');
      const playgroundsData = await playgroundService.index();
      console.log('Fetched playgrounds:', playgroundsData);
      
      // Process the playgrounds data to ensure comments have author information
      if (playgroundsData && Array.isArray(playgroundsData)) {
        const processedPlaygrounds = playgroundsData.map(playground => {
          if (playground.comments && playground.comments.length > 0) {
            // Process comments to ensure they have author information
            playground.comments = playground.comments.map(comment => {
              if (!comment.author && user) {
                console.log(`Adding missing author info to comment ${comment._id} in playground ${playground._id}`);
                return {
                  ...comment,
                  author: {
                    _id: user._id,
                    username: user.username
                  }
                };
              }
              return comment;
            });
          }
          return playground;
        });
        
        setPlaygrounds(processedPlaygrounds);
      } else {
        setPlaygrounds(playgroundsData || []);
      }
      
      setCommentUpdated(false);
    } catch (error) {
      console.error('Error fetching playgrounds:', error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User or commentUpdated changed, fetching playgrounds...');
      fetchAllPlaygrounds();
    }
  }, [user, commentUpdated]);
  
  const handleAddPlayground = async (playgroundFormData) => {
    try {
      const newPlayground = await playgroundService.create(playgroundFormData);
      setPlaygrounds([newPlayground, ...playgrounds]);
      navigate('/playgrounds');
    } catch (error) {
      console.error('Error adding playground:', error);
    }
  };

  const handleDeletePlayground = async (playgroundId) => {
    try {
      await playgroundService.deletePlayground(playgroundId);
      setPlaygrounds(playgrounds.filter(playground => playground._id !== playgroundId));
      navigate('/playgrounds');
    } catch (error) {
      console.error('Error deleting playground:', error);
    }
  };

  const handleUpdatePlayground = async (playgroundId, playgroundFormData) => {
    try {
      const updatedPlayground = await playgroundService.update(playgroundId, playgroundFormData);
      setPlaygrounds(playgrounds.map(playground => playground._id === playgroundId ? updatedPlayground : playground));
      navigate(`/playgrounds/${playgroundId}`);
    } catch (error) {
      console.error('Error updating playground:', error);
    }
  };

  const handleCommentUpdate = () => {
    console.log('Comment updated, setting flag to refresh playgrounds...');
    setCommentUpdated(true);
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
              <PlaygroundDetails 
                handleDeletePlayground={handleDeletePlayground} 
                handleCommentUpdate={handleCommentUpdate}
              />
            } />
            <Route path='/playgrounds/:playgroundId/comments' element={<CommentForm onCommentSubmit={handleCommentUpdate} />} />
            <Route path='/playgrounds/:playgroundId/comments/:commentId/edit' element={<CommentForm onCommentSubmit={handleCommentUpdate} />} />
            <Route path='/games' element={<Games />} />
            <Route path='/media' element={<Media />} />
            <Route path='/parent-portal' element={<ParentPortal />} />
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
