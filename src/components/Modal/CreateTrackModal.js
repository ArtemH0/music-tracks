import React from "react";
import BaseTrackModal from "./BaseTrackModal.js";

function CreateTrackModal({ isOpen, onRequestClose, onSave }) {
	const validateForm = ({ title, artist, coverLink }) => {
		const newErrors = {};
		if (!title.trim()) newErrors.title = "Title is required";
		if (!artist.trim()) newErrors.artist = "Artist is required";
		if (coverLink && !/^https?:\/\/.+/i.test(coverLink)) {
			newErrors.cover = "Invalid image URL";
		}
		return newErrors;
	};

	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={onSave}
			modalTitle="Create New Track"
			submitButtonText="Save Track"
			validateForm={validateForm}
		/>
	);
}

export default CreateTrackModal;
