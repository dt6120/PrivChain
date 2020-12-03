const { Blockchain } = require('./simpleChain');
const { Block } = require('./Block');
const SHA256 = require('crypto-js/sha256');
const express = require('express');

class BlockController {
    constructor(app) {
        this.app = app;
        this.bc = new Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    getBlockByIndex() {
        this.app.get('/api/block/:index', (req, res) => {
            this.bc.getBlock(req.params.index)
                .then((result) => res.send(result))
                .catch((err) => res.status(404).send(err.toString()));
        });
    }

    postNewBlock() {
        this.app.post('/api/block', (req, res) => {
            if (req.body.data === '' || req.body.data === undefined) {
                res.status(403).send('Block data empty or invalid');
            }

            this.bc.addBlock(new Block(req.body.data))
                .then((result) => res.redirect(`/api/block/${result.height}`))
                .catch((err) => res.status(403).send(`Failed to add new block\n\n${err}`));
        });
    }
}

module.exports = (app) => {return new BlockController(app)};
