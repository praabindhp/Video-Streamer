const videoPlayer = document.getElementById('videoPlayer');

// Load video source from server
videoPlayer.src = '/video';

// Store and retrieve playback progress using localStorage
let storedProgress = localStorage.getItem('videoProgress') || 0;

// Seek to stored progress on video load
videoPlayer.currentTime = storedProgress;

// Update stored progress on seeking or ended event
videoPlayer.addEventListener('seeking', () => {
    localStorage.setItem('videoProgress', videoPlayer.currentTime);
});

videoPlayer.addEventListener('ended', () => {
    localStorage.removeItem('videoProgress');
});
