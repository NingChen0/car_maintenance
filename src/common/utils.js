
export const setTime = (time = +new Date()) => {
	let date = new Date(time + 8 * 3600 * 1000);
    return date.toJSON().substr(0, 19).replace("T", " ");
}
 