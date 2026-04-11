# picturedanil — Danil Art

Портфолио художника и тату-мастера: картины, тату-эскизы, страница «О художнике», контакты и админ-панель для контента.

## Стек

| Категория | Технологии |
|-----------|------------|
| Фреймворк | **Next.js** 16.2 (App Router, Turbopack в dev) |
| UI | **React** 19, **TypeScript** 5 |
| Стили | **Tailwind CSS** 4 (`@import "tailwindcss"` в `globals.css`) |
| Бэкенд данных | **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) — Postgres + Auth |
| Почта | **Resend** (`resend`) — заявки с карточки работы |
| Иконки | **lucide-react** 0.577 |
| Шрифты | **Inter**, **Bebas Neue** (Google Fonts, `next/font`) |

## Скрипты

```bash
npm run dev    # next dev
npm run build  # production build
npm run start  # next start
npm run lint   # eslint
```

## Структура репозитория (основное)

```
src/
  app/
    layout.tsx              # корневой layout, metadata, шрифты, data-theme на body
    globals.css             # CSS-переменные темы, утилиты
    page.tsx                # главная: галерея работ
    portfolio/page.tsx      # портфолио / био (данные из Supabase `portfolio`)
    contacts/page.tsx       # контакты (соцсети)
    work/[id]/page.tsx      # карточка работы
    api/send-inquiry/route.ts  # POST — отправка заявки на почту (Resend)
    admin/                  # админка (логин, CRUD работ, редактирование portfolio)
  components/
    Header.tsx              # шапка: логотип, навигация, на главной — табы галереи
    Gallery.tsx             # галерея, тема body, переход Ink (SymbioteTransition)
    SymbioteTransition.tsx  # CSS-анимация «чернил» (спрайт /ink.png)
    InquiryModal.tsx        # форма заявки на работу
    WorkInquiryCTA.tsx      # кнопка открытия модалки на странице работы
    ContactButtons.tsx, WorkForm.tsx, WorkCard.tsx, InkTransition.tsx, …
  lib/supabase/
    server.ts, client.ts    # Supabase для RSC и клиента
  types/index.ts            # `Work`, `WorkType`
public/
  logo.png                  # логотип в шапке (CSS-фильтры по теме)
  Danylo_*.png, ink.png     # ассеты логотипов и перехода
supabase/
  portfolio.sql             # SQL для таблицы `portfolio` (выполнять в Supabase SQL Editor)
```

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Главная: галерея (`works`), табы **Картины** / **Тату эскизы** через query `?tab=painting` \| `tattoo` |
| `/portfolio` | Биография и имя из таблицы `portfolio` |
| `/contacts` | Контакты |
| `/work/[id]` | Детальная страница работы, заявка через модалку |
| `/admin/login` | Вход в админку |
| `/admin`, `/admin/works`, `/admin/works/new`, `/admin/works/[id]` | Управление работами |
| `/admin/portfolio` | Редактирование имени и био в `portfolio` |

## Тема оформления

- На `body` задаётся **`data-theme="light"`** или **`"dark"`** (светлая — «картины», тёмная — «тату»), в т.ч. из `Gallery` и `BodyThemeFromWorkType` на отдельных страницах.
- Переменные в `globals.css`: `--page-bg`, `--page-text`, `--page-accent`, `--page-muted`, `--page-border`, `--page-header-bg`.
- Логотип в шапке: один файл `/logo.png`, класс **`logo-adaptive`**; для светлой/тёмной темы — фильтры в `globals.css` (`brightness` / `invert`).

## Данные Supabase

- **`works`** — работы портфолио (поля см. `src/types/index.ts`: `type`, `title`, `description`, `price`, `image_url`, `is_available`, `sort_order`, …). CRUD из админки.
- **`portfolio`** — одна строка (или несколько, но UI ожидает `.single()`): `name`, `bio`, `photo_url`, … Схема и RLS — в `supabase/portfolio.sql` (нужно выполнить в проекте Supabase).

## Переменные окружения

Создай `.env.local` (в репозиторий не коммитится):

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key Supabase |
| `RESEND_API_KEY` | ключ Resend для `POST /api/send-inquiry` |
| `NEXT_PUBLIC_SITE_URL` (опционально) | базовый URL сайта в письмах (ссылка на работу) |

## Интеграции

- **Resend**: отправка писем с заявки (поля: имя, фамилия, email, телефон, сообщение, работа). В коде указаны `from` (например, тестовый домен Resend) и `to` — заменить на боевые адреса и домен отправки после настройки Resend.

## Правила для агента / разработки

- В корне может быть ссылка на `AGENTS.md` / Next.js: перед нестандартными API Next смотреть актуальную документацию в `node_modules/next/dist/docs/`.

## Версия

- **package.json**: `version` `0.1.0`, `private: true`.
