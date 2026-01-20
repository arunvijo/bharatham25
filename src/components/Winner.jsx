import React from 'react';
import Bharatham26Winner from './Bharatham26Winner';

const Winner = ({ winner, totalPoints, rank }) => {
    return (
        <div className="my-20">
            <Bharatham26Winner 
                winner={winner}
                totalPoints={totalPoints}
                rank={rank}
            />
        </div>
    );
};

export default Winner;