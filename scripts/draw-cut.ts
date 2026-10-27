#!/usr/bin/env bun
/**
 * draw-cut.ts — draws the file cut's figure by hand, and writes it into
 * the drawing's three copies: the rig (assets/cuts/neckass.svg), the
 * front page's inlined copy (index.html) and the card's flattened copy
 * (functions/lib/cut.mjs).
 *
 * The figure is set down here as plain geometry: a capsule round on each
 * pair of pivots, a spline through a few points for everything else, and
 * a corner wherever a pen would turn. The hand then draws it: each line is
 * resampled, bowed a little off true by a slow wobble, and written as
 * quadratic curves. The wobble comes from a seed per part, so the drawing
 * is the same every time it is drawn, and redrawing one part leaves the
 * others as they were.
 *
 * Only the man and what he holds are drawn here. The scenery is kept in
 * the three files as it is.
 *
 * Usage: bun run cut:draw
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname ?? __dirname, '..');

type Pt = [number, number];
// A spline node; a third element makes it a corner, where the pen turns.
type Node = [number, number] | [number, number, true];
type Line = { nodes: Node[]; closed: boolean };
type Run = { name: string; line: Line };
// One quadratic curve of a drawn line, in absolute coordinates.
type Seg = { from: Pt; ctrl: Pt; to: Pt };
type Stroke = { d: string; segs: Seg[]; closed: boolean };
type Ink = 'part' | 'solid' | 'outline' | 'body' | 'detail' | 'hatch';
type Shape = {
    ink: Ink;
    name: string;
    lines?: Line[];
    // Or one line drawn as named stretches, which another shape can share
    // stroke for stroke.
    runs?: Run[];
    closed?: boolean;
    circle?: [number, number, number];
    // A class besides the ink, for the motion to find it by.
    tag?: string;
};
type Joint =
    | 'tilt'
    | 'lean'
    | 'armNear'
    | 'forearmNear'
    | 'handNear'
    | 'armFar'
    | 'forearmFar'
    | 'handFar'
    | 'legNear'
    | 'legFar';
type Held = 'phone' | 'cup' | 'hat';
type Group = { joint?: Joint; tag?: string; note?: string; items: Item[] };
type Item = Shape | Group | { held: Held };

// ---------------------------------------------------------------------
// The hand.

function seeded(name: string): () => number {
    let seed = 2166136261;
    for (const char of name)
        seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const len = (a: Pt): number => Math.hypot(a[0], a[1]);
const dist = (a: Pt, b: Pt): number => len(sub(a, b));
const unit = (a: Pt): Pt => mul(a, 1 / (len(a) || 1));
const turn = (a: Pt, b: Pt): number =>
    Math.abs(Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]));

// Centripetal Catmull-Rom from p1 to p2, p2 left out.
function segment(p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt[] {
    const knot = (a: Pt, b: Pt) => Math.max(Math.sqrt(dist(a, b)), 1e-4);
    const t1 = knot(p0, p1);
    const t2 = t1 + knot(p1, p2);
    const t3 = t2 + knot(p2, p3);
    const lerp = (a: Pt, b: Pt, ta: number, tb: number, t: number) =>
        add(mul(a, (tb - t) / (tb - ta)), mul(b, (t - ta) / (tb - ta)));
    const steps = Math.max(2, Math.ceil(dist(p1, p2) / 0.6));
    const out: Pt[] = [];
    for (let i = 0; i < steps; i++) {
        const t = t1 + ((t2 - t1) * i) / steps;
        const a1 = lerp(p0, p1, 0, t1, t);
        const a2 = lerp(p1, p2, t1, t2, t);
        const a3 = lerp(p2, p3, t2, t3, t);
        const b1 = lerp(a1, a2, 0, t2, t);
        const b2 = lerp(a2, a3, t1, t3, t);
        out.push(lerp(b1, b2, t1, t2, t));
    }
    return out;
}

// The nodes from one corner to the next, traced finely.
function traceRun(nodes: Pt[]): Pt[] {
    if (nodes.length === 2) {
        const steps = Math.max(2, Math.ceil(dist(nodes[0], nodes[1]) / 0.6));
        return Array.from({ length: steps }, (_, i) =>
            add(nodes[0], mul(sub(nodes[1], nodes[0]), i / steps)),
        );
    }
    const n = nodes.length;
    const ends: Pt[] = [
        sub(mul(nodes[0], 2), nodes[1]),
        sub(mul(nodes[n - 1], 2), nodes[n - 2]),
    ];
    const all = [ends[0], ...nodes, ends[1]];
    const out: Pt[] = [];
    for (let i = 1; i < all.length - 2; i++) {
        out.push(...segment(all[i - 1], all[i], all[i + 1], all[i + 2]));
    }
    return out;
}

// A line traced finely, with the indices of its corners.
function trace(line: Line): { points: Pt[]; corners: number[] } {
    const nodes = line.nodes;
    const isCorner = (node: Node, i: number) =>
        node.length === 3 ||
        (!line.closed && (i === 0 || i === nodes.length - 1));
    const at = (node: Node): Pt => [node[0], node[1]];
    if (line.closed && !nodes.some((node, i) => isCorner(node, i))) {
        const ring = nodes.map(at);
        const n = ring.length;
        const points: Pt[] = [];
        for (let i = 0; i < n; i++) {
            points.push(
                ...segment(
                    ring[(i - 1 + n) % n],
                    ring[i],
                    ring[(i + 1) % n],
                    ring[(i + 2) % n],
                ),
            );
        }
        return { points, corners: [] };
    }
    let order = nodes.map((node, i) => ({
        p: at(node),
        corner: isCorner(node, i),
    }));
    if (line.closed) {
        const first = order.findIndex((node) => node.corner);
        order = [...order.slice(first), ...order.slice(0, first), order[first]];
    }
    const points: Pt[] = [];
    const corners: number[] = [];
    let start = 0;
    for (let i = 1; i < order.length; i++) {
        if (!order[i].corner) continue;
        corners.push(points.length);
        points.push(
            ...traceRun(order.slice(start, i + 1).map((node) => node.p)),
        );
        start = i;
    }
    if (line.closed) return { points, corners };
    corners.push(points.length);
    points.push(order[order.length - 1].p);
    return { points, corners };
}

const PEN: Record<Ink, { wobble: number; reach: number }> = {
    part: { wobble: 0.55, reach: 12 },
    outline: { wobble: 0.55, reach: 12 },
    body: { wobble: 0.55, reach: 12 },
    solid: { wobble: 0.45, reach: 10 },
    detail: { wobble: 0.4, reach: 9 },
    hatch: { wobble: 0.3, reach: 9 },
};

// Picks the points the pen passes through: one every `reach` along a
// straight, closer together where the line turns.
function stations(points: Pt[], reach: number): number[] {
    const out = [0];
    let along = 0;
    let turned = 0;
    for (let i = 1; i < points.length - 1; i++) {
        along += dist(points[i - 1], points[i]);
        turned += turn(
            sub(points[i], points[i - 1]),
            sub(points[i + 1], points[i]),
        );
        if (along >= reach || (turned >= 0.38 && along >= 1.4)) {
            out.push(i);
            along = 0;
            turned = 0;
        }
    }
    along += dist(points[points.length - 2], points[points.length - 1]);
    if (out.length > 1 && along < reach * 0.3) out.pop();
    out.push(points.length - 1);
    return out;
}

const fmt = (n: number) => {
    const s = (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, '');
    return s === '-0' ? '0' : s;
};

// One line in the hand: its path data. A pinned line keeps its ends
// exactly where they were set, so another can start from them.
function ink(
    line: Line,
    pen: { wobble: number; reach: number },
    rand: () => number,
    pinned = false,
): Stroke {
    const { points, corners } = trace(line);
    let perimeter = 0;
    const along = [0];
    for (let i = 1; i < points.length; i++) {
        perimeter += dist(points[i - 1], points[i]);
        along.push(perimeter);
    }
    const wobble = pen.wobble * Math.min(1, perimeter / 50);
    const waves = [
        { length: 30 + rand() * 18, phase: rand() * Math.PI * 2, weight: 0.62 },
        { length: 11 + rand() * 6, phase: rand() * Math.PI * 2, weight: 0.38 },
    ];
    const swell = (s: number) =>
        waves.reduce(
            (sum, wave) =>
                sum +
                wave.weight *
                    Math.sin((Math.PI * 2 * s) / wave.length + wave.phase),
            0,
        ) * wobble;
    const nudge = (p: Pt, i: number, prev: Pt, next: Pt): Pt => {
        const tangent = unit(sub(next, prev));
        return add(p, mul([-tangent[1], tangent[0]], swell(along[i])));
    };
    const shake = (p: Pt): Pt => [
        p[0] + (rand() - 0.5) * 0.6,
        p[1] + (rand() - 0.5) * 0.6,
    ];

    let cursor: Pt = [0, 0];
    const parts: string[] = [];
    const segs: Seg[] = [];
    const moveTo = (p: Pt) => {
        cursor = [Number(fmt(p[0])), Number(fmt(p[1]))];
        parts.push(`M${fmt(p[0])} ${fmt(p[1])}`);
    };
    const quad = (c: Pt, e: Pt) => {
        const rc: Pt = [Number(fmt(c[0])), Number(fmt(c[1]))];
        const re: Pt = [Number(fmt(e[0])), Number(fmt(e[1]))];
        parts.push(
            `q${fmt(rc[0] - cursor[0])} ${fmt(rc[1] - cursor[1])} ${fmt(re[0] - cursor[0])} ${fmt(re[1] - cursor[1])}`,
        );
        segs.push({ from: cursor, ctrl: rc, to: re });
        cursor = re;
    };

    if (!corners.length) {
        // A closed line with no corner: through the midpoints, all round.
        const ring = [...points, points[0]];
        const picks = stations(ring, pen.reach).slice(0, -1);
        const n = picks.length;
        const ps = picks.map((index) =>
            nudge(
                ring[index],
                index,
                ring[(index - 1 + points.length) % points.length],
                ring[index + 1],
            ),
        );
        moveTo(mid(ps[n - 1], ps[0]));
        for (let i = 0; i < n; i++) quad(ps[i], mid(ps[i], ps[(i + 1) % n]));
        return { d: `${parts.join(' ')} z`, segs, closed: true };
    }

    const loop = line.closed ? [...points, points[0]] : points;
    const ends = line.closed ? [...corners, points.length] : corners;
    const fixed = new Map<number, Pt>();
    const corner = (index: number) => {
        const key = index % points.length;
        const end = !line.closed && (key === 0 || key === points.length - 1);
        if (!fixed.has(key)) {
            fixed.set(key, pinned && end ? points[key] : shake(points[key]));
        }
        return fixed.get(key) as Pt;
    };
    moveTo(corner(ends[0]));
    for (let k = 0; k < ends.length - 1; k++) {
        const stretch = loop.slice(ends[k], ends[k + 1] + 1);
        const picks = stations(stretch, pen.reach);
        const ps = picks.map((index, j) => {
            if (j === 0) return corner(ends[k]);
            if (j === picks.length - 1) return corner(ends[k + 1]);
            return nudge(
                stretch[index],
                ends[k] + index,
                stretch[index - 1],
                stretch[index + 1],
            );
        });
        if (ps.length === 2) {
            // One stroke from corner to corner: a shallow bow.
            const span = dist(ps[0], ps[1]);
            const normal = unit(sub(ps[1], ps[0]));
            const bow = (rand() * 2 - 1) * Math.min(1.1, span * 0.05);
            quad(
                add(mid(ps[0], ps[1]), mul([-normal[1], normal[0]], bow)),
                ps[1],
            );
            continue;
        }
        for (let j = 1; j < ps.length - 1; j++) {
            quad(
                ps[j],
                j === ps.length - 2 ? ps[j + 1] : mid(ps[j], ps[j + 1]),
            );
        }
    }
    const d = line.closed ? `${parts.join(' ')} z` : parts.join(' ');
    return { d, segs, closed: line.closed };
}

const drawn = new Map<string, Stroke[]>();
function stretchOf({ name, line }: Run): Stroke {
    const key = `run:${name}`;
    if (!drawn.has(key)) {
        drawn.set(key, [ink(line, PEN.part, seeded(name), true)]);
    }
    return (drawn.get(key) as Stroke[])[0];
}
function strokesOf(shape: Shape): Stroke[] {
    if (shape.runs) {
        // One line from stretches: each starts where the last one ended,
        // so only its strokes follow the first one's start.
        const runs = shape.runs.map(stretchOf);
        const [x, y] = shape.runs[0].line.nodes[0];
        const strokes = runs.map((run) => run.d.replace(/^M\S+ \S+ /, ''));
        const d = `M${fmt(x)} ${fmt(y)} ${strokes.join(' ')}`;
        return [
            {
                d: shape.closed ? `${d} z` : d,
                segs: runs.flatMap((run) => run.segs),
                closed: Boolean(shape.closed),
            },
        ];
    }
    const key = `shape:${shape.name}`;
    if (!drawn.has(key)) {
        const rand = seeded(shape.name);
        const pen = PEN[shape.ink === 'body' ? 'outline' : shape.ink];
        drawn.set(
            key,
            (shape.lines ?? []).map((line) => ink(line, pen, rand)),
        );
    }
    return drawn.get(key) as Stroke[];
}

// What a marker does that a plotter does not, laid over the line as it was
// drawn, from a seed of its own, so the strokes stay where they are:
// - it overshoots a corner, one line running a hair past the other;
// - it pools where it touches down, and where it lifts off an open line;
// - it presses harder, and the line is heavier, where it turns hardest;
// - it runs dry along a long line, and the paper shows down the middle.
// Only lines a pen draws on their own have them: an outline drawn twice
// for a union, or a solid fill, does not.
const WEIGHT: Partial<Record<Ink, number>> = {
    part: 2.2,
    detail: 1.7,
    hatch: 1.2,
};
type Accidents = { over: string; heavy: string; dry: string };
const accidents = new Map<Shape, Accidents>();
function accidentsOf(shape: Shape): Accidents {
    const cached = accidents.get(shape);
    if (cached) return cached;
    const none = { over: '', heavy: '', dry: '' };
    if (shape.ink === 'body' && SLEEVES.has(shape.name)) {
        const result = sleeveAccidents(shape);
        accidents.set(shape, result);
        return result;
    }
    if (!WEIGHT[shape.ink] || shape.circle) return none;
    const rand = seeded(`${shape.name}/accidents`);
    const at = (p: Pt) => `M${fmt(p[0])} ${fmt(p[1])}`;
    const curve = (seg: Seg) =>
        `Q${fmt(seg.ctrl[0])} ${fmt(seg.ctrl[1])} ${fmt(seg.to[0])} ${fmt(seg.to[1])}`;
    const over: string[] = [];
    const heavy: string[] = [];
    const dry: string[] = [];
    for (const { segs, closed } of strokesOf(shape)) {
        const n = segs.length;
        if (!n) continue;
        const turns = segs.map((seg, i) => {
            const next = segs[(i + 1) % n];
            if (!closed && i === n - 1) return 0;
            return turn(sub(seg.to, seg.ctrl), sub(next.ctrl, next.from));
        });
        const cornered = new Set<number>();
        turns.forEach((angle, i) => {
            if (angle < 0.7) return;
            cornered.add(i);
            cornered.add((i + 1) % n);
            if (rand() > 0.45) return;
            const seg = segs[i];
            const next = segs[(i + 1) % n];
            const reach = 1.1 + rand() * 1.3;
            const tick =
                rand() < 0.5
                    ? mul(unit(sub(seg.to, seg.ctrl)), reach)
                    : mul(unit(sub(next.ctrl, next.from)), -reach);
            over.push(`${at(seg.to)} l${fmt(tick[0])} ${fmt(tick[1])}`);
        });
        const pool = (p: Pt) => `${at(p)} l0.1 0`;
        if (rand() < (closed ? 0.55 : 0.7)) heavy.push(pool(segs[0].from));
        if (!closed && rand() < 0.45) heavy.push(pool(segs[n - 1].to));
        // The hardest smooth turn, and the curves either side of it.
        let hardest = -1;
        turns.forEach((angle, i) => {
            if (angle < 0.7 && (hardest < 0 || angle > turns[hardest]))
                hardest = i;
        });
        if (hardest >= 0 && turns[hardest] > 0.2 && rand() < 0.6) {
            const a = segs[hardest];
            const b = segs[(hardest + 1) % n];
            heavy.push(`${at(a.from)} ${curve(a)} ${curve(b)}`);
        }
        // The longest pair of curves with no corner in it.
        const length = segs.reduce(
            (sum, seg) => sum + dist(seg.from, seg.to),
            0,
        );
        let longest = -1;
        let span = 0;
        for (let i = 0; i < (closed ? n : n - 1); i++) {
            const j = (i + 1) % n;
            if (
                cornered.has(i) ||
                cornered.has(j) ||
                i === hardest ||
                j === hardest
            )
                continue;
            const here =
                dist(segs[i].from, segs[i].to) + dist(segs[j].from, segs[j].to);
            if (here > span) {
                longest = i;
                span = here;
            }
        }
        if (
            shape.ink !== 'hatch' &&
            length > 30 &&
            longest >= 0 &&
            rand() < 0.55
        ) {
            const a = segs[longest];
            const b = segs[(longest + 1) % n];
            dry.push(`${at(a.from)} ${curve(a)} ${curve(b)}`);
        }
    }
    const result = {
        over: over.join(' '),
        heavy: heavy.join(' '),
        dry: dry.join(' '),
    };
    accidents.set(shape, result);
    return result;
}

// A sleeve or a trouser leg is drawn twice, its outline at double weight
// under its fill, so the line that shows is the outer half of that one, and
// a pressed or dry stretch goes there, 1.1 out from the path. Only along the
// long sides: an end of one is inside the next, at the elbow or the seat.
const SLEEVES = new Set([
    'arm-near',
    'arm-far',
    'forearm-near',
    'forearm-far',
    'leg-near',
    'leg-far',
]);
function sleeveAccidents(shape: Shape): Accidents {
    const rand = seeded(`${shape.name}/accidents`);
    const [{ segs }] = strokesOf(shape);
    const area = segs.reduce(
        (sum, seg) => sum + seg.from[0] * seg.to[1] - seg.to[0] * seg.from[1],
        0,
    );
    const out = (from: Pt, to: Pt): Pt => {
        const t = unit(sub(to, from));
        return mul(area > 0 ? [t[1], -t[0]] : [-t[1], t[0]], 1.1);
    };
    const shift = (seg: Seg): Seg => ({
        from: add(seg.from, out(seg.from, seg.ctrl)),
        ctrl: add(seg.ctrl, out(seg.from, seg.to)),
        to: add(seg.to, out(seg.ctrl, seg.to)),
    });
    const ys = segs.map((seg) => seg.from[1]);
    const top = Math.min(...ys);
    const height = Math.max(...ys) - top;
    const side = (seg: Seg) => {
        const y = (seg.from[1] + seg.to[1]) / 2;
        return (
            Math.abs(unit(sub(seg.to, seg.from))[1]) > 0.85 &&
            y > top + height * 0.2 &&
            y < top + height * 0.8
        );
    };
    const pairs = segs
        .map((_, i) => i)
        .filter(
            (i) => i + 1 < segs.length && side(segs[i]) && side(segs[i + 1]),
        );
    const stretch = (i: number) => {
        const a = shift(segs[i]);
        const b = shift(segs[i + 1]);
        return `M${fmt(a.from[0])} ${fmt(a.from[1])} Q${fmt(a.ctrl[0])} ${fmt(a.ctrl[1])} ${fmt(a.to[0])} ${fmt(a.to[1])} Q${fmt(b.ctrl[0])} ${fmt(b.ctrl[1])} ${fmt(b.to[0])} ${fmt(b.to[1])}`;
    };
    const pick = () => pairs.splice(Math.floor(rand() * pairs.length), 1)[0];
    const heavy = pairs.length && rand() < 0.55 ? stretch(pick()) : '';
    const dry = pairs.length && rand() < 0.65 ? stretch(pick()) : '';
    return { over: '', heavy, dry };
}

function pathOf(shape: Shape): string {
    const d = strokesOf(shape)
        .map((stroke) => stroke.d)
        .join(' ');
    const { over } = accidentsOf(shape);
    return over ? `${d} ${over}` : d;
}

// A pressed stretch is 0.7 heavier than the line under it; a dry one runs
// down its middle in the paper's colour, a quarter of its width.
const weightOf = (shape: Shape) => WEIGHT[shape.ink] ?? WEIGHT.part ?? 2.2;
const heavyWidth = (shape: Shape) => fmt(weightOf(shape) + 0.7);
const dryWidth = (shape: Shape) => fmt(weightOf(shape) * 0.28);

// ---------------------------------------------------------------------
// The geometry.

const c = (x: number, y: number): Node => [x, y, true];
const loop = (...nodes: Node[]): Line => ({ nodes, closed: true });
const open = (...nodes: Node[]): Line => ({ nodes, closed: false });
const mirror = (line: Line, axis = 100): Line => ({
    closed: line.closed,
    nodes: line.nodes.map((node) =>
        node.length === 3
            ? c(2 * axis - node[0], node[1])
            : [2 * axis - node[0], node[1]],
    ),
});

// A limb: round ends centred on its two pivots, so it turns on either and
// stays round there, with straight sides tangent to both.
function capsule(a: Pt, ra: number, b: Pt, rb: number): Line {
    const d = dist(a, b);
    const u = unit(sub(b, a));
    const n: Pt = [-u[1], u[0]];
    const s = (ra - rb) / d;
    const k = Math.sqrt(1 - s * s);
    const v1 = add(mul(u, s), mul(n, k));
    const v2 = sub(mul(u, s), mul(n, k));
    const arc = (centre: Pt, r: number, from: Pt, via: Pt, to: Pt): Pt[] => {
        const angle = (v: Pt) => Math.atan2(v[1], v[0]);
        const a0 = angle(from);
        let sweep =
            (((angle(to) - a0) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const toVia =
            (((angle(via) - a0) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (toVia > sweep) sweep -= Math.PI * 2;
        const steps = Math.ceil(Math.abs(sweep) / (Math.PI / 6));
        return Array.from({ length: steps - 1 }, (_, i) => {
            const t = a0 + (sweep * (i + 1)) / steps;
            return add(centre, [Math.cos(t) * r, Math.sin(t) * r]);
        });
    };
    const side = (from: Pt, to: Pt): Pt[] => {
        const steps = Math.max(1, Math.round(dist(from, to) / 14));
        return Array.from({ length: steps }, (_, i) =>
            add(from, mul(sub(to, from), i / steps)),
        );
    };
    const points = [
        ...side(add(a, mul(v1, ra)), add(b, mul(v1, rb))),
        add(b, mul(v1, rb)),
        ...arc(b, rb, v1, u, v2),
        ...side(add(b, mul(v2, rb)), add(a, mul(v2, ra))),
        add(a, mul(v2, ra)),
        ...arc(a, ra, v2, mul(u, -1), v1),
    ];
    return { closed: true, nodes: points };
}

// The pivots, in the plate's coordinates. They are the rig's: the box
// draws the plate at (-24, -6).
const PIVOTS: Record<Joint, Pt> = {
    tilt: [100, 66],
    lean: [100, 156],
    armNear: [70, 80],
    forearmNear: [70, 124],
    handNear: [70, 162],
    armFar: [130, 80],
    forearmFar: [130, 124],
    handFar: [130, 162],
    legNear: [88, 156],
    legFar: [112, 156],
};

const shape = (ink: Ink, name: string, ...lines: Line[]): Shape => ({
    ink,
    name,
    lines,
});
const tagged = (s: Shape, tag: string): Shape => ({ ...s, tag });
const dot = (
    name: string,
    x: number,
    y: number,
    r: number,
    tag?: string,
): Shape => ({
    ink: 'solid',
    name,
    circle: [x, y, r],
    tag,
});

// The legs and the seat of the trousers are one shape.
const legNear = capsule([88, 156], 10.6, [86.8, 263], 7.8);
const legFar = mirror(legNear);
const seat = loop(
    c(76, 145),
    c(124, 145),
    [124.8, 160],
    [121, 171.5],
    [108.5, 177],
    [100, 179],
    [91.5, 177],
    [79, 171.5],
    [75.2, 160],
);
const shoeNear = loop(
    c(95.4, 262),
    [96, 269.5],
    c(94.8, 277.2),
    [80, 277.6],
    [68, 277.2],
    [62.6, 274.6],
    [62.4, 269.6],
    [66.8, 265.6],
    [75.4, 263.4],
    [85, 261.8],
);

// An arm: the sleeve from the shoulder to the elbow and on to the cuff.
const armNear = capsule([70, 80], 6.2, [70, 124], 6.8);
const forearmNear = capsule([70, 124], 6.5, [70, 157], 5.6);
const handNear = loop(
    [65.2, 159.6],
    [63.8, 166],
    [64.2, 172.6],
    [66.8, 178.4],
    [70.8, 180.2],
    [74.6, 177.8],
    [75.8, 172.6],
    [76.4, 169.2],
    [78.8, 167.2],
    [80.2, 164.4],
    [79.2, 162.2],
    [76.6, 162.6],
    [75, 159.8],
);

const headLine = loop(
    [100, 12.5],
    [111.5, 14.6],
    [118.4, 22],
    [120.4, 33],
    [119.4, 45],
    [115.4, 54.4],
    [108.4, 61],
    [99, 64],
    [91.4, 62],
    [85.4, 56],
    [82, 46],
    [81.2, 33],
    [84.4, 21],
    [91, 15],
);

// The jacket's front panel, in stretches. The shoulder is shared with the
// shoulder drawn over the top of the arm, so the two are one line.
const runOf = (name: string, line: Line): Run => ({ name, line });
const jacketRuns = (side: 'near' | 'far', flip: (line: Line) => Line) => ({
    shoulder: runOf(
        `shoulder-${side}`,
        flip(
            open(
                c(88, 69.4),
                [80, 70.8],
                [72, 70.6],
                [65, 72.6],
                [61.4, 77.6],
                [60.8, 84],
                c(61.6, 92),
            ),
        ),
    ),
    rest: runOf(
        `jacket-${side}`,
        flip(
            open(
                c(61.6, 92),
                [64, 104],
                [66.4, 120],
                [67, 140],
                c(66.6, 163.6),
                [80, 165.6],
                [91, 165.8],
                [94.2, 161.2],
                [94.6, 140],
                c(95.2, 114),
                [91.6, 90],
                c(88, 69.4),
            ),
        ),
    ),
    seam: runOf(
        `seam-${side}`,
        flip(open(c(61.6, 92), [69.6, 93.6], [75.4, 90.8], c(79, 85.6))),
    ),
    inside: runOf(
        `inside-${side}`,
        flip(open(c(79, 85.6), [82.4, 77], [85.4, 71.6], c(88, 69.4))),
    ),
});
const jacket = {
    near: jacketRuns('near', (line) => line),
    far: jacketRuns('far', (line) => mirror(line)),
};

const LEGS: Item[] = [
    {
        note: 'legs and seat, one outline: the edges, then the fills over them',
        items: [],
    },
    { joint: 'legFar', items: [shape('outline', 'leg-far', legFar)] },
    { joint: 'legNear', items: [shape('outline', 'leg-near', legNear)] },
    shape('outline', 'seat', seat),
    {
        joint: 'legFar',
        items: [
            shape('body', 'leg-far', legFar),
            shape('part', 'shoe-far', mirror(shoeNear)),
            shape(
                'detail',
                'welt-far',
                open([106, 273.6], [121, 273.9], [136, 273.2]),
            ),
            shape(
                'hatch',
                'crease-far',
                open([112.6, 186], [113, 218], [113.4, 250]),
            ),
        ],
    },
    {
        joint: 'legNear',
        items: [
            shape('body', 'leg-near', legNear),
            shape('part', 'shoe-near', shoeNear),
            shape(
                'detail',
                'welt-near',
                open([64, 273.2], [79, 273.9], [94, 273.6]),
            ),
            shape(
                'hatch',
                'crease-near',
                open([87.4, 186], [87, 218], [86.6, 250]),
            ),
        ],
    },
    shape('body', 'seat', seat),
    shape('detail', 'fly', open([100.2, 156], [100.6, 166], [99.4, 172.6])),
];

// The face is drawn a size up from the neck, about the chin, so it reads
// at the size the paper runs the cut.
function face(item: Item): Item {
    if (!('ink' in item)) return item;
    const k = 1.08;
    const at = (x: number, y: number): [number, number] => [
        Math.round((100 + (x - 100) * k) * 10) / 10,
        Math.round((62 + (y - 62) * k) * 10) / 10,
    ];
    if (item.circle) {
        const [x, y, r] = item.circle;
        return { ...item, circle: [...at(x, y), Math.round(r * k * 10) / 10] };
    }
    return {
        ...item,
        lines: item.lines?.map((line) => ({
            closed: line.closed,
            nodes: line.nodes.map((node) =>
                node.length === 3
                    ? c(...at(node[0], node[1]))
                    : at(node[0], node[1]),
            ),
        })),
    };
}

const HEAD: Group = {
    joint: 'tilt',
    items: [
        shape(
            'part',
            'neck',
            loop(
                c(92.4, 52),
                c(107.6, 52),
                [108, 66],
                c(108.4, 82),
                c(91.6, 82),
                [92, 66],
            ),
        ),
        shape('detail', 'apple', open([97.6, 64.6], [99.8, 67.6], [102.2, 65])),
        ...[
            shape(
                'part',
                'ear',
                loop(
                    [116, 36.4],
                    [121.6, 34.8],
                    [125, 38.6],
                    [124.6, 45],
                    [121.4, 49.6],
                    [116.4, 49],
                ),
            ),
            shape('part', 'head', headLine),
            shape(
                'solid',
                'hair',
                loop(
                    [80.6, 40.6],
                    [79.8, 29],
                    [83.4, 17.6],
                    [92, 10.6],
                    [103, 8.6],
                    [113, 11],
                    [119.8, 18.6],
                    [121.8, 29.6],
                    c(120.4, 37.2),
                    c(117.8, 37),
                    [116.8, 28.6],
                    [110, 24.6],
                    [101, 24.2],
                    [93, 26.2],
                    [88, 29.8],
                    c(84, 39),
                ),
            ),
            shape(
                'detail',
                'cowlick',
                open([104, 9.6], [105.4, 4], [109.4, 2.6], [111.2, 5.4]),
            ),
            shape(
                'detail',
                'inner-ear',
                open([120.4, 39.6], [122.6, 42.6], [120.8, 46]),
            ),
            tagged(
                shape(
                    'detail',
                    'brows',
                    open([87.4, 34.2], [91.4, 32.4], [95.4, 33.2]),
                    open([104, 32.8], [108.6, 31.2], [113, 32.4]),
                ),
                'brows',
            ),
            dot('eye-near', 91, 39.6, 2.1, 'eye'),
            dot('eye-far', 106.6, 39.6, 2.1, 'eye'),
            shape(
                'detail',
                'nose',
                open([99.2, 38.6], [96.6, 45.2], c(94.8, 48.4), [98.6, 49.6]),
            ),
            shape(
                'detail',
                'mouth',
                open([92, 54.4], [98, 56.3], [104.4, 53.6], [106.2, 51.6]),
            ),
            shape(
                'hatch',
                'cheek',
                open([112.8, 45.6], [114.6, 49.6]),
                open([110.2, 48.8], [112, 52.8]),
            ),
        ].map(face),
        { held: 'hat' },
    ],
};

const TIE: Group = {
    tag: 'tie',
    items: [
        shape(
            'part',
            'tie',
            loop(
                c(97.6, 81),
                [96.4, 100],
                c(95.2, 125.6),
                c(100, 133.4),
                c(104.8, 125.6),
                [103.6, 100],
                c(102.4, 81),
            ),
        ),
        shape(
            'hatch',
            'tie-stripes',
            open([96.6, 93.2], [103.4, 88.6]),
            open([96, 104.4], [104, 98.8]),
            open([95.6, 115.6], [104.4, 109.8]),
        ),
        shape(
            'part',
            'knot',
            loop(c(96, 74.6), c(104, 74.6), c(102.6, 82.6), c(97.4, 82.6)),
        ),
    ],
};

const TORSO: Item[] = [
    shape(
        'part',
        'shirt',
        loop(
            c(84.4, 72),
            [92, 70.6],
            [100, 75],
            [108, 70.6],
            c(115.6, 72),
            c(115.6, 152),
            c(84.4, 152),
        ),
    ),
    TIE,
    shape('part', 'collar-near', loop(c(89.4, 70), c(99.6, 75.6), c(95, 84.6))),
    shape(
        'part',
        'collar-far',
        mirror(loop(c(89.4, 70), c(99.6, 75.6), c(95, 84.6))),
    ),
    shape(
        'part',
        'belt',
        loop(c(89, 147.8), c(111, 147.8), c(111, 155.6), c(89, 155.6)),
    ),
    shape(
        'solid',
        'buckle',
        loop(c(96.6, 147.2), c(103.4, 147.2), c(103.4, 156.2), c(96.6, 156.2)),
    ),
    {
        ink: 'part',
        name: 'jacket-near',
        runs: [jacket.near.shoulder, jacket.near.rest],
        closed: true,
    },
    {
        ink: 'part',
        name: 'jacket-far',
        runs: [jacket.far.shoulder, jacket.far.rest],
        closed: true,
    },
    shape(
        'detail',
        'lapels',
        open([95, 114], c(81, 90), c(85.6, 89.6), [86.8, 72]),
        mirror(open([95, 114], c(81, 90), c(85.6, 89.6), [86.8, 72])),
    ),
    dot('button-top', 91, 125, 1.8),
    dot('button-bottom', 91, 143, 1.8),
    shape(
        'part',
        'pen',
        loop(c(115.8, 94.4), c(118.6, 94.4), c(118.6, 101.6), c(115.8, 101.6)),
    ),
    shape(
        'detail',
        'pockets',
        open([109.6, 101.2], [116, 100.8], [122.4, 100.4]),
        open([72, 146.4], [79, 146.8], [86, 147]),
        open([114, 147], [121, 146.8], [128, 146.4]),
    ),
    shape(
        'hatch',
        'shade',
        open([123.6, 108.6], [129.4, 111]),
        open([123, 118.4], [130, 121]),
        open([123.4, 128.4], [130.4, 131]),
    ),
];

function arm(side: 'Near' | 'Far'): Item[] {
    const far = side === 'Far';
    const flip = (line: Line) => (far ? mirror(line) : line);
    const s = side.toLowerCase() as 'near' | 'far';
    const sleeve = flip(armNear);
    const forearm = flip(forearmNear);
    return [
        { note: `${s} arm, one outline`, items: [] },
        {
            joint: `arm${side}`,
            items: [
                {
                    joint: `forearm${side}`,
                    items: [shape('outline', `forearm-${s}`, forearm)],
                },
                shape('outline', `arm-${s}`, sleeve),
            ],
        },
        {
            joint: `arm${side}`,
            items: [
                {
                    joint: `forearm${side}`,
                    items: [
                        shape('body', `forearm-${s}`, forearm),
                        shape(
                            'detail',
                            `cuff-${s}`,
                            flip(
                                open([65.2, 152.4], [70, 153.4], [74.8, 152.4]),
                            ),
                        ),
                        {
                            joint: `hand${side}`,
                            items: [
                                { held: far ? 'phone' : 'cup' },
                                shape('part', `hand-${s}`, flip(handNear)),
                                shape(
                                    'detail',
                                    `fingers-${s}`,
                                    flip(open([67.8, 172.4], [68.4, 177.8])),
                                    flip(open([71.2, 173.4], [71.6, 179])),
                                ),
                            ],
                        },
                    ],
                },
                shape('body', `arm-${s}`, sleeve),
                shape(
                    'hatch',
                    `elbow-${s}`,
                    flip(open([66, 118.6], [69.4, 121])),
                    flip(open([66.6, 124.2], [69.2, 126])),
                ),
            ],
        },
        // The jacket's shoulder over the top of the sleeve, so the arm turns
        // under it: its edge first, then its fill, which closes along a
        // line no pen draws.
        {
            ink: 'outline',
            name: `cap-${s}`,
            runs: [jacket[s].shoulder, jacket[s].seam],
        },
        {
            ink: 'body',
            name: `cap-${s}`,
            runs: [jacket[s].shoulder, jacket[s].seam, jacket[s].inside],
            closed: true,
        },
    ] as Item[];
}

// Back to front. He stands on the legs; above the waist he leans, and
// everything above it leans with him: the head behind the collar, the
// shirt and the tie under the jacket, and the arms in front of it.
// Dust on the scanner's glass, over everything and still while he moves.
const DUST: Item[] = [
    dot('dust-left', 37.4, 213.6, 0.7),
    dot('dust-right', 183.2, 51.8, 0.5),
    shape(
        'hatch',
        'hair-on-glass',
        open([150.2, 250.4], [153.4, 247.6], [156.8, 248.6]),
    ),
];

const FIGURE: Item[] = [
    ...LEGS,
    { joint: 'lean', items: [HEAD, ...TORSO, ...arm('Far'), ...arm('Near')] },
    ...DUST,
];

// What he holds is scenery, drawn once by the hand that drew the rest and
// kept here as it was drawn.
const HELD: Record<Held, { ink: Ink; d: string }[]> = {
    phone: [
        {
            ink: 'part',
            d: 'M130.8 155.8 q6.1 -2.1 12.2 -0.1 q3.2 0.6 2.8 2.8 q0.3 16.2 0.1 32.5 q0.9 3.1 -3 3 q-6 -1.8 -12 0.3 q-2 -0.7 -3.2 -3.3 q0.2 -16.1 0.1 -32.2 q0.2 -1.7 3 -3 z',
        },
        { ink: 'detail', d: 'M134.1 188.2 q3.1 0.5 6.1 -0.3' },
    ],
    cup: [
        {
            ink: 'part',
            d: 'M45.7 159.7 q9 1.6 18 0.6 q-0.3 13.6 -1.9 27 q-7.1 0 -14.2 -0.2 q-3.2 -13.6 -1.9 -27.4 z',
        },
        {
            ink: 'part',
            d: 'M43.6 158.1 q11 1 22 0.3 q-0.5 2.1 0.1 4.3 q-10.7 -1.4 -21.3 0.4 q0.3 -2.6 -0.8 -5 z',
        },
        { ink: 'hatch', d: 'M49.1 171.8 q6.1 0.8 12.2 0.4' },
    ],
    hat: [
        {
            ink: 'part',
            d: 'M86.2 22.3 q-1.7 -19.3 13.5 -19.9 q16.9 -1.3 14.6 19.7 q-14 0.9 -28 0.2 z',
        },
        {
            ink: 'solid',
            d: 'M86.2 14.9 q14 1 28 0.3 q0.3 2.3 0 4.7 q-14 0.6 -28 0.3 q0.1 -2.6 0 -5.2 z',
        },
        {
            ink: 'part',
            d: 'M70 23.7 q30.7 -7.2 59.9 -0.1 q-29 6.3 -59.9 0.1 z',
        },
    ],
};

// ---------------------------------------------------------------------
// The scan.

// The line as it came off the scanner: every edge caught a little in the
// paper's fibre. Three cuts of the same noise, so the page can boil the
// line through them while he moves; at rest, and on the card, it is the
// first.
const SCANS = [
    { id: 'a', seed: 4 },
    { id: 'b', seed: 11 },
    { id: 'c', seed: 23 },
];
const scanFilter = (id: string, seed: number, indent: string) => [
    `${indent}<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">`,
    `${indent}    <feTurbulence type="fractalNoise" baseFrequency="1.25" numOctaves="3" seed="${seed}" result="fibre" />`,
    `${indent}    <feDisplacementMap in="SourceGraphic" in2="fibre" scale="1.4" xChannelSelector="R" yChannelSelector="G" />`,
    `${indent}</filter>`,
];
const scanDefs = (indent: string) => [
    `${indent}<defs class="scan">`,
    ...SCANS.flatMap(({ id, seed }) =>
        scanFilter(`cut-ink-${id}`, seed, `${indent}    `),
    ),
    `${indent}</defs>`,
];

// Puts the scan's defs after `after` (a line of the source), or in place
// of the ones already there.
function spliceScan(source: string, after: RegExp, indent: string): string {
    const defs = scanDefs(indent).join('\n');
    const existing = source.match(/^ *<defs class="scan">[\s\S]*?<\/defs>\n/m);
    if (existing) return source.replace(existing[0], `${defs}\n`);
    const at = source.search(after);
    if (at < 0) throw new Error(`nowhere for the scan after ${after}`);
    const lineEnd = source.indexOf('\n', at) + 1;
    return `${source.slice(0, lineEnd)}${defs}\n${source.slice(lineEnd)}`;
}

// ---------------------------------------------------------------------
// The three copies.

const kebab = (joint: Joint) =>
    joint === 'tilt'
        ? 'head'
        : joint.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const isGroup = (item: Item): item is Group => 'items' in item;
const isHeld = (item: Item): item is { held: Held } => 'held' in item;

function svgMarkup(items: Item[], indent: string): string[] {
    const lines: string[] = [];
    for (const item of items) {
        if (isHeld(item)) {
            lines.push(`${indent}<g class="scene-${item.held}">`);
            for (const { ink, d } of HELD[item.held]) {
                lines.push(`${indent}    <path class="${ink}" d="${d}" />`);
            }
            lines.push(`${indent}</g>`);
        } else if (isGroup(item)) {
            if (item.note) {
                lines.push(`${indent}<!-- ${item.note} -->`);
                continue;
            }
            const cls = item.joint ? `joint-${kebab(item.joint)}` : item.tag;
            lines.push(`${indent}<g class="${cls}">`);
            lines.push(...svgMarkup(item.items, `${indent}    `));
            lines.push(`${indent}</g>`);
        } else {
            const cls = item.tag ? `${item.ink} ${item.tag}` : item.ink;
            if (item.circle) {
                const [cx, cy, r] = item.circle;
                lines.push(
                    `${indent}<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}" />`,
                );
            } else {
                lines.push(
                    `${indent}<path class="${cls}" d="${pathOf(item)}" />`,
                );
                const { heavy, dry } = accidentsOf(item);
                if (heavy) {
                    lines.push(
                        `${indent}<path class="heavy" stroke-width="${heavyWidth(item)}" d="${heavy}" />`,
                    );
                }
                if (dry) {
                    lines.push(
                        `${indent}<path class="dry" stroke-width="${dryWidth(item)}" d="${dry}" />`,
                    );
                }
            }
        }
    }
    return lines;
}

const CARD_INK: Record<Ink, string> = {
    part: 'PART',
    solid: 'SOLID',
    outline: 'OUTLINE',
    body: 'BODY',
    detail: 'DETAIL',
    hatch: 'HATCH',
};

function cardCode(items: Item[]): string[] {
    const out: string[] = [];
    for (const item of items) {
        if (isHeld(item)) {
            out.push(`held('${item.held}')`);
        } else if (isGroup(item)) {
            if (item.note) continue;
            const inner = cardCode(item.items);
            if (item.joint)
                out.push(`turn('${item.joint}', ${inner.join(', ')})`);
            else out.push(...inner);
        } else if (item.circle) {
            const [cx, cy, r] = item.circle;
            out.push(
                `\`<circle \${${CARD_INK[item.ink]}} cx="${cx}" cy="${cy}" r="${r}" />\``,
            );
        } else {
            out.push(
                `\`<path \${${CARD_INK[item.ink]}} d="${pathOf(item)}" />\``,
            );
            const { heavy, dry } = accidentsOf(item);
            if (heavy) {
                out.push(
                    `\`<path \${HEAVY} stroke-width="${heavyWidth(item)}" d="${heavy}" />\``,
                );
            }
            if (dry) {
                out.push(
                    `\`<path \${DRY} stroke-width="${dryWidth(item)}" d="${dry}" />\``,
                );
            }
        }
    }
    return out;
}

// Replaces the plate, the last group of the drawing, between its opening
// tag and the `</g>` that closes it before `</svg>`.
function splicePlate(source: string, opening: RegExp, indent: string): string {
    const start = source.search(opening);
    if (start < 0) throw new Error(`no plate matching ${opening}`);
    const openEnd = source.indexOf('\n', start) + 1;
    const svgEnd = source.indexOf('</svg>', start);
    const close = source.lastIndexOf('</g>', svgEnd);
    const closeLine = source.lastIndexOf('\n', close) + 1;
    return `${source.slice(0, openEnd)}${svgMarkup(FIGURE, indent).join('\n')}\n${source.slice(closeLine)}`;
}

function writeRig() {
    const file = join(ROOT, 'assets/cuts/neckass.svg');
    const source = readFileSync(file, 'utf8');
    writeFileSync(
        file,
        spliceScan(
            splicePlate(
                source,
                /<g class="plate" transform="translate\(-24 -6\)">/,
                '        ',
            ),
            /\]\]><\/style>/,
            '    ',
        ),
    );
}

function writePage() {
    const file = join(ROOT, 'index.html');
    const source = readFileSync(file, 'utf8');
    const start = source.indexOf('<svg class="cut-figure"');
    const head = source.slice(0, start);
    const tail = source.slice(start);
    const opening = tail.match(/^( *)<g transform="translate\(-24 -6\)">/m);
    if (!opening) throw new Error('no plate in the page');
    const plated = splicePlate(
        tail,
        /<g transform="translate\(-24 -6\)">/,
        `${opening[1]}    `,
    );
    writeFileSync(
        file,
        head + spliceScan(plated, /^<svg class="cut-figure"/, opening[1]),
    );
}

function writeCard() {
    const file = join(ROOT, 'functions/lib/cut.mjs');
    let source = readFileSync(file, 'utf8');
    const startMark = `'<g transform="translate(-24 -6)">',\n`;
    const start = source.indexOf(startMark) + startMark.length;
    // The plate closes, then the scan's group, then the drawing.
    const end = source.indexOf(
        `'</g>',\n        '</g>',\n        '</svg>',`,
        start,
    );
    source = `${source.slice(0, start)}${cardCode(FIGURE).join(',\n')},\n${source.slice(end)}`;
    const held = Object.entries(HELD)
        .map(
            ([prop, shapes]) =>
                `${prop}: [${shapes.map(({ ink, d }) => `\`<path \${${CARD_INK[ink]}} d="${d}" />\``).join(', ')}]`,
        )
        .join(', ');
    source = source.replace(
        /const HELD = \{[\s\S]*?\n\};/,
        `const HELD = { ${held} };`,
    );
    const origins = Object.entries(PIVOTS)
        .map(([joint, [x, y]]) => `${joint}: [${x}, ${y}]`)
        .join(', ');
    const scan = scanFilter('cut-ink', SCANS[0].seed, '')
        .map((line) => line.trim())
        .join('');
    source = source.replace(
        /const SCAN =[\s\S]*?;\n/,
        `const SCAN = '${scan}';\n`,
    );
    source = source.replace(
        /export const JOINT_ORIGINS = \{[\s\S]*?\n\};/,
        `export const JOINT_ORIGINS = { ${origins} };`,
    );
    writeFileSync(file, source);
    execSync(`bunx biome format --write ${file}`, {
        cwd: ROOT,
        stdio: 'ignore',
    });
}

writeRig();
writePage();
writeCard();
console.log('drew the file cut into the rig, the page and the card');
