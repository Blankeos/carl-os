import { ParsedProblem } from '@/utils/parse-mathproblem';
import { mergeProps, Show, VoidProps } from 'solid-js';

type ProblemRendererProps = {
  parsedProblem: ParsedProblem | null;
};

export default function ProblemRenderer(props: VoidProps<ProblemRendererProps>) {
  const defaultProps = mergeProps({ parsedProblem: null }, props);

  return (
    <Show when={defaultProps.parsedProblem !== null}>
      <div class="animate-fadeIn flex flex-col items-center gap-6 p-2 sm:flex-row">
        <div class="flex w-full flex-col items-center rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-md transition-all hover:shadow-lg sm:w-auto dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
          <div class="mb-2 font-mono text-xl text-slate-800 dark:text-slate-200">
            {defaultProps.parsedProblem?.problem}
          </div>
          <div class="text-sm font-medium text-indigo-500 capitalize dark:text-indigo-400">
            {defaultProps.parsedProblem?.type}
          </div>
        </div>

        <div class="flex items-center py-3">
          <div class="transform animate-pulse text-2xl text-indigo-500 transition-transform dark:text-indigo-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-8 w-8"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </div>

        <div class="flex w-full flex-col items-center rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 shadow-md transition-all hover:shadow-lg sm:w-auto dark:border-indigo-800 dark:from-indigo-900 dark:to-indigo-950">
          <div class="mb-2 font-mono text-xl text-slate-800 dark:text-slate-200">
            {defaultProps.parsedProblem?.result.value}
          </div>
          <div class="text-sm font-medium text-indigo-600 dark:text-indigo-300">
            {defaultProps.parsedProblem?.result.label}
          </div>
        </div>
      </div>
    </Show>
  );
}
