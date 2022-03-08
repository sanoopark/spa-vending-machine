export default class Component {
  constructor(target, props) {
    this.target = target;
    this.state = props;
    this.render();
    this.setEvent();
    this.mounted();
  }

  render() {}

  setEvent() {}

  mounted() {}

  addEvent({ className, eventType, callback }) {
    this.target.querySelector(className).addEventListener(eventType, callback.bind(this));
  }

  setState(addedState) {
    this.state = {
      ...this.state,
      ...addedState,
    };
    this.render();
    this.setEvent();
  }
}
