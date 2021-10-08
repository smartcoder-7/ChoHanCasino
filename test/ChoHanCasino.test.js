const { expect } = require('chai');
const { EVM_REVERT } = require('./helpers');

const ChoHanCasino = artifacts.require("ChoHanCasino.sol");


require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Casino', (accounts) => {
  let casino;
  const [admin, player1, player2] = accounts;
  before(async () => {
    casino = await ChoHanCasino.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = casino.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    });
  });

  describe('checkPlayersExists', async () => {
    it('returns true if there is a player already', async () => {
      const betAmount = web3.utils.toWei('0.15', 'ether');
      await casino.bet(1, {value: betAmount});
      const result = await casino.checkPlayerExists(admin);
      expect(result).to.be.equal(true);
    });
    
    it('returns false if he is not a player', async () => {
      const result = await casino.checkPlayerExists(player1);
      expect(result).to.be.equal(false);
    });
  })

  describe('bet', async () => {
   it('works normal', async () => {
     //we have already a player to bet that is admin
      const BET_AMOUNT = '0.15';
      const currentBetId = await casino.currentBetId();
      const currentBet = await casino.bets(currentBetId);
      const totalBet = web3.utils.fromWei(currentBet.totalBet);
      const {id, amountBet, pairity, playerAddress} = await casino.playersInfo(admin);

      expect(totalBet).to.be.eq(BET_AMOUNT);
      expect(id.toNumber()).to.be.eq(0);
      expect(web3.utils.fromWei(amountBet)).to.be.eq(BET_AMOUNT);
      expect(pairity.toNumber()).to.be.eq(1);
      expect(playerAddress).to.be.eq(admin);
    });

    it('should fail when value is smaller than minbet amount', async () => {
      const betAmount = web3.utils.toWei('0.01', 'ether');
      await casino.bet(1, {value: betAmount}).should.be.rejectedWith(EVM_REVERT);
    });

    it('should fail when value selected value is greater than 1', async () => {
      const betAmount = web3.utils.toWei('0.15', 'ether');
      await casino.bet(2, {value: betAmount}).should.be.rejectedWith(EVM_REVERT);
    });

    it('should fail when a player bet second time in a session of a bet', async () => {
      const betAmount = web3.utils.toWei('0.15', 'ether');

      await casino.bet(1, {value: betAmount}).should.be.rejectedWith(EVM_REVERT);
    });


    it('works when multi players', async () => {
      const betAmount = web3.utils.toWei('0.15', 'ether');
      const promises = [
        casino.bet(0, {from: player1, value: betAmount}),
        casino.bet(1, {from: player2, value: betAmount}),
      ];
      const results = await Promise.all(promises);
      const numberOfPlayers = await casino.numberOfPlayers();

      results.forEach(result => {
        expect(result.logs[0].event).to.be.eq('BetPlaced');
      })
      expect(numberOfPlayers.toNumber()).to.be.equal(3);
    });
  });

  //in order to test internal function make it public
  // describe('roll dice', async () => {
  //   it('should result in a number between 1 ~ 6', async () => {
  //     const result = await casino.rollDice.call();
  //     console.log('result', result.toNumber())
  //     expect(result.toNumber()).to.be.greaterThan(0).lessThan(7);
  //   });
  // })

  describe('betEnd', async () => {
    it('should be ended by others except admin', async () => {
      await casino.endBet({ from: player1 }).should.be.rejectedWith(EVM_REVERT);
    });

    it('should require owner ownership', async () => {
      await casino.endBet({from: player1}).should.be.rejectedWith(EVM_REVERT);
    });

    it('should end when requirements meet only for owner', async () => {
      const { logs: events } = await casino.endBet({from: admin});
      const currentBetId = await casino.currentBetId();
      const oldBet = await casino.bets(currentBetId - 1);
      const currentBet = await casino.bets(currentBetId);
      expect(oldBet.ended).to.be.equal(true);
      expect(currentBet.ended).to.be.equal(false);
      const lastEvent = events[events.length - 1];
      expect(lastEvent.event).to.be.eq('BetEnded');
      expect(lastEvent.args[0].ended).to.be.equal(true);
      expect(lastEvent.args[0].pairity).to.be.not.equal(2); // not equal default
      expect(Number(lastEvent.args[0].pair['dice1'])).to.be.greaterThanOrEqual(1).lessThanOrEqual(6);
      expect(Number(lastEvent.args[0].pair['dice2'])).to.be.greaterThanOrEqual(1).lessThanOrEqual(6);
    })
  })
});

