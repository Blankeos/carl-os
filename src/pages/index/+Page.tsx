import { useFlexSearch } from '@/hooks/use-flex-search';
import { Tippy } from '@/lib/solid-tippy';
import getTitle from '@/utils/get-title';
import { useHotkeys, useOs } from 'bagon-hooks';
import { For, createEffect, createMemo, createSignal } from 'solid-js';
import { useMetadata } from 'vike-metadata-solid';

export default function Page() {
  useMetadata({
    title: getTitle('Home'),
  });

  const os = useOs();

  let searchRef!: HTMLInputElement;

  const [searchQuery, setSearchQuery] = createSignal('');
  const [darkMode, setDarkMode] = createSignal(false);

  function focusSearch() {
    searchRef.focus();
  }
  useHotkeys([
    ['mod+k', focusSearch],
    ['/', focusSearch],
  ]);

  // Initialize dark mode based on system preference
  createEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    updateTheme(prefersDark);
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode();
    setDarkMode(newMode);
    updateTheme(newMode);
  };

  // Update theme on document
  const updateTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const apps = [
    // {
    //   name: 'Calendar',
    //   icon: '📅',
    //   category: 'Productivity',
    //   tags: ['planning', 'schedule', 'events'],
    //   description: 'Keep track of your schedule and important dates',
    // },
    // {
    //   name: 'Notes',
    //   icon: '📝',
    //   category: 'Productivity',
    //   tags: ['writing', 'documents', 'text'],
    //   description: 'Take and organize your notes and documents',
    // },
    {
      name: 'Domainify IP',
      icon: '🧮',
      category: 'Tools',
      tags: [],
      description: 'Domain-ifies an IP address using traefik and nipio.',
      onClick() {
        window.open('https://');
      },
    },
    // {
    //   name: 'Games',
    //   icon: '🎮',
    //   category: 'Entertainment',
    //   tags: ['fun', 'play', 'recreation'],
    //   description: 'Play various games and have fun',
    // },
    {
      name: 'Sprite Slicer',
      icon: '🔪',
      category: 'Tools',
      tags: ['fun', 'games', 'gamedev'],
      description: 'Fully-featured sprite atlas slicer!',
      onClick() {
        window.open('https://sprite-slicer.pages.dev', '_blank');
      },
    },
    {
      name: 'Car Financing Calculator',
      icon: '🚙',
      category: 'Tools',
      tags: ['cars'],
      description: 'Calculate how to finance a car based on deals you see.',
      onClick() {
        window.open('https://car-financing-calculator.pages.dev/', '_blank');
      },
    },
    {
      name: 'VSCode to Zed Snippets',
      icon: '✂️',
      category: 'Tools',
      tags: ['cars'],
      description: 'Convert VSCode Snippets to Zed.',
      onClick() {
        window.open('https://vscode-to-zed-snippets.pages.dev/', '_blank');
      },
    },
  ];

  const { query, onSearch, results } = useFlexSearch(apps, {
    indexer: (app) => `${app.name} | ${app.tags} | ${app.category}`,
  });

  const categories = createMemo(() => {
    let source = apps;
    if (query()) {
      if (results().length > 0) {
        source = results();
      } else {
        return [];
      }
    }
    const categoryNames = [...new Set(source.map((app) => app.category))];

    return categoryNames.map((categoryName) => ({
      category: categoryName,
      results: source.filter((app) => app.category === categoryName),
    }));
  });

  return (
    <div class="dark:bg-gray-900">
      <div class="mx-auto min-h-screen max-w-7xl p-8 transition-colors duration-200">
        <div class="mb-12 flex flex-col items-center">
          <div class="mb-4 flex w-full justify-end">
            <button
              onClick={toggleDarkMode}
              class="rounded-lg bg-gray-200 p-2 text-gray-700 transition-colors dark:bg-gray-700 dark:text-gray-200"
              aria-label="Toggle dark mode"
            >
              {darkMode() ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clip-rule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          <h1 class="mb-1 text-4xl font-bold text-gray-800 dark:text-gray-100">Tools</h1>
          <p class="mb-4 max-w-md text-center text-sm text-gray-600 dark:text-gray-300">
            Bunch of tools{' '}
            <a href="https://carlo.vercel.app" class="font-bold text-blue-500" target="_blank">
              Carlo
            </a>{' '}
            uses to be EXTREMELY productive.
          </p>
          <div class="relative w-full max-w-2xl">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search whatever, you'll get it..."
              class="w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-blue-700"
              onInput={(e) => onSearch(e.currentTarget.value)}
              value={searchQuery()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                  searchRef.value = '';
                  searchRef.blur();
                  onSearch('');
                }
              }}
            />
            <div class="absolute top-1/2 right-3 -translate-y-1/2 rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
              {os() === 'macos' ? '⌘K' : 'Ctrl+K'}
            </div>
          </div>
        </div>

        <div class="gap-y-12 text-neutral-400">
          <For
            each={categories()}
            fallback={
              <div class="col-span-full flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                No results found.
              </div>
            }
          >
            {(category) => {
              return (
                <div class="space-y-6">
                  <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    {category.category}
                  </h2>
                  <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    <For
                      each={category.results}
                      fallback={
                        <div class="col-span-full flex items-center justify-center p-4 text-gray-500 dark:text-gray-400">
                          No apps under this category.
                        </div>
                      }
                    >
                      {(app) => (
                        <Tippy content={app.description} props={{ placement: 'bottom' }}>
                          <button
                            onClick={app.onClick}
                            class="flex cursor-pointer flex-col items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition transition-all duration-200 hover:border-blue-200 hover:shadow-md active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700"
                            data-tags={app.tags.join(' ')}
                          >
                            <span class="mb-2 text-3xl">{app.icon}</span>
                            <span class="text-xs font-medium text-gray-700 dark:text-gray-200">
                              {app.name}
                            </span>
                          </button>
                        </Tippy>
                      )}
                    </For>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
