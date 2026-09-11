export type JobStatus = 'pending' | 'running' | 'success' | 'failed';

export type JobType =
  | 'reorder-plan'
  | 'inventory-export'
  | 'supplier-export';

export type DemoJob = {
  id: string;
  type: JobType;
  title: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  finishedAt?: string;
  message?: string;
  fileId?: string;
};

export type DemoFile = {
  id: string;
  name: string;
  module: JobType;
  sizeLabel: string;
  createdAt: string;
  remark?: string;
  rows?: Record<string, unknown>[];
};

const STORAGE_KEY = 'zavashop-scm-demo-v1';

type StoreState = {
  jobs: DemoJob[];
  files: DemoFile[];
};

type Listener = () => void;
const listeners = new Set<Listener>();

function now() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function load(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoreState;
  } catch {
    // ignore
  }
  return { jobs: [], files: [] };
}

let state: StoreState =
  typeof window === 'undefined' ? { jobs: [], files: [] } : load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStore() {
  return state;
}

export function startAnalysisJob(input: {
  type: JobType;
  title: string;
  fileName: string;
  remark?: string;
  rows?: Record<string, unknown>[];
}) {
  const jobId = uid('job');
  const createdAt = now();
  const job: DemoJob = {
    id: jobId,
    type: input.type,
    title: input.title,
    status: 'pending',
    progress: 0,
    createdAt,
    message: 'Queued…',
  };
  state = { ...state, jobs: [job, ...state.jobs] };
  persist();

  window.setTimeout(() => {
    state = {
      ...state,
      jobs: state.jobs.map((j) =>
        j.id === jobId
          ? { ...j, status: 'running', progress: 40, message: 'Running…' }
          : j,
      ),
    };
    persist();
  }, 500);

  window.setTimeout(() => {
    const fileId = uid('file');
    const file: DemoFile = {
      id: fileId,
      name: input.fileName,
      module: input.type,
      sizeLabel: `${(12 + Math.random() * 20).toFixed(2)} KB`,
      createdAt: now(),
      remark: input.remark,
      rows: input.rows,
    };
    state = {
      ...state,
      files: [file, ...state.files],
      jobs: state.jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'success',
              progress: 100,
              finishedAt: now(),
              message: 'Done — result file ready',
              fileId,
            }
          : j,
      ),
    };
    persist();
  }, 1800);

  return jobId;
}
