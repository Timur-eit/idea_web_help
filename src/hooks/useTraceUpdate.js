import {useEffect, useRef} from "react"

export default function useTraceUpdate(props) {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((accumulator, [key, value]) => {
      if (prev.current[key] !== value) {
        accumulator[key] = [prev.current[key], value]
      }
      return accumulator
    }, {})
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}