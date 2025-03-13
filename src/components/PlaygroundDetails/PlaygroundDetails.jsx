import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import * as playgroundService from '../../services/playgroundService';

const PlaygroundDetails = () => {
    const { playgroundId } = useParams();
    const [playground, setPlayground] = useState(null);

    useEffect(() => {
        const fetchPlayground = async () => {
            const playgroundData = await playgroundService.show(playgroundId);
            setPlayground(playgroundData);
        };
        fetchPlayground();
    }, [playgroundId]);

    console.log(playground, 'playground state');
    if (!playground) return <div>Loading...</div>;
    return (
        <main>
            <section>
                <header>
                    <h1>{playground.name}</h1>

                    {/* Location */}
                    <div className="location">
                        <h2>Location</h2>
                        <p>Coordinates: {playground.location.coordinates.join(', ')}</p>
                    </div>

                    {/* Description */}
                    {playground.description && (
                        <div className="description">
                            <h2>Description</h2>
                            <p>{playground.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {playground.amenities && playground.amenities.length > 0 && (
                        <div className="amenities">
                            <h2>Amenities</h2>
                            <ul>
                                {playground.amenities.map((amenity, index) => (
                                    <li key={index}>{amenity}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </header>
                <p>{playground.reviews}</p>
            </section>
            <section>
                <h2>Reviews</h2>
                {!hoot.comments.length && <p>There are no comments.</p>}

                {playground.reviews.map((review) => (
                    <article key={review._id}>
                        <header>
                            <p>
                                {`${review.author.username} posted on
                                ${new Date(review.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{review.text}</p>
                    </article>
                ))}

            </section>
        </main>
    );
};

export default PlaygroundDetails;