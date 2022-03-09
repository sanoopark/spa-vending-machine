import { MESSAGE } from '../constants.js';
import Component from '../core/Component.mjs';
import { localStorage } from '../storage.mjs';

export default class Manager extends Component {
  mounted() {
    this.synchronizeStateWithStorage();
  }

  synchronizeStateWithStorage() {
    const { productStatus } = this.state;

    this.setState({
      productStatus: localStorage.get('product-status') || productStatus,
    });
  }

  render() {
    const { productStatus } = this.state;

    this.target.innerHTML = `
      <h2>상품 추가하기</h2>
      <section class="control-layout">
        <label for="product-name-input" class="a11y-hidden">상품명</label>
        <input type="text" id="product-name-input" placeholder="상품명" />
        <label for="product-price-input" class="a11y-hidden">가격</label>
        <input type="number" id="product-price-input" min="0" placeholder="가격" />
        <label for="product-quantity-input" class="a11y-hidden">수량</label>
        <input type="number" id="product-quantity-input" min="0" placeholder="수량" />
        <button type="button" id="product-add-button">추가하기</button>
      </section>
      <h2>상품 현황</h2>
      <section class="product-table-title">
        <span>상품명</span>
        <span>가격</span>
        <span>수량</span>
      </section>
      ${productStatus
        ?.map(
          (row, index) => `
            <div class="product-manage-item">
              ${Object.entries(row)
                .map(
                  ([key, value]) => `
                    <span class="product-manage-${key}" data-row="${index}" data-type="${key}">
                      ${value}
                    </span>
                  `
                )
                .join('')}
              </div>
            `
        )
        .join('')}
    `;
  }

  setEvent() {
    this.addEvent({ selector: '#product-add-button', eventType: 'click', callback: this.handleAddButtonClick });
  }

  handleAddButtonClick() {
    const controlLayout = this.target.querySelector('.control-layout');
    const values = [...controlLayout.querySelectorAll('input')].map(target => target.value);
    const [name, price, quantity] = values;
    const isEmptyInput = values.some(value => value === '');
    const isLeastPrice = price >= 100;
    const isValidPriceUnit = price % 10 === 0;

    if (this.#isInvalidInputValue(isEmptyInput, isLeastPrice, isValidPriceUnit)) return;

    this.setState({
      productStatus: [...this.state.productStatus, { name, price, quantity }],
    });

    localStorage.set('product-status', this.state.productStatus);
  }

  #isInvalidInputValue(isEmptyInput, isLeastPrice, isValidPriceUnit) {
    if (isEmptyInput) {
      alert(MESSAGE.MISSED_INPUT);
      return true;
    }

    if (!isLeastPrice) {
      alert(MESSAGE.LEAST_PRICE);
      return true;
    }

    if (!isValidPriceUnit) {
      alert(MESSAGE.PRICE_UNIT);
      return true;
    }

    return false;
  }
}
