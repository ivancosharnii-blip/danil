-- Run this in Supabase SQL Editor (Step 1)

create table portfolio (
  id uuid default gen_random_uuid() primary key,
  name text not null default 'Danil',
  bio text,
  photo_url text,
  updated_at timestamp with time zone default now()
);

alter table portfolio enable row level security;

create policy "Public can view portfolio" on portfolio for select using (true);
create policy "Authenticated can update portfolio" on portfolio for update to authenticated using (true);
create policy "Authenticated can insert portfolio" on portfolio for insert to authenticated with check (true);

insert into portfolio (name, bio) values (
  'Danil',
  'Художник и тату-мастер из Кишинёва. Работаю в стиле графика, реализм и авторская живопись. Каждая работа — это отдельная история, рождённая из идеи клиента и моего видения.'
);
