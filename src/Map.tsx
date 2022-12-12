import { Chart } from "./parse";

import './Map.scss';
import { Node } from "./start1";
import { useState } from "react";

function toLetter(num: number) {
  if (num === -1) return 'S'
  if (num === 26) return 'E'
  return String.fromCharCode('a'.charCodeAt(0) + num)
}

function buildSelectedChain(selected: Node | undefined, nodes: Record<string, Node>) {
  if(!selected) return [];
  const selectedChain  = [selected];
  let limit = 500;
  while(selectedChain[0].parent) {
    if (limit-- < 0) throw new Error('limit'); 
    const next = nodes[selectedChain[0].parent]
    selectedChain.unshift(next);
  }
  return selectedChain;
}

export function Map({chart, nodes}:{chart: Chart, nodes: Record<string, Node>}) {
  const [selected, setSelected] = useState<Node | undefined>(undefined);
  const selectedChain = buildSelectedChain(selected, nodes);
  return <div className="Map">
    {Array.from({length: chart.height}).map((_,row) => <>{
      Array.from({length: chart.width}).map((_,col) => <Cell key={`${col},${row}`} col={col} row={row} chart={chart} nodes={nodes} setSelected={setSelected} selectedChain={selectedChain}/> )
    }</>)}
  </div>
}

const toName: Record<string, string> = {
  'S': 'start',
  '^': 'top',
  'v': 'bottom',
  '<': 'left',
  '>': 'right',
}
// const toChar: Record<string, string> = {
//   'S': '',
//   '^': '|',
//   'v': '|',
//   '<': '-',
//   '>': '-',
// }

export function Cell({row, col, chart, nodes, setSelected, selectedChain} : {row: number, col: number, chart:Chart, nodes: Record<string, Node>, setSelected:React.Dispatch<React.SetStateAction<Node | undefined>>, selectedChain: Node[] }) {
  const letter = toLetter(chart.heights[`${col},${row}`])
  const allInfo = nodes[`${col},${row}`]
  let backgroundColor = 'white'
  let color = 'black'
  let cellClass = ' unknown';

  if (allInfo) {
    cellClass =allInfo.set ? ' set': ' unset';
    if (selectedChain.includes(allInfo)) {
      cellClass += ' selected'
    }
    if (allInfo.set){
      const cost = allInfo.cost ?? 0
      const pct = 250 + (cost/200)*100;
      const dark = 40 + ((cost/1200)*100);
      backgroundColor = `hsl(${(pct)}deg, 100%, 60%)`
      color = dark > 40 ? 'black': 'white'
    }
  }

  return <div className={`Cell${cellClass}`} style={{backgroundColor, color}} data-cost={allInfo?.cost} onMouseOver={() => {setSelected(allInfo)}}>
    { letter }
    { allInfo &&<span  className={toName[allInfo?.parentDir]}> </span>}
    {/* {allInfo &&<span  className={toName[allInfo?.parentDir]}>{toChar[allInfo?.parentDir]}</span>} */}
  </div>
}