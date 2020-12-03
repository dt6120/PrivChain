# Building your own Private Blockchain

This blockchain stores and persists data using LevelDB. It has API endpoints that can be used to fetch blocks from the blockchain and add blocks to the blockchain (only if valid data is provided). Each block as well as the whole blockchain can be validated anytime by the user.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

* [Node.js](https://nodejs.org/en/download/)
* [npm](https://www.npmjs.com/get-npm) (downloaded automatically with Node.js)
* [Postman](https://www.postman.com/downloads/) (optional) - to test the API endpoints during development

### Installing

A step by step series of examples that tell you how to get a development env running

Get the code

```
git clone https://github.com/dt6120/PrivChain.git
```

Install dependencies

```
cd PrivChain
npm install
```

Run the server

```
npm start
```

Open Postman (or browser) and go to

```
http://127.0.0.1:8000
```

Two endpoints have been provided

```
GET -  http://127.0.0.1:8000/api/block/{blockIndex}
POST - http://127.0.0.1:8000/api/block
```

## Built With

* [Express](https://expressjs.com/) - Web framework for Node.js
* [LevelDB](https://www.npmjs.com/package/level) - Fast & simple storage for blockchain

## Authors

* **Dhruv Takwal**

## License

This project is licensed under the MIT License.
