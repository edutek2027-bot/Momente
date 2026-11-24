# ✨ Momente – Tagebuch / Günlük / Diary / Dnevnik

Gün içindeki küçük anları birkaç saniyede kaydetmek ve gün sonunda değerlendirmek için animasyonlu bir günlük uygulaması.
Telefon, tablet ve laptopta (iOS, Android, Windows, macOS) tarayıcıdan çalışır. "Ana ekrana ekle" ile uygulama gibi kurulur ve çevrimdışı da kullanılabilir.

## Özellikler
- **4 dil:** 🇩🇪 Deutsch · 🇹🇷 Türkçe · 🇬🇧 English · 🇧🇦 Bosanski. İlk açılışta ve *Ayarlar* bölümünde seçilir.
- **Bugün:** Sade yazı alanı ve "Kaydet". Ruh hali ve konular, "+ Ruh hali ve konu" ile açılan gizli bölümde ve isteğe bağlı. Her an sonradan **düzenlenebilir** veya silinebilir. `#hashtag`, "Günün sorusu" ve "1 ay / 1 yıl önce" hatırası da var. Kaydetmek için `Ctrl/⌘ + Enter` kullanılabilir.
- **Kitap:** Yazılan her gün, çizgili defter görünümünde bir sayfa olur. Oklarla, kaydırarak veya ← → tuşlarıyla sayfa çevrilir.
- **Değerlendirme:** Günün anlarının özeti, 1–5 yıldız puan, en güzel an, minnettarlık, farklı yapılacaklar, yarının niyeti, tek kelimeyle gün. Yazılanlar otomatik kaydedilir.
- **Takvim:** Günler ruh haline göre yeşil tonlarda renklenir; smiley kullanılmaz. Seri (üst üste gün sayısı) ve istatistikler gösterilir, tüm kayıtlarda arama yapılabilir.
- **Ayarlar:** Dil, açık (varsayılan) / koyu / otomatik tema, isim, 10 yaş üstü çocuklar ve gençler için *Genç modu* (emoji ve daha basit sorular), yedekleme ve geri yükleme (JSON), tüm verileri silme.
- **Gizlilik:** Tüm veriler sadece cihazda (localStorage) tutulur. Hesap, reklam ve takip yoktur.
- **Animasyonlar:** Kartların sırayla görünmesi, kaydederken uçuşan yapraklar, sayfa çevirme, yıldız animasyonu, gün sonunda ay kutlaması. "Hareketi azalt" sistem ayarına uyar.

## Çalıştırma
Derleme gerekmez, saf HTML/CSS/JS'dir.

```bash
python3 -m http.server 8000
```

Ardından tarayıcıda `http://localhost:8000` adresini aç.

## Yayınlama (ücretsiz)
GitHub → *Settings → Pages* → Branch seç → Kaydet. Verilen adresi telefonda aç ve **"Ana ekrana ekle"** ile kur.

## Dosyalar
| Dosya | Açıklama |
|---|---|
| `index.html` | Uygulamanın iskeleti |
| `styles.css` | Tasarım ve animasyonlar |
| `app.js` | Uygulama mantığı |
| `i18n.js` | Çeviriler (DE/TR/EN/BS) |
| `sw.js`, `manifest.webmanifest` | Çevrimdışı çalışma ve kurulum (PWA) |
