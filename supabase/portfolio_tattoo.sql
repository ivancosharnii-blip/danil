-- Run this in Supabase SQL Editor (manual step)
create table portfolio_tattoo (
  id uuid default gen_random_uuid() primary key,
  name text not null default 'Danil',
  bio text,
  updated_at timestamp with time zone default now()
);

alter table portfolio_tattoo enable row level security;

create policy "Public can view portfolio_tattoo" on portfolio_tattoo for select using (true);
create policy "Authenticated can update portfolio_tattoo" on portfolio_tattoo for update to authenticated using (true);
create policy "Authenticated can insert portfolio_tattoo" on portfolio_tattoo for insert to authenticated with check (true);

insert into portfolio_tattoo (name, bio) values (
  'Danil',
  'Тату-мастер из Кишинёва. Работаю в стилях графика, реализм, блэкворк и авторские эскизы. Принимаю заказы на индивидуальные эскизы и готов воплотить любую идею.'
);
