import { gql, useMutation, useQuery } from "@apollo/client"
import React, { useState } from "react"
import "./bookmark.css"

const createBookmarks = gql`
  mutation createBookmark($url: String!, $desc: String!) {
    createBookmark(url: $url, desc: $desc) {
      url
      description
    }
  }
`
const getBookmarks = gql`
  query {
    getBookmark {
      url
      description
    }
  }
`
const Bookmark = () => {
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [createBookmark] = useMutation(createBookmarks)
  const { loading, error, data, refetch } = useQuery(getBookmarks, {
    notifyOnNetworkStatusChange: true,
  })

  const handleSubmit = async e => {
    e.preventDefault()
    if (/^\s+$/.test(url) || /^\s+$/.test(text)) {
      alert("should contain any string")
    } else {
      setUrl("")
      setText("")
      await createBookmark({ variables: { url: url, desc: text } })
      await refetch()
    }
  }
  return (
    <div className="wrapper">
      <div className="container">
        <div className="title">Remember your favourites</div>
        <form onSubmit={handleSubmit} className="form">
          <input
            required
            type="url"
            value={url}
            placeholder="Enter url"
            onChange={e => {
              setUrl(e.target.value)
            }}
          />
          <input
            required
            type="text"
            value={text}
            placeholder="Enter description"
            onChange={e => {
              setText(e.target.value)
            }}
          />
          <button>Add bookmark</button>
        </form>
      </div>
      {loading && <p className="description">loading data ...</p>}
      {error && <p className="description">error ...</p>}
      {data &&
        data?.getBookmark?.map((bookmark, index) => {
          return (
            <div key={index} className="box">
              <p className="description">{bookmark.description}</p>
              <a href={bookmark.url} target="_blank" rel="noreferrer">
                {bookmark.url}
              </a>
            </div>
          )
        })}
    </div>
  )
}

export default Bookmark
