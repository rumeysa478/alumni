/**
 * @file src/middleware/notFoundGuardian.middleware.js
 * @description 404 Guardian Middleware
 * Sistemde tanımlı olmayan rotalar için 404 durum kodu ve açıklayıcı gerekçe (reason) döndürür.
 * Geçersiz web isteklerini (invalid request) generic 404 sayfasına (/404) yönlendirir.
 * 404 hatalarını logs/error.logs dosyasına yazar.
 */

import { writeErrorLog } from './logger.middleware.js';

export const notFoundGuardian = (req, res, next) => {
  const method = req.method;
  const route = req.originalUrl || req.url;
  const reason = req.notFoundReason ||
    res.locals.reason ||
    `Requested route '${method} ${route}' does not exist on this server.`;

  // Sonsuz döngüyü önlemek için /404 rotasında doğrudan render et
  if (req.path === '/404') {
    const invalidPath = req.query.path || route;
    return res.status(404).render('404', {
      title: 'Sayfa Bulunamadı (404)',
      path: invalidPath,
      reason: req.query.reason || reason
    });
  }

  const now = new Date();
  const time = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join(':');

  // logs/error.logs dosyasına hata kaydı ekle
  writeErrorLog(`[${now.toISOString()}] ${time} ${method} ${route} 404 - Not Found | Reason: ${reason}`);

  const isApi = req.originalUrl.startsWith('/api');
  const acceptsHtml = req.accepts('html') && !isApi;

  // Web tarayıcısı / HTML isteklerini generic 404 sayfasına yönlendir (Redirect invalid request)
  if (acceptsHtml) {
    return res.redirect(`/404?path=${encodeURIComponent(route)}&reason=${encodeURIComponent(reason)}`);
  }

  // REST API, fetch veya json istemcileri için JSON yanıtı
  return res.status(404).json({
    success: false,
    status: 404,
    error: 'Not Found',
    message: `Cannot ${method} ${route}`,
    reason: reason,
    redirectUrl: `/404?path=${encodeURIComponent(route)}`
  });
};

export default notFoundGuardian;
