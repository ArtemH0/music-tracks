// TODOo: rename file to config.js
export const API_BASE_URL = process.env.REACT_APP_BASE_URL;
export const FILES_BASE_URL = `${API_BASE_URL}/files`;
export const DEFAULT_COVER = process.env.REACT_APP_DEFAULT_COVER;
export const DEFAULT_COVER_PLACEHOLDER = process.env.REACT_APP_DEFAULT_COVER_PLACEHOLDER;

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
