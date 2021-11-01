import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import Switch from 'react-switch';

import styles from '../styles/components/ExperienceBar.module.css';
import { ThemeContext } from 'styled-components';

interface Props {
	toggleTheme: () => void;
}

export function ExperienceBar({ toggleTheme }: Props) {
	const { currentExperience, experienceToNextLevel } =
		useContext(ChallengesContext);

	const { title, colors } = useContext(ThemeContext);

	const percentToNextLevel =
		Math.round(currentExperience * 100) / experienceToNextLevel;

	return (
		<>
			<header className={styles.experienceBar}>
				<span>0 xp</span>
				<div>
					<div style={{ width: `${percentToNextLevel}%` }} />
					<span
						className={styles.currentExperience}
						style={{ left: `${percentToNextLevel}%` }}
					>
						{currentExperience} xp
					</span>
				</div>
				<span>{experienceToNextLevel} xp</span>
			</header>
			<Switch
				className={styles.switch}
				onChange={toggleTheme}
				checked={title === 'dark'}
				checkedIcon={false}
				uncheckedIcon={false}
				height={10}
				width={40}
				handleDiameter={20}
				onColor="#f2f3f5"
				offColor="#343a40"
			/>
		</>
	);
}
