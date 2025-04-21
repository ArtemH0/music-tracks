export const API_BASE_URL = "http://localhost:8000/api";
export const FILES_BASE_URL = `${API_BASE_URL}/files`;

export const DEFAULT_COVER =
  "https://blog.pearlacademy.com/wp-content/uploads/2022/06/erik-mclean-9y1cTVKe1IY-unsplash-1080x675.jpg";
export const DEFAULT_COVER_PLACEHOLDER =
  "https://cdn.pixabay.com/photo/2016/12/18/13/45/download-1915753_1280.png";

export const GENRES = [
  "Rock",
  "Pop",
  "Hip Hop",
  "Jazz",
  "Classical",
  "Electronic",
  "R&B",
  "Country",
  "Folk",
  "Reggae",
  "Metal",
  "Blues",
  "Indie",
];

export const AUDIO_FILE_TYPES = ["audio/mpeg", "audio/wav"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; 
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 5,
  totalPages: 1,
};
