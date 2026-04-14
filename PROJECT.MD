# picturedanil — Danil Art

Сайт-портфолио художника и тату-мастера: галерея работ (картины и тату-эскизы), две страницы «о себе» (живопись / тату), контакты, заявки на работу по почте и админ-панель для контента.

## Стек

| Категория | Технологии |
|-----------|------------|
| Фреймворк | **Next.js** 16.2 (App Router, Turbopack в dev) |
| UI | **React** 19, **TypeScript** 5 |
| Стили | **Tailwind CSS** 4 (`@import "tailwindcss"` в `src/app/globals.css`) |
| Данные | **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) — Postgres + Auth |
| Почта | **Resend** — заявки с карточки работы (`POST /api/send-inquiry`) |
| Иконки | **lucide-react** |
| Шрифты | **Inter**, **Bebas Neue** (`next/font/google` в `src/app/layout.tsx`) |

## Скрипты

```bash
npm run dev    # next dev
npm run build  # production build
npm run start  # next start
npm run lint   # eslint
```

## Структура репозитория

```
src/
  app/
    layout.tsx                 # корень: metadata, шрифты, LocaleProvider, body data-theme
    globals.css                # CSS-переменные темы, классы .logo-black / .logo-white
    page.tsx                   # главная: Header + Gallery (работы из Supabase)
    portfolio/page.tsx         # клиент: портфолио по ?tab= → portfolio | portfolio_tattoo, тема body
    contacts/page.tsx          # клиент: контакты + i18n заголовок
    work/[id]/page.tsx         # сервер: работа + Header + WorkDetail
    api/send-inquiry/route.ts  # Resend: заявка на работу
    admin/
      layout.tsx               # обёртка admin
      (dashboard)/layout.tsx   # сайдбар: Работы, Портфолио, Портфолио тату, Выход
      login/page.tsx
      (dashboard)/works/...    # список, новая, редактирование
      (dashboard)/portfolio/   # редактирование portfolio (живопись)
      (dashboard)/portfolio-tattoo/  # редактирование portfolio_tattoo
  components/
    Header.tsx                 # сетка 1fr auto 1fr, лого по центру, навигация + флажки i18n
    Gallery.tsx                # табы URL, тема body, InkTransition, FeedItem
    SymbioteTransition.tsx     # анимация перехода (спрайт /ink.png), импорт в Gallery как InkTransition
    WorkDetail.tsx             # страница работы: hero 70vh, блок с ценой/описанием/CTA
    WorkInquiryCTA.tsx, InquiryModal.tsx, ContactButtons.tsx
    WorkForm.tsx, WorkCard.tsx, HeroTitle.tsx (опционально не используется на главной)
  lib/
    supabase/server.ts, client.ts
    i18n.ts                    # ru | en | cs, словарь статичных строк, t()
    locale-context.tsx         # LocaleProvider, useLocale()
  types/index.ts               # Work, WorkType
public/
  logo-black.png, logo-white.png   # логотип в шапке (переключение по data-theme)
  logo.png, Danylo_White_2x.png, ink.png, …
supabase/
  portfolio.sql                # схема + RLS + seed для portfolio
  portfolio_tattoo.sql         # схема + RLS + seed для portfolio_tattoo
```

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Главная: галерея `works`, табы **Картины** / **Тату эскизы** через `?tab=painting` \| `tattoo`, Ink-переход между режимами |
| `/portfolio` | Портфолио: при `?tab=tattoo` — строка из `portfolio_tattoo`, иначе `portfolio`; тема body dark/light |
| `/contacts` | Соцсети (Instagram, Facebook), i18n заголовок |
| `/work/[id]` | Карточка работы: hero-изображение, цена, описание, заявка, «Назад» |
| `/admin/login` | Вход (Supabase Auth) |
| `/admin`, `/admin/works`, `/admin/works/new`, `/admin/works/[id]` | CRUD работ |
| `/admin/portfolio` | Имя и био таблицы `portfolio` |
| `/admin/portfolio-tattoo` | Имя и био таблицы `portfolio_tattoo` |

## Тема оформления

- На **`body`** задаётся **`data-theme="light"`** или **`"dark"`** (светлая — картины, тёмная — тату): `Gallery`, страница `/portfolio`, `BodyThemeFromWorkType` на `/work/[id]`, `Header` подписан на изменения через `MutationObserver`.
- Переменные в `globals.css`: `--page-bg`, `--page-text`, `--page-accent`, `--page-muted`, `--page-border`, `--page-header-bg`.
- Логотип: два `next/image` (`/logo-black.png`, `/logo-white.png`), классы **`logo-black`** / **`logo-white`**; правила в `globals.css` с `body[data-theme='light'|'dark']` и при необходимости `!important` из-за inline-стилей у Image.

## Интернационализация (статичный UI)

- **`src/lib/i18n.ts`** — локали `ru` \| `en` \| `cs`, объект `translations`, функция `t(locale, key)`.
- **`src/lib/locale-context.tsx`** — `LocaleProvider` в `layout.tsx`, переключатель флагов в `Header.tsx`.
- Переводятся шапка, галерея (пустая категория, цена, «Продана»), модалка заявки, контакты, кнопка заявки, часть текста на странице работы в `WorkDetail`. Контент из БД (названия работ, описания, био) не переводится.

## Данные Supabase

### Таблица `works`

Поля (см. `src/types/index.ts`): `id`, `type` (`painting` \| `tattoo`), `title`, `description`, `price`, `image_url`, `is_available`, `sort_order`, `created_at`. Список и редактирование из админки.

### Таблица `portfolio`

Одна строка в UI (`.single()`): `name`, `bio`, `photo_url`, `updated_at` и т.д. SQL и RLS: **`supabase/portfolio.sql`** — выполнить в Supabase SQL Editor.

### Таблица `portfolio_tattoo`

Отдельное портфолио для режима тату: `name`, `bio`, `updated_at`. SQL и RLS: **`supabase/portfolio_tattoo.sql`**.

Политики (типично): публичный `select`, для `authenticated` — `insert` / `update` (как в SQL-файлах).

## Переменные окружения

Файл **`.env.local`** (не коммитится):

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `RESEND_API_KEY` | отправка писем из `/api/send-inquiry` |
| `NEXT_PUBLIC_SITE_URL` | опционально: ссылка на работу в письме (fallback в коде при отсутствии) |

## API заявок

- **`POST /api/send-inquiry`** (`src/app/api/send-inquiry/route.ts`): тело JSON — имя, фамилия, email, телефон, сообщение, `workTitle`, `workId`.
- **Resend**: в коде заданы `from` / `to` — для продакшена заменить на свой домен и почту получателя.

## Особенности UX / верстки

- **Переход табов галереи**: спрайт `/ink.png`, длительность анимации и таймеры в `SymbioteTransition.tsx` (например `inkOpen` / `inkClose` 0.4s, таймауты midpoint/end согласованы с анимацией).
- **Карточки в галерее**: `group` + hover — градиент и текст (название, цена) с `opacity` и transition; на мобиле лента картин без горизонтальных отступов до `md`.
- **Шапка**: на узком экране в боковой колонке только флажки; ссылки «Портфолио» / «Контакты» с `md`; лого — круг 56px до `md`, 80px от `md`; ссылка на портфолио сохраняет `?tab=` с главной.
- **Страница работы**: полноширинный hero 70vh `object-cover`, градиент снизу, заголовок поверх; ниже блок до 600px с анимацией появления снизу.

## Правила для разработки

- В корне / в правилах Cursor может быть ссылка на **`AGENTS.md`**: для нестандартных API Next.js сверяться с актуальной документацией в `node_modules/next/dist/docs/`.

## Версия

- **package.json**: `name` `picturedanil`, `version` `0.1.0`, `private: true`.
