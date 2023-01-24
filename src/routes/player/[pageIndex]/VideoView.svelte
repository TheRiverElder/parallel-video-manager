<script lang="ts">
	import { Execution, type VideoState } from '$lib/ProjectDataTypes';
	import type { SimpleEventDispatcher } from '$lib/utils/SimpleEvent';
	import { getExecutionName } from '$lib/utils/Strings';
	import { extname, join } from 'path-browserify';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { CONTEXT_NAME_EVENT_DISPATCHER, EVENT_NAME_ALL_MUTE, EVENT_NAME_ALL_PLAY, EVENT_NAME_ALL_SET_NOT_VIEWED, EVENT_NAME_ALL_STOP, EVENT_NAME_ALL_UNMUTE } from './Events';

	export let path: string;
	export let state: VideoState;

	let muted: boolean = true;
	let video: HTMLVideoElement;

	const simpleEventDispatcher: SimpleEventDispatcher<string> = getContext(CONTEXT_NAME_EVENT_DISPATCHER);

	const simpleEventListener = (eventName: string) => {
		switch (eventName) {
			case EVENT_NAME_ALL_PLAY: {
				video?.play();
				break;
			}
			case EVENT_NAME_ALL_STOP: {
				video?.pause();
				break;
			}
			case EVENT_NAME_ALL_MUTE: {
				muted = true;
				break;
			}
			case EVENT_NAME_ALL_UNMUTE: {
				muted = false;
				break;
			}
			case EVENT_NAME_ALL_SET_NOT_VIEWED: {
				setNotViewed();
				break;
			}
		}
	};
		
	onMount(() => simpleEventDispatcher.register(simpleEventListener));
	onDestroy(() => simpleEventDispatcher.unregister(simpleEventListener));


	let resourceUrlPattern = 'http://localhost:8888/?';

	function getVideoSrc(name: string) {
		const searchParams = new URLSearchParams();
		searchParams.set('path', join(path, name));
		return resourceUrlPattern + searchParams;
	}

	function getVideoTrackSrc(name: string) {
		const extensionName = extname(name);
		if (extensionName) {
			name = name.replace(new RegExp('\\' + extensionName + '^'), '.srt');
		}
		const searchParams = new URLSearchParams();
		searchParams.set('path', join(path, name));
		return resourceUrlPattern + searchParams;
	}

	function setNotViewed() {
		state.viewed = false;
		state = state;
	}

	function setExecution(execution: Execution) {
		state.execution = execution;
		state = state;
	}

	function onVideoDisplay() {
		state.viewed = true;
		state = state;
	}
</script>

<div class="video-view">
	<div class="video-wrapper">
		<video bind:this={video} controls muted={ muted } on:play={onVideoDisplay}>
			<track kind="captions" src={getVideoTrackSrc(state.name)} />
			<source src={getVideoSrc(state.name)} />
		</video>
	</div>
	<span class="name">{state.name}</span>
	<span class="state">
		<span>{ state.viewed ? "已观看" : "未观看" }</span>
		<span>{ getExecutionName(state.execution) }</span>
		<span>{ state.executed ? "已执行" : "未执行" }</span>
	</span>
	<span class="actions">
		<button
			class="preserve"
			disabled={state.execution === Execution.PRESERVE}
			on:click={() => setExecution(Execution.PRESERVE)}>保留</button
		>
		<button
			class="unset"
			disabled={state.execution === Execution.UNSET}
			on:click={() => setExecution(Execution.UNSET)}>重置</button
		>
		<button
			class="delete"
			disabled={state.execution === Execution.DELETE}
			on:click={() => setExecution(Execution.DELETE)}>删除</button
		>
		<button
			class="set-not-viewed"
			disabled={!state.viewed}
			on:click={setNotViewed}>标为未看</button
		>
	</span>
</div>

<style>
	.video-view {
		width: 24em;
		margin: 1em;
		display: flex;
		flex-direction: column;
	}

	.video-view > .name {
		width: 100%;
		word-break: break-all;
	}

	.video-view > .video-wrapper {
		width: 24em;
		height: 13.5em;
	}

	.video-view > .video-wrapper > video {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center center;
	}

	.actions {
		text-align: center;
	}

	.actions > button {
		width: 20%;
		color: white;
		font-size: 1em;
		cursor: pointer;
		outline: none;
		border: none;
		border-radius: 0.2em;
	}

	.actions > button:disabled {
		background-color: grey;
		cursor: not-allowed;
		color: white;
	}

	button.preserve:not(:disabled) {
		background-color: green;
	}
	button.preserve:hover:not(:disabled) {
		background-color: lightgreen;
	}
	button.preserve:active:not(:disabled) {
		background-color: darkgreen;
	}

	button.unset:not(:disabled) {
		background-color: darkorange;
	}
	button.unset:hover:not(:disabled) {
		background-color: orange;
	}
	button.unset:active:not(:disabled) {
		background-color: orangered;
	}

	button.delete:not(:disabled) {
		background-color: red;
	}
	button.delete:hover:not(:disabled) {
		background-color: pink;
	}
	button.delete:active:not(:disabled) {
		background-color: darkred;
	}

	button.set-not-viewed:not(:disabled) {
		background-color: blue;
	}
	button.set-not-viewed:hover:not(:disabled) {
		background-color: lightblue;
	}
	button.set-not-viewed:active:not(:disabled) {
		background-color: darkblue;
	}
</style>
