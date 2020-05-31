const app = require('express')();
const bodyParser = require('body-parser');

const rr = require('./RailRoadPattern/railRoad');
const ds = require('./DoubleShadows/doubleShadows');

app.use(bodyParser.json());

rr.railRoad();
ds.doubleShadows();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`App is running on port ${port}!`));