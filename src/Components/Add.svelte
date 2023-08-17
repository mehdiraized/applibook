<script>
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { blur } from 'svelte/transition';
	import {
		Grid,
		Row,
		Column,
		Select,
		SelectItem,
		Form,
		Modal,
		Button,
		TextInput,
		TextArea,
		Toggle,
		StructuredList,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		StructuredListBody,
		TileGroup,
		RadioTile
	} from 'carbon-components-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import { db } from '../db';
	import { onMount } from 'svelte';

	export let open = true,
		initial;
	let showChildren = false;
	let children = [];
	let initialForm = {
		name: '',
		family: '',
		birthday: '',
		phone: '',
		personnelId: '',
		unit: '',
		rank: 'سروان',
		address: '',
		education: 'لیسانس',
		description: '',
		wife: false,
		wifeName: '',
		wifeFamily: '',
		wifeBirthday: '',
		wifeEducation: 'لیسانس'
	};
	const messages = { required: 'این فیلد اجباری است.' };

	let dev = false;

	if (dev) {
		initialForm = {
			name: 'مهدی',
			family: 'رضایی',
			birthday: '۱۳۷۵/۰۲/۲۹',
			phone: '۰۹۱۲۰۳۳۶۶۳۶',
			personnelId: '۱۲۳۴۵۶۷۸۹',
			unit: 'عقیدتی سیاسی',
			rank: 'سروان',
			address: 'تهران - خیابان فاطمی',
			education: 'لیسانس',
			description: 'تست توضیحات',
			wife: false,
			wifeName: '',
			wifeFamily: '',
			wifeBirthday: '',
			wifeEducation: 'لیسانس'
		};
	}

	const name = field('name', initialForm.name, [required()], { valid: false, checkOnInit: true });
	const family = field('family', initialForm.family, [required()], {
		valid: false,
		checkOnInit: true
	});
	const birthday = field('birthday', initialForm.birthday, []);
	const phone = field('phone', initialForm.phone, [required()], {
		valid: false,
		checkOnInit: true
	});
	const personnelId = field('personnelId', initialForm.personnelId, [required()], {
		valid: false,
		checkOnInit: true
	});
	const unit = field('unit', initialForm.unit, [required()], {
		valid: false,
		checkOnInit: true
	});
	const rank = field('rank', initialForm.rank, []);
	const address = field('address', initialForm.address, []);
	const education = field('education', initialForm.education, []);
	const description = field('description', initialForm.description, []);
	const hiringDate = field('hiringDate', initialForm.hiringDate, []);
	const nationalCode = field('nationalCode', initialForm.nationalCode, [required()], {
		valid: false,
		checkOnInit: true
	});

	const wife = field('wife', initialForm.wife, []);
	const wifeName = field('wifeName', initialForm.wifeName, [required()], {
		valid: false,
		checkOnInit: true
	});
	const wifeFamily = field('wifeFamily', initialForm.wifeFamily, [required()], {
		valid: false,
		checkOnInit: true
	});
	const wifeBirthday = field('wifeBirthday', initialForm.wifeBirthday, [required()], {
		valid: false,
		checkOnInit: true
	});
	const wifeEducation = field('wifeEducation', initialForm.wifeEducation, [required()], {
		valid: false,
		checkOnInit: true
	});
	const wifeSpecialty = field('wifeSpecialty', initialForm.wifeSpecialty, [], {
		valid: false,
		checkOnInit: true
	});
	const wifeJob = field('wifeJob', initialForm.wifeJob, [], {
		valid: false,
		checkOnInit: true
	});
	const yearMarriage = field('yearMarriage', initialForm.yearMarriage, [], {
		valid: false,
		checkOnInit: true
	});

	const myForm = form(
		name,
		family,
		birthday,
		phone,
		personnelId,
		unit,
		rank,
		address,
		education,
		description,
		hiringDate,
		nationalCode,
		wife
	);
	const childrenSex = field('childrenSex', 'آقا', []);
	const childrenName = field('childrenName', '', [required()], { valid: false, checkOnInit: true });
	const childrenBirthday = field('childrenBirthday', '', [required()], {
		valid: false,
		checkOnInit: true
	});
	const childrenEducation = field('childrenEducation', 'لیسانس', [required()], {
		valid: false,
		checkOnInit: true
	});
	const childrenMarried = field('childrenMarried', 'مجرد', [required()], {
		valid: false,
		checkOnInit: true
	});
	const childrenSpecialty = field('childrenSpecialty', '', [], { valid: false, checkOnInit: true });
	const childrenDescription = field('childrenDescription', '', [], {
		valid: false,
		checkOnInit: true
	});

	const childrenForm = form(
		childrenName,
		childrenBirthday,
		childrenEducation,
		childrenSex,
		childrenMarried,
		childrenSpecialty,
		childrenDescription
	);

	async function addUser(values) {
		let insertValue = { ...values };
		let insertChildrenValue = [];
		if (values.wife) {
			insertValue = {
				...insertValue,
				wifeName: $wifeName.value,
				wifeFamily: $wifeFamily.value,
				wifeBirthday: $wifeBirthday.value,
				wifeEducation: $wifeEducation.value,
				wifeSpecialty: $wifeSpecialty.value,
				wifeJob: $wifeJob.value,
				yearMarriage: $yearMarriage.value
			};
		}
		if (children.length > 0) {
			for await (let child of children) {
				const id = await db.children.add({
					birthday: child.childrenBirthday,
					education: child.childrenEducation,
					name: child.childrenName,
					sex: child.childrenSex
				});
				insertChildrenValue = [...insertChildrenValue, id];
			}
		}
		if (insertChildrenValue.length > 0) {
			insertValue = {
				...insertValue,
				children: insertChildrenValue
			};
		}
		// console.log({ values, wife, children, insertValue });
		try {
			const id = await db.users.add(insertValue);
			return id;
		} catch (error) {
			return error;
		}
	}

	async function editUser(values) {
		let insertValue = { ...values };
		let insertChildrenValue = [];
		if (values.wife) {
			insertValue = {
				...insertValue,
				wifeName: $wifeName.value,
				wifeFamily: $wifeFamily.value,
				wifeBirthday: $wifeBirthday.value,
				wifeEducation: $wifeEducation.value
			};
		}
		if (children.length > 0) {
			for await (let child of children) {
				const id = await db.children.add({
					birthday: child.childrenBirthday,
					education: child.childrenEducation,
					name: child.childrenName,
					sex: child.childrenSex,
					married: child.childrenMarried,
					specialty: child.childrenSpecialty,
					description: child.childrenDescription
				});
				insertChildrenValue = [...insertChildrenValue, id];
			}
		}
		if (insertChildrenValue.length > 0) {
			insertValue = {
				...insertValue,
				children: insertChildrenValue
			};
		}
		// console.log({ values, wife, children, insertValue });
		try {
			const id = await db.users.update(initial.id, insertValue);
			return id;
		} catch (error) {
			return error;
		}
	}

	onMount(() => {
		if (initial) {
			$name = initial.name;
			$family = initial.family;
			$birthday = initial.birthday;
			$phone = initial.phone;
			$personnelId = initial.personnelId;
			$unit = initial.unit;
			$rank = initial.rank;
			$address = initial.address;
			$education = initial.education;
			$description = initial.description;
			$wife = initial.wife;
		}
	});
</script>

<Modal
	bind:open
	size="lg"
	modalHeading={initial ? 'ویرایش کارمند' : 'افزودن کارمند'}
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
			await editUser($myForm.summary);
		} else {
			await addUser($myForm.summary);
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
						labelText="نام"
						id="name"
						name="name"
						bind:value={$name.value}
						invalid={$myForm.hasError('name.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column>
					<TextInput
						id="family"
						name="family"
						labelText="شهرت"
						bind:value={$family.value}
						invalid={$myForm.hasError('family.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column>
					<TextInput
						id="nationalCode"
						name="nationalCode"
						labelText="کد ملی"
						placeholder="0123456789"
						style="direction:ltr;text-align:center;"
						bind:value={$nationalCode.value}
						invalid={$myForm.hasError('nationalCode.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column>
					<TextInput
						id="birthday"
						name="birthday"
						labelText="تاریخ تولد"
						placeholder="1375/02/29"
						style="direction:ltr;text-align:center;"
						bind:value={$birthday.value}
					/>
				</Column>
			</Row>
			<Row style="margin: 0 0 1.5em 0;">
				<Column style="max-width: 25%;flex: 0 0 25%;">
					<TextInput
						id="phone"
						name="phone"
						labelText="شماره تماس"
						placeholder="09123456789"
						style="direction:ltr;text-align:center;"
						bind:value={$phone.value}
						invalid={$myForm.hasError('phone.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column style="max-width: 25%;flex: 0 0 25%;">
					<Select
						labelText="تحصیلات"
						id="education"
						name="education"
						selected={$education.value}
						on:change={(e) => ($education = e.detail)}
					>
						<SelectItem value="زیر دیپلم" text="زیر دیپلم" />
						<SelectItem value="دیپلم" text="دیپلم" />
						<SelectItem value="فوق دیپلم" text="فوق دیپلم" />
						<SelectItem value="لیسانس" text="لیسانس" />
						<SelectItem value="فوق لیسانس" text="فوق لیسانس" />
						<SelectItem value="دکتری" text="دکتری" />
					</Select>
				</Column>
				<Column style="max-width: 50%;flex: 0 0 50%;">
					<TextInput
						id="address"
						name="address"
						labelText="محل سکونت"
						bind:value={$address.value}
					/>
				</Column>
			</Row>
			<Row style="margin: 0 0 1.5em 0;">
				<Column>
					<TextInput
						id="personnelId"
						name="personnelId"
						labelText="شماره پرسنلی"
						placeholder="0123456789"
						style="direction:ltr;text-align:center;"
						bind:value={$personnelId.value}
						invalid={$myForm.hasError('personnelId.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column>
					<TextInput
						id="hiringDate"
						name="hiringDate"
						labelText="تاریخ استخدام"
						placeholder="1375/02/29"
						style="direction:ltr;text-align:center;"
						bind:value={$hiringDate.value}
					/>
				</Column>
				<Column>
					<TextInput
						id="unit"
						name="unit"
						labelText="محل خدمت"
						bind:value={$unit.value}
						invalid={$myForm.hasError('unit.required')}
						invalidText={messages.required}
					/>
				</Column>
				<Column>
					<Select
						labelText="درجه"
						id="rank"
						name="rank"
						selected={$rank.value}
						on:change={(e) => ($rank = e.detail)}
						invalid={$myForm.hasError('rank.required')}
						invalidText={messages.required}
					>
						<SelectItem value="گروهبان یک" text="گروهبان یک" />
						<SelectItem value="استوار دوم" text="استوار دوم" />
						<SelectItem value="استوار یکم" text="استوار یکم" />
						<SelectItem value="ستوان سه" text="ستوان سه" />
						<SelectItem value="ستوان دو" text="ستوان دو" />
						<SelectItem value="ستوان یک" text="ستوان یک" />
						<SelectItem value="سروان" text="سروان" />
						<SelectItem value="سرگرد" text="سرگرد" />
						<SelectItem value="سرهنگ دوم" text="سرهنگ دوم" />
						<SelectItem value="سرهنگ" text="سرهنگ" />
						<SelectItem value="سرتیپ دوم" text="سرتیپ دوم" />
						<SelectItem value="سرتیپ" text="سرتیپ" />
						<SelectItem value="سرلشکر" text="سرلشکر" />
					</Select>
				</Column>
			</Row>
			<Row style="margin: 0 0 1.5em 0;">
				<Column>
					<TextArea
						id="description"
						name="description"
						labelText="توضیحات"
						placeholder="توضیحی درباره این کارمند اضافه کنید..."
						bind:value={$description.value}
					/>
				</Column>
			</Row>
			<Row style="margin: 0 0 1.5em 0;">
				<Column>
					<Toggle
						name="wife"
						on:toggle={() => {
							$wife = !$wife.value;
						}}
						style="margin: 0 0 1.5em 0;"
						toggled={$wife.value}
						bind:value={$wife.value}
					>
						<span slot="labelA">همسر ندارد</span>
						<span slot="labelB">همسر دارد</span>
					</Toggle>
				</Column>
			</Row>
			{#if $wife.value}
				<div transition:blur>
					<Row style="margin: 0 0 1.5em 0;">
						<Column>
							<TextInput
								id="wifeName"
								name="wifeName"
								labelText="نام همسر"
								bind:value={$wifeName.value}
								invalid={$myForm.hasError('wifeName.required')}
								invalidText={messages.required}
							/>
						</Column>
						<Column>
							<TextInput
								id="wifeFamily"
								name="wifeFamily"
								labelText="شهرت همسر"
								bind:value={$wifeFamily.value}
								invalid={$myForm.hasError('wifeFamily.required')}
								invalidText={messages.required}
							/>
						</Column>
						<Column>
							<TextInput
								id="wifeBirthday"
								name="wifeBirthday"
								labelText="سال تولد همسر"
								placeholder="1375"
								style="direction:ltr;text-align:center;"
								bind:value={$wifeBirthday.value}
								invalid={$myForm.hasError('wifeBirthday.required')}
								invalidText={messages.required}
							/>
						</Column>
						<Column>
							<TextInput
								id="yearMarriage"
								name="yearMarriage"
								labelText="سال ازدواج"
								placeholder="1375"
								style="direction:ltr;text-align:center;"
								bind:value={$yearMarriage.value}
								invalid={$myForm.hasError('yearMarriage.required')}
								invalidText={messages.required}
							/>
						</Column>
					</Row>
					<Row style="margin: 0 0 1.5em 0;">
						<Column>
							<Select
								labelText="تحصیلات همسر"
								id="wifeEducation"
								name="wifeEducation"
								selected={$wifeEducation.value}
								on:change={(e) => ($wifeEducation = e.detail)}
								bind:value={$wifeEducation.value}
							>
								<SelectItem value="زیر دیپلم" text="زیر دیپلم" />
								<SelectItem value="دیپلم" text="دیپلم" />
								<SelectItem value="فوق دیپلم" text="فوق دیپلم" />
								<SelectItem value="لیسانس" text="لیسانس" />
								<SelectItem value="فوق لیسانس" text="فوق لیسانس" />
								<SelectItem value="دکتری" text="دکتری" />
							</Select>
						</Column>
						<Column>
							<TextInput
								id="wifeSpecialty"
								name="wifeSpecialty"
								labelText="تخصص همسر"
								bind:value={$wifeSpecialty.value}
								invalid={$myForm.hasError('wifeSpecialty.required')}
								invalidText={messages.required}
							/>
						</Column>
						<Column>
							<TextInput
								id="wifeJob"
								name="wifeJob"
								labelText="شغل همسر"
								bind:value={$wifeJob.value}
								invalid={$myForm.hasError('wifeJob.required')}
								invalidText={messages.required}
							/>
						</Column>
					</Row>
				</div>
			{/if}
			<div style="display:flex;justify-content:space-between;margin: 0 0 1.5em 0;">
				<h4>
					اطلاعات فرزندان <span style="font-size:14px">({children.length} فرزند)</span>
				</h4>
				<div>
					{#if !showChildren}
						<Button size="small" on:click={() => (showChildren = !showChildren)} icon={Add}>
							افزودن فرزند
						</Button>
					{:else}
						<Button
							size="small"
							on:click={() => {
								children = [...children, $childrenForm.summary];
								showChildren = !showChildren;
							}}
							icon={Checkmark}
						>
							ذخیره
						</Button>
						<Button size="small" kind="danger-tertiary" iconDescription="بستن" icon={Close} />
					{/if}
				</div>
			</div>
			{#if showChildren}
				<div transition:blur>
					<Row style="margin: 0 0 1.5em 0;">
						<Column>
							<TileGroup
								size="small"
								class="uiRadioTileFlex"
								legend="جنسیت"
								name="childrenSex"
								id="childrenSex"
								selected={$childrenSex.value}
								on:select={(e) => ($childrenSex = e.detail)}
								bind:value={$childrenSex.value}
							>
								<RadioTile size="small" value="آقا">آقا</RadioTile>
								<RadioTile size="small" value="خانم">خانم</RadioTile>
							</TileGroup>
						</Column>
						<Column>
							<TextInput
								id="childrenName"
								name="childrenName"
								labelText="نام فرزند"
								bind:value={$childrenName.value}
								invalid={$childrenForm.hasError('childrenName.required')}
								invalidText={messages.required}
							/>
						</Column>
						<Column>
							<TextInput
								id="childrenBirthday"
								name="childrenBirthday"
								labelText="سال تولد فرزند"
								placeholder="1375"
								style="direction:ltr;text-align:center;"
								bind:value={$childrenBirthday.value}
								invalid={$childrenForm.hasError('childrenBirthday.required')}
								invalidText={messages.required}
							/>
						</Column>
						<Column>
							<Select
								labelText="تحصیلات فرزند"
								id="education"
								name="childrenEducation"
								selected={$childrenEducation.value}
								on:change={(e) => ($childrenEducation = e.detail)}
								bind:value={$childrenEducation.value}
							>
								<SelectItem value="زیر دیپلم" text="زیر دیپلم" />
								<SelectItem value="دیپلم" text="دیپلم" />
								<SelectItem value="فوق دیپلم" text="فوق دیپلم" />
								<SelectItem value="لیسانس" text="لیسانس" />
								<SelectItem value="فوق لیسانس" text="فوق لیسانس" />
								<SelectItem value="دکتری" text="دکتری" />
							</Select>
						</Column>
					</Row>
					<Row style="margin: 0 0 1.5em 0;">
						<Column style="max-width: 25%;flex: 0 0 25%;">
							<TileGroup
								size="small"
								class="uiRadioTileFlex"
								legend="وضعیت تاهل"
								name="childrenMarried"
								id="childrenMarried"
								selected={$childrenMarried.value}
								on:select={(e) => ($childrenMarried = e.detail)}
								bind:value={$childrenMarried.value}
							>
								<RadioTile size="small" value="مجرد">مجرد</RadioTile>
								<RadioTile size="small" value="متاهل">متاهل</RadioTile>
							</TileGroup>
						</Column>
						<Column style="max-width: 25%;flex: 0 0 25%;">
							<TextInput
								id="childrenSpecialty"
								name="childrenSpecialty"
								labelText="تخصص فرزند"
								bind:value={$childrenSpecialty.value}
								invalid={$childrenForm.hasError('childrenSpecialty.required')}
								invalidText={messages.required}
							/>
						</Column>
						<Column style="max-width: 50%;flex: 0 0 50%;">
							<TextArea
								id="childrenDescription"
								name="childrenDescription"
								labelText="توضیحات"
								placeholder="توضیحی اضافه کنید..."
								bind:value={$childrenDescription.value}
							/>
						</Column>
					</Row>
				</div>
			{/if}
			{#if children.length > 0}
				<StructuredList flush>
					<StructuredListHead>
						<StructuredListRow head>
							<StructuredListCell head>جنسیت فرزند</StructuredListCell>
							<StructuredListCell head>نام فرزند</StructuredListCell>
							<StructuredListCell head>سال تولد فرزند</StructuredListCell>
							<StructuredListCell head>تحصیلات فرزند</StructuredListCell>
							<StructuredListCell head>تخصص فرزند</StructuredListCell>
							<StructuredListCell head>وضعیت تاهل فرزند</StructuredListCell>
							<StructuredListCell head>توضیحات</StructuredListCell>
						</StructuredListRow>
					</StructuredListHead>
					<StructuredListBody>
						{#each children as { childrenSex, childrenName, childrenBirthday, childrenEducation, childrenSpecialty, childrenMarried, childrenDescription }}
							<StructuredListRow>
								<StructuredListCell noWrap>{childrenSex}</StructuredListCell>
								<StructuredListCell>{childrenName}</StructuredListCell>
								<StructuredListCell>{childrenBirthday}</StructuredListCell>
								<StructuredListCell>{childrenEducation}</StructuredListCell>
								<StructuredListCell>{childrenSpecialty}</StructuredListCell>
								<StructuredListCell>{childrenMarried}</StructuredListCell>
								<StructuredListCell>{childrenDescription}</StructuredListCell>
							</StructuredListRow>
						{/each}
					</StructuredListBody>
				</StructuredList>
			{/if}
		</Grid>
	</Form>
</Modal>
