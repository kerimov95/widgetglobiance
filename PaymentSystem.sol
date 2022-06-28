// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Ownable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract PaymentSystem is Ownable {
    struct order {
        address payer;
        uint256 value;
        bool revert;
    }

    //база ордеров
    mapping(uint256 => order) public orders;

    event PaymentOrder(uint256 indexed id, address payer, uint256 value);

    //оплата ордера
    function paymentOrder(uint256 _id) public payable returns (bool) {
        require(orders[_id].value == 0 && msg.value > 0);

        orders[_id].payer = msg.sender;
        orders[_id].value = msg.value;
        orders[_id].revert = false;

        //создать евент
        emit PaymentOrder(_id, msg.sender, msg.value);

        return true;
    }

    event RevertOrder(uint256 indexed id, address payer, uint256 value);

    //возврат платежа администратором
    function revertOrder(uint256 _id) public onlyOwner returns (bool) {
        require(orders[_id].value > 0 && orders[_id].revert == false);

        orders[_id].revert = true;
        payable(orders[_id].payer).transfer(orders[_id].value);

        emit RevertOrder(_id, orders[_id].payer, orders[_id].value);

        return true;
    }

    //вывод денег администратором
    function outputMoney(address _from, uint256 _value)
        public
        onlyOwner
        returns (bool)
    {
        require(address(this).balance >= _value);

        payable(_from).transfer(_value);

        return true;
    }
}
