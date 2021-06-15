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

`config.json` under the project root directory is the configuration file for **WhereAmI**.

`interval`: The sync interval in seconds, default to 60s.

`echoServer`: Select which IP echo server should be used, current supported values are `sohu.com` & `ipecho.net`, default to `sohu.com`.
