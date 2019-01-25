const https = require('https');
const fs = require('fs');
const config =require('./config');

const ECHO_SERVER = 'https://ipecho.net/plain';
const HereAmIFile = './HereAmI';

let address = fs.readFileSync(HereAmIFile);

function hereAmI() {
    https.get(ECHO_SERVER, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
            return;
        }
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            if (rawData !== address) {
                fs.writeFileSync(HereAmIFile, rawData);
                console.log(`address is not the same, origin: ${address}, echoServer: ${rawData}`);
                address = rawData;
            } else {
                console.log(`addresses are the same: ${rawData}`);
            }
        });
    });
}

setInterval(hereAmI, config.interval * 1000);