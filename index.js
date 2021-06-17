const https = require('https');
const fs =  require('fs');
const childProcess = require('child_process');

const aliyun = require('./aliyun_client.js');
const config = require('./config.json');

const HereAmIFile = 'HereAmI';
const ipv4Regex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;

const accessKeyId = process.env.ACCESS_KEY_ID;
const accessKeySecret = process.env.ACCESS_KEY_SECRET;

const client = new aliyun.AliYunClient({
    ...config.aliDns,
    accessKeyId,
    accessKeySecret
});

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
    childProcess.exec(`git add ${HereAmIFile} && git commit -m "I move to ${echoIp}" && git push`);
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
                // TODO: change to addOrUpdateDomainRecord
                client.addDomainRecord(echoIp)
                    .then((result) => { console.log('Add domain record success:', result) })
                    .catch((err) => { console.error('Add domain record error:', err) });
                // FIXME: only update the cached IP when domain record is updated
                address = echoIp;
            }
        });
    }).on('error', (e) => {
        console.error(e);
    });
}

setInterval(hereAmI, config.interval * 1000);
