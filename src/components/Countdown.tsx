import { useContext } from 'react';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css';

export function Countdown() {
	const {
		minutes,
		seconds,
		loading,
		hasFinished,
		isActive,
		resetCountdown,
		startCountdown,
	} = useContext(CountdownContext);

	/* 	pega o numero e transforma em uma string.
	coloca um 0 no inicio se ele nao tiver 2 caracteres
	 e depois separa o numero e devolve um array */
	const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
	const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

	return (
		<>
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
		</>
	);
}
