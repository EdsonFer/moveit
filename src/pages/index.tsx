import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { ChallengeBox } from '../components/ChallengeBox';
import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from '../components/ExperienceBar';
import { Profile } from '../components/Profile';
import { CountdownProvider } from '../contexts/CountdownContext';
import { ChallengesProvider } from '../contexts/ChallengesContext';
import { usePersistedState } from '../utils/usePersistedState';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import GlobalStyle from '../styles/global';
import dark from '../styles/themes/dark';
import light from '../styles/themes/light';
import styles from '../styles/pages/Home.module.css';

interface HomeProps {
	level: number;
	currentExperience: number;
	challengesCompleted: number;
}

export default function Home(props: HomeProps) {
	const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', dark);

	const toggleTheme = () => {
		setTheme(theme.title === 'light' ? dark : light);
	};

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<ChallengesProvider
				level={props.level}
				currentExperience={props.currentExperience}
				challengesCompleted={props.challengesCompleted}
			>
				<div className={styles.container}>
					<Head>
						<title> Inicio - Move.it</title>
					</Head>
					<ExperienceBar toggleTheme={toggleTheme} />

					<CountdownProvider>
						<section>
							<div>
								<Profile />
								<CompletedChallenges />
								<Countdown />
							</div>
							<div>
								<ChallengeBox />
							</div>
						</section>
					</CountdownProvider>
				</div>
			</ChallengesProvider>
		</ThemeProvider>
	);
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { level, currentExperience, challengesCompleted } = ctx.req.cookies;

	return {
		props: {
			level: Number(level),
			currentExperience: Number(currentExperience),
			challengesCompleted: Number(challengesCompleted),
		},
	};
};
