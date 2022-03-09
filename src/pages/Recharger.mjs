import { MESSAGE } from '../constants.js';
import Component from '../core/Component.mjs';
import { localStorage } from '../storage.mjs';

export default class Recharger extends Component {
  mounted() {
    const counts = localStorage.get('holding-coin-status');
    const amount = localStorage.get('holding-coin-amount');

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
        <label for="vending-machine-charge-input" class="a11y-hidden">충전 금액</label>
        <input type="number" id="vending-machine-charge-input" min="0" placeholder="금액" />
        <button type="button" id="vending-machine-charge-button">충전하기</button>
      </section>
      <span id="vending-machine-charge-amount">보유 금액: ${amount}원</span>
      <h2>동전 보유 현황</h2>
      <section class="coin-status-table">
        <span>동전</span>
        <span>개수</span>
        <span>500원</span>
        <span id="vending-machine-coin-500-quantity">${counts[500]}개</span>
        <span>100원</span>
        <span id="vending-machine-coin-100-quantity">${counts[100]}개</span>
        <span>50원</span>
        <span id="vending-machine-coin-50-quantity">${counts[50]}개</span>
        <span>10원</span>
        <span id="vending-machine-coin-10-quantity">${counts[10]}개</span>
      </section>
    `;
  }

  setEvent() {
    this.addEvent({
      selector: '#vending-machine-charge-button',
      eventType: 'click',
      callback: this.handleAddButtonClick,
    });
  }

  handleAddButtonClick() {
    const inputElement = this.target.querySelector('#vending-machine-charge-input');
    const rechargeAmount = Number(inputElement.value);
    const copyOfCounts = this.state.counts;
    const coins = Object.keys(copyOfCounts)
      .map(Number)
      .sort((a, b) => b - a);

    if (rechargeAmount <= 0) {
      alert(MESSAGE.EMPTY_CHARGE_INPUT);
      return;
    }

    let amountTarget = rechargeAmount;

    while (amountTarget > 0) {
      const randomCoin = MissionUtils.Random.pickNumberInList(coins);
      if (amountTarget < randomCoin) continue;
      amountTarget -= randomCoin;
      copyOfCounts[randomCoin]++;
    }

    this.setState({
      counts: copyOfCounts,
      amount: this.state.amount + rechargeAmount,
    });

    localStorage.set('holding-coin-status', this.state.counts);
    localStorage.set('holding-coin-amount', this.state.amount);
  }
}
