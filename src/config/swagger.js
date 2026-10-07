export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '🎓 Alumni Tracking System API & Web Docs',
    version: '1.0.0',
    description: 'Üniversite mezunları ve öğrenciler için Mezun Takip Sistemi RESTful API ve MVC Web Görünüm dokümantasyonu.',
    contact: {
      name: 'Rümeysa Aydın',
      url: 'https://github.com/rumeysa478/alumni'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Lokal Geliştirme Sunucusu (Varsayılan Port 5000)'
    },
    {
      url: 'http://localhost:3000',
      description: 'Alternatif Port 3000'
    }
  ],
  tags: [
    {
      name: 'Kullanıcı Web Arayüzü (MVC Views)',
      description: 'HTML ve EJS şablonları kullanan Web Sayfası Rotaları (CRUD)'
    },
    {
      name: 'Kullanıcı REST API (JSON)',
      description: 'İstemciler (mobil, frontend, postman) için JSON tabanlı RESTful API Rotaları (CRUD)'
    },
    {
      name: 'Duyurular Web Arayüzü (MVC Views)',
      description: 'Duyurular için HTML/EJS Web Sayfası Yönetim Arayüzü (CRUD)'
    },
    {
      name: 'Duyurular REST API (JSON)',
      description: 'Duyurular için JSON tabanlı RESTful API Uç Noktaları (CRUD)'
    },
    {
      name: 'Sistem',
      description: 'Sistem sağlığı ve çalışma durumu uç noktaları'
    }
  ],
  paths: {
    '/users': {
      get: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Mezun ve Öğrenci Listesi Sayfası (Read - Listings)',
        description: 'Tüm kullanıcıların listelendiği, arama ve filtreleme destekli duyarlı HTML web sayfasını render eder.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            required: false,
            description: 'İsim, e-posta veya bölüme göre arama terimi',
            schema: { type: 'string', example: 'Rümeysa' }
          },
          {
            name: 'role',
            in: 'query',
            required: false,
            description: 'Rol filtreleme',
            schema: { type: 'string', enum: ['ALUMNI', 'STUDENT', 'ADMIN'] }
          }
        ],
        responses: {
          '200': {
            description: 'Kullanıcı listesi HTML sayfası başarıyla render edildi.',
            content: {
              'text/html': {
                schema: { type: 'string', example: '<!DOCTYPE html><html>...</html>' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Yeni Kullanıcı Oluşturma (Create - HTML Form)',
        description: 'Web formundan gönderilen verilerle kullanıcı oluşturur ve kullanıcı listesine yönlendirir (302 Redirect).',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/CreateUserInput' }
            }
          }
        },
        responses: {
          '302': {
            description: 'Kullanıcı başarıyla oluşturuldu ve /users sayfasına yönlendirildi.'
          },
          '400': {
            description: 'Doğrulama hatası (Hata mesajıyla form yeniden render edilir).'
          }
        }
      }
    },
    '/users/new': {
      get: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Yeni Kullanıcı Kayıt Form Sayfası (View)',
        description: 'Yeni mezun veya öğrenci eklemek için gereken HTML form arayüzünü render eder.',
        responses: {
          '200': {
            description: 'Kullanıcı kayıt formu HTML sayfası.',
            content: {
              'text/html': {
                schema: { type: 'string' }
              }
            }
          }
        }
      }
    },
    '/users/{id}': {
      get: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Kullanıcı Profil Detay Sayfası (Read - Detail)',
        description: 'ID numarasına göre kullanıcının profil detaylarını içeren HTML sayfasını render eder.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Kullanıcı ID numarası',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Kullanıcı profil sayfası.',
            content: {
              'text/html': { schema: { type: 'string' } }
            }
          },
          '404': {
            description: 'Kullanıcı bulunamadı sayfası.'
          }
        }
      },
      post: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Kullanıcı Bilgilerini Güncelle (Update - HTML Form)',
        description: 'HTML formundan gönderilen güncellenmiş bilgileri kaydeder ve kullanıcı sayfasına yönlendirir.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Güncellenecek kullanıcı ID',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' }
            }
          }
        },
        responses: {
          '302': {
            description: 'Kullanıcı başarıyla güncellendi ve detay sayfasına yönlendirildi.'
          },
          '400': {
            description: 'Doğrulama hatası.'
          },
          '404': {
            description: 'Kullanıcı bulunamadı.'
          }
        }
      }
    },
    '/users/{id}/edit': {
      get: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Kullanıcı Düzenleme Form Sayfası (View)',
        description: 'Mevcut kullanıcının bilgileriyle doldurulmuş düzenleme formunu render eder.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Düzenlenecek kullanıcı ID',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Düzenleme formu HTML sayfası.',
            content: {
              'text/html': { schema: { type: 'string' } }
            }
          },
          '404': {
            description: 'Kullanıcı bulunamadı.'
          }
        }
      },
      post: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Kullanıcı Düzenleme Formu Gönderimi (Update)',
        description: 'Düzenleme formundan gelen verileri günceller.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '302': {
            description: 'Kullanıcı güncellendi ve yönlendirildi.'
          }
        }
      }
    },
    '/users/{id}/delete': {
      post: {
        tags: ['Kullanıcı Web Arayüzü (MVC Views)'],
        summary: 'Kullanıcıyı Sil (Delete - Action)',
        description: 'HTML form butonu üzerinden kullanıcıyı siler ve listeye yönlendirir.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Silinecek kullanıcı ID',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '302': {
            description: 'Kullanıcı başarıyla silindi ve /users sayfasına yönlendirildi.'
          },
          '404': {
            description: 'Kullanıcı bulunamadı.'
          }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Kullanıcı REST API (JSON)'],
        summary: 'Tüm Kullanıcıları JSON Olarak Listele (Read)',
        description: 'Sistemde kayıtlı kullanıcıları filtreleme parametreleriyle birlikte JSON formatında döner.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Arama sorgusu',
            schema: { type: 'string' }
          },
          {
            name: 'role',
            in: 'query',
            description: 'Rol filtresi',
            schema: { type: 'string', enum: ['ALUMNI', 'STUDENT', 'ADMIN'] }
          }
        ],
        responses: {
          '200': {
            description: 'Kullanıcı listesi başarıyla getirildi.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 3 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Kullanıcı REST API (JSON)'],
        summary: 'Yeni Kullanıcı Oluştur (Create - JSON / Form)',
        description: 'JSON veya form formatında yeni kullanıcı kaydı ekler.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserInput' }
            },
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/CreateUserInput' }
            },
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/CreateUserInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Kullanıcı başarıyla oluşturuldu.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Kullanıcı başarıyla oluşturuldu (In-Memory).' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Geçersiz parametreler veya eksik zorunlu alanlar.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '409': {
            description: 'E-posta adresi zaten kullanımda.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Kullanıcı REST API (JSON)'],
        summary: 'ID ile Kullanıcı Getir (Read)',
        description: 'Belirtilen ID numarasına sahip kullanıcının detaylarını JSON döner.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Kullanıcı ID numarası',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Kullanıcı bulundu.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Geçersiz ID formatı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '404': {
            description: 'Kullanıcı bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Kullanıcı REST API (JSON)'],
        summary: 'Kullanıcıyı Tam Güncelle (Update - PUT)',
        description: 'Kullanıcının tüm güncellenebilir alanlarını revize eder.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Güncellenecek kullanıcı ID',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' }
            },
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Kullanıcı başarıyla güncellendi.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'ID 1 olan kullanıcı başarıyla güncellendi (PUT).' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Geçersiz veri veya format hatası.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '404': {
            description: 'Kullanıcı bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Kullanıcı REST API (JSON)'],
        summary: 'Kullanıcıyı Kısmi Güncelle (Update - PATCH)',
        description: 'Yalnızca iletilen alanları günceller.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Güncellenecek kullanıcı ID',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatchUserInput' }
            },
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/PatchUserInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Kullanıcı başarıyla kısmi güncellendi.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'ID 1 olan kullanıcı başarıyla kısmi güncellendi (PATCH).' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Kullanıcı bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Kullanıcı REST API (JSON)'],
        summary: 'Kullanıcıyı Sil (Delete)',
        description: 'Belirtilen ID numarasına sahip kullanıcıyı in-memory veri tabanından siler.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Silinecek kullanıcı ID',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Kullanıcı başarıyla silindi.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'ID 1 olan kullanıcı başarıyla silindi.' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Kullanıcı bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/announcements': {
      get: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Duyuruları Listeleme Sayfası (MVC View - Read)',
        description: 'Tüm duyuruları arama ve filtreleme seçenekleriyle HTML formatında listeler.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Başlık, içerik veya yazara göre arama',
            schema: { type: 'string' }
          },
          {
            name: 'category',
            in: 'query',
            description: 'Duyuru kategorisi',
            schema: { type: 'string', enum: ['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'] }
          },
          {
            name: 'target_audience',
            in: 'query',
            description: 'Hedef kitle',
            schema: { type: 'string', enum: ['ALL', 'ALUMNI', 'STUDENT'] }
          }
        ],
        responses: {
          '200': {
            description: 'Duyuru listesi HTML sayfası.',
            content: { 'text/html': { schema: { type: 'string' } } }
          }
        }
      },
      post: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Yeni Duyuru Oluşturma (Create - HTML Form)',
        description: 'Web formundan gelen verilerle yeni duyuru oluşturup yönlendirir.',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/CreateAnnouncementInput' }
            }
          }
        },
        responses: {
          '302': { description: 'Duyuru oluşturuldu ve /announcements sayfasına yönlendirildi.' },
          '400': { description: 'Doğrulama hatası.' }
        }
      }
    },
    '/announcements/new': {
      get: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Yeni Duyuru Ekleme Form Sayfası (View)',
        description: 'Duyuru ekleme formunu render eder.',
        responses: {
          '200': {
            description: 'Duyuru formu HTML sayfası.',
            content: { 'text/html': { schema: { type: 'string' } } }
          }
        }
      }
    },
    '/announcements/{id}': {
      get: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Duyuru Detay Sayfası (Read - Detail)',
        description: 'ID numarasına göre duyuru detay sayfasını render eder.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Duyuru detay sayfası HTML.',
            content: { 'text/html': { schema: { type: 'string' } } }
          },
          '404': { description: 'Duyuru bulunamadı.' }
        }
      },
      post: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Duyuru Güncelleme (Update - HTML Form)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/UpdateAnnouncementInput' }
            }
          }
        },
        responses: {
          '302': { description: 'Duyuru güncellendi ve yönlendirildi.' }
        }
      }
    },
    '/announcements/{id}/edit': {
      get: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Duyuru Düzenleme Form Sayfası (View)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': { description: 'Duyuru düzenleme formu HTML.' },
          '404': { description: 'Duyuru bulunamadı.' }
        }
      },
      post: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Duyuru Düzenleme Formu Gönderimi (Update)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '302': { description: 'Duyuru güncellendi ve yönlendirildi.' }
        }
      }
    },
    '/announcements/{id}/delete': {
      post: {
        tags: ['Duyurular Web Arayüzü (MVC Views)'],
        summary: 'Duyuruyu Sil (Delete - Action)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '302': { description: 'Duyuru silindi ve yönlendirildi.' },
          '404': { description: 'Duyuru bulunamadı.' }
        }
      }
    },
    '/api/announcements': {
      get: {
        tags: ['Duyurular REST API (JSON)'],
        summary: 'Tüm Duyuruları JSON Olarak Listele (Read)',
        description: 'Duyuruları filtreleme kriterleriyle birlikte JSON listesi olarak döner.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' }
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', enum: ['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'] }
          },
          {
            name: 'target_audience',
            in: 'query',
            schema: { type: 'string', enum: ['ALL', 'ALUMNI', 'STUDENT'] }
          }
        ],
        responses: {
          '200': {
            description: 'Duyuru listesi başarıyla getirildi.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 3 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Announcement' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Duyurular REST API (JSON)'],
        summary: 'Yeni Duyuru Oluştur (Create - JSON)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAnnouncementInput' }
            },
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/CreateAnnouncementInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Duyuru oluşturuldu.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Duyuru başarıyla oluşturuldu (In-Memory).' },
                    data: { $ref: '#/components/schemas/Announcement' }
                  }
                }
              }
            }
          },
          '400': { description: 'Zorunlu alanlar eksik veya geçersiz.' }
        }
      }
    },
    '/api/announcements/{id}': {
      get: {
        tags: ['Duyurular REST API (JSON)'],
        summary: 'ID ile Duyuru Getir (Read)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Duyuru bulundu.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Announcement' }
                  }
                }
              }
            }
          },
          '404': { description: 'Duyuru bulunamadı.' }
        }
      },
      put: {
        tags: ['Duyurular REST API (JSON)'],
        summary: 'Duyuruyu Tam Güncelle (Update - PUT)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateAnnouncementInput' }
            }
          }
        },
        responses: {
          '200': { description: 'Duyuru güncellendi.' },
          '404': { description: 'Duyuru bulunamadı.' }
        }
      },
      patch: {
        tags: ['Duyurular REST API (JSON)'],
        summary: 'Duyuruyu Kısmi Güncelle (Update - PATCH)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': { description: 'Duyuru kısmi güncellendi.' },
          '404': { description: 'Duyuru bulunamadı.' }
        }
      },
      delete: {
        tags: ['Duyurular REST API (JSON)'],
        summary: 'Duyuruyu Sil (Delete)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': { description: 'Duyuru başarıyla silindi.' },
          '404': { description: 'Duyuru bulunamadı.' }
        }
      }
    },
    '/api/health': {
      get: {
        tags: ['Sistem'],
        summary: 'Sistem Sağlık Kontrolü',
        description: 'Sunucunun çalışma süresi (uptime), donanım/bellek kullanımı ve ortam bilgilerini JSON formatında döner.',
        responses: {
          '200': {
            description: 'Sistem sağlıklı çalışıyor.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'UP' },
                    timestamp: { type: 'string', example: '2026-09-30T07:45:00.000Z' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'rumeysa.aydin@alumni.edu' },
          first_name: { type: 'string', example: 'Rümeysa' },
          last_name: { type: 'string', example: 'Aydın' },
          role: { type: 'string', enum: ['STUDENT', 'ALUMNI', 'ADMIN'], example: 'ALUMNI' },
          department: { type: 'string', example: 'Yönetim Bilişim Sistemleri' },
          graduation_year: { type: 'integer', nullable: true, example: 2024 },
          is_verified: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time', example: '2026-09-30T07:35:56.824Z' },
          updated_at: { type: 'string', format: 'date-time', nullable: true, example: null }
        }
      },
      CreateUserInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'yeni.mezun@alumni.edu' },
          password: { type: 'string', format: 'password', example: 'gucluSifre123' },
          first_name: { type: 'string', example: 'Ayşe' },
          last_name: { type: 'string', example: 'Demir' },
          role: { type: 'string', enum: ['STUDENT', 'ALUMNI', 'ADMIN'], default: 'ALUMNI', example: 'ALUMNI' },
          department: { type: 'string', example: 'Bilgisayar Mühendisliği' },
          graduation_year: { type: 'integer', example: 2025 },
          is_verified: { type: 'boolean', example: false }
        }
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'guncel.mezun@alumni.edu' },
          first_name: { type: 'string', example: 'Ayşe' },
          last_name: { type: 'string', example: 'Demir' },
          role: { type: 'string', enum: ['STUDENT', 'ALUMNI', 'ADMIN'], example: 'ALUMNI' },
          department: { type: 'string', example: 'Yazılım Mühendisliği' },
          graduation_year: { type: 'integer', example: 2025 },
          is_verified: { type: 'boolean', example: true }
        }
      },
      PatchUserInput: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'yeni.email@alumni.edu' },
          first_name: { type: 'string', example: 'Yeniİsim' },
          last_name: { type: 'string', example: 'YeniSoyisim' },
          role: { type: 'string', enum: ['STUDENT', 'ALUMNI', 'ADMIN'], example: 'ADMIN' },
          department: { type: 'string', example: 'Veri Bilimi' },
          graduation_year: { type: 'integer', example: 2027 },
          is_verified: { type: 'boolean', example: true }
        }
      },
      Announcement: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: '🎓 2026 Mezunlar Günü Buluşması' },
          content: { type: 'string', example: 'Geleneksel mezunlar günü etkinliğimiz kampüste gerçekleşecektir.' },
          category: { type: 'string', enum: ['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'], example: 'EVENT' },
          author: { type: 'string', example: 'Mezunlar Derneği' },
          target_audience: { type: 'string', enum: ['ALL', 'ALUMNI', 'STUDENT'], example: 'ALL' },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time', example: '2026-10-01T10:00:00.000Z' },
          updated_at: { type: 'string', format: 'date-time', nullable: true, example: null }
        }
      },
      CreateAnnouncementInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Yeni Etkinlik Duyurusu' },
          content: { type: 'string', example: 'Etkinlik detayları ve başvuru formu...' },
          category: { type: 'string', enum: ['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'], default: 'GENERAL', example: 'EVENT' },
          author: { type: 'string', example: 'Kariyer Merkezi' },
          target_audience: { type: 'string', enum: ['ALL', 'ALUMNI', 'STUDENT'], default: 'ALL', example: 'ALL' },
          is_active: { type: 'boolean', default: true, example: true }
        }
      },
      UpdateAnnouncementInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Güncellenmiş Duyuru Başlığı' },
          content: { type: 'string', example: 'Güncellenmiş duyuru içeriği...' },
          category: { type: 'string', enum: ['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'], example: 'CAREER' },
          author: { type: 'string', example: 'Kariyer Merkezi' },
          target_audience: { type: 'string', enum: ['ALL', 'ALUMNI', 'STUDENT'], example: 'STUDENT' },
          is_active: { type: 'boolean', example: true }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Validation Error' },
          message: { type: 'string', example: 'Hata açıklaması.' }
        }
      }
    }
  }
};

export default swaggerDocument;
