import Express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as controller from './controller.js';
import cors from "cors";

dotenv.config();
const app = Express();
const port = 5000;

app.use(cors({
    origin: '*'
}));

mongoose
	.connect(process.env.MONGODB, { useFindAndModify: false })
	.then(() => {
		app.get('/search', controller.index);
		app.listen(port, () => console.log('Listening on port ' + port));
});