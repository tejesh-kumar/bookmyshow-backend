export interface Movie {
  movieId: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  images: string[];
  videos: string[];
  duration: string;
  genres: string[];
  languages: string[];
  releaseDate: Date;
  filmCertificate: string[];
  cast: string[];
  crew: string[];
  createdAt: Date;
  updatedAt: Date;
}
