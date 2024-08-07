import stations from '$lib/data/stations.json';
import { fzf } from '$lib/fuzzy-search';
import type { APIRoute } from 'astro';

function find(query: string): string | null {
	query = query.trim().toLowerCase();

	const station =
		stations.find((s) => s.crs == query) ||
		stations.find((s) => s.tiploc == query) ||
		stations.find((s) => fzf(query, s.name));

	return station?.crs || null;
}

export const GET: APIRoute = async ({ url, redirect }) => {
	const query = url.searchParams.get('q');
	if (!query) return redirect('/');

	const crs = find(query);
	return redirect(crs ? `/${crs}` : '/?error=search-missing-station');
};
