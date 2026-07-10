# Cascading 3-Bit Combinational Logic Pipeline

A mathematical framework and structural model for a multi-stage, cascading boolean logic evaluation network. This model processes three independent binary inputs through a paired sequence of reconfigurable logic gates to calculate a deterministic final output bit.

![Logic Circuit Banner](insert image here)

---

## 📐 Circuit Topology & Architecture

The architecture utilizes a two-tier combinational layout where the intermediate evaluation of the first tier directly alters the processing matrix of the second tier.

### Logical Data Flow

1. **First-Tier Evaluation:** Two primary binary inputs ($A$ and $B$) are fed into an initial logic node (**Gate 1**).
2. **Intermediate State:** Gate 1 computes these inputs to produce a transient internal bit, known as the intermediate state ($M$).
3. **Second-Tier Evaluation:** The intermediate state ($M$) and a third independent binary input ($C$) are fed directly into a secondary logic node (**Gate 2**).
4. **Final Terminal Output:** Gate 2 processes its inputs to yield the final deterministic system bit ($Y$).

```
Input A ──┐
          ├── [ GATE 1 ] ──▶ Intermediate (M) ──┐
Input B ──┘                                     ├── [ GATE 2 ] ──▶ Output (Y)
                                  Input C ──────┘

```

---

## 🎛️ Supported Boolean Gates & Truth Tables

The network dynamically samples from a pool of five fundamental digital logic gates. The behavior of each gate configuration is mapped according to standard boolean algebra:

| Gate     | Operator Notation      | Description                                            |
| -------- | ---------------------- | ------------------------------------------------------ |
| **AND**  | $A \cdot B$            | Outputs `1` only if both inputs are `1`.               |
| **OR**   | $A + B$                | Outputs `1` if at least one input is `1`.              |
| **NAND** | $\overline{A \cdot B}$ | Inverted AND. Outputs `0` only if both inputs are `1`. |
| **NOR**  | $\overline{A + B}$     | Inverted OR. Outputs `1` only if both inputs are `0`.  |
| **XOR**  | $A \oplus B$           | Exclusive OR. Outputs `1` if the inputs are different. |

### Reference Evaluation Matrix

```
   AND         OR         NAND        NOR         XOR
0·0 = 0     0·0 = 0     0·0 = 1     0·0 = 1     0·0 = 0
0·1 = 0     0·1 = 1     0·1 = 1     0·1 = 0     0·1 = 1
1·0 = 0     1·0 = 1     1·0 = 1     1·0 = 0     1·0 = 1
1·1 = 1     1·1 = 1     1·1 = 0     1·1 = 0     1·1 = 0

```

---

## 🧮 Mathematical Evaluation Formula

To evaluate the complete state machine manually or programmatically, the system processing functions are nested sequentially.

Let $f_{\text{gate1}}$ and $f_{\text{gate2}}$ represent the boolean operations chosen for the network. The complete mathematical pass is defined as:

$$M = f_{\text{gate1}}(A, B)$$

$$Y = f_{\text{gate2}}(M, C)$$

Therefore, the unified evaluation equation for the entire circuit loop is:

$$Y = f_{\text{gate2}}\Big(f_{\text{gate1}}(A, B), C\Big)$$

> ### 📋 Execution Example
>
> Assuming the circuit initializes with the following configuration:
>
> - Inputs: $A = 1$, $B = 0$, $C = 1$
> - Gate Selection: $\text{Gate 1} = \text{XOR}$, $\text{Gate 2} = \text{AND}$
>
> **Step 1:** Calculate the intermediate value $M$:
>
> $$M = 1 \oplus 0 = 1$$
>
> **Step 2:** Calculate the final output $Y$:
>
> $$Y = M \cdot C = 1 \cdot 1 = 1$$
>
> Terminal Result: **`1`**

---

## 🔍 Analytical Use Cases

- **Cryptographic Seed Validation:** Generating highly unpredictable yet purely deterministic binary states for state-machine verification blocks.
- **Combinational Logic Training:** Serving as an educational benchmark for parsing multi-layered truth tables.
- **Fault-Tolerant System Testing:** Simulating hardware data-link failures by observing output deviation when upstream gate configurations mutate or flip under load.

![Logic Matrix Testing Simulation](insert image here)
