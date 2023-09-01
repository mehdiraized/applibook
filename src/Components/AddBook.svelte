<script>
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import {
		Grid,
		Row,
		Column,
		Select,
		SelectItem,
		Form,
		Modal,
		TextInput,
		TextArea,
		FileUploaderDropContainer,
		FileUploaderItem
	} from 'carbon-components-svelte';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import { db } from '../db';
	import { bookCategories } from '../categories';
	import { onMount } from 'svelte';

	export let open = true,
		bookImage = null,
		initial;
	let initialForm = {
		name: '',
		author: '',
		year: '',
		publishers: '',
		category: 'معمایی',
		description: ''
	};
	const messages = { required: 'این فیلد اجباری است.' };

	let dev = true;

	if (dev) {
		initialForm = {
			name: 'کیمیاگر',
			author: 'پائولو',
			year: '1375',
			publishers: 'رضایی',
			category: 'معمایی',
			description: 'تست توضیحات'
		};
	}

	const name = field('name', initialForm.name, [required()], {
		valid: false,
		checkOnInit: true
	});
	const author = field('author', initialForm.author, [required()], {
		valid: false,
		checkOnInit: true
	});
	const year = field('year', initialForm.year, []);
	const publishers = field('publishers', initialForm.publishers, [required()], {
		valid: false,
		checkOnInit: true
	});
	const category = field('category', initialForm.category, []);
	const description = field('description', initialForm.description, []);

	const myForm = form(name, author, year, publishers, category, description);

	async function addBook(values) {
		let insertValue = { ...values };
		if (bookImage) {
			insertValue.image = bookImage;
		}
		try {
			const id = await db.books.add(insertValue);
			return id;
		} catch (error) {
			return error;
		}
	}

	async function editBook(values) {
		let insertValue = { ...values };
		if (bookImage) {
			insertValue.image = bookImage;
		}
		try {
			const id = await db.books.update(initial.id, insertValue);
			return id;
		} catch (error) {
			return error;
		}
	}

	onMount(() => {
		if (initial) {
			$name = initial.name;
			$author = initial.author;
			$year = initial.year;
			$publishers = initial.publishers;
			$category = initial.category;
			$description = initial.description;
		}
	});
</script>

<Modal
	bind:open
	size="lg"
	modalHeading={initial ? 'ویرایش کتاب' : 'کتاب جدید'}
	selectorPrimaryFocus="#name"
	primaryButtonText={initial ? 'ویرایش' : 'ثبت'}
	primaryButtonIcon={Checkmark}
	secondaryButtonText="بستن"
	primaryButtonDisabled={!$myForm.valid || !$myForm.dirty}
	on:click:button--secondary={() => (open = false)}
	on:open
	on:close
	on:submit={async () => {
		if (initial) {
			await editBook($myForm.summary);
		} else {
			await addBook($myForm.summary);
		}
		open = false;
	}}
>
	<Form
		style="padding:0 15px"
		on:submit={(e) => {
			e.preventDefault();
		}}
	>
		<Grid condensed noGutter fullWidth>
			<Row style="margin: 0 0 1.5em 0;">
				<Column>
					<TextInput
						labelText="نام کتاب"
						id="name"
						name="name"
						bind:value={$name.value}
						invalid={$myForm.hasError('name.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column>
					<TextInput
						id="author"
						name="author"
						labelText="نویسنده"
						bind:value={$author.value}
						invalid={$myForm.hasError('author.required')}
						invalidText={messages.required}
					/>
				</Column>
			</Row>
			<Row style="margin: 0 0 1.5em 0;">
				<Column>
					<TextInput
						id="year"
						name="year"
						labelText="سال چاپ"
						placeholder=""
						style="direction:ltr;text-align:center;"
						bind:value={$year.value}
					/>
				</Column>
				<Column>
					<TextInput
						id="publishers"
						name="publishers"
						labelText="انتشارات"
						placeholder=""
						style="direction:ltr;text-align:center;"
						bind:value={$publishers.value}
						invalid={$myForm.hasError('publishers.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column>
					<Select
						labelText="دسته بندی"
						id="category"
						name="category"
						selected={$category.value}
						on:change={(e) => ($category = e.detail)}
					>
						{#each bookCategories as item}
							<SelectItem value={item} text={item} />
						{/each}
					</Select>
				</Column>
			</Row>
			<Row style="margin: 0 0 1.5em 0;">
				<Column>
					<TextArea
						id="description"
						name="description"
						labelText="توضیحات"
						placeholder="توضیحی درباره این کتاب اضافه کنید..."
						bind:value={$description.value}
					/>
				</Column>
			</Row>
			<Row style="margin: 0 0 1.5em 0;">
				<Column>
					{#if !bookImage}
						<FileUploaderDropContainer
							labelText="تصویر کتاب را داخل این جعبه بکشید یا اینجا کلیک کنید"
							accept={['.jpg', '.png', 'jpeg']}
							on:add={async (file) => {
								let reader = new FileReader();
								reader.onload = () => {
									bookImage = reader.result;
								};
								reader.readAsDataURL(file.detail[0]);
							}}
						/>
					{:else}
						<FileUploaderItem
							name="تصویر کتاب"
							status="edit"
							on:delete={() => {
								bookImage = null;
							}}
						/>
					{/if}
				</Column>
			</Row>
		</Grid>
	</Form>
</Modal>
