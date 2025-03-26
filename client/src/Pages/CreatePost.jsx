import React, {useState} from 'react'
import axios from "axios";
import { Navigate } from 'react-router-dom';
import Editor from '../components/Editor';

function CreatePost() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(event) {
    event.preventDefault();

    const data = new FormData();
    data.append("category", category);
    data.append("title", title);
    data.append("content", content);
    data.append("image", imgFile);

    try {
      const response = await axios.post("http://localhost:5000/post", data, {
        headers: {"Content-Type": "multipart/form-data"}, // Required for file upload
        withCredentials: true
      });
      if (response.data) {
        setRedirect(true);
      };
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to="/" />
  }

  return (
    <form className='post-form' onSubmit={createNewPost}>
      <select name="category" id="category" value={category} onChange={event => setCategory(event.target.value)} required >
      <option value="" disabled>Select a category</option>
        <option value="Engineering">Engineering</option>
        <option value="Product">Product</option>
        <option value="Design">Design</option>
        <option value="Company">Company</option>
        <option value="Technology">Technology</option>
        <option value="Business">Business</option>
        <option value="Self-Improvement">Self-Improvement</option>
        <option value="Science">Science</option>
      </select>

        <input type="text" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} required />

        <input type="file" accept='image/*' onChange={event => setImgFile(event.target.files[0])} required />

        <Editor className="ql-container" value={content} onChange={setContent} />

        <button style={{marginTop: "10px"}}>Create Post</button>
    </form>
  )
}

export default CreatePost