"use client"

import { useRef, useEffect, useState, ChangeEvent } from "react"
import html2canvas from "html2canvas"
import { Caesar_Dressing } from "next/font/google"

const caesar = Caesar_Dressing({ weight: "400", subsets: ["latin"], display: "swap" })

export default function Jsdraw() {
  const width: number = 225
  const height: number = 300
  const canvasRef: any = useRef(null)
  const printRef: any = useRef()

  const [wartosc, setWartosc] = useState<string>("")

  const T: number[] = [width / 2, width / 6] // translation x, y
  const Z: number[] = [0, 0, 0, width] // zero
  // coordinates x-start, y-start, x-end, y-end
  const JE: number[] = [0, 0, 1, 0] // one
  const DW: number[] = [0, 1, 1, 1] // two
  const TR: number[] = [0, 0, 1, 1] // three
  const CZ: number[] = [0, 1, 1, 0] // four
  const SZ: number[] = [1, 0, 1, 1] // six
  // number ABCD - order of magnitude depending transformation
  const A: number[] = [-1, 1]
  const B: number[] = [1, 1]
  const C: number[] = [-1, 0]
  const D: number[] = [1, 0]

  const drawZero = (context: any) => {
    context.beginPath()
    context.moveTo(Z[0] + T[0], Z[1] + T[1])
    context.lineTo(Z[2] + T[0], Z[3] + T[1])
    context.stroke()
  }
  // drawing 1, 2, 3, 4, 6
  // PX, PY - factors ABCD correspond to the order of magnitude
  const drawLine = (context: any, DIGIT: number[], PX: number, PY: number) => {
    context.beginPath()
    context.moveTo(((DIGIT[0] * height) / 4) * PX + T[0], (DIGIT[1] * height) / 4 + T[1] + PY * (width - (2 * DIGIT[1] * height) / 4))
    context.lineTo(((DIGIT[2] * height) / 4) * PX + T[0], (DIGIT[3] * height) / 4 + T[1] + PY * (width - (2 * DIGIT[3] * height) / 4))
    context.stroke()
  }
  // drawing 5, 7, 8
  const drawDouble = (context: any, LI: number[], BI: number[], PX: number, PY: number) => {
    drawLine(context, LI, PX, PY)
    drawLine(context, BI, PX, PY)
  }
  // drawing 9
  const drawNine = (context: any, PX: number, PY: number) => {
    drawLine(context, JE, PX, PY)
    drawLine(context, DW, PX, PY)
    drawLine(context, SZ, PX, PY)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    context.strokeStyle = "black"
    context.lineCap = "round"
    context.lineJoin = "round"
    context.lineWidth = 15
    if (wartosc != "") {
      drawZero(context)
      let a: number = Number(wartosc?.slice(-4, -3))
      let b: number = Number(wartosc?.slice(-3, -2))
      let c: number = Number(wartosc?.slice(-2, -1))
      let d: number = Number(wartosc?.slice(-1))
      const arrFunctions = [
        (X: number[]) => drawLine(context, JE, X[0], X[1]),
        (X: number[]) => drawLine(context, DW, X[0], X[1]),
        (X: number[]) => drawLine(context, TR, X[0], X[1]),
        (X: number[]) => drawLine(context, CZ, X[0], X[1]),
        (X: number[]) => drawDouble(context, JE, CZ, X[0], X[1]),
        (X: number[]) => drawLine(context, SZ, X[0], X[1]),
        (X: number[]) => drawDouble(context, JE, SZ, X[0], X[1]),
        (X: number[]) => drawDouble(context, DW, SZ, X[0], X[1]),
        (X: number[]) => drawNine(context, X[0], X[1]),
      ]
      if (d > 0) arrFunctions[d - 1](D)
      if (c > 0) arrFunctions[c - 1](C)
      if (b > 0) arrFunctions[b - 1](B)
      if (a > 0) arrFunctions[a - 1](A)
    }
    // eslint-disable-next-line
  }, [wartosc])

  const fireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = e.target.value
    let isCorrectForm = /^[0-9]+$/.test(value)
    if (isCorrectForm) {
      setWartosc(value)
    } else {
      setWartosc("")
    }
  }

  // DWONLOAD IMAGE, EXTERNAL LIBRARY
  const handleDownloadImage = async () => {
    const element = printRef.current
    const canvas = await html2canvas(element)
    const data = canvas.toDataURL("image/jpg")
    const link = document.createElement("a")
    if (typeof link.download === "string") {
      link.href = data
      link.download = "image.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      window.open(data)
    }
  }

  const [view, setView] = useState(false)
  const handleInfo = () => {
    setView(!view)
  }

  return (
    <div className="flex_container">
      <div className="info">
        {view && (
          <div className="text">
            <span className="title">About The Runes</span>
            <br />
            <br />
            author : Q 2023
            <br />
            task :{" "}
            <a href="https://moleculeone.notion.site/Code-assignment-JS-Q4-22-f1f17670f99245d0b821c5768ea1fcdf" target="_blank">
              Numbers to runic...
            </a>
            <br />
            git repo :{" "}
            <a href="https://github.com/Kervion/runes-public" target="_blank">
              Runes - public
            </a>
            <br />
            algorithm : cross matrix
            <br />
            backgroud : midjourney
          </div>
        )}
        <div className="open" onClick={handleInfo}>
          info
        </div>
      </div>

      <h1 className={caesar.className}>the runes</h1>

      <div ref={printRef} className="square">
        <canvas ref={canvasRef} className="canvas" />
      </div>
      <h4>Insert any number from 0 to 9999</h4>

      <div className="interface">
        <input type="text" value={wartosc} className="inputx" onChange={fireChange} maxLength={4} />
        <button onClick={handleDownloadImage} className="buttonx">
          Generate image
        </button>
      </div>
    </div>
  )
}
