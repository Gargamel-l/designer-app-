# ОБРАЗЫ — приложение для подбора образов

Мобильное PWA/Android-приложение для создания личного гардероба, хранения вещей по аккаунтам и автоматического подбора образов на основе цветовой и стилевой совместимости.

---

## Содержание

- [Что делает приложение](#что-делает-приложение)
- [Тестовые аккаунты](#тестовые-аккаунты)
- [Архитектура](#архитектура)
- [Структура проекта](#структура-проекта)
- [Пользовательские данные и авторизация](#пользовательские-данные-и-авторизация)
- [Алгоритмы](#алгоритмы)
- [Зависимости](#зависимости)
- [Разработка веб](#разработка-веб)
- [Сборка PWA](#сборка-pwa)
- [Сборка Android APK](#сборка-android-apk)
- [Установка APK на устройство](#установка-apk-на-устройство)
- [Известные особенности](#известные-особенности)
- [Типы данных](#типы-данных)
- [Версии и конфигурация](#версии-и-конфигурация)

---

## Что делает приложение

**ОБРАЗЫ** — это стилистический ассистент, который:

1. Позволяет войти в приложение по логину и паролю.
2. Хранит гардероб, образы и избранное отдельно для каждого аккаунта.
3. Принимает фото одежды через камеру или галерею.
4. Удаляет фон с изображения прямо в браузере, без серверов.
5. Определяет доминирующий цвет вещи автоматически.
6. Позволяет вручную подтвердить или изменить цвет вещи.
7. Позволяет указать один или несколько стилей вещи.
8. Позволяет оставить вещь **без стиля** — такая вещь считается универсальной.
9. Хранит гардероб локально на устройстве.
10. Подбирает образы из имеющихся вещей по цветовой и стилевой совместимости.
11. Сохраняет понравившиеся образы для быстрого доступа.
12. Позволяет выйти из аккаунта на странице **Мои данные**.

### Экраны

| Вкладка | Что показывает |
|---|---|
| **Гардероб** | Все добавленные вещи по категориям, с фото, цветом и стилем |
| **Образы** | Сохранённые понравившиеся образы в виде сетки |
| **+ Загрузить** | Мастер добавления новой вещи |
| **Подобрать** | Генератор образов — листаешь и лайкаешь |
| **Данные** | Информация об аккаунте, статистика и выход из аккаунта |

---

## Тестовые аккаунты

Пока авторизация реализована локально, без сервера.

| Логин | Пароль | Назначение |
|---|---|---|
| `root` | `root` | Тестовый администраторский аккаунт |
| `user` | `user123` | Тестовый пользовательский аккаунт |

Данные этих аккаунтов хранятся отдельно. Вещи и образы, добавленные под `root`, не отображаются под `user`, и наоборот.

---

## Архитектура

```text
React 18 + TypeScript
  ├── MUI 5 — компонентная библиотека
  ├── Vite 5 — сборщик
  ├── Capacitor 8 — Android-обёртка
  ├── @imgly/background-removal — удаление фона через ONNX WASM
  ├── localStorage — локальное хранилище данных
  └── локальная авторизация — root/user без backend-сервера
```

### Поток данных

```text
Пользователь → AuthScreen
  └── loginUser(login, password)
      └── localStorage['current_user_v1']

Пользователь → UploadDialog
  ├── TypeSelector   → выбор категории: куртка / футболка / штаны / обувь и т.д.
  ├── PhotoCapture   → камера/галерея → удаление фона → detectDominantColor()
  └── ColorAssign    → подтверждение/смена цвета
        └── StyleSelector → выбор стилей или состояние "Без стиля"
            └── ClothingItem сохраняется в гардероб текущего аккаунта

ClothingItem → AppContext → useWardrobe(user)
  └── localStorage[`wardrobe_v1_${user.login}`]

MatchScreen → generateOutfits(items)
  ├── outfitRules.ts        → фильтр по стилям
  ├── colorCompatibility.ts → оценка совместимости цветов
  └── лайк → saveOutfit({ isFavorite: true })
      └── localStorage[`outfits_v1_${user.login}`]

ProfileScreen
  ├── показывает текущий аккаунт
  ├── показывает статистику
  └── logoutUser() → очистка current_user_v1
```

---

## Структура проекта

```text
color-app/
├── src/
│   ├── main.tsx                         # точка входа React
│   ├── App.tsx                          # shell: авторизация + нижняя навигация + вкладки
│   ├── AppContext.tsx                   # глобальный контекст items/outfits/tab/uploadOpen
│   ├── auth.ts                          # локальная авторизация root/user
│   ├── theme.ts                         # MUI тема, единый стиль шрифтов и UI
│   ├── types.ts                         # TypeScript-типы приложения
│   │
│   ├── constants/
│   │   └── styleLabels.ts               # подписи стилей одежды
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                   # состояние авторизации
│   │   ├── useWardrobe.ts               # CRUD для ClothingItem + user-based localStorage
│   │   └── useOutfits.ts                # CRUD для Outfit + user-based localStorage
│   │
│   ├── data/
│   │   └── colors.ts                    # палитра 55 цветов, 5 семейств × 11 оттенков
│   │
│   ├── utils/
│   │   ├── colorCompatibility.ts        # areColorsCompatible(), outfitColorScore()
│   │   ├── colorDetection.ts            # detectDominantColor() через canvas API
│   │   ├── outfitGenerator.ts           # generateOutfits() — генерация образов
│   │   └── outfitRules.ts               # проверка совместимости стилей и структуры образа
│   │
│   ├── screens/
│   │   ├── AuthScreen.tsx               # экран входа по логину и паролю
│   │   ├── WardrobeScreen.tsx           # список вещей гардероба
│   │   ├── OutfitsScreen.tsx            # сохранённые образы
│   │   ├── MatchScreen.tsx              # подбор образов
│   │   └── ProfileScreen.tsx            # мои данные, статистика, выход
│   │
│   └── components/
│       ├── OutfitComposite.tsx          # рендер flat-lay раскладки образа
│       ├── ClothingCard.tsx             # карточка вещи в гардеробе
│       ├── ItemDetailDialog.tsx         # детальный просмотр вещи, цвет, стиль, удаление
│       ├── ScreenHeader.tsx             # заголовок экрана
│       └── upload/
│           ├── UploadDialog.tsx         # диалог-мастер добавления вещи
│           ├── TypeSelector.tsx         # выбор категории одежды
│           ├── PhotoCapture.tsx         # фото + удаление фона
│           ├── ColorAssign.tsx          # выбор/подтверждение цвета
│           └── StyleSelector.tsx        # dropdown с мультивыбором стилей
│
├── public/
│   ├── manifest.json                    # PWA-манифест
│   └── icons/
│       ├── icon-192.png                 # иконка PWA
│       └── icon-512.png
│
├── android/                             # Capacitor Android-проект
│   ├── app/
│   │   └── src/main/
│   │       ├── AndroidManifest.xml      # INTERNET + CAMERA permissions
│   │       └── assets/public/           # dist/ копируется сюда при cap sync
│   ├── gradle.properties                # org.gradle.java.home, JDK 21
│   └── local.properties                 # sdk.dir, Android SDK путь
│
├── capacitor.config.ts                  # appId, appName, webDir
├── vite.config.ts                       # Vite-конфиг
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

---

## Пользовательские данные и авторизация

Авторизация реализована локально. Приложение не использует сервер, базу данных или сетевые запросы для входа.

### Ключи localStorage

| Ключ | Что хранит |
|---|---|
| `current_user_v1` | Текущий авторизованный пользователь |
| `wardrobe_v1_root` | Гардероб пользователя `root` |
| `wardrobe_v1_user` | Гардероб пользователя `user` |
| `outfits_v1_root` | Образы пользователя `root` |
| `outfits_v1_user` | Образы пользователя `user` |

### Вход

При запуске приложения, если пользователь не авторизован, открывается экран входа.

Пользователь вводит логин и пароль. Если пара совпадает с локальным списком пользователей, объект пользователя сохраняется в `localStorage['current_user_v1']`.

### Выход

На странице **Мои данные** есть кнопка **Выйти из аккаунта**. Она удаляет `current_user_v1` и возвращает приложение на экран входа.

### Изоляция данных

Гардероб и образы привязаны к логину пользователя через отдельные ключи localStorage. Это значит, что при переключении с `root` на `user` приложение загружает другой набор вещей и образов.

---

## Алгоритмы

### Мастер добавления вещи

Текущий порядок добавления вещи:

```text
1. Тип одежды
2. Фотография
3. Цвет и стиль
```

На последнем шаге пользователь:

1. Подтверждает или меняет автоматически найденный цвет.
2. При необходимости выбирает стили одежды через dropdown.

Если стили не выбраны, в поле отображается **Без стиля**. Такая вещь считается универсальной и подходит ко всем стилям.

### Стили одежды

Поддерживаются четыре стиля:

| Код | Отображение |
|---|---|
| `sport` | Спортивный |
| `casual` | Повседневный |
| `festive` | Праздничный |
| `formal` | Официальный |

У одной вещи может быть несколько стилей.

Примеры:

```ts
styles: []
// Без стиля, универсальная вещь

styles: ['sport']
// Только спортивная вещь

styles: ['sport', 'casual']
// Подходит и к спортивным, и к повседневным образам
```

### Совместимость стилей (`outfitRules.ts`)

Правило простое:

1. Если у вещи `styles = []`, она универсальная и совместима с любым стилем.
2. Если у обеих вещей есть стили, у них должен быть хотя бы один общий стиль.
3. Разные стили сами по себе не объединяются.

Примеры:

| Вещь 1 | Вещь 2 | Результат |
|---|---|---|
| `[]` | `['formal']` | подходит |
| `['sport']` | `['formal']` | не подходит |
| `['casual']` | `['festive']` | не подходит |
| `['sport', 'casual']` | `['casual']` | подходит |
| `['formal']` | `['formal', 'festive']` | подходит |

Это предотвращает ситуации, когда спортивные штаны автоматически сочетаются с официальными туфлями только из-за цвета.

### Удаление фона (`PhotoCapture.tsx` + `@imgly/background-removal`)

Используется модель `isnet_quint8`. Она работает полностью в браузере через ONNX Runtime WebAssembly. При первом запуске модель скачивается и кешируется браузером. Результат — PNG с прозрачным фоном, закодированный в base64.

```text
Фото → ONNX isnet_quint8 → PNG без фона → canvas → detectDominantColor()
```

### Определение доминирующего цвета (`colorDetection.ts`)

1. Изображение масштабируется до 80px по большей стороне.
2. Изображение отрисовывается на `<canvas>`.
3. Пиксели извлекаются через `getImageData()`.
4. Прозрачные пиксели `alpha < 128` пропускаются.
5. Для каждого пикселя ищется ближайший цвет в палитре по перцептивному расстоянию:

```text
dist = √(2·ΔR² + 4·ΔG² + 3·ΔB²)
```

6. Цвет с наибольшим числом голосов считается доминирующим.

### Цветовая палитра (`colors.ts`)

55 цветов: 5 семейств × 11 оттенков.

| Семейство | Код |
|---|---|
| Синий | `blue` |
| Серый | `gray` |
| Красный | `red` |
| Жёлтый | `yellow` |
| Зелёный | `green` |

Оттенки генерируются от светлого к тёмному:

```text
lightness = 95 - i * 8
name = "Blue 0" ... "Blue 10"
```

### Совместимость цветов (`colorCompatibility.ts`)

Функция `areColorsCompatible(a, b)` возвращает `true`, если:

1. Хотя бы один цвет — серый.
2. Цвета из одной семьи.
3. Цвета образуют допустимую комплементарную пару.

| Цвет | Совместим с |
|---|---|
| blue | red, yellow, green |
| red | blue, green |
| yellow | blue, green |
| green | red, yellow, blue |
| gray | всё |

`outfitColorScore(colors[])` — доля совместимых пар из всех возможных пар в образе. Значение находится в диапазоне от `0` до `1`.

### Генерация образов (`outfitGenerator.ts`)

Главное структурное правило:

```text
каждый образ содержит (верх ИЛИ куртку) + низ
```

Генерируются комбинации:

| Комбинация | Пример |
|---|---|
| куртка + верх + низ + обувь | куртка + футболка + штаны + обувь |
| куртка + верх + низ | куртка + футболка + брюки |
| куртка + низ + обувь | куртка + шорты + кроссовки |
| верх + низ + обувь | футболка + штаны + обувь |
| верх + низ | футболка + брюки |
| куртка + низ | куртка + шорты |

Этапы генерации:

1. Вещи группируются по категориям.
2. Создаются все допустимые комбинации.
3. Комбинации фильтруются через `isOutfitValid()`:
   - есть низ;
   - есть верх или куртка;
   - стили совместимы.
4. Комбинации дедуплицируются.
5. Комбинации сортируются по `outfitColorScore()`.
6. Приоритет отдаётся образам с `score >= 0.5`.
7. Если хороших цветовых комбинаций нет, показываются все допустимые по структуре и стилям комбинации.

### Отображение образа (`OutfitComposite.tsx`)

`OutfitComposite` рендерит flat-lay раскладку с абсолютным позиционированием и z-index:

```text
jacket  — сверху слева, 65% ширины
tops    — по центру сверху
bottoms — по центру снизу
shoes   — снизу справа
```

---

## Зависимости

### Runtime

| Пакет | Версия | Зачем |
|---|---|---|
| `react` + `react-dom` | 18.3 | UI-фреймворк |
| `@mui/material` | 5.15.19 | компоненты интерфейса |
| `@mui/icons-material` | 5.15.19 | иконки |
| `@emotion/react` + `@emotion/styled` | 11.x | CSS-in-JS для MUI |
| `@imgly/background-removal` | 1.4.5 | удаление фона через ONNX WASM |
| `uuid` | 9.x | генерация уникальных ID |

### Dev

| Пакет | Версия | Зачем |
|---|---|---|
| `vite` | 5.4 | сборщик и dev-сервер |
| `@vitejs/plugin-react` | 4.3 | React-плагин для Vite |
| `typescript` | 5.5 | типизация |
| `@capacitor/core` + `cli` + `android` | 8.3 | Android-обёртка |

### Системные зависимости для Android-сборки

| Инструмент | Рекомендуемая версия |
|---|---|
| Node.js | 18+ |
| pnpm | актуальная |
| JDK | 21 |
| Android SDK | установлен через Android Studio или command-line tools |
| Android Build Tools | 36.0.0 |
| Android Platform | android-36 |

> Capacitor 8 требует JDK 21. Если Gradle запускается на JDK 17, появится ошибка `invalid source release: 21`.

---

## Разработка веб

```bash
pnpm install
pnpm dev
```

Dev-сервер:

```text
http://localhost:7878
```

Если в dev-режиме появляется ошибка MUI вида `createTheme_default is not a function`, используйте production preview:

```bash
pnpm serve
```

### Доступные скрипты

| Команда | Описание |
|---|---|
| `pnpm dev` | Vite dev-сервер |
| `pnpm build` | Production-сборка в `dist/` |
| `pnpm preview` | Превью production-сборки |
| `pnpm serve` | `build` + `preview` |
| `pnpm cap:sync` | `build` + `npx cap sync android` |
| `pnpm cap:apk` | `cap:sync` + сборка APK через Gradle |
| `pnpm cap:open` | Открыть Android Studio |

---

## Сборка PWA

```bash
pnpm build
```

Готовая сборка будет в папке:

```text
dist/
```

`public/manifest.json` настроен для standalone PWA:

- `display: standalone`
- `theme_color: #000000`
- иконки 192×192 и 512×512

Для деплоя нужно загрузить содержимое `dist/` на HTTPS-хостинг.

---

## Сборка Android APK

### Первичная настройка

#### 1. JDK 21

Установите JDK 21. Например, Eclipse Temurin 21.

Проверьте Java:

```powershell
java -version
javac -version
where.exe java
```

Если Gradle использует не ту Java, укажите путь в `android/gradle.properties`:

```properties
org.gradle.java.home=C:/Users/<username>/AppData/Local/Programs/Eclipse Adoptium/jdk-21.0.11.10-hotspot
```

Путь должен указывать на реальную папку JDK 21.

#### 2. Android SDK

Проверьте стандартный путь:

```powershell
Test-Path "$env:LOCALAPPDATA\Android\Sdk"
```

Если команда вернула `True`, в `android/local.properties` можно указать:

```properties
sdk.dir=C:/Users/<username>/AppData/Local/Android/Sdk
```

Если SDK нет, установите его через Android Studio:

```text
Android Studio → More Actions → SDK Manager
```

Установите:

- Android SDK Platform
- Android SDK Build-Tools
- Android SDK Platform-Tools
- Android SDK Command-line Tools

### Сборка APK

Запускать команду лучше из корня проекта:

```powershell
cd "C:\Users\TaidanaIshi\Desktop\RGU\android app\designer-app-"
pnpm cap:apk
```

Или пошагово:

```powershell
pnpm build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

APK будет здесь:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Частые ошибки сборки

#### `Cannot find type definition file for 'react'`

Причина — повреждённый `node_modules`, часто после переноса проекта архивом.

Решение:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
pnpm install --no-frozen-lockfile
```

#### `Java home supplied is invalid`

В `android/gradle.properties` указан путь к несуществующей JDK.

Решение — указать реальный путь к JDK 21 или удалить строку `org.gradle.java.home`, если системная Java настроена правильно.

#### `SDK location not found`

Gradle не видит Android SDK.

Решение — исправить `android/local.properties`:

```properties
sdk.dir=C:/Users/<username>/AppData/Local/Android/Sdk
```

#### `invalid source release: 21`

Gradle запущен на JDK 17 или ниже, а проект требует JDK 21.

Решение — установить JDK 21 и указать её через `org.gradle.java.home`.

---

## Установка APK на устройство

### Через ADB

1. Включите режим разработчика на Android.
2. Включите отладку по USB.
3. Подключите устройство кабелем USB.

```bash
adb devices
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

При переустановке:

```bash
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### Вручную через файл

Скопируйте `app-debug.apk` на телефон и откройте файловым менеджером. Может потребоваться разрешить установку из неизвестных источников.

---

## Известные особенности

### Данные хранятся локально

Все данные находятся в `localStorage` текущего WebView/браузера. Если удалить данные приложения Android или очистить хранилище браузера, гардероб и образы будут удалены.

### Авторизация демонстрационная

Логины и пароли захардкожены локально в `src/auth.ts`. Это подходит для MVP и демонстрации, но не является безопасной полноценной авторизацией.

Для production-версии нужно заменить локальную авторизацию на backend/API, токены и серверное хранение пользователей.

### Вещь без стиля универсальна

Если при добавлении или редактировании вещи не выбран ни один стиль, она считается универсальной и может участвовать в любых образах.

### Первый запуск удаления фона

При первом использовании удаления фона браузер скачивает модель. После кеширования функция работает быстрее.

### Лимит localStorage

Фотографии вещей хранятся в base64. При большом количестве изображений возможно переполнение localStorage. Рекомендуется оптимизировать размер изображений.

### Сборка под Android на Windows

Скрипт `cap:apk` использует `gradlew.bat`. На macOS/Linux нужно запускать Gradle через `./gradlew assembleDebug`.

### Минимальные требования для подбора образов

Экран **Подобрать** требует минимум:

```text
одна верхняя вещь или куртка + один низ
```

Верх:

- футболка;
- длинный рукав;
- майка;
- куртка.

Низ:

- штаны;
- шорты.

---

## Типы данных

```ts
type UserLogin = 'root' | 'user'

interface AuthUser {
  login: UserLogin
  displayName: string
}

type ClothingCategory =
  | 'jacket'
  | 'tshirt'
  | 'longsleeve'
  | 'tanktop'
  | 'pants'
  | 'shorts'
  | 'shoes'

type ClothingStyle =
  | 'sport'
  | 'casual'
  | 'festive'
  | 'formal'

type ColorFamily =
  | 'blue'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'

interface ColorEntry {
  name: string
  hex: string
  family: ColorFamily
  lightness: number
}

interface ClothingItem {
  id: string
  category: ClothingCategory
  image: string
  color: ColorEntry

  /**
   * Пустой массив означает "Без стиля".
   * Такая вещь универсальна и подходит ко всем стилям.
   */
  styles: ClothingStyle[]

  /**
   * Старое поле для совместимости со старыми сохранёнными вещами.
   */
  style?: ClothingStyle

  createdAt: number
}

interface Outfit {
  id: string
  itemIds: string[]
  tags?: OutfitTag[]
  isFavorite: boolean
  createdAt: number
}
```

---

## Версии и конфигурация

| Параметр | Значение |
|---|---|
| App ID Android | `me.panf.obrazy` |
| App Name | `ОБРАЗЫ` |
| Android min SDK | 22 |
| Android target SDK | 36 |
| Gradle | 8.14.3 |
| Android Gradle Plugin | 8.13.0 |
| Capacitor | 8.3.x |
| Dev-сервер | `http://localhost:7878` |
| Авторизация | локальная, `root/root`, `user/user123` |
| Хранилище | `localStorage`, отдельно по аккаунтам |
