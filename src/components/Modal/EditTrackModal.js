import React from "react";
import BaseTrackModal from "./BaseTrackModal";

function EditTrackModal({ isOpen, onRequestClose, track, onSave }) {
	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={(updatedData) => onSave({ ...track, ...updatedData })}
			initialData={{
				title: track?.title || "",
				artist: track?.artist || "",
				album: track?.album || "",
				genres: track?.genres || [],
				coverImage: track?.coverImage || "",
			}}
			modalTitle="Edit Track"
			submitButtonText="Save Changes"
			handleOnClose={() => {}} // No reset needed on edit close
		/>
	);
}

export default EditTrackModal;