/**
 * We can convert this into an async wrapper, which I'd usually use something like this for :)
 * @param fn function you wish to run
 * @param params parameters for the function you wish to run
 * @param errMessage specific error message you want to throw if function fails
 */
export function callWithErrorWrapping<T>(
	fn: Function,
	params: Array<any>,
	errMessage: string,
): { err: Error | null; val: T | null } {
	let val = null as T | null;
	let err = null as Error | null;
	try {
		val = fn(...params);
	} catch (error) {
		if (!(error instanceof Error)) {
			error = new Error(error.toString());
		}
		const { message: originalMessage } = error;
		error.message = JSON.stringify({ originalMessage, errMessage });
		err = error;
	} finally {
		return { err, val };
	}
}
