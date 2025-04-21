import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios";
import CreateTrackModal from "./components/Modal/CreateTrackModal";
import EditTrackModal from "./components/Modal/EditTrackModal";
import TrackList from "./components/TrackList/TrackList";
import "./App.css";
import {
  API_BASE_URL,
  AUDIO_FILE_TYPES,
  MAX_FILE_SIZE,
  DEFAULT_PAGINATION,
} from "./constants";

Modal.setAppElement("#root");

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editTrack, setEditTrack] = useState(null);
  const [paginationMeta, setPaginationMeta] = useState(DEFAULT_PAGINATION);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchTracks = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/tracks`, {
          params: {
            page: paginationMeta.page,
            limit: paginationMeta.limit,
            ...params,
          },
        });

        setTracks(response.data.data || []);
        setPaginationMeta({
          page: response.data.meta?.page || 1,
          limit: response.data.meta?.limit || 5,
          totalPages: response.data.meta?.totalPages || 1,
        });
        setInitialLoadComplete(true);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [paginationMeta.page, paginationMeta.limit]
  );

  useEffect(() => {
    if (!initialLoadComplete) {
      fetchTracks();
    }
  }, [fetchTracks, initialLoadComplete]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleSaveTrack = async (trackData) => {
    try {
      await axios.post(`${API_BASE_URL}/tracks`, trackData, {
        headers: { "Content-Type": "application/json" },
      });
      fetchTracks();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateTrack = async (updatedTrack) => {
    try {
      await axios.put(
        `${API_BASE_URL}/tracks/${updatedTrack.id}`,
        updatedTrack,
        { headers: { "Content-Type": "application/json" } }
      );
      fetchTracks();
      setEditTrack(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteTrack = async (track) => {
    if (!window.confirm(`Delete "${track.title}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/tracks/${track.id}`);
      fetchTracks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleUploadFile = async (track, file) => {
    if (!file) return;
    if (!AUDIO_FILE_TYPES.includes(file.type)) {
      alert("Only MP3 or WAV files are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("Max file size is 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/tracks/${track.id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchTracks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleRemoveFile = async (track) => {
    if (!window.confirm("Remove this audio file?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/tracks/${track.id}/file`);
      fetchTracks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handlePageChange = (page) => {
    setPaginationMeta((prev) => ({ ...prev, page }));
  };

  return (
    <div className="app">
      <div className="track-list-wrapper">
        <button className="blue-button" onClick={() => setModalOpen(true)}>
          Create Track
        </button>

        {error && <p className="error">Error: {error}</p>}

        <TrackList
          tracks={tracks}
          paginationMeta={paginationMeta}
          onEdit={setEditTrack}
          onDelete={handleDeleteTrack}
          onUpload={handleUploadFile}
          onRemoveFile={handleRemoveFile}
          fetchTracks={fetchTracks}
          onPageChange={handlePageChange}
          initialLoading={loading && !initialLoadComplete}
        />

        <EditTrackModal
          isOpen={!!editTrack}
          onRequestClose={() => setEditTrack(null)}
          track={editTrack}
          onSave={handleUpdateTrack}
        />

        <CreateTrackModal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          onSave={handleSaveTrack}
        />
      </div>
    </div>
  );
}

export default App;
