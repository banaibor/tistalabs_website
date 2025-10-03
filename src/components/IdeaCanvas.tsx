import { useMemo, useState } from 'react';

type Props = {
  suggestions?: string[];
};

type LaneId = 'Backlog' | 'Now' | 'Next';

const IdeaCanvas = ({ suggestions = [] }: Props) => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [lanesEnabled, setLanesEnabled] = useState(false);
  const [lanes, setLanes] = useState<Record<LaneId, string[]>>({ Backlog: [], Now: [], Next: [] });
  const [dragOver, setDragOver] = useState<{ lane: LaneId | null; index: number | null }>({ lane: null, index: null });

  // Ensure existing ideas move to Backlog if lanes are turned on
  useMemo(() => {
    if (lanesEnabled && ideas.length) {
      setLanes(prev => ({ ...prev, Backlog: [...prev.Backlog, ...ideas] }));
      setIdeas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lanesEnabled]);

  const addIdea = (v: string) => {
    if (!v.trim()) return;
    if (lanesEnabled) setLanes(prev => ({ ...prev, Backlog: [...prev.Backlog, v.trim()] }));
    else setIdeas(prev => [...prev, v.trim()]);
    setText('');
  };

  const moveNote = (fromLane: LaneId, fromIndex: number, toLane: LaneId, toIndex?: number) => {
    setLanes(prev => {
      const copy: Record<LaneId, string[]> = { Backlog: [...prev.Backlog], Now: [...prev.Now], Next: [...prev.Next] };
      const [item] = copy[fromLane].splice(fromIndex, 1);
      if (item == null) return prev;
      const insertAt = toIndex == null ? copy[toLane].length : Math.max(0, Math.min(copy[toLane].length, toIndex));
      copy[toLane].splice(insertAt, 0, item);
      return copy;
    });
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, lane: LaneId, index: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ lane, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnNote = (e: React.DragEvent<HTMLDivElement>, lane: LaneId, index: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    try {
      const { lane: fromLane, index: fromIndex } = JSON.parse(data) as { lane: LaneId; index: number };
      moveNote(fromLane, fromIndex, lane, index);
    } catch {}
    setDragOver({ lane: null, index: null });
  };

  const handleDropOnLaneEnd = (e: React.DragEvent<HTMLDivElement>, lane: LaneId) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    try {
      const { lane: fromLane, index: fromIndex } = JSON.parse(data) as { lane: LaneId; index: number };
      moveNote(fromLane, fromIndex, lane);
    } catch {}
    setDragOver({ lane: null, index: null });
  };

  return (
    <div className="idea-canvas">
      <div className="canvas-header">
        <h3>Idea Canvas</h3>
        <p>Capture seeds for your project. We’ll turn these into a rapid prototype.</p>
      </div>
      <div className="canvas-input">
        <input
          type="text"
          placeholder="Add an idea (e.g., onboarding flow, dashboard widget, KPI)"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addIdea(text)}
        />
        <button onClick={() => addIdea(text)}>Add</button>
      </div>
      <div className="canvas-toggles">
        <label className="toggle">
          <input type="checkbox" checked={lanesEnabled} onChange={e => setLanesEnabled(e.target.checked)} />
          <span>Snap into lanes (Backlog / Now / Next)</span>
        </label>
      </div>
      {!!suggestions.length && (
        <div className="canvas-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="chip" onClick={() => addIdea(s)}>{s}</button>
          ))}
        </div>
      )}
      {!lanesEnabled ? (
        <div className="canvas-board">
          {ideas.length === 0 ? (
            <div className="empty">Your ideas will appear here.</div>
          ) : (
            ideas.map((i, idx) => (
              <div className="note" key={idx}>
                <span>{i}</span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="lanes">
          {(Object.keys(lanes) as LaneId[]).map((lane) => (
            <div
              key={lane}
              className={`lane${dragOver.lane === lane ? ' drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver({ lane, index: null }); }}
              onDrop={(e) => handleDropOnLaneEnd(e, lane)}
            >
              <div className="lane-header">
                <h4>{lane}</h4>
              </div>
              <div className="lane-notes">
                {lanes[lane].length === 0 && (
                  <div className="empty">Drop ideas here</div>
                )}
                {lanes[lane].map((i, idx) => (
                  <div
                    className="note"
                    key={`${lane}-${idx}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, lane, idx)}
                    onDragOver={(e) => { e.preventDefault(); setDragOver({ lane, index: idx }); }}
                    onDrop={(e) => handleDropOnNote(e, lane, idx)}
                  >
                    <span>{i}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaCanvas;
