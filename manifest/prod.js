module.exports = {
  permissions: [
    'contextMenus',
    'notifications',
    'tabs',
    'storage',
    '<all_urls>'
  ],
  content_security_policy:
    "object-src 'self' ;script-src 'self'; style-src * 'unsafe-inline'; img-src 'self' data:;"
};
