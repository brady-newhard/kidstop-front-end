import { useParams } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import * as playgroundService from '../../services/playgroundService';
import CommentForm from '../CommentForm/CommentForm';
import { UserContext } from '../../contexts/UserContext';

const PlaygroundDetails = (props) => {
    const { playgroundId } = useParams();
    const [playground, setPlayground] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchPlayground = async () => {
            const playgroundData = await playgroundService.show(playgroundId);
            setPlayground(playgroundData);
        };
        fetchPlayground();
    }, [playgroundId]);

    const handleAddComment = async (commentFormData) => {
        console.log('commentFormData', commentFormData);
        const newComment = await playgroundService.createComment(playgroundId, commentFormData);
        setPlayground({ ...playground, comments: [...playground.comments, newComment] });
    };
    if (!playground) return <div>Loading...</div>;
    return (
        <main>
            <section>

                <header>
                    <h1>{playground.name}</h1>
                    <div>
                        <p>
                            {`${playground.author.username} posted on
              ${new Date(playground.createdAt).toLocaleDateString()}`}
                        </p>
                        {playground.author._id === user._id && (
                            <>
                                {/* <Link to={`/playgrounds/${playgroundId}/edit`}>Edit</Link> */}
                                <button onClick={() => props.handleDeletePlayground(playgroundId)}>
                                    Delete
                                </button>
                            </>
                        )}
                        {/* Don't forget to close it */}
                    </div>

                </header>
                <p>{playground.description}</p>
                <p>{playground.rating}</p>
            </section>


            {/* Description */}
            {/* {playground.description && (
                        <div>
                            <h2>Description</h2>
                            <p>{playground.description}</p>
                        </div>
                    )} */}

            {/* Amenities */}
            {/* {playground.amenities && playground.amenities.length > 0 && (
                        <div className="amenities">
                            <h2>Amenities</h2>
                            <ul>
                                {playground.amenities.map((amenity, index) => (
                                    <li key={index}>{amenity}</li>
                                ))}
                            </ul>
                        </div>
                    )} */}
            {/* </header>
                <p>{playground.comments}</p>
            </section> */}
            <section>
                <h2>comments</h2>
                <CommentForm handleAddComment={handleAddComment} />
                {!playground.comments.length && <p>There are no comments.</p>}

                {playground.comments.map((comment) => (
                    <article key={comment._id}>
                        <header>
                            <p>
                                {`${comment.author.username} posted on
                                ${new Date(comment.createdAt).toLocaleDateString()}`}
                            </p>
                            {comment.author._id === user._id && (
                                <>
                                    <button onClick={() => props.handleDeletePlayground(playground._id)}>Delete</button>
                                </>
                            )}
                        </header>
                        {/* <p>{comment.text}</p> */}
                    </article>
                ))}

            </section>
        </main>
    );
};

export default PlaygroundDetails;