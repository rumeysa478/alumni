# 🎨 CONNEXT Marka Kimliği ve Tasarım Kılavuzu (Brand & Design System)

[![Brand: CONNEXT](https://img.shields.io/badge/Brand-CONNEXT-ff8b94?style=for-the-badge&logoColor=black)](https://github.com/rumeysa478/alumni)
[![Theme: Sunset Gradient](https://img.shields.io/badge/Theme-Pastel%20Sunset-ffaf9b?style=for-the-badge)](https://github.com/rumeysa478/alumni)
[![Typography: Playfair & Jakarta](https://img.shields.io/badge/Typography-Playfair%20%2B%20Jakarta-c8b6e2?style=for-the-badge)](https://fonts.google.com/)
[![Active Design Branch](https://img.shields.io/badge/Design%20Branch-temp--homepage--design-orange?style=for-the-badge&logo=git&logoColor=white)](https://github.com/rumeysa478/alumni/tree/temp-homepage-design)

> **CONNEXT | İstanbul Üniversitesi Mezun Takip Sistemi** platformunun görsel marka kimliği, tasarım sistemi, renk paletleri, tipografi hiyerarşisi, UI bileşen anatomisi ve ana sayfa arayüz tasarım standartlarını içeren resmi kılavuzdur.

---

## 📌 İçindekiler

1. [Marka Kimliği ve Vizyon](#1-marka-kimliği-ve-vizyon)
2. [Tasarım Teması ve Görsel Konsept](#2-tasarım-teması-ve-görsel-konsept)
3. [Renk Paleti ve CSS Değişkenleri (Design Tokens)](#3-renk-paleti-ve-css-değişkenleri-design-tokens)
   - [Degrade (Gradient) Tanımları](#degrade-gradient-tanımları)
   - [Temel Renkler ve Hex Kodları](#temel-renkler-ve-hex-kodları)
   - [İşlevsel ve Semantik Renkler](#i̇şlevsel-ve-semantik-renkler)
4. [Tipografi Sistemi (Typography)](#4-tipografi-sistemi-typography)
   - [Display / Başlık Fontu: Playfair Display](#display--başlık-fontu-playfair-display)
   - [Gövde ve Arayüz Fontu: Plus Jakarta Sans](#gövde-ve-arayüz-fontu-plus-jakarta-sans)
   - [Tipografi Hiyerarşisi Tablosu](#tipografi-hiyerarşisi-tablosu)
5. [Arayüz Bileşenleri ve Tasarım Anatomisi (UI Components)](#5-arayüz-bileşenleri-ve-tasarım-anatomisi-ui-components)
   - [Hap Butonlar (Pill Buttons & Chips)](#hap-butonlar-pill-buttons--chips)
   - [3x5 İnteraktif Buton Matrisi (Pills Grid)](#3x5-i̇nteraktif-buton-matrisi-pills-grid)
   - [Canlı İstatistik Sayaç Kartları](#canlı-i̇statistik-sayaç-kartları)
   - [Koyu Kenarlık ve Gölgelendirme (Border & Shadow Aesthetic)](#koyu-kenarlık-ve-gölgelendirme-border--shadow-aesthetic)
6. [Ana Sayfa Tasarım Uygulaması (`temp-homepage-design`)](#6-ana-sayfa-tasarım-uygulaması-temp-homepage-design)
7. [Tasarım Kuralları: Ne Yapılmalı / Ne Yapılmamalı (Do's & Don'ts)](#7-tasarım-kuralları-ne-yapılmalı--ne-yapılmamalı-dos--donts)

---

## 1. Marka Kimliği ve Vizyon

- **Marka Adı:** `CONNEXT` (Connect + Next kelimelerinin birleşimi; mezunlar ile geleceği birbirine bağlayan köprü).
- **Alt Başlık / Slogan:** `İSTANBUL UNIVERSITY ALUMNI WEB PAGE`
- **Kurumsal Misyon:** 1453 yılından günümüze uzanan İstanbul Üniversitesi'nin köklü akademik birikimini çağdaş web teknolojileriyle harmanlamak; mezunlar, mevcut öğrenciler ve akademisyenler arasında kesintisiz bir mentörlük, kariyer ve dayanışma bağı kurmak.
- **Marka Kişiliği (Brand Voice):**
  - 🏛️ **Akademik & Prestijli:** Köklü üniversite geçmişine saygılı, zarif ve güven veren duruş.
  - 🌅 **Sıcak & Dinamik:** Gün batımı pastel tonlarıyla davetkar, samimi ve erişilebilir.
  - ⚡ **Modern & Net:** Karakteristik koyu hatlar, yuvarlatılmış hap butonlar ve yüksek kontrastlı okunabilirlik.

---

## 2. Tasarım Teması ve Görsel Konsept

Uygulamanın tasarım felsefesi **Retro-Modern Akademik Füzyon** olarak adlandırılır:

1. **Tarihi Beyazıt Kapısı Silüeti (Historical Landmark):**
   - Hero bölümünde vektörel SVG olarak işlenen İstanbul Üniversitesi Beyazıt Yerleşkesi Ana Giriş Kapısı kemeri, platformun aidiyet ve köklerini simgeler.
2. **Pastel Gün Batımı Degradeleri (Sunset Gradients):**
   - Şeftali, pudra pembe, gül kurusu, lavanta ve bebek mavisi geçişleri; geleneksel durağan üniversite portallarının aksine enerji ve canlılık katar.
3. **Karakteristik Koyu Kenarlıklar (Neobrutalist Soft Touch):**
   - Tüm kartlar, butonlar ve rozetler `1.5px` veya `2px` kalınlığında keskin koyu kenarlıklarla (`#1a1a1a`) çevrelenmiştir. Bu sayede pastel zeminler üzerinde net ve modern bir hat elde edilir.
4. **Hap (Pill) Geometrisi:**
   - Navigasyon, butonlar, rozetler ve eylem elemanlarında tam yuvarlatılmış hap formu (`border-radius: 9999px`) kullanılır.

---

## 3. Renk Paleti ve CSS Değişkenleri (Design Tokens)

Platform genelinde kullanılan tüm renkler CSS değişkenleri (`:root`) ile merkezi olarak yönetilmektedir:

```css
:root {
  /* Ana Degradeler */
  --connext-gradient: linear-gradient(135deg, #ffaf9b 0%, #ff8b94 25%, #f7a8b8 50%, #c8b6e2 75%, #a8c0ff 100%);
  --connext-gradient-alt: linear-gradient(90deg, #ffaf9b 0%, #ff8b94 30%, #f7a8b8 65%, #c8b6e2 100%);

  /* Pastel Temel Renkler */
  --connext-pink: #ffd6e0;
  --connext-peach: #ffe5d9;
  --connext-lavender: #dde4ff;
  --connext-mint: #d1fae5;
  --connext-yellow: #fef3c7;

  /* Çerçeve ve Metin Renkleri */
  --connext-dark: #111827;
  --connext-border: #1a1a1a;
  --radius-pill: 9999px;
  --radius-card: 20px;
}
```

### Degrade (Gradient) Tanımları

| Token Adı | CSS Değeri | Kullanım Alanı |
| :--- | :--- | :--- |
| `--connext-gradient` | `linear-gradient(135deg, #ffaf9b, #ff8b94, #f7a8b8, #c8b6e2, #a8c0ff)` | Kahraman (Hero) arka plan kaplamaları, vurgulu rozetler |
| `--connext-gradient-alt` | `linear-gradient(90deg, #ffaf9b, #ff8b94, #f7a8b8, #c8b6e2)` | Sabit üst navigasyon çubuğu (Header Bar) |

### Temel Renkler ve Hex Kodları

| Renk İsmi | Hex Kodu | RGB | Önizleme & Rol |
| :--- | :--- | :--- | :--- |
| **Sunset Peach** | `#ffaf9b` | `rgb(255, 175, 155)` | Degrade başlangıç rengi, sıcak şeftali |
| **Coral Pink** | `#ff8b94` | `rgb(255, 139, 148)` | Vurgu ve buton geçiş rengi |
| **Rose Quartz** | `#f7a8b8` | `rgb(247, 168, 184)` | Orta degrade yumuşatma rengi |
| **Soft Lavender** | `#c8b6e2` | `rgb(200, 182, 226)` | Zarif pastel mor, modern akademik ton |
| **Sky Tint** | `#a8c0ff` | `rgb(168, 192, 255)` | Degrade bitiş rengi, açık gökyüzü mavisi |
| **Pastel Pink** | `#ffd6e0` | `rgb(255, 214, 224)` | Aktif hap butonlar, avatar zeminleri |
| **Peach Cream** | `#ffe5d9` | `rgb(255, 229, 217)` | 3x5 interaktif buton zeminleri |
| **Mint Green** | `#d1fae5` | `rgb(209, 250, 229)` | Başarı rozetleri, FULL_TIME etiketleri |
| **Warm Yellow** | `#fef3c7` | `rgb(254, 243, 199)` | CONNEXT rozet kutuları, uyarılar |
| **IU Emerald** | `#005b38` | `rgb(0, 91, 56)` | Resmi İstanbul Üniversitesi amblem zemini |
| **Border Dark** | `#1a1a1a` | `rgb(26, 26, 26)` | 1.5px / 2px karakteristik kenarlık çizgisi |
| **Text Dark** | `#111827` | `rgb(17, 24, 39)` | Birincil başlık ve koyu buton rengi |

---

## 4. Tipografi Sistemi (Typography)

Tasarımda iki tamamlayıcı Google Font ailesi birlikte çalışır:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Display / Başlık Fontu: Playfair Display
- **Aile:** `'Playfair Display', Georgia, serif`
- **Rol:** Logotype, Hero H1 başlıkları, kart başlıkları, buton metinleri ve istatistik sayıları.
- **Karakter:** Klasik İtalyan matbaacılık geleneğinden ilham alan, yüksek kontrastlı ve akademik zarafet sunan serif font.
- **Kullanılan Ağırlıklar:** `700 (Bold)`, `800 (ExtraBold)`, `900 (Black)`.

### Gövde ve Arayüz Fontu: Plus Jakarta Sans
- **Aile:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Rol:** Paragraflar, veri tabloları, form kontrolleri, sayaç etiketleri ve alt bilgiler.
- **Karakter:** Modern, geometrik, ekran okumalarında üstün optik netliğe sahip temiz sans-serif font.
- **Kullanılan Ağırlıklar:** `400 (Regular)`, `500 (Medium)`, `600 (SemiBold)`, `700 (Bold)`.

### Tipografi Hiyerarşisi Tablosu

| Düzey / Eleman | Font Ailesi | Boyut | Ağırlık | Harf Aralığı | Satır Yüksekliği |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Logo** | Playfair Display | `1.9rem (30px)` | 900 Black | `0.3em` (Geniş) | `1.0` |
| **Hero H1** | Playfair Display | `3.2rem (51px)` | 900 Black | `0.06em` | `1.15` |
| **Section H2** | Playfair Display | `2.0rem (32px)` | 900 Black | Normal | `1.2` |
| **Card H3** | Playfair Display | `1.4rem (22px)` | 800 ExtraBold | Normal | `1.25` |
| **Hero Pill Btn**| Playfair Display | `1.4rem (22px)` | 800 ExtraBold | Normal | `1.0` |
| **Grid Pills** | Playfair Display | `1.15rem (18px)`| 700 Bold | Normal | `1.0` |
| **Stat Counter**| Playfair Display | `1.6rem (26px)` | 900 Black | Normal | `1.1` |
| **Body Text** | Plus Jakarta Sans| `0.92rem - 1rem` | 400 - 500 | Normal | `1.55` |
| **Label / Tag** | Plus Jakarta Sans| `0.75rem - 0.85rem`| 700 Bold | `0.05em` | `1.0` |

---

## 5. Arayüz Bileşenleri ve Tasarım Anatomisi (UI Components)

### Hap Butonlar (Pill Buttons & Chips)
- **Yapı:** `border-radius: var(--radius-pill); border: 2px solid var(--connext-border);`
- **Durumlar (States):**
  - *Varsayılan:* Beyaz/Pastel zemin, koyu kenarlık, hafif gölge (`0 6px 16px rgba(0,0,0,0.08)`).
  - *Hover:* `transform: translateY(-3px) scale(1.03);` gölge derinleşir (`0 10px 25px rgba(0,0,0,0.18)`).
  - *Primary:* Siyah dolgulu (`#111`), beyaz metinli; hover'da dinamik maviye (`#2563eb`) geçer.

### 3x5 İnteraktif Buton Matrisi (Pills Grid)
Kullanıcı profil kartı (Frosty Franklin & Rumeysa Aydın) üzerinde 3 sütun x 5 satır düzeninde konumlandırılmış 15 interaktif hap buton:
```text
┌─────────────────┬─────────────────┬─────────────────┐
│     events      │    + follow     │     send DM     │
├─────────────────┼─────────────────┼─────────────────┤
│      posts      │       cv        │    languages    │
├─────────────────┼─────────────────┼─────────────────┤
│    contacts     │   experience    │     awards      │
├─────────────────┼─────────────────┼─────────────────┤
│    favorites    │    education    │     skills      │
├─────────────────┼─────────────────┼─────────────────┤
│     reposts     │    projects     │    comments     │
└─────────────────┴─────────────────┴─────────────────┘
```
- Aktif seçili haplar `--connext-pink` (`#ffd6e0`), diğer haplar `--connext-peach` (`#ffe5d9`) rengindedir.

### Canlı İstatistik Sayaç Kartları
Hero bölümünün hemen altında, 4 kolonlu esnek kart düzeni:
- **İkon Kutusu:** `52x52px`, şeftali zemin, `1.5px` sınır, `12px` border-radius.
- **Sayı Değeri:** `12,450+`, `850+`, `1,280+`, `95+` (Playfair Display 900).
- **Etiket:** Açık gri üst yazı (`#64748b`), büyük harf, `0.05em` harf aralığı.

### Koyu Kenarlık ve Gölgelendirme (Border & Shadow Aesthetic)
- Tüm kart bileşenlerinde `2px solid #1a1a1a` sınır kullanılır.
- Gölgeler yumuşak ve difüze (`rgba(0,0,0,0.07)` - `0.12`), kenarlıklar ise keskin ve nettir. Bu iki unsurun kontrastı modern bir derinlik hissi yaratır.

---

## 6. Ana Sayfa Tasarım Uygulaması (`temp-homepage-design`)

Tüm bu marka ve tasarım sistemi kuralları, geçici özellik dalında ([`temp-homepage-design`](https://github.com/rumeysa478/alumni/tree/temp-homepage-design)) [`public/index.html`](file:///c:/Users/rumeysa.aydin/Desktop/alumni/public/index.html) üzerinde eksiksiz hayata geçirilmiştir:

```bash
# Tasarımı yerel ortamda canlı test etmek için:
git checkout temp-homepage-design
npm run dev
# Tarayıcıda: http://localhost:5000
```

### Ekran Yerleşimi (Layout Wireframe):
```text
┌──────────────────────────────────────────────────────────────────┐
│ [🎓] CONNEXT    About Us | Mezunlar | İlanlar | Etkinlikler   [🔍] │  <- Topbar Gradient
├──────────────────────────────────────────────────────────────────┤
│                       [🏛️ İSTANBUL ÜNİVERSİTESİ]                  │
│               İSTANBUL UNIVERSITY ALUMNI WEB PAGE                │  <- Hero Vintage Gate
│                      [Log In]      [Sign In]                     │
│       (•) temporary home page • Alumni Tracking System           │
├──────────────────────────────────────────────────────────────────┤
│ [🎓 12,450+ Mezun] [💼 850+ İlan] [🤝 1,280+ Mentör] [📅 95+ Etk] │  <- Live Stats Grid
├──────────────────────────────────────────────────────────────────┤
│ [👥 Mezun] [💼 İlanlar] [📝 Başvurular] [🎉 Etkinlik] [📢 Duyuru] │  <- Quick Actions Bar
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 👤 Frosty Franklin & Rumeysa Aydın (MIS Dept)  [🏛️ CONNEXT]  │ │  <- Spotlight Card
│ │ [3x5 Interactive Pills Matrix: events, follow, cv, skills..] │ │
│ └──────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────┐  ┌─────────────────────────────┐ │
│ │ 💼 Öne Çıkan İş & Stajlar   │  │ 🎉 Yaklaşan Buluşmalar      │ │  <- Dual Showcase
│ └─────────────────────────────┘  └─────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│ 🎓 Mezunlar | 💼 İlanlar | 📝 Başvurular | 📅 Buluşmalar | 📚 API│  <- Portal Directory
├──────────────────────────────────────────────────────────────────┤
│ 🟢 Sistem Durumu: Çalışıyor (UP)  |  [Health] [Swagger] [404]   │  <- System Dock
├──────────────────────────────────────────────────────────────────┤
│ © 2026 CONNEXT • İstanbul Üniversitesi • Geliştirici: Rumeysa    │  <- Footer
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Tasarım Kuralları: Ne Yapılmalı / Ne Yapılmamalı (Do's & Don'ts)

### ✅ Yapılması Gerekenler (Do's)
- Başlıklarda ve marka ifadelerinde mutlaka `Playfair Display` fontunu kullanın.
- Kart ve butonlarda `1.5px` - `2px` koyu kenarlığı (`#1a1a1a`) asla ihmal etmeyin.
- Butonlarda tam yuvarlatılmış hap (`--radius-pill`) geometrisini tercih edin.
- Renk hiyerarşisinde pastel tonları zemin ve etiketlerde, koyu tonları ise metin ve sınırlarda kullanın.
- Eylemler için mikro animasyonlar (`transform: translateY(-2px)`) uygulayarak kullanıcıya etkileşim hissi verin.

### ❌ Kaçınılması Gerekenler (Don'ts)
- Gövde metinlerinde serif font (`Playfair Display`) kullanmayın; uzun metinlerde okunabilirliği düşürür.
- Koyu kenarlık içermeyen salt gölgeli düz beyaz kartlar kullanmayın (marka karakterini bozar).
- Neon veya aşırı doygun birincil renkler (örneğin saf kırmızı `#ff0000` veya parlak yeşil) kullanmayın; pastel ve retro paleti koruyun.
- Kare veya sıfır border-radius'lu köşeli butonlar eklemeyin.

---

[⬅️ Ana Dokümantasyona Dön (README.md)](./README.md)
