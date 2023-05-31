import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import RTree from 'rbush';
import { Button } from '@mui/material';
import { rows } from './rows'

const columns = rows[0]
const rowHeight = 22
const columnWidth = 120

const BLOCK_ROW_SIZE = 5
const BLOCK_COL_SIZE = 5
const BLOCKS_ROW_AROUND = 2
const BLOCKS_COL_AROUND = 1

const noop = (...args: any[]) => {}
const debug = noop

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
  didRemove: boolean,
  element: HTMLElement | null,
  root: ReturnType<typeof ReactDOM.createRoot> | null,
}

export default class App extends React.Component {
  content = React.createRef<HTMLDivElement>()
  container = React.createRef<HTMLDivElement>()
  scrollVertical = React.createRef<HTMLDivElement>()

  blockTree = new RTree<Block>()
  lockScroll = false

  lastScrollTop = 0
  lastScrollLeft = 0
  lastScrollTimestamp = 0

  cleanupTimeout = 0

  isRendering = null as Block | null
  queuedBlocks = [] as Block[]

  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    const range = this.getRenderRange()

    this.updateHeight()
    this.renderBlocks(range)

    this.container.current!.addEventListener('wheel', this.onContainerWheel)
    this.container.current!.addEventListener('scroll', this.onContainerScroll)
    this.container.current!.addEventListener('scrollend', debug)

    this.scrollVertical.current!.addEventListener('scroll', this.onVerticalScroll)
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
      this.removeBlocks(this.getRenderRange())
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
    performance.mark(`SCROLL: ${this.container.current!.scrollTop}px`)

    this.lastScrollTimestamp = ev.timeStamp;

    if (this.lockScroll === false) {
      this.lockScroll = true
      this.scrollVertical.current!.scrollTop = this.container.current!.scrollTop
      Promise.resolve().then(() => {
        this.lockScroll = false
      })
    }

    const range = this.getRenderRange()
    this.renderBlocks(range)
    // this.scheduleCleanup()
    this.removeBlocks(range)
  }

  onContainerWheel = (ev: WheelEvent) => {
    performance.mark('WHEEL:' + ev.deltaY)

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
    block.didRemove = true
    if (block.root && block.element) {
      block.root.unmount()
      block.element.remove()

      if (this.isRendering === block) {
        this.isRendering = null
        this.executeRender()
      }
    }
    this.blockTree.remove(block)
  }

  removeBlocks(range: Range) {
    const MAX_DURATION = 16

    const start = performance.now()
    const allBlocks = []

    const aboveBlocks = this.blockTree.search({
      minX: 0,
      maxX: columns.length,
      minY: 0,
      maxY: range.minY - 1,
    })
    allBlocks.push(...aboveBlocks)

    const belowBlocks = this.blockTree.search({
      minX: range.maxX + 1,
      maxX: rows.length,
      minY: 0,
      maxY: range.minY - 1,
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
      maxX: columns.length,
      minY: range.minY,
      maxY: range.maxY
    })
    allBlocks.push(...rightBlocks)

    for (const block of allBlocks) {
      if (block.didMount === false) {
        this.removeBlock(block)
      }
    }

    if (performance.now() - start > MAX_DURATION) {
      debug('cleanup:', (performance.now() - start) + 'ms')
      debug('block:', this.blockTree.all().length)
      return this.scheduleCleanup(50)
    }

    for (const block of allBlocks) {
      if (block.didRemove === false) {
        this.removeBlock(block)
      }
      if (performance.now() - start > MAX_DURATION) {
        debug('cleanup:', (performance.now() - start) + 'ms')
        debug('block:', this.blockTree.all().length)
        return this.scheduleCleanup(50)
      }
    }

    debug('cleanup:', (performance.now() - start) + 'ms')
    debug('block:', this.blockTree.all().length)
  }

  getRenderRange() {
    const top = this.container.current!.scrollTop
    const height = this.container.current!.clientHeight
    const firstVisibleRow = Math.floor(top / rowHeight)
    const lastVisibleRow = firstVisibleRow + Math.ceil(height / rowHeight)

    const firstRow =
      Math.max(0,
        firstVisibleRow - (firstVisibleRow % BLOCK_ROW_SIZE) - BLOCKS_ROW_AROUND * BLOCK_ROW_SIZE)

    const lastRow =
      Math.min(rows.length,
        lastVisibleRow + (BLOCK_ROW_SIZE - lastVisibleRow % BLOCK_ROW_SIZE) + BLOCKS_ROW_AROUND * BLOCK_ROW_SIZE)

    const left = this.container.current!.scrollLeft
    const width = this.container.current!.clientWidth
    const firstVisibleColumn = Math.floor(left / columnWidth)
    const lastVisibleColumn = firstVisibleColumn + Math.ceil(width / columnWidth)

    const firstColumn =
      Math.max(0,
        firstVisibleColumn - (firstVisibleColumn % BLOCK_COL_SIZE) - BLOCKS_COL_AROUND * BLOCK_COL_SIZE)

    const lastColumn =
      Math.min(rows.length,
        lastVisibleColumn + (BLOCK_COL_SIZE - lastVisibleColumn % BLOCK_COL_SIZE) + BLOCKS_COL_AROUND * BLOCK_COL_SIZE)

    return {
      minX: firstColumn,
      maxX: lastColumn,
      minY: firstRow,
      maxY: lastRow,
    }
  }

  updateHeight() {
    this.content.current!.style.height = `${rowHeight * rows.length}px`;
    (this.scrollVertical.current!.children[0] as HTMLElement).style.height = `${rowHeight * rows.length}px`
  }

  queueRender(block: Block) {
    this.queuedBlocks.push(block)
    this.executeRender()
  }

  executeRender() {
    if (this.queuedBlocks.length === 0) {
      return
    }
    if (this.isRendering) {
      return
    }

    let block: Block | undefined

    while ((block = this.queuedBlocks.pop())) {
      if (block.didRemove) {
        debug('SKIPPED', block)
        continue
      }
      break
    }

    if (block === undefined) {
      debug('rendering:finished')
      return
    }

    this.isRendering = block
    debug('rendering:', block)

    const { minX: x, minY: y } = block

    debug('execute:', 'row=' + y, 'col=' + x)

    const element = document.createElement('div')
    element.className = 'block'
    element.style.transform =
      `translate3d(${x * columnWidth}px, ${y * rowHeight}px, 0)`

    this.content.current!.appendChild(element)

    let didMount = false

    block.element = element
    block.root = ReactDOM.createRoot(element)
    block.root.render(
      <Block
        rowIndex={y}
        columnIndex={x}
        onDidMount={() => {
          didMount = true

          performance.mark(`MOUNT(row=${y}, y=${y * rowHeight}px)`)
          block!.didMount = true
          this.isRendering = null
          debug('rendering:FALSE (didMount)')
          this.executeRender()
        }}
        onDidUnmount={() => {
          if (!didMount)
            debugger
          performance.mark(`UNMOUNT(row=${y}, y=${y * rowHeight}px)`)
        }}
      />
    )
  }

  renderBlock(x: number, y: number) {
    const block = {
      minX: x,
      maxX: x + BLOCK_COL_SIZE - 1,
      minY: y,
      maxY: y + BLOCK_ROW_SIZE - 1,
      didMount: false,
      didRemove: false,
      element: null,
      root: null,
    }

    this.blockTree.insert(block)

    debug('blocks:', this.blockTree.all().length)
    
    this.queueRender(block)
  }

  render() {
    return (
      <div className='wrapper'>
        <div ref={this.scrollVertical} className='fake-scroll-vertical'>
          <div className='fake-scroll-vertical-content'></div>
        </div>

        <div ref={this.container} className='container'>
          <div className='header'>
            {Array.from({ length: columns.length }).map((_, i) =>
              <div className='column'>Column {i}</div>
            )}
          </div>

          <div ref={this.content} className='content'></div>
        </div>
      </div>
    );
  }
}

function Block({ rowIndex, columnIndex, onDidMount, onDidUnmount }: {
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
      {rows.slice(rowIndex, rowIndex + BLOCK_ROW_SIZE).map((columns, i) =>
        <div className='row' key={i}>
          {columns.slice(columnIndex, columnIndex + BLOCK_COL_SIZE).map((column, j) =>
            <div className='column' key={j}>
              <Button size='small'>{column}</Button>
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
