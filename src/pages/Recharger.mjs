import { MESSAGE, COINS } from '../constants.mjs';
import Component from '../core/Component.mjs';
import { localStorage } from '../storage.mjs';

export default class Recharger extends Component {
  mounted() {
    this.synchronizeStateWithStorage();
  }

  synchronizeStateWithStorage() {
    const { holdingCoinStatus, holdingCoinAmount } = this.state;

    this.setState({
      counts: localStorage.get('holding-coin-status') || holdingCoinStatus,
      amount: localStorage.get('holding-coin-amount') || holdingCoinAmount,
    });
  }

  render() {
    const { holdingCoinStatus, holdingCoinAmount } = this.state;

    this.target.innerHTML = `
      <h2>자판기 동전 충전하기</h2>
      <section class="control-layout">
        <label for="vending-machine-charge-input" hidden>충전 금액</label>
        <input type="number" id="vending-machine-charge-input" min="0" placeholder="금액" />
        <button type="button" id="vending-machine-charge-button">충전하기</button>
      </section>
      <span id="vending-machine-charge-amount">보유 금액: ${holdingCoinAmount}원</span>
      <h2>동전 보유 현황</h2>
      <section class="coin-status-table">
        <span>동전</span>
        <span>개수</span>
        <span>500원</span>
        <span id="vending-machine-coin-500-quantity">${holdingCoinStatus[500]}개</span>
        <span>100원</span>
        <span id="vending-machine-coin-100-quantity">${holdingCoinStatus[100]}개</span>
        <span>50원</span>
        <span id="vending-machine-coin-50-quantity">${holdingCoinStatus[50]}개</span>
        <span>10원</span>
        <span id="vending-machine-coin-10-quantity">${holdingCoinStatus[10]}개</span>
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
    const { holdingCoinStatus, holdingCoinAmount } = this.state;
    const inputElement = this.target.querySelector('#vending-machine-charge-input');
    const rechargeAmount = Number(inputElement.value);
    const newHodingCoinStatus = holdingCoinStatus;

    if (rechargeAmount <= 0) {
      alert(MESSAGE.EMPTY_CHARGE_INPUT);
      return;
    }

    this.#getRandomCoinsUpToAmount(rechargeAmount, newHodingCoinStatus);

    this.setState({
      holdingCoinStatus: newHodingCoinStatus,
      holdingCoinAmount: holdingCoinAmount + rechargeAmount,
    });

    this.#synchronizeStorageWithState();
  }

  #getRandomCoinsUpToAmount(rechargeAmount, newCounts) {
    let amountTarget = rechargeAmount;

    while (amountTarget > 0) {
      const randomCoin = MissionUtils.Random.pickNumberInList(COINS);
      if (amountTarget < randomCoin) continue;
      amountTarget -= randomCoin;
      newCounts[randomCoin]++;
    }
  }

  #synchronizeStorageWithState() {
    const { holdingCoinStatus, holdingCoinAmount } = this.state;
    localStorage.set('holding-coin-status', holdingCoinStatus);
    localStorage.set('holding-coin-amount', holdingCoinAmount);
  }
}
