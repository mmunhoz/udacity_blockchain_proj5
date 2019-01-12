//import 'babel-polyfill';
const StarNotary = artifacts.require('./StarNotary.sol')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
    accounts = accs;
    instance = await StarNotary.deployed();
  });

  it('can Create a Star', async() => {
    let tokenId = 1;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
  });

  it('lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('lets user1 get the funds after the sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 3
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)
    assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
  });

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('lets user2 buy a star and decreases its balance in ether', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)
    assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
  });

  // Write Tests for:

// 1) The token name and token symbol are added properly.
  it('lets check token name and symbol', async()=> {
    assert.equal(await instance.name(), "StellaBlueToken");
    assert.equal(await instance.symbol(), "StB");
  });

//

// 2) 2 users can exchange their stars.
  it('lets users exchange stars', async()=> {
    let userA = accounts[2]; // 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
    let userB = accounts[3]; // 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
    
    let aStarId = 7;
    let bStarId = 8;

    await instance.createStar('a star', aStarId, {from: userA});
    await instance.createStar('b star', bStarId, {from: userB});

    await instance.exchangeStars(aStarId, bStarId, userA, userB);

    let ownerStarA = await instance.ownerOf.call(aStarId);
    let ownerStarB = await instance.ownerOf.call(bStarId);

    assert.equal(ownerStarA, userB);
    assert.equal(ownerStarB, userA);
  });

//

// 3) Stars Tokens can be transferred from one address to another.
  it('lets transfer a star from an address to another', async()=> {
    let accFrom = accounts[2]; // 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
    let accTo = accounts[3]; // 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
    let starId = 6

    await instance.createStar('blue shooting star', starId, {from: accFrom});

    await instance.transferStar(accTo, starId, {from: accFrom});

    assert.equal(await instance.ownerOf.call(starId), accTo);

  });

//