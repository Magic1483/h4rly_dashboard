// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FundMe {
    mapping(address => uint) public contributors;
    address public admin;
    address[] public users;

    constructor() {
        admin = msg.sender;
    }

    event UpdateDonationsEvent(address indexed addr, uint amount);

    event WithdrawEvent();

    function contribute() public payable {
        if (contributors[msg.sender] == 0) {
            users.push(msg.sender); // add user if not exists
        }
        contributors[msg.sender] += msg.value;
        
        emit UpdateDonationsEvent(msg.sender,msg.value);
    }

    function getUserCount() public view returns (uint) {
        return  users.length;
    }

    function getUserByIndex(uint _ind) public view returns (address) {
        require(_ind <  users.length);
        return users[_ind];
    }

    function getUserDonationsByIndex(uint _ind) public view returns (uint) {
        require(_ind <  users.length);
        address user = getUserByIndex(_ind);
        return contributors[user];
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;  // balance os contract (admin)
    }

    function getAdminAddress() public view returns(address) {
        return admin;
    }

    function ClearContributors() private {
        for (uint i; i < users.length; i++) 
        {
            delete contributors[users[i]];
        }
    }

    function withdraw() public {
        require(msg.sender == admin, "Only admin can withdraw");
        payable(admin).transfer(getBalance());
        // clear users && contributors
        ClearContributors();
        users = new address[](0);

        emit WithdrawEvent();
    }
}