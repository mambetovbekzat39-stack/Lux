# Публикация Kyro в Google Play (PWA → Android через TWA)

Подписанный AAB я собрать не могу: он требует ваш аккаунт Play Console ($25 разово) и ваш ключ подписи. Ниже — самый короткий путь, всё остальное уже подготовлено.

## 0. Выложите проект на Vercel (как сейчас)
Сайт-лендинга больше нет: открывается сразу приложение. Файлы `vercel.json`, `privacy.html`, `.well-known/assetlinks.json` уже в проекте. Проверьте, что открываются:
- https://hackathon1-kyro.vercel.app/privacy.html
- https://hackathon1-kyro.vercel.app/manifest.json

## 1. Соберите AAB (без установки Android Studio)
1. Откройте https://www.pwabuilder.com → вставьте URL сайта → Package for stores → Android.
2. Package ID: `app.vercel.hackathon1_kyro.twa` (или свой), нажмите Generate, скачайте zip.
3. В zip — `*.aab`, `signing.keystore` и `signing-key-info.txt`. **Сохраните keystore и пароли** — потеряете, не сможете обновлять приложение.
(Альтернатива: `npx @bubblewrap/cli init --manifest=https://hackathon1-kyro.vercel.app/manifest.json`, настройки в `play/twa-manifest.json`.)

## 2. Digital Asset Links (убирает адресную строку)
1. Play Console → ваше приложение → Setup → App signing → скопируйте **SHA-256** сертификата подписи приложения.
2. Вставьте его в `.well-known/assetlinks.json` (и поменяйте package_name, если брали другой) → выложите на Vercel.
3. Проверка: https://hackathon1-kyro.vercel.app/.well-known/assetlinks.json отдаёт JSON.

## 3. Play Console
Создать приложение → загрузить AAB в Internal testing → заполнить: тексты из `play/STORE_LISTING.md`, политика (URL privacy.html), Data safety («данные не собираются»), возрастной рейтинг, скриншоты, иконка 512, feature graphic 1024×500 → отправить на проверку.
Для личных аккаунтов нужно 12 тестировщиков в течение 14 дней перед выходом в продакшен.

## 4. Обновления
Меняете сайт на Vercel — приложение обновляется само (TWA открывает сайт). Новый AAB нужен только при смене иконки/названия.
