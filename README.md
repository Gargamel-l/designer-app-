# ОБРАЗЫ — Приложение для подбора образов

Мобильное PWA/Android-приложение для создания гардероба и автоматического подбора образов на основе цветовой совместимости вещей.

---

## Содержание

- [Что делает приложение](#что-делает-приложение)
- [Архитектура](#архитектура)
- [Структура проекта](#структура-проекта)
- [Алгоритмы](#алгоритмы)
- [Зависимости](#зависимости)
- [Разработка (веб)](#разработка-веб)
- [Сборка PWA](#сборка-pwa)
- [Сборка Android APK](#сборка-android-apk)
- [Установка APK на устройство](#установка-apk-на-устройство)
- [Известные особенности](#известные-особенности)

---

## Что делает приложение

**ОБРАЗЫ** — это стилистический ассистент, который:

1. **Принимает фото одежды** через камеру или галерею
2. **Удаляет фон** с изображения прямо в браузере (без серверов)
3. **Определяет доминирующий цвет** вещи автоматически
4. **Хранит гардероб** локально на устройстве
5. **Подбирает образы** из имеющихся вещей по алгоритму цветовой совместимости
6. **Сохраняет понравившиеся образы** для быстрого доступа

### Экраны

| Вкладка | Что показывает |
|---|---|
| **Гардероб** | Все добавленные вещи по категориям, с фото и цветовым тегом |
| **Образы** | Сохранённые (понравившиеся) образы в виде сетки |
| **+ Загрузить** | Мастер добавления новой вещи (3 шага) |
| **Подобрать** | Генератор образов — листаешь и лайкаешь |
| **Данные** | Статистика гардероба |

---

## Архитектура

```
React (18) + TypeScript
  └── MUI 5 (Material UI) — компонентная библиотека
  └── Vite 5 — сборщик
  └── Capacitor 8 — обёртка для Android
  └── @imgly/background-removal — удаление фона (ONNX WASM)
  └── localStorage — хранилище данных (нет бэкенда)
```

### Поток данных

```
Пользователь → UploadDialog
  ├─ TypeSelector  → выбор категории (куртка / футболка / штаны и т.д.)
  ├─ PhotoCapture  → камера/галерея → удаление фона → detectDominantColor()
  └─ ColorAssign   → подтверждение/смена цвета → ClothingItem сохраняется

ClothingItem → AppContext (useWardrobe) → localStorage['wardrobe_v1']

MatchScreen → generateOutfits(items) → пользователь листает
  └─ лайк → saveOutfit({ isFavorite: true }) → localStorage['outfits_v1']

OutfitsScreen → читает favoriteOutfits из контекста
```

---

## Структура проекта

```
color-app/
├── src/
│   ├── main.tsx                    # точка входа React
│   ├── App.tsx                     # shell: нижняя навигация + роутинг вкладок
│   ├── AppContext.tsx               # глобальный контекст (items, outfits, tab)
│   ├── theme.ts                    # MUI тема (чёрно-белый минимализм, Inter)
│   ├── types.ts                    # все TypeScript-типы
│   │
│   ├── hooks/
│   │   ├── useWardrobe.ts          # CRUD для ClothingItem + localStorage
│   │   └── useOutfits.ts           # CRUD для Outfit + localStorage
│   │
│   ├── data/
│   │   └── colors.ts               # палитра 55 цветов (5 семей × 11 оттенков)
│   │
│   ├── utils/
│   │   ├── colorCompatibility.ts   # areColorsCompatible(), outfitColorScore()
│   │   ├── colorDetection.ts       # detectDominantColor() — canvas API
│   │   └── outfitGenerator.ts      # generateOutfits() — основной алгоритм
│   │
│   ├── screens/
│   │   ├── WardrobeScreen.tsx      # список вещей гардероба
│   │   ├── OutfitsScreen.tsx       # сохранённые образы (сетка 2 колонки)
│   │   ├── MatchScreen.tsx         # подбор образов (листалка с лайком)
│   │   └── ProfileScreen.tsx       # статистика
│   │
│   └── components/
│       ├── OutfitComposite.tsx     # рендер flat-lay раскладки образа
│       ├── ClothingCard.tsx        # карточка вещи в гардеробе
│       ├── ItemDetailDialog.tsx    # детальный просмотр вещи
│       ├── ScreenHeader.tsx        # заголовок экрана
│       └── upload/
│           ├── UploadDialog.tsx    # диалог-мастер (3 шага)
│           ├── TypeSelector.tsx    # шаг 1: выбор категории
│           ├── PhotoCapture.tsx    # шаг 2: фото + удаление фона
│           └── ColorAssign.tsx     # шаг 3: выбор/подтверждение цвета
│
├── public/
│   ├── manifest.json               # PWA манифест
│   └── icons/
│       ├── icon-192.png            # иконка PWA
│       └── icon-512.png
│
├── android/                        # Capacitor Android проект
│   ├── app/
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # INTERNET + CAMERA permissions
│   │       └── assets/public/      # dist/ копируется сюда при cap sync
│   ├── gradle.properties           # org.gradle.java.home (JDK 21)
│   └── local.properties            # sdk.dir (Android SDK путь)
│
├── capacitor.config.ts             # appId, appName, webDir
├── vite.config.ts                  # Vite конфиг (порт 7878, exclude bg-removal)
├── package.json
└── tsconfig.json
```

---

## Алгоритмы

### Удаление фона (`PhotoCapture.tsx` + `@imgly/background-removal`)

Используется модель `isnet_quint8` (квантизированная, ~10 МБ). Работает полностью в браузере через ONNX Runtime WebAssembly. При первом запуске модель скачивается с CDN и кешируется браузером. Результат — PNG с прозрачным фоном, закодированный в base64.

```
Фото → ONNX isnet_quint8 → PNG без фона (base64) → canvas → detectDominantColor()
```

### Определение доминирующего цвета (`colorDetection.ts`)

1. Изображение масштабируется до 80px по большей стороне (производительность)
2. Отрисовывается на `<canvas>`, извлекаются пиксели через `getImageData()`
3. Прозрачные пиксели (alpha < 128) пропускаются
4. Для каждого пикселя ищется ближайший цвет в палитре по перцептивному расстоянию:
   ```
   dist = √(2·ΔR² + 4·ΔG² + 3·ΔB²)
   ```
   (зелёный канал весит больше, т.к. глаз к нему чувствительнее)
5. Голосование — побеждает цвет с наибольшим числом голосов

### Цветовая палитра (`colors.ts`)

55 цветов: 5 семей (blue, gray, red, yellow, green) × 11 оттенков каждая.

Оттенки генерируются от светлого к тёмному:
- `lightness = 95 - i * 8` (от 95 до 15)
- `name = "Blue 0"` ... `"Blue 10"`

### Совместимость цветов (`colorCompatibility.ts`)

Функция `areColorsCompatible(a, b)` возвращает `true` если:
- Хотя бы один из цветов — серый (`gray` — нейтраль, сочетается со всем)
- Одна цветовая семья (монохром)
- Комплементарная пара по таблице:

| Цвет | Совместим с |
|---|---|
| blue | red, yellow, green |
| red | blue, green |
| yellow | blue, green |
| green | red, yellow, blue |
| gray | всё |

`outfitColorScore(colors[])` — доля совместимых пар из всех возможных (0..1).

### Генерация образов (`outfitGenerator.ts`)

**Правило:** каждый образ содержит `(верх ИЛИ куртку) + низ`.

Генерируются все комбинации по убыванию полноты:

| Комбинация | Пример |
|---|---|
| куртка + верх + низ + обувь | пуховик + свитер + джинсы + кеды |
| куртка + верх + низ | пуховик + футболка + брюки |
| куртка + низ + обувь | куртка + шорты + кроссовки |
| верх + низ + обувь | футболка + штаны + обувь |
| верх + низ | футболка + брюки |
| куртка + низ | куртка + шорты |

**Фильтрация по цвету:**
- Все комбинации дедуплицируются и сортируются по `outfitColorScore`
- Приоритет отдаётся образам с `score ≥ 0.5`
- **Если нет ни одного образа с хорошим score — показываются все** (пользователь не видит пустой экран)

**`OutfitComposite`** рендерит образ как flat-lay раскладку с абсолютным позиционированием и z-index:

```
jacket  (zIndex 5) — сверху слева, 65% ширины
tops    (zIndex 3) — по центру сверху
bottoms (zIndex 2) — по центру снизу
shoes   (zIndex 1) — снизу справа
```

---

## Зависимости

### Runtime

| Пакет | Версия | Зачем |
|---|---|---|
| `react` + `react-dom` | 18.3 | UI фреймворк |
| `@mui/material` | 5.15.19 | компоненты (кнопки, диалоги, навигация) |
| `@mui/icons-material` | 5.15.19 | иконки |
| `@emotion/react` + `@emotion/styled` | 11.x | CSS-in-JS для MUI |
| `@imgly/background-removal` | 1.4.5 | удаление фона (ONNX WASM) |
| `uuid` | 9.x | генерация уникальных ID |

### Dev

| Пакет | Версия | Зачем |
|---|---|---|
| `vite` | 5.4 | сборщик / dev-сервер |
| `@vitejs/plugin-react` | 4.3 | Vite плагин для React |
| `typescript` | 5.5 | типизация |
| `@capacitor/core` + `cli` + `android` | 8.3 | Android обёртка |

### Системные зависимости для Android-сборки

| Инструмент | Версия | Где взять |
|---|---|---|
| **Node.js** | 18+ | https://nodejs.org |
| **pnpm** | любая | `npm i -g pnpm` |
| **JDK 21** (Eclipse Temurin) | 21.0.x | https://adoptium.net → Temurin 21 |
| **Android SDK** (командная строка) | — | https://developer.android.com/studio#command-line-tools-only |
| **Android Build Tools** | 36.0.0 | через `sdkmanager` |
| **Android Platform** | android-36 | через `sdkmanager` |

> **Важно:** Capacitor 8 требует именно JDK 21. JDK 17 не подойдёт (ошибка `invalid source release: 21`).

---

## Разработка (веб)

```bash
# 1. Установить зависимости
pnpm install

# 2. Запустить dev-сервер
pnpm dev
# → http://localhost:7878
```

> **Известная проблема:** `pnpm dev` (Vite dev server) выдаёт ошибку `createTheme_default is not a function` из-за бага esbuild с circular deps MUI. Используйте `pnpm serve` вместо `pnpm dev`.

```bash
# Рекомендуемый способ для разработки — production build + preview
pnpm serve
# → http://localhost:7878
```

### Доступные скрипты

| Команда | Описание |
|---|---|
| `pnpm dev` | Vite dev сервер (не работает из-за MUI bug) |
| `pnpm build` | Production сборка в `dist/` |
| `pnpm preview` | Превью production сборки |
| `pnpm serve` | `build` + `preview` (рекомендуется) |
| `pnpm cap:sync` | `build` + `npx cap sync android` |
| `pnpm cap:apk` | `cap:sync` + сборка APK через Gradle |
| `pnpm cap:open` | Открыть Android Studio |

---

## Сборка PWA

Приложение полностью готово как PWA:

```bash
pnpm build
# → dist/ содержит готовый PWA
```

`public/manifest.json` уже настроен:
- `display: standalone`
- `theme_color: #000000`
- иконки 192×192 и 512×512

Для деплоя — загрузить содержимое `dist/` на любой HTTPS-хостинг (Vercel, Netlify, GitHub Pages и т.д.).

---

## Сборка Android APK

### Первоначальная настройка (делается один раз)

#### 1. Установить JDK 21

Скачать портативный ZIP с https://adoptium.net (Temurin 21, Windows x64) и распаковать, например, в:
```
C:\Users\<username>\AppData\Local\jdk-21\jdk-21.0.10+7\
```

#### 2. Установить Android SDK

Скачать только Command Line Tools с https://developer.android.com/studio#command-line-tools-only

Распаковать в:
```
C:\Users\<username>\AppData\Local\Android\Sdk\cmdline-tools\latest\
```

Установить необходимые компоненты:
```powershell
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
& "$sdk\cmdline-tools\latest\bin\sdkmanager.bat" `
  "build-tools;36.0.0" `
  "platforms;android-36" `
  "platform-tools"
# Принять лицензии:
& "$sdk\cmdline-tools\latest\bin\sdkmanager.bat" --licenses
```

#### 3. Настроить пути в проекте

**`android/local.properties`** — путь к Android SDK:
```properties
sdk.dir=C\:/Users/<username>/AppData/Local/Android/Sdk
```
> Используйте прямые слэши или `C\:` — в Java `.properties` обратный слэш является escape-символом!

**`android/gradle.properties`** — путь к JDK 21:
```properties
org.gradle.java.home=C:\\Users\\<username>\\AppData\\Local\\jdk-21\\jdk-21.0.10+7
```
> Здесь двойной обратный слэш — правильно, это Java-escape в `.properties`.

### Сборка APK

```bash
# Быстрый способ (одна команда):
pnpm cap:apk

# Или пошагово:
pnpm build                          # собрать веб-приложение
npx cap sync android                # скопировать dist/ в android/assets/public/
cd android
.\gradlew.bat assembleDebug         # собрать APK
```

APK будет по пути:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Повторная сборка после изменений

```bash
pnpm cap:apk
# или
pnpm build && npx cap sync android && cd android && .\gradlew.bat assembleDebug
```

Gradle кеширует зависимости — повторная сборка занимает ~5–10 секунд.

---

## Установка APK на устройство

### Через ADB (рекомендуется)

1. Включить **Режим разработчика** на Android (7 тапов по "Номер сборки" в Настройках)
2. Включить **Отладку по USB** в Настройках разработчика
3. Подключить устройство кабелем USB

```bash
# Проверить что устройство видно:
adb devices

# Установить APK:
adb install android\app\build\outputs\apk\debug\app-debug.apk

# При переустановке (если уже установлено):
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### Вручную через файл

Скопировать `app-debug.apk` на телефон (через USB, облако, мессенджер) и открыть файловым менеджером. Потребуется разрешить установку из неизвестных источников.

---

## Известные особенности

### Vite dev server не работает с MUI

**Симптом:** `createTheme_default is not a function` при `pnpm dev`

**Причина:** esbuild оборачивает `createTheme` из MUI в lazy `__esm()` инициализатор. `Box` вызывает `createTheme_default()` до того как инициализатор отработает — circular dependency.

**Решение:** Использовать `pnpm serve` — production build через Rollup не имеет этого бага.

### Первый запуск удаления фона

При первом использовании функции удаления фона браузер скачивает модель `isnet_quint8` (~10 МБ) с CDN. Это происходит один раз — после кеширования работает мгновенно (даже офлайн в PWA режиме).

### Хранилище данных

Все данные (фото одежды в base64, цвета, образы) хранятся в `localStorage`. Лимит обычно 5–10 МБ в зависимости от браузера. При большом гардеробе (много HD фото) возможно переполнение. Рекомендуется добавлять вещи с фото через камеру — качество оптимизируется при удалении фона.

### Сборка под Android — только Windows

Скрипт `cap:apk` использует `gradlew.bat`. На macOS/Linux нужно заменить на `./gradlew assembleDebug`.

### Подбор образов

Экран "Подобрать" требует минимум одну **верхнюю вещь** (футболка, майка, свитер или куртка) и одну **нижнюю вещь** (штаны или шорты). Куртка может выступать как единственная верхняя вещь.

---

## Типы данных

```typescript
type ClothingCategory = 'jacket' | 'tshirt' | 'longsleeve' | 'tanktop' | 'pants' | 'shorts' | 'shoes'

type ColorFamily = 'blue' | 'gray' | 'red' | 'yellow' | 'green'

interface ColorEntry {
  name: string      // "Blue 3"
  hex: string       // "#4A6FFF"
  family: ColorFamily
  lightness: number // 0–100
}

interface ClothingItem {
  id: string           // UUID
  category: ClothingCategory
  image: string        // base64 PNG (фон удалён)
  color: ColorEntry
  createdAt: number    // timestamp
}

interface Outfit {
  id: string
  itemIds: string[]    // массив ClothingItem.id
  isFavorite: boolean
  createdAt: number
}
```

---

## Версии и конфигурация

| Параметр | Значение |
|---|---|
| App ID (Android) | `me.panf.obrazy` |
| App Name | `ОБРАЗЫ` |
| Android min SDK | 22 (Android 5.1) |
| Android target SDK | 36 |
| Gradle | 8.14.3 |
| Android Gradle Plugin | 8.13.0 |
| Capacitor | 8.3.x |
| Dev-сервер порт | 7878 |
