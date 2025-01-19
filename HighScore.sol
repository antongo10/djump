// HighScore.sol
pragma solidity ^0.8.0;

contract HighScore {
    uint public highScore;
    address public highScorer;

    event NewHighScore(uint score, address scorer);

    function setHighScore(uint score) external {
        require(score > highScore, "Score must be higher than current high score");
        highScore = score;
        highScorer = msg.sender;
        emit NewHighHighScore(score, msg.sender);
    }
}