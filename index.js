const https = require('https');
const http = require('http');
const fs = require('fs');
const config = require('./config');
const child_process = require('child_process');

const HereAmIFile = 'HereAmI';

const ECHO_SERVER = {
    'ipecho.net': {
        method: https.get,
        endpoint: 'https://ipecho.net/plain',
        parser: function (data) { return data; }
    },
    'ip.taobao.com': {
        method: http.get,
        endpoint: 'http://ip.taobao.com/service/getIpInfo.php?ip=myip',
        parser: function (data) { return JSON.parse(data).data.ip; }
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
