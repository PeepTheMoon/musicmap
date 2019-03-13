import { PLAYER } from '../actions/types';

const initialState = {
  currentTrack: {},
  deviceId: undefined,
  isPlaying: false,
  isMuted: false,
  sliderAmount: 0,
  currentTime: '00:00',
  volume: 50,
};

export default (state = initialState, action) => {
  switch (action.type){
    case PLAYER.CURRENT_TRACK:
      return {
        ...state,
        currentTrack: {
          ...action.payload,
        },
        sliderAmount: 0,
        currentTime: '00:00',
      };
    case PLAYER.UPDATE_CURRENT_DEVICE_ID:
      return {
        ...state,
        deviceId: action.payload.deviceId,
      };
    case PLAYER.UPDATE_PLAYER_STATE:
      return {
        ...state,
        ...action.payload,
      }
    case PLAYER.STORE_ALL_TRACKS:
      return {
        ...state,
        tracks: action.payload.tracks,
      }
    case PLAYER.CHANGE_PLAYER_TYPE:
      return {
        ...state,
        playerType: action.payload.playerType,
        player: action.payload.player,
      };
    default:
      return state;
  }
}
