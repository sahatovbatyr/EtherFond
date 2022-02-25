
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract EtherFond {
    address private _owner;
    uint256 public totalSupply = 1000000;

    mapping(address => bool) public isDonationBlocked;
    mapping(address => uint256) balances;

    constructor() {
        _owner = msg.sender;
         balances[msg.sender]=totalSupply;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function balansOf(address account ) public  view virtual returns (uint256) {
        return balances[account];
        
    }

    modifier onlyOwner(){
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;

    }

    // function onlyOwner() private view {
    //    require(owner() == msg.sender, "Ownable: caller is not the owner");
        
    // }

  

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

    function donate( uint amount) public payable {
        require(!isBlocked(msg.sender), "Donation is blocked by your address");
        require( amount > 0, "EtherFond: value must be positive");
        require(balances[msg.sender] >= amount, "Not enough token!");

        balances[msg.sender]-=amount;
        balances[_owner]+=amount;
        

    }

    function withdrawEther() public payable onlyOwner {
     
        uint256 currentBalance = address(this).balance;
        require(
            currentBalance > 0,
            "EtherFond: withdrawEther: currentBalance must be greater than 0"
        );

        payable(msg.sender).transfer(currentBalance);
    }

    function transfer( address recipient, uint amount ) public payable  {
        require(msg.sender!=recipient, "Sending yourself! Check it!");
        require( balances[msg.sender]>=amount, "Not enough token!");
        balances[msg.sender]-=amount;
        balances[recipient]+=amount;

         uint a=1;


        
    }

    

     
}