pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

//  Add a name and a symbol for your starNotary tokens
    string public tokenName = "StellaBlueToken";
    string public tokenSymbol = "StB";
    // uint256 public decimals = 18;
    // uint256 public initialSuply = 10000 * (10 ** decimals);

    function name() external view returns (string) { return tokenName; }

    function symbol() external view returns (string) { return tokenSymbol; }
//

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

// Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns(string memory) {
        Star memory retStar = tokenIdToStarInfo[_tokenId];
        return retStar.name; 
    }
//

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
    }

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.
    function exchangeStars(uint256 aStar, uint256 bStar, address aUser, address bUser) public {
        //use approve
        
        require(ownerOf(aStar) == aUser && ownerOf(bStar) == bUser);

        _removeTokenFrom(aUser, aStar);
        _addTokenTo(bUser, aStar);

        _removeTokenFrom(bUser, bStar);
        _addTokenTo(aUser, bStar);
    }

//

// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
    function transferStar(address to, uint256 _starId) public {
        require(ownerOf(_starId) == msg.sender);
        _removeTokenFrom(msg.sender, _starId);
        _addTokenTo(to, _starId);
    }

//

}
