import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { ChallengesContext } from './ChallengesContext';

interface CountdownContextData {
	minutes: number;
	seconds: number;
	loading: number;
	hasFinished: boolean;
	isActive: boolean;
	resetCountdown: () => void;
	startCountdown: () => void;
}

interface CountdownProviderProps {
	children: ReactNode;
}

let countdownTimeout: NodeJS.Timeout;

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children }: CountdownProviderProps) {
	const { startNewChallenge } = useContext(ChallengesContext);

	const [time, setTime] = useState(0.1 * 60);
	const [isActive, setIsActive] = useState(false);
	const [loading, setLoading] = useState(0);

	const [hasFinished, setHasFinished] = useState(false);

	/* arredonda o valor para baixo */
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	function startCountdown() {
		setIsActive(true);
	}

	function resetCountdown() {
		clearTimeout(countdownTimeout);
		setIsActive(false);
		setTime(25 * 60);
		setHasFinished(false);
		setLoading(0);
	}

	// aumenta a barra de loading até 100% sempre que o tempo diminuir
	useEffect(() => {
		setLoading(loading + 0.066);
	}, [time]);

	useEffect(() => {
		if (isActive && time > 0) {
			// executa algo após 1 segundo
			countdownTimeout = setTimeout(() => {
				setTime(time - 1);
			}, 1000);
		} else if (isActive && time === 0) {
			setHasFinished(true);
			setIsActive(false);
			setLoading(0);
			startNewChallenge();
		}
	}, [isActive, time]);

	return (
		<CountdownContext.Provider
			value={{
				minutes,
				seconds,
				loading,
				hasFinished,
				isActive,
				resetCountdown,
				startCountdown,
			}}
		>
			{children}
		</CountdownContext.Provider>
	);
}
