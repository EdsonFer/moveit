import { useEffect, useState, Dispatch, SetStateAction } from 'react';

type Response<T> = [T, Dispatch<SetStateAction<T>>];

export function usePersistedState<T>(
	key: string,
	initialState: T
): Response<T> {
	const [state, setState] = useState(() => {
		const storageValue =
			typeof window !== 'undefined' ? localStorage.getItem(key) : '';

		if (storageValue) {
			return JSON.parse(storageValue);
		} else {
			return initialState;
		}
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
	}, [state]);

	return [state, setState];
}
