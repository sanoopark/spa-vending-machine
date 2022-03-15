import { MESSAGE } from '../constants.mjs';
import Component from '../core/Component.mjs';
import { localStorage } from '../storage.mjs';

export default class Seller extends Component {
  mounted() {
    this.synchronizeStateWithStorage();
  }

  synchronizeStateWithStorage() {
    const { productStatus, holdingCoinStatus, holdingCoinAmount, returnCoinStatus, chargeAmount } = this.state;

    this.setState({
      productStatus: localStorage.get('product-status') || productStatus,
      chargeAmount: localStorage.get('charge-amount') || chargeAmount,
      returnAmount: localStorage.get('return-amount') || chargeAmount,
      holdingCoinAmount: localStorage.get('holding-coin-amount') || holdingCoinAmount,
      holdingCoinStatus: localStorage.get('holding-coin-status') || holdingCoinStatus,
      returnCoinStatus: localStorage.get('return-coin-status') || returnCoinStatus,
    });
  }

  render() {
    const { returnCoinStatus, chargeAmount, productStatus } = this.state;

    this.target.innerHTML = `
      <h2>금액 투입</h2>
      <section class="control-layout">
        <label for="charge-input" hidden>투입 금액</label>
        <input type="number" id="charge-input" min="0" placeholder="금액" />
        <button type="button" id="charge-button">투입하기</button>
        <div id="charge-amount">투입 금액 : ${chargeAmount}원</div>
      </section>
      <h2>상품 목록</h2>
      <section class="purchase-table-content">
        ${productStatus
          .map(
            (product, index) => `
              <div class="product-purchase-item">
                ${
                  product &&
                  Object.entries(product)
                    .map(
                      ([key, value]) => `
                        <span class="product-purchase-${key}" data-row="${index}" data-product-${key}="${value}">${value}</span>`
                    )
                    .join('')
                }
                <span>
                  <button type="button" class="purchase-button" data-row="${index}" ${this.checkDisabled(product)}>
                    구매하기</button>
                </span>
              </div>
            `
          )
          .join('')}
      </section>
      <button type="button" id="coin-return-button">반환하기</button>
      <div class="modal-overlay">
        <section class="coin-status-table modal">
          <div>
            <span>🏆 500원 : </span>
            <span id="coin-500-quantity">${returnCoinStatus[500]}개</span>
          </div>
          <div>
            <span>🥇 100원 : </span>
            <span id="coin-100-quantity">${returnCoinStatus[100]}개</span>
          </div>
          <div>
            <span>🥈 50원 : </span>
            <span id="coin-50-quantity">${returnCoinStatus[50]}개</span>
          </div>
          <div>
            <span>🥉 10원 : </span>
            <span id="coin-10-quantity">${returnCoinStatus[10]}개</span>
          </div>
          <div>
          👏 반환되었습니다!
          </div>
        </section>
      </div>
    `;
  }

  checkDisabled(product) {
    return product.quantity === '0' ? 'disabled' : '';
  }

  setEvent() {
    this.addEvent({ selector: '#charge-button', eventType: 'click', callback: this.handleChargeButton });
    this.addEvent({ selector: '.purchase-table-content', eventType: 'click', callback: this.handlePurchaseButton });
    this.addEvent({ selector: '#coin-return-button', eventType: 'click', callback: this.handleReturnButtonClick });
    this.addEvent({ selector: '.modal-overlay', eventType: 'click', callback: this.closeModal });
  }

  handleChargeButton() {
    const inputElement = this.target.querySelector('#charge-input');
    const inputAmount = Number(inputElement.value);
    const isValidUnit = inputAmount % 10 === 0;

    if (!isValidUnit) {
      alert(MESSAGE.PRICE_UNIT);
      return true;
    }

    this.setState({
      chargeAmount: this.state.chargeAmount + inputAmount,
      returnAmount: this.state.returnAmount + inputAmount,
    });

    localStorage.set('charge-amount', this.state.chargeAmount);
    localStorage.set('return-amount', this.state.returnAmount);
  }

  handlePurchaseButton(event) {
    if (!event?.target.closest('.purchase-button')) return;

    const { productStatus, returnAmount } = this.state;
    const [selectedProductName, selectedProductPrice, _] = this.#getSelectedRowData(event.target.dataset.row);

    if (selectedProductPrice > returnAmount) {
      alert(MESSAGE.SHORT_MONEY);
      return;
    }

    const decreasedReturnAmount = returnAmount - selectedProductPrice;
    const decreasedProductStatus = this.#decreaseProductQuantity(productStatus, selectedProductName);

    this.setState({
      returnAmount: decreasedReturnAmount,
      productStatus: decreasedProductStatus,
    });

    localStorage.set('return-amount', decreasedReturnAmount);
    localStorage.set('product-status', decreasedProductStatus);
  }

  #getSelectedRowData(number) {
    const rowData = [...this.target.querySelectorAll(`span[data-row="${number}"]`)].map(node => node.textContent);
    return [...rowData];
  }

  #decreaseProductQuantity(productStatus, selectedProductName) {
    return productStatus.map(product => {
      if (product.name !== selectedProductName) return product;
      product.quantity > 0 ? --product.quantity : alert(MESSAGE.SHORT_QUANTITY);
      return product;
    });
  }

  handleReturnButtonClick() {
    const { returnAmount, returnCoinStatus, holdingCoinAmount } = this.state;

    if (holdingCoinAmount < returnAmount) {
      alert(MESSAGE.SHORT_CHANGE);
      this.#changeReturnCoinStatus(returnCoinStatus, holdingCoinAmount);
      this.#setAbnormalReturnStatus(returnCoinStatus);
    }

    if (holdingCoinAmount >= returnAmount) {
      this.#changeReturnCoinStatus(returnCoinStatus, returnAmount);
      this.#setNormalReturnStatus(returnCoinStatus);
    }

    this.#synchronizeStorageWithState();
    this.showModal();
  }

  #changeReturnCoinStatus(returnCoinStatus, remainder) {
    const coins = [500, 100, 50, 10];
    coins.forEach(coin => {
      if (remainder >= coin) {
        returnCoinStatus[coin] += Math.floor(remainder / coin);
        remainder = remainder % coin;
      }
    });
  }

  #setAbnormalReturnStatus(returnCoinStatus) {
    this.setState({
      holdingCoinStatus: {
        500: 0,
        100: 0,
        50: 0,
        10: 0,
      },
      holdingCoinAmount: 0,
      returnCoinStatus,
      returnAmount: 0,
      chargeAmount: 0,
    });
  }

  #setNormalReturnStatus(returnCoinStatus) {
    this.setState({
      holdingCoinStatus: returnCoinStatus,
      holdingCoinAmount: this.state.holdingCoinAmount - this.state.returnAmount,
      returnCoinStatus,
      returnAmount: 0,
      chargeAmount: 0,
    });
  }

  #synchronizeStorageWithState() {
    const { holdingCoinStatus, holdingCoinAmount, returnCoinStatus, returnAmount, chargeAmount } = this.state;
    localStorage.set('holding-coin-status', holdingCoinStatus);
    localStorage.set('holding-coin-amount', holdingCoinAmount);
    localStorage.set('return-coin-status', returnCoinStatus);
    localStorage.set('return-amount', returnAmount);
    localStorage.set('charge-amount', chargeAmount);
  }

  showModal() {
    this.target.querySelector('.modal-overlay').style.display = 'block';
    this.toggleOverflowHidden();
  }

  closeModal({ target }) {
    target.style.display = 'none';
    this.toggleOverflowHidden();
  }

  toggleOverflowHidden() {
    document.body.classList.toggle('modal-open');
  }
}
