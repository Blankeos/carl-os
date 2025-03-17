import FlexSearch from 'flexsearch';
import { createSignal, onMount } from 'solid-js';

export const useFlexSearch = <T>(
  data: T[],
  options: {
    indexer: (item: T) => string;
  } = { indexer: (item) => JSON.stringify(item) }
) => {
  const [query, updateQuery] = createSignal('');
  const [results, setResults] = createSignal<T[]>([]);

  let index: FlexSearch.Index;

  onMount(() => {
    index = new FlexSearch.Index({ tokenize: 'forward' });

    data.forEach((_data, i) => {
      const content = options.indexer(_data);
      index.add(i, content);
    });
  });

  const onSearch = (value: string) => {
    updateQuery(value);
    if (!index) return;
    const match = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const indexResults = index.search(match);
    const results = indexResults.map((i) => data[i as number]);
    setResults(results);
  };

  return {
    /** The Input Query State. */
    query,
    /** Something you can pass to `onInput` prop very easily since it's already typed. */
    onSearch,
    /** The result from document.search() with flexsearch. */
    results,
  };
};
