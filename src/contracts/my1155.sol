// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract GameItems is ERC1155 {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant AKIRA = 2;
    uint256 public constant SPIDY = 3;
    uint256 public constant AKANE = 4;
    uint256 public constant SHEEPY = 5;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 10**9, "");
        _mint(msg.sender, SILVER, 10**18, "");
        _mint(msg.sender, AKIRA, 1, "");
        _mint(msg.sender, SPIDY, 100, "");
        _mint(msg.sender, AKANE, 1, "");
        _mint(msg.sender, SHEEPY, 1, "");
    }

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }
    
    function setTokenUri(uint256 tokenId, string memory uri) public onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice"); 
        _uris[tokenId] = uri; 
    }
}