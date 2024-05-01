import express from "express";
import path from 'path';
const __dirname = path.resolve();
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Destination Vacation server listening on port ${port}`);
});

app.use(express.static('./src/client'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './src/client/index.html'));
});

app.post('/', (req, res) => {
    res.send('Got a POST request: ' + req.body);
});

app.put('/', (req, res) => {
    res.send('Got a PUT request: ' + req.body);
});

app.delete('/', (req, res) => {
    res.send('Got a DELETE request: ' + req.body);
});