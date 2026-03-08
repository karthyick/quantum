"""
Deutsch-Jozsa Algorithm - Full Qiskit Implementation
MIT xPRO Quantum Computing | Week 4

THE PROBLEM
-----------
Given a black-box (oracle) function f: {0,1}^n -> {0,1},
determine whether f is:
  - CONSTANT  -- f(x) is the same for ALL inputs (all 0 or all 1)
  - BALANCED  -- f(x) = 0 for exactly half of inputs,
                 f(x) = 1 for the other half

CLASSICAL COMPLEXITY (worst-case)
----------------------------------
In the worst case you might keep seeing the same output.
You need 2^(n-1) + 1 queries to be 100% certain.
For n=32 that is over 2 billion queries.

QUANTUM COMPLEXITY
------------------
The Deutsch-Jozsa algorithm ALWAYS answers with 1 single query.
This was the first proven exponential quantum speedup (1992).
"""

import sys

# Qiskit's text circuit drawer uses Unicode box-drawing characters.
# Force stdout to UTF-8 so they render correctly on Windows (cp1252 by default).
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

# -- Configuration -------------------------------------------------------------
N_QUBITS = 3    # number of INPUT qubits (try 4 or 5 to see the exponential gap)
SHOTS    = 1024  # simulation repetitions (more shots -> tighter statistics)


# ==============================================================================
# SECTION 1: ORACLE IMPLEMENTATIONS
# ==============================================================================
#
# Each oracle is a QuantumCircuit sub-circuit acting on n+1 qubits:
#   qubits 0 ... n-1  ->  input register  |x>
#   qubit  n          ->  ancilla         |y>
#
# The oracle implements the unitary:
#   U_f |x>|y>  =  |x>|y XOR f(x)>
#
# When the ancilla is initialised to (|0> - |1>)/sqrt(2)  (after X then H),
# the XOR flips the global phase rather than the ancilla -- "phase kickback":
#   U_f |x> (|0>-|1>)/sqrt(2)  =  (-1)^f(x) |x> (|0>-|1>)/sqrt(2)


def oracle_constant_0(n: int) -> QuantumCircuit:
    """
    ORACLE TYPE 1 - Constant-0
    --------------------------
    f(x) = 0  for every input x in {0,1}^n.

    Implementation:  U_f |x>|y> = |x>|y XOR 0> = |x>|y>
    We do nothing -- the identity circuit is the correct oracle.

    Phase-kickback effect:
      (-1)^0 |x> = +|x>  for all x  ->  no phase change -> CONSTANT
    """
    qc = QuantumCircuit(n + 1, name="Uf:const-0")
    # No gates needed -- f(x)=0 means |y XOR 0> = |y> (identity on ancilla)
    return qc


def oracle_constant_1(n: int) -> QuantumCircuit:
    """
    ORACLE TYPE 2 - Constant-1
    --------------------------
    f(x) = 1  for every input x in {0,1}^n.

    Implementation:  U_f |x>|y> = |x>|y XOR 1>
    A single X (NOT) gate on the ancilla unconditionally flips it.

    Phase-kickback effect:
      (-1)^1 |x> = -|x>  for all x  ->  global phase only -> CONSTANT
      (A global phase on ALL terms cancels in the final interference.)
    """
    qc = QuantumCircuit(n + 1, name="Uf:const-1")
    qc.x(n)   # qubit index n is the ancilla; X flips |y> -> |y XOR 1>
    return qc


def oracle_balanced_xor(n: int) -> QuantumCircuit:
    """
    ORACLE TYPE 3 - Balanced XOR
    -----------------------------
    f(x) = x_0 XOR x_1 XOR ... XOR x_{n-1}   (bitwise XOR of all input bits)

    For n input bits exactly half the 2^n bitstrings have an even number
    of 1s (f=0) and half have an odd number (f=1), so f is balanced.

    Implementation: CNOT from every input qubit onto the ancilla.
      CNOT(i, anc): anc <- anc XOR x_i
    After all CNOTs: anc = y XOR x_0 XOR x_1 XOR ... XOR x_{n-1}  (correct)

    Phase-kickback effect:
      (-1)^{x_0 XOR ... XOR x_{n-1}} |x>
    The Hadamard interference on the input register maps this so that
    at least one qubit is always measured as 1 -> BALANCED.
    """
    qc = QuantumCircuit(n + 1, name="Uf:bal-XOR")
    for i in range(n):
        qc.cx(i, n)   # CNOT: control = input qubit i, target = ancilla
    return qc


def oracle_balanced_inner_product(n: int) -> QuantumCircuit:
    """
    ORACLE TYPE 4 - Balanced Inner-Product
    ----------------------------------------
    f(x) = x . s  (mod 2)   where s in {0,1}^n is a fixed hidden string.

    The inner product (dot product mod 2) is:
      f(x) = (x_0 * s_0) XOR (x_1 * s_1) XOR ... XOR (x_{n-1} * s_{n-1})

    For any non-zero secret string s, exactly half the inputs satisfy
    x.s = 0 and half satisfy x.s = 1, so f is balanced.

    Secret string used here:  s = 1 0 1 0 ...  (odd-indexed bits are 0)
    Example for n=3: s = [1, 0, 1]  -> f(x) = x_0 XOR x_2

    This makes the inner-product oracle clearly distinct from the plain
    XOR oracle (which uses all bits, not a subset).

    Implementation:
      For each position i where s_i = 1: apply CNOT(i -> ancilla).
      Positions where s_i = 0 are skipped -- those bits don't contribute.

    Educational note:
      This oracle is the building block for the Bernstein-Vazirani algorithm,
      which recovers the full secret string s in 1 quantum query vs n classical.
    """
    # Secret string: s_i = 1 if i is even, 0 if i is odd
    # e.g. n=3 -> s = [1, 0, 1]  -> f(x) = x_0 XOR x_2
    secret = [1 if i % 2 == 0 else 0 for i in range(n)]
    secret_str = "".join(map(str, secret))

    qc = QuantumCircuit(n + 1, name=f"Uf:inner-s{secret_str}")
    for i, s_bit in enumerate(secret):
        if s_bit == 1:
            # CNOT from input qubit i to ancilla -- only for active secret bits
            qc.cx(i, n)
    return qc


# ==============================================================================
# SECTION 2: CIRCUIT BUILDER
# ==============================================================================

def build_dj_circuit(oracle: QuantumCircuit, n: int) -> QuantumCircuit:
    """
    Assemble the complete Deutsch-Jozsa circuit around the given oracle.

    Qubit layout:
      q[0] ... q[n-1]  ->  input register (will be measured)
      q[n]              ->  ancilla qubit  (NOT measured)

    Algorithm steps:

      STEP 1 - State preparation
        Apply X to ancilla: ancilla -> |1>
        (Input qubits stay |0> by default.)

      STEP 2 - Hadamard on ALL qubits
        Input:   |0>^n --H^n--> (1/sqrt(2^n)) * sum_x |x>  (uniform superposition)
        Ancilla: |1>   --H-->   (|0> - |1>)/sqrt(2)         (the "minus state")

      STEP 3 - Oracle U_f
        U_f maps |x>(|0>-|1>)/sqrt(2)  ->  (-1)^f(x) |x> (|0>-|1>)/sqrt(2)
        f(x) is now encoded as a PHASE on each |x> amplitude.

      STEP 4 - Hadamard on INPUT qubits only
        This interference step amplifies or cancels the |0...0> state:
          Constant f: phases all equal -> amplitude adds at |0...0>  (prob = 1)
          Balanced f: phases cancel    -> amplitude at |0...0> is zero

      STEP 5 - Measure input qubits
        All zeros  (000...0) -> CONSTANT
        Any non-zero bit     -> BALANCED
    """
    n_total = n + 1                   # total qubits: input register + ancilla
    qc = QuantumCircuit(n_total, n)   # n classical bits to record measurements

    # -- Step 1: Prepare ancilla in |1> ----------------------------------------
    # The ancilla MUST be |1> before the first Hadamard so that H turns it into
    # (|0>-|1>)/sqrt(2).  This minus state is what enables phase kickback.
    # Without this step the oracle's effect would be trivial.
    qc.x(n)                           # X gate: |0> -> |1> on ancilla
    qc.barrier(label="init")

    # -- Step 2: Hadamard on ALL qubits ----------------------------------------
    # Input qubits: H^n creates equal superposition over all 2^n computational
    # basis states so the oracle "sees" all inputs simultaneously.
    # Ancilla: H|1> = (|0>-|1>)/sqrt(2) is ready to absorb phase kickback.
    for i in range(n_total):
        qc.h(i)
    qc.barrier(label="H_all")

    # -- Step 3: Apply the oracle ----------------------------------------------
    # compose() appends the oracle sub-circuit into our main circuit.
    # The oracle encodes f(x) as a phase (-1)^f(x) on each |x> amplitude
    # via phase kickback -- the ancilla qubit is the mechanism, not the target.
    qc.compose(oracle, inplace=True)
    qc.barrier(label="oracle")

    # -- Step 4: Hadamard on INPUT qubits only ---------------------------------
    # This is the quantum interference step.
    # Mathematically: H^n applied to sum_x (-1)^f(x)|x>
    #   Constant f: (-1)^c * H^n * sum_x |x> = (-1)^c * 2^n * |0...0>
    #               -> all amplitude on |0...0>, certain to measure all zeros.
    #   Balanced f: sum_x (-1)^f(x) = 0 -> amplitude at |0...0> is exactly zero,
    #               -> impossible to measure all zeros.
    for i in range(n):
        qc.h(i)
    qc.barrier(label="H_in")

    # -- Step 5: Measure input qubits -> classical bits ------------------------
    # Qubits 0...n-1 are measured into classical bits 0...n-1.
    # The ancilla is NOT measured (it played its phase-kickback role and is done).
    qc.measure(range(n), range(n))

    return qc


# ==============================================================================
# SECTION 3: RESULT CLASSIFICATION
# ==============================================================================

def classify_result(counts: dict, n: int) -> str:
    """
    Interpret measurement outcome counts to determine CONSTANT vs BALANCED.

    With an ideal (noise-free) simulator the result is fully deterministic:
      CONSTANT -> every shot measures the all-zeros string "00...0"
      BALANCED -> the all-zeros string NEVER appears

    The fallback branch handles rare cases on noisy real backends where a
    small fraction of shots land on "0...0" even for balanced oracles.
    We use the dominant (most-frequent) outcome as the verdict there.
    """
    all_zeros = "0" * n

    if all_zeros in counts and len(counts) == 1:
        # Ideal case: 100% of shots are "0...0"  ->  CONSTANT
        return "CONSTANT"
    elif all_zeros not in counts:
        # Ideal case: "0...0" never appears  ->  BALANCED
        return "BALANCED"
    else:
        # Noisy backend fallback: classify by the dominant measurement outcome
        dominant = max(counts, key=counts.get)
        return "CONSTANT" if dominant == all_zeros else "BALANCED"


# ==============================================================================
# SECTION 4: RUN ONE ORACLE EXPERIMENT
# ==============================================================================

def run_oracle(
    name: str,
    oracle: QuantumCircuit,
    n: int,
    sampler: StatevectorSampler,
) -> None:
    """
    Build the D-J circuit for the given oracle, run it on StatevectorSampler,
    print the ASCII circuit diagram, measurement counts, and verdict.

    StatevectorSampler API (Qiskit 2.x primitives):
      job    = sampler.run([(circuit,)], shots=SHOTS)
      result = job.result()            # PrimitiveResult
      data   = result[0].data          # DataBin keyed by classical register name
      counts = data.c.get_counts()     # BitArray -> dict[str, int]

    The classical register is named "c" by default when created via
    QuantumCircuit(n_qubits, n_classical_bits).
    """
    sep = "-" * 62
    print(f"\n{sep}")
    print(f"  ORACLE: {name}")
    print(sep)

    # Build the complete Deutsch-Jozsa circuit wrapping this oracle
    circuit = build_dj_circuit(oracle, n)

    # Print the ASCII circuit diagram -- shows gate structure clearly
    # fold=-1 keeps the whole circuit on one line (no wrapping)
    print("\n  Circuit diagram:")
    print(circuit.draw(output="text", fold=-1))

    # -- Execute with StatevectorSampler ----------------------------------------
    # A PUB (Primitive Unified Bloc) for the Sampler is a tuple: (circuit,)
    # shots is passed as a keyword argument to .run(), not inside the PUB tuple.
    job    = sampler.run([(circuit,)], shots=SHOTS)
    result = job.result()

    # result[0]        -> SamplerPubResult for our single PUB
    # result[0].data   -> DataBin (one attribute per classical register)
    # result[0].data.c -> BitArray for classical register "c"
    # .get_counts()    -> dict mapping bitstring -> shot count
    counts: dict = result[0].data.c.get_counts()

    # Classify: all zeros -> CONSTANT, any non-zero bit -> BALANCED
    verdict = classify_result(counts, n)
    classical_queries = 2 ** (n - 1) + 1

    print(f"\n  Measurement counts : {counts}")
    print(f"  Classification     : {verdict}")
    print(f"\n  Query comparison:")
    print(f"    Classical (worst-case): 2^(n-1)+1 = {classical_queries} queries")
    print(f"    Deutsch-Jozsa quantum :             1 query")
    print(f"    Speedup factor        :     {classical_queries}x for n={n}")


# ==============================================================================
# SECTION 5: CLASSICAL vs QUANTUM COMPARISON TABLE
# ==============================================================================

def print_comparison_table(n: int) -> None:
    """
    Print a table showing the exponential classical query count versus the
    constant quantum query count of 1.

    This table concretely illustrates why Deutsch-Jozsa matters:
    the classical algorithm's cost grows as 2^(n-1)+1 while the quantum
    algorithm stays at exactly 1 query regardless of n.
    """
    print(f"\n\n{'=' * 62}")
    print("  CLASSICAL  vs  QUANTUM  --  Query Count Comparison")
    print(f"{'=' * 62}")
    print(f"  {'n (input bits)':>14} | {'Classical (worst)':>18} | {'Quantum':>9}")
    print(f"  {'':->14}---{'':->18}---{'':->9}")

    for bits in [1, 2, 3, 4, 5, 8, 16, 32]:
        classical = 2 ** (bits - 1) + 1
        marker = "  <- (this demo)" if bits == n else ""
        print(f"  {bits:>14} | {classical:>18,} | {'1':>9}{marker}")

    print(f"\n  Key insight: quantum advantage is EXPONENTIAL.")
    print(f"  At n=32 the quantum algo uses 1 query vs ~2.1 billion classical.")
    print(f"\n  How it works (3 key ideas):")
    print(f"    1. Superposition: H^n creates a query across ALL 2^n inputs at once.")
    print(f"    2. Phase kickback: the oracle encodes f(x) as phase (-1)^f(x).")
    print(f"    3. Interference: the final H^n layer converts phase differences")
    print(f"       into amplitude -- all-zero measurement <=> constant function.")


# ==============================================================================
# SECTION 6: MAIN ENTRY POINT
# ==============================================================================

def main() -> None:
    """
    Run all four oracle experiments using Qiskit's StatevectorSampler,
    then print the classical vs quantum comparison table.

    StatevectorSampler (qiskit.primitives) performs an exact statevector
    simulation -- no hardware noise -- and samples from the resulting
    probability distribution, producing textbook-perfect counts every time.
    No transpilation or backend configuration is required.
    """
    print(f"\n{'=' * 62}")
    print(f"  Deutsch-Jozsa Algorithm -- Qiskit Implementation")
    print(f"  MIT xPRO Quantum Computing | Week 4")
    print(f"  Backend: StatevectorSampler (exact, noiseless)")
    print(f"  Config : n = {N_QUBITS} input qubits + 1 ancilla | {SHOTS} shots")
    print(f"{'=' * 62}")

    # StatevectorSampler: exact statevector simulation, then sample.
    # Accepts any QuantumCircuit directly -- no transpilation step needed.
    sampler = StatevectorSampler()
    n       = N_QUBITS

    # Four oracle experiments:
    #   - Two constant oracles (constant-0, constant-1)
    #   - Two balanced oracles (XOR-based, inner-product-based)
    oracles = [
        (
            "Constant-0   [f(x) = 0 for ALL x]",
            oracle_constant_0(n),
        ),
        (
            "Constant-1   [f(x) = 1 for ALL x]",
            oracle_constant_1(n),
        ),
        (
            "Balanced XOR [f(x) = x0 XOR x1 XOR ... XOR x_{n-1}]",
            oracle_balanced_xor(n),
        ),
        (
            "Balanced Inner-Product [f(x) = x.s mod 2, s=101...]",
            oracle_balanced_inner_product(n),
        ),
    ]

    for name, oracle in oracles:
        run_oracle(name, oracle, n, sampler)

    # Show the exponential classical vs constant quantum query gap
    print_comparison_table(n)

    print(f"\n{'=' * 62}")
    print(f"  Done -- 1 quantum query solved all four oracles.")
    print(f"{'=' * 62}\n")


if __name__ == "__main__":
    main()
