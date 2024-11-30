import type { LookupServer } from '../types';

export const IANA_HOST = 'whois.iana.org';
export const ARIN_HOST = 'whois.arin.net';

export const SPECIAL_HOSTS: Record<
  string,
  Pick<LookupServer, 'port' | 'prefix' | 'suffix' | 'encoding'>
> = {
  'whois.denic.de': {
    prefix: '-T dn,ace'
  },
  'whois.punktum.dk': {
    encoding: 'utf-8',
    prefix: '--charset=utf-8'
  },
  'whois.arin.net': {
    prefix: 'n'
  },
  // Source: https://github.com/rfc1036/whois/blob/next/servers_charset_list
  'whois.nic.cat': {
    encoding: 'utf-8',
    prefix: '-C UTF-8'
  },
  'whois.cat': {
    encoding: 'utf-8',
    prefix: '-C UTF-8'
  },
  'whois.corenic.net': {
    encoding: 'utf-8',
    prefix: '-C UTF-8'
  },
  'whois.online.rs.corenic.net': {
    encoding: 'utf-8',
    prefix: '-C UTF-8'
  },
  'whois.site.rs.corenic.net': {
    encoding: 'utf-8',
    prefix: '-C UTF-8'
  },
  'whois.museum': {
    encoding: 'utf-8',
    prefix: '-C UTF-8'
  },
  'whois.ripe.net': {
    encoding: 'iso-8859-1'
  },
  'whois.registro.br': {
    encoding: 'iso-8859-1'
  },
  'whois.dk-hostmaster.dk': {
    encoding: 'utf-8',
    prefix: '--charset=utf-8'
  },
  'whois.fi': {
    encoding: 'iso-8859-1'
  },
  'whois.nic.hu': {
    encoding: 'iso-8859-1'
  },
  'whois.isnic.is': {
    encoding: 'iso-8859-1'
  },
  'whois.nic.ad.jp': {
    encoding: 'iso-2022-jp'
  },
  'whois.kg': {
    encoding: 'cp1251'
  },
  'whois.dns.lu': {
    encoding: 'iso-8859-1'
  },
  'whois.norid.no': {
    encoding: 'iso-8859-1'
  }
};
