import App from './app';
import ExampleController from './controllers/example.controller';

const app = new App([new ExampleController()]);

app.listen();
