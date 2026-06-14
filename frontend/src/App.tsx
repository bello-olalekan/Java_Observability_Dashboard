import {
  Activity,
  BarChart3,
  Box,
  Cloud,
  Database,
  Gauge,
  GitBranch,
  HardDrive,
  Layers,
  NotebookPen,
  RefreshCcw,
  Server,
  ShieldCheck,
  Zap
} from 'lucide-react';
import type { ReactNode } from 'react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createNote, getHealth, getNotes, putCacheValue } from './api';
import type { Note } from './types';

const metricSeries = [46, 58, 51, 72, 66, 80, 74, 88, 84, 91, 87, 96];

const mockNotes: Note[] = [
  {
    id: 101,
    title: 'EKS release healthy',
    body: 'Deployment java-api rolled out across two pods with readiness probes passing.',
    createdAt: new Date().toISOString()
  },
  {
    id: 100,
    title: 'Cache endpoint connected',
    body: 'ElastiCache Memcached is reachable from the private node group.',
    createdAt: new Date(Date.now() - 1000 * 60 * 44).toISOString()
  }
];

function App() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [apiHealth, setApiHealth] = useState('DEMO');
  const [apiOnline, setApiOnline] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [cacheKey, setCacheKey] = useState('dashboard:last-refresh');
  const [cacheValue, setCacheValue] = useState('green');
  const [notice, setNotice] = useState('Frontend is showing demo data until the Spring Boot API is reachable.');

  const requestRate = useMemo(() => metricSeries.at(-1) ?? 0, []);

  async function refresh() {
    try {
      const [health, latestNotes] = await Promise.all([getHealth(), getNotes()]);
      setApiHealth(health.status);
      setApiOnline(true);
      setNotes(latestNotes.length > 0 ? latestNotes : []);
      setNotice('Connected to the Spring Boot API.');
    } catch {
      setApiHealth('DEMO');
      setApiOnline(false);
      setNotes(mockNotes);
      setNotice('API is not reachable, so the dashboard is using realistic demo data.');
    }
  }

  async function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      return;
    }

    try {
      const note = await createNote(title.trim(), body.trim());
      setNotes((current) => [note, ...current]);
      setNotice('Note created through the Java API.');
    } catch {
      const note: Note = {
        id: Date.now(),
        title: title.trim(),
        body: body.trim(),
        createdAt: new Date().toISOString()
      };
      setNotes((current) => [note, ...current]);
      setNotice('API is offline, so the note was added locally for preview.');
    }

    setTitle('');
    setBody('');
  }

  async function submitCache(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await putCacheValue(cacheKey, cacheValue);
      setNotice(`Stored ${cacheKey} in Memcached through the API.`);
    } catch {
      setNotice('API is offline, so the cache write was only simulated.');
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-mark">
          <Cloud size={24} />
          <span>AWS Java</span>
        </div>
        <nav>
          <a className="active" href="#overview"><Gauge size={18} />Overview</a>
          <a href="#notes"><NotebookPen size={18} />Notes</a>
          <a href="#cache"><Zap size={18} />Cache</a>
          <a href="#infra"><Layers size={18} />Infra</a>
          <a href="#metrics"><BarChart3 size={18} />Metrics</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">EKS production candidate</p>
            <h1>AWS Java Observability Platform</h1>
          </div>
          <button className="icon-button" onClick={refresh} title="Refresh dashboard" type="button">
            <RefreshCcw size={18} />
            Refresh
          </button>
        </header>

        <section className="notice" role="status">
          <ShieldCheck size={18} />
          <span>{notice}</span>
        </section>

        <section className="metric-grid" id="overview">
          <Metric icon={<Activity />} label="API Health" value={apiHealth} tone={apiOnline ? 'green' : 'amber'} />
          <Metric icon={<Server />} label="EKS Pods" value="2 / 2" tone="green" />
          <Metric icon={<Database />} label="RDS p95" value="42 ms" tone="blue" />
          <Metric icon={<HardDrive />} label="Cache Hit Ratio" value="93%" tone="green" />
        </section>

        <section className="content-grid">
          <article className="panel wide" id="metrics">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Prometheus scrape</p>
                <h2>Request Rate</h2>
              </div>
              <strong>{requestRate} rpm</strong>
            </div>
            <div className="chart" aria-label="Request rate chart">
              {metricSeries.map((value, index) => (
                <span key={index} style={{ height: `${value}%` }} />
              ))}
            </div>
            <div className="chart-footer">
              <span>p95 latency 118 ms</span>
              <span>Error rate 0.18%</span>
              <span>Grafana dashboard ready</span>
            </div>
          </article>

          <article className="panel" id="infra">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">AWS services</p>
                <h2>Service Map</h2>
              </div>
              <Box size={22} />
            </div>
            <div className="service-map">
              <ServiceNode icon={<Cloud />} label="EKS" state="Serving API" />
              <ServiceNode icon={<Database />} label="RDS PostgreSQL" state="Private subnet" />
              <ServiceNode icon={<Zap />} label="ElastiCache" state="Memcached" />
              <ServiceNode icon={<BarChart3 />} label="Prometheus" state="Scraping metrics" />
              <ServiceNode icon={<GitBranch />} label="Terraform" state="Managed infra" />
            </div>
          </article>

          <article className="panel" id="notes">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Java API</p>
                <h2>Notes Service</h2>
              </div>
              <NotebookPen size={22} />
            </div>
            <form className="stack-form" onSubmit={submitNote}>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
              <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Operational note" />
              <button type="submit">Create note</button>
            </form>
            <div className="notes-list">
              {notes.map((note) => (
                <section key={note.id} className="note-item">
                  <strong>{note.title}</strong>
                  <p>{note.body}</p>
                </section>
              ))}
            </div>
          </article>

          <article className="panel" id="cache">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">ElastiCache</p>
                <h2>Cache Write</h2>
              </div>
              <Zap size={22} />
            </div>
            <form className="stack-form" onSubmit={submitCache}>
              <input value={cacheKey} onChange={(event) => setCacheKey(event.target.value)} placeholder="Cache key" />
              <input value={cacheValue} onChange={(event) => setCacheValue(event.target.value)} placeholder="Cache value" />
              <button type="submit">Store value</button>
            </form>
            <div className="cache-status">
              <span />
              <div>
                <strong>Memcached endpoint</strong>
                <p>Configured through Helm environment values.</p>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: string }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ServiceNode({ icon, label, state }: { icon: ReactNode; label: string; state: string }) {
  return (
    <section className="service-node">
      <div>{icon}</div>
      <span>{label}</span>
      <small>{state}</small>
    </section>
  );
}

export default App;
