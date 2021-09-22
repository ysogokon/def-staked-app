import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import Web3 from 'web3';

class App extends Component {
  async UNSAFE_componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // this block of code (function) connects to the BLOCKCHAIN
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('No ethereum browser detected! Check out MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: '0',
      rwdBalance: '0',
      stakingBalance: '0',
      loading: true
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="text-center">
          <h1></h1>
        </div>
      </div>
    );
  }
}

export default App;
