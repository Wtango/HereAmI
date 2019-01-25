const https = require('https');
const fs = require('fs');
const config = require('./config');
const child_process = require('child_process');

const ECHO_SERVER = 'https://ipecho.net/plain';
const HereAmIFile = 'HereAmI';

var address = fs.readFileSync(HereAmIFile, 'utf8');

function hereAmI() {
    https.get(ECHO_SERVER, (res) => {
        const statusCode = res.statusCode;
        if (statusCode !== 200) {
            return;
        }
        var echoIp = '';
        res.on('data', (chunk) => { echoIp += chunk; });
        res.on('end', () => {
            if (echoIp !== address) {
                fs.writeFileSync(HereAmIFile, echoIp);
                child_process.exec(`git add ${HereAmIFile} && git commit -m "I move to ${echoIp}" && git push`);
                address = echoIp;
            }
        });
    });
}

setInterval(hereAmI, config.interval * 1000);
