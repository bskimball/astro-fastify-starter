import { type ReactNode } from 'react'
import { Card as NextCard, CardHeader, CardBody } from '@nextui-org/card'

type Props = {
  title: string
  href?: string
  children?: ReactNode
}

export default function Card(props: Props) {
  return (
    <NextCard className="p-4">
      <CardHeader>
        <a href={props.href || ''} className="text-lg font-semibold">
          {props.title}
        </a>
      </CardHeader>
      <CardBody>{props.children || null}</CardBody>
    </NextCard>
  )
}
