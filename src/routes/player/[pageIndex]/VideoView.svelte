<script lang="ts">
	import { Execution, type VideoState } from '$lib/ProjectDataTypes';
	import { extname, join } from 'path-browserify';

	export let path: string;
	export let state: VideoState;

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

	function setExecution(execution: Execution) {
		state.execution = execution;
		state = state;
	}
</script>

<div class="video-view">
	<div class="video-wrapper">
		<video controls muted>
			<track kind="captions" src={getVideoTrackSrc(state.name)} />
			<source src={getVideoSrc(state.name)} />
		</video>
	</div>
	<span class="name">{state.name}</span>
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
		height: 16em;
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
		width: 6em;
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
		background-color: gray;
        color: black;
	}
	button.unset:hover:not(:disabled) {
		background-color: lightgray;
	}
	button.unset:active:not(:disabled) {
		background-color: darkgray;
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
</style>
