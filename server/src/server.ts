import App from './app';
import BikeController from './controllers/bike.controller';
import PoliceController from './controllers/police.controller';

const app = new App([new BikeController(), new PoliceController()]);

app.listen();
