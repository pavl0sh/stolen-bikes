import App from './app';
import ExampleController from './controllers/example.controller';
import BikeController from './controllers/bike.controller';
import PoliceController from './controllers/police.controller';

const app = new App([new ExampleController(), new BikeController(), new PoliceController()]);

app.listen();
