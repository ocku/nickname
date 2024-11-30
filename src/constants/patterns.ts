// See https://github.com/FurqanSoftware/node-whois/blob/master/index.coffee#L95C44-L95C187
export const REFERRAL_PATTERN =
  /(ReferralServer|Registrar Whois|Whois Server|WHOIS Server|Registrar WHOIS Server|refer):[^\S\n]*((?:r?whois|https?):\/\/)?([0-9A-Za-z.\-_]*)/;
