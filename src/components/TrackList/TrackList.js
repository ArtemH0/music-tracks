import React, { useRef, useState, useEffect } from "react";
import "./TrackList.css";
import { DEFAULT_COVER, FILES_BASE_URL, GENRES } from "../../config";

const TrackList = ({
  tracks,
  paginationMeta,
  onEdit,
  onDelete,
  onUpload,
  onRemoveFile,
  fetchTracks,
  onPageChange,
  initialLoading,
}) => {
  const audioRefs = useRef({});
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({ artist: "", genre: "", search: "" });
  const [loading, setLoading] = useState(initialLoading);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setLoading(initialLoading);
  }, [initialLoading]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setLoading(true);
    const params = {
      page: paginationMeta.page,
      limit: paginationMeta.limit,
      ...filters,
    };

    if (sortConfig.key) {
      params.sort = sortConfig.key;
      params.order = sortConfig.direction;
    }

    const timeoutId = setTimeout(() => {
      fetchTracks(params).finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      setLoading(false);
    };
  }, [
    paginationMeta.page,
    paginationMeta.limit,
    filters,
    sortConfig,
    fetchTracks,
  ]);

  const handlePlay = (trackId) => {
    if (currentPlayingId === trackId) {
      audioRefs.current[trackId].pause();
      setCurrentPlayingId(null);
    } else {
      if (currentPlayingId && audioRefs.current[currentPlayingId]) {
        audioRefs.current[currentPlayingId].pause();
      }
      setCurrentPlayingId(trackId);
      setTimeout(() => audioRefs.current[trackId].play(), 0);
    }
  };

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    onPageChange(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== paginationMeta.page) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="track-list-container">
      <h2>Track List</h2>

      <div className="search-forms">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search tracks..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </form>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Filter by artist..."
            name="artist"
            value={filters.artist}
            onChange={handleFilterChange}
          />
        </form>

        <form onSubmit={(e) => e.preventDefault()}>
          <select
            name="genre"
            value={filters.genre}
            onChange={handleFilterChange}
            className="genre-select"
          >
            <option value="">All Genres</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </form>
      </div>

      <div className="sort-controls">
        <button type="button" onClick={() => requestSort("title")}>
          Sort by Title{" "}
          {sortConfig.key === "title" &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </button>
        <button type="button" onClick={() => requestSort("artist")}>
          Sort by Artist{" "}
          {sortConfig.key === "artist" &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </button>
        <button type="button" onClick={() => requestSort("album")}>
          Sort by Album{" "}
          {sortConfig.key === "album" &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </button>
        <button type="button" onClick={() => requestSort("createdAt")}>
          Sort by Date{" "}
          {sortConfig.key === "createdAt" &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-sector spinner-sector-blue" />
            <div className="spinner-sector spinner-sector-white" />
          </div>
          <p>Loading tracks...</p>
        </div>
      )}

      {!loading && (
        <>
          <ul className="tracks-list">
            {tracks.map((track) => (
              <li key={track.id || track._id} className="track-item">
                <img
                  src={track.coverImage || DEFAULT_COVER}
                  alt="cover"
                  className="track-cover"
                />
                <div className="track-content">
                  <div className="track-info">
                    <h3>{track.title}</h3>
                    <p>
                      <strong>Artist:</strong> {track.artist}
                    </p>
                    {track.album && (
                      <p>
                        <strong>Album:</strong> {track.album}
                      </p>
                    )}
                    {track.genres?.length > 0 && (
                      <div className="track-genres">
                        <strong>Genres: </strong>
                        {track.genres.map((genre) => (
                          <span key={genre} className="genre-tag">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                    {track.genre && !track.genres && (
                      <p>
                        <strong>Genre:</strong> {track.genre}
                      </p>
                    )}

                    {track.audioFile && (
                      <audio
                        ref={(el) => {
                          audioRefs.current[track.id] = el;
                          return el;
                        }}
                        controls
                        className="audio-player"
                        onPlay={() => handlePlay(track.id)}
                      >
                        <source
                          src={`${FILES_BASE_URL}/${track.audioFile}`}
                          type="audio/mpeg"
                        />
                      </audio>
                    )}

                    <div className="audio-actions">
                      <label className="upload-button">
                        Upload Audio
                        <input
                          type="file"
                          accept=".mp3,.wav"
                          onChange={(e) => onUpload(track, e.target.files[0])}
                          hidden
                        />
                      </label>
                      {track.audioFile && (
                        <button
                          type="button"
                          className="delete-button small"
                          onClick={() => onRemoveFile(track)}
                        >
                          Remove Audio
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="track-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => onEdit(track)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => onDelete(track)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button
              type="button"
              onClick={() => handlePageChange(paginationMeta.page - 1)}
              disabled={paginationMeta.page === 1}
            >
              Previous
            </button>
            <span>
              Page {paginationMeta.page} of {paginationMeta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(paginationMeta.page + 1)}
              disabled={paginationMeta.page === paginationMeta.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TrackList;
