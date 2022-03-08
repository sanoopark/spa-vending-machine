import { MESSAGE } from '../constants.js';
import Component from '../core/Component.mjs';
import { localStorage } from '../storage.mjs';

export default class Management extends Component {
  mounted() {
    const data = localStorage.get('product-status', this.state) || [];
    this.setState({ data });
  }

  render() {
    const { data } = this.state;

    this.target.innerHTML = `
      <h2>상품 추가하기</h2>
      <section class="control-layout">
        <label for="name" class="a11y-hidden">상품명</label>
        <input type="text" id="name" placeholder="상품명" />
        <label for="price" class="a11y-hidden">가격</label>
        <input type="number" id="price" min="0" placeholder="가격" />
        <label for="quantity" class="a11y-hidden">수량</label>
        <input type="number" id="quantity" min="0" placeholder="수량" />
        <button type="button" class="add">추가하기</button>
      </section>
      <h2>상품 현황</h2>
      <section class="three-col-layout">
        <span>상품명</span>
        <span>가격</span>
        <span>수량</span>
        ${data
          .map((row, index) =>
            Object.entries(row)
              .map(([key, value]) => `<span data-row="${index}" data-type="${key}">${value}</span>`)
              .join('')
          )
          .join('')}
      </section>
    `;
  }

  setEvent() {
    this.addEvent({ selector: '.add', eventType: 'click', callback: this.handleAddButtonClick });
  }

  handleAddButtonClick() {
    const mainElement = this.target;
    const controlLayout = mainElement.querySelector('.control-layout');
    const tableElement = mainElement.querySelector('.three-col-layout');
    const values = [...controlLayout.querySelectorAll('input')].map(target => target.value);

    if (values.some(value => value === '')) {
      alert(MESSAGE.EMPTY_INPUT);
      return;
    }

    values.forEach(inputValue => tableElement.insertAdjacentHTML('beforeend', `<span>${inputValue}</span>`));

    this.setState({
      data: [...this.state.data, { ...values }],
    });

    localStorage.set('product-status', this.state.data);
  }
}
