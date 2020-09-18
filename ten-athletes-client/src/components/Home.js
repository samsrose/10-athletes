import React from 'react';

import NewEvent from './NewEvent'

const Home = (props) => {

  if(props.loggedInStatus){
    return(
      <div style={{textAlign: 'center'}} >
        <h2 className="welcome">Welcome to 10 Athletes {props.user.username}</h2>
        <NewEvent history={props.history} user={props.user}/>
      </div>
    )
  } else {
    props.history.push('/rankings')
    return(
      <div>
      </div>
    )
  }
};

export default Home;
