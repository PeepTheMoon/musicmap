import { PLAYER } from './types';

export const updateCurrentTrack = (currentTrack) => dispatch => {
  return dispatch({
    type: PLAYER.CURRENT_TRACK,
    payload: {
      ...currentTrack,
    },
  });
};

export const updateCurrentDevice = (deviceId) => dispatch => {
  return dispatch({
    type: PLAYER.UPDATE_CURRENT_DEVICE_ID,
    payload: {
      deviceId,
    },
  });
}

export const storeAllTracks = (tracks) => dispatch => {
  return dispatch({
    type: PLAYER.STORE_ALL_TRACKS,
    payload: {
      tracks,
    },
  })
}

export const updatePlayerState = (playerState) => dispatch => {
  return dispatch({
    type: PLAYER.UPDATE_PLAYER_STATE,
    payload: playerState,
  })
}

export const updateCurrentPlayer = (playerType, player) => dispatch => {
  return dispatch({
    type: PLAYER.CHANGE_PLAYER_TYPE,
    payload: {
      playerType,
      player,
    },
  });
};
