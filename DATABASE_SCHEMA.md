# Blog Database Schema

**Database:** blog_db  
**PostgreSQL Version:** 18.1  
**Export Date:** 2026-04-20

---

## Tables Overview

| Table | Description | Row Count |
|-------|-------------|-----------|
| `users` | User accounts and authentication | 1 |
| `articles` | Blog articles/posts | - |
| `events` | Club events | - |
| `event_registrations` | Event registration records | - |
| `team_members` | Club team member profiles | - |
| `club_applications` | Membership applications | - |
| `settings` | Application settings (key-value) | - |

---

## Table Details

### 1. users

User accounts and authentication information.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | integer | PRIMARY KEY | `nextval('users_id_seq')` |
| `username` | varchar(50) | NOT NULL | - |
| `email` | varchar(100) | NOT NULL, UNIQUE | - |
| `password` | varchar(255) | NOT NULL | - |
| `role` | varchar(20) | - | `'user'` |
| `created_at` | timestamp | - | `CURRENT_TIMESTAMP` |

**Constraints:**
- `users_pkey`: PRIMARY KEY (id)
- `users_email_key`: UNIQUE (email)

---

### 2. articles

Blog articles and posts.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | integer | PRIMARY KEY | `nextval('articles_id_seq')` |
| `title` | varchar(255) | NOT NULL | - |
| `content` | text | NOT NULL | - |
| `image_url` | varchar(255) | - | - |
| `author_id` | integer | FOREIGN KEY → users(id) | - |
| `created_at` | timestamp | - | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp | - | `CURRENT_TIMESTAMP` |

**Constraints:**
- `articles_pkey`: PRIMARY KEY (id)
- `articles_author_id_fkey`: FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL

---

### 3. events

Club events information.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | integer | PRIMARY KEY | `nextval('events_id_seq')` |
| `title` | varchar(255) | NOT NULL | - |
| `description` | text | NOT NULL | - |
| `date` | timestamp | NOT NULL | - |
| `location` | varchar(255) | NOT NULL | - |
| `cover_image_url` | varchar(255) | - | - |
| `created_at` | timestamp | - | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp | - | `CURRENT_TIMESTAMP` |
| `is_hidden` | boolean | - | `false` |
| `registration_deadline` | timestamp | - | - |
| `max_participants` | integer | - | - |

**Constraints:**
- `events_pkey`: PRIMARY KEY (id)

---

### 4. event_registrations

Event registration records.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | integer | PRIMARY KEY | `nextval('event_registrations_id_seq')` |
| `event_id` | integer | FOREIGN KEY → events(id) | - |
| `full_name` | varchar(255) | NOT NULL | - |
| `email` | varchar(255) | NOT NULL | - |
| `phone` | varchar(50) | - | - |
| `school_name` | varchar(255) | - | - |
| `agreed_to_policies` | boolean | - | `false` |
| `created_at` | timestamp | - | `CURRENT_TIMESTAMP` |

**Constraints:**
- `event_registrations_pkey`: PRIMARY KEY (id)
- `event_registrations_event_id_email_key`: UNIQUE (event_id, email)
- `event_registrations_event_id_fkey`: FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE

---

### 5. team_members

Club team member profiles.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | integer | PRIMARY KEY | `nextval('team_members_id_seq')` |
| `name` | varchar(100) | NOT NULL | - |
| `role` | varchar(50) | NOT NULL | - |
| `photo_url` | varchar(255) | - | - |
| `social_links` | jsonb | - | `'{}'` |
| `created_at` | timestamp | - | `CURRENT_TIMESTAMP` |

**Constraints:**
- `team_members_pkey`: PRIMARY KEY (id)

---

### 6. club_applications

Membership applications to join the club.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | integer | PRIMARY KEY | `nextval('club_applications_id_seq')` |
| `full_name` | varchar(255) | NOT NULL | - |
| `email` | varchar(255) | NOT NULL | - |
| `major` | varchar(255) | NOT NULL | - |
| `motivation` | text | NOT NULL | - |
| `created_at` | timestamp | - | `CURRENT_TIMESTAMP` |

**Constraints:**
- `club_applications_pkey`: PRIMARY KEY (id)

---

### 7. settings

Application settings stored as key-value pairs.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `key` | varchar(50) | PRIMARY KEY | - |
| `value` | jsonb | - | - |

**Constraints:**
- `settings_pkey`: PRIMARY KEY (key)

---

## Relationships

```
users (1) ─────< (N) articles
  - author_id → users.id (ON DELETE SET NULL)

events (1) ─────< (N) event_registrations
  - event_id → events.id (ON DELETE CASCADE)
```

---

## Sequences

| Sequence | Start | Increment | Owned By |
|----------|-------|-----------|----------|
| `users_id_seq` | 1 | 1 | users.id |
| `articles_id_seq` | 1 | 1 | articles.id |
| `events_id_seq` | 1 | 1 | events.id |
| `event_registrations_id_seq` | 1 | 1 | event_registrations.id |
| `team_members_id_seq` | 1 | 1 | team_members.id |
| `club_applications_id_seq` | 1 | 1 | club_applications.id |

---

## Raw SQL Schema

<details>
<summary>Click to view full SQL DDL</summary>

```sql
-- Users Table
CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Articles Table
CREATE TABLE public.articles (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    image_url character varying(255),
    author_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;
ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);
ALTER TABLE ONLY public.articles ADD CONSTRAINT articles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.articles ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- Events Table
CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    date timestamp without time zone NOT NULL,
    location character varying(255) NOT NULL,
    cover_image_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_hidden boolean DEFAULT false,
    registration_deadline timestamp without time zone,
    max_participants integer
);

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;
ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);
ALTER TABLE ONLY public.events ADD CONSTRAINT events_pkey PRIMARY KEY (id);

-- Event Registrations Table
CREATE TABLE public.event_registrations (
    id integer NOT NULL,
    event_id integer,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    school_name character varying(255),
    agreed_to_policies boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.event_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.event_registrations_id_seq OWNED BY public.event_registrations.id;
ALTER TABLE ONLY public.event_registrations ALTER COLUMN id SET DEFAULT nextval('public.event_registrations_id_seq'::regclass);
ALTER TABLE ONLY public.event_registrations ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_registrations ADD CONSTRAINT event_registrations_event_id_email_key UNIQUE (event_id, email);
ALTER TABLE ONLY public.event_registrations ADD CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- Team Members Table
CREATE TABLE public.team_members (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    role character varying(50) NOT NULL,
    photo_url character varying(255),
    social_links jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;
ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);
ALTER TABLE ONLY public.team_members ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);

-- Club Applications Table
CREATE TABLE public.club_applications (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    major character varying(255) NOT NULL,
    motivation text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.club_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.club_applications_id_seq OWNED BY public.club_applications.id;
ALTER TABLE ONLY public.club_applications ALTER COLUMN id SET DEFAULT nextval('public.club_applications_id_seq'::regclass);
ALTER TABLE ONLY public.club_applications ADD CONSTRAINT club_applications_pkey PRIMARY KEY (id);

-- Settings Table
CREATE TABLE public.settings (
    key character varying(50) NOT NULL,
    value jsonb
);

ALTER TABLE ONLY public.settings ADD CONSTRAINT settings_pkey PRIMARY KEY (key);
```

</details>

---

*Generated from blog_db PostgreSQL 18.1*
