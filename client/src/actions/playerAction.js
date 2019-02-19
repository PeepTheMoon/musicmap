import { PLAYER } from './types';

export const updateCurrentTrack = (currentTrack) => dispatch => {
  return dispatch({
    type: PLAYER.CURRENT_TRACK,
    payload: {
      ...currentTrack,
    },
  });
};

export const storeAllTracks = (tracks) => dispatch => {
  return dispatch({
    type: PLAYER.STORE_ALL_TRACKS,
    payload: {
      tracks,
    },
  })
}

export const updateCurrentPlayer = (playerType) => dispatch => {
  return dispatch({
    type: PLAYER.CHANGE_PLAYER_TYPE,
    payload: {
      playerType,
    },
  });
};
