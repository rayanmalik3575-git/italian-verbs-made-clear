import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, type ReactNode } from "react";
import { BookOpen, Check, ChevronRight, Coffee, GraduationCap, Languages, Mic, MessageCircle, RotateCcw, Shuffle, Snail, Sparkles, Train, Users, Volume2, X } from "lucide-react";
import { Chip, IconTile, PageHeader, Panel, btn } from "@/components/app-shell";
import { DAILY_NOUNS, NOUN_DAYS, articleRule, nounsForDay, type DailyNoun } from "@/content/daily-nouns";
import { CHALLENGES, DAILY_VERBS, MATCHES, MISSIONS, type Mission } from "@/content/maestro";
import { VERBS } from "@/data/verbs";
import { grade } from "@/lib/grading";
import { freeCoachPrompts, gradeSentence, hasNegative, usesNoun, whisper, type Feedback, type Whisper } from "@/lib/maestro-engine";
import { listenIt, recognitionSupported, speakIt } from "@/lib/speak";

export const Route = createFileRoute("/maestro")({
  head: () => ({
    meta: [
      { title: "AI Maestro — Daily words, sentence coach & roleplay | Parlami" },
      { name: "description", content: "Daily 10 nouns + 10 verbs, an Italian sentence coach with teacher feedback, and real-life roleplay missions." },
      { property: "og:title", content: "AI Maestro — your daily Italian tutor" },
      { property: "og:description", content: "Learn 10 nouns and 10 verbs a day, translate with teacher feedback, and practise real conversations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MaestroPage,
});

type Tab = "words" | "translate" | "missions";

function Speak({ text }: { text: string }) {
  return (
    <span className="inline-flex shrink-0 gap-1">
      <button type="button" onClick={() => speakIt(text)} aria-label={`Play ${text}`} className="grid h-9 w-9 place-items-center rounded-xl border bg-card text-primary hover:bg-accent"><Volume2 className="h-4 w-4" /></button>
      <button type="button" onClick={() => speakIt(text, true)} aria-label={`Play slowly ${text}`} className="grid h-9 w-9 place-items-center rounded-xl border bg-card text-primary hover:bg-accent"><Snail className="h-4 w-4" /></button>
    </span>
  );
}

function MaestroPage() {
  const [tab, setTab] = useState<Tab>("words");
  const [day, setDay] = useState(1);
  const [shuffled, setShuffled] = useState<DailyNoun[] | null>(null);
  const nouns = shuffled ?? nounsForDay(day);
  const verbDay = shuffled ? 1 + (shuffled[0].dayIndex % 6) : day;
  const verbs = (DAILY_VERBS[verbDay] ?? []).map((v) => VERBS.find((x) => x.infinitive === v)).filter(Boolean) as typeof VERBS;
  const shuffle = () => setShuffled([...DAILY_NOUNS].sort(() => Math.random() - 0.5).slice(0, 10));
  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "words", label: "Today's 10 + 10", icon: BookOpen },
    { id: "translate", label: "Translate & upgrade", icon: Languages },
    { id: "missions", label: "Roleplay missions", icon: MessageCircle },
  ];
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="AI Maestro" description="Ten nouns and ten verbs a day, then use them in real sentences and real conversations." />
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Day">
        {NOUN_DAYS.map((d) => <Chip key={d.day} active={!shuffled && day === d.day} onClick={() => { setShuffled(null); setDay(d.day); }} label={`Day ${d.day}: ${d.en}`}>Day {d.day}</Chip>)}
        <Chip active={!!shuffled} onClick={shuffle}><span className="inline-flex items-center gap-1.5"><Shuffle className="h-3.5 w-3.5" />Shuffle 10</span></Chip>
        <span className="ml-1 text-sm font-semibold text-muted-foreground">{shuffled ? "Mixed from all days" : `${NOUN_DAYS[day - 1].it} · ${NOUN_DAYS[day - 1].en}`}</span>
      </div>
      <div role="tablist" className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border bg-card p-1">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <t.icon className="h-4 w-4 shrink-0" /><span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>
      <div hidden={tab !== "words"}><WordsTab key={nouns.map((n) => n.id).join()} nouns={nouns} verbs={verbs} matchDay={shuffled ? verbDay : day} /></div>
      <div hidden={tab !== "translate"}><TranslateTab key={`t${day}${!!shuffled}`} day={shuffled ? verbDay : day} /></div>
      <div hidden={tab !== "missions"}><MissionsTab nouns={nouns} /></div>
    </div>
  );
}

/* ---------------- Tab 1 ---------------- */
function WordsTab({ nouns, verbs, matchDay }: { nouns: DailyNoun[]; verbs: typeof VERBS; matchDay: number }) {
  return (
    <div className="space-y-5">
      <Panel>
        <div className="mb-4 flex items-center gap-3"><IconTile icon={BookOpen} color="blue" size="sm" /><h2 className="text-lg font-bold">Today's 10 nouns</h2></div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {nouns.map((n) => (
            <li key={n.id} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{n.english}</p>
                  <p className="mt-0.5 text-xl font-bold">{n.fullSingular} <span className="text-base font-semibold text-muted-foreground">→ {n.plural}</span></p>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${n.gender === "m" ? "bg-tile-blue text-tile-blue-ink" : "bg-tile-pink text-tile-pink-ink"}`}>{n.gender === "m" ? "Masc" : "Fem"}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{n.endingHint}</p>
              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2">
                <div><p className="font-semibold">{n.pairedVerbExample.it}</p><p className="text-sm text-muted-foreground">{n.pairedVerbExample.en}</p></div>
                <Speak text={n.pairedVerbExample.it} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel>
        <div className="mb-4 flex items-center gap-3"><IconTile icon={Sparkles} color="lavender" size="sm" /><h2 className="text-lg font-bold">Today's 10 verbs</h2></div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {verbs.map((v) => (
            <li key={v.infinitive} className="flex items-center justify-between rounded-xl border px-3 py-2">
              <span><span className="block font-semibold">{v.infinitive}</span><span className="text-sm text-muted-foreground">{v.english} · {v.forms[0]}, {v.forms[1]}, {v.forms[2]}</span></span>
              <Speak text={v.infinitive} />
            </li>
          ))}
        </ul>
      </Panel>
      <Drill nouns={nouns} matchDay={matchDay} />
    </div>
  );
}

type DrillMode = "article" | "plural" | "match";
function Drill({ nouns, matchDay }: { nouns: DailyNoun[]; matchDay: number }) {
  const [mode, setMode] = useState<DrillMode>("article");
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [done, setDone] = useState<null | boolean | Feedback>(null);
  const items = mode === "article" ? nouns.filter((n) => n.article !== "i") : mode === "plural" ? nouns : MATCHES[matchDay];
  const idx = i % items.length;
  const reset = (m?: DrillMode) => { if (m) { setMode(m); setI(0); } setPick(null); setText(""); setDone(null); };
  const next = () => { setI((x) => x + 1); reset(); };
  const n = mode !== "match" ? (items[idx] as DailyNoun) : null;
  const m = mode === "match" ? MATCHES[matchDay][idx] : null;
  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><IconTile icon={GraduationCap} color="green" size="sm" /><h2 className="text-lg font-bold">Quick drill</h2></div>
        <div className="flex gap-1.5">
          <Chip active={mode === "article"} onClick={() => reset("article")}>Article</Chip>
          <Chip active={mode === "plural"} onClick={() => reset("plural")}>Plural</Chip>
          <Chip active={mode === "match"} onClick={() => reset("match")}>Verb + noun</Chip>
        </div>
      </div>
      <p className="mb-2 text-sm font-semibold text-muted-foreground">{idx + 1} of {items.length}</p>
      {mode === "article" && n && (
        <div>
          <p className="text-2xl font-bold">___ {n.singular}</p>
          <p className="text-muted-foreground">{n.english}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["il", "lo", "la", "l'"].map((a) => {
              const right = a === n.article; const chosen = pick === a;
              return <button key={a} disabled={!!pick} onClick={() => { setPick(a); speakIt(n.fullSingular); }}
                className={`min-h-12 min-w-16 rounded-xl border px-4 text-lg font-bold ${pick && right ? "border-success bg-success/10 text-success" : chosen ? "border-destructive bg-destructive/10 text-destructive" : "bg-card hover:bg-muted"}`}>{a}</button>;
            })}
          </div>
          {pick && <Result ok={pick === n.article} line={`${n.fullSingular} — ${articleRule(n)}`} />}
        </div>
      )}
      {mode === "plural" && n && (
        <form onSubmit={(e) => { e.preventDefault(); if (done === null) { setDone(grade(text, n.plural) !== "incorrect"); speakIt(n.plural); } }}>
          <p className="text-2xl font-bold">{n.fullSingular} <ChevronRight className="inline h-5 w-5 text-muted-foreground" /> ?</p>
          <p className="text-muted-foreground">{n.english} — write the plural with its article</p>
          <input value={text} onChange={(e) => setText(e.target.value)} disabled={done !== null} aria-label="Plural" placeholder="article + plural" className="mt-4 h-12 w-full max-w-sm rounded-xl border bg-card px-4 text-lg" />
          {done === null ? <button className={`${btn.primary} ml-0 mt-3 sm:ml-2`} disabled={!text.trim()}>Check</button> : <Result ok={done === true} line={`${n.plural} — ${n.endingHint}`} />}
        </form>
      )}
      {mode === "match" && m && (
        <form onSubmit={(e) => { e.preventDefault(); if (done === null) { setDone(gradeSentence(text, [m.it])); speakIt(m.it); } }}>
          <p className="text-xl font-bold">{m.en}</p>
          <p className="text-muted-foreground">Use today's verb + the right article + the noun</p>
          <input value={text} onChange={(e) => setText(e.target.value)} disabled={done !== null} aria-label="Italian" placeholder="Scrivi in italiano" className="mt-4 h-12 w-full rounded-xl border bg-card px-4 text-lg" />
          {done === null ? <button className={`${btn.primary} mt-3`} disabled={!text.trim()}>Check</button> : typeof done === "object" && <FeedbackCard f={done} />}
        </form>
      )}
      {(pick || done !== null) && <button onClick={next} className={`${btn.outline} mt-4`}>Next <ChevronRight className="h-4 w-4" /></button>}
    </Panel>
  );
}

function Result({ ok, line }: { ok: boolean; line: string }) {
  return (
    <div className={`mt-4 flex items-start gap-2 rounded-xl border px-4 py-3 ${ok ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
      {ok ? <Check className="mt-0.5 h-5 w-5 text-success" /> : <X className="mt-0.5 h-5 w-5 text-destructive" />}
      <p><span className="font-semibold">{ok ? "Right." : "Not quite."}</span> {line}</p>
    </div>
  );
}

/* ---------------- Tab 2 ---------------- */
const VERDICT = {
  perfect: { label: "Perfect", cls: "bg-success/10 text-success border-success/40" },
  almost: { label: "Almost there · 1 small fix", cls: "bg-tile-amber text-tile-amber-ink border-transparent" },
  backbone: { label: "Let's fix the backbone", cls: "bg-destructive/10 text-destructive border-destructive/40" },
};
function FeedbackCard({ f }: { f: Feedback }) {
  return (
    <div className="mt-4 space-y-3 rounded-2xl border p-4">
      <span className={`inline-block rounded-lg border px-2.5 py-1 text-sm font-bold ${VERDICT[f.verdict].cls}`}>{VERDICT[f.verdict].label}</span>
      <p className="flex flex-wrap gap-1.5" aria-label="Your words">
        {f.tokens.map((t, i) => <span key={i} className={`rounded-md px-1.5 py-0.5 font-semibold ${t.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive line-through decoration-1"}`}>{t.word}</span>)}
      </p>
      {f.issues.length > 0 && <ul className="space-y-1">{f.issues.map((x, i) => <li key={i} className="text-[15px]"><span className="font-semibold">Fix:</span> {x.text}</li>)}</ul>}
      {f.verdict !== "perfect" && <p className="text-[15px] text-muted-foreground"><span className="font-semibold text-foreground">Why: </span>{f.rule}</p>}
      <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2">
        <p><span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">Native version</span><span className="text-lg font-semibold">{f.native}</span></p>
        <Speak text={f.native} />
      </div>
    </div>
  );
}

function MicButton({ onText }: { onText: (t: string) => void }) {
  const [ok, setOk] = useState(false); const [on, setOn] = useState(false);
  useEffect(() => setOk(recognitionSupported()), []);
  if (!ok) return null;
  return <button type="button" aria-label="Speak your answer" aria-pressed={on} onClick={() => { setOn(true); listenIt(onText, () => setOn(false)); }}
    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card text-primary hover:bg-accent"}`}><Mic className="h-5 w-5" /></button>;
}

function TranslateTab({ day }: { day: number }) {
  const list = CHALLENGES[day];
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [fb, setFb] = useState<Feedback | null>(null);
  const c = list[i];
  const submit = () => { const f = gradeSentence(text, c.it); setFb(f); speakIt(f.native); };
  return (
    <Panel>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {list.map((x, k) => <Chip key={k} active={k === i} onClick={() => { setI(k); setText(""); setFb(null); }}>{k + 1}. {x.kind}</Chip>)}
      </div>
      <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Say it in Italian</p>
      <p className="mt-1 text-2xl font-bold">{c.en}</p>
      <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) submit(); }}>
        <input value={text} onChange={(e) => { setText(e.target.value); setFb(null); }} aria-label="Your Italian" placeholder="Scrivi o parla…" className="h-12 min-w-0 flex-1 rounded-xl border bg-card px-4 text-lg" />
        <MicButton onText={setText} />
        <button className={btn.primary} disabled={!text.trim()}>Check</button>
      </form>
      {fb && <FeedbackCard f={fb} />}
      {fb && i < list.length - 1 && <button onClick={() => { setI(i + 1); setText(""); setFb(null); }} className={`${btn.outline} mt-4`}>Next challenge <ChevronRight className="h-4 w-4" /></button>}
    </Panel>
  );
}

/* ---------------- Tab 3 ---------------- */
type Msg = { from: "tutor"; it: string; en: string; whisper?: Whisper } | { from: "you"; text: string };
const ICONS: Record<string, typeof Coffee> = { bar: Coffee, stazione: Train, piacere: Users, free: GraduationCap };

function MissionsTab({ nouns }: { nouns: DailyNoun[] }) {
  const [id, setId] = useState<string | null>(null);
  const base = MISSIONS.find((m) => m.id === id);
  const mission = useMemo<Mission | undefined>(() => {
    if (!base || base.id !== "free") return base;
    const p = freeCoachPrompts(nouns);
    const hints = nouns.slice(0, 3).map((n) => n.fullSingular);
    return { ...base, steps: [{ ...p[0], goal: "n1", hints }, { ...p[1], goal: "n2", hints: nouns.slice(3, 6).map((n) => n.indefinite) }, { ...p[2], goal: "neg", hints: ["Non bevo…", "Non prendo mai…", "Non ho…"] }] };
  }, [base, nouns]);
  if (!mission) {
    return (
      <ul className="grid gap-3 sm:grid-cols-2">
        {MISSIONS.map((m) => (
          <li key={m.id}><button onClick={() => setId(m.id)} className="flex w-full items-start gap-3 rounded-[20px] border bg-card p-5 text-left shadow-card hover:border-primary/40">
            <IconTile icon={ICONS[m.id]} color={m.id === "free" ? "lavender" : "blue"} />
            <span><span className="block text-lg font-bold">{m.title}</span><span className="text-sm text-muted-foreground">{m.place}</span>
              <span className="mt-2 block text-sm">{m.goals.map((g) => g.label).join(" · ")}</span></span>
          </button></li>
        ))}
      </ul>
    );
  }
  return <Chat key={mission.id} mission={mission} nouns={nouns} onExit={() => setId(null)} />;
}

function Chat({ mission, nouns, onExit }: { mission: Mission; nouns: DailyNoun[]; onExit: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "tutor", it: mission.steps[0].it, en: mission.steps[0].en }]);
  const [text, setText] = useState("");
  useEffect(() => { speakIt(mission.steps[0].it); }, [mission]);
  const finished = step >= mission.steps.length;
  const cur = mission.steps[Math.min(step, mission.steps.length - 1)];
  const meets = (t: string) => {
    if (mission.id === "free") return cur.goal === "neg" ? hasNegative(t) : usesNoun(t, nouns, cur.goal === "n2");
    return cur.expect ? cur.expect.test(t.trim()) : true;
  };
  const send = (t: string) => {
    if (!t.trim() || finished) return;
    const w = whisper(t); const ok = meets(t);
    const nextStep = ok ? step + 1 : step;
    const reply = ok ? (mission.steps[nextStep] ?? mission.close) : (cur.retry ?? { it: "Prova ancora con una frase intera.", en: "Try again with a full sentence." });
    setMsgs((m) => [...m, { from: "you", text: t }, { from: "tutor", it: reply.it, en: reply.en, whisper: w }]);
    if (ok && cur.goal) setDone((d) => [...d, cur.goal!]);
    setStep(nextStep); setText(""); speakIt(reply.it);
  };
  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="text-lg font-bold">{mission.title}</h2><p className="text-sm text-muted-foreground">{mission.place}</p></div>
        <button onClick={onExit} className={btn.ghost}><RotateCcw className="h-4 w-4" />All missions</button>
      </div>
      <ul className="mb-4 grid gap-2 sm:grid-cols-3" aria-label="Mission checklist">
        {mission.goals.map((g) => { const ok = done.includes(g.id); return (
          <li key={g.id} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${ok ? "border-success/40 bg-success/5 text-success" : "text-muted-foreground"}`}>
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${ok ? "border-success bg-success text-primary-foreground" : ""}`}>{ok && <Check className="h-3 w-3" />}</span>{g.label}
          </li>); })}
      </ul>
      <div className="space-y-3">
        {msgs.map((m, k) => m.from === "you"
          ? <div key={k} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground w-fit">{m.text}</div>
          : <TutorBubble key={k} m={m} />)}
      </div>
      {finished ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-success/40 bg-success/5 px-4 py-3">
          <Check className="h-5 w-5 text-success" /><p className="font-semibold">Mission complete.</p>
          <button onClick={onExit} className={`${btn.outline} ml-auto`}>Choose another</button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">{cur.hints.map((h) => <button key={h} onClick={() => setText((t) => (t ? t + " " : "") + h.replace(/…$/, ""))} className="rounded-full border bg-card px-3 py-1.5 text-sm font-semibold text-primary hover:bg-accent">{h}</button>)}</div>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(text); }}>
            <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Your reply in Italian" placeholder="Rispondi in italiano…" className="h-12 min-w-0 flex-1 rounded-xl border bg-card px-4 text-lg" />
            <MicButton onText={setText} />
            <button className={btn.primary} disabled={!text.trim()}>Send</button>
          </form>
        </>
      )}
    </Panel>
  );
}

function TutorBubble({ m }: { m: Extract<Msg, { from: "tutor" }> }) {
  const [en, setEn] = useState(false);
  return (
    <div className="max-w-[90%] space-y-2">
      {m.whisper && <Whisp w={m.whisper} />}
      <div className="rounded-2xl rounded-bl-md border bg-card px-4 py-3">
        <div className="flex items-start justify-between gap-3"><p className="text-lg font-semibold">{m.it}</p><Speak text={m.it} /></div>
        <button onClick={() => setEn((x) => !x)} className="mt-1 text-sm font-semibold text-primary">{en ? "Hide English" : "Show English"}</button>
        {en && <p className="text-[15px] text-muted-foreground">{m.en}</p>}
      </div>
    </div>
  );
}
function Whisp({ w }: { w: Whisper }): ReactNode {
  return (
    <div className={`rounded-xl px-3 py-2 text-[15px] ${w.tone === "praise" ? "bg-tile-green text-tile-green-ink" : "bg-tile-amber text-tile-amber-ink"}`}>
      <span className="font-bold">Maestro whisper · </span>{w.text}
    </div>
  );
}
