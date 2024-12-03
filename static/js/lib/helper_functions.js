function confirm_del(delete_link) {
	if(confirm('Czy na pewno usunąć rekord?')) {
	 	window.location.href=delete_link;
	}
}

// function confirm_upload() {
// 	if(confirm('Czy wysłać plik na serwer?')) {
// 	 	//window.location.href=delete_link;
// 		document.getElementById('primaryButton').click();
// 	}
// }
