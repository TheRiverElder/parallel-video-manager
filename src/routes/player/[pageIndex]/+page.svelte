<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PlayerData, VideoState } from '$lib/ProjectDataTypes';
	import VideoView from './VideoView.svelte';

	export const ssr: boolean = false;
	export let data: PlayerData;

	let parallelVideoLimit: number = 6;
	let videoStates: VideoState[] = data.videoStates;

	function setPageIndex(index: number) {
		const searchParams = new URLSearchParams();
		searchParams.set('path', data.path);
		searchParams.set('amountPerPage', parallelVideoLimit.toString());
		const location = window.location;
		const url = location.origin + '/player/' + index + '?' + searchParams + location.hash;

		window.location.href = url;
	}

	function updateData() {

		data.videoStates.forEach(state => (state.viewed = true));

		const searchParams = new URLSearchParams();
		searchParams.set('path', data.path);
		const location = window.location;
		const url = location.origin + '/project/update' + '?' + searchParams + location.hash;

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'content-type': 'application/json' }
		});

		setPageIndex(data.pageIndex + 1);

		invalidateAll();
	}
</script>

<div class="player-view">
	<div class="header-view">
		<button on:click={updateData}>提交</button>
		<button on:click={() => window.location.reload()}>刷新</button>
		<button on:click={() => window.location.href = ("/project" + window.location.search) }>项目页面</button>
	</div>
	<div class="videos-view">
		{#each videoStates as state}
			<VideoView path={data.path} {state} />
		{/each}
	</div>
	<div class="footer-view">
		<button on:click={() => setPageIndex(data.pageIndex - 1)}>上一页</button>
		{data.pageIndex + 1} / {Math.ceil(data.videoAmount / data.amountPerPage)}页, 每页{data.amountPerPage}项，共{data.videoAmount}项
		<button on:click={() => setPageIndex(data.pageIndex + 1)}>下一页</button>
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
		margin: 1em 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		justify-items: flex-start;
		flex-wrap: wrap;
	}

	.header-view,
	.footer-view {
		text-align: center;
	}
</style>
