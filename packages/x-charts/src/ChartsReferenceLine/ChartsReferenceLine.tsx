import { useDrawingArea, useXScale, useYScale } from "../hooks"

interface ReferenceLineInterface {
  direction: string
  threshold: number | string | Date
  color?: string
  lineWidth?: number
  text?: string | string[]
  textAlign?: string
  axisId?: string
}

export const ReferenceLine = ({
  direction,
  threshold,
  color = "red",
  lineWidth = 1,
  text = "",
  textAlign = "middle",
  axisId
}: ReferenceLineInterface) => {
  let { left, top, width, height } = useDrawingArea()

  if (!["horizontal", "vertical"].includes(direction)) {
    throw new Error("Direction is either horizontal or vertical.")
  }
  const textParams: any = { fontSize: 10, width: 50 }

  let xAxisScale
  let yAxisScale
  let d:any
  if (direction == "horizontal") {
    xAxisScale = useXScale() as any
    yAxisScale = useYScale(axisId) as any

    textParams.x = left
    textParams.y = yAxisScale(threshold)

    d = `M ${left} ${yAxisScale(threshold)} l ${width} 0`

    if (textAlign === "center") {
      textParams["x"] = left + width / 2
      textParams.textAnchor = "middle"
    } else if (textAlign === "left") {
      textParams.textAnchor = "left"
    } else if (textAlign === "right") {
      textParams.textAnchor = "end"
      textParams["x"] = left + width
    }
  } else if (direction === "vertical") {
    xAxisScale = useXScale(axisId) as any
    yAxisScale = useYScale() as any

    textParams.x = xAxisScale(threshold)
    textParams.y = top

    d = `M ${xAxisScale(threshold)} ${top} l 0 ${height}`

    if (textAlign === "middle") {
      textParams["y"] = top + height / 2
    } else if (textAlign === "top") {
      textParams.textAnchor = "left"
    } else if (textAlign === "bottom") {
      textParams["y"] = top + height
    }
  }

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={lineWidth}
        strokeDasharray={5}
        opacity={0.5}
      />
      <text {...textParams}>
        {Array.isArray(text) &&
          text.map((row: string, index: number) => (
            <tspan x={textParams["x"]} dx="5" dy="1.2em" key={index}>
              {row}
            </tspan>
          ))}
        {!Array.isArray(text) && text}
      </text>
    </>
  )
}