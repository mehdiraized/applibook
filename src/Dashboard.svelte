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
		FileUploaderItem
	} from 'carbon-components-svelte';
	import Launch from 'carbon-icons-svelte/lib/Launch.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Printer from 'carbon-icons-svelte/lib/Printer.svelte';
	import DocumentImport from 'carbon-icons-svelte/lib/DocumentImport.svelte';
	import AddUser from './Components/Add.svelte';
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
		openDeveloper = false,
		openUser = false,
		openDelete = false,
		dataUser = false,
		dataUpdate = false,
		dataDelete = false,
		pageSize = 10,
		page = 0,
		showImportData = false,
		childrenData = [],
		fileForImport = null;

	// $: console.log('filteredRowIds', filteredRowIds);
</script>

<section class="dashboard">
	<div>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch placeholder="جستجو کتاب : نام کتاب یا نویسنده" />
				<ToolbarMenu>
					<ToolbarMenuItem primaryFocus>نسخه پشتیبان</ToolbarMenuItem>
					<ToolbarMenuItem
						on:click={() => {
							showImportData = true;
						}}
					>
						وارد کردن کتاب
					</ToolbarMenuItem>
					<ToolbarMenuItem
						on:click={() => {
							openDeveloper = true;
						}}
					>
						درباره سازنده
					</ToolbarMenuItem>
				</ToolbarMenu>
				<Button
					on:click={() => {
						dataUpdate = false;
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
					<div class="book">
						<figure class="bookCover">
							<img src="./mockup.png" alt="" />
							<img src="./img/Cover.png" alt="" />
						</figure>
						<div class="bookContent">
							<h4>اسم کتاب</h4>
							<div>
								<p>سال انتشار <b>۱۳۶۰</b></p>
								<p>انتشارات <b>فخیم</b></p>
								<p>نویسنده <b>عبد الله موحد</b></p>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- {#if $rows}
		<DataTable
			style="width:100%"
			title="لیست کارکنان"
			description={`${$count} مورد یافت شد`}
			headers={[
				{ key: 'num', value: 'ردیف', width: '45px' },
				{ key: 'name', value: 'نام' },
				{ key: 'family', value: 'شهرت' },
				{ key: 'nationalCode', value: 'کد ملی' },
				{ key: 'unit', value: 'محل خدمت' },
				{ key: 'rank', value: 'درجه' },
				{ key: 'hiringDate', value: 'تاریخ استخدام' },
				{ key: 'personnelId', value: 'شماره پرسنلی' },
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
		{#if openDeveloper}
			<Developer bind:open={openDeveloper} />
		{/if}
		<Modal
			bind:open={openUser}
			size="lg"
			modalHeading="نمایش اطلاعات کتاب"
			primaryButtonText="چاپ"
			primaryButtonIcon={Printer}
			secondaryButtonText="بستن"
			on:open
			on:close={() => {
				openUser = false;
				dataUser = false;
				childrenData = [];
			}}
			on:submit={() => {
				window.print();
			}}
		>
			{#if dataUser}
				<div class="showUserHeader">{dataUser.name} {dataUser.family}</div>
				<ul class="showUserList">
					<li>کد ملی : <b>{dataUser.nationalCode || 'وارد نشده'}</b></li>
					<li>توضیحات : <b>{dataUser.description || 'وارد نشده'}</b></li>
					<li>آدرس : <b>{dataUser.address || 'وارد نشده'}</b></li>
					<li>تاریخ تولد : <b>{dataUser.birthday || 'وارد نشده'}</b></li>
					<li>تحصیلات : <b>{dataUser.education || 'وارد نشده'}</b></li>
					<li>شماره پرسنلی : <b>{dataUser.personnelId || 'وارد نشده'}</b></li>
					<li>تاریخ استخدام : <b>{dataUser.hiringDate || 'وارد نشده'}</b></li>
					<li>شماره تماس : <b>{dataUser.phone || 'وارد نشده'}</b></li>
					<li>درجه : <b>{dataUser.rank || 'وارد نشده'}</b></li>
					<li>یگان : <b>{dataUser.unit || 'وارد نشده'}</b></li>
				</ul>
				{#if dataUser.wife}
					<div class="showUserHeader2">اطلاعات همسر</div>
					<ul class="showUserList">
						<li>همسر : <b>{dataUser.wifeName} {dataUser.wifeFamily}</b></li>
						<li>سن همسر : <b>{dataUser.wifeBirthday || 'وارد نشده'}</b></li>
						<li>تحصیلات همسر : <b>{dataUser.wifeEducation || 'وارد نشده'}</b></li>
						<li>تخصص همسر : <b>{dataUser.wifeSpecialty || 'وارد نشده'}</b></li>
						<li>شغل همسر : <b>{dataUser.wifeJob || 'وارد نشده'}</b></li>
						<li>سال ازدواج : <b>{dataUser.yearMarriage || 'وارد نشده'}</b></li>
					</ul>
				{/if}
				{#if childrenData.length > 0}
					<div class="showUserHeader2">اطلاعات فرزندان</div>
					{#each childrenData as child}
						<ul class="showUserList2">
							<li>نام : <b>{child.name || 'وارد نشده'}</b></li>
							<li>جنسیت : <b>{child.sex || 'وارد نشده'}</b></li>
							<li>تاریخ تولد : <b>{child.birthday || 'وارد نشده'}</b></li>
							<li>تحصیلات : <b>{child.education || 'وارد نشده'}</b></li>
							<li>وضعیت تاهل : <b>{child.married || 'وارد نشده'}</b></li>
							<li>تخصص : <b>{child.specialty || 'وارد نشده'}</b></li>
							<li>توضیحات : <b>{child.description || 'وارد نشده'}</b></li>
						</ul>
					{/each}
				{/if}
			{/if}
		</Modal>
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
	{/if} -->
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
	.dashboard {
		display: flex;
		width: 100%;
		height: auto;
		/* background-color: var(--cds-layer, #fff); */
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
	.book {
		background-color: #f4f4f4;
	}
	.bookCover {
		height: auto;
		width: 100%;
		position: relative;
		margin-bottom: 10px;
	}
	.bookCover img:nth-child(1) {
		width: 100%;
		height: auto;
	}
	.bookCover img:nth-child(2) {
		width: 100%;
		height: auto;
		padding: 0 34.1%;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		margin: auto;
	}
	.bookContent {
		padding: 0 20px 5px;
	}
	.bookContent h4 {
		font-weight: bold;
		margin-bottom: 10px;
	}
	.bookContent p {
		color: #1d1d1d;
		font-size: 13px;
		padding: 0 2.5px;
		margin-bottom: 5px;
	}
	.bookContent div {
		display: flex;
		margin: 0 -2.5px;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.bookContent b {
		font-weight: bold;
	}
	.showUserHeader {
		font-size: 26px;
		text-align: center;
		margin-bottom: 30px;
	}
	.showUserHeader2 {
		font-size: 20px;
		text-align: right;
		margin-bottom: 15px;
		margin-top: 30px;
		font-weight: bold;
	}
	.showUserList {
		line-height: 32px;
		columns: 3;
	}
	.showUserList2 {
		line-height: 32px;
		columns: 4;
	}
	.showUserList b,
	.showUserList2 b {
		font-weight: bold;
	}
	:global(.bx--file-browse-btn),
	:global(.bx--file__selected-file) {
		max-width: 100% !important;
	}
</style>
