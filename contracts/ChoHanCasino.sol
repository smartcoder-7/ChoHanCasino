//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ChoHanCasino {
    address payable public owner;
    uint256 public minimumBet;
    uint256 public minNumberPlayer = 2;
    uint256 public fee = 3; // percentage of winners
    uint256 public numberOfPlayers;
    uint256 public currentBetId; //also current bet

    struct Player {
        uint256 id;
        uint256 amountBet;
        uint256 numberSelected;
        address payable playerAddress;
    }

    struct Bet {
        uint256 id;
        uint256 numberWinner;
        uint256 totalBet;
        uint256 numberOfPlayers;
        bool ended;
    }

    Player[] public players;
    Bet[] public bets;

    event Won(bool _status, address _address, uint256 _amount);
    event BetPlaced(bool _status, uint256 totalBet, uint256 numberOfPlayers);
    event BetEnded(bool _status);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(uint256 _mininumBet) {
        owner = payable(msg.sender);
        if (_mininumBet != 0) minimumBet = _mininumBet;
        bets.push(Bet(1, 3, 0, 0, false));
    }

    fallback() external payable {}

    receive() external payable {}

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }

    function setFee(uint256 _fee) public onlyOwner returns (uint256) {
        require(_fee <= 100, "percentage should be less than 100");
        fee = _fee;
        return fee;
    }

    function withdraw(address payable reciever, uint256 _amount)
        public
        onlyOwner
        returns (bool)
    {
        if (_amount > 0) {
            if (reciever.send(_amount)) {
                return true;
            }
        }
        return false;
    }

    function checkPlayerExists(address player) public view returns (bool) {
        if (players.length == 0) return false;
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i].playerAddress == player) return true;
        }
        return false;
    }

    function bet(uint256 _numberSelected) public payable returns (bool) {
        //selected number has to be 1 or 0
        // 1 for even 0 for odd
        require(!checkPlayerExists(msg.sender));
        require(_numberSelected <= 1);
        require(msg.value >= minimumBet);

        players.push(
            Player(
                players.length,
                msg.value,
                _numberSelected,
                payable(msg.sender)
            )
        );
        numberOfPlayers = players.length;

        bets[currentBetId].totalBet += msg.value;
        emit BetPlaced(true, bets[currentBetId].totalBet, numberOfPlayers);
        return true;
    }

    function endBet() public onlyOwner {
        require(numberOfPlayers > 0, "should be more than 1 player");

        if (numberOfPlayers == 1) {
            withdraw(players[0].playerAddress, bets[currentBetId].totalBet);
            bets[currentBetId].ended = true;
            delete players;
            bets.push(Bet(0, 3, 0, 0, false));
            currentBetId++;
        } else {
            generateNumberWinner();
            distributePrizes(bets[currentBetId].numberWinner);
        }
        resetData();
        emit BetEnded(true);
    }

    function generateNumberWinner() public {
        uint256 numberGenerated = ((block.number % 36) + 1) % 2;
        bets[currentBetId].numberWinner = numberGenerated;
    }

    function distributePrizes(uint256 numberWin) public {
        Player[100] memory winners;
        Player[100] memory losers;
        uint256 numberOfWinners = 0;
        uint256 numberOfLosers = 0;

        uint256 totalAmountFromWinners = 0; //will be used for caculating weight

        for (uint256 i = 0; i < players.length; i++) {
            if (players[i].numberSelected == numberWin) {
                winners[numberOfWinners] = players[i];
                totalAmountFromWinners += players[i].amountBet;
                numberOfWinners++;
            } else {
                losers[numberOfLosers] = players[i];
                numberOfLosers++;
            }
            delete players[i];
        }

        if (winners.length > 0) {
            for (uint256 j = 0; j < numberOfWinners; j++) {
                if (winners[j].playerAddress != address(0)) {
                    uint256 winnerEtherAmount = ((winners[j].amountBet /
                        totalAmountFromWinners) *
                        bets[currentBetId].totalBet *
                        (100 - fee)) / 100;

                    payable(winners[j].playerAddress).transfer(
                        winnerEtherAmount
                    );
                    emit Won(true, winners[j].playerAddress, winnerEtherAmount);
                }
            }
        }

        for (uint256 l = 0; l < numberOfLosers; l++) {
            if (losers[l].playerAddress != address(0))
                emit Won(false, losers[l].playerAddress, 0);
        }
    }

    function resetData() public {
        delete players;
        bets[currentBetId].ended = true;
        bets.push(Bet(0, 3, 0, 0, false));
        currentBetId++;
        numberOfPlayers = 0;
    }
}
