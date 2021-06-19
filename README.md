# Here Am I

Look up your public network ip address and sync it to Github.

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) installed in your system
* [Git](https://git-scm.com/downloads) installed in your system
* You are able to connect Github with [SSH](https://help.github.com/articles/connecting-to-github-with-ssh/)

## Usage

1.  [Fork](https://github.com/wtango/HereAmI/fork) HereAmI to your own namespace.
2.  Clone the project to your machine
3.  Start the service with following command
   ``` bash
    # Start normally
    $ node index.js

    # Or start it as run in the background
    $ nohup node index.js &
   ```

Now you can get your IP with URL https://raw.githubusercontent.com/<Github Username\>/HereAmI/master/HereAmI

## Configuration

### configuration file
`config.json` under the project root directory is the configuration file for **WhereAmI**.

`interval`: The sync interval in seconds, default to 60s.

`echoServer`: Select which IP echo server should be used, current supported values are `sohu.com` & `ipecho.net`, default to `sohu.com`.

[aliDns](#alidns): To configure the Domain name info for the Aliyun NDS, it's used to update the IP to NDS server

#### <a id="aliDns">aliDns</a>
`aliDns.DomainName`: The domain you want to update the IP address to
`aliDns.RR`: The host record. For example, to resolve @.example.com, you must set RR to an at "@" instead of leaving it blank.

### Environment variables
To enable the `HereAmI` to sync the IP address to Aliyun DNS, you need to set bellow environment variables  
`ACCESS_KEY_ID`: Aliyun access key id
`ACCESS_KEY_SECRET`: Aliyun access key secret