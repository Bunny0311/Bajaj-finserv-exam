const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const USER_ID = 'koushik_11052005';
const EMAIL_ID = 'kv4760@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311026010102';

function isValidEntry(raw) {
  const s = raw.trim();
  return /^[A-Z]->[A-Z]$/.test(s);
}

function processData(data) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const seenEdges = new Set();
  const validEdges = [];

  for (const raw of data) {
    const s = typeof raw === 'string' ? raw.trim() : String(raw).trim();

    if (!isValidEntry(s)) {
      invalid_entries.push(raw);
      continue;
    }

    const [parent, child] = s.split('->');
    if (parent === child) {
      invalid_entries.push(raw);
      continue;
    }

    if (seenEdges.has(s)) {
      if (!duplicate_edges.includes(s)) {
        duplicate_edges.push(s);
      }
      continue;
    }

    seenEdges.add(s);
    validEdges.push({ parent, child });
  }

  const childToParent = {};
  const parentToChildren = {};
  const allNodes = new Set();

  for (const { parent, child } of validEdges) {
    allNodes.add(parent);
    allNodes.add(child);

    if (childToParent[child] !== undefined) {
      continue;
    }
    childToParent[child] = parent;

    if (!parentToChildren[parent]) parentToChildren[parent] = [];
    parentToChildren[parent].push(child);
  }

  const visited = new Set();

  function getComponent(startNode) {
    const component = new Set();
    const stack = [startNode];
    while (stack.length) {
      const n = stack.pop();
      if (component.has(n)) continue;
      component.add(n);
      (parentToChildren[n] || []).forEach(c => stack.push(c));
      if (childToParent[n] !== undefined) stack.push(childToParent[n]);
    }
    return component;
  }

  const components = [];
  for (const node of allNodes) {
    if (!visited.has(node)) {
      const comp = getComponent(node);
      comp.forEach(n => visited.add(n));
      components.push(comp);
    }
  }

  const hierarchies = [];

  for (const comp of components) {
    const roots = [...comp].filter(n => childToParent[n] === undefined);

    let root;
    if (roots.length > 0) {
      root = roots.sort()[0];
    } else {
      root = [...comp].sort()[0];
    }

    function hasCycle() {
      const color = {};
      for (const n of comp) color[n] = 0;

      function dfs(u) {
        color[u] = 1;
        for (const v of (parentToChildren[u] || [])) {
          if (!comp.has(v)) continue;
          if (color[v] === 1) return true;
          if (color[v] === 0 && dfs(v)) return true;
        }
        color[u] = 2;
        return false;
      }

      for (const n of comp) {
        if (color[n] === 0 && dfs(n)) return true;
      }
      return false;
    }

    if (hasCycle()) {
      hierarchies.push({ root, tree: {}, has_cycle: true });
      continue;
    }

    function buildTree(node) {
      const obj = {};
      for (const child of (parentToChildren[node] || [])) {
        obj[child] = buildTree(child);
      }
      return obj;
    }

    function calcDepth(node) {
      const children = parentToChildren[node] || [];
      if (children.length === 0) return 1;
      return 1 + Math.max(...children.map(calcDepth));
    }

    const tree = { [root]: buildTree(root) };
    const depth = calcDepth(root);

    hierarchies.push({ root, tree, depth });
  }

  const nonCyclic = hierarchies.filter(h => !h.has_cycle);
  const cyclic = hierarchies.filter(h => h.has_cycle);

  let largest_tree_root = '';
  if (nonCyclic.length > 0) {
    nonCyclic.sort((a, b) => {
      if (b.depth !== a.depth) return b.depth - a.depth;
      return a.root < b.root ? -1 : 1;
    });
    largest_tree_root = nonCyclic[0].root;
  }

  const summary = {
    total_trees: nonCyclic.length,
    total_cycles: cyclic.length,
    largest_tree_root,
  };

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary,
  };
}

app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: '"data" must be an array of strings.' });
  }

  try {
    const result = processData(data);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/', (req, res) => res.json({ status: 'ok', message: 'BFHL API is running.' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));