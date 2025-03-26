import React, {useState, useEffect} from 'react'
import axios from "axios";
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../components/Editor';


function EditPost() {
    const {id} = useParams();
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
      const fetchPost = async () => {
        const response = await axios.get(`http://localhost:5000/post/${id}`);
        const post = response.data;
        setCategory(post.category);
        setTitle(post.title);
        setContent(post.content);
     
      }
      fetchPost();
    }, []);

    async function updatePost(event) {
      event.preventDefault();

      const data = new FormData();
      data.append("category", category);
      data.append("title", title);
      data.append("content", content);
      if (imgFile?.[0]) {
        data.append("image", imgFile?.[0]);
      } 
      
      const response = await axios.put(`http://localhost:5000/post/${id}`, data, {
        headers: {"Content-Type": "multipart/form-data"},
        withCredentials: true, 
      });
      console.log(response.data);
      setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={"/post/" + id} />
      }
    
      return (
        <form className='post-form' onSubmit={updatePost}>
          <select name="category" id="category" value={category} onChange={event => setCategory(event.target.value)} required >
          <option value="" disabled>Select a category</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Company">Company</option>
            <option value="Technology">Technology</option>
          </select>
    
            <input type="text" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} required />
    
            <input type="file" accept='image/*' onChange={event => setImgFile(event.target.files)} />
    
            <Editor className="ql-container" value={content} onChange={setContent} />
    
            <button style={{marginTop: "10px"}}>Update Post</button>
        </form>
      )
}

export default EditPost