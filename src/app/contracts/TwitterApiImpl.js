module.exports = [{
    "inputs": [{
        "internalType": "string",
        "name": "text",
        "type": "string"
    }],
    "name": "addTweet",
    "outputs": [{
        "internalType": "string",
        "name": "",
        "type": "string"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "getMyAddress",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "tweetId",
        "type": "uint256"
    }, {
        "internalType": "string",
        "name": "text",
        "type": "string"
    }],
    "name": "updateTweet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "tweetId",
        "type": "uint256"
    }],
    "name": "deleteTweet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "lastId",
        "type": "uint256"
    }],
    "name": "getTweets",
    "outputs": [{
        "components": [{
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "publishedAt",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }, {
            "internalType": "string",
            "name": "text",
            "type": "string"
        }, {
            "internalType": "address[]",
            "name": "likes",
            "type": "address[]"
        }, {
            "internalType": "address[]",
            "name": "retweets",
            "type": "address[]"
        }, {
            "internalType": "bool",
            "name": "deleted",
            "type": "bool"
        }],
        "internalType": "struct TwitterApiImpl.Tweet[]",
        "name": "",
        "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "tweetId",
        "type": "uint256"
    }],
    "name": "retweet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "tweetId",
        "type": "uint256"
    }],
    "name": "like",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}]