import { useEffect, useState } from 'react'
import { client } from '../api/client.ts'
import { Button } from '@nextui-org/button'

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
    <div className="text-slate-900">
      {count}
      <div>
        <Button color={'primary'}>test client</Button>
      </div>
    </div>
  )
}
