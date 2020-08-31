export function errorToString(err) {
	return err.name + ": " + err.message + "\n" + (err.stack || "");
}