import Express from 'express';
import * as controller from './controller.js';

const app = Express();
const port = 4000;

app.get('/', controller.index);

app.listen(port, () => console.log('Listening on port ' + port));
