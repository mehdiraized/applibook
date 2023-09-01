<script>
	// import { onMount } from 'svelte';
	import { readFile, utils } from 'xlsx';
	import { liveQuery } from 'dexie';
	import {
		Grid,
		Row,
		Column,
		Tile,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		ToolbarMenu,
		ToolbarMenuItem,
		PaginationNav,
		Button,
		Modal,
		FileUploaderDropContainer,
		FileUploaderItem,
		OverflowMenu,
		OverflowMenuItem
	} from 'carbon-components-svelte';
	import Launch from 'carbon-icons-svelte/lib/Launch.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import Switcher from 'carbon-icons-svelte/lib/Switcher.svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Printer from 'carbon-icons-svelte/lib/Printer.svelte';
	import DocumentImport from 'carbon-icons-svelte/lib/DocumentImport.svelte';
	import AddUser from './Components/AddBook.svelte';
	import Developer from './Components/Developer.svelte';
	import { db } from './db';

	let num = 1;
	const countNum = () => {
		return num++;
	};

	// let rows = Array.from({ length: 20 }).map((_, i) => ({
	// 	num: i + 1,
	// 	id: `1155645122${i}`,
	// 	name: 'مهدی',
	// 	family: `رضایی ${i + 1}`,
	// 	unit: 'عقیدتی سیاسی',
	// 	rank: 'گروهبان دو',
	// 	phone: '09120336636',
	// 	description: 'سرباز خوبی هست'
	// }));
	let count = liveQuery(() => db.users.count());
	let rows = liveQuery(() => db.users.toArray());

	// $: rows = [];
	// onMount(() => {
	// 	// $rows2 = liveQuery(() => db.users.toArray());
	// 	$rows2 = db.users.toArray();
	// });
	// let filteredRowIds = $rows;

	let open = false,
		openUser = false,
		openDelete = false,
		dataUser = false,
		dataUpdate = false,
		dataDelete = false,
		pageSize = 10,
		page = 0,
		showImportData = false,
		childrenData = [],
		fileForImport = null,
		filteredRowIds = [];

	// $: console.log('filteredRowIds', filteredRowIds);
</script>

<section class="peopleBox">
	{#if $rows}
		<DataTable
			style="width:100%"
			headers={[
				{ key: 'num', value: 'ردیف', width: '45px' },
				{ key: 'name', value: 'نام' },
				{ key: 'family', value: 'نام خانوادگی' },
				{ key: 'book', value: 'کتاب' },
				{ key: 'startDate', value: 'تاریخ دریافت' },
				{ key: 'arriveDate', value: 'تاریخ تحویل' },
				{ key: 'nationalCode', value: 'کد ملی' },
				{ key: 'unit', value: 'محل خدمت' },
				{ key: 'rank', value: 'درجه' },
				{ key: 'phone', value: 'تلفن همراه' },
				{ key: 'action', value: '', width: '206px', padding: '0' }
			]}
			rows={$rows}
			{pageSize}
			page={page + 1}
		>
			<svelte:fragment slot="cell" let:cell let:row>
				{#if cell.key === 'action'}
					<Button
						style="margin: 3px 0;"
						iconDescription="مشاهده"
						icon={Launch}
						on:click={async () => {
							dataUser = row;
							openUser = true;
							if (row.children.length > 0) {
								for await (const childrenID of row.children) {
									const child = await db.children.get({
										id: childrenID
									});
									childrenData = [...childrenData, child];
								}
							}
						}}
					/>
					<Button
						style="margin: 3px 0;"
						iconDescription="ویرایش"
						kind="secondary"
						icon={Edit}
						on:click={async () => {
							dataUpdate = row;
							open = true;
						}}
					/>
					<Button
						style="margin: 3px 0;"
						iconDescription="چاپ"
						kind="tertiary"
						icon={Printer}
						on:click={() => {
							dataUser = row;
							openUser = true;
							window.print();
						}}
					/>
					<Button
						style="margin: 3px 0;"
						kind="danger-tertiary"
						iconDescription="حذف"
						icon={TrashCan}
						on:click={() => {
							dataDelete = row;
							openDelete = true;
						}}
					/>
				{:else if cell.key === 'num'}
					{countNum()}
				{:else}
					{cell.value}
				{/if}
			</svelte:fragment>
			<Toolbar size="lg">
				<ToolbarContent>
					<ToolbarSearch
						placeholder="جستجو (نام کتاب گیرنده)"
						persistent
						value=""
						bind:filteredRowIds
					/>
					<ToolbarMenu>
						<ToolbarMenuItem
							on:click={() => {
								showImportData = true;
							}}
						>
							وارد کردن اطلاعات
						</ToolbarMenuItem>
						<ToolbarMenuItem>تهیه نسخه پشتیبان</ToolbarMenuItem>
					</ToolbarMenu>
					<Button
						on:click={() => {
							dataUpdate = false;
							open = true;
						}}
						icon={Add}
					>
						کتاب گیرنده جدید
					</Button>
				</ToolbarContent>
			</Toolbar>
		</DataTable>
		<div style="direction:ltr; display: flex; justify-content: center;">
			<PaginationNav
				total={$count / pageSize}
				bind:page
				forwardText="صفحه بعد"
				backwardText="صفحه قبل"
			/>
		</div>
		{#if open}
			<AddUser bind:open initial={dataUpdate} />
		{/if}
		<Modal
			danger
			bind:open={openDelete}
			modalHeading="آیا مایلید این کتاب را حذف کنید ؟"
			primaryButtonText="حذف"
			primaryButtonIcon={TrashCan}
			secondaryButtonText="بستن"
			on:click:button--secondary={() => (openDelete = false)}
			on:open
			on:close
			on:submit={() => {
				db.users.delete(dataDelete.id);
				openDelete = false;
			}}
			size="xs"
		>
			<p>با حذف {dataDelete.name} {dataDelete.family} اطلاعات این کتاب قابل بازگشت نیست.</p>
		</Modal>
	{/if}
	<Modal
		bind:open={showImportData}
		modalHeading="وارد کردن اطلاعات"
		primaryButtonText="وارد کن"
		primaryButtonIcon={DocumentImport}
		secondaryButtonText="بستن"
		on:click:button--secondary={() => (showImportData = false)}
		on:open
		on:close
		on:submit={async () => {
			const file = await fileForImport.arrayBuffer();
			const wb = readFile(file);
			let data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
			for await (let item of data) {
				const addData = { ...item, wife: item.wife === '*' ? true : false };
				try {
					await db.users.add(addData);
				} catch (error) {
					console.error(error);
				}
			}
		}}
		size="xs"
	>
		{#if !fileForImport}
			<FileUploaderDropContainer
				labelText="فایل را داخل این جعبه بکشید یا اینجا کلیک کنید"
				accept={['.xlsx', '.xls', '.XLS', '.XLSX']}
				on:add={async (file) => {
					fileForImport = file.detail[0];
				}}
			/>
		{:else}
			<FileUploaderItem
				name={fileForImport.name}
				status="edit"
				on:delete={() => {
					fileForImport = null;
				}}
			/>
		{/if}
	</Modal>
</section>

<style>
	.peopleBox {
		display: flex;
		width: 100%;
		height: auto;
		flex-direction: column;
		margin-top: -2px;
		/* background-color: var(--cds-layer, #fff); */
	}
	:global(.bx--file-browse-btn),
	:global(.bx--file__selected-file) {
		max-width: 100% !important;
	}
</style>
