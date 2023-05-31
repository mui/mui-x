import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import RTree from 'rbush';
import { Button } from '@mui/material';
import type { DataGridPremium } from '@mui/x-data-grid-premium';

type Props = Parameters<typeof DataGridPremium>[0]

const BLOCK_ROW_SIZE = 4
const BLOCK_COL_SIZE = 7
const BLOCKS_AROUND = 1

const ROWS_AROUND = 20
const COLUMNS_AROUND = 2

const noop = () => {}
const debug = console.log

// x: column
// y: row
type Range = {
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
}

type Block = Range & {
  didMount: boolean,
  element: HTMLElement,
  root: ReturnType<typeof ReactDOM.createRoot>,
}

const EMPTY_RANGE = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
} as Range


// const config = { childList: true }
//
// const observer = new MutationObserver((mutationList) => {
//   for (const mutation of mutationList) {
//     // const addedNode = mutation.addedNodes[0]
//     // const removedNode = mutation.addedNodes[0]
//     // console.log(mutation.addedNodes[0])
//     // if (mutation.type === "childList") {
//     //   console.log("A child node has been added or removed.");
//     // } else if (mutation.type === "attributes") {
//     //   console.log(`The ${mutation.attributeName} attribute was modified.`);
//     // }
//   }
// });

export class DataGrid extends React.Component<Props, {}> {
  static defaultProps = {
    rowHeight: 22,
  }

  content = React.createRef<HTMLDivElement>()
  container = React.createRef<HTMLDivElement>()
  scrollVertical = React.createRef<HTMLDivElement>()
  canvas = React.createRef<HTMLCanvasElement>()
  canvasFrameId = 0

  blockTree = new RTree<Block>()
  lockScroll = false

  lastScrollTop = 0
  lastScrollLeft = 0
  lastScrollTimestamp = 0

  cleanupTimeout = 0

  screenRange = EMPTY_RANGE
  displayRange = EMPTY_RANGE

  constructor(props: Props) {
    super(props);
    if (typeof window !== 'undefined')
      (window as any).tree = this.blockTree
  }

  get rows() {
    return this.props.rows
  }

  get columns() {
    return this.props.columns
  }

  get rowHeight() {
    return this.props.rowHeight || DataGrid.defaultProps.rowHeight
  }

  get columnWidth() {
    return 120
  }

  componentDidMount() {
    this.updateDisplayRange()
    this.updateHeight()
    this.renderBlocks(this.displayRange)

    // observer.observe(this.content.current!, config)
    
    this.container.current!.addEventListener('wheel', this.onContainerWheel)
    this.container.current!.addEventListener('scroll', this.onContainerScroll)

    this.scrollVertical.current!.addEventListener('scroll', this.onVerticalScroll)

    this.canvasFrameId = requestAnimationFrame(this.updateCanvas)
  }

  componentWillUnmount() {
    // observer.disconnect()

    this.container.current!.removeEventListener('wheel', this.onContainerWheel)
    this.container.current!.removeEventListener('scroll', this.onContainerScroll)

    this.scrollVertical.current!.removeEventListener('scroll', this.onVerticalScroll)

    cancelAnimationFrame(this.canvasFrameId)
  }

  componentDidUpdate() {
    this.updateDisplayRange()
    this.updateHeight()
    this.renderBlocks(this.displayRange)
  }

  scheduleCleanup = (minimalDelay?: number) => {
    if (this.cleanupTimeout)
      clearTimeout(this.cleanupTimeout)

    const elapsed = performance.now() - this.lastScrollTimestamp
    if (elapsed < 300) {
      debug('schedule:debounce')
      this.cleanupTimeout = setTimeout(this.scheduleCleanup, 300) as any
      return
    }

    if (!minimalDelay) {
      debug('schedule:next-frame')
      this.scheduleCleanupNextFrame()
    } else {
      debug('schedule:delay', minimalDelay)
      this.cleanupTimeout = setTimeout(this.scheduleCleanupNextFrame, minimalDelay) as any
    }
  }

  scheduleCleanupNextFrame = () => {
    afterAnimationFrame(() => {
      this.updateDisplayRange()
      this.removeBlocks(this.displayRange)
    })
  }

  onVerticalScroll = (ev: Event) => {
    this.lastScrollTimestamp = ev.timeStamp;

    if (this.lockScroll === false) {
      this.lockScroll = true
      this.container.current!.scrollTop = this.scrollVertical.current!.scrollTop
      Promise.resolve().then(() => {
        this.lockScroll = false
      })
    }
  }

  onContainerScroll = (ev: Event) => {
    performance.mark('SCROLL: ' + this.container.current!.scrollTop)

    this.lastScrollTimestamp = ev.timeStamp;

    // if (this.lockScroll === false) {
    //   this.lockScroll = true
    //   this.scrollVertical.current!.scrollTop = this.container.current!.scrollTop
    //   Promise.resolve().then(() => {
    //     this.lockScroll = false
    //   })
    // }

    this.updateDisplayRange()
    this.renderBlocks(this.displayRange)
    this.scheduleCleanup()
  }

  onContainerWheel = (ev: WheelEvent) => {
    performance.mark('WHEEL: ' + ev.deltaY)

    this.lastScrollTimestamp = ev.timeStamp;

    // TODO: scroll prediction
  }

  renderBlocks(range: Range) {
    const renderedBlocks = this.blockTree.search(range)

    for (let x = range.minX; x < range.maxX; x += BLOCK_COL_SIZE) {
      for (let y = range.minY; y < range.maxY; y += BLOCK_ROW_SIZE) {
        if (!renderedBlocks.some(b => b.minX === x && b.minY === y)) {
          this.renderBlock(x, y)
        }
      }
    }
  }

  removeBlock = (block: Block) => {
    block.root.unmount()
    block.element.remove()
    this.blockTree.remove(block)
  }

  removeBlocks(range: Range) {
    const MAX_DURATION = 16

    const start = performance.now()
    const allBlocks = []

    const aboveBlocks = this.blockTree.search({
      minX: 0,
      maxX: this.columns.length,
      minY: 0,
      maxY: range.minY - 1,
    })
    allBlocks.push(...aboveBlocks)

    const belowBlocks = this.blockTree.search({
      minX: 0,
      maxX: this.columns.length,
      minY: range.maxY + 1,
      maxY: this.rows.length,
    })
    allBlocks.push(...belowBlocks)

    const leftBlocks = this.blockTree.search({
      minX: 0,
      maxX: range.minX - 1,
      minY: range.minY,
      maxY: range.maxY
    })
    allBlocks.push(...leftBlocks)

    const rightBlocks = this.blockTree.search({
      minX: range.maxX + 1,
      maxX: Math.max(range.maxX + 1, this.columns.length),
      minY: range.minY,
      maxY: range.maxY
    })
    allBlocks.push(...rightBlocks)

    for (const block of allBlocks) {
      this.removeBlock(block)

      if (performance.now() - start > MAX_DURATION) {
        debug('cleanup:', (performance.now() - start) + 'ms', allBlocks.length + ' blocks', '(aborted)')
        debug('block:', this.blockTree.all().length)
        return this.scheduleCleanup(50)
      }
    }

    debug('cleanup:', (performance.now() - start) + 'ms', allBlocks.length + ' blocks', '(completed)')
    debug('block:', this.blockTree.all().length)
  }

  updateDisplayRange() {
    debug('display-range:', this.displayRange)

    const top = this.container.current!.scrollTop
    const height = this.container.current!.clientHeight
    const firstVisibleRow = Math.floor(top / this.rowHeight)
    const lastVisibleRow = firstVisibleRow + Math.ceil(height / this.rowHeight)

    const firstRowRequest = firstVisibleRow - ROWS_AROUND
    const lastRowRequest = lastVisibleRow + ROWS_AROUND

    const firstRow = Math.max(0, firstRowRequest - (firstRowRequest % BLOCK_ROW_SIZE))
    const lastRow = Math.min(this.rows.length, lastRowRequest + (BLOCK_ROW_SIZE - lastRowRequest % BLOCK_ROW_SIZE))

    const left = this.container.current!.scrollLeft
    const width = this.container.current!.clientWidth
    const firstVisibleColumn = Math.floor(left / this.columnWidth)
    const lastVisibleColumn = firstVisibleColumn + Math.ceil(width / this.columnWidth)

    const firstColumnRequest = firstVisibleColumn - COLUMNS_AROUND
    const lastColumnRequest = lastVisibleColumn + COLUMNS_AROUND

    const firstColumn = Math.max(0, firstColumnRequest - (firstColumnRequest % BLOCK_COL_SIZE))
    const lastColumn  = Math.min(this.columns.length, lastColumnRequest + (BLOCK_COL_SIZE - lastColumnRequest % BLOCK_COL_SIZE))

    this.screenRange = {
      minX: firstVisibleColumn,
      maxX: lastVisibleColumn,
      minY: firstVisibleRow,
      maxY: lastVisibleRow,
    }

    this.displayRange = {
      minX: firstColumn,
      maxX: lastColumn,
      minY: firstRow,
      maxY: lastRow,
    }
  }

  updateHeight() {
    this.content.current!.style.height = `${this.rowHeight * this.rows.length}px`;
    (this.scrollVertical.current!.children[0] as HTMLElement).style.height = `${this.rowHeight * this.rows.length}px`
  }

  renderBlock(x: number, y: number) {
    const rowIndex = y
    const columnIndex = x

    const element = document.createElement('div')
    element.className = 'block'
    // element.setAttribute('data-row', String(rowIndex))
    // element.setAttribute('data-col', String(columnIndex))

    const xPx = columnIndex * this.columnWidth
    const yPx = rowIndex * this.rowHeight
    element.style.transform = `translate3d(${xPx}px, ${yPx}px, 0)`
    // element.style.top = `${rowIndex * this.rowHeight}px`
    // element.style.left = `${columnIndex * this.columnWidth}px`
    // element.style.containIntrinsicWidth = `${BLOCK_COL_SIZE * this.columnWidth}px`
    // element.style.containIntrinsicHeight = `${BLOCK_ROW_SIZE * this.rowHeight}px`

    this.content.current!.appendChild(element)

    const root = ReactDOM.createRoot(element)
    root.render(
      <Block
        instance={this}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        onDidMount={() => {
          performance.mark(`MOUNT(row=${y}, col=${x})`)
          block.didMount = true
        }}
        onDidUnmount={() => {
          performance.mark(`UNMOUNT(row=${y}, col=${x})`)
        }}
      />
    )

    const block = {
      minX: x,
      maxX: Math.min(x + BLOCK_COL_SIZE - 1, this.columns.length),
      minY: y,
      maxY: Math.min(y + BLOCK_ROW_SIZE - 1, this.rows.length),
      didMount: false,
      element,
      root,
    }

    this.blockTree.insert(block)

    debug('blocks:', this.blockTree.all().length)
  }

  updateCanvas = () => {
    const ctx = this.canvas.current!.getContext('2d')!

    const w = this.canvas.current!.width
    const h = this.canvas.current!.height

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, 0, w, h)

    const f = 0.1
    const cellHeight = Math.round(this.rowHeight * f * 0.5)
    const cellWidth = Math.round(this.columnWidth * f)

    ctx.lineWidth = 0.5

    const doRect = (range: Range, op = ctx.strokeRect.bind(ctx)) => {
      const x = range.minX * cellWidth
      const y = range.minY * cellHeight
      const w = (range.maxX + 1) * cellWidth - x
      const h = (range.maxY + 1) * cellHeight - y
      op(x + 0.5, y + 0.5, w, h)
    }

    ctx.strokeStyle = 'blue'
    const blocks = this.blockTree.all()
    for (const block of blocks) {
      doRect(block)
    }

    ctx.strokeStyle = 'red'
    doRect(this.displayRange)

    ctx.strokeStyle = 'yellow'
    ctx.fillStyle = 'rgba(255, 255, 0, 0.1)'
    doRect(this.screenRange)
    doRect(this.screenRange, ctx.fillRect.bind(ctx))


    this.canvasFrameId = requestAnimationFrame(this.updateCanvas)
  }

  render() {
    return (
      <div>
        <div className='grid' style={{ '--row-height': `${this.rowHeight}px` } as React.CSSProperties}>
          <div ref={this.scrollVertical} className='fake-scroll-vertical'>
            <div className='fake-scroll-vertical-content'></div>
          </div>

          <div ref={this.container} className='container'>
            <div className='header'>
              {this.columns.map((c) =>
                <div className='column'>{c.headerName ?? c.field}</div>
              )}
            </div>

            <div ref={this.content} className='content'></div>
          </div>
        </div>
        <br/>
        <canvas ref={this.canvas} width='700' height='400' />
      </div>
    );
  }
}

function Block({ instance, rowIndex, columnIndex, onDidMount, onDidUnmount }: {
  instance: DataGrid,
  rowIndex: number;
  columnIndex: number;
  onDidMount?: Function;
  onDidUnmount?: Function;
}) {
  React.useEffect(() => {
    onDidMount?.()
    return onDidUnmount as any
  }, [])

  return (
    <React.Fragment>
      {instance.rows.slice(rowIndex, rowIndex + BLOCK_ROW_SIZE).map((row, i) =>
        <div className='row' key={i}>
          {instance.columns.slice(columnIndex, columnIndex + BLOCK_COL_SIZE).map((column, j) =>
            <div className='column' key={j}>
              {column.valueFormatter!({ value: row[column.field] } as any)}
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  )
}

function afterAnimationFrame(fn: Function) {
  requestAnimationFrame(() => {
    setTimeout(fn, 0)
  })
}
