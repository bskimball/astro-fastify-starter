import { useEffect, useState } from 'react'
import { client } from '../utils/client.ts'

export default function RandNumb() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    client.randomNumber.subscribe(undefined, {
      onData(data) {
        // @ts-ignore
        setCount(data.randomNumber)
      },
    })
  }, [])

  return <div className="text-slate-900">{count}</div>
}
