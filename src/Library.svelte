<script>
	import { readFile, utils } from 'xlsx';
	import { liveQuery } from 'dexie';
	import {
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		ToolbarMenu,
		ToolbarMenuItem,
		Button,
		Modal,
		FileUploaderDropContainer,
		FileUploaderItem
	} from 'carbon-components-svelte';
	// import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	// import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import DocumentImport from 'carbon-icons-svelte/lib/DocumentImport.svelte';
	// import AddBook from './Components/AddBook.svelte';
	import Book from './Components/Book.svelte';
	import { db } from './db';

	let count = liveQuery(() => db.users.count());
	let rows = liveQuery(() => db.users.toArray());

	let showImportData = false,
		fileForImport = null,
		filteredRowIds = [];
</script>

<section class="libraryBox">
	<div>
		<Toolbar size="lg">
			<ToolbarContent>
				<ToolbarSearch
					placeholder="جستجو کتاب (نام کتاب یا نویسنده)"
					persistent
					value=""
					bind:filteredRowIds
				/>
				<!-- 
					shouldFilterRows={(row, value) => {
						return /(6|8)$/.test(row.name) && row.rule.toLowerCase().includes(value.toLowerCase());
					}} -->
				<ToolbarMenu>
					<ToolbarMenuItem
						on:click={() => {
							showImportData = true;
						}}
					>
						وارد کردن کتاب
					</ToolbarMenuItem>
					<ToolbarMenuItem>تهیه نسخه پشتیبان</ToolbarMenuItem>
				</ToolbarMenu>
				<Button
					on:click={() => {
						open = true;
					}}
					icon={Add}
				>
					افزودن کتاب
				</Button>
			</ToolbarContent>
		</Toolbar>
		<div class="books">
			{#each new Array(100) as item}
				<div class="booksItem">
					<Book
						title="اسم کتاب"
						image="./img/Cover.png"
						date="1360"
						publisher="فخیم"
						author="عبد الله موحد"
					/>
				</div>
			{/each}
		</div>
	</div>
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
	.libraryBox {
		display: flex;
		width: 100%;
		height: auto;
	}
	.books {
		display: flex;
		padding: 20px 20px 0 0;
		flex-wrap: wrap;
		width: 100%;
		height: auto;
	}
	.booksItem {
		width: 20%;
		padding-bottom: 20px;
		padding-left: 20px;
	}
	@media (max-width: 1100px) {
		.booksItem {
			width: 25%;
		}
	}
	@media (max-width: 900px) {
		.booksItem {
			width: 33.33%;
		}
	}
	@media (max-width: 600px) {
		.booksItem {
			width: 50%;
		}
	}
	@media (max-width: 400px) {
		.booksItem {
			width: 100%;
		}
	}
	:global(.bx--file-browse-btn),
	:global(.bx--file__selected-file) {
		max-width: 100% !important;
	}
</style>
