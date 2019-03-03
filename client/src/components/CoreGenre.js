import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PlayerContainer from '../containers/players/PlayerContainer';
import AddNewTrack from './AddNewTrack';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Grid,
  Button,
  Icon,
  Chip,
  AppBar,
  Switch,
  Snackbar,
  Divider,
} from '@material-ui/core';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import LongMenu from './LongMenu';
import {
  updateCurrentTrack as updateCurrentTrackAction,
  updatePlayerState as updatePlayerStateAction,
  storeAllTracks as storeAllTracksAction,
} from '../actions/playerAction';
import SpotifyApi from '../api/spotify';

const token = 'BQCEgGDO5KKUuD6BvfR1vQdASUPFHOx0AIFHjrra0Jr5PnY1mZ2gBsdWFPFi49iXsgYcPxQSeUODTyMTEQhDmHa9-xKl5sneO2thYO-Ich0RWWucIboeE8Jp2e-2pFpFT9MQPKZmKjKdzpiCNnkWWbUG3P5w43-6LKZVf6pqvyT3qB2k1TUtfeEX';
const buttonGradientBackground = 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)';

const styles = theme => ({
  subGenreContainer: {
    marginTop: theme.spacing.unit,
    width: '100%',
    overflowX: 'auto'
  },
  headerAppBar: {
    height: '220px',
    background: 'linear-gradient(#FFFFFF, #D3D3D3)',
  },
  genreTitle: {
    fontSize: '36px',
  },
  headerGridContainer: {
    height: '100%',
    width: '80%',
    margin: 'auto',
  },
  headerContainer: {
    ...theme.mixins.gutters(),
    padding: '0 !important',
    margin: '0 auto',
    width: 'parent',
  },
  headerDivider: {
    color: 'white',
    width: '80%',
    margin: 'auto',
    backgroundColor: 'white',
  },
  playlistTable: {
    minWidth: 700,
    width: '100%',
    margin: 'auto',
  },
  playButton: {
    width: '200px',
    background: 'linear-gradient(#A9A9A9, #C9C9C9, #A9A9A9)',
    color: '#FFF',
    padding: 0,
  },
  playButtonContainer: {
    width: '80%',
    margin: '15px auto',
    textAlign: 'right',
  },
  titleGrid: {
    width: '33.3%',
  },
  genreGrid: {
    width: '33.3%',
    textAlign: 'center',
    fontSize: '40px',
  },
  playGrid: {
    width: '33.3%',
    textAlign: 'right',
    fontSize: '14px',
  },
  icon: {
    marginLeft: theme.spacing.unit,
    color: '#A0A0A0',
    '&:hover': {
      color: green[200],
      cursor: 'pointer',
      transform: 'scale(1.5)'
    }
  },
  plusIcon: {
    fontSize: '30px',
    marginLeft: '-20px',
    marginRight: '20px',
    lineHeight: '1',
  },
  itemRow: {
    height: '40px',
  },
  statusChip: {
  },
  actionButton: {
    marginLeft: theme.spacing.unit,
    textTransform: 'capitalize',
    borderRadius: theme.spacing.unit,
    minWidth: theme.spacing.unit * 10,
  },
  playlistHeader: {
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    backgroundColor: '#F0F0F0',
    height: '30px',
  },
  playlistHeaderCell: {
    borderBottom: 'none',
    fontWeight: 'bold',
    color: 'black',
    padding: '0',
  },
  genreMetadata : {
    marginTop: theme.spacing.unit
  },
  playlistBody: {
    marginTop: '20px',
    width: '100%',
  },
  emptyCell: {
    width: '10%',
    borderBottom: 'none',
    padding: '0',
    height: '40px',
  },
  genreScore: {
    fontSize: '14px',
    lineHeight: 2,
    display: 'table-cell',
  },
  headerIcon: {
    color: '#A0A0A0',
    verticalAlign: 'middle',
    paddingRight: '20px',
    paddingLeft: '10px',
    display: 'table-cell !important',
  },
  songInfo: {
    fontSize: '10px',
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  circle: {
    borderRadius: '25px',
  },
  durationTime: {
    display: 'inline-block',
    width: '95%',
  },
  menuIcon: {
    display: 'inline-block',
    height: '40px',
    width: '5%',
  },
  trackCell: {
    padding: '0',
    height: '40px',
  },
});

const TRACK_OPTIONS = [
  // Add options for hamburger menu here
];

class CoreGenre extends Component {

  constructor(props){
    super(props);
    this.state = {
      genre: 'EURODISCO',
      tags: [
        'Italo-Disco',
        'Hi-NRG',
        'Spacedisco',
        'Eurobeat',
      ],
      genreScore: '11.478',
      tracks: [],
      totalDuration: '',
      showNotification: false,
      showPlayer: false,
      showNewTrackForm: false,
      currentTrack: {
        src: 'https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb8817b6f2d041f15eb1?cid=774b29d4f13844c495f206cafdad9c86',
        title: 'Cut To The Feeling',
        albumThumbnail: 'https://i.scdn.co/image/966ade7a8c43b72faa53822b74a899c675aaafee',
        album: 'Cut To The Feeling',
        artist: 'Carly Rae Jepsen',
        year: '2017',
        trackId: {
          spotify: '6EJiVf7U0p1BBfs0qqeb1f'
        }
      }
    }
  }

  async fetchAllTracks(){
    const { storeAllTracks } = this.props;

    fetch(`http://localhost:4000/tracks`)
    .then(resp => resp.json())
    .then(data => {
      const tracks =
        data.tracks.map(item => {
          return {
            trackId: item.trackId,
            album: item.album,
            title: item.title,
            year: item.year,
            artists: item.artists,
            duration: item.duration
          }
        });
      storeAllTracks(tracks);

      this.setState({
        totalDuration: this.calculateTotalDuration(data.tracks)
      });
    });
  }

  /**
   * @param {track object} track
   */
  playTrack = (track) => {
    const { playerType, updateCurrentTrack } = this.props;

    switch (playerType) {
      case 'spotify':
        this.playItOnSpotify(track);
        break;
      default:
        this.playItOnSpotify(track);
    };

    updateCurrentTrack(track);
  }

  playItOnSpotify = (track) => {
    const { player, deviceId, updatePlayerState } = this.props;

    let accessToken = localStorage.getItem('mm_spotify_access_token');
    if (accessToken) {
      this.setState({
        currentTrack: track,
        showPlayer: true,
      });

      if (player) {
        // OPTIONAL: Allow for play right after clicking new track
        // const spotifyApi = new SpotifyApi();

        // spotifyApi.fetchTrack(deviceId, track.trackId);
        // updatePlayerState({
        //   isPlaying: true,
        // });
      }
    } else {
      console.log("going to get new token from spotify")
      this.getSpotifyAccessToken();
    }
  }

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      console.log(e);
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getSpotifyAccessToken(){
    let clientId = '7edb89c5bb3646669c4d6b472eba80ac';
    let scopes = 'user-read-email';
    let redirect_uri = "http://localhost:3000/callback/";
    let url = 'https://accounts.spotify.com/authorize' +
    '?response_type=token' +
    '&client_id=' + clientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri);
    window.location = url;
  }

  calculateTotalDuration(songs){
    let durations = songs.map(song => song.duration);
    let totalDuration = 0;
    durations.forEach(duration => {
       let timings = duration.split(":");
       totalDuration += (parseInt(timings[0]) * 60) +  parseInt(timings[1]);
    });

    //convert seconds into hours and minutes and seconds
    return new Date(totalDuration * 1000).toISOString().substr(11, 8);

  }
  handleActionOpen(e){
    e.preventDefault();
    this.setState({
      showNotification: true
    });
    console.log(e.target.text);
  }

  handleActionClose(){
    this.setState({
      showNotification: false
    });
  }

  addNewTrack(){
    this.setState({
      showNewTrackForm: true
    });
  }

  async componentDidMount(){
    if(!localStorage.getItem('mm_spotify_access_token')
       && window.location.href.includes('#access_token')) {

      //store access token in localStorage
      let params = this.getHashParams();
      localStorage.setItem('mm_spotify_access_token', params.access_token);
      console.log("access token : " + localStorage.getItem('mm_spotify_access_token'));

    }
    else {
      console.log("stored access token : " + localStorage.getItem('mm_spotify_access_token'));
    }

    await this.fetchAllTracks();
  }

  renderTracks() {
    const { classes, tracks: loadedTracks } = this.props;

    const tracks = loadedTracks || [];
    if(tracks.length > 0){
      return (
        <Table className={classes.playlistTable}>
          <TableHead>
            <TableRow className={classes.playlistHeader}>
              <TableCell className={classes.emptyCell}>&nbsp;</TableCell>
              <TableCell className={classes.playlistHeaderCell}></TableCell>
              <TableCell className={classes.playlistHeaderCell}>Title</TableCell>
              <TableCell className={classes.playlistHeaderCell}>Artist</TableCell>
              <TableCell className={classes.playlistHeaderCell}>Album</TableCell>
              <TableCell className={classes.playlistHeaderCell}>Year</TableCell>
              <TableCell className={classes.playlistHeaderCell}>Duration</TableCell>
              <TableCell className={classes.emptyCell}>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.playlistBody}>
          {tracks.map(track => {
            return (
            <TableRow className={classes.itemRow} key={track.trackId}>
              <TableCell className={classes.emptyCell}>&nbsp;</TableCell>
              <TableCell className={classes.trackCell}> <Icon onClick={() => this.playTrack(track)} className={classNames(classes.icon, 'fa fa-play-circle fa-2x')} /></TableCell>
              <TableCell className={classes.trackCell}>{track.title}</TableCell>
              <TableCell className={classes.trackCell}>{track.artists}</TableCell>
              <TableCell className={classes.trackCell}>{track.album}</TableCell>
              <TableCell className={classes.trackCell}>{track.year}</TableCell>
              <TableCell className={classes.trackCell} style={{ width: '5%' }}>
                <div className={classes.durationTime}>
                  {track.duration}
                  <div className={classes.menuIcon}>
                    <LongMenu options={TRACK_OPTIONS} />
                  </div>
                </div>
              </TableCell>
              <TableCell className={classes.emptyCell}>&nbsp;</TableCell>
            </TableRow>
            );
          })}
          </TableBody>
        </Table>
      )
    }
    else {
      return (
        <h5>No Tracks in this Genre. Why don't you add some!</h5>
      )
    }
  }
  render(){
    const { classes, playerType } = this.props;

    return (
      <>
      <div className={classes.subGenreContainer}>
        <Paper className={classes.headerContainer} elevation={1} square={true}>
          <AppBar className={classes.headerAppBar} position="sticky" color="inherit" elevation={0}>
            <Grid container
              alignContent='center'
              alignItems='center'
              direction='row'
              justify='space-evenly'
              className={classes.headerGridContainer}>
              <Grid item className={classes.titleGrid}>
                <div>
                  <Icon className={classNames(classes.headerIcon, classes.circle, 'fa fa-caret-square-left')} />
                  <div className={classes.genreScore}>Genre score: {this.state.genreScore}</div>
                </div>
                <div className={classes.genreMetadata}>
                  <Icon className={classNames(classes.headerIcon, 'fa fa-sign-out-alt')} />
                  <div className={classes.songInfo}>
                    <div>Number of songs: {this.state.tracks.length}</div>
                    <div>Duration: {this.state.totalDuration}</div>
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.genreGrid}>
                <div className={classes.genreTitle}>
                  {this.state.genre}
                </div>
              </Grid>
              <Grid item className={classes.playGrid}>
                {this.state.tags.join(', ')}
              </Grid>
            </Grid>
            <Divider className={classes.headerDivider} variant="middle" />
            <div className={classes.playButtonContainer}>
              <Button onClick={this.addNewTrack.bind(this)} variant="contained" className={classes.playButton}>
                <div className={classes.plusIcon}>+</div> Add Track
              </Button>
            </div>
          </AppBar>
          {this.renderTracks()}
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={this.state.showNotification}
            autoHideDuration={2000}
            onClose={this.handleActionClose.bind(this)}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Action registered successfully</span>} />
        </Paper>
      </div>
      {(this.state.showPlayer || window.location.href.includes("callback/")) ? (
          <PlayerContainer playerType="spotify" />
        ) : null}
      <AddNewTrack show={this.state.showNewTrackForm} />
    </>
    );
  }

}

const mapStateToProps = (state) => ({
  playerType: state.player.playerType,
  tracks: state.player.tracks,
  player: state.player.player,
  deviceId: state.player.deviceId,
});

const mapDispatchToProps = {
  updateCurrentTrack: updateCurrentTrackAction,
  storeAllTracks: storeAllTracksAction,
  updatePlayerState: updatePlayerStateAction,
};

CoreGenre.propTypes = {
  classes: PropTypes.object.isRequired,
  tracks: PropTypes.arrayOf(PropTypes.object),
  updateCurrentTrack: PropTypes.func,
  updatePlayerState: PropTypes.func,
  storeAllTracks: PropTypes.func,
  playerType: PropTypes.string,
  player: PropTypes.object,
  deviceId: PropTypes.string,
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CoreGenre));
