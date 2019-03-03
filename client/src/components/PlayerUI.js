import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, IconButton, SvgIcon, Avatar } from '@material-ui/core';
import { rotatein } from 'react-animations';
import classNames from 'classnames';
import { updateCurrentTrack, updatePlayerState } from '../actions/playerAction';


const buttonGradientBackground = 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)';

const styles = theme => ({
  '@keyframes rotatein': rotatein,
  playerContainer: {
    backgroundColor: '#EDECEF',
    height: '60px',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    opacity: 1,
    color: 'black'
  },
  playerTopControlsContainer : {
    padding: '0'
  },
  playerTopControlsLeftContainer : {
    padding: '0',
    width: '90%',
    marginTop: '-5px',
  },
  playerTopControlsRightContainer : {
    padding: '0',
    width: '10%',
    marginTop: '-5px',
  },
  playerBottomControlsContainer : {
    margin: '0 auto',
    padding: '0',
  },
  playerMainContainer: {
    borderTop: '1px solid #C9C9C9',
  },
  ControlsMainContainer: {
    height: '60px',
    flex: 7
  },
  playerAlbumInfoContainer: {
    height: '60px',
    flex: 1
  },
  albumThumbnailContainer: {
    flex: 1,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  playerTrackInfoContainer: {
    width: '100%',
  },
  playerVolumeSlider: {
    width: theme.spacing.unit * 20,
    height: theme.spacing.unit * 8
  },
  playerSeekbarSlider: {
    width: theme.spacing.unit * 50,
  },
  timer: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    fontSize: theme.spacing.unit * 1.8
  },
  volumeItem: {
    width: '15%',
    [theme.breakpoints.down('lg')]: {
      width: '10%',
    },
  },
  albumThumbnail: {
    width: 80,
    height: 80
  },
  albumAnimation: {
    animationName: 'rotatein',
    animationDuration: '0.2s',
  },
  playerTitle: {
    fontWeight: 'bold',
    fontSize: '12px',
    width: '100%',
    textAlign: 'left',
    paddingLeft: '10px',
  },
  playerIcon: {
    fontFamily: 'icomoon',
    fontSize: '12px',
    color: 'black',
  },
  rightPadding: {
    paddingRight: '20px',
  },
  leftPadding: {
    paddingLeft: '20px',
  },
  playerIconActive: {
    fontFamily: 'icomoon',
    fontSize: '12px',
    color: 'green',
  },
  sliderItem: {
    width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '30%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '10%',
    },
  },
});

class PlayerUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      timerId: 0,
    };
  }

  componentWillMount() {
    window.addEventListener('newTrackSelected', (e) => {
      this.formatCurrentTime(0);
      this._handlePause();
      this._handlePlay(e.detail);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('newTrackSelected');
  }

  _handlePlay = (track) => {
    const {
      play,
      isRepeat,
    } = this.props;

    play(track.trackId);

    const timerId = setInterval(() => {
      const { sliderAmount, player, isRepeat } = this.props;
      const { isPlaying } = this.state;

      player.getCurrentState().then((state) => {
        if (state) {
          // state.position in ms
          this.formatCurrentTime(Math.round(state.position / 1000));

          if (isPlaying && state.position === 0 && state.paused) {
            if (isRepeat) {
              this.formatCurrentTime(0);
              this._handlePause();
              this._handlePlay(track);
            } else {
              this._handleNext();
            }
          } else if (isPlaying && state.paused) {
            this._handlePause();
          }
        }
      });
    }, 1000);

    this.setState({
      timerId,
      isPlaying: true,
    })
  }

  _handleNext = () => {
    const { next } = this.props;
    const { isPlaying } = this.state;

    const nextTrack = next();
    this.formatCurrentTime(0);

    if (isPlaying) {
      this._handlePause();
      this._handlePlay(nextTrack);
    }
  }

  _handlePrev = () => {
    const { prev } = this.props;
    const { isPlaying } = this.state;

    const prevTrack = prev();
    this.formatCurrentTime(0);

    if (isPlaying) {
      this._handlePause();
      this._handlePlay(prevTrack);
    }
  }

  _handleShuffle = () => {
    const { toggleShuffle } = this.props;
    toggleShuffle();
  }

  _handleRepeat = () => {
    const { toggleRepeat } = this.props;
    toggleRepeat();
  }

  _handlePause = () => {
    const {
      pause,
    } = this.props;

    pause();

    clearInterval(this.state.timerId);

    this.setState({
      isPlaying: false,
    })
  }

  handleVolumeChange = (e) => {
    const {
      volume,
    } = this.props;

    volume(e.target.value);
  }

  handleSliderChange = (position) => {
    const {
      seek,
    } = this.props;
    const sliderAmount = Number(position);

    seek(sliderAmount);

    this.formatCurrentTime(sliderAmount);
  }

  _handleMuteUnmute = () => {
    const { muteUnmute, isMuted } = this.props;
    muteUnmute();
  }

  formatCurrentTime = (sliderAmount) => {
    const { updatePlayerState } = this.props;
    const currentMinutes = Math.floor(sliderAmount / 60);
    const currentSeconds = sliderAmount % 60;
    const currentTime = this.strPadLeft(currentMinutes,'0', 2) + ':' + this.strPadLeft(currentSeconds,'0', 2);

    updatePlayerState({
      currentTime,
      sliderAmount,
    });
  }

  strPadLeft = (string,pad, length) => {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }

  render() {
    const {
      classes,
      currentTrack,
      currentTime,
      sliderAmount,
      isMuted,
      isShuffle,
      isRepeat,
      volumeAmount: volumePercent,
    } = this.props;

    const {
      isPlaying,
      timerId,
    } = this.state;

    if (!currentTrack.trackId) {
      return null;
    }

    const duration = currentTrack.duration.split(":");
    const totalSeconds = (+duration[0]) * 60 + (+duration[1]);
    const sliderPercent = sliderAmount/totalSeconds * 100.;

    const rangeStyles = StyleSheet.create({
      sliderStyles: {
        backgroundImage: `
          -webkit-gradient(linear, left top, right top, color-stop(${sliderPercent}%, #4F4F4F), color-stop(${sliderPercent}%, #FFFFFF));
          -moz-linear-gradient(left center, #4F4F4F 0%, #4F4F4F ${sliderPercent}%, #FFFFFF ${sliderPercent}%, #FFFFFF 100%)`,
        width: '100%',
      },
      volumeStyles: {
        width: '100%',
        maxWidth: '100px',
        backgroundImage: `
          -webkit-gradient(linear, left top, right top, color-stop(${volumePercent}%, #4F4F4F), color-stop(${volumePercent}%, #FFFFFF));
          -moz-linear-gradient(left center, #4F4F4F 0%, #4F4F4F ${volumePercent}%, #FFFFFF ${volumePercent}%, #FFFFFF 100%)`,
      },
    });

    return (
      <Paper className={classes.playerContainer} elevation={0}>
        <div>
         {/****** main player container *******/}
          <Grid container
            className={classes.playerMainContainer}
            direction='row'
            justify='center'
            alignItems='center'
          >
            <Grid container
              className={classes.playerAlbumInfoContainer}
              justify='center'
              alignItems='center'
            >
              <Grid container
                className={classes.playerTrackInfoContainer}
                direction='column'
                justify='center'
                alignItems='flex-start'
              >
                <div className={classes.playerTitle}>
                  {currentTrack.title} - {currentTrack.artists}
                </div>
              </Grid>
            </Grid>
            <Grid container
              className={classes.ControlsMainContainer}
              direction='column'
              justify='center'
              alignItems='center'
            >
              <Grid container
                className={classes.playerTopControlsContainer}
                justify='center'
                direction='row'
                alignItems='center'
              >
                <Grid container
                  className={classes.playerTopControlsLeftContainer}
                  justify='center'
                  alignItems='center'
                  direction='row'
                >
                  <Grid item>
                    <IconButton aria-label="Previous" >
                      <div onClick={this._handlePrev} className={classNames(classes.playerIcon, 'icon-mm-icon-previous')} />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    {isPlaying ?
                        (
                          <IconButton aria-label="Pause">
                            <div onClick={this._handlePause} className={classNames(classes.playerIcon, 'icon-mm-icon-pause')} />
                          </IconButton>
                        ) : (
                          <IconButton aria-label="Play">
                            <div onClick={() => this._handlePlay(currentTrack)} className={classNames(classes.playerIcon, 'icon-mm-icon-play')} />
                          </IconButton>
                        )
                    }
                  </Grid>
                  <Grid item>
                    <IconButton aria-label="Next" >
                      <div onClick={this._handleNext} className={classNames(classes.playerIcon, classes.rightPadding, 'icon-mm-icon-next')} />
                    </IconButton>
                  </Grid>

                  <Grid item>
                    <p className={classes.timer}>{currentTime} </p>
                  </Grid>
                  <Grid item className={classes.sliderItem}>
                    <input
                      type="range"
                      step={1}
                      max={totalSeconds}
                      value={sliderAmount}
                      onChange={(e) => this.handleSliderChange(e.target.value)}
                      className={css(rangeStyles.sliderStyles)}
                    />
                  </Grid>
                  <Grid item>
                    <p className={classes.timer}> {currentTrack.duration}</p>
                  </Grid>
                  <Grid item>
                    <IconButton aria-label="Loop" >
                      <div
                        onClick={this._handleRepeat}
                        className={classNames(isRepeat ? classes.playerIconActive : classes.playerIcon, classes.leftPadding, 'icon-mm-icon-repeat')}
                      />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton aria-label="Shuffle" >
                      <div
                        onClick={this._handleShuffle}
                        className={classNames(isShuffle ? classes.playerIconActive : classes.playerIcon, 'icon-mm-icon-shuffle')}
                      />
                    </IconButton>
                  </Grid>

                  <Grid item className={classes.volume}>
                    {!isMuted ?
                      (
                        <IconButton aria-label="Mute" >
                          <div onClick={this._handleMuteUnmute} className={classNames(classes.playerIcon, 'icon-mm-icon-volume')} />
                        </IconButton>
                      ) : (
                        <IconButton aria-label="Unmute" >
                          <div onClick={this._handleMuteUnmute} className={classNames(classes.playerIcon, 'icon-mm-icon-mute')} />
                        </IconButton>
                      )
                    }
                  </Grid>
                  <Grid
                    item
                    className={classes.volumeItem}
                  >
                    <input
                      type="range"
                      step={0.01}
                      min={0}
                      max={100}
                      value={volumePercent}
                      onChange={this.handleVolumeChange}
                      className={css(rangeStyles.volumeStyles)}
                    />
                  </Grid>
                </Grid>
                <Grid container
                  className={classes.playerTopControlsRightContainer}
                  justify='flex-end'
                  alignItems='center'
                  direction='row'
                 >
                  <Grid>
                    <IconButton aria-label="More">
                      <div className={classNames(classes.playerIcon, classes.rightPadding, 'icon-mm-icon-hamburger')} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  currentTrack: state.player.currentTrack,
  currentTime: state.player.currentTime,
  sliderAmount: state.player.sliderAmount,
  player: state.player.player,
})

PlayerUI.propTypes = {
  classes: PropTypes.object.isRequired,
  currentTrack: PropTypes.object.isRequired,
  playerType: PropTypes.string,
  play: PropTypes.func,
  player: PropTypes.object,
  pause: PropTypes.func,
  volume: PropTypes.func,
  next: PropTypes.func,
  prev: PropTypes.func,
  toggleShuffle: PropTypes.func,
  toggleRepeat: PropTypes.func,
  muteUnmute: PropTypes.func,
  isPlaying: PropTypes.bool,
  isMuted: PropTypes.bool,
  isShuffle: PropTypes.bool,
  isRepeat: PropTypes.bool,
};

export default withStyles(styles)(connect(mapStateToProps, { updateCurrentTrack, updatePlayerState })(PlayerUI));
