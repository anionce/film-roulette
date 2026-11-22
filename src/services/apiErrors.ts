export const readErrorKind = async <Kind extends string>(
	response: Response,
	kinds: readonly Kind[],
	fallback: Kind
): Promise<Kind> => {
	try {
		const { error } = (await response.json()) as { error?: unknown };
		return kinds.find(kind => kind === error) ?? fallback;
	} catch {
		return fallback;
	}
};
