import { Chart } from "./parse";

import './Map.scss';
import { Node } from "./start1";

function toLetter(num: number) {
  if (num === -1) return 'S'
  if (num === 26) return 'E'
  return String.fromCharCode('a'.charCodeAt(0) + num)
}

export function Map({chart, nodes}:{chart: Chart, nodes: Record<string, Node>}) {
  return <div className="Map">
    {Array.from({length: chart.height}).map((_,row) => <>{
      Array.from({length: chart.width}).map((_,col) => <Cell key={`${col},${row}`} col={col} row={row} chart={chart} nodes={nodes}/> )
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

export function Cell({row, col, chart, nodes} : {row: number, col: number, chart:Chart, nodes: Record<string, Node> }) {
  const letter = toLetter(chart.heights[`${col},${row}`])
  const allInfo = nodes[`${col},${row}`]
  let backgroundColor = 'white'
  let color = 'black'
  let cellClass = ' unknown';

  if (allInfo) {
    cellClass =allInfo.set ? ' set': ' unset';
    if (allInfo.set){
      const cost = allInfo.cost ?? 0
      const pct = (cost/200)*100;
      const dark = 40 + ((cost/1200)*100);
      backgroundColor = `hsl(${(pct)}deg, 100%, ${dark}%)`
      color = dark > 40 ? 'black': 'white'
    }
  }

  return <div className={`Cell${cellClass}`} style={{backgroundColor, color}} data-cost={allInfo?.cost}>
    {    letter  }
    {allInfo &&<span  className={toName[allInfo?.parentDir]}> </span>}
    {/* {allInfo &&<span  className={toName[allInfo?.parentDir]}>{toChar[allInfo?.parentDir]}</span>} */}
  </div>
}