// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract Auction {
    address public owner;
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

    function bid() public payable  {
        require(block.timestamp < endTime, "Auction has ended");

        if (bids[msg.sender] == 0) {
            bidders.push(msg.sender);
        } else {
          

            // Refund the previous bid to the bidder
            payable(msg.sender).transfer(bids[msg.sender]);
        }

        if (lastBidder != address(0)) {
            // Refund the last highest bid to the lastBidder
             payable(lastBidder).transfer(bids[lastBidder]);
        }

        bids[msg.sender] = msg.value;// Update the bid amount for the bidder
        lastBidder = msg.sender;// Update the last bidder

        
        emit NewBid(msg.sender, msg.value);
    }

    function endAuction() public onlyOwner {
        require(block.timestamp >= endTime, "Auction has not ended yet");
        require(!ended, "Auction already ended");
        require(bidders.length > 0, "No one participated!");

        ended = true;
        
        // Notify the backend server to transfer the funds to the owner
        // This would be a call to the server
        // Transfer the highest bid amount to the owner
         payable(owner).transfer(bids[lastBidder]);
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
}
