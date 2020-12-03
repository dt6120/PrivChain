const express = require('express');
const bodyParser = require('body-parser');

class BlockAPI {
    constructor() {
        this.app = express();
        this.initExpress();
        this.initExpressMiddleware();
        this.initControllers();
        this.start();
    }

    initExpress() {
        this.app.set('port', 8000);
    }

    initExpressMiddleware() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    initControllers() {
        this.app.get('/', (Req, res) => {
            res.send('Your API is working.');
        });

        require('./BlockController')(this.app);
    }

    start() {
        let self = this;
        this.app.listen(this.app.get('port'), () => {
            console.log(`Listening on port ${this.app.get('port')}...`);
        });
    }
}

new BlockAPI();
