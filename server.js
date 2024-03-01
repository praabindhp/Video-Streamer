const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
require('dotenv').config();

app.get('/video', function (req, res) {
    const path = './videos/anime.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

let videoProgress = {};
app.post('/progress', function (req, res) {
    videoProgress[req.body.user] = req.body.progress;
    res.sendStatus(200);
});

app.get('/progress/:user', function (req, res) {
    res.json({ progress: videoProgress[req.params.user] || 0 });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Praabindh's Server ⚓ Is Running On Port ~ ${port}`)
});