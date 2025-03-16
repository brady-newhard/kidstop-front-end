import { Link } from 'react-router-dom';
import './PlaygroundList.css';

const PlaygroundList = (props) => {
    return (
        <main className="playground-list-container">
          <div className="playground-list-header">
            <h1 className="playground-list-title">Favorite KidStops</h1>
            <p className="playground-list-description">
              View your's and others favorite KidStop's
            </p>
          </div>
          
          {props.playgrounds.length > 0 ? (
            <div className="playground-grid">
              {props.playgrounds.map((playground) => (
                <Link 
                  key={playground._id} 
                  to={`/playgrounds/${playground._id}`}
                  className="playground-card"
                >
                  <div className="playground-card-content">
                    <h2 className="playground-card-title">{playground.name}</h2>
                    {playground.author && (
                      <p className="playground-card-address">
                        {`${playground.author.username} posted on
                        ${new Date(playground.createdAt).toLocaleDateString()}`}
                      </p>
                    )}
                    <p className="playground-card-description">{playground.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="playground-empty-state">
              <h3>No favorites yet</h3>
              <p>You haven't saved any KidStops to your favorites yet. Explore and find some great places to add!</p>
              <Link to="/playgroundfinder" className="playground-empty-state-button">
                Find KidStops
              </Link>
            </div>
          )}
        </main>
    );
};

export default PlaygroundList;