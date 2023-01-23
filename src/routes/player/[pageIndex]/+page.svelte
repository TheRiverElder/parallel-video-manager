<script lang="ts">
	import type { PlayerData, VideoState } from './+page.server';
	import VideoView from './VideoView.svelte';

	export let data: PlayerData;

	let parallelVideoLimit: number = 6;
	let pageIndex = 0;
	let videoStates: VideoState[] = data.videoStates;

	function setPageIndex(index: number) {
		pageIndex = index;

		const searchParams = new URLSearchParams();
		searchParams.set('path', data.path);
		searchParams.set('amountPerPage', parallelVideoLimit.toString());
		const location = window.location;
		const url = location.origin + '/player/' + pageIndex + '?' + searchParams + location.hash;

		window.location.href = url;
	}
</script>

<div class="player-view">
	<div class="videos-view">
		{#each videoStates as state}
			<VideoView
				path={ data.path }
				state={ state }
			/>
		{/each}
	</div>
	<div class="footer-view">
		<button on:click={() => setPageIndex(pageIndex - 1)}>上一页</button>
		{data.pageIndex + 1} / {Math.ceil(data.videoAmount / data.amountPerPage)}页, 每页{data.amountPerPage}项，共{data.videoAmount}项
		<button on:click={() => setPageIndex(pageIndex + 1)}>下一页</button>
	</div>
</div>

<style>
	.player-view {
		display: flex;
		flex-direction: column;
		padding: 1em;
	}

	.videos-view {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		justify-items: flex-start;
		flex-wrap: wrap;
	}

	.footer-view {
		margin-top: 1em;
		text-align: center;
	}
</style>
