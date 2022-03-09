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
      state: { productStatus: [] },
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

  render() {
    this.target.innerHTML = `
      <header class="banner">
        <h1 class="banner__title">자판기</h1>
        <ul class="banner__control">
          <li>
            <button type="button" id="product-purchase-menu" data-href="/manage">상품 관리</button>
          </li>
          <li>
            <button type="button" id="vending-machine-manage-menu" data-href="/recharge">잔돈 충전</button>
          </li>
          <li>
            <button type="button" id="product-add-menu" data-href="/purchase">상품 구매</button>
          </li>
        </ul>
      </header>
      <main class="main"></main>
      <footer class="footer"></footer>
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
