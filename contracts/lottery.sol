// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract lottery is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 public s_subscriptionId;

    // Goerli coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 200000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 2;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    mapping(uint256 => address) public s_requestIdToAddress;
    uint256 public requestCounter;
    address s_owner;
    uint256 public fees = 0.1 ether; //mremember to remove public
    address better;
    uint256 betNumber;
    uint256[] public rewardsArray = [
        0 ether,
        0 ether,
        0.2 ether,
        0 ether,
        0.5 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0.8 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        2 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        0 ether,
        1.2 ether,
        0 ether,
        0 ether,
        0 ether
    ];

    uint256 public gameNumber = 0;

    //event to. emit the the random number, address, counter
    event EventGetResultGameOne(
        address better,
        uint256 counter,
        uint256 randomNumber,
        uint256 betNumber,
        bool isWinner
    );
    event EventGetResultGameTwo(
        address better,
        uint256 counter,
        uint256 randomNumber,
        uint256 reward
    );

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    function tryYourLuck(uint256 number) public payable {
        require(msg.value >= fees, "Sorry, need to pay more");
        require(number < 37 && number > 0, "Invalid number ");
        better = msg.sender;
        betNumber = number;
        gameNumber = 1;
        requestRandomWords();
    }

    function getRandomDiceNumber() public payable {
        require(msg.value >= fees, "Sorry, need to pay more");
        better = msg.sender;
        gameNumber = 2;
        requestRandomWords();
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() private returns (uint256) {
        // Will revert if subscription is not set and funded.
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requestIdToAddress[requestId] = msg.sender;

        // Store the latest requestId for this example.
        s_requestId = requestId;

        // Return the requestId to the requester.
        return requestId;
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = [(randomWords[0] % 11) + 2, (randomWords[1] % 36) + 1];
        if (gameNumber == 1) {
            bool isWinner = false;
            if (s_randomWords[1] == betNumber) {
                isWinner = true;
            }
            gameNumber == 0;
            verifyWinnerGameOne(isWinner);
        } else if (gameNumber == 2) {
            gameNumber == 0;
            verifyWinnerGameTwo();
        }
    }

    function verifyWinnerGameOne(bool _isWinner) private {
        emit EventGetResultGameOne(
            better,
            requestCounter,
            s_randomWords[1],
            betNumber,
            _isWinner
        );
        //increase counter on each request
        requestCounter += 1;
    }

    function verifyWinnerGameTwo() private {
        uint256 sendAmount = rewardsArray[s_randomWords[0] - 1];
        if (sendAmount != 0) {
            payable(better).transfer(sendAmount);
            emit EventGetResultGameTwo(
                better,
                requestCounter,
                s_randomWords[0],
                sendAmount
            );
        }
        emit EventGetResultGameTwo(
            better,
            requestCounter,
            s_randomWords[0],
            sendAmount
        );
        //increase counter on each request
        requestCounter += 1;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    function setFees(uint256 _fee) public onlyOwner {
        fees = _fee;
    }

    function withdrawEther(uint256 amount) public onlyOwner {
        require(address(this).balance > 0, "There is no balance to withdraw");
        require(amount < address(this).balance, "Insufficient balance");
        payable(msg.sender).transfer(amount);
    }
}
