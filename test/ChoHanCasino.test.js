const ChoHanCasino = artifacts.require("ChoHanCasino.sol");


require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Casino', (accounts) => {
  let casino;

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

  describe('bet', async () => {
    it('correctly bet', async () => {
      const minNumberPlayer = await casino.minNumberPlayer();
      assert.equal(minNumberPlayer.toString(), '2', 'MinNumberPlayer is correct')

      const result = await casino.bet(3);
      console.log('result', result)
    })
  })
});

