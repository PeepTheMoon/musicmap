import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spotify from './Spotify';

class PlayerContainer extends Component {

  play(){}
  pause(){}
  next(){}
  previous(){}
  volumeUp(){}
  volumeDown(){}
  mute(){}
  unmute(){}

  setPlayerInstance(){} //instantiate playerInstance for given source
  preparePlayerInstance(){} //authorize and token setting
  componentDidMount(){

  }

  render(){
    let player;
    switch(this.props.playerType) {
      case 'spotify':
        player = <Spotify />;
        break;
      default:
        player = <Spotify />;
    };
    return player;
  }
}

const mapStateToProps = (state) => ({
  playerType: state.player.playerType,
});

PlayerContainer.propTypes = {
  playerType: PropTypes.string,
};

export default connect(mapStateToProps)(PlayerContainer);
