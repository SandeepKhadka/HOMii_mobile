-- Migration: extend profiles table for international students
-- Run in Supabase Dashboard → SQL Editor → New Query

alter table public.profiles
  add column if not exists avatar_url      text,
  add column if not exists phone_number    text,
  add column if not exists date_of_birth  text,          -- format: YYYY-MM-DD
  add column if not exists nationality     text,          -- e.g. "Chinese", "Nigerian"
  add column if not exists current_address text,          -- UK address freetext
  add column if not exists course          text,          -- "Computer Science", "MBA"
  add column if not exists year_of_study   text;          -- "foundation"|"year_1"|"year_2"|"year_3"|"year_4"|"masters"|"phd"
