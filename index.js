const https = require('https');
const fs = require('fs');
const config = require('./config');
const child_process = require('child_process');

const HereAmIFile = 'HereAmI';
const ipv4Regex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;

const ECHO_SERVER = {
    'ipecho.net': {
        method: https.get,
        endpoint: 'https://ipecho.net/plain',
        parser: data => data
    },
    'sohu.com': {
        method: https.get,
        endpoint: 'https://pv.sohu.com/cityjson',
        parser: (data) => {
            // data example: 'var returnCitySN = {"cip": "61.140.211.216", "cid": "440103", "cname": "广东省广州市荔湾区"};'
            // should not use `eval` in case any security issue
            return data.match(ipv4Regex)[0];
        }
    }
}

var address = fs.readFileSync(HereAmIFile, 'utf8');

function syncIp(echoIp) {
    child_process.exec(`git add ${HereAmIFile} && git commit -m "I move to ${echoIp}" && git push`);
}

function hereAmI() {
    const echoServer = ECHO_SERVER[config.echoServer];
    echoServer.method(echoServer.endpoint, (res) => {
        const statusCode = res.statusCode;
        if (statusCode !== 200) {
            return;
        }
        var echoIp = '';
        res.on('data', (chunk) => { echoIp += chunk; });
        res.on('end', () => {
            echoIp = echoServer.parser(echoIp);
            if (echoIp !== address) {
                console.info(`I move to ${echoIp}`);
                fs.writeFileSync(HereAmIFile, echoIp);
                syncIp(echoIp);
                address = echoIp;
            }
        });
    }).on('error', (e) => {
        console.error(e);
    });
}

setInterval(hereAmI, config.interval * 1000);
