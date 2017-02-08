// import styles from './main.css' export default function () {   const element
// = document.createElement('h1');   element.innerHTML = 'Hello world test';
// console.log("good");   element.className = styles.redButton;   //
// element.onclick = () => {   //   require.ensure([], (require) => {   //
// element.textContent = require('./lazy').default;   //   });   // };
// element.onclick = () => {     import ('./lazy').then((lazy) => {
// element.textContent = lazy.default;     }).catch((err) => {
// console.error(err);     });   };   return element; }

import React from 'react';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0
    };
  }
  render() {
    return (
      <div>
        <span className="fa fa-hand-spock-o fa-1g">
          Amount: {this.state.amount}
        </span>
        <button onClick={() => this.setState(addOne)}>Addd 2one</button>
      </div>
    );
  }
}

const addOne = ({amount}) => ({
  amount: amount + 1
});

export default Counter;

