import Component from './core/Component.mjs';
import Management from './pages/Management.mjs';

export default class App extends Component {
  constructor(props) {
    super(props);

    new Management(this.target, { data: [] });
  }
}
