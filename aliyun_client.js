const Core = require('@alicloud/pop-core');

class BreakSignal {

}

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

  describeSubDomainRecords() {
    return this.req('DescribeSubDomainRecords', { SubDomain: `${this.domainParams.RR}.${this.domainParams.DomainName}` });
  }

  deleteDomainRecord(RecordId) {
    return this.req('DeleteDomainRecord', { RecordId });
  }

  addOrUpdateDomainRecord(ip) {
    return this.describeSubDomainRecords()
      .then((result) => {
        let sameRecordExist = false;
        result.DomainRecords.Record.forEach((record) => {
          if (record.Value === ip) {
            console.info(`IP existing on current DNS configuration`);
            sameRecordExist = true;
          } else {
            // delete all the unmatched records
            console.info(`delete record: `, record);
            return this.deleteDomainRecord(record.RecordId);
          }
        });
        if (sameRecordExist) {
          throw new BreakSignal();
        }
      })
      .then(() => {
        return this.addDomainRecord(ip);
      })
      .catch((err) => {
        if (err instanceof BreakSignal) {
          // normal finish the operation
        } else {
          throw err;
        }
      });
  }
}

module.exports = {
  AliYunClient
}