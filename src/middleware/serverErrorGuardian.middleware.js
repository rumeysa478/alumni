/**
 * @file src/middleware/serverErrorGuardian.middleware.js
 * @description 5xx Guardian Middleware
 * Sunucu tarafında meydana gelen 5xx ve yakalanmamış dahili hataları yakalar ve açıklayıcı bir gerekçe (reason) ile döndürür.
 * Hataları logs/error.logs dosyasına yazar.
 */

import { writeErrorLog } from './logger.middleware.js';

export const serverErrorGuardian = (err, req, res, next) => {
  console.error('5xx Guardian caught error:', err);

  const rawStatus = err.status || err.statusCode || 500;
  const status = (typeof rawStatus === 'number' && rawStatus >= 400 && rawStatus < 600)
    ? rawStatus
    : 500;

  const reason = err.reason ||
    err.message ||
    'Internal server error occurred while processing the request.';

  const is5xx = status >= 500;
  const errorName = is5xx ? 'Internal Server Error' : (err.error || 'Server Error');

  const now = new Date();
  const time = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join(':');

  const method = req && req.method ? req.method : 'SERVER';
  const route = req && (req.originalUrl || req.url) ? (req.originalUrl || req.url) : '/';

  // logs/error.logs dosyasına hata kaydını yaz
  writeErrorLog(`[${now.toISOString()}] ${time} ${method} ${route} ${status} - Error: ${err.message || errorName} | Reason: ${reason}`);

  const acceptsHtml = req && req.accepts && req.accepts('html') &&
    !(req.originalUrl && req.originalUrl.startsWith('/api')) &&
    Boolean(req.headers && req.headers.accept && req.headers.accept.includes('text/html'));

  if (acceptsHtml) {
    return res.status(status).render('error', {
      title: `Sunucu Hatası (${status})`,
      message: err.message || 'Beklenmeyen bir sunucu hatası oluştu.',
      reason: reason
    });
  }

  return res.status(status).json({
    success: false,
    status: status,
    error: errorName,
    message: err.message || 'Beklenmeyen bir dahili sunucu hatası oluştu.',
    reason: reason
  });
};

export default serverErrorGuardian;
