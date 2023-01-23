<script lang="ts">
    import type { PageData } from './$types';
	import PATH from 'path-browserify';

	export let data: PageData;

	let path: string = data?.path || '';

	function jumpTo(path: string) {
		const searchParams = new URLSearchParams();
		searchParams.set('path', path);
		const location = window.location;
		const url = location.origin + location.pathname + '?' + searchParams + location.hash;

		window.location.href = url;
	}

	function confirm() {
		const searchParams = new URLSearchParams();
		searchParams.set('path', path);
		const location = window.location;
		const url = location.origin + '/player/0?' + searchParams;

		window.location.href = url;
	}
</script>

<div class="manager-view">
	<div class="path-input-view">
		<input bind:value={path} />
		<button on:click={() => jumpTo(path)}>前往</button>
		<button on:click={confirm}>确定</button>
	</div>
	<div class="children-view">
		{#each data.childDirectoryPaths as childDirectoryPath}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="directory-view" on:click={() => jumpTo(PATH.join(data.path, childDirectoryPath))}>
				{childDirectoryPath}
			</div>
		{/each}
	</div>
</div>

<style>
	.manager-view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 1em;
        background-color: #efefef;
	}

	.path-input-view {
		display: flex;
		flex-direction: row;
		margin-bottom: 1em;
	}

	.path-input-view > input {
		flex: 1;
        font-size: 1em;
	}

    .path-input-view > button {
        margin-left: 1em;
        font-size: 1em;
    }

	.children-view {
		flex: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: flex-start;
        align-content: flex-start;
		border-radius: 0.2em;
		border: solid 1px #7f7f7f;
	}

	.directory-view {
		width: 8em;
		height: 6em;
		background-color: rgb(243, 255, 182);
		padding: 0.5em;
		margin: 1em;
        word-break: break-all;
        font-family: "MS Yahei", "微软雅黑", "黑体", "Consolas";
        border-radius: 0.2em;
        border: solid 1px #7f7f7f;
        cursor: pointer;
        font-size: 1em;
	}
</style>
