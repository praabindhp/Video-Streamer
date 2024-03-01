const videoPlayer = document.getElementById('videoPlayer');
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user') || 'praabindh';

fetch(`/progress/${userId}`)
    .then(response => response.json())
    .then(data => {
        videoPlayer.currentTime = data.progress;
    });

videoPlayer.ontimeupdate = () => {
    fetch('/progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userId, progress: videoPlayer.currentTime }),
    });
};