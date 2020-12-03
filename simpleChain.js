const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

const { Block } = require('./Block');

async function addLevelDBData(key, value) {
	try {
		await db.put(key, value);
	} catch (err) {
		throw err;
	}
}

async function getLevelDBData(key) {
	try {
		const result = await db.get(key);
		return result;
	} catch (err) {
		throw err;
	}
}

class Blockchain {
	constructor() {
		this.getBlockHeight()
			.then((result) => {
				if (!result) this.addBlock(new Block("Genesis block"));
			});
	}

	async addBlock(newBlock) {
		newBlock.time = new Date().getTime().toString().slice(0, -3);
		try {
			newBlock.height = await this.getBlockHeight();
		} catch (err) {
			throw new Error('Failed to get block count');
		}

		if (newBlock.height > 0) {
			try {
				newBlock.previousBlockhash = (await this.getBlock(newBlock.height - 1)).hash;
			} catch (err) {
				throw new Error('Failed to read blockchain data');
			}
		}

		newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

		try {
			addLevelDBData(newBlock.height, JSON.stringify(newBlock));
			return newBlock;
		} catch (err) {
			throw new Error('Failed to add new block');
		}
	}

	getBlockHeight() {
		return new Promise((resolve, reject) => {
			let count = 0;
			db.createReadStream()
				.on('data', (data) => {
					count++;
				})
				.on('error', (err) => {
					reject(`Unable to read data stream. ${err}`);
				})
				.on('close', () => {
					resolve(count);
				});
		});
	}

	async getBlock(blockHeight) {
		try {
			const block = await getLevelDBData(blockHeight);
			return JSON.parse(block);
		} catch (err) {
			throw new Error(`Block ${blockHeight} not found`);
		}
	}

	async validateBlock(blockHeight) {
		let block;

		try {
			block = await this.getBlock(blockHeight);
		} catch (err) {
			console.log(err);
		}

		let blockHash = block.hash;
		block.hash = "";
		let validBlockhash = SHA256(JSON.stringify(block)).toString();

		if (validBlockhash === blockHash) {
			return true;
		}
		else {
			return false;
		}
	}

	async validateChain() {
		let errorLog = [];
		let blockCount;

		try {
			blockCount = await this.getBlockHeight();
		} catch (err) {
			console.log('Error fetching block count');
		}

		for (let i = 0; i < blockCount - 1; ++i) {
			let block = await this.getBlock(i);

			try {
				let valid = await this.validateBlock(i);
				if (valid) {
					let nextBlock;
					try {
						nextBlock = await this.getBlock(i + 1);
					} catch (err) {
						console.log(`Error fetching block #${i + 1}`);
					}

					if (block.hash !== nextBlock.previousBlockhash) {
						errorLog.push(i);
					}
				} else {
					errorLog.push(i);
				}
			} catch (err) {
				console.log(`Error validating block #${i}`);
			}
		}

		try {
			let valid = this.validateBlock(blockCount - 1);
			if (!valid) errorLog.push(blockCount - 1);
		} catch (err) {
			console.log(`Error validating block #${blockCount - 1}`);
		}

		if (!errorLog.length) {
			return true;
		}
		else {
			console.log(errorLog);
			return false;
		}
	}

	getChain() {
		let chain = {};

		db.createReadStream()
			.on('data', (data) => {
				chain.data.key = data.value;
			})
			.on('error', (err) => {
				console.log('Error fetching block');
			})
		
			return chain;
	}
}

module.exports = { Blockchain };
