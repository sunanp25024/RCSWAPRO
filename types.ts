export enum Page {
  LANDING = 'LANDING',
  FORM = 'FORM',
  RESULT = 'RESULT',
}

export enum Status {
  ON_PROSES = 'On Proses',
  PENDING = 'Pending',
  CANCLE = 'Cancle',
}

export interface FormData {
  namaLengkap: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan' | '';
  ttl: string;
  nomorKTP: string;
  alamatKTP: string;
  alamatDomisili: string;
  nomorHP: string;
  agama: string;
  namaIbu: string;
  ttlIbu: string;
  pengalamanKerja: string;
  masaKerja: string;
  namaAtasan: string;
  nomorAtasan: string;
  alasanResign: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  email: string;
  golonganDarah: string;
}

export interface Submission extends FormData {
  id: string;
  submissionDate: string;
  status: Status;
}

// Tipe data baru untuk Status Refcek
export enum RefcekProgress {
  BELUM_DIPROSES = 'Belum Diproses',
  PROSES_CHECKER_1 = 'Proses Checker 1',
  PROSES_CHECKER_2 = 'Proses Checker 2',
  PROSES_CHECKER_3 = 'Proses Checker 3',
  SELESAI = 'Selesai',
  KENDALA = 'Kendala',
}

export enum KandidatStatus {
  REKOMENDASI = 'Rekomendasi',
  TIDAK_REKOMENDASI = 'Tidak Rekomendasi',
  PERTIMBANGAN_USER = 'Pertimbangan User',
  BLACKLIST = 'Blacklist',
}

export interface RefcekData {
  id: string;
  tanggalEmailRequest: string;
  jamEmailRequestMasuk: string;
  checker1: string;
  tanggalDikirim: string;
  jamHasilDikirim: string;
  progressReffcheck: RefcekProgress;
  checker2: string;
  checker3: string;
  statusKandidat: KandidatStatus;
  perusahaan: string;
  cabang: string;
  posisiPekerjaan: string;
  namaLengkap: string;
  nomorTlpAtauWA: string;
  kendalaUpdate: string;
  kendalaReport: string;
  keterangan: string;
  buArea: string;
}

// Tipe data baru untuk Laporan
export interface LaporanData {
  id: string;
  tanggalRequest: string;
  perusahaan: string;
  cabang: string;
  posisiPekerjaan: string;
  statusKandidat: string;
  tanggaTerbit: string;
  sumberKandidat: string;
  namaLengkap: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan' | '';
  tempatTglLahir: string;
  nomorKTP: string;
  alamatDomisili: string;
  alamatKTP: string;
  noHpWa: string;
  agama: string;
  namaIbuKandung: string;
  tempatTglLahirIbuKandung: string;
  bidangUsaha: string;
  pengalamanPekerjaan: string;
  masaKerjaKandidat: string;
  referensi: string;
  nomorTeleponReferensi: string;
  alasanResign: string;
  akunSosialMedia: string;
  email: string;
  golDarah: string;
  masalahKehadiran: string;
  relasiDenganAtasan: string;
  terkaitIntegritas: string;
  performance: string;
  penjelasanResign: string;
  hasilRekomendasi: string;
  justifikasi: string;
  keterangan: string;
}

// Tipe data baru untuk WOM
export interface WomData {
  id: string;
  tanggalReffCheck: string;
  // Data Diri
  namaPelamar: string;
  cabang: string;
  lokasiKerja: string;
  bu: string;
  source: string;
  jenisKelamin: 'L' | 'P' | '';
  tempatLahir: string;
  tanggalLahir: string;
  nomorKtp: string;
  agama: string;
  alamatKtp: string;
  noTelp: string;
  namaIbuKandung: string;
  tempatLahirIbu: string;
  tanggalLahirIbu: string;
  // Data Reference Check
  statusKandidat: string;
  posisiDilamar: string;
  pengalaman: string;
  namaPerusahaan: string;
  bidangUsaha: string;
  pemberiReferensi: string;
  nomorTeleponReferensi: string;
  jabatanReferensi: string;
  jabatanTerakhirKandidat: string;
  masaKerjaKandidat: string;
  masalahKehadiran: string;
  tidakMasukTanpaIzin: string;
  masalahKesehatan: string;
  relasiDengan: string;
  terkaitIntegritas: string;
  performance: string;
  alasanResign: string;
  penjelasanResign: string;
  // Akun Sosial Media
  facebook: string;
  instagram: string;
  twitter: string;
  akunMediaSosialLainnya: string;
  // Lain-lain
  kelebihanKandidat: string;
  kekuranganKandidat: string;
  email: string;
  golonganDarah: string;
  rekomendasi: string;
  justifikasi: string;
}

// Tipe data baru untuk formulir "Reference Check" WOM JATENG
export interface WomJatengRefcekData {
  id: string;
  createdAt: string;
  // Header
  namaKandidat: string;
  posisiDilamar: string;
  cabangKapos: string;
  // A. Status Kandidat
  statusKandidat: string; // 'New Hire Eksternal' | 'WOM to Outsourcing'
  // B. Pengalaman
  pengalaman: string[]; // 'Pengalaman Kerja', 'Fresh graduated, pengalaman freelance', etc.
  // C. Nama Perusahaan
  namaPerusahaan: string;
  // D. Pemberi Referensi
  pemberiReferensiNama: string;
  pemberiReferensiJabatan: string;
  pemberiReferensiTelp: string;
  // E. Masa Kerja Kandidat
  masaKerjaTahun: string;
  masaKerjaBulan: string;
  // F. Masalah Kehadiran
  masalahKehadiran: string; // 'Tepat Waktu' | 'Kadang Terlambat' | 'Sering Terlambat'
  tidakMasukIzin: string;
  // G. Masalah Kesehatan
  masalahKesehatan: string; // 'Pernah Sakit Berkepanjangan' | 'Tidak Pernah Sakit yang Berkepanjangan'
  masalahKesehatanDetail: string;
  // H. Relasi dengan
  relasiAtasan: string; // 'Baik' | 'Tidak Baik'
  relasiAtasanDetail: string;
  relasiRekan: string; // 'Baik' | 'Tidak Baik'
  relasiRekanDetail: string;
  relasiBawahan: string; // 'Baik' | 'Tidak Baik'
  relasiBawahanDetail: string;
  // I. Terkait Integritas
  integritas: string; // 'Tidak ada masalah Fraud' | 'Terindikasi Fraud' | 'Pelaku Fraud'
  integritasDetail: string;
  // J. Performance
  performance: string; // 'Exceed Target' | 'On Target' | 'Not Achieve Target'
  // K. Alasan Resign
  alasanResignI: string; // 'Mengundurkan Diri Baik-Baik' | 'Mengundurkan Diri Tidak Baik-Baik'
  alasanResignII: string[]; // 'Tidak Perpanjang Kontrak', 'PHK', etc.
  alasanResignIII: string; // Lainnya
  alasanResignIVPenjelasan: string;
  // L. Akun media sosial
  akunMedsosAlamat: string;
  akunMedsosStatus: string[]; // 'Baik - Akun tidak mengandung hal negatif', 'Konten Provokatif', etc.
  akunMedsosLainnya: string;
  // M. Rekomendasi
  rekomendasi: string; // 'Direkomendasikan' | 'Tidak Rekomendasi'
  // Footer
  justifikasi: string;
  email: string;
}