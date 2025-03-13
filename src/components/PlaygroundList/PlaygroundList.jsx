import { Link } from 'react-router';

const PlaygroundList = (props) => {
    return (
        <main>
          {props.playgrounds.map((playground) => (
            <Link key={playground._id} to={`/playgrounds/${playground._id}`}>
              <article>
                <header>
                  <h2>{playground.name}</h2>
                  <p>
                    {`${playground.author.username} posted on
                    ${new Date(playground.createdAt).toLocaleDateString()}`}
                  </p>
                </header>
                <p>{playground.address}</p>
              </article>
            </Link>
          ))}
        </main>
      );
};


export default PlaygroundList;