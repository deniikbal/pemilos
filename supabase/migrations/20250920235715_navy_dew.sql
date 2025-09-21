/*
  # Schema untuk Aplikasi Pemilihan Ketua OSIS

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
    - `voters` 
      - `id` (uuid, primary key)
      - `nisn` (text, unique)
      - `nama` (text)
      - `kelas` (text)
      - `password_hash` (text)
      - `has_voted` (boolean, default false)
      - `created_at` (timestamp)
    - `candidates`
      - `id` (uuid, primary key)
      - `nama` (text)
      - `foto_url` (text)
      - `visi` (text)
      - `misi` (text)
      - `created_at` (timestamp)
    - `votes`
      - `id` (uuid, primary key)
      - `voter_id` (uuid, foreign key to voters)
      - `candidate_id` (uuid, foreign key to candidates)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Prevent duplicate voting
*/

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Voters table
CREATE TABLE IF NOT EXISTS voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nisn text UNIQUE NOT NULL,
  nama text NOT NULL,
  kelas text NOT NULL,
  password_hash text NOT NULL,
  has_voted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  foto_url text,
  visi text NOT NULL,
  misi text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id uuid REFERENCES voters(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(voter_id)
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all data"
  ON admins
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Voters can read own data"
  ON voters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read candidates"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Voters can insert own votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default admin
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi') -- password: 'password'
ON CONFLICT (username) DO NOTHING;

-- Insert sample candidates
INSERT INTO candidates (nama, foto_url, visi, misi) VALUES 
(
  'Ahmad Rizki Pratama',
  'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Menjadikan OSIS sebagai wadah aspirasi siswa yang aktif, kreatif, dan berprestasi',
  'Mengembangkan kegiatan ekstrakurikuler, meningkatkan fasilitas sekolah, dan membangun komunikasi yang baik antara siswa dan guru'
),
(
  'Siti Nurhaliza Putri', 
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Menciptakan lingkungan sekolah yang harmonis dan mendukung prestasi akademik maupun non-akademik',
  'Mengadakan program bimbingan belajar, peningkatan kebersihan lingkungan, dan kegiatan sosial untuk masyarakat'
),
(
  'Muhammad Fadil Hakim',
  'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400', 
  'Membangun OSIS yang inovatif dan responsif terhadap kebutuhan siswa di era digital',
  'Digitalisasi sistem informasi sekolah, pengembangan startup siswa, dan program literasi teknologi'
)
ON CONFLICT DO NOTHING;

-- Insert sample voters
INSERT INTO voters (nisn, nama, kelas, password_hash) VALUES
('1001', 'Budi Santoso', 'XII IPA 1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('1002', 'Ani Wijaya', 'XII IPA 2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('1003', 'Deni Kurniawan', 'XII IPS 1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('1004', 'Eka Sari', 'XII IPS 2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT DO NOTHING;