// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0; 

contract Clicker {
    uint public  total_clicks;

    mapping (address => uint) public userClicks;

    event Click(address indexed  user,uint clicks);

    function click() public  {
        total_clicks += 1;
        userClicks[msg.sender] += 1;

        emit Click(msg.sender, userClicks[msg.sender]);
    }

    function getUserClicks(address _user) public view returns (uint) {
        return userClicks[_user];
    }

   


}