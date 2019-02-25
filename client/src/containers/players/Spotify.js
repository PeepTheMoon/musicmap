import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import SpotifyWebApi from 'spotify-web-api-js';
import Script from 'react-load-script';

import Provider from  '../../providerConfig';
import SpotifyApi from '../../api/spotify';
import Player from '../../components/PlayerUI';
import {
  updateCurrentDevice as updateCurrentDeviceAction,
  updateCurrentPlayer as updateCurrentPlayerAction,
  updatePlayerState as updatePlayerStateAction,
  updateCurrentTrack as updateCurrentTrackAction,
} from '../../actions/playerAction';

let spotify = new SpotifyWebApi();

const spotifyApi = new SpotifyApi();
let player = null;
const styles = {
  root: {
    flexGrow: 1,
  }
};


class Spotify extends Component {

  constructor(props){
    super(props);
    this.state = {
      scriptLoaded: false,
      scriptError: false,
      playerConnected: false,
      spotifyPlayerId: null,
      playerReady: false,
      isPlaying: false,
      isMuted: false,
      isShuffle: false,
      currentTrack: undefined,
    }
  }

  handleScriptCreate() {
    console.log("Loading spotify player...")
    this.setState({ scriptLoaded: false });
    //TODO : display loading cursor
  }

  handleScriptError() {
    console.log("Error occured while loading spotify player..")
    this.setState({ scriptError: true })
    //TODO : display error message
  }

  handleScriptLoad() {
    console.log("Loaded spotify player.")
    this.setState({ scriptLoaded: true })
  }

  loadPlayerScript() {
    console.log("going to load script");
    return (
      <Script
        url= {Provider.spotify.sdkUrl}
        onCreate={this.handleScriptCreate.bind(this)}
        onError={this.handleScriptError.bind(this)}
        onLoad={this.handleScriptLoad.bind(this)}
      />
    );
  }

  connectPlayerToSpotify() {
    const { updateCurrentPlayer } = this.props;

    let token  = spotifyApi.getToken();
    console.log("token : " +  token)

    window.onSpotifyWebPlaybackSDKReady = () => {
      let Spotify = window.Spotify;
      player = new Spotify.Player({
        name: 'Ocean Protocol\'s Music Map',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error("Auth : " + message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log("State change: " + state); });

      // Ready
      player.addListener('ready', ({ device_id: deviceId }) => {
        console.log('Ready with Device ID', deviceId);

        const { updateCurrentDevice, currentTrack } = this.props;
        updateCurrentDevice(deviceId);

        this.setState({
          playerReady: true,
        });
        // this.play(currentTrack.trackId);
      });

      // Not Ready
      player.addListener('not_ready', ({ deviceId }) => {
        console.log('Device ID has gone offline', deviceId);
        this.setState({
          playerReady: false
        });
      });

      // Connect to the player!
      player.connect()
        .then(success => {
          if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!');
            this.setState({
              playerConnected: true,
              spotifyPlayerId: player['_options'].id
            });
          }
        });

      updateCurrentPlayer('spotify', player);
    };
  }

  play = (trackId) => {
    const {
      deviceId,
      volume,
    } = this.props;

    console.log(`Playing on device: ${deviceId}`);
    player.setVolume(volume / 100.).then(() => {
      console.log('Volume updated to ' + volume);
    });
    spotifyApi.fetchTrack(deviceId, trackId);
  }

  resume() {
    player.resume().then(() => {
      console.log('Resumed!');
    });
  }

  pause() {
    player.pause().then(() => {
      console.log('Paused!');
    });
  }

  seek(position) {
    player.seek(position * 1000).then(() => {
      console.log('Changed position to ' + position + ' seconds');
    });
  }

  volume = (volume) => {
    const { updatePlayerState } = this.props;
    updatePlayerState({
      volume,
    });
    player.setVolume(volume / 100.).then(() => {
      console.log('Volume updated to ' + volume);
    });
  }

  next = () => {
    const { tracks, currentTrack, updateCurrentTrack } = this.props;
    const { isShuffle } = this.state;

    const currentTrackIndex = tracks.findIndex((track) => (
      track.trackId === currentTrack.trackId
    ));

    const nextTrackIndex = isShuffle ?
      this.selectRandomIndex(currentTrackIndex) :
      (currentTrackIndex + 1) % tracks.length;

    updateCurrentTrack(tracks[nextTrackIndex]);

    return tracks[nextTrackIndex];
  }

  prev = () => {
    const { tracks, currentTrack, updateCurrentTrack } = this.props;
    const { isShuffle } = this.state;

    const currentTrackIndex = tracks.findIndex((track) => (
      track.trackId === currentTrack.trackId
    ));

    const prevTrackIndex = isShuffle ?
      this.selectRandomIndex(currentTrackIndex) : currentTrackIndex === 0 ?
      tracks.length - 1 : (currentTrackIndex - 1);

    updateCurrentTrack(tracks[prevTrackIndex]);

    return tracks[prevTrackIndex];
  }

  selectRandomIndex = (currentTrackIndex) => {
    const { tracks } = this.props;

    let nextIndex;
    if (tracks.length > 2) {
      let randomIndex = Math.round(Math.random()*tracks.length - 1);

      while (randomIndex === currentTrackIndex) {
        randomIndex = Math.round(Math.random() * (tracks.length - 1));
      }

      nextIndex = randomIndex;
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    return nextIndex;
  }

  toggleShuffle = () => {
    const { isShuffle } = this.state;
    this.setState({
      isShuffle: !isShuffle,
    });
  }

  muteUnmute = () => {
    const { isMuted } = this.state;
    const { volume } = this.props;
    if (isMuted) {
      player.setVolume(volume / 100.).then(() => {
        console.log('Mute turned off and volume reset to: ' + volume);
      })
    } else {
      player.setVolume(0).then(() => {
        console.log('Player was muted');
      });
    }
    this.setState({
      isMuted: !isMuted,
    });
  }

  componentWillMount() {
    console.log("Will mount")
    //check if user has denied access to Spotify
    if(!window.location.href.includes('?error=access_denied')){

      //check if we have valid token
      if(!spotifyApi.isTokenValid()){
        console.log("invalid token")
        spotifyApi.removeToken();
        spotifyApi.removeTokenExpiry();
        spotifyApi.redirectToSpotify();
      }
      //check if user has authenticated with Spotify
      if(window.location.href.includes('#access_token')){
        spotifyApi.storeTokenAndExpiry();
      }
      //connect to spotify web playback sdk
      if(!this.state.playerConnected){
        this.connectPlayerToSpotify();
      }
    } else {
      console.log("Access Denied by User");
    }
  }

  componentWillUnmount(){
    player.disconnect().then(() => {
      console.log("Player Disconnected..");
    })
  }

  render() {
    const {
      classes,
    } = this.props;

    return (
      <div className={classes.root}>
        {this.state.playerConnected ?  this.loadPlayerScript(): null}
        {this.state.scriptLoaded ? null : <LinearProgress />}
        <Player
          playerType='spotify'
          play={this.play}
          pause={this.pause}
          seek={this.seek}
          next={this.next}
          prev={this.prev}
          volume={this.volume}
          toggleShuffle={this.toggleShuffle}
          muteUnmute={this.muteUnmute}
          isPlaying={this.state.isPlaying}
          isMuted={this.state.isMuted}
          isShuffle={this.state.isShuffle}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentTrack: state.player.currentTrack,
  tracks: state.player.tracks,
  playerType: state.player.playerType,
  player: state.player.player,
  deviceId: state.player.deviceId,
  volume: state.player.volume,
});

const mapDispatchToProps = {
  updateCurrentDevice: updateCurrentDeviceAction,
  updateCurrentPlayer: updateCurrentPlayerAction,
  updatePlayerState: updatePlayerStateAction,
  updateCurrentTrack: updateCurrentTrackAction,
};

Spotify.propTypes = {
  classes: PropTypes.object.isRequired,
  currentTrack: PropTypes.object,
  tracks: PropTypes.arrayOf(PropTypes.object),
  updateCurrentDevice: PropTypes.func,
  updateCurrentPlayer: PropTypes.func,
  updatePlayerState: PropTypes.func,
  playerType: PropTypes.string,
  player: PropTypes.object,
  deviceId: PropTypes.string,
  volume: PropTypes.number,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Spotify));


