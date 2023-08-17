// const { dialog } = require('electron');

// let currWindow = remote.BrowserWindow.getFocusedWindow();

// window.dialogCurrentWindow = function () {
// 	dialog
// 		.showOpenDialog({ properties: ['openFile'] })
// 		.then(({ filePaths, canceled }) => {
// 			console.log(canceled);
// 			console.log(filePaths);
// 			if (filePaths === undefined) {
// 				console.log('No file selected');
// 				return;
// 			}
// 			return filePaths;
// 			// fs.readFile(filePaths, 'utf-8', (err, data) => {
// 			// 	if (err) {
// 			// 		alert('An error ocurred reading the file :' + err.message);
// 			// 		return;
// 			// 	}

// 			// 	// Change how to handle the file content
// 			// 	console.log('The file content is : ' + data);
// 			// });
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };
window.dialogApp = require('electron').dialog;
