import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as playgroundService from '../../services/playgroundService';
import './CommentForm.css';

const CommentForm = ({ handleAddComment }) => {
  const [formData, setFormData] = useState({ text: '' });
  const { playgroundId, commentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComment = async () => {
      const playgroundData = await playgroundService.show(playgroundId);
      setFormData(playgroundData.comments.find(comment => comment._id === commentId));
    };
    
    if (playgroundId && commentId) fetchComment();
  }, [playgroundId, commentId]);
  
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (playgroundId && commentId) {
      playgroundService.updateComment(playgroundId, commentId, formData);
      navigate(`/playgrounds/${playgroundId}`);
    } else {
      handleAddComment(formData);
    }
    setFormData({ text: '' });
  };

  return (
    <div className="comment-form-container">
      <h2 className="comment-form-title">{commentId ? 'Edit Your Comment' : 'Add a Comment'}</h2>
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor='text-input'>Your Comment:</label>
          <textarea
            required
            type='text'
            name='text'
            id='text-input'
            value={formData.text}
            onChange={handleChange}
            placeholder="Share your thoughts about this playground..."
          />
        </div>
        <button type='submit' className="comment-form-button">
          {commentId ? 'Update Comment' : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;

