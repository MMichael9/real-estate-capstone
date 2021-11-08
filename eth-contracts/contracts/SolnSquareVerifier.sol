pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import './Verifier.sol';
import './ERC721Mintable.sol';
import "./Oraclize.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token
{
    Verifier public verifier;

    constructor(address verifierAddress) CustomERC721Token() public
    {
        verifier = Verifier(verifierAddress);
    }



// TODO define a solutions struct that can hold an index & an address
    struct Solutions
    {
        uint256 index;
        address solAddress;
    }


// TODO define an array of the above struct
    Solutions [] private _solutionsArray;

// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solutions) private _solutionsMapping;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenAdded, address addressAdded);

// TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 solnTokenId, address solnAddress, bytes32 key) public
    {
        Solutions memory soln = Solutions(solnTokenId, solnAddress);
        _solutionsArray.push(soln);
        _solutionsMapping[key] = soln;
        emit SolutionAdded(solnTokenId, solnAddress);
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mint(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, uint256 tokenId) public
    {
        require(verifier.verifyTx(a, b, c, input), "Wrong Solution!");
        
        bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
        require(_solutionsMapping[key].solAddress == address(0),"Solution already exists!");

        addSolution(tokenId, msg.sender, key);
        super.mint(msg.sender, tokenId, uint2str(tokenId));
    }

}  


























