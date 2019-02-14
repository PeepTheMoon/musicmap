export default {
    spotify: {
        sourceType: 'SPOTIFY',
        sdkUrl:'https://sdk.scdn.co/spotify-player.js',
        authUrl: 'https://accounts.spotify.com/authorize',
        redirectUrl: 'http://localhost:3000/callback/',
        clientId: '7edb89c5bb3646669c4d6b472eba80ac',
        scopes: 'user-read-email user-read-private user-read-birthdate user-modify-playback-state user-read-currently-playing user-read-playback-state streaming'
    }
}
