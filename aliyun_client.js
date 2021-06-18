const Core = require('@alicloud/pop-core');

class AliYunClient {
  constructor(options) {
    this.options = options;
    this.client = new Core({
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
      endpoint: 'https://alidns.aliyuncs.com',
      apiVersion: '2015-01-09'
    });
    this.domainParams = {
      DomainName: options.DomainName,
      RR: options.RR,
      Type: 'A',
      Value: undefined
    };
    this.requestOption = {
      method: 'POST'
    };
  }

  req(action, p) {
    return this.client.request(action, { ...this.domainParams, ...p }, this.requestOption);
  }

  addDomainRecord(ip) {
    return this.req('AddDomainRecord', { Value: ip });
  }
}

module.exports = {
  AliYunClient
}