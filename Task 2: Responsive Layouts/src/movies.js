import content from './content.json';
import rogerRabbit from './assets/who-framed-roger-rabbit.webp';
import hook from './assets/hook.webp';
import laLaLand from './assets/la-la-land.webp';
import hiddenFigures from './assets/hidden-figures.webp';
import palmSprings from './assets/palm-springs.webp';
import barbie from './assets/barbie.webp';

const posters = [rogerRabbit, hook, laLaLand, hiddenFigures, palmSprings, barbie];
const trailers = ['XEIJpS26aAw', 'c-vwgt8cwEM', '0pdqf4P9MB8', '5wfrDhgUMGI', 'CpBLtXduh_k', 'pBk4NYhWNMM'];

export const movies = content.map((movie, index) => ({
  ...movie,
  poster: posters[index],
  trailer: `https://www.youtube.com/watch?v=${trailers[index]}`,
}));
