import { useEffect, useState } from 'react'
import { client } from '../api/client.ts'

export default function RandNumb() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    client.randomNumber.subscribe(undefined, {
      onData(data) {
        setCount(data.randomNumber)
      },
    })
  }, [])

  return (
    <div>
      {count}
      <div>
        <button>test client</button>
      </div>
    </div>
  )
}
