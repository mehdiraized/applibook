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
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import DocumentImport from 'carbon-icons-svelte/lib/DocumentImport.svelte';
	import AddBook from './Components/AddBook.svelte';
	import Book from './Components/Book.svelte';
	import { db } from './db';

	let count = liveQuery(() => db.books.count());
	let rows = liveQuery(() => db.books.toArray());

	let showImportData = false,
		showAddBook = true,
		bookUpdate = null,
		fileForImport = null,
		filteredRowIds = [];
</script>

<section class="libraryBox">
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
					showAddBook = true;
				}}
				icon={Add}
			>
				افزودن کتاب
			</Button>
		</ToolbarContent>
	</Toolbar>
	{#if $rows && $rows.length > 0}
		<div class="books">
			{#each $rows as item}
				<div class="booksItem">
					<Book
						name={item.name}
						image={item.image}
						year={item.year}
						publisher={item.publishers}
						author={item.author}
					/>
				</div>
			{/each}
		</div>
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
	{#if showAddBook}
		<AddBook bind:open={showAddBook} initial={bookUpdate} />
	{/if}
</section>

<style>
	.libraryBox {
		display: flex;
		width: 100%;
		height: auto;
		flex-direction: column;
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
