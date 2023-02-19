<script lang="ts">
	const searchParams = new URLSearchParams(window.location.search);

	const videoPath = searchParams.get('videoPath') || '';
	const audioPath = searchParams.get('audioPath') || '';

	let videoPlayer: HTMLVideoElement;
	let audioPlayer: HTMLAudioElement;

	function playFrom(time: number) {}

    let currentTime: number = 0;

	function onVideoPlay() {
		if (audioPlayer && videoPlayer) {
			// audioPlayer.currentTime = videoPlayer.currentTime;
			audioPlayer.play();
		}
	}

    function onVideoPause() {
        if (audioPlayer) {
            audioPlayer.pause();
        }
    }

    function onTimeUpdate() {
        currentTime = videoPlayer?.currentTime || currentTime;
    }
</script>

<div>
	<video 
        class="video" 
        controls 
        bind:this={videoPlayer} 
        currentTime={currentTime} 
        on:play={onVideoPlay} 
        on:pause={onVideoPause} 
        on:timeupdate={onTimeUpdate}
    >
		<source src={videoPath} />
	</video>

	<audio 
        class="audio" 
        controls 
        bind:this={audioPlayer} 
        currentTime={currentTime}
    >
		<source src={audioPath} />
	</audio>
</div>

<style>
	video.video {
	}

	audio.audio {
		/* display: none; */
	}
</style>
