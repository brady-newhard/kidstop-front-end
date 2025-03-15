import { Link } from 'react-router-dom';

const PlaygroundList = (props) => {
    return (
        <main>
          {props.playgrounds.map((playground) => (
            <div key={playground._id}>
              <Link to={`/playgrounds/${playground._id}`}>
                <article>
                  <header>
                    <h2>{playground.name}</h2>
                    {playground.author && (
                      <p>
                        {`${playground.author.username} posted on
                        ${new Date(playground.createdAt).toLocaleDateString()}`}
                      </p>
                    )}
                  </header>
                  {/* {playground.comments && playground.comments.length > 0 ? (
                    <p>{`${playground.comments.length} comment${playground.comments.length === 1 ? '' : 's'}`}</p>
                  ) : (
                    <p>No comments yet</p>
                  )} */}
                  <p>{playground.description}</p>
                </article>
              </Link>
            </div>
          ))}
        </main>
    );
};

export default PlaygroundList;