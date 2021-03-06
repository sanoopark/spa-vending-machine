import Component from './core/Component.mjs';
import Manager from './pages/Manager.mjs';
import Recharger from './pages/Recharger.mjs';
import Seller from './pages/Seller.mjs';
import { browserRoute, redirect, route } from './router.mjs';
import { COIN_STATUS } from './constants.mjs';

export default class App extends Component {
  constructor(props) {
    super(props);
    browserRoute(this.routes);
    this.routes();
  }

  routes() {
    const mainElement = document.querySelector('.main');

    route({
      path: ['/', '/manage'],
      component: Manager,
      target: mainElement,
      state: { productStatus: [{ name: '๐ฅค ์ฝ์นด์ฝ๋ผ', price: 2000, quantity: 20 }] },
    });

    route({
      path: '/recharge',
      component: Recharger,
      target: mainElement,
      state: {
        holdingCoinAmount: 0,
        holdingCoinStatus: COIN_STATUS,
      },
    });

    route({
      path: '/purchase',
      component: Seller,
      target: mainElement,
      state: {
        productStatus: [],
        holdingCoinStatus: COIN_STATUS,
        holdingCoinAmount: 0,
        returnCoinStatus: COIN_STATUS,
        returnAmount: 0,
        chargeAmount: 0,
      },
    });
  }

  render() {
    this.target.innerHTML = `
      <header class="banner">
        <h1 class="banner__title">CocaCola</h1>
        <ul class="banner__control">
          <li>
            <button type="button" id="product-purchase-menu" data-href="/manage">์ํ ๊ด๋ฆฌ</button>
          </li>
          <li>
            <button type="button" id="vending-machine-manage-menu" data-href="/recharge">์๋ ์ถฉ์ </button>
          </li>
          <li>
            <button type="button" id="product-add-menu" data-href="/purchase">์ํ ๊ตฌ๋งค</button>
          </li>
        </ul>
      </header>
      <main class="main"></main>
    `;
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
