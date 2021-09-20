// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract SunFlowerSeedToken {
  string public name = 'Sun Flower Seed Token';
  string public symbol = 'SFST';
  uint256 public totalSupply = 1000000000000000000000000; // 10 millions
  uint8 public decimals = 18;
  uint128 private lastDayOfSummer = 1632283200;
  bool private isSummerOver;

  event Transfer(address indexed _from, address indexed _to, uint value);

  event Approval(address indexed _owner, address indexed _spender, uint value);

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  constructor() {
    balanceOf[msg.sender] = totalSupply;
  }

  modifier onlySummer {
    if (lastDayOfSummer < block.timestamp)
      isSummerOver = true;
      
    require(isSummerOver == true);
    _;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

  function transferFrom(address _from, address _to, uint256 _value) public onlySummer returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
