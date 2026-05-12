
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Roles
create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "roles_select_self" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "roles_admin_manage" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "roles_self_insert" on public.user_roles for insert to authenticated with check (user_id = auth.uid());

-- Auto-create profile + default 'user' role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'user'::public.app_role))
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Documents
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reference text not null,
  category text not null,
  status text not null default 'مؤرشف',
  file_url text,
  file_path text,
  qr_token text not null unique default replace(gen_random_uuid()::text,'-',''),
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;

create policy "documents_select_authenticated" on public.documents for select to authenticated using (true);
create policy "documents_admin_insert" on public.documents for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "documents_admin_update" on public.documents for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "documents_admin_delete" on public.documents for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- Storage bucket
insert into storage.buckets (id, name, public) values ('documents','documents', true);

create policy "documents_bucket_public_read" on storage.objects for select using (bucket_id = 'documents');
create policy "documents_bucket_admin_write" on storage.objects for insert to authenticated with check (bucket_id = 'documents' and public.has_role(auth.uid(),'admin'));
create policy "documents_bucket_admin_update" on storage.objects for update to authenticated using (bucket_id = 'documents' and public.has_role(auth.uid(),'admin'));
create policy "documents_bucket_admin_delete" on storage.objects for delete to authenticated using (bucket_id = 'documents' and public.has_role(auth.uid(),'admin'));
