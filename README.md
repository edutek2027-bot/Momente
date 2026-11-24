# ✨ Momente – Tagebuch / Günlük / Diary / Dnevnik

Gün içindeki küçük anları birkaç saniyede kaydetmek ve gün sonunda değerlendirmek için animasyonlu bir günlük uygulaması.
Telefon, tablet ve laptopta (iOS, Android, Windows, macOS) tarayıcıdan çalışır. "Ana ekrana ekle" ile uygulama gibi kurulur ve çevrimdışı da kullanılabilir.

## Özellikler
- **Kitap formatı:** Uygulama yeşil kapaklı bir kitap olarak açılır. Tablet ve laptopta iki sayfalık açık kitap görünür; bölümler kitabın kenarındaki ayraç sekmeleridir (fareyle üstüne gelince adı açılır). Sıralama: Sayfalar, Takvim, Bugün, Ayarlar. Telefonda tek sayfa gösterilir, sekmeler üstte durur. Bölüm, gün ya da sayfa değiştirirken sayfa 3D olarak çevrilir.
- **4 dil:** 🇩🇪 Deutsch · 🇹🇷 Türkçe · 🇬🇧 English · 🇧🇦 Bosanski. İlk açılışta ve *Ayarlar* bölümünde seçilir.
- **Bugün:** "Günün sözü" bölümünde her dilde atasözleri ve birkaç alıntı var, ↻ ile başka bir söz gösterilir; Ayarlar'dan "Günün sorusu" ya da "Kapalı" seçilebilir. Her anın isteğe bağlı kendi başlığı ve ayarlanabilir saati var. Hemen altında **Duygular** alanı bulunur: 7 smiley'den biri seçilir (mutlu, huzurlu, normal, yorgun, üzgün, endişeli, kızgın), seçilen duyguya uygun örnek kelimeler çıkar ve kısa bir yorum yazılabilir. "＋ Kendi" ile istediğin smiley'i (listeden seçerek ya da yazarak, isteğe bağlı isimle) ekleyebilirsin; eklenenler hatırlanır (düzenlerken de değiştirilebilir). Kaydedilen anlar yan sayfada 1, 2, 3 diye numaralı başlıklarla listelenir, tıklayınca açılır. Konular "+ Konu ekle" ile açılır. Her an sonradan **düzenlenebilir** veya silinebilir. `#hashtag`, "Günün sorusu" ve "1 ay / 1 yıl önce" hatırası da var. Kaydetmek için `Ctrl/⌘ + Enter` kullanılabilir.
- **Sayfalar:** İçindekiler sayfası (küçük takvim, başlıklar, sayfa numaraları) ve yazılan her gün için ayrı bir sayfa. Sayfa köşelerine dokunarak, kaydırarak veya ← → tuşlarıyla sayfa çevrilir.
- **Plan ve Yapılacaklar (bullet journal):** Uygulama bu sayfayla açılır. Solda saat planı (07:00–21:00, Ayarlar'dan değişir); saate dokununca o satırın saati kullanıcı tarafından ayarlanır (örn. 06:45), satırlar saate göre sıralanır, ↺ ile tam saate döner. Sağda görevler üç kutuda: ☐ Yapılacaklar, ↻ Yapılıyor (▶ ile başlatılır), ☑ Yapıldı (kutucuk işaretlenince; kutu açılıp kapanır). Her görevin önceliği kullanıcı tarafından seçilir: Çok önemli (kırmızı), Önemli (sarı), Normal (yeşil) veya yok; kutular içinde önceliğe göre sıralanır. > ile görev yarına ya da seçilen bir güne aktarılır; önceki günden kalan görevler tek dokunuşla aktarılır.
- **Gün değerlendirmesi:** "Bugün" bölümünün içinde, tıklayınca açılır. İçinde minnettarlık, farklı yapılacaklar ve yarının niyeti var. Yazılanlar otomatik kaydedilir.
- **Takvim:** Yazılan günler renkli görünür; bir güne dokununca o gün açılır. Sağ sayfada tüm anlarda arama yapılır.
- **Kişiselleştir:** 4 hazır örnek (Klasik defter, Bullet journal, Sade journal, Kareli defter) ve ayrı ayrı seçilebilen renk (Adaçayı, Deniz, Lavanta, Kum, Gül), kağıt (çizgili, noktalı, kareli, düz), yazı tipi (klasik, modern, el yazısı) ve yazı boyutu.
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
