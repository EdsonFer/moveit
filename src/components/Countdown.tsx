import { useContext, useEffect, useState } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Countdown.module.css';

let countdownTimeout: NodeJS.Timeout;

export function Countdown() {
	const { startNewChallenge } = useContext(ChallengesContext);

	const [time, setTime] = useState(0.1 * 60);
	const [isActive, setIsActive] = useState(false);
	const [loading, setLoading] = useState(0);

	/* arredonda o valor para baixo */
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	/* 	pega o numero e transforma em uma string.
	coloca um 0 no inicio se ele nao tiver 2 caracteres
	 e depois separa o numero e devolve um array */
	const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
	const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');
	const [hasFinished, setHasFinished] = useState(false);

	function startCountdown() {
		setIsActive(true);
	}

	function resetCountdown() {
		clearTimeout(countdownTimeout);
		setIsActive(false);
		setTime(25 * 60);
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
		<div>
			<div className={styles.countdownContainer}>
				<div>
					<span>{minuteLeft}</span>
					<span>{minuteRight}</span>
				</div>
				<span>:</span>
				<div>
					<span>{secondLeft}</span>
					<span>{secondRight}</span>
				</div>
			</div>

			{hasFinished ? (
				<>
					<button disabled className={styles.countdownButton}>
						Ciclo encerrado
						<img src="check_circle.png" />
					</button>
					<div style={{ width: '100%' }} className={styles.loadingButton} />
				</>
			) : (
				<>
					{isActive ? (
						<>
							<button
								type="button"
								className={`
					${styles.countdownButton}
					${styles.countdownButtonActive}
					`}
								onClick={resetCountdown}
							>
								Abandonar ciclo
								<img src="x.png" />
							</button>
							<div
								//barra de loading
								style={{ width: `${loading}%` }}
								className={styles.loadingButton}
							/>
						</>
					) : (
						<button
							type="button"
							className={styles.countdownButton}
							onClick={startCountdown}
						>
							Iniciar um ciclo
						</button>
					)}
				</>
			)}
		</div>
	);
}
