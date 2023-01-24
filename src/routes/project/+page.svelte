<script lang="ts">
	import type { ProjectData } from '$lib/ProjectDataTypes';
	import { getExecutionName } from '$lib/utils/Strings';

	export let data: ProjectData;

	function executeData() {
		const location = window.location;
		const url = location.origin + '/project/execute' + location.search + location.hash;

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'content-type': 'application/json' }
		}).then((response) => {
			response.json().then((result) => console.log(result));
			window.location.reload();
		});
	}

	function resetData() {
		const location = window.location;
		const url = location.origin + '/project/reset' + location.search + location.hash;

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'content-type': 'application/json' }
		}).then(() => window.location.reload());
	}
</script>

<main>
	<div class="header-view">
		<span>共{ data.videoStates.length }项</span>
		<button on:click={() => (window.location.href = '/player/0' + location.search)}>播放器页面</button>
		<button on:click={executeData}>执行</button>
		<button on:click={resetData}>重置</button>
	</div>
	<div class="table-head">
		<span>文件名</span>
		<span>是否观看</span>
		<span>操作</span>
		<span>执行情况</span>
	</div>
	<div class="table-body">
		{#each data.videoStates as { name, viewed, execution, executed }}
			<div class="table-row">
				<span>{name}</span>
				<span>{viewed ? '已观看' : '未观看'}</span>
				<span>{getExecutionName(execution)}</span>
				<span>{executed ? "已执行" : "未执行"}</span>
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.header-view,
	.table-head,
	.table-body > .table-row {
		display: flex;
		flex-direction: row;
	}

	.table-head > * {
		font-weight: bold;
	}

	.table-head > *:nth-child(1),
	.table-body > .table-row > *:nth-child(1) {
		flex: 6;
		text-overflow: ellipsis;
		text-align: start;
	}
	.table-head > *:nth-child(2),
	.table-body > .table-row > *:nth-child(2),
	.table-head > *:nth-child(3),
	.table-body > .table-row > *:nth-child(3),
	.table-head > *:nth-child(4),
	.table-body > .table-row > *:nth-child(4) {
		flex: 2;
		text-align: center;
	}

	.table-body {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}
</style>
