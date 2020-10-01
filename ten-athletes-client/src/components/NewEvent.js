import React, { Component } from 'react';
import axios from 'axios';

export default class NewEvent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sports: [],
      users: [],
      sport: "",
      opponent: "",
      sportMatches: [],
      opponentMatches: [],
      sportID: 0,
      opponentID: 0,
      initial: "",
      opponentRating: 0,
      error: "",
      opponentName: "",
      opponentUsername: "",
      teammate: "",
      teammateMatches: [],
      teammates: [],
      teamRating: 0
    }

    this.handleChange = this.handleChange.bind(this);
    this.fillSportName = this.fillSportName.bind(this);
    this.fillOpponent = this.fillOpponent.bind(this);
    this.fillTeammate = this.fillTeammate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findSports = this.findSports.bind(this);
  }

  componentDidMount() {
    const requestSports = axios.get('http://localhost:3001/sports', {withCredentials: true});
    const requestUsers = axios.get('http://localhost:3001/users', {withCredentials: true})
    axios.all([requestSports, requestUsers])
    .then(axios.spread((...responses) => {
      const sports = responses[0].data.sports
      const users = responses[1].data.users
        this.setState({
          sports,
          users
        });
      })
    );
  }

  handleChange(event) {
    let sportMatches = [...this.state.sportMatches]
    let opponentMatches = [...this.state.opponentMatches]
    let teammateMatches = [...this.state.teammateMatches]
    if(event.target.name === 'sport'){
      sportMatches = this.findSports(event.target.value)
    } else if (event.target.name === 'opponent') {
      opponentMatches = this.findOpponent(event.target.value)
    }
    if(event.target.name === 'teammate'){
      teammateMatches = this.findOpponent(event.target.value)
    }
    this.setState({
      [event.target.name]: event.target.value,
      sportMatches,
      opponentMatches,
      teammateMatches
    });
  }

  findSports(sportName){
    let sportMatches = [];
    if(sportName.length >= 3){
      var list = this.state.sports;
      let user = this.props.user
      list.forEach(function(sport,p){
        let addedSport = false;
        let mismatch;
        [...Array((sport.name.length - sportName.length + 1) > 0 ? (sport.name.length - sportName.length + 1) : 0)].forEach((_, i) => {
        //   console.log(i)
        // });

        // for(var i = 0; i < (sport.name.length - sportName.length + 1); i++){
           mismatch = 0;
          [...Array(sportName.length)].forEach((_,j) => {
          // for(var j = 0; j < sportName.length; j++){
            if(sportName[j].toUpperCase() !== sport.name[i+j].toUpperCase()){
              mismatch = mismatch + 1;
            }
          });
          if(mismatch < 2){
            var duplicate = false
            sportMatches.forEach(function(potentialSport){
              if(sport.id === potentialSport.id){
                duplicate = true
              }
            })
            if(!duplicate && sport.id !== 10){
              addedSport = true
              let rating = 0
              sport.participants.forEach((participant) => {
                if(participant.id === user.id){
                  rating = participant.rating
                }
              });

              sportMatches.push({name: sport.name,id: sport.id, participants: sport.participants, listPos: p, rating});
            }
          }
        });
        if(sport.alternate_name && !addedSport){
          [...Array((sport.alternate_name.length - sportName.length + 1) > 0 ? (sport.alternate_name.length - sportName.length + 1) : 0)].forEach((_, i) => {

          // });

          // for( var i = 0; i < (sport.alternate_name.length - sportName.length + 1); i++){
            mismatch = 0;
            [...Array(sportName.length)].forEach((_, j) => {


            // for(var j = 0; j < sportName.length; j++){
              if(sportName[j].toUpperCase() !== sport.alternate_name[i+j].toUpperCase()){
                mismatch = mismatch + 1;
              }
            });
            if(mismatch < 2){
               var duplicate = false
              sportMatches.forEach(function(potentialSport){
                if(sport.id === potentialSport.id){
                  duplicate = true
                }
              })
              if(!duplicate && sport.id !== 10){
                let rating = 0
                sport.participants.forEach((participant) => {
                  if(participant.id === user.id){
                    rating = participant.rating
                  }
                });
                sportMatches.push({name: sport.name,id: sport.id, participants: sport.participants, listPos: p, rating});
              }
            }
          });
        }
        if (sport.id === 10){
          // athleteRating = {name: sport.name, id: sport.id, participants: sport.participants, listPos: p};
        }
      })
    }
    // sportMatches.push(athleteRating)
    return sportMatches;
  }

  fillSportName(event){
  var rating = 0
  var gamesPlayed = -2
  var error = ""
  // console.log(this.props.user)
  this.props.user.sports.forEach((sport) => {
    if(sport.id === parseInt(event.target.attributes[1].value)){
      rating = sport.rating
      gamesPlayed = sport.gamesPlayed
    }
  });

  // if (rating === -42){
  //   error = "You must set an initial rating before you can submit results for this sport"
  // }
  //               sportMatches.push({name: sport.name,id: sport.id, participants: sport.participants, listPos: p, rating});
  let sportMatches = [{
    name: event.target.attributes[2].value,
    id: parseInt(event.target.attributes[1].value),
    participants: this.state.sports[event.target.attributes[3].value].participants,
    listPos: event.target.attributes[3].value,
    rating
  }]
  this.setState({
    sport: event.target.attributes[2].value,
    sportID: parseInt(event.target.attributes[1].value),
    sportPos: event.target.attributes[2].value,
    sportMatches,
    // athleteRatingPos: event.target.attributes[4].value,
    opponentPlaceholder: "Opponent",
    backgroundColor: "white",
    currentUserRating: rating,
    currentUserGamesPlayed: gamesPlayed,
    error: error
  })
}


  findOpponent(opponentSearch){
    let sportSet = this.state.sportID !== 0
    var userID = this.props.user.id
    var opponentMatches = [];
    if(opponentSearch.length >= 3){
      var list = this.state.users;
      // var opponentSearch = this.state.opponent;
      list.forEach(function(opponent){
        let name = `${opponent.firstname} ${opponent.lastname}`
        let mismatch = false
        // [...Array(name.length - opponentSearch.length + 1)].forEach((_, i) => {
        //
        // });
        // [...Array(name.length - opponentSearch.length + 1)].forEach((item, i) => {
        //   console.log('hi')
        // });
        Array.from(Array((name.length-opponentSearch.length + 1) > 0 ? name.length-opponentSearch.length + 1 : 0).keys()).forEach((i) => {
        // });


        // for(var i = 0; i < (name.length - opponentSearch.length + 1); i++){
          mismatch = false;
            [...Array(opponentSearch.length)].forEach((_,j) => {
            if(opponentSearch[j].toUpperCase() !== name[i+j].toUpperCase()){
              mismatch = true;
            }
          });
          if(!mismatch){
            var duplicate = false;
            opponentMatches.forEach(function(potential){
              if(potential.id === opponent.id){
                duplicate = true;
              }
            })
            if(!duplicate && opponent.id !== userID){
              let rating = 0
              if(sportSet) {
                opponent.sports.forEach((sport) => {
                  if(sport.id === sportSet){
                    rating = sport.rating
                  }
                });

              }
              opponentMatches.push({username: opponent.username, name: name, id: opponent.id, sports: opponent.sports, events: opponent.events, rating });
            }
          }
        });
        Array.from(Array((opponent.username.length - opponentSearch.length + 1) > 0 ? opponent.username.length - opponentSearch.length + 1 : 0).keys()).forEach((_, i) => {


        // for(i = 0; i < (opponent.username.length - opponentSearch.length + 1); i++){
          mismatch = false;
          for(var j = 0; j < opponentSearch.length; j++){
            if(opponentSearch[j].toUpperCase() !== opponent.username[i+j].toUpperCase()){
              mismatch = true;
            }
          }
          if(!mismatch){
            var duplicate = false;
            opponentMatches.forEach(function(potential){
              if(potential.id === opponent.id){
                duplicate = true;
              }
            })
            if(!duplicate && opponent.id !== userID){
              let rating = 0
              if(sportSet) {
                opponent.sports.forEach((sport) => {
                  if(sport.id === sportSet){
                    rating = sport.rating
                  }
                });

              }
              opponentMatches.push({username: opponent.username, name: name, id: opponent.id, sports: opponent.sports, events: opponent.events, rating});
            }
          }
        });
      })

    }
    return opponentMatches
  }

  fillOpponent(event){
    // var temp = this.state.sports[this.state.sportPos]
    var opponentRating = 0
    // var athleteRating = this.state.sports[this.state.athleteRatingPos]
    this.state.users.forEach((opponent) => {
      if (opponent.id === event.target.attributes[0].value) {
        opponent.sports.forEach((sport) => {
          if (sport.id === this.state.sportID) {
            opponentRating = sport.rating
          }
        });

      }
    });

    // if (opponentRating === 0){
    //   opponentRating = this.state.currentUserRating
    // }
    // console.log(temp)
    // temp["participants"].forEach((participant, i) => {
    //   if(participant["id"] === event.target.attributes[1].value){
    //     opponentPositionInSport = i
    //   }
    //   if (participant["id"] === this.props.user.id) {
    //     currentUserPositionInSport = i
    //   }
    // });

    // athleteRating["participants"].forEach((participant, i) => {
    //   if(participant["id"] === event.target.attributes[1].value){
    //     opponentPositionInAthlete = i
    //   }
    //   if (participant["id"] === this.props.user.id){
    //     currentUserPositionInAthlete = i
    //   }
    // });

    // console.log(this.calculateAthleteRating(this.state.sports[this.state.athleteRatingPos]["participants"][currentUserPositionInAthlete]["sports"]))
    this.setState({
      opponent: event.target.attributes[1].value,
      opponentID: parseInt(event.target.attributes[0].value),
      opponentRating: opponentRating,
      opponentName: event.target.attributes[1].value,
      opponentUsername: event.target.attributes[2].value,
    });
  }

  fillTeammate(event){
    let teammateRating = 0
    this.state.users.forEach((teammate) => {

      if (teammate.id === parseInt(event.target.attributes[0].value)) {
        teammate.sports.forEach((sport) => {
          if (sport.id === this.state.sportID) {
            teammateRating = sport.rating
          }
        });

      }
    });
    let teammates = [...this.state.teammates]
    teammates.push({name: event.target.attributes[1].value, username: event.target.attributes[2].value, id: event.target.attributes[0].value, rating: teammateRating})
    let teamRating = 0
    let ratedMembers = 0
    teammates.forEach((teammate) => {
      if(teammate.rating !== 0){
        teamRating += teammate.rating
        ratedMembers += 1
      }
    });
    teamRating = teamRating / ratedMembers

    this.setState({
      teammate: "",
      teammates,
      teamRating
    });
  }

//   handleSelectWinner(event){
//   this.setState({
//     [event.target.name]: event.target.value
//   })
// }

ratingChange(player){
  let { sportMatches, opponentMatches, initial, winner, sports, sportID } = this.state
  let currentUserRating = -5
  let opponentRating = -5
  let opponentID
  if(opponentMatches.length > 0){
    opponentID = opponentMatches[0].id
  } else {
    opponentID = this.state.opponentID
  }
  if(sportMatches.length > 0){
    currentUserRating = (sportMatches[0].rating === 0) ? initial : sportMatches[0]
  } else {
    sports.forEach((sport) => {
      if (sport.id === sportID){
        sport.participants.forEach((participant) => {
          if(participant.id === this.props.user.id){
            currentUserRating = participant.rating
          } else if (participant.id === opponentID) {
            opponentRating = participant.rating
          }
        });
        if(currentUserRating === -5){
          currentUserRating = initial
        }

      }
    });

  }
  if(opponentRating === -5){
    opponentRating = currentUserRating
  }
  // let opponentID = (opponentMatches[0] ? opponentMatches[0].id : this.state.opponentID)
  // let opponentRating = currentUserRating
  // sportMatches[0].participants.forEach((participant) => {
  //   if(participant["id"] === opponentID){
  //     opponentRating = participant["rating"]
  //   }
  // });
  console.log(`currentuserrating: ${currentUserRating}`)
  console.log(`opponentRating: ${opponentRating}`)
    var amountChanged = (Math.abs(currentUserRating-opponentRating) / 2) + 1
    if (currentUserRating > opponentRating){
      var higherRated = '1'
    } else {
       higherRated = '2'
    }

    if (higherRated === winner){
      amountChanged = .05 / amountChanged
    } else {
      amountChanged = .05 * amountChanged
    }

    var opponents = []
    var currentOpponent = 0

    if (player === 1) {
      opponents.push(opponentID)
      console.log(this.props.user.events)
      this.props.user.events.forEach((event) => {
        if (event.sport === this.state.sportID){
          if(event.p2ID === this.props.user.id){
            // console.log("I'm player 2")
            currentOpponent = event.p1ID
          } else {
            // console.log("p2 ID")
            // console.log(event.p2ID)
            currentOpponent = event.p2ID
          }
          var duplicateOpponent = false
          if(opponents.length < 5){
            opponents.forEach((opponent) => {
            if (opponent === currentOpponent) {
              duplicateOpponent = true
            }
          });
          if(!duplicateOpponent){
            opponents.push(currentOpponent)
          }
        }

        }
      });

      if(opponents.length < 5){
        amountChanged = amountChanged * (6-opponents.length)
      }

      if (winner === '1') {
        if (parseFloat(currentUserRating) + parseFloat(amountChanged) > 10 && opponents.length < 5){
          return 10
        } else {
          if(parseFloat(currentUserRating) >= 10){
            amountChanged = amountChanged / 2
          } else if (parseFloat(currentUserRating) + parseFloat(amountChanged) > 10) {
            return ((parseFloat(currentUserRating) + parseFloat(amountChanged) - 10) / 2 + 10)
          }
          return parseFloat(currentUserRating) + parseFloat(amountChanged)
        }
      } else {
        if (currentUserRating - amountChanged < 1){
          return 1
        } else if (currentUserRating > 10) {
          if(currentUserRating - (amountChanged / 2) > 10) {
            return currentUserRating - (amountChanged / 2)
          } else {
            var belowTen = 10 - (currentUserRating - (amountChanged / 2))
            return 10 - belowTen * 2
          }
        } else {
          return currentUserRating - amountChanged
        }
      }
    }
    let opponent
    if (player === 2) {
      opponents.push(this.props.user.id)
      this.state.users.forEach((user) => {
        if(user.id === opponentID){
          opponent = user
        }
      });

      opponent.events.forEach((event) => {
        if(event.sport === this.state.sportID){
          if (event.p2ID === this.state.opponentID) {
            currentOpponent = event.p1ID
          } else {
            currentOpponent = event.p2ID
          }
          var duplicateOpponent = false
          if(opponents.length < 5){
            opponents.forEach((opponent) => {
              if(opponent === currentOpponent){
                duplicateOpponent = true
              }
            });
            if(!duplicateOpponent){
              opponents.push(currentOpponent)
            }

          }


        }
      });
      if(opponents.length < 5){
        amountChanged = amountChanged * (6-opponents.length)
      }


      if (winner === '2') {
        if(parseFloat(opponentRating) + amountChanged > 10){
          return 10
        } else{
          if(parseFloat(opponentRating) >= 10){
            amountChanged = amountChanged / 2
          } else if (parseFloat(opponentRating) + parseFloat(amountChanged) > 10) {
            return ((parseFloat(opponentRating) + parseFloat(amountChanged) - 10) / 2 + 10)
          }
        return parseFloat(opponentRating) + amountChanged
        }
      } else {
        if( opponentRating - amountChanged < 1){
          return 1
        }  else if (opponentRating > 10) {
          if(opponentRating - (amountChanged / 2) > 10) {
            return opponentRating - (amountChanged / 2)
          } else {
            belowTen = 10 - (opponentRating - (amountChanged / 2))
            return 10 - belowTen * 2
          }
        }
        else {
          return opponentRating - amountChanged
        }
      }
    }
  }

  addEventsToEventsDatabase(event){
    const { winner } = this.state;
    const addToEventDB = axios.post
    (
      "http://localhost:3001/events",
      {
        sport: parseFloat(event.sport),
        p1ID: this.props.user.id,
        p1InitialRating: event.p1InitialRating,
        p2ID: event.p2ID,
        p2InitialRating: event.p2InitialRating,
        winner: winner
      }, {withCredentials: true}
    )
    return addToEventDB;
  }

  updateCurrentUser(event, player){
    const { winner } = this.state;
    // let rating = this.ratingChange(1)
    let userID
    if(player === 1){
      userID = this.props.user.id
    } else {
      userID = event.p2ID
    }
    let url = "http://localhost:3001/users/" + userID
    // let updatedSport = {
    //   sport: event.sport,
    //   // name: event.sportName,
    //   rating
    // }

    let newEvent = {
      sport: event.sport,
      sportName: event.sportName,
      p1ID: this.props.user.id,
      p1Name: event.p1Name,
      p1Username: event.p1Username,
      p1InitialRating: parseFloat(event.p1InitialRating),
      p2ID: event.p2ID,
      p2Name: event.p2Name,
      p2Username: event.p2Username,
      winner,
      teammateYesNo: 'n'
    }
    let user = {
      username: this.props.user.username
    }
    axios.patch(url, {newEvent, user}, {withCredentials: true})
    .then(response => {
      if(response.data.updated){
        this.props.history.push('/profile', {detail: event.sport, winner})
      }
    })

  }

  handleSubmit(event) {
    event.preventDefault();
    const { opponentMatches, sportMatches, opponentID, sportID, sports, opponentName, opponentUsername } = this.state
    let oppName = opponentName
    let oppUsername = opponentUsername
    if((opponentMatches.length > 0 || opponentID !== 0) && (sportMatches.length > 0 || sportID !== 0)){
      let actualSportID, p1InitialRating, p2ID, p2InitialRating, sportName
      if(opponentMatches.length > 0){
        p2ID = opponentMatches[0].id
        oppName = opponentMatches[0].name
        oppUsername = opponentMatches[0].username
      } else {
        p2ID = opponentID
      }
      if(sportMatches.length > 0){
        actualSportID = sportMatches[0].id
        sportName = sportMatches[0].name
        let ratingSet = false
        let opponentRatingSet = false
        sportMatches[0].participants.forEach((participant) => {
          if(this.props.user.id === participant.id) {
            p1InitialRating = participant.rating
            ratingSet = true
          } else if (p2ID === participant.id) {
            p2InitialRating = participant.rating
            opponentRatingSet = true
          }
        });
        if (!ratingSet) {
          p1InitialRating = this.state.initial
        }
        if (!opponentRatingSet) {
          p2InitialRating = p1InitialRating
        }

      } else {
        actualSportID = sportID
        sports.forEach((game) => {
          if(game.id === sportID) {
            let ratingSet = false
            let opponentRatingSet = false
            game.participants.forEach((participant) => {
              if(participant.id === this.props.user.id) {
                p1InitialRating = participant.rating
                ratingSet = true
              } else if (participant.id === p2ID) {
                p2InitialRating = participant.rating
                opponentRatingSet = true
              }
            });
            if (!ratingSet) {
              p1InitialRating = this.state.initial
            }
            if (!opponentRatingSet) {
              p2InitialRating = p1InitialRating
            }

          }
        });

      }
      if(p1InitialRating === undefined){
        this.setState({error: "You need to set an initial skill level."})
      } else {
        let event =
        {
          sport: actualSportID,
          p1ID: this.props.user.id,
          p1Name: this.props.user.firstname + ' ' + this.props.user.lastname,
          p1Username: this.props.user.username,
          p1InitialRating,
          p2ID,
          p2Name: oppName,
          p2Username: oppUsername,
          p2InitialRating,
          sportName
        }

        this.addEventsToEventsDatabase(event)
        this.updateCurrentUser(event, 1)
      }
    } else {
      this.setState({ error: "You need to select a valid opponent and a valid sport."})
    }
  }

  render() {
    let sportList = []
    let opponentList = []
    let setInitialRating = ""
    let teammateList = []
    let teammateMatchList = []
    // let sportMatches = this.findSports()
    // let opponentMatches = this.findOpponent()
    let initialRating = false
    this.state.sportMatches.forEach((sport) => {
      if(sport.rating !== 0){
        initialRating = true
      }
      sportList.push(
        <li
        className="sportsListItem"
        data-sportid={sport.id}
        style={{listStyle: 'none'}}
        key={`sport${sport.id}`}
        sport={sport.name}
        arrayposition={sport.listPos}>{sport.name} {initialRating ? ` - ${sport.rating.toFixed(2)}` : ''}
        </li>)

    });

    if(this.state.sportMatches.length >= 1 && this.state.sportMatches[0].rating === 0){
      setInitialRating =
      <div>
        <h3>Rate Your {this.state.sportMatches[0].name} Skill Level Between 1 and 10:</h3>
        <input
        type="number"
        name="initial"
        value={this.state.initial}
        onChange={this.handleChange}
        placeholder="Set Skill Level 1-10"
        step='.5'
        min='1.0'
        max="10.00000000000000"
        required
        />
      </div>
    }
    if(this.state.opponentMatches){
    this.state.opponentMatches.forEach((user) => {
      // if(user.id !== this.props.user.id){
        opponentList.push(<li data-opponentid={user.id} style={{listStyle: 'none'}} key={user.id} opponent={user.name} username={user.username}>{user.name} {user.rating === 0 ? '' : `- ${user.rating.toFixed(2)}`}</li>)
      // }
    });
  }

  // )
    this.state.teammateMatches.forEach((match) => {
      teammateMatchList.push(<li data-teammateid={match.id} style={{listStyle: 'none'}} key={`teammateid-${match.id}`} opponent={match.name} username={match.username}>{match.name} {match.rating === 0 ? '' : `- ${match.rating.toFixed(2)}`}</li>)
    });
    teammateMatchList = <ul className="teammateSearchList" key={`teammateSlot${1}`} onClick={this.fillTeammate} > {teammateMatchList} </ul>

    let team = []
    if(this.state.teammates.length > 0){
      this.state.teammates.forEach((teammate, i) => {
        let rating = 0
        teammate.rating !== 0 ? rating = teammate.rating : rating = this.state.teamRating
        team.push(<li key={`teammate#${i}`}>{teammate.name}: {rating}</li>)
      });
      team = <div><h3>Team: Average rating: {this.state.teamRating}</h3>{team}</div>
    }

    return(
    <div>
    <form onSubmit={this.handleSubmit}>
      <br/>
        <u>
        <h2> Report Results </h2>
        </u>
        <br/>
        <h3>Sport</h3>
        <input
          type="name"
          name="sport"
          placeholder="Sport Name"
          value={this.state.sport}
          onChange = {this.handleChange}
          minLength= '3'
          required
        />
        <ul className="sportSearchList" onClick={this.fillSportName}
        >{sportList}</ul>
        {setInitialRating}
        <br/>
        <h3>Teammates</h3>
          <input
            type="text"
            key="teammate"
            name="teammate"
            minLength = '3'
            style={{backgroundColor: this.state.backgroundColor}}
            placeholder="Teammate Name"
            value={this.state.newTeammate}
            onChange = {this.handleChange}
            required
          />
        {teammateMatchList}
        <h3>Opponent</h3>
        <input
          type="text"
          name="opponent"
          minLength = '3'
          style={{backgroundColor: this.state.backgroundColor}}
          placeholder="Opponent Name"
          value={this.state.opponent}
          onChange = {this.handleChange}
          required
        />
        <ul className="opponentSearchList" onClick={this.fillOpponent}
        >{opponentList}</ul>
        <br />
        {team}
          <h3> Who won?</h3>
            <input type="radio" id="I won" name="winner" onClick={this.handleChange} value= '1' /> <b>I won</b>
            <br />
            <input type="radio" id="I lose" name="winner" onClick={this.handleChange} value= '2' /> <b>I lost</b>
            <br /><br />

            {this.state.error}

            <br /><br />

        <button style={{width: '200px', height: '42px', fontSize: 'larger'}} type="submit">Submit</button>

        <br/>
        <br/>
        <br/>
      </form>
    </div>
  )}
}
