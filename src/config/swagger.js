export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '🎓 Alumni Tracking System API',
    version: '1.0.0',
    description: 'Üniversite mezunları ve öğrenciler için Mezun Takip Sistemi RESTful API dokümantasyonu.',
    contact: {
      name: 'Rümeysa Aydın',
      url: 'https://github.com/rumeysa478/alumni'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Lokal Geliştirme Sunucusu'
    }
  ],
  tags: [
    {
      name: 'Sistem',
      description: 'Sistem sağlığı ve çalışma durumu uç noktaları'
    },
    {
      name: 'Kullanıcılar',
      description: 'Kullanıcı yönetimi ve CRUD işlemleri (In-Memory)'
    }
  ],
  paths: {
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
                    timestamp: { type: 'string', example: '2026-09-30T07:45:00.000Z' },
                    uptime: {
                      type: 'object',
                      properties: {
                        seconds: { type: 'integer', example: 120 },
                        formatted: { type: 'string', example: '2m 0s' }
                      }
                    },
                    environment: { type: 'string', example: 'development' },
                    system: {
                      type: 'object',
                      properties: {
                        nodeVersion: { type: 'string', example: 'v25.2.1' },
                        platform: { type: 'string', example: 'win32' },
                        arch: { type: 'string', example: 'x64' },
                        cpuCount: { type: 'integer', example: 16 },
                        freeMemory: { type: 'string', example: '6800.00 MB' },
                        totalMemory: { type: 'string', example: '16000.00 MB' },
                        processMemory: {
                          type: 'object',
                          properties: {
                            rss: { type: 'string', example: '45.10 MB' },
                            heapTotal: { type: 'string', example: '12.50 MB' },
                            heapUsed: { type: 'string', example: '8.20 MB' },
                            external: { type: 'string', example: '2.40 MB' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Kullanıcılar'],
        summary: 'Kullanıcıları Listele',
        description: 'Sistemde kayıtlı tüm kullanıcıları dizi halinde döner.',
        responses: {
          '200': {
            description: 'Kullanıcı listesi başarıyla getirildi.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 2 },
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
        tags: ['Kullanıcılar'],
        summary: 'Yeni Kullanıcı Oluştur',
        description: 'Form formatında (x-www-form-urlencoded veya multipart/form-data) ya da JSON olarak yeni kullanıcı kaydı ekler.',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/CreateUserInput' }
            },
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/CreateUserInput' }
            },
            'application/json': {
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
        tags: ['Kullanıcılar'],
        summary: 'ID ile Kullanıcı Getir',
        description: 'Belirtilen ID numarasına sahip kullanıcının detaylarını döner.',
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
        tags: ['Kullanıcılar'],
        summary: 'Kullanıcıyı Tam Güncelle (PUT)',
        description: 'Kullanıcının tüm güncellenebilir alanlarını revize eder.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Güncellenecek kullanıcı ID numarası',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' }
            },
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' }
            },
            'application/json': {
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
          },
          '409': {
            description: 'E-posta başka bir kullanıcı tarafından kullanılıyor.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Kullanıcılar'],
        summary: 'Kullanıcıyı Kısmi Güncelle (PATCH)',
        description: 'Kullanıcı kaydında sadece gönderilen alanları günceller, diğerlerini korur.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Kısmi güncellenecek kullanıcı ID numarası',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/PatchUserInput' }
            },
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/PatchUserInput' }
            },
            'application/json': {
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
          '400': {
            description: 'Geçersiz veri.',
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
          },
          '409': {
            description: 'E-posta adresi çakışması.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Kullanıcılar'],
        summary: 'Kullanıcıyı Sil (DELETE)',
        description: 'Belirtilen ID numarasına sahip kullanıcı kaydını siler.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Silinecek kullanıcı ID numarası',
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
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'rumeysa@alumni.edu' },
          first_name: { type: 'string', example: 'Rümeysa' },
          last_name: { type: 'string', example: 'Aydın' },
          role: { type: 'string', enum: ['STUDENT', 'ALUMNI', 'ADMIN'], example: 'ALUMNI' },
          department: { type: 'string', example: 'MIS' },
          graduation_year: { type: 'integer', nullable: true, example: 2028 },
          is_verified: { type: 'boolean', example: false },
          created_at: { type: 'string', format: 'date-time', example: '2026-09-30T07:35:56.824Z' },
          updated_at: { type: 'string', format: 'date-time', nullable: true, example: '2026-09-30T07:39:50.869Z' }
        }
      },
      CreateUserInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'rumeysa@alumni.edu' },
          password: { type: 'string', format: 'password', example: 'gucluSifre123' },
          first_name: { type: 'string', example: 'Rümeysa' },
          last_name: { type: 'string', example: 'Aydın' },
          role: { type: 'string', enum: ['STUDENT', 'ALUMNI', 'ADMIN'], default: 'ALUMNI', example: 'ALUMNI' },
          department: { type: 'string', example: 'MIS' },
          graduation_year: { type: 'integer', example: 2028 }
        }
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'rumeysa.guncel@alumni.edu' },
          first_name: { type: 'string', example: 'Rümeysa' },
          last_name: { type: 'string', example: 'Aydın' },
          role: { type: 'string', enum: ['STUDENT', 'ALUMNI', 'ADMIN'], example: 'ALUMNI' },
          department: { type: 'string', example: 'Yazılım Mühendisliği' },
          graduation_year: { type: 'integer', example: 2028 },
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
          graduation_year: { type: 'integer', example: 2029 },
          is_verified: { type: 'boolean', example: true }
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
