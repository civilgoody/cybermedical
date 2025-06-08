CREATE TABLE public.users (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    email text NOT NULL,
    password_hash text NOT NULL,
    name text NULL,
    created_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    phone text NULL,
    bio text NULL,
    city text NULL,
    country text NULL,
    post_code text NULL,
    role text NULL DEFAULT 'admin'::text,
    updated_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
    full_name text NULL,
    first_name text NULL,
    last_name text NULL,
    mfa_enabled boolean NULL DEFAULT false,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.admin_reports (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    admin uuid NOT NULL,
    reports text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT admin_reports_pkey PRIMARY KEY (id),
    CONSTRAINT admin_reports_admin_fkey FOREIGN KEY (admin) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.attack_reports (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    severity text NOT NULL,
    description text NOT NULL,
    analysis text NULL,
    type text NULL,
    mitigation text NULL,
    technical_analysis jsonb NULL,
    mitigation_steps jsonb NULL,
    confidence_score text NULL,
    "references" jsonb NULL DEFAULT '[]'::jsonb,
    CONSTRAINT attack_reports_pkey PRIMARY KEY (id),
    CONSTRAINT attack_reports_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);

CREATE TABLE public.invites (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    email text NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    used boolean NULL DEFAULT false,
    CONSTRAINT invites_pkey PRIMARY KEY (id),
    CONSTRAINT invites_token_key UNIQUE (token)
);
