import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

/* como activeChallenge é um objeto nós definimos os tipos desse objeto
em vez de utilizar o tipo objeto nele ja que é muito abstrato  */
interface Challenge {
	type: 'body' | 'eye';
	description: string;
	amount: number;
}

/* tipa os values que irão ficar disponiveis nos outros componentes */
interface ChallengesContextData {
	level: number;
	currentExperience: number;
	experienceToNextLevel: number;
	challengesCompleted: number;
	levelUp: () => void;
	startNewChallenge: () => void;
	activeChallenge: Challenge;
	resetChallenge: () => void;
	completeChallenge: () => void;
	closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
	children: ReactNode;
	level: number;
	currentExperience: number;
	challengesCompleted: number;
}

/* Cria um contexto do tipo ChallengesContextData */
export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({
	children,
	...rest
}: ChallengesProviderProps) {
	const [level, setLevel] = useState(rest.level ?? 1);
	const [currentExperience, setCurrentExperience] = useState(
		rest.currentExperience ?? 0
	);
	const [challengesCompleted, setChallengesCompleted] = useState(
		rest.challengesCompleted ?? 0
	);
	const [activeChallenge, setActiveChallenge] = useState(null);
	const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

	const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

	useEffect(() => {
		Notification.requestPermission();
	}, []);

	useEffect(() => {
		Cookies.set('level', String(level));
		Cookies.set('currentExperience', String(currentExperience));
		Cookies.set('challengesCompleted', String(challengesCompleted));
	}, [level, currentExperience, challengesCompleted]);

	function levelUp() {
		setLevel(level + 1);
		setIsLevelUpModalOpen(true);
	}

	function closeLevelUpModal() {
		setIsLevelUpModalOpen(false);
	}

	function startNewChallenge() {
		/* retorna um numero aleatorio entre a quantidade de numeros de desafios
        disponiveis e depois arredonda o numero pra baixo para nao retornar numeros quebrados */
		const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
		const challenge = challenges[randomChallengeIndex];

		setActiveChallenge(challenge);

		new Audio('/notification.mp3').play();

		if (Notification.permission === 'granted') {
			new Notification('Novo desafio', {
				body: `Valendo ${challenge.amount}xp`,
			});
		}
	}

	function resetChallenge() {
		setActiveChallenge(null);
	}

	function completeChallenge() {
		if (!activeChallenge) {
			return;
		}

		const { amount } = activeChallenge;

		let finalExperience = currentExperience + amount;

		if (finalExperience >= experienceToNextLevel) {
			finalExperience = finalExperience - experienceToNextLevel;
			levelUp();
		}

		setCurrentExperience(finalExperience);
		setActiveChallenge(null);
		setChallengesCompleted(challengesCompleted + 1);
	}

	return (
		/* torna o que tem dentro do value visivel para os outros componentes */
		<ChallengesContext.Provider
			value={{
				level,
				currentExperience,
				experienceToNextLevel,
				challengesCompleted,
				levelUp,
				startNewChallenge,
				activeChallenge,
				resetChallenge,
				completeChallenge,
				closeLevelUpModal,
			}}
		>
			{children}
			{isLevelUpModalOpen && <LevelUpModal />}
		</ChallengesContext.Provider>
	);
}
