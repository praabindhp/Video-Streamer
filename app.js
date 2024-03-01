const express = require('express');
const fs = require('fs');
require ('dotenv').config();
const app = express();
const port = process.env.PORT;

app.get('/video', (req, res) => {
    // Get video path from request or stored location
    const videoPath = "./videos/anime.mp4";

    // Check if video exists
    if (!fs.existsSync(videoPath)) {
        res.status(404).send('Video 🎬 Not Available');
        return;
    }

    // Get video stats
    const videoStat = fs.statSync(videoPath);
    const videoSize = videoStat.size;

    // Check for range header for partial requests
    const range = req.headers.range;
    let start = 0;
    let end = videoSize - 1;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        start = parseInt(parts[0], 10);
        end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    }

    // Set content headers
    res.set({
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    });

    // Stream video content in chunks
    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);

    // Handle errors during streaming
    stream.on('error', (err) => {
        res.status(500).send('Error Streaming 🎥 Video');
    });
});

app.listen(port, () => {
    console.log(`Praabindh's Server ⚓ Running On Port ${port}`);
});
