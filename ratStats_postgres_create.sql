SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- CREATE TABLE public.users (
-- 	"_id" serial NOT NULL,
-- 	"username" varchar NOT NULL,
-- 	"password" varchar NOT NULL,
-- 	"ssid" varchar NOT NULL,
-- 	"number_sightings" bigint NOT NULL,
-- 	"profile_picture" varchar NOT NULL,
-- 	"favorite_rat" varchar NOT NULL,
--   "created_at" timestamp NOT NULL,

-- 	CONSTRAINT "user_pk" PRIMARY KEY ("_id") 
-- ) WITH (
--   OIDS=FALSE
-- );

-- CREATE TABLE public.rats (
-- 	"_id" serial NOT NULL,
-- 	"name" varchar NOT NULL,
-- 	"image" varchar NOT NULL,
-- 	"description" varchar NOT NULL,
-- 	"alive" varchar NOT NULL,
--   "times_sighted" timestamp NOT NULL,

-- 	CONSTRAINT "rats_pk" PRIMARY KEY ("_id")
-- ) WITH (
--   OIDS=FALSE
-- );


-- CREATE TABLE public.sighting (
-- 	"_id" serial NOT NULL,
-- 	"rats_id" bigint NOT NULL,
-- 	"users_id" bigint NOT NULL,
-- 	"location" varchar NOT NULL,
-- 	"time" timestamp NOT NULL,
-- 	"description" varchar NOT NULL,

-- 	CONSTRAINT "sighting_pk" PRIMARY KEY ("_id")
-- ) WITH (
--   OIDS=FALSE
-- );

-- ALTER TABLE sighting ADD COLUMN rat_name VARCHAR(255);
-- ALTER TABLE public.sighting ADD CONSTRAINT "sighting_fk0" FOREIGN KEY ("users_id") REFERENCES  public.users("_id") ON DELETE CASCADE;
-- ALTER TABLE public.sighting ADD CONSTRAINT "sighting_fk1" FOREIGN KEY ("rats_id") REFERENCES  public.rats("_id") ON DELETE CASCADE;

-- INSERT INTO public.users ("username", "password", "ssid", "number_sightings", "profile_picture", "favorite_rat", "created_at") 
-- VALUES 
-- ('user1', '123', '111-11-1111', 5, 'profile1.jpg', 'Rat A', NOW()),
-- ('user2', 'password2', '222-22-2222', 3, 'profile2.jpg', 'Rat B', NOW()),
-- ('user3', 'password3', '333-33-3333', 10, 'profile3.jpg', 'Rat C', NOW());

-- INSERT INTO public.rats ("name", "image", "description", "alive", "times_sighted") 
-- VALUES 
-- ('Rat A', 'ratA.jpg', 'A big brown rat with a long tail', 'yes', NOW()),
-- ('Rat B', 'ratB.jpg', 'A small black rat with short fur', 'yes', NOW()),
-- ('Rat C', 'ratC.jpg', 'A gray rat with big ears', 'no', NOW());

-- INSERT INTO public.sighting ("rats_id", "users_id", "location", "time", "description") 
-- VALUES 
-- (1, 1, 'Park A', NOW(), 'Saw the rat in the bushes'),
-- (2, 2, 'Street B', NOW(), 'The rat was running across the street'),
-- (3, 3, 'Alley C', NOW(), 'The rat was hiding behind the trash bin');

-- -- Query user sighting info
-- SELECT s.*, u.*
-- FROM public.sighting s
-- INNER JOIN public.users u ON s.users_id = u._id
-- WHERE u.ssid = '111-11-1111';

-- INSERT INTO public.users ("username", "password", "ssid", "number_sightings", "profile_picture", "favorite_rat", "created_at") 
-- VALUES 
-- ('user5', '123', '111-11-1111', 5, 'profile1.jpg', 'Rat A', NOW());