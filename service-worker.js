

self.addEventListener("fetch", (event) => {
	console.log(event, Object.fromEntries(event.request.headers.entries()));
});
