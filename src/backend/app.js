const app = require('express')();
const axios = require("axios");
const bodyParser = require('body-parser');
const railRoad = require('./RailRoadPattern/railRoad')

app.use(bodyParser.json());

app.post('/account/details', (req, res) => {
    
})

railRoad();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`App is running on port ${port}!`));