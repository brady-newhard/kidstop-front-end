import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import * as playgroundService from '../../services/playgroundService';
import CommentForm from '../CommentForm/CommentForm';
import { UserContext } from '../../contexts/UserContext';
import './PlaygroundDetails.css';

const PlaygroundDetails = (props) => {
    const { playgroundId } = useParams();
    const [playground, setPlayground] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayground = async () => {
            const playgroundData = await playgroundService.show(playgroundId);
            setPlayground(playgroundData);
        };
        fetchPlayground();
    }, [playgroundId]);

    const handleAddComment = async (commentFormData) => {
        const newComment = await playgroundService.createComment(playgroundId, commentFormData);
        setPlayground({ ...playground, comments: [...playground.comments, newComment] });
    };
    
    const handleDeleteComment = async (commentId) => {
        console.log('commentId:', commentId);
        const updatedPlayground = await playgroundService.deleteComment(playgroundId, commentId);
        
        setPlayground({
          ...playground,
          comments: playground.comments.filter((comment) => comment._id !== commentId),
        });
    };
    
    const handleEditClick = () => {
        navigate(`/playgrounds/${playgroundId}/edit`);
    };
    
    const handleEditCommentClick = (commentId) => {
        navigate(`/playgrounds/${playgroundId}/comments/${commentId}/edit`);
    };
    
    if (!playground) return <div>Loading...</div>;
    
    return (
        <main>
            <section>
                <header>
                    <h1>{playground.name}</h1>
                    {playground.author && (
                        <div>
                            <p>
                                {`${playground.author.username} posted on
                                ${new Date(playground.createdAt).toLocaleDateString()}`}
                            </p>
                            <p>{playground.description}</p>
                            {playground.location && <p>Location: {playground.location}</p>}
                            <div className="playground-rating">
                                <span className="rating-label">Rating: </span>
                                <span className="rating-stars">{playground.rating}</span>
                            </div>
                            {user && playground.author._id === user._id && (
                                <>
                                    <button onClick={handleEditClick}>Edit</button>
                                    <button onClick={() => props.handleDeletePlayground(playgroundId)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </header>
            </section>
            <section>
                <CommentForm handleAddComment={handleAddComment} />
                <h2>Comments</h2>
                {(!playground.comments || !playground.comments.length) && <p>There are no comments.</p>}
                {playground.comments && playground.comments.map((comment) => (
                    <article key={comment._id}>
                        <header>
                            {comment.author && (
                                <>
                                    <p>
                                        {`${comment.author.username} posted on
                                        ${new Date(comment.createdAt).toLocaleDateString()}`}
                                    </p>
                                    <p>{comment.text}</p>
                                </>
                            )}
                            {user && comment.author && comment.author._id === user._id && (
                                <>
                                    <button onClick={() => handleEditCommentClick(comment._id)}>Edit</button>
                                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                </>
                            )}
                        </header>
                        
                    </article>
                ))}
            </section>
        </main>
    );
};

export default PlaygroundDetails;