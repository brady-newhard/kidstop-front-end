import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as playgroundService from '../../services/playgroundService';

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
    <form onSubmit={handleSubmit}>
      <label htmlFor='text-input'>Your Comment:</label>
      <textarea
        required
        type='text'
        name='text'
        id='text-input'
        value={formData.text}
        onChange={handleChange}
      />
      <button type='submit'>{commentId ? 'Update Comment' : 'Submit Comment'}</button>
    </form>
  );
};

export default CommentForm;

