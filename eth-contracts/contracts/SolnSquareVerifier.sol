pragma solidity ^0.5.0;

import './ERC721Mintable.sol';


contract SolnSquareVerifier is REMERC721Token {

Verifier public sqVerifierContract;

constructor (address _address) public {
    sqVerifierContract = Verifier(_address);
}

struct Solution {
    uint256 tokenId;
    address toOwner;
}

Solution[] private solutions;

mapping(bytes32 => Solution) private uniqueSolutions;

event SolutionAdded(address toOwner,uint256 index);


function addSolution(bytes32 key, address to, uint256 tokenId) internal {
    Solution memory solution = Solution(tokenId,to);

    solutions.push(solution);
    uniqueSolutions[key] = solution;
    emit SolutionAdded(to, tokenId);
}

function mintToken (address to, uint256 tokenId,
                        uint[2] memory a,
                        uint[2] memory a_p,
                        uint[2][2] memory b,
                        uint[2] memory b_p,
                        uint[2] memory c,
                        uint[2] memory c_p,
                        uint[2] memory h,
                        uint[2] memory k,
                        uint[2] memory input
                        ) public returns (bool) {

    require(sqVerifierContract.verifyTx(a,a_p,b,b_p,c,c_p,h,k,input),"Solution Invalid");

    bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));

    require(uniqueSolutions[key].toOwner == address(0), "Solution exists!!");

    addSolution(key, to, tokenId);

    return super.mint(to,tokenId);
                        }
}
contract Verifier {

    function verifyTx(
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input
        ) public returns (bool);
}