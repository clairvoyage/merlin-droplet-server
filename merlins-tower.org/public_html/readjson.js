const express = require('express');
const app = express();

app.use(express.json());
app.post("/api/static", (req, res) => {
    console.log(JSON.stringify(req.body));          // this would be the data sent with the request
    console.log("received static data");
});

app.listen(3002, () => {
    console.log('Express server running at http://localhost:3002');
});

