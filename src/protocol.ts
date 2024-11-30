import type { LookupServer } from './types';
import { SPECIAL_HOSTS, ARIN_HOST, IANA_HOST } from './constants/servers';
import hosts from './constants/hosts';
import net from 'node:net';

/** discards non-whois servers */
export const isValidRef = (ref: string) => {
  return !(ref.startsWith('www.') || /^http(s?):/.test(ref));
};

export const chooseServer = (domain: string): LookupServer => {
  if (!domain.length) {
    throw new Error('chooseServer: invalid domain');
  }

  if (net.isIPv4(domain) || net.isIPv6(domain)) {
    return {
      host: ARIN_HOST,
      ...SPECIAL_HOSTS[ARIN_HOST]
    };
  }

  const domainChunks = domain
    .toLowerCase()
    .split('.')
    .filter((chunk) => chunk.length > 0);

  if (domainChunks.length === 1) {
    return {
      host: IANA_HOST,
      ...SPECIAL_HOSTS[IANA_HOST]
    };
  }

  const tld = domainChunks[domainChunks.length - 1];
  if (tld in hosts) {
    const host = hosts[tld];
    return host in SPECIAL_HOSTS
      ? {
          ...SPECIAL_HOSTS[host],
          host
        }
      : { host };
  }

  return {
    host: IANA_HOST,
    ...SPECIAL_HOSTS[IANA_HOST]
  };
};
