// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;
    string public name;

    constructor(string memory _name) {
        name = _name;
    }

    function increment() public {
        count += 1;
    }

    function decrement() public {
        if (count > 0) {
            count -= 1;
        }
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function reset() public {
        count = 0;
    }
}
