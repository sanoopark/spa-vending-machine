import Component from '../core/Component.mjs';
import { localStorage } from '../storage.mjs';

export default class Recharger extends Component {
  mounted() {
    const counts = localStorage.get('coin-status');
    const amount = localStorage.get('coin-amount');

    if (counts && amount) {
      this.setState({ counts });
      this.setState({ amount });
    }
  }

  render() {
    const { counts, amount } = this.state;

    this.target.innerHTML = `
      <h2>자판기 동전 충전하기</h2>
      <section class="control-layout">
        <label for="amount" class="a11y-hidden">충전 금액</label>
        <input type="number" id="amount" min="0" placeholder="금액" />
        <button type="button" class="add">충전하기</button>
      </section>
      <span>보유 금액: ${amount}원</span>
      <h2>동전 보유 현황</h2>
      <section class="two-col-layout">
        <span>동전</span>
        <span>개수</span>
        <span>500원</span>
        <span>${counts[500]}개</span>
        <span>100원</span>
        <span>${counts[100]}개</span>
        <span>50원</span>
        <span>${counts[50]}개</span>
        <span>10원</span>
        <span>${counts[10]}개</span>
      </section>
    `;
  }

  setEvent() {
    this.addEvent({ selector: '.add', eventType: 'click', callback: this.handleAddButtonClick });
  }

  handleAddButtonClick() {
    const inputElement = this.target.querySelector('#amount');
    const amount = Number(inputElement.value);
    const copyOfCounts = this.state.counts;
    const coins = Object.keys(copyOfCounts)
      .map(Number)
      .sort((a, b) => b - a);

    let remainder = amount;

    coins.forEach(coin => {
      if (remainder >= coin) {
        copyOfCounts[coin] += Math.floor(remainder / coin);
        remainder = remainder % coin;
      }
    });

    this.setState({
      counts: copyOfCounts,
      amount: this.state.amount + amount,
    });

    localStorage.set('coin-status', this.state.counts);
    localStorage.set('coin-amount', this.state.amount);
  }
}
