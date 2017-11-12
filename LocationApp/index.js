var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

const PORT = 3001;
app.listen(PORT, () => {
    console.log('api run on port: ' + PORT);
});