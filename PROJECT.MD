# picturedanil — проект

## Назначение

Веб-портфолио художника и тату-мастера **Danil Art**: публичная витрина работ (картины и тату-эскизы) и админ-панель для управления каталогом. Интерфейс на русском языке.

## Метаданные пакета

| Поле | Значение |
|------|----------|
| Имя npm | `picturedanil` |
| Версия | `0.1.0` |
| Приватный пакет | да |

## Технологический стек

| Слой | Технологии |
|------|------------|
| Фреймворк | [Next.js](https://nextjs.org) **16.2.2** (App Router) |
| UI | [React](https://react.dev) **19.2.4**, [Tailwind CSS](https://tailwindcss.com) **4** (`@tailwindcss/postcss`) |
| Язык | TypeScript **5** (strict) |
| Бэкенд / данные | [Supabase](https://supabase.com): PostgreSQL, Auth, Storage (`@supabase/supabase-js` **2.x**, `@supabase/ssr` **0.10**) |
| Иконки | [lucide-react](https://lucide.dev) **1.7** |
| Шрифт | [Geist](https://vercel.com/font) через `next/font/google` (подмножества `latin`, `latin-ext`) |
| Линтинг | ESLint **9** с `eslint-config-next` **16.2.2** |

### Важно для разработчиков

В репозитории зафиксировано правило: эта версия Next.js может отличаться от «классической» документации. Перед изменениями имеет смысл сверяться с гайдами в `node_modules/next/dist/docs/` и учитывать предупреждения об устаревании API.

## Структура каталогов (основное)

```
src/
  app/                 # маршруты App Router, layout, globals.css
  components/          # Header, Gallery, WorkCard, ContactButtons, WorkForm
  lib/supabase/        # createClient() для браузера и сервера
  types/index.ts       # типы домена (Work, WorkType)
```

## Переменные окружения

Файл для локальной разработки: **`.env.local`** (в репозиторий не коммитить).

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | публичный anon key для клиента и SSR |

Оба значения используются в `src/lib/supabase/client.ts` и `src/lib/supabase/server.ts`.

## Модель данных (приложение)

Тип `Work` (`src/types/index.ts`):

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `string` | идентификатор записи |
| `type` | `'painting' \| 'tattoo'` | категория: картина или тату-эскиз |
| `title` | `string` | название |
| `description` | `string \| null` | описание |
| `price` | `number \| null` | цена (в UI отображается с символом ₴) |
| `image_url` | `string` | URL изображения |
| `is_available` | `boolean` | доступность (в UI: «Продана», если `false`) |
| `sort_order` | `number` | порядок сортировки на главной |
| `created_at` | `string` | метка времени создания |

Таблица в Supabase: **`works`**. Запросы на главной: `select('*').order('sort_order', { ascending: true })`.

## Supabase Storage

- **Бакет:** `works-images`
- **Загрузка из админки:** клиент сжимает изображение до WebP (макс. сторона 1920px), путь вида `public/<timestamp>-<random>.webp`
- Публичный URL бакета попадает в поле `image_url` записи в `works`

## Маршруты

| Путь | Назначение |
|------|------------|
| `/` | Главная: галерея с вкладками «Картины» / «Тату эскизы», контакты, футер |
| `/work/[id]` | Карточка одной работы (изображение, цена, описание, контакты) |
| `/admin/login` | Вход по email/паролю (Supabase Auth) |
| `/admin/works` | Список работ (требуется сессия) |
| `/admin/works/new` | Создание работы |
| `/admin/works/[id]` | Редактирование работы |

После успешного входа выполняется редирект на `/admin/works`. Макет дашборда (`admin/(dashboard)/layout.tsx`) проверяет пользователя через `supabase.auth.getUser()` и при отсутствии сессии перенаправляет на `/admin/login`.

## Server Actions (`src/app/admin/actions.ts`)

- **`login`** — `signInWithPassword`, редирект на `/admin/works`
- **`logout`** — `signOut`, редирект на `/admin/login`
- **`createWork`** — вставка в `works`, `sort_order` = max+1 или 0; `revalidatePath('/')`
- **`updateWork`** — обновление записи по `id`; `revalidatePath('/')`
- **`deleteWork`** — удаление по `id`; `revalidatePath('/')` и `revalidatePath('/admin/works')`

## Конфигурация Next.js (`next.config.ts`)

Для `next/image` разрешены удалённые изображения с хостов `*.supabase.co`, путь `/storage/v1/object/public/**` (HTTPS).

## SEO и разметка

- **`metadata`** в корневом `layout.tsx`: заголовок «Danil Art — Картины и тату эскизы», описание портфолио
- `<html lang="ru">`

## Контакты на сайте

Компонент `ContactButtons` содержит ссылки на телефон, email, Facebook и Instagram. В коде сейчас указаны **примерные/заглушечные** значения (`tel:+380991234567`, `mailto:danil@example.com`, общие URL соцсетей) — перед продакшеном их нужно заменить на реальные.

## Скрипты npm

| Команда | Действие |
|---------|----------|
| `npm run dev` | сервер разработки Next.js |
| `npm run build` | production-сборка |
| `npm run start` | запуск production-сервера |
| `npm run lint` | ESLint |

## Связанные файлы в корне

- `README.md` — стандартный шаблон create-next-app (общие инструкции по Next.js)
- `AGENTS.md` / `CLAUDE.md` — правила для ИИ-агентов (в т.ч. про версию Next.js)
- `postcss.config.mjs` — плагин Tailwind PostCSS
- `tsconfig.json` — алиас `@/*` → `./src/*`

---

*Документ отражает состояние кодовой базы на момент составления и предназначен для быстрой ориентации в проекте.*
