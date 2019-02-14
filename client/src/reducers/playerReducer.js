import { PLAYER } from '../actions/types';
import merge from 'deepmerge';

const initialState = {
  currentTrack: {
    src: 'https://p.scdn.co/mp3-preview/b071542836bc1fe6774de39770cb5ad1f8615cde?cid=774b29d4f13844c495f206cafdad9c86',
    title: 'Bella Ciao',
    albumThumbnail: 'https://i.scdn.co/image/ad0938a0e2198ba39b0ce05361a0f65644ed33f3',
    album: 'Bella Ciao',
    artists: 'Hardwell & Maddix',
    year: '2018',
    trackId: '1geovaCdfs5fSa4NNgFPVe',
    playerType: 'spotify',
    duration: '03:49',
  }
}

export default (state = initialState, action) => {
  switch (action.type){
    case PLAYER.CURRENT_TRACK:
      return {
        ...state,
        currentTrack: {
          ...action.payload,
        }
      };
    case PLAYER.CHANGE_PLAYER_TYPE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
