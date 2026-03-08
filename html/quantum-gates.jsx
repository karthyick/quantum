import { useState } from "react";

const COLORS = {
  bg: "#0a0a0f",
  card: "rgba(255, 255, 255, 0.03)",
  cardHover: "rgba(255, 255, 255, 0.06)",
  accent: "#8b5cf6",
  accentGlow: "rgba(139, 92, 246, 0.12)",
  green: "#10b981",
  red: "#ef4444",
  orange: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  text: "#ffffff",
  textDim: "rgba(255, 255, 255, 0.6)",
  border: "rgba(255, 255, 255, 0.08)",
  highlight: "#3b82f6",
};

const tabs = [
  { id: "classical", label: "Classical Gates", icon: "⚡" },
  { id: "single", label: "Single Qubit Gates", icon: "🎯" },
  { id: "xgate", label: "X-Gate (NOT)", icon: "🔄" },
  { id: "bloch", label: "Bloch Sphere", icon: "🌐" },
  { id: "cnot", label: "CNOT Gate", icon: "🔗" },
  { id: "entangle", label: "Entanglement", icon: "✨" },
  { id: "universal", label: "Universal Set", icon: "🧩" },
];

// ─── Classical Gates Tab ───
function ClassicalGates() {
  const [notInput, setNotInput] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle>Classical NOT Gate</SectionTitle>
      <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 15 }}>
        The NOT gate is the simplest classical gate. It takes <B>one bit</B> as input and <B>inverts</B> it.
        Combined with the AND gate, it forms a <B>universal gate set</B> — meaning any classical algorithm
        can be built from just these two gates.
      </p>

      {/* Interactive NOT */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: 24, background: COLORS.accentGlow, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
        <div onClick={() => setNotInput(notInput === 0 ? 1 : 0)} style={{ cursor: "pointer", width: 80, height: 80, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", background: notInput === 0 ? "#1e3a5f" : "#3b1e5f", color: notInput === 0 ? COLORS.accent : COLORS.purple, border: `2px solid ${notInput === 0 ? COLORS.accent : COLORS.purple}`, transition: "all 0.3s" }}>
          {notInput}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <svg width="120" height="60" viewBox="0 0 120 60">
            <line x1="0" y1="30" x2="30" y2="30" stroke={COLORS.accent} strokeWidth="2" />
            <polygon points="30,10 90,30 30,50" fill="none" stroke={COLORS.accent} strokeWidth="2" />
            <circle cx="95" cy="30" r="5" fill="none" stroke={COLORS.accent} strokeWidth="2" />
            <line x1="100" y1="30" x2="120" y2="30" stroke={COLORS.accent} strokeWidth="2" />
            <text x="55" y="35" fill={COLORS.text} fontSize="12" fontFamily="monospace" textAnchor="middle">NOT</text>
          </svg>
          <span style={{ color: COLORS.textDim, fontSize: 12 }}>Click input to toggle</span>
        </div>
        <div style={{ width: 80, height: 80, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", background: notInput === 1 ? "#1e3a5f" : "#3b1e5f", color: notInput === 1 ? COLORS.accent : COLORS.purple, border: `2px solid ${notInput === 1 ? COLORS.accent : COLORS.purple}`, transition: "all 0.3s" }}>
          {notInput === 0 ? 1 : 0}
        </div>
      </div>

      {/* Truth Table */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <TruthTable title="NOT Gate Truth Table" headers={["Input", "Output"]} rows={[["0", "1"], ["1", "0"]]} highlight={notInput === 0 ? 0 : 1} />
        <div style={{ flex: 1, minWidth: 250, padding: 20, background: `${COLORS.card}cc`, borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
          <h4 style={{ color: COLORS.orange, margin: "0 0 12px 0", fontSize: 14 }}>🔑 Key Insight</h4>
          <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            NOT + AND = <B>Universal</B> for classical computing. Any Boolean function, any algorithm that uses binary logic, can be constructed from these two gates alone. This is the classical equivalent of what quantum computing achieves with its own universal gate set.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Single Qubit Gates Tab ───
const SINGLE_QUBIT_GATES = [
  {
    name: "I (Identity)",
    matrix: "[[1, 0], [0, 1]]",
    matrixDisplay: ["1  0", "0  1"],
    color: COLORS.textDim,
    rotation: "None",
    axis: "—",
    angle: "0°",
    truthTable: [
      { input: "|0⟩", output: "|0⟩" },
      { input: "|1⟩", output: "|1⟩" },
    ],
    description:
      "The Identity gate performs no operation — the qubit state passes through unchanged. It's the quantum equivalent of a wire. Useful as a placeholder in circuit timing and for mathematical completeness in gate decompositions.",
  },
  {
    name: "X (Pauli-X)",
    matrix: "[[0, 1], [1, 0]]",
    matrixDisplay: ["0  1", "1  0"],
    color: COLORS.accent,
    rotation: "π (180°)",
    axis: "x-axis",
    angle: "180°",
    truthTable: [
      { input: "|0⟩", output: "|1⟩" },
      { input: "|1⟩", output: "|0⟩" },
    ],
    description:
      "The X-gate is the quantum NOT gate. It flips |0⟩ to |1⟩ and vice versa by rotating the Bloch vector 180° around the x-axis. For superposition states α|0⟩ + β|1⟩, it swaps the amplitudes to β|0⟩ + α|1⟩.",
  },
  {
    name: "Y (Pauli-Y)",
    matrix: "[[0, -i], [i, 0]]",
    matrixDisplay: ["0  -i", "i   0"],
    color: COLORS.orange,
    rotation: "π (180°)",
    axis: "y-axis",
    angle: "180°",
    truthTable: [
      { input: "|0⟩", output: "i|1⟩" },
      { input: "|1⟩", output: "-i|0⟩" },
    ],
    description:
      "The Y-gate rotates the Bloch vector 180° around the y-axis. Unlike X, it introduces imaginary phase factors (i and -i). It combines a bit-flip with a phase-flip, making it equivalent to applying both X and Z gates (up to a global phase).",
  },
  {
    name: "Z (Pauli-Z)",
    matrix: "[[1, 0], [0, -1]]",
    matrixDisplay: ["1   0", "0  -1"],
    color: COLORS.purple,
    rotation: "π (180°)",
    axis: "z-axis",
    angle: "180°",
    truthTable: [
      { input: "|0⟩", output: "|0⟩" },
      { input: "|1⟩", output: "-|1⟩" },
    ],
    description:
      "The Z-gate is a phase-flip gate. It leaves |0⟩ unchanged but flips the sign of |1⟩ to -|1⟩. On the Bloch sphere, this is a 180° rotation around the z-axis. It doesn't change measurement probabilities in the computational basis — only the relative phase.",
  },
  {
    name: "S (Phase)",
    matrix: "[[1, 0], [0, e^(iπ/2)]]",
    matrixDisplay: ["1       0", "0  e^(iπ/2)"],
    color: COLORS.green,
    rotation: "π/2 (90°)",
    axis: "z-axis",
    angle: "90°",
    truthTable: [
      { input: "|0⟩", output: "|0⟩" },
      { input: "|1⟩", output: "e^(iπ/2)|1⟩" },
    ],
    description:
      "The S-gate (also called √Z or Phase gate) rotates 90° around the z-axis. It adds a phase of π/2 (i) to the |1⟩ component. Applying S twice gives the Z-gate (S² = Z). It's a key gate in the Clifford group used in quantum error correction.",
  },
  {
    name: "T (π/8)",
    matrix: "[[1, 0], [0, e^(iπ/4)]]",
    matrixDisplay: ["1       0", "0  e^(iπ/4)"],
    color: COLORS.highlight,
    rotation: "π/4 (45°)",
    axis: "z-axis",
    angle: "45°",
    truthTable: [
      { input: "|0⟩", output: "|0⟩" },
      { input: "|1⟩", output: "e^(iπ/4)|1⟩" },
    ],
    description:
      "The T-gate rotates 45° around the z-axis, adding a phase of π/4 to |1⟩. It's called the π/8 gate because it equals e^(iπ/8)·Rz(π/4). T is non-Clifford — adding it to the Clifford gates (H, S, CNOT) creates a universal gate set capable of approximating any quantum operation.",
  },
  {
    name: "H (Hadamard)",
    matrix: "(1/√2)·[[1, 1], [1, -1]]",
    matrixDisplay: ["1   1", "1  -1"],
    matrixPrefix: "1/√2 ·",
    color: COLORS.pink,
    rotation: "π (180°)",
    axis: "diagonal (x-z plane)",
    angle: "180°",
    truthTable: [
      { input: "|0⟩", output: "(|0⟩+|1⟩)/√2" },
      { input: "|1⟩", output: "(|0⟩-|1⟩)/√2" },
    ],
    description:
      "The Hadamard gate is the gateway to quantum superposition. It rotates 180° around the diagonal axis between x and z on the Bloch sphere. H maps |0⟩ to an equal superposition (|0⟩+|1⟩)/√2 and |1⟩ to (|0⟩-|1⟩)/√2. Applying H twice returns to the original state (H² = I). It's the most important single-qubit gate in quantum computing.",
  },
];

function SingleQubitGates() {
  const [selectedGate, setSelectedGate] = useState(0);
  const gate = SINGLE_QUBIT_GATES[selectedGate];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle>Single Qubit Gates — Complete Reference</SectionTitle>
      <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 15 }}>
        Every single-qubit gate is a <B>2×2 unitary matrix</B> that transforms one qubit's state.
        On the Bloch sphere, each gate corresponds to a <B>rotation around a specific axis</B>.
        Below are the 7 fundamental single-qubit gates with their matrix representations, truth tables,
        and Bloch sphere rotations.
      </p>

      {/* Reference Image */}
      <Card title="Reference Chart — All Single Qubit Gates">
        <div style={{ textAlign: "center" }}>
          <img
            src="SingleQubit.jpg"
            alt="Single Qubit Gates Reference — Identity, Pauli-X, Pauli-Y, Pauli-Z, S, T, and Hadamard gates with circuit symbols, matrices, truth tables, and Bloch sphere representations"
            style={{
              maxWidth: "100%",
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
            }}
          />
          <p style={{ color: COLORS.textDim, fontSize: 12, margin: "10px 0 0 0" }}>
            Each row shows: Gate description, Circuit symbol, Matrix representation, Truth table, and Bloch sphere rotation
          </p>
        </div>
      </Card>

      {/* Gate Selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {SINGLE_QUBIT_GATES.map((g, i) => (
          <button
            key={i}
            onClick={() => setSelectedGate(i)}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: `2px solid ${selectedGate === i ? g.color : COLORS.border}`,
              background: selectedGate === i ? `${g.color}18` : "transparent",
              color: selectedGate === i ? g.color : COLORS.textDim,
              fontSize: 15,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {g.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Selected Gate Detail */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Matrix */}
        <Card title={`${gate.name} — Matrix`} style={{ flex: 1, minWidth: 240 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 16,
            color: gate.color,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: 16,
            background: `${gate.color}08`,
            borderRadius: 10,
          }}>
            {gate.matrixPrefix && (
              <div style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 4 }}>{gate.matrixPrefix}</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 40, color: gate.color, lineHeight: 1 }}>[</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                {gate.matrixDisplay.map((row, i) => (
                  <div key={i} style={{ whiteSpace: "pre" }}>{row}</div>
                ))}
              </div>
              <div style={{ fontSize: 40, color: gate.color, lineHeight: 1 }}>]</div>
            </div>
          </div>
        </Card>

        {/* Truth Table */}
        <Card title="Truth Table" style={{ flex: 1, minWidth: 240 }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15,
          }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 16px", textAlign: "center", color: COLORS.accent, borderBottom: `2px solid ${COLORS.border}`, fontWeight: 700 }}>Input</th>
                <th style={{ padding: "10px 16px", textAlign: "center", color: COLORS.green, borderBottom: `2px solid ${COLORS.border}`, fontWeight: 700 }}>Output</th>
              </tr>
            </thead>
            <tbody>
              {gate.truthTable.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px 16px", textAlign: "center", color: COLORS.text, borderBottom: `1px solid ${COLORS.border}11` }}>{row.input}</td>
                  <td style={{ padding: "10px 16px", textAlign: "center", color: gate.color, borderBottom: `1px solid ${COLORS.border}11`, fontWeight: 600 }}>{row.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Bloch Sphere Info */}
        <Card title="Bloch Sphere Rotation" style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: `${gate.color}08`, borderRadius: 8 }}>
              <span style={{ color: COLORS.textDim, fontSize: 13 }}>Axis</span>
              <span style={{ color: gate.color, fontWeight: 700, fontFamily: "monospace", fontSize: 14 }}>{gate.axis}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: `${gate.color}08`, borderRadius: 8 }}>
              <span style={{ color: COLORS.textDim, fontSize: 13 }}>Angle</span>
              <span style={{ color: gate.color, fontWeight: 700, fontFamily: "monospace", fontSize: 14 }}>{gate.rotation}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card title={`Understanding the ${gate.name.split(" ")[0]} Gate`}>
        <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          {gate.description}
        </p>
      </Card>

      {/* Key Relationships */}
      <Card title="Gate Relationships & Key Identities">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { eq: "X² = I", desc: "Two NOTs cancel out", color: COLORS.accent },
            { eq: "Z = S²", desc: "Two S-gates make a Z", color: COLORS.purple },
            { eq: "S = T²", desc: "Two T-gates make an S", color: COLORS.green },
            { eq: "H² = I", desc: "Hadamard is self-inverse", color: COLORS.pink },
            { eq: "HXH = Z", desc: "H converts X to Z", color: COLORS.orange },
            { eq: "XYZ = iI", desc: "Pauli product identity", color: COLORS.highlight },
          ].map((rel, i) => (
            <div key={i} style={{
              padding: "12px 16px",
              background: `${rel.color}08`,
              borderRadius: 8,
              border: `1px solid ${rel.color}22`,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: rel.color }}>{rel.eq}</div>
              <div style={{ color: COLORS.textDim, fontSize: 12 }}>{rel.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hierarchy */}
      <Card title="The Rotation Hierarchy (z-axis family)">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", padding: "12px 0" }}>
          {[
            { gate: "T", angle: "45°", color: COLORS.highlight },
            { gate: "S = T²", angle: "90°", color: COLORS.green },
            { gate: "Z = S²", angle: "180°", color: COLORS.purple },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: `2px solid ${item.color}`,
                background: `${item.color}10`,
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, color: item.color }}>{item.gate}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{item.angle}</div>
              </div>
              {i < 2 && (
                <svg width="30" height="20"><line x1="0" y1="10" x2="24" y2="10" stroke={COLORS.textDim} strokeWidth="2" /><polygon points="20,6 28,10 20,14" fill={COLORS.textDim} /></svg>
              )}
            </div>
          ))}
        </div>
        <p style={{ color: COLORS.textDim, fontSize: 13, textAlign: "center", margin: "12px 0 0 0" }}>
          T, S, and Z are all z-axis rotations differing only in angle. Each is the square of the previous.
        </p>
      </Card>
    </div>
  );
}

// ─── X-Gate Tab ───
function XGate() {
  const [inputState, setInputState] = useState("0");
  const alpha = inputState === "0" ? "α" : "β";
  const beta = inputState === "0" ? "β" : "α";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle>Quantum X-Gate (Pauli-X)</SectionTitle>
      <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 15 }}>
        The X-gate is the <B>quantum analog of the NOT gate</B>. For basis states |0⟩ and |1⟩ it behaves identically
        to NOT. But unlike NOT, it can operate on <B>any superposition state</B> — rotating the Bloch vector
        180° around the x-axis.
      </p>

      {/* Classical behavior */}
      <Card title="Classical Behavior (Basis States)">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <StateButton active={inputState === "0"} onClick={() => setInputState("0")} label="|0⟩" />
          <StateButton active={inputState === "1"} onClick={() => setInputState("1")} label="|1⟩" />
          <StateButton active={inputState === "s"} onClick={() => setInputState("s")} label="α|0⟩+β|1⟩" color={COLORS.pink} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
          <QState label={inputState === "s" ? "α|0⟩ + β|1⟩" : `|${inputState}⟩`} color={COLORS.accent} />
          <GateBox label="X" />
          <QState label={inputState === "s" ? "β|0⟩ + α|1⟩" : `|${inputState === "0" ? "1" : "0"}⟩`} color={COLORS.green} />
        </div>
      </Card>

      {/* What X-gate does */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Card title="For Basis States" style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: COLORS.text, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div>X|0⟩ = |1⟩</div>
            <div>X|1⟩ = |0⟩</div>
          </div>
          <p style={{ color: COLORS.textDim, fontSize: 13, textAlign: "center", margin: "12px 0 0 0" }}>
            Same as classical NOT
          </p>
        </Card>
        <Card title="For Superposition" style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: COLORS.pink, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div>X(α|0⟩ + β|1⟩)</div>
            <div style={{ color: COLORS.text }}>= β|0⟩ + α|1⟩</div>
          </div>
          <p style={{ color: COLORS.textDim, fontSize: 13, textAlign: "center", margin: "12px 0 0 0" }}>
            Swaps the coefficients — purely quantum!
          </p>
        </Card>
      </div>

      <Card title="🔄 Why It's Called the X-Gate">
        <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 14, margin: 0 }}>
          On the Bloch Sphere, this gate rotates the qubit state <B>180° (π radians) around the x-axis</B>.
          The pulse that drives this rotation is called a <B>π pulse</B> (pi pulse). Think of it like twisting
          an umbrella handle — the spokes (Bloch vector) rotate around the central axis (x-axis) where the
          pulse is applied.
        </p>
      </Card>
    </div>
  );
}

// ─── Bloch Sphere Tab ───
function BlochSphere() {
  const [rotation, setRotation] = useState("none");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle>The Bloch Sphere & Pi Pulse</SectionTitle>
      <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 15 }}>
        The <B>Bloch Sphere</B> is a geometric representation of a single qubit's state. Every point on the
        sphere's surface represents a valid qubit state. The North Pole is |0⟩, the South Pole is |1⟩,
        and everything in between is a superposition.
      </p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ flex: "0 0 320px" }}>
          <BlochDiagram rotation={rotation} />
        </div>
        <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Visualize Rotations">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { id: "none", label: "|0⟩ at North Pole", desc: "Initial state" },
                { id: "x180", label: "X-Gate (π around x)", desc: "|0⟩ → |1⟩" },
                { id: "super", label: "Superposition", desc: "Halfway = equal superposition" },
              ].map(r => (
                <div key={r.id} onClick={() => setRotation(r.id)}
                  style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer", border: `1px solid ${rotation === r.id ? COLORS.accent : COLORS.border}`, background: rotation === r.id ? COLORS.accentGlow : "transparent", transition: "all 0.2s" }}>
                  <div style={{ color: rotation === r.id ? COLORS.accent : COLORS.text, fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                  <div style={{ color: COLORS.textDim, fontSize: 12 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="π Pulse (Pi Pulse)">
            <p style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              The <B>π pulse</B> is the physical microwave pulse applied to the qubit that causes
              exactly 180° of rotation. A <B>π/2 pulse</B> would rotate only 90°, creating an
              equal superposition — this is how we put qubits into superposition in practice.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BlochDiagram({ rotation }) {
  const cx = 160, cy = 170, r = 120;
  let dotY = cy - r, dotColor = COLORS.accent, stateLabel = "|0⟩", arrowPath = null;

  if (rotation === "x180") {
    dotY = cy + r;
    dotColor = COLORS.purple;
    stateLabel = "|1⟩";
    arrowPath = `M ${cx + 8} ${cy - r + 10} C ${cx + 70} ${cy - 40}, ${cx + 70} ${cy + 40}, ${cx + 8} ${cy + r - 10}`;
  } else if (rotation === "super") {
    dotY = cy;
    dotColor = COLORS.pink;
    stateLabel = "(|0⟩+|1⟩)/√2";
  }

  return (
    <svg width="320" height="340" viewBox="0 0 320 340">
      <defs>
        <radialGradient id="sphereGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0a0e1a" stopOpacity="0.9" />
        </radialGradient>
        <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={COLORS.orange} />
        </marker>
      </defs>

      {/* Sphere */}
      <circle cx={cx} cy={cy} r={r} fill="url(#sphereGrad)" stroke={COLORS.border} strokeWidth="1.5" />
      {/* Equator ellipse */}
      <ellipse cx={cx} cy={cy} rx={r} ry={30} fill="none" stroke={COLORS.border} strokeWidth="1" strokeDasharray="4 4" />

      {/* Axes */}
      <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke={COLORS.textDim} strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke={COLORS.red} strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Axis labels */}
      <text x={cx} y={cy - r - 28} fill={COLORS.accent} fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="monospace">|0⟩</text>
      <text x={cx} y={cy + r + 38} fill={COLORS.purple} fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="monospace">|1⟩</text>
      <text x={cx + r + 22} y={cy + 5} fill={COLORS.red} fontSize="13" fontWeight="600" fontFamily="monospace">x</text>
      <text x={cx - r - 22} y={cy + 5} fill={COLORS.red} fontSize="13" fontWeight="600" fontFamily="monospace">x</text>

      {/* Rotation arrow */}
      {arrowPath && (
        <path d={arrowPath} fill="none" stroke={COLORS.orange} strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arrowHead)" />
      )}
      {rotation === "x180" && (
        <text x={cx + 78} y={cy + 5} fill={COLORS.orange} fontSize="12" fontWeight="600" fontFamily="monospace">π rotation</text>
      )}

      {/* State dot */}
      <circle cx={cx} cy={dotY} r="8" fill={dotColor} style={{ transition: "cy 0.5s ease, fill 0.3s" }}>
        <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Bloch vector */}
      <line x1={cx} y1={cy} x2={cx} y2={dotY} stroke={dotColor} strokeWidth="2" style={{ transition: "all 0.5s" }} />

      {/* State label */}
      <text x={cx} y={330} fill={dotColor} fontSize="15" fontWeight="700" textAnchor="middle" fontFamily="monospace" style={{ transition: "fill 0.3s" }}>
        {stateLabel}
      </text>
    </svg>
  );
}

// ─── CNOT Gate Tab ───
function CNOTGate() {
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const outX = cx;
  const outY = cx === 1 ? (cy === 0 ? 1 : 0) : cy;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle>CNOT Gate (Controlled-NOT)</SectionTitle>
      <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 15 }}>
        The <B>CNOT gate</B> is a <B>two-qubit gate</B> — the quantum analog of the classical <B>XOR gate</B>.
        It has a <B>control qubit</B> (x) and a <B>target qubit</B> (y). When control is |1⟩, the target gets flipped.
        When control is |0⟩, target passes through unchanged.
      </p>

      {/* Interactive CNOT */}
      <Card title="Interactive CNOT — Click to toggle inputs">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            <label style={{ color: COLORS.textDim, fontSize: 12 }}>Control (x)</label>
            <div onClick={() => setCx(cx === 0 ? 1 : 0)} style={{ cursor: "pointer", width: 56, height: 56, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, fontFamily: "monospace", background: cx === 0 ? "#1e3a5f" : "#3b1e5f", color: cx === 0 ? COLORS.accent : COLORS.purple, border: `2px solid ${cx === 0 ? COLORS.accent : COLORS.purple}`, transition: "all 0.3s" }}>
              |{cx}⟩
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            <label style={{ color: COLORS.textDim, fontSize: 12 }}>Target (y)</label>
            <div onClick={() => setCy(cy === 0 ? 1 : 0)} style={{ cursor: "pointer", width: 56, height: 56, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, fontFamily: "monospace", background: cy === 0 ? "#1e3a5f" : "#3b1e5f", color: cy === 0 ? COLORS.accent : COLORS.purple, border: `2px solid ${cy === 0 ? COLORS.accent : COLORS.purple}`, transition: "all 0.3s" }}>
              |{cy}⟩
            </div>
          </div>

          {/* Gate symbol */}
          <svg width="140" height="120" viewBox="0 0 140 120">
            {/* Control line */}
            <line x1="10" y1="35" x2="130" y2="35" stroke={COLORS.accent} strokeWidth="2" />
            {/* Target line */}
            <line x1="10" y1="85" x2="130" y2="85" stroke={COLORS.green} strokeWidth="2" />
            {/* Control dot */}
            <circle cx="70" cy="35" r="6" fill={cx === 1 ? COLORS.purple : COLORS.accent} />
            {/* Vertical connection */}
            <line x1="70" y1="41" x2="70" y2="70" stroke={COLORS.textDim} strokeWidth="1.5" />
            {/* Target circle (XOR symbol) */}
            <circle cx="70" cy="85" r="15" fill="none" stroke={COLORS.green} strokeWidth="2" />
            <line x1="70" y1="70" x2="70" y2="100" stroke={COLORS.green} strokeWidth="2" />
            <line x1="55" y1="85" x2="85" y2="85" stroke={COLORS.green} strokeWidth="2" />
            {/* Labels */}
            <text x="5" y="22" fill={COLORS.textDim} fontSize="10" fontFamily="monospace">x (ctrl)</text>
            <text x="5" y="110" fill={COLORS.textDim} fontSize="10" fontFamily="monospace">y (tgt)</text>
          </svg>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            <label style={{ color: COLORS.textDim, fontSize: 12 }}>Output x</label>
            <div style={{ width: 56, height: 56, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, fontFamily: "monospace", background: "#0f2a1e", color: COLORS.green, border: `2px solid ${COLORS.green}`, transition: "all 0.3s" }}>
              |{outX}⟩
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            <label style={{ color: COLORS.textDim, fontSize: 12 }}>Output y</label>
            <div style={{ width: 56, height: 56, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, fontFamily: "monospace", background: outY !== cy ? "#2a1e0f" : "#0f2a1e", color: outY !== cy ? COLORS.orange : COLORS.green, border: `2px solid ${outY !== cy ? COLORS.orange : COLORS.green}`, transition: "all 0.3s" }}>
              |{outY}⟩
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, padding: "10px 16px", background: cx === 1 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", borderRadius: 8, color: cx === 1 ? COLORS.red : COLORS.green, fontSize: 14 }}>
          {cx === 0 ? "Control is |0⟩ → Target passes through UNCHANGED" : "Control is |1⟩ → Target gets FLIPPED (X-gate applied)"}
        </div>
      </Card>

      <TruthTable title="CNOT / XOR Truth Table" headers={["x (ctrl)", "y (tgt)", "x out", "y out"]}
        rows={[["0", "0", "0", "0"], ["0", "1", "0", "1"], ["1", "0", "1", "1"], ["1", "1", "1", "0"]]}
        highlight={cx * 2 + cy} />
    </div>
  );
}

// ─── Entanglement Tab ───
function Entanglement() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle>Creating Entanglement with CNOT</SectionTitle>
      <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 15 }}>
        This is where quantum computing gets truly powerful. When you feed a <B>superposition state</B> into
        the control qubit of a CNOT gate, you create an <B>entangled state</B> — a state that <B>cannot be
        separated</B> into individual qubit components.
      </p>

      {/* Step by step */}
      <Card title="Step-by-Step: Creating a Bell State">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Step n={1} title="Start" content="x = (|0⟩ + |1⟩)/√2 (superposition), y = |0⟩" color={COLORS.accent} />
          <Step n={2} title="When x = |0⟩ part" content="y remains |0⟩ → produces |00⟩" color={COLORS.green} />
          <Step n={3} title="When x = |1⟩ part" content="y gets flipped → produces |11⟩" color={COLORS.purple} />
          <Step n={4} title="Combined output" content="(|00⟩ + |11⟩)/√2 — This is ENTANGLED!" color={COLORS.pink} />
        </div>
      </Card>

      {/* Circuit diagram */}
      <Card title="The Entanglement Circuit">
        <svg width="100%" height="160" viewBox="0 0 500 160" style={{ maxWidth: 500, margin: "0 auto", display: "block" }}>
          {/* Qubit lines */}
          <line x1="30" y1="50" x2="470" y2="50" stroke={COLORS.accent} strokeWidth="2" />
          <line x1="30" y1="110" x2="470" y2="110" stroke={COLORS.green} strokeWidth="2" />

          {/* Input labels */}
          <text x="10" y="55" fill={COLORS.accent} fontSize="14" fontWeight="700" fontFamily="monospace">x</text>
          <text x="10" y="115" fill={COLORS.green} fontSize="14" fontWeight="700" fontFamily="monospace">y</text>

          {/* H gate on x */}
          <rect x="80" y="30" width="50" height="40" rx="6" fill="none" stroke={COLORS.orange} strokeWidth="2" />
          <text x="105" y="56" fill={COLORS.orange} fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="monospace">H</text>
          <text x="105" y="18" fill={COLORS.textDim} fontSize="10" textAnchor="middle" fontFamily="monospace">Hadamard</text>

          {/* State after H */}
          <text x="175" y="42" fill={COLORS.textDim} fontSize="10" textAnchor="middle" fontFamily="monospace">(|0⟩+|1⟩)/√2</text>

          {/* CNOT */}
          <circle cx="250" cy="50" r="7" fill={COLORS.accent} />
          <line x1="250" y1="57" x2="250" y2="95" stroke={COLORS.textDim} strokeWidth="2" />
          <circle cx="250" cy="110" r="16" fill="none" stroke={COLORS.green} strokeWidth="2" />
          <line x1="250" y1="94" x2="250" y2="126" stroke={COLORS.green} strokeWidth="2" />
          <line x1="234" y1="110" x2="266" y2="110" stroke={COLORS.green} strokeWidth="2" />

          {/* Output state */}
          <rect x="330" y="55" width="130" height="40" rx="8" fill="rgba(244,114,182,0.12)" stroke={COLORS.pink} strokeWidth="1.5" />
          <text x="395" y="80" fill={COLORS.pink} fontSize="15" fontWeight="700" textAnchor="middle" fontFamily="monospace">(|00⟩+|11⟩)/√2</text>
          <text x="395" y="115" fill={COLORS.textDim} fontSize="11" textAnchor="middle" fontFamily="monospace">Bell State (Entangled!)</text>
        </svg>
      </Card>

      <Card title="🧠 Why Can't It Be Separated?">
        <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          The output <span style={{ color: COLORS.pink, fontFamily: "monospace" }}>(|00⟩ + |11⟩)/√2</span> means:
          if you measure qubit x and get 0, qubit y is <B>guaranteed</B> to be 0. If x is 1, y is guaranteed 1.
          There's no way to write this as <span style={{ color: COLORS.textDim, fontFamily: "monospace" }}>(something for x) ⊗ (something for y)</span>.
          The qubits are <B>correlated in a way that has no classical explanation</B> — this is entanglement.
        </p>
        <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(167,139,250,0.1)", borderRadius: 8, border: `1px solid ${COLORS.purple}33` }}>
          <p style={{ color: COLORS.purple, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
            <B>AI/ML Connection:</B> Think of entanglement like a joint probability distribution that cannot be
            factored into marginals. In ML terms, the mutual information between entangled qubits is maximal —
            they're perfectly correlated, yet individually each looks random. No classical joint distribution can
            replicate this exact behavior.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ─── Universal Set Tab ───
function UniversalSet() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle>Universal Gate Set</SectionTitle>
      <p style={{ color: COLORS.textDim, lineHeight: 1.7, fontSize: 15 }}>
        Just like NOT + AND can build any classical circuit, a small set of quantum gates can implement
        <B> any quantum algorithm</B>. This is the concept of a <B>universal gate set</B>.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { name: "X (Pauli-X)", desc: "180° rotation around x-axis. Quantum NOT.", color: COLORS.accent, axis: "x" },
          { name: "Y (Pauli-Y)", desc: "180° rotation around y-axis. Flips with phase.", color: COLORS.orange, axis: "y" },
          { name: "Z (Pauli-Z)", desc: "180° rotation around z-axis. Phase flip only.", color: COLORS.purple, axis: "z" },
          { name: "H (Hadamard)", desc: "Creates equal superposition. The gateway to quantum.", color: COLORS.pink, axis: "x+z" },
          { name: "CNOT", desc: "Two-qubit entangling gate. Conditional flip.", color: COLORS.green, axis: "2q" },
          { name: "T (π/8)", desc: "Small z-rotation. Adds non-Clifford power.", color: COLORS.highlight, axis: "z/8" },
        ].map((g, i) => (
          <div key={i} style={{ padding: 20, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${g.color}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 800, color: g.color, marginBottom: 8 }}>{g.name}</div>
            <p style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{g.desc}</p>
          </div>
        ))}
      </div>

      <Card title="The Big Picture — From Lecture Context">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, padding: 16, background: "rgba(0,212,255,0.05)", borderRadius: 8, border: `1px solid ${COLORS.accent}22` }}>
              <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Classical Universal Set</div>
              <div style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 16 }}>NOT + AND</div>
              <div style={{ color: COLORS.textDim, fontSize: 12, marginTop: 4 }}>Any Boolean function</div>
            </div>
            <div style={{ flex: 1, minWidth: 200, padding: 16, background: "rgba(244,114,182,0.05)", borderRadius: 8, border: `1px solid ${COLORS.pink}22` }}>
              <div style={{ color: COLORS.pink, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Quantum Universal Set</div>
              <div style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 16 }}>H + CNOT + T</div>
              <div style={{ color: COLORS.textDim, fontSize: 12, marginTop: 4 }}>Any quantum algorithm</div>
            </div>
          </div>
          <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.7, margin: "8px 0 0 0" }}>
            With just the <B>Hadamard gate</B> (creates superposition), <B>CNOT</B> (creates entanglement),
            and the <B>T gate</B> (adds rotational precision), you can approximate any quantum operation
            to arbitrary accuracy. This is the <B>Solovay-Kitaev theorem</B> in action — a finite set of
            gates can approximate any unitary operation.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ─── Reusable Components ───
function B({ children }) {
  return <span style={{ color: COLORS.text, fontWeight: 600 }}>{children}</span>;
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0, fontFamily: "'Fira Code', 'JetBrains Mono', monospace", letterSpacing: "-0.5px" }}>
      {children}
    </h2>
  );
}

function Card({ title, children, style = {} }) {
  return (
    <div style={{ padding: 20, background: `${COLORS.card}cc`, borderRadius: 14, border: `1px solid ${COLORS.border}`, ...style }}>
      {title && <h4 style={{ color: COLORS.text, margin: "0 0 14px 0", fontSize: 15, fontWeight: 700 }}>{title}</h4>}
      {children}
    </div>
  );
}

function TruthTable({ title, headers, rows, highlight = -1 }) {
  return (
    <div style={{ flex: 1, minWidth: 250 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textDim, marginBottom: 10 }}>{title}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={{ padding: "10px 16px", textAlign: "center", color: COLORS.accent, borderBottom: `2px solid ${COLORS.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri === highlight ? COLORS.accentGlow : "transparent", transition: "background 0.3s" }}>
              {row.map((cell, ci) => <td key={ci} style={{ padding: "10px 16px", textAlign: "center", color: COLORS.text, borderBottom: `1px solid ${COLORS.border}11` }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QState({ label, color }) {
  return (
    <div style={{ padding: "10px 18px", background: `${color}15`, borderRadius: 10, border: `1.5px solid ${color}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color, minWidth: 60, textAlign: "center" }}>
      {label}
    </div>
  );
}

function GateBox({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width="60" height="20"><line x1="0" y1="10" x2="60" y2="10" stroke={COLORS.textDim} strokeWidth="2" strokeDasharray="4 3" /><polygon points="52,6 60,10 52,14" fill={COLORS.textDim} /></svg>
      <div style={{ width: 52, height: 52, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, fontFamily: "monospace", background: "rgba(239,68,68,0.1)", color: COLORS.red, border: `2px solid ${COLORS.red}` }}>
        {label}
      </div>
      <svg width="60" height="20"><line x1="0" y1="10" x2="60" y2="10" stroke={COLORS.textDim} strokeWidth="2" strokeDasharray="4 3" /><polygon points="52,6 60,10 52,14" fill={COLORS.textDim} /></svg>
    </div>
  );
}

function StateButton({ active, onClick, label, color = COLORS.accent }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${active ? color : COLORS.border}`, background: active ? `${color}18` : "transparent", color: active ? color : COLORS.textDim, fontFamily: "monospace", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
      {label}
    </button>
  );
}

function Step({ n, title, content, color }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}20`, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color, flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ color, fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div style={{ color: COLORS.textDim, fontSize: 13, fontFamily: "monospace", marginTop: 2 }}>{content}</div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function QuantumGatesExplainer() {
  const [activeTab, setActiveTab] = useState("classical");

  const renderTab = () => {
    switch (activeTab) {
      case "classical": return <ClassicalGates />;
      case "single": return <SingleQubitGates />;
      case "xgate": return <XGate />;
      case "bloch": return <BlochSphere />;
      case "cnot": return <CNOTGate />;
      case "entangle": return <Entanglement />;
      case "universal": return <UniversalSet />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-1px", fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #fff 0%, #a8edea 40%, #fed6e3 70%, #ffecd2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Quantum Gates
          </h1>
          <p style={{ color: COLORS.textDim, fontSize: 13, margin: "6px 0 0 0" }}>
            Single & Two-Qubit Gates
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: "10px 16px", borderRadius: 10, border: `1px solid ${activeTab === t.id ? "rgba(139, 92, 246, 0.4)" : COLORS.border}`, background: activeTab === t.id ? "rgba(99, 102, 241, 0.2)" : COLORS.card, backdropFilter: "blur(10px)", color: activeTab === t.id ? "#a78bfa" : COLORS.textDim, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderTab()}

        {/* Navigation hint */}
        <div style={{ textAlign: "center", marginTop: 36, padding: 16, color: COLORS.textDim, fontSize: 12 }}>
          Navigate through the tabs above to explore each gate concept →
        </div>
      </div>
    </div>
  );
}
