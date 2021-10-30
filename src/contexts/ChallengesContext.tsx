import { createContext, ReactNode, useState } from 'react';
import challenges from '../../challenges.json';

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
}

interface ChallengesProviderProps {
	children: ReactNode;
}

/* Cria um contexto do tipo ChallengesContextData */
export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
	const [level, setLevel] = useState(1);
	const [currentExperience, setCurrentExperience] = useState(0);
	const [challengesCompleted, setChallengesCompleted] = useState(0);

	const [activeChallenge, setActiveChallenge] = useState(null);

	const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

	function levelUp() {
		setLevel(level + 1);
	}

	function startNewChallenge() {
		/* retorna um numero aleatorio entre a quantidade de numeros de desafios
        disponiveis e depois arredonda o numero pra baixo para nao retornar numeros quebrados */
		const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
		const challenge = challenges[randomChallengeIndex];

		setActiveChallenge(challenge);
	}

	function resetChallenge() {
		setActiveChallenge(null);
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
			}}
		>
			{children}
		</ChallengesContext.Provider>
	);
}
