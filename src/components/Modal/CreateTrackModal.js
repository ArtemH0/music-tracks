import React, { useState } from "react";
import Modal from "react-modal";
import "./CreateTrackModal.css";
import { GENRES, DEFAULT_COVER_PLACEHOLDER } from "../../constants";

const isValidImageUrl = (url) => /^https?:\/\/.+/i.test(url);

function CreateTrackModal({ isOpen, onRequestClose, onSave }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [coverLink, setCoverLink] = useState("");
  const [errors, setErrors] = useState({});

  const addGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre]);
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!artist.trim()) newErrors.artist = "Artist is required";
    if (coverLink && !isValidImageUrl(coverLink)) {
      newErrors.cover = "Invalid image URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const trackData = {
      title,
      artist,
      album: album.trim(),
      genres,
      coverImage: isValidImageUrl(coverLink) ? coverLink : "",
    };

    onSave(trackData);
    resetForm();
    onRequestClose();
  };

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setAlbum("");
    setGenres([]);
    setNewGenre("");
    setCoverLink("");
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        resetForm();
        onRequestClose();
      }}
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-body">
        <h2>Create New Track</h2>

        <div className="form-group">
          <label>Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? "error-input" : ""}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label>Artist *</label>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className={errors.artist ? "error-input" : ""}
          />
          {errors.artist && (
            <span className="error-message">{errors.artist}</span>
          )}
        </div>

        <div className="form-group">
          <label>Album</label>
          <input value={album} onChange={(e) => setAlbum(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Genres</label>
          <div className="genre-tags-container">
            {genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
                <button
                  type="button"
                  className="remove-genre-btn"
                  onClick={() => removeGenre(genre)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="genre-selector">
            <select
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              className="genre-dropdown"
            >
              <option value="">Select a genre</option>
              {GENRES.filter((genre) => !genres.includes(genre)).map(
                (genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                )
              )}
            </select>
            <button
              type="button"
              className="add-genre-btn"
              onClick={addGenre}
              disabled={!newGenre}
            >
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Cover Image URL</label>
          <input
            value={coverLink}
            onChange={(e) => setCoverLink(e.target.value)}
            className={errors.cover ? "error-input" : ""}
          />
          {errors.cover && (
            <span className="error-message">{errors.cover}</span>
          )}
        </div>

        <div className="cover-preview">
          <img
            src={
              isValidImageUrl(coverLink) ? coverLink : DEFAULT_COVER_PLACEHOLDER
            }
            alt="Cover preview"
            onError={(e) => {
              e.target.src = DEFAULT_COVER_PLACEHOLDER;
            }}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              resetForm();
              onRequestClose();
            }}
          >
            Cancel
          </button>
          <button type="button" className="save-btn" onClick={handleSubmit}>
            Save Track
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateTrackModal;
