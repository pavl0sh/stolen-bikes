import App from './app';
import ExampleController from './controllers/example.controller';
import BikeController from './controllers/bike.controller';

const app = new App([new ExampleController(), new BikeController()]);

app.listen();
