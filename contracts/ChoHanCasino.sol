//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ChoHanCasino {
    address payable public owner;
    uint256 public minimumBet;
    uint256 public totalBet;
    uint256 public minNumberPlayer = 2;
    uint256 public numberWinner = 2;
    bool ended;

    struct Player {
        uint256 id;
        uint256 amountBet;
        uint256 numberSelected;
        address payable playerAddress;
    }

    struct Bet {
        uint256 numberWinner;
        uint256 totalBet;
    }

    Player[] public players;
    Bet[] public bets;

    event Won(bool _status, address _address, uint256 _amount);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(uint256 _mininumBet) {
        owner = payable(msg.sender);
        if (_mininumBet != 0) minimumBet = _mininumBet;
    }

    fallback() external payable {}

    receive() external payable {}

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }

    function withdraw() public onlyOwner returns (bool) {
        owner.transfer(address(this).balance);
        return true;
    }

    function checkPlayerExists(address player) public view returns (bool) {
        for (uint256 i = 0; i <= players.length; i++) {
            if (players[i].playerAddress == player) return true;
        }
        return false;
    }

    function bet(uint256 _numberSelected) public payable {
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

        totalBet += msg.value;
    }

    function betEnd() public onlyOwner {
        generateNumberWinner();
        distributePrizes(numberWinner);
        resetData();
    }

    function generateNumberWinner() public {
        uint256 numberGenerated = ((block.number % 36) + 1) % 2;
        numberWinner = numberGenerated;
    }

    function distributePrizes(uint256 numberWin) public {
        address[100] memory winners;
        address[100] memory losers;
        uint256 countWin = 0;
        uint256 countLose = 0;

        for (uint256 i = 0; i < players.length; i++) {
            address playerAddress = players[i].playerAddress;
            if (players[i].numberSelected == numberWin) {
                winners[countWin] = playerAddress;
                countWin++;
            } else {
                losers[countLose] = playerAddress;
                countLose++;
            }
            delete players[i];
        }

        if (countWin != 0) {
            uint256 winnerEtherAmount = totalBet / countWin;

            for (uint256 j = 0; j < countWin; j++) {
                if (winners[j] != address(0)) {
                    payable(winners[j]).transfer(winnerEtherAmount);
                    emit Won(true, winners[j], winnerEtherAmount);
                }
            }
        }

        for (uint256 l = 0; l < losers.length; l++) {
            if (losers[l] != address(0)) emit Won(false, losers[l], 0);
        }
    }

    function resetData() public {
        delete players;
        bets.push(Bet(numberWinner, totalBet));
        totalBet = 0;
        numberWinner = 2;
    }
}
