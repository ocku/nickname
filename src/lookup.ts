import type { LookupOptions } from './types';

import { DEFAULT_WHOIS_PORT } from './constants/defaults';
import { connect, socksConnect, query } from './socket';

export const lookup = async (
  domain: string,
  options: Pick<LookupOptions, 'timeout' | 'server' | 'socksClientOptions'>
): Promise<string> => {
  const destination = {
    host: options.server.host,
    port: options.server.port ?? DEFAULT_WHOIS_PORT
  };

  const socket = options.socksClientOptions
    ? await socksConnect({
        destination,
        timeout: options.timeout,
        ...options.socksClientOptions
      })
    : await connect({ timeout: options.timeout, ...destination });

  return query(socket, domain, options.server);
};
