CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF');
CREATE TYPE training_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE lesson_type AS ENUM ('VIDEO', 'TEXT', 'QUIZ');
CREATE TYPE staff_category AS ENUM ('FOH','BOH','MANAGER');
CREATE TYPE lesson_level AS ENUM ('BEGINNER','INTERMEDIATE','EXPERT');
CREATE TYPE progress_entity_type AS ENUM ('MODULE','SECTION','LESSON');

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  language TEXT,
  profile_picture_url TEXT,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Branches Table
CREATE TABLE branches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Staff Table
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  nationality TEXT,
  phone_number TEXT,
  staff_category staff_category NOT NULL,
  language TEXT,
  profile_picture_url TEXT,
  first_login BOOLEAN DEFAULT TRUE,
  branch_id INT REFERENCES branches(id) ON DELETE SET NULL
);


-- Modules
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slogan TEXT,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  updated_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- Sections
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  level lesson_level DEFAULT 'BEGINNER',
  description TEXT,
  module_id INT REFERENCES modules(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  updated_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- Lessons
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration INT,
  type lesson_type DEFAULT 'VIDEO',
  video_url TEXT,
  document_url TEXT,
  text TEXT,
  section_id INT REFERENCES sections(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  updated_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- Bookmarks
CREATE TABLE bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  entity_id INT NOT NULL,
  entity_type progress_entity_type NOT NULL,
  percentage NUMERIC DEFAULT 0,
  status training_status DEFAULT 'IN_PROGRESS'
);
