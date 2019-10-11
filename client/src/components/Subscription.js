import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const Subscription = () => {
  const { data } = useSubscription(gql`
    subscription {
      angka
    }
  `)

  return <div>random number: {data && data.angka}</div>
}

export default Subscription