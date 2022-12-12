import { Input, Vector } from "./parse";

export interface Node {
  vector: Vector;
  parent?: string;
  parentDir: string;
  cost: number;
  set: boolean;
}

export function * solve(input: Input) {
  const startNode: Node = {
    vector: input.start,
    parent: undefined,
    parentDir: "S",
    cost: 0,
    set: true,
  }
  let nodes: Record<string, Node> = {[input.start.toString()]:startNode};

  let unvisited = [startNode];

  for(let i=0; i<10000; i++){
    let current = unvisited.shift();
    if (!current) break;
    const nextNodes = getNextNodes(input.chart, current.vector, input.end, nodes, current.cost+1);
    
    for(const nextNode of nextNodes) {
      nodes = {...nodes, [nextNode.vector.toString()]:nextNode}
      unvisited.push(nextNode);
      yield nodes;
    }

    nodes = {...nodes, [current.vector.toString()]:{
      ...current,
      set: true,
    }}
    yield nodes;
  }
}

export function getNextNodes(
  chart: Input["chart"],
  at: Vector,
  end: Vector,
  all: Record<string, Node>,
  cost: number,
): Node[] {
  const elevation = chart.heights[at.toString()];
  const allOptions: [Vector, string][] = [
    [at.up(), "^"],
    [at.right(), ">"],
    [at.down(), "v"],
    [at.left(), "<"],
  ];

  const validOptions = allOptions.filter(([v]) => {
    const cord = v.toString();
    const targetEv = chart.heights[cord];
    if (targetEv === undefined || targetEv > elevation + 1) return false;
    const prev = all[cord];
    if (prev && prev.cost <= cost) return false;
    return true;
  });

  return validOptions.map(([v, parentDir]) => {
    return {
      vector: v,
      parent: at.toString(),
      parentDir,
      cost: cost,
      set: false,
    }
  })
}
