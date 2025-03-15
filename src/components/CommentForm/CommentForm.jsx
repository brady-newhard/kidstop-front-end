import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as playgroundService from '../../services/playgroundService';

const CommentForm = ({ handleAddComment, onCommentSubmit }) => {
  const [formData, setFormData] = useState({ text: '' });
  const { playgroundId, commentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const playgroundData = await playgroundService.show(playgroundId);
        const comment = playgroundData.comments.find(comment => comment._id === commentId);
        if (comment) {
          console.log('Fetched comment for editing:', comment);
          setFormData(comment);
        }
      } catch (error) {
        console.error('Error fetching comment:', error);
      }
    };
    
    if (playgroundId && commentId) fetchComment();
  }, [playgroundId, commentId]);
  
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    
    try {
      if (playgroundId && commentId) {
        // Update existing comment
        console.log('Updating comment:', commentId, formData);
        await playgroundService.updateComment(playgroundId, commentId, formData);
        
        // Notify App.jsx that a comment was updated
        if (onCommentSubmit) {
          console.log('Notifying App about comment update');
          onCommentSubmit();
        }
        
        navigate(`/playgrounds/${playgroundId}`);
      } else {
        // Add new comment
        if (handleAddComment) {
          console.log('Adding new comment:', formData);
          await handleAddComment(formData);
        }
      }
      
      setFormData({ text: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='text-input'>Your Comment:</label>
      <textarea
        required
        type='text'
        name='text'
        id='text-input'
        value={formData.text || ''}
        onChange={handleChange}
      />
      <button type='submit'>{commentId ? 'Update Comment' : 'Submit Comment'}</button>
    </form>
  );
};

export default CommentForm;

