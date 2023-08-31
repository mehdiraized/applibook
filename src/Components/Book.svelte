<script>
	export let title, image, date, publisher, author;
</script>

<div class="book">
	<figure class="bookCover">
		<img src="./mockup.png" alt="" />
		<img src={image} alt="" />
	</figure>
	<div class="bookContent">
		<h4>{title}</h4>
		<div>
			<p>سال انتشار <b>{date}</b></p>
			<p>انتشارات <b>{publisher}</b></p>
			<p>نویسنده <b>{author}</b></p>
		</div>
	</div>
</div>

<style>
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
</style>
