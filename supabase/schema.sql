-- Supabase schema for Lead Bouncer MVP
-- Run this in the Supabase SQL editor or include in your migrations.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------
-- customers: one row per Supabase auth user / paying customer
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid PRIMARY KEY DEFAULT auth.uid(), -- mirrors auth.users.id
    email text NOT NULL UNIQUE,
    plan text NOT NULL DEFAULT 'free', -- free | starter | growth | agency
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
-- Allow each user to see & edit only their own customer row
CREATE POLICY "Customers: owner can read" ON public.customers
    FOR SELECT USING ( id = auth.uid() );
CREATE POLICY "Customers: owner can insert" ON public.customers
    FOR INSERT WITH CHECK ( id = auth.uid() );
CREATE POLICY "Customers: owner can update" ON public.customers
    FOR UPDATE USING ( id = auth.uid() );

-- ------------------------------------------------------------------
-- forms: each protected web form the customer adds
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forms (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    name text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
-- Only owner can access their forms
CREATE POLICY "Forms: owner can read" ON public.forms
    FOR SELECT USING ( customer_id = auth.uid() );
CREATE POLICY "Forms: owner can insert" ON public.forms
    FOR INSERT WITH CHECK ( customer_id = auth.uid() );
CREATE POLICY "Forms: owner can update" ON public.forms
    FOR UPDATE USING ( customer_id = auth.uid() );

-- ------------------------------------------------------------------
-- leads: every submission that hits validate-lead (passed or blocked)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    email text,
    phone text,
    status text NOT NULL CHECK (status IN ('passed', 'blocked', 'review')),
    score int,
    data jsonb,           -- raw submission or extra signals
    elapsed_seconds real, -- captured fill time
    reason text,          -- why blocked
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_form_id_idx ON public.leads(form_id);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- A user can access a lead if they own the parent form
CREATE POLICY "Leads: owner can read" ON public.leads
    FOR SELECT USING (
        form_id IN (SELECT id FROM public.forms WHERE customer_id = auth.uid())
    );
CREATE POLICY "Leads: owner can insert" ON public.leads
    FOR INSERT WITH CHECK (
        form_id IN (SELECT id FROM public.forms WHERE customer_id = auth.uid())
    );

-- ------------------------------------------------------------------
-- Done. 