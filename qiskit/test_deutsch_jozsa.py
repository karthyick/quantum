"""
Tests for Deutsch-Jozsa implementation
MIT xPRO Quantum Computing — Week 4
"""

import pytest
from qiskit_aer import AerSimulator

from deutsch_jozsa import (
    oracle_constant_0,
    oracle_constant_1,
    oracle_balanced_xor,
    oracle_balanced_inner_product as oracle_balanced_phase,
    build_dj_circuit,
    classify_result as classify,
)

SIM = AerSimulator()
SHOTS = 1024


def run_dj(oracle_fn, n: int) -> str:
    oracle = oracle_fn(n)
    circuit = build_dj_circuit(oracle, n)
    counts = SIM.run(circuit, shots=SHOTS).result().get_counts()
    return classify(counts, n)


# ── Oracle classification ──────────────────────────────────────

@pytest.mark.parametrize("n", [1, 2, 3, 4])
def test_constant_0_classified_as_constant(n):
    assert run_dj(oracle_constant_0, n) == "CONSTANT"


@pytest.mark.parametrize("n", [1, 2, 3, 4])
def test_constant_1_classified_as_constant(n):
    assert run_dj(oracle_constant_1, n) == "CONSTANT"


@pytest.mark.parametrize("n", [1, 2, 3, 4])
def test_balanced_xor_classified_as_balanced(n):
    assert run_dj(oracle_balanced_xor, n) == "BALANCED"


@pytest.mark.parametrize("n", [2, 3, 4])
def test_balanced_phase_classified_as_balanced(n):
    assert run_dj(oracle_balanced_phase, n) == "BALANCED"


# ── Oracle qubit count ─────────────────────────────────────────

@pytest.mark.parametrize("n", [1, 2, 3])
def test_oracle_has_n_plus_1_qubits(n):
    for fn in [oracle_constant_0, oracle_constant_1,
               oracle_balanced_xor, oracle_balanced_phase]:
        assert fn(n).num_qubits == n + 1, f"{fn.__name__} qubit count wrong for n={n}"


# ── Circuit structure ──────────────────────────────────────────

def test_dj_circuit_has_correct_qubit_count():
    n = 3
    circuit = build_dj_circuit(oracle_constant_0(n), n)
    assert circuit.num_qubits == n + 1   # input + ancilla
    assert circuit.num_clbits == n       # only input qubits measured


def test_dj_circuit_has_measurements():
    n = 3
    circuit = build_dj_circuit(oracle_constant_0(n), n)
    ops = [inst.operation.name for inst in circuit.data]
    assert "measure" in ops


# ── classify() unit tests ──────────────────────────────────────

def test_classify_all_zeros_is_constant():
    assert classify({"000": 1024}, 3) == "CONSTANT"

def test_classify_nonzero_is_balanced():
    assert classify({"111": 1024}, 3) == "BALANCED"

def test_classify_mixed_nonzero_is_balanced():
    assert classify({"101": 512, "010": 512}, 3) == "BALANCED"

def test_classify_single_qubit_zero_constant():
    assert classify({"0": 1024}, 1) == "CONSTANT"

def test_classify_single_qubit_one_balanced():
    assert classify({"1": 1024}, 1) == "BALANCED"
