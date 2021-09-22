// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
  string public name = 'Decentral Bank';
  address public owner;
  Tether public tether;
  RWD public rwd;

  address[] public stakers;

  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(RWD _rwd, Tether _tether) {
    rwd = _rwd;
    tether = _tether;
    owner = msg.sender;
  }

  // Staking function
  function depositTokens(uint _amount) public {

    // requre staking amount greater than 0
    require(_amount > 0, 'amount cannot be 0');
    // Trnasfer tether tokens to this contract address for staking
    tether.transferFrom(msg.sender, address(this), _amount);

    // Updatae staking balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    // Update stakig balance
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;

  }

  // Issue rewards
  function issueTokens() public {
    // require only the owner to issue tokens
    require(msg.sender == owner, 'caller must be the owner');

    for (uint i = 0; i < stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient] / 9; // create incentive percentage for stakers 1 / 9

      if (balance > 0) {
         rwd.transfer(recipient, balance);
      }     
    }
  }

  // Unstake tokens
  function unstakeTokens() public {    
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'staking balance must be greater than 0');

    // transfer the tokens to the specified contract address from our bank
    tether.transfer(msg.sender, balance); 
    stakingBalance[msg.sender] = 0;

    // Update staking status
    isStaking[msg.sender] = false;
  }
}
