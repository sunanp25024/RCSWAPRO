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