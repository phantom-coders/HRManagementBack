const { port } = require('./utils/config.Env');
const app = require('./app');

app.listen(port, console.log(`port connected ${port}`));
