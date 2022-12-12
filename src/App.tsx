import React, { useEffect, useRef, useState } from 'react';
import { data } from './data';
import { Map } from './Map';
import { parse } from './parse';
import { Node, solve } from './start1';



/* cSpell:disable */
const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;
/* cSpell:enable */
let doReal = false;
doReal = true;

const input = parse(doReal ? data : example);

  //calcWeights(input.chart, input.start, input.end, all, 1);

function App() {
  const [nodes, setNodes] = useState<Record<string, Node>>({});
  const gen = useRef(solve(input));

  useInterval(() => {
    let nextNodes = gen.current.next().value;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    nextNodes = gen.current.next().value || nextNodes;
    console.log('nextNodes:', nextNodes)
    if(nextNodes){
      setNodes(nextNodes);
    }
  }, 1)

  return (
    <div className="App">
     <Map chart={input.chart} nodes={nodes}/>
    </div>
  );
}

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default App;
