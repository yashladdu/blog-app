import React from 'react'
import {format} from "date-fns"
import {Link} from "react-router-dom"

function Post(props) {
  function truncateHTMLContent(html, wordLimit) {
    const div = document.createElement("div");
    div.innerHTML = html; // Convert HTML string to DOM elements
    const textContent = div.textContent || div.innerText || ""; // Extract text
    const words = textContent.split(/\s+/).slice(0, wordLimit).join(" ") + "..."; // Limit to 50 words
    return words;
  }

  return (
    <div className="blog-card">
      <Link to={`/post/${props.id}`}>
        <img src={props.image} />
      </Link>
      <div className="blog-content">
        <p>{props.category}</p>
        <Link to={`/post/${props.id}`}>
          <h2>{props.title}</h2>
        </Link>
        
        {/* <p className="description">{props.content}</p> */}
        <div className="description" dangerouslySetInnerHTML={{__html: truncateHTMLContent(props.content, 20)}} />
      </div>
      <div className="blog-footer">
        <div className="author">
            {/* <img src="https://i.pravatar.cc/40?img=1" alt="Author's Avatar" /> */}
            <p className="author-name">By: {props.fname} {props.lname}</p>
        </div>
        <p className="date">{format(new Date(props.createdAt), "MMM d, yyyy")}</p>
      </div>
    </div>
  )
}

export default Post