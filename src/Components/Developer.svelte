<script>
	import { Modal } from 'carbon-components-svelte';

	export let open = true;
</script>

<Modal bind:open size="xs" modalHeading="مهدی رضایی" passiveModal>
	<ul class="showUserList">
		<li>راه های ارتباطی</li>
		<li>تلفن همراه : <b>۰۹۱۲۰۳۳۶۶۳۶</b></li>
		<li>ایمیل : <b>me@mehd.ir</b></li>
	</ul>
</Modal>

<style>
	.showUserList {
		line-height: 40px;
		font-size: 14px;
		columns: 1;
	}
	.showUserList b {
		font-weight: bold;
	}
</style>
