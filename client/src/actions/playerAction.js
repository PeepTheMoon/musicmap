import { PLAYER } from './types';

export const updateCurrentTrack =  (currentTrack, playerType = 'spotify') => dispatch => {
  console.log("Actions : playerActions")
  return dispatch({
    type: PLAYER.CURRENT_TRACK,
    payload: {
      ...currentTrack,
      playerType,
    },
  });
}
