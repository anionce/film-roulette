import UndoIcon from '@mui/icons-material/Undo';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../components/ApiError/ApiError';
import { FewResults } from '../../components/FewResults/FewResults';
import { Loader } from '../../components/Loader/Loader';
import { MoviePlot } from '../../components/MoviePlot/MoviePlot';
import { MoviePoster } from '../../components/MoviePoster/MoviePoster';
import { NoResults } from '../../components/NoResults/NoResults';
import { Streaming } from '../../components/Streaming/Streaming';
import type { EmptyReason, ErrorReason, MovieRoulette } from '../../hooks/useMovieRoulette';
import { useLanguage } from '../../i18n/useLanguage';
import type { Translations } from '../../i18n/translations';
import { includedWithSubscription } from '../../lib/movies';
import './MoviePage.scss';

const emptyMessage = (reason: EmptyReason, t: Translations): string | undefined =>
	({
		default: undefined,
		genreCombo: t.noResultsGenreComboMessage,
		notMovies: t.aiNotMoviesMessage,
		aiUnavailable: t.aiUnavailableMessage,
		watchlistNoMatch: t.watchlistNoMatchMessage,
		watchlistNotFound: t.watchlistNotFoundMessage,
		watchlistEmpty: t.watchlistEmptyMessage,
		watchlistNoMovies: t.watchlistNoMoviesMessage,
	})[reason];

const errorMessage = (reason: ErrorReason, t: Translations): string | undefined =>
	({
		default: undefined,
		quotaExceeded: t.aiQuotaMessage,
		rateLimited: t.watchlistRateLimitedMessage,
	})[reason];

export const MoviePage = ({ roulette }: { roulette: MovieRoulette }) => {
	const navigate = useNavigate();
	const { t } = useLanguage();
	const { status, currentMovie } = roulette;

	const goHome = () => {
		roulette.reset();
		navigate('/');
	};

	return (
		<div className='movie-page-container'>
			<div className='exit-button-container'>
				<button type='button' className='exit-button-movie-page' onClick={goHome} aria-label={t.exitAriaLabel}>
					<UndoIcon />
				</button>
			</div>
			{status === 'error' && <ApiError message={errorMessage(roulette.errorReason, t)} onRetry={roulette.retry} />}
			{status === 'loading' && <Loader />}
			{status === 'empty' && <NoResults message={emptyMessage(roulette.emptyReason, t)} onGoHome={goHome} />}
			{status === 'ready' && currentMovie && (
				<div className='movie-info-container'>
					<div className='movie-visual'>
						<MoviePoster
							movie={currentMovie}
							imdbId={currentMovie.detail?.imdb_id}
							canGoBack={roulette.index > 0}
							canGoNext={roulette.hasNext}
							isNextBusy={roulette.isFetchingMore}
							onNext={roulette.next}
							onPrevious={roulette.previous}
							onExit={goHome}
						/>
					</div>
					<div className='movie-meta'>
						<div className='movie-heading'>
							<p className='movie-title'>{currentMovie.title}</p>
							{currentMovie.detail?.tagline && <p className='movie-tagline'>{currentMovie.detail.tagline}</p>}
						</div>
						<MoviePlot movie={currentMovie} imdbId={currentMovie.detail?.imdb_id} />
						{includedWithSubscription(currentMovie.streaming).length > 0 && (
							<div className='movie-streaming'>
								<p className='movie-streaming-label'>{t.availableOnLabel}</p>
								<Streaming availability={currentMovie.streaming} />
							</div>
						)}
					</div>
				</div>
			)}
			{status === 'ready' && roulette.showFewResults && <FewResults count={roulette.movies.length} />}
		</div>
	);
};
