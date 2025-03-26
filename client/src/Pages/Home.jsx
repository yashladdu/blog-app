import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("https://blog-app-backend-wiia.onrender.com/post");
      setPosts(response.data);
    }
    fetchPosts();
  }, []);

  return (
    <div className='blog-grid'>
        {posts.length > 0 ? (
        posts.map((post) => (
          <Post 
            key={post.id} 
            id={post.id}
            image={`https://blog-app-backend-wiia.onrender.com/${post.image}`} // ✅ Make sure this matches the backend response
            category={post.category}
            title={post.title}
            content={post.content}
            createdAt={post.created_at}  
            fname={post.first_name}
            lname={post.last_name}
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  )
}

export default Home