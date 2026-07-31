import { useMemo, useState } from 'react';

export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}

const LEVEL_GAP = 76;
const H_GAP = 44;
const NODE_H = 38;
const PADDING = 24;

const PALETTE = ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6'];

function nodeWidth(label: string) {
  const w = Math.ceil(label.length * 7.3) + 30;
  return Math.min(Math.max(w, 76), 250);
}

function truncate(label: string, width: number) {
  const maxChars = Math.floor((width - 30) / 7.3);
  if (label.length <= maxChars) return label;
  return label.slice(0, Math.max(1, maxChars - 1)) + '…';
}

interface Placed {
  path: string;
  label: string;
  x: number;
  y: number;
  width: number;
  hasChildren: boolean;
  collapsed: boolean;
}

function measure(n: MindMapNode, path: string, collapsed: Set<string>): { width: number; depth: number } {
  const w = nodeWidth(n.label);
  if (collapsed.has(path) || !n.children || n.children.length === 0) {
    return { width: w, depth: 1 };
  }
  let width = 0;
  let depth = 0;
  n.children.forEach((child, i) => {
    const m = measure(child, `${path}.${i}`, collapsed);
    width += m.width;
    depth = Math.max(depth, m.depth);
  });
  width += (n.children.length - 1) * H_GAP;
  return { width, depth: depth + 1 };
}

export default function MindMapViewer({ rootLabel, nodes }: { rootLabel: string; nodes: MindMapNode[] }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const layout = useMemo(() => {
    const placed: Placed[] = [];
    const root = { label: rootLabel, children: nodes } as MindMapNode;
    const total = measure(root, 'root', collapsed);

    const place = (list: MindMapNode[], basePath: string, cx: number, y: number) => {
      let cursor = cx;
      list.forEach((child, i) => {
        const path = `${basePath}.${i}`;
        const m = measure(child, path, collapsed);
        const x = cursor + m.width / 2;
        placed.push({
          path,
          label: child.label,
          x,
          y,
          width: m.width,
          hasChildren: !!child.children && child.children.length > 0,
          collapsed: collapsed.has(path),
        });
        if (!collapsed.has(path) && child.children && child.children.length > 0) {
          place(child.children, path, x, y + LEVEL_GAP);
        }
        cursor += m.width + H_GAP;
      });
    };

    place(nodes, 'root', 0, LEVEL_GAP);

    const width = Math.max(total.width, 560) + PADDING * 2;
    const height = (total.depth - 1) * LEVEL_GAP + NODE_H + PADDING * 2;

    const byPath = new Map<string, { x: number; y: number; width: number }>();
    byPath.set('root', { x: total.width / 2 + PADDING, y: 0 + PADDING, width: nodeWidth(rootLabel) });
    placed.forEach((p) => byPath.set(p.path, { x: p.x + PADDING, y: p.y + PADDING, width: p.width }));

    const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (const p of placed) {
      const parentPath = p.path.slice(0, p.path.lastIndexOf('.'));
      const parent = byPath.get(parentPath);
      if (!parent) continue;
      const sx = parent.x + parent.width / 2;
      const sy = parent.y + NODE_H / 2;
      const ex = p.x - p.width / 2 + PADDING;
      const ey = p.y + NODE_H / 2;
      edges.push({ x1: sx, y1: sy, x2: ex, y2: ey });
    }

    return { placed: placed.map((p) => ({ ...p, x: p.x + PADDING, y: p.y + PADDING })), width, height, edges, root: { x: total.width / 2 + PADDING, y: PADDING } };
  }, [rootLabel, nodes, collapsed]);

  const rootW = nodeWidth(rootLabel);
  const rootLabelShort = truncate(rootLabel, rootW);

  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
      <svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
          </marker>
        </defs>

        {layout.edges.map((e, i) => (
          <path
            key={i}
            d={`M${e.x1},${e.y1} C${e.x1 + 24},${e.y1} ${e.x2 - 24},${e.y2} ${e.x2},${e.y2}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={1.5}
            markerEnd="url(#arrowhead)"
          />
        ))}

        <g onClick={() => toggle('root')} className="cursor-pointer">
          <rect
            x={layout.root.x - rootW / 2}
            y={layout.root.y}
            width={rootW}
            height={NODE_H}
            rx={12}
            fill={PALETTE[0]}
          />
          <text x={layout.root.x} y={layout.root.y + NODE_H / 2 + 4} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>
            {rootLabelShort}
          </text>
        </g>

        {layout.placed.map((p) => {
          const depth = p.path.split('.').filter(Boolean).length;
          const color = PALETTE[(depth - 1) % PALETTE.length];
          const short = truncate(p.label, p.width);
          return (
            <g key={p.path} onClick={() => p.hasChildren && toggle(p.path)} className={p.hasChildren ? 'cursor-pointer' : ''}>
              <rect x={p.x - p.width / 2} y={p.y} width={p.width} height={NODE_H} rx={10} fill={color} opacity={p.collapsed ? 0.7 : 1} />
              <text x={p.x} y={p.y + NODE_H / 2 + 4} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={500}>
                {short}
              </text>
              {p.hasChildren && (
                <text x={p.x + p.width / 2 - 8} y={p.y + NODE_H / 2 + 4} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
                  {p.collapsed ? '+' : '−'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
