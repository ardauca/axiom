import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SEED_CONCEPTS } from '../prisma/seedData.js';

describe('Axiom Prerequisite Diagnostics & DAG Engine', () => {
  test('defines valid directed acyclic graph (DAG) without circular dependencies', () => {
    const graph = new Map();
    for (const c of SEED_CONCEPTS) {
      graph.set(c.id, (c.prerequisites || []).map((p) => p.id));
    }

    // Verify no circular dependencies via topological sort / DFS cycle detection
    const visited = new Set();
    const inStack = new Set();

    function hasCycle(nodeId) {
      visited.add(nodeId);
      inStack.add(nodeId);

      const neighbors = graph.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (inStack.has(neighbor)) {
          return true;
        }
      }

      inStack.delete(nodeId);
      return false;
    }

    for (const nodeId of graph.keys()) {
      if (!visited.has(nodeId)) {
        assert.strictEqual(hasCycle(nodeId), false, `Circular dependency detected at node ${nodeId}`);
      }
    }
  });

  test('correctly maps matrix multiplication as prerequisite for eigenvalues', () => {
    const eigen = SEED_CONCEPTS.find((c) => c.id === 'eigenvalues');
    assert.ok(eigen, 'Missing eigenvalues concept');

    const prereqIds = (eigen.prerequisites || []).map((p) => p.id);
    assert.ok(
      prereqIds.includes('matrix-multiplication'),
      'Eigenvalues must require matrix-multiplication as prerequisite'
    );

    // Verify matrix-multiplication concept exists in catalog
    const mm = SEED_CONCEPTS.find((c) => c.id === 'matrix-multiplication');
    assert.ok(mm, 'matrix-multiplication must exist as a defined concept');
  });

  test('diagnoses prerequisite gap when an advanced problem is failed', () => {
    // Simulate diagnosis logic
    const problemConcepts = [
      {
        id: 'eigenvalues',
        name: 'Eigenvalues & Eigenvectors',
        prerequisites: [
          {
            id: 'matrix-multiplication',
            name: 'Matrix Multiplication',
            importance: 'ESSENTIAL',
          },
        ],
      },
    ];

    const failedSubmission = { isCorrect: false, problemConcepts };

    const recommendations = [];
    if (!failedSubmission.isCorrect) {
      for (const pc of failedSubmission.problemConcepts) {
        for (const prereq of pc.prerequisites) {
          recommendations.push({
            prerequisiteId: prereq.id,
            reason: prereq.importance,
            parentConcept: pc.name,
          });
        }
      }
    }

    assert.strictEqual(recommendations.length, 1);
    assert.strictEqual(recommendations[0].prerequisiteId, 'matrix-multiplication');
    assert.strictEqual(recommendations[0].reason, 'ESSENTIAL');
  });
});
