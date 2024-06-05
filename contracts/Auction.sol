// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract Auction {
    address public owner;
    address public last;
    mapping(address => uint) public bids;
    address[] public bidders;
    uint public endTime;
    bool public ended;
    address public lastBidder;

    event NewBid(address indexed bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    constructor(uint _biddingTime, address _owner) {
        owner = _owner;
        endTime = block.timestamp + _biddingTime;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
      function bid() public payable {
        require(block.timestamp < endTime, "Auction has ended");
        if (bidders.length > 0) {
             last = lastBidder;
            uint lastBidAmount = bids[last];
           
           payable(last).transfer(lastBidAmount);
        }
        if (bids[msg.sender] == 0) {
            
            bidders.push(msg.sender);
            
        } 
        bids[msg.sender] += msg.value;
        lastBidder = msg.sender;

        emit NewBid(lastBidder, msg.value);
       
    }

    function endAuction() public onlyOwner payable  {
        require(block.timestamp >= endTime, "Auction has not ended yet");
        require(!ended, "Auction already ended");
        require(bidders.length > 0, "No one participated!");
        ended = true;
        payable (owner).transfer(address(this).balance);
        emit AuctionEnded(lastBidder, bids[lastBidder]);
    }
    function getBidders() public view returns (address[] memory) {
        return bidders;
    }
    function getLastBidder() public view returns (address) {
        return lastBidder;
    }
    function getOwner() public view returns (address) {
        return owner;
    }
      function getLast() public view returns (uint) {
        return address(this).balance;
    }
}
