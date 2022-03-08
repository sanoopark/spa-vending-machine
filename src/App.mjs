import Component from './core/Component.mjs';
import Management from './pages/Management.mjs';
import { browserRoute, redirect, route } from './router.mjs';

export default class App extends Component {
  constructor(props) {
    super(props);

    browserRoute(this.routes);
    this.routes();
  }

  routes() {
    const mainElement = this.target.querySelector('.main');

    route({
      path: [/^\/?$/i, /^\/manage\/?$/i],
      component: Management,
      target: mainElement,
      initialState: { data: [] },
    });
  }

  setEvent() {
    this.addEvent({
      eventType: 'click',
      selector: '.banner__control',
      callback: this.handleButtonClick,
    });
  }

  handleButtonClick(e) {
    const { href } = e.target.dataset;
    redirect(href);
  }
}
