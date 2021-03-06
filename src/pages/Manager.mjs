import { MESSAGE } from '../constants.mjs';
import Component from '../core/Component.mjs';
import { localStorage } from '../storage.mjs';

export default class Manager extends Component {
  mounted() {
    this.synchronizeStateWithStorage();
  }

  synchronizeStateWithStorage() {
    const { productStatus } = this.state;

    localStorage.set('product-status', this.state.productStatus);

    this.setState({
      productStatus: localStorage.get('product-status') || productStatus,
    });
  }

  render() {
    const { productStatus } = this.state;

    this.target.innerHTML = `
      <h2>상품 등록</h2>
      <section class="control-layout">
        <div>
          <label for="product-name-input" hidden>상품명</label>
          <input type="text" id="product-name-input" placeholder="상품명" />
          <label for="product-price-input" hidden>가격</label>
          <input type="number" id="product-price-input" min="0" placeholder="가격" />
          <label for="product-quantity-input" hidden>수량</label>
          <input type="number" id="product-quantity-input" min="0" placeholder="수량" />
        </div>
        <button type="button" id="product-add-button">추가하기</button>
      </section>
      <h2>상품 목록</h2>
      <div class="product-items">
        ${productStatus
          ?.map(
            (row, index) => `
              <div class="product-manage-item">
                ${Object.entries(row)
                  .map(
                    ([key, value]) => `
                      <span class="product-manage-${key}" data-row="${index}" data-type="${key}">
                      ${value}${this.unitGenerator(key)}</span>
                      `
                  )
                  .join('')}
                  <button type="button" class="product-delete-button" data-row="${index}">삭제하기</button>
              </div>
            `
          )
          .join('')}
      </div>
    `;
  }

  setEvent() {
    this.addEvent({ selector: '#product-add-button', eventType: 'click', callback: this.handleAddButtonClick });
    this.addEvent({ selector: '.product-items', eventType: 'click', callback: this.handleDeleteButtonClick });
  }

  handleAddButtonClick() {
    const controlLayout = this.target.querySelector('.control-layout');
    const values = [...controlLayout.querySelectorAll('input')].map(target => target.value);
    const [name, price, quantity] = values;
    const isEmptyInput = values.some(value => value === '');
    const isLeastPrice = price >= 100;
    const isValidPriceUnit = price % 10 === 0;
    const isMaximumNumber = this.state.productStatus.length === 5;

    if (isMaximumNumber) {
      alert(MESSAGE.MAXIMUM);
      return;
    }

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

  handleDeleteButtonClick({ target }) {
    if (target.className !== 'product-delete-button') return;

    const productIndex = Number(target.dataset.row);
    const { productStatus } = this.state;

    this.setState({
      productStatus: productStatus.filter((_, arrayIndex) => arrayIndex !== productIndex),
    });

    localStorage.set('product-status', this.state.productStatus);
  }

  unitGenerator(key) {
    switch (key) {
      case 'price':
        return '원';
      case 'quantity':
        return '개';
      default:
        return '';
    }
  }
}
