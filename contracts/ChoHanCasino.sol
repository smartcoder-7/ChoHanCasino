//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ChoHanCasino {
    address payable public owner;
    uint256 public minimumBet;
    uint256 public minNumberPlayer = 2;
    uint256 public fee = 3; // percentage of winners
    uint256 public numberOfPlayers;
    uint256 public currentBetId; //also current bet
    uint256 private nonce; // for generating random numbers

    enum Pairity {
        Even,
        Odd,
        Default
    }

    enum Result {
        Won,
        Lost
    }

    struct Pair {
        uint256 dice1;
        uint256 dice2;
    }

    struct Player {
        uint256 id;
        uint256 amountBet;
        Pairity pairity;
        address payable playerAddress;
    }

    struct Bet {
        uint256 id;
        Pairity pairity;
        uint256 totalBet;
        uint256 numberOfPlayers;
        bool ended;
        Pair pair;
    }

    mapping(address => Player) public playersInfo;
    Player[] public players;
    Bet[] public bets;

    event BetResult(Result _status, address _address, uint256 _amount);
    event BetPlaced(Bet lastBet);
    event BetEnded(Bet lastBet);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(uint256 _mininumBet) {
        owner = payable(msg.sender);
        if (_mininumBet != 0) minimumBet = _mininumBet;
        bets.push(Bet(1, Pairity.Default, 0, 0, false, Pair(0, 0)));
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

    function bet(Pairity _pairity) public payable returns (bool) {
        //selected number has to be 1 or 0
        // 1 for even 0 for odd
        require(!checkPlayerExists(msg.sender));
        require(uint8(_pairity) <= 1);
        require(msg.value >= minimumBet);

        Player memory newPlayer = Player(
            players.length,
            msg.value,
            _pairity,
            payable(msg.sender)
        );
        players.push(newPlayer);
        playersInfo[msg.sender] = newPlayer;
        numberOfPlayers = players.length;
        bets[currentBetId].numberOfPlayers += players.length;
        bets[currentBetId].totalBet += msg.value;
        emit BetPlaced(bets[currentBetId]);
        return true;
    }

    function endBet() public onlyOwner {
        require(numberOfPlayers > 0, "should be more than 1 player");

        if (numberOfPlayers == 1) {
            withdraw(players[0].playerAddress, bets[currentBetId].totalBet);
            bets[currentBetId].ended = true;
            delete players;
            bets.push(Bet(0, Pairity.Default, 0, 0, false, Pair(0, 0)));
            currentBetId++;
        } else {
            generatePairity();
            distributePrizes(bets[currentBetId].pairity);
        }
        resetData();
        emit BetEnded(bets[currentBetId - 1]);
    }

    function rollDice() internal returns (uint256) {
        uint256 randomnumber = ((
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.difficulty, nonce)
                )
            )
        ) % 6) + 1;
        nonce++;
        return randomnumber;
    }

    function generatePairity() public {
        bets[currentBetId].pair.dice1 = rollDice();
        bets[currentBetId].pair.dice2 = rollDice();
        bets[currentBetId].pairity = Pairity(
            (bets[currentBetId].pair.dice1 + bets[currentBetId].pair.dice2) % 2
        );
    }

    function distributePrizes(Pairity _pairity) public {
        Player[100] memory winners;
        Player[100] memory losers;
        uint256 numberOfWinners = 0;
        uint256 numberOfLosers = 0;

        uint256 totalAmountFromWinners = 0; //will be used for caculating weight

        for (uint256 i = 0; i < players.length; i++) {
            if (players[i].pairity == _pairity) {
                winners[numberOfWinners] = players[i];
                totalAmountFromWinners += players[i].amountBet;
                numberOfWinners++;
            } else {
                losers[numberOfLosers] = players[i];
                numberOfLosers++;
            }
            delete playersInfo[players[i].playerAddress];
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
                    emit BetResult(
                        Result.Won,
                        winners[j].playerAddress,
                        winnerEtherAmount
                    );
                }
            }
        }

        for (uint256 l = 0; l < numberOfLosers; l++) {
            if (losers[l].playerAddress != address(0))
                emit BetResult(Result.Lost, losers[l].playerAddress, 0);
        }
    }

    function resetData() public {
        delete players;
        bets[currentBetId].ended = true;
        bets.push(Bet(0, Pairity.Default, 0, 0, false, Pair(0, 0)));
        currentBetId++;
        numberOfPlayers = 0;
    }
}
