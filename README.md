# nicname

A low overhead asynchronous whois client for Node.js, successor to [ocku/whois](https://github.com/ocku/whois) and [ocku/whois-servers](https://github.com/ocku/whois-servers).

## Usage

```js
// format: nicname(domain, options?)
import { nicname } from 'nicname';
// or
const { nicname } = require('nicname');
```

```js
// Query an ipv4 address
console.log(await nicname('127.0.0.1')); // ...

// Query an ipv6 address
console.log(await nicname('::1')); // ...

// Query a domain
console.log(await nicname('lost.st')); // ...

// Query a domain with punycode
console.log(await nicname('lost.xn--tckwe')); // ...

// Query a tld
console.log(await nicname('de')); // ...
```

### Configuration

The behavior of the `nicname` function can be customized with the `options` parameter, which has the following structure:

```ts
export type LookupOptions = {
  /**
   * The number of referrals to follow
   * @default 10
   */
  follow: number;
  /**
   * Defines the behavior for what will happen if there are referrals left to follow when the follow limit is reached
   * - throw -> throw an error
   * - nothrow -> return the last response available
   * @default 'throw'
   */
  exceededFollowLimitBehavior?: 'throw' | 'nothrow';
  /**
   * The server to target
   */
  server: {
    /**
     * The address or domain name of the host to target. Do not specify the port here.
     */
    host: string;
    /**
     * The port to send the request to.
     * @default 43
     */
    port?: number;
    /**
     * The query flags specified before the host.
     * Usually handles (eg: '-T dn,ace' or 'n').
     */
    prefix?: string;
    /**
     * The query flags specified after the host.
     * These are uncommon.
     */
    suffix?: string;
    /**
     * The encoding to pass the output to.
     * Supported encodings: https://nodejs.org/docs/v22.11.0/api/util.html#encodings-supported-by-default-with-full-icu-data
     */
    encoding?: string;
  };
  /**
   * The socket timeout in milliseconds
   */
  timeout?: number;
  /**
   * SocksClient connection options.
   * When present, this parameter is directly passed to SocksClient.createConnection() or SocksClient.createConnectionChain() depending on the value of socksClientOptions.chain.
   */
  socksClientOptions?:
    | Omit<
        {
          chain?: false;
        } & SocksClientOptions,
        'destination'
      >
    | Omit<
        {
          chain: true;
        } & SocksClientChainOptions,
        'destination'
      >;
};
```

It can be used like this:

```js
const options = { timeout: 10000 };
const res = await nicname('lost.st', options);
console.log(res); // ...
```

### Punycode

Punycode domain lookups are supported, but to keep overhead low, special Unicode characters are not automatically transcoded to LDH.

For clarity:

```js
const { toASCII } = require('punycode/');
// this is good
await nicname('nic.xn--tckwe'); // works
await nicname(toASCII('nic.コム')); // works
// this is bad
await nicname('nic.コム'); // goes through IANA, returns "No match"
```

## Requirements

This library requires Node LTS (>=22.11.0) to work.

## Release schedule

Releases are published on a bimonthly basis, occurring on the 1st and 15th of each month, provided there are updates or changes to include.

In the event of a security issue, a release will be issued immediately, regardless of the regular release schedule.
