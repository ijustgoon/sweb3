# sweb3-eth

This is a sub package of [web3.js][repo]

This is the Eth package to be used [web3.js][repo].
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install sweb3-eth
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/sweb3-eth.js` in your html file.
This will expose the `Web3Eth` object on the window object.


## Usage

```js
// in node.js
var Web3Eth = require('sweb3-eth');

var eth = new Web3Eth('ws://localhost:8546');
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ijustgoon/sweb3


