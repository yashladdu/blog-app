import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {format} from "date-fns"
import { UserContext } from '../userContext';

function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const {id} = useParams();
  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`https://blog-app-backend-wiia.onrender.com/post/${id}`);
      setPostInfo(response.data);
    }
    fetchPost();
  }, []);

  async function deletePost()  {
    const response = await axios.delete(`https://blog-app-backend-wiia.onrender.com/post/${id}`);
    console.log(response);
    alert("Post deleted successfully");
    setRedirect(true);
  }

  if (!postInfo) return "This post doesn't exist!";
  if (redirect) {
    return <Navigate to={"/"} />
  }

  return (
    <div className='post-page'>
      <div className='image'>
        <img src={`https://blog-app-backend-wiia.onrender.com/${postInfo.image}`} alt="post image" />
      </div>
      <div className="post-content">
        {/* <p>{postInfo.category}</p> */}
        <h1>{postInfo.title}</h1>
        <div className="post-meta"> 
            Published on: {format(new Date(postInfo.created_at), "MMM d, yyyy")} | By: {postInfo.first_name} {postInfo.last_name}
        </div>
        <div dangerouslySetInnerHTML={{__html: postInfo.content}} />
      </div>
      {userInfo?.id === postInfo.user_id && (
        <div className='btn-row'>
          <Link to={`/edit/${postInfo.id}`} className='btn'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Edit Post</Link>
          <Link to={``} onClick={deletePost} className='btn'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          Delete Post</Link>
        </div>
      )}
    </div>
  )
}

export default PostPage
