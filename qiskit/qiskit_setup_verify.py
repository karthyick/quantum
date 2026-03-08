"""
Qiskit Setup Verification Script
MIT xPRO Quantum Computing -- Week 4 Prep
KR-ULTRA | RTX 5090 (quantum sim is CPU-based, GPU not used)

Steps:
  1. Check / auto-install qiskit, qiskit-aer, qiskit-ibm-runtime
  2. Print installed versions
  3. Build a 1-qubit Hadamard circuit
  4. Run via StatevectorSampler (qiskit.primitives) with Aer fallback
  5. Print measurement results (~50/50 expected)
  6. Test IBM Quantum connection (saved credentials)
  7. List available IBM backends
"""

from __future__ import annotations

import subprocess
import sys
from typing import Any

# Windows consoles default to cp1252 which can't render Qiskit's box-drawing
# characters. Reconfigure stdout to UTF-8 so circuit diagrams print correctly.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


# ---------------------------------------------------------------------------
# Step 1 – Dependency check / auto-install
# ---------------------------------------------------------------------------

def _pip_install(*packages: str) -> None:
    """Install *packages* via the active interpreter's pip."""
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", *packages, "-q"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.STDOUT,
    )


def check_and_install() -> None:
    """Ensure qiskit, qiskit-aer, and qiskit-ibm-runtime are importable.

    Auto-installs missing packages and restarts the script so all imports
    succeed in a clean namespace.
    """
    print("=" * 55)
    print("STEP 1: Checking Qiskit installation")
    print("=" * 55)

    required = {
        "qiskit": "qiskit",
        "qiskit_aer": "qiskit-aer",
        "qiskit_ibm_runtime": "qiskit-ibm-runtime",
    }

    missing_pip: list[str] = []
    for mod, pip_name in required.items():
        try:
            __import__(mod)
        except ImportError:
            print(f"  [MISSING] {pip_name}")
            missing_pip.append(pip_name)

    if missing_pip:
        print(f"\n  Installing: {', '.join(missing_pip)} ...")
        _pip_install(*missing_pip)
        print("  [OK] Installation complete. Re-launching script...\n")
        # Re-exec so the new packages are importable
        subprocess.check_call([sys.executable, *sys.argv])
        sys.exit(0)

    # All present – print versions
    import qiskit  # noqa: PLC0415
    import qiskit_aer  # noqa: PLC0415
    import qiskit_ibm_runtime  # noqa: PLC0415

    print(f"  qiskit              : {qiskit.__version__}")
    print(f"  qiskit-aer          : {qiskit_aer.__version__}")
    print(f"  qiskit-ibm-runtime  : {qiskit_ibm_runtime.__version__}")
    print("  [OK] All packages present\n")


# ---------------------------------------------------------------------------
# Step 2-5 – Build circuit and run locally
# ---------------------------------------------------------------------------

def _build_hadamard_circuit() -> Any:
    """Return a 1-qubit Hadamard + measure circuit."""
    from qiskit import QuantumCircuit  # noqa: PLC0415

    qc = QuantumCircuit(1, 1)
    qc.h(0)       # Hadamard: |0> -> (|0>+|1>) / sqrt(2)
    qc.measure(0, 0)
    return qc


def _run_statevector_sampler(qc: Any, shots: int = 1024) -> dict[str, int]:
    """Run *qc* using qiskit.primitives.StatevectorSampler (no Aer required)."""
    from qiskit.primitives import StatevectorSampler  # noqa: PLC0415

    sampler = StatevectorSampler()
    job = sampler.run([(qc,)], shots=shots)
    pub_result = job.result()[0]
    # pub_result.data contains DataBin with classical registers
    bit_array = pub_result.data.c   # register name matches circuit classical register
    counts_raw: dict[str, int] = {}
    for bitstring in bit_array.get_bitstrings():
        counts_raw[bitstring] = counts_raw.get(bitstring, 0) + 1
    return counts_raw


def _run_aer_simulator(qc: Any, shots: int = 1024) -> dict[str, int]:
    """Run *qc* using AerSimulator as fallback."""
    from qiskit_aer import AerSimulator  # noqa: PLC0415

    sim = AerSimulator()
    job = sim.run(qc, shots=shots)
    return dict(job.result().get_counts())


def run_local_circuit(shots: int = 1024) -> None:
    """Build a Hadamard circuit, run it, and print measurement statistics."""
    print("=" * 55)
    print("STEP 2: Build quantum circuit")
    print("=" * 55)

    qc = _build_hadamard_circuit()
    print("\n  Circuit (text diagram):")
    print(qc.draw("text"))
    print()

    print("=" * 55)
    print("STEP 3: Run on local simulator")
    print("=" * 55)

    counts: dict[str, int] = {}
    backend_used: str = ""

    # Primary: StatevectorSampler (pure Python, always available with Qiskit 1.x)
    try:
        print(f"  Attempting StatevectorSampler ({shots} shots) ...")
        counts = _run_statevector_sampler(qc, shots=shots)
        backend_used = "qiskit.primitives.StatevectorSampler"
    except Exception as primary_err:  # noqa: BLE001
        print(f"  StatevectorSampler failed ({primary_err}). Falling back to AerSimulator ...")
        try:
            counts = _run_aer_simulator(qc, shots=shots)
            backend_used = "qiskit_aer.AerSimulator"
        except Exception as fallback_err:  # noqa: BLE001
            print(f"  [FAIL] Both backends failed: {fallback_err}")
            return

    print()
    print("=" * 55)
    print("STEP 4 & 5: Measurement results")
    print("=" * 55)
    print(f"  Backend : {backend_used}")
    print(f"  Shots   : {shots}")
    print(f"  Raw     : {counts}")
    print()

    total = sum(counts.values())
    for state in sorted(counts):
        pct = counts[state] / total * 100
        bar = "#" * int(pct / 2)
        print(f"    |{state}> : {counts[state]:5d} shots  ({pct:5.1f}%)  {bar}")

    print()
    print("  Expected: ~50% |0>  and ~50% |1>  (Hadamard superposition)")
    zero_pct = counts.get("0", 0) / total * 100
    one_pct  = counts.get("1", 0) / total * 100
    if 40 <= zero_pct <= 60 and 40 <= one_pct <= 60:
        print("  [OK] Results look correct (both within 40-60%)\n")
    else:
        print("  [WARN] Distribution is outside the expected 40-60% range\n")


# ---------------------------------------------------------------------------
# Step 6-7 – IBM Quantum connection
# ---------------------------------------------------------------------------

def test_ibm_connection() -> None:
    """Test IBM Quantum connection using saved credentials and list backends."""
    print("=" * 55)
    print("STEP 6: IBM Quantum connection test")
    print("=" * 55)

    try:
        from qiskit_ibm_runtime import QiskitRuntimeService  # noqa: PLC0415

        print("  Loading saved IBM Quantum credentials ...")
        service = QiskitRuntimeService()

        print("  [OK] Connected to IBM Quantum!\n")

        print("=" * 55)
        print("STEP 7: Available IBM Quantum backends")
        print("=" * 55)

        backends = service.backends()
        print(f"  Total backends visible: {len(backends)}\n")

        # Sort: operational first, then alphabetical
        backends_sorted = sorted(
            backends,
            key=lambda b: (not b.status().operational, b.name),
        )

        max_show = 10
        for b in backends_sorted[:max_show]:
            try:
                status = b.status()
                op_str = "[online]  " if status.operational else "[offline] "
                pending = f"  queue={status.pending_jobs}" if status.operational else ""
                print(f"    {op_str} {b.name}{pending}")
            except Exception:  # noqa: BLE001
                print(f"    [?]       {b.name}  (status unavailable)")

        if len(backends) > max_show:
            print(f"    ... and {len(backends) - max_show} more backend(s)\n")
        else:
            print()

    except Exception as exc:  # noqa: BLE001
        print(f"  [WARN] IBM Quantum not connected: {exc}\n")
        print("  To save credentials, get your API token from:")
        print("  https://quantum.cloud.ibm.com  ->  Dashboard  ->  API Key")
        print()
        print("  Then run once in Python:")
        print("    from qiskit_ibm_runtime import QiskitRuntimeService")
        print("    QiskitRuntimeService.save_account(token='YOUR_TOKEN', overwrite=True)")
        print()
        print("  [INFO] Local StatevectorSampler / Aer simulator work without an IBM account.\n")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    print()
    print("=" * 55)
    print("  Qiskit Setup Verification  --  MIT xPRO Week 4")
    print("=" * 55)
    print()

    check_and_install()
    run_local_circuit(shots=1024)
    test_ibm_connection()

    print("=" * 55)
    print("[DONE] Verification complete.")
    print("  Local sim : ready")
    print("  Next step : python deutsch_jozsa.py")
    print("=" * 55)
    print()


if __name__ == "__main__":
    main()
