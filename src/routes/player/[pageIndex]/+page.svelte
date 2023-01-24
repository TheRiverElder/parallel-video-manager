<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PlayerData } from '$lib/ProjectDataTypes';
	import { SimpleEventDispatcher } from '$lib/utils/SimpleEvent';
	import { onDestroy, setContext } from 'svelte';
	import { CONTEXT_NAME_EVENT_DISPATCHER, EVENT_NAME_ALL_MUTE, EVENT_NAME_ALL_PLAY, EVENT_NAME_ALL_SET_NOT_VIEWED, EVENT_NAME_ALL_STOP, EVENT_NAME_ALL_UNMUTE } from './Events';
	import VideoView from './VideoView.svelte';

	export let data: PlayerData;

	const simpleEventDispatcher = new SimpleEventDispatcher<string>();
	
	setContext(CONTEXT_NAME_EVENT_DISPATCHER, simpleEventDispatcher);

	function getClickListener(eventName: string) {
		return () => simpleEventDispatcher.dispatch(eventName);
	}

	onDestroy(() => simpleEventDispatcher.unregisterAll());

	function setPageIndex(index: number) {
		const searchParams = new URLSearchParams();
		searchParams.set('path', data.path);
		searchParams.set('amountPerPage', "6");
		const location = window.location;
		const url = location.origin + '/player/' + index + '?' + searchParams + location.hash;

		window.location.href = url;
	}

	function updateData() {

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
		<button on:click={getClickListener(EVENT_NAME_ALL_PLAY)}>全部播放</button>
		<button on:click={getClickListener(EVENT_NAME_ALL_STOP)}>全部暂停</button>
		<button on:click={getClickListener(EVENT_NAME_ALL_MUTE)}>全部静音</button>
		<button on:click={getClickListener(EVENT_NAME_ALL_UNMUTE)}>全部解除静音</button>
		<button on:click={getClickListener(EVENT_NAME_ALL_SET_NOT_VIEWED)}>全部标为未看</button>
		<button on:click={updateData}>提交</button>
		<button on:click={() => window.location.reload()}>刷新</button>
		<button on:click={() => window.location.href = ("/project" + window.location.search) }>项目页面</button>
	</div>
	<div class="videos-view">
		{#each data.videoStates as state}
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
