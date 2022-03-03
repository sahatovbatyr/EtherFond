
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EtherFond {
    address private _owner;

    event Received(address, uint);
   

    mapping(address => bool) public isDonationBlocked;
   

    constructor() {
        _owner = msg.sender;
        console.log("OWNER=",_owner);
      
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function balansOf(address _addr ) public  view virtual returns (uint256) {
        uint256 currentBalance = address(_addr).balance;
        return currentBalance;
        
    }

    modifier onlyOwner(){
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;

    }
   
  

    function removeFromBlockList(address _addr)
        public onlyOwner
        
    {      
        
            isDonationBlocked[_addr] = false;
        
    }

    function isBlocked (address  _address) public view returns (bool) {
        return isDonationBlocked[_address];
    }

      function addToBlockList(address _addres) public onlyOwner {
        //calldata -> calldata (special data location that contains the function arguments,
        // only available for external function call parameters).
      
        isDonationBlocked[_addres] = true;
        
    }

    function donate( ) public payable {

        console.log("******************************************************************************************");

        console.log("SmartContract.DONATE() sender=", msg.sender);
        
        //console.log(msg);
        uint amount= msg.value; 
        uint256 currentBalance = address(msg.sender).balance;

        require(!isBlocked(msg.sender), "Donation is blocked by your address");
        require( amount > 0, "EtherFond: value must be positive");
        require(currentBalance >= amount, "Not enough token!"); 


        console.log("OWNER before recive DONATE=", balansOf(_owner), "amount=", amount );
        console.log("SENDE before recive DONATE=", balansOf(msg.sender), "amount=", amount );

        // // not work
        (bool success, ) = owner().call{value: amount}("");        
        require(success, "Failed to send Ether");

        

        // //not work
        // payable(_to).transfer(_amount);

        

       console.log("OWNER  after recive DONATE=", balansOf(_owner) );
       console.log("SENDE  after recive DONATE=", balansOf(msg.sender) );  

        


    }

    receive() external payable {

        console.log("RRRRRRRRRRRRRRRRRR  RECEIVE FFFFFFFFFFFFFFFFFFFFFFF");

        emit Received(msg.sender, msg.value);
    }

    function withdrawEther() public payable onlyOwner {
     
        uint256 currentBalance = address(this).balance;
        require(
            currentBalance > 0,
            "EtherFond: withdrawEther: currentBalance must be greater than 0"
        );

        payable(msg.sender).transfer(currentBalance);
    }

   
    

     
}