import Component from './core/Component.mjs';
import Manager from './pages/Manager.mjs';
import Recharger from './pages/Recharger.mjs';
import Seller from './pages/Seller.mjs';
import { browserRoute, redirect, route } from './router.mjs';

export default class App extends Component {
  constructor(props) {
    super(props);

    browserRoute(this.routes);
    this.routes();
  }

  routes() {
    const mainElement = document.querySelector('.main');

    route({
      path: [/^\/?$/i, /^\/manage\/?$/i],
      component: Manager,
      target: mainElement,
      state: { data: [] },
    });

    route({
      path: [/^\/recharge\/?$/i],
      component: Recharger,
      target: mainElement,
      state: {
        amount: 0,
        counts: {
          500: 0,
          100: 0,
          50: 0,
          10: 0,
        },
      },
    });

    route({
      path: [/^\/purchase\/?$/i],
      component: Seller,
      target: mainElement,
      state: {
        productStatus: [],
        holdingCoinStatus: {
          500: 0,
          100: 0,
          50: 0,
          10: 0,
        },
        holdingCoinAmount: 0,
        returnCoinStatus: {
          500: 0,
          100: 0,
          50: 0,
          10: 0,
        },
        returnAmount: 0,
        chargeAmount: 0,
      },
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
