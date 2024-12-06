import { type ReactNode } from 'react'

type Props = {
  title: string
  href?: string
  children?: ReactNode
}

export default function Card(props: Props) {
  return (
    <div className="p-4 dark:border rounded-xl shadow-xl">
      <div>
        <a href={props.href || ''} className="text-lg font-semibold">
          {props.title}
        </a>
      </div>
      <div>{props.children || null}</div>
    </div>
  )
}
