import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { uploadClient } from '../graphql'

const UPLOAD = gql`
  mutation upload ($file: Upload!) {
    upload (file: $file)
  }
`

export default function Upload() {
  const [upload] = useMutation(UPLOAD, {
    client: uploadClient,
    onCompleted(data) {
      console.log(data)
    },
    onError(error) {
      console.log(error.message)
    }
  })
  const [file, setFile] = useState(null)

  const handleUpload = () => {
    upload({
      variables: {
        file
      }
    })
  }

  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Submit</button>
    </div>
  )
}