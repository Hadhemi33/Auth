// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Auction {
    address public owner;
    mapping(address => uint) public bids;
    address[] public bidders;
    uint public endTime;
    bool public ended;

    address public lastBidder;

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
        require(msg.value > bids[msg.sender], "Bid not enough");

        if (bids[msg.sender] == 0) {
            bidders.push(msg.sender);
        }

        bids[msg.sender] = msg.value;
        lastBidder = msg.sender;
    }

    function endAuction() public onlyOwner {
        require(block.timestamp >= endTime, "Auction has not ended yet");
        require(!ended, "Auction already ended");
        require(bidders.length > 0, "No one participated!");

        ended = true;
        payable(owner).transfer(address(this).balance);
    }

    function getLastBidder() public view returns (address) {
        return lastBidder;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
