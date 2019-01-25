const https = require('https');
const fs = require('fs');
const config = require('./config');
const { exec } = require('child_process');

const ECHO_SERVER = 'https://ipecho.net/plain';
const HereAmIFile = 'HereAmI';

let address = fs.readFileSync(HereAmIFile, 'utf8');

function hereAmI() {
    https.get(ECHO_SERVER, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
            return;
        }
        let echoIp = '';
        res.on('data', (chunk) => { echoIp += chunk; });
        res.on('end', () => {
            if (echoIp !== address) {
                fs.writeFileSync(HereAmIFile, echoIp);
                exec(`git add ${HereAmIFile} && git commit -m "I move to ${echoIp}" && git push`);
                address = echoIp;
            }
        });
    });
}

setInterval(hereAmI, config.interval * 1000);