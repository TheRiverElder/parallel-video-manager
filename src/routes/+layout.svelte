<main>
	<nav>
		<a href="/manager">选择项目目录</a>
	</nav>

	<slot />
</main>

<style>
	main {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
	}

    nav {
        padding: 0.5em;
        margin-bottom: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    main > *:nth-child(2) {
        flex: 1;
    }
</style>
