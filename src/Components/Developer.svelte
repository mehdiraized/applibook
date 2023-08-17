<script>
	import { Modal } from 'carbon-components-svelte';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';

	export let open = true;
</script>

<Modal
	bind:open
	size="xs"
	modalHeading="درباره سازنده"
	primaryButtonText="بستن"
	primaryButtonIcon={Checkmark}
	on:open
	on:close
	on:submit={() => (open = false)}
>
	<div class="showUserHeader">گ۲.و مهدی رضایی</div>
	<ul class="showUserList">
		<li>راه های ارتباطی</li>
		<li>تلفن همراه : <b>۰۹۱۲۰۳۳۶۶۳۶</b></li>
		<li>ایمیل : <b>me@mehd.ir</b></li>
	</ul>
</Modal>

<style>
	.showUserHeader {
		font-size: 26px;
		text-align: center;
		margin-bottom: 30px;
	}
	.showUserList {
		line-height: 40px;
		font-size: 20px;
		columns: 1;
	}
	.showUserList b {
		font-weight: bold;
	}
</style>
