import React from "react";

const AudioPlayer = ({ audioUrl }) => {
	if (!audioUrl) return null;

	return (
		<div className="audio-player">
			<audio controls>
				<source src={audioUrl} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		</div>
	);
};

export default AudioPlayer;
