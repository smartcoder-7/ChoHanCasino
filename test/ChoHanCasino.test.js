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
      const totalBet = web3.utils.fromWei(await casino.totalBet());
      const {id, amountBet, numberSelected, playerAddress} = await casino.players(0);

      expect(totalBet).to.be.eq(BET_AMOUNT);
      expect(id.toNumber()).to.be.eq(0);
      expect(web3.utils.fromWei(amountBet)).to.be.eq(BET_AMOUNT);
      expect(numberSelected.toNumber()).to.be.eq(1);
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

      results.forEach(result => {
        expect(result.logs[0].event).to.be.eq('BetPlaced');
      })
    })
  });

  describe('betEnd', async () => {
    it('should be ended by others except admin', async () => {
      await casino.betEnd({ from: player1 }).should.be.rejectedWith(EVM_REVERT);
    });

    it('should end when requirements meet only for owner', async () => {
      const { logs: events } = await casino.betEnd({from: admin});
      const promises = [
        casino.totalBet(),
        casino.numberWinner(),
        casino.bets(0),
      ];
      const [oldTotalBet, oldNumberWinner, bet] = await Promise.all(promises);
      expect(oldTotalBet.toNumber()).to.be.eq(0);
      expect(oldNumberWinner.toNumber()).to.be.eq(2);
      expect(oldTotalBet.toNumber()).to.be.eq(0);

      console.log('event==>', events)
      events.forEach(({event: name, args}) => {
        expect(name).to.be.eq('Won');
      });
    })
  })
});
