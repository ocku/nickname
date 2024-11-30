import type { SocksClientChainOptions, SocksClientOptions } from 'socks';

/**
 * Parameters to query the lookup server
 */
export type LookupServer = {
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
 * Options for configuring the WHOIS lookup
 */
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
  server: LookupServer;
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
