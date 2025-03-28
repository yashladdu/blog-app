import React, {useState} from 'react'
import axios from "axios";
import { Navigate } from 'react-router-dom';
import Editor from '../components/Editor';

function CreatePost() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [redirect, setRedirect] = useState(false);

  const uploadToCloudinary = async (file, resourceType) => {
    if (!file) return;

    try {
      // Get Cloudinary upload signature
      const signatureRes = await axios.get("https://video-chapters.onrender.com/api/cloudinary-signature");
      const {timestamp, signature, cloud_name, api_key} = signatureRes.data;

      // Prepare FormData for Cloudinary API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("resource_type", resourceType);
      formData.append("upload_preset", "ml_default");

      // Upload file to Cloudinary
      const cloudinaryRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, formData);

      if (resourceType === "image") setImgUrl(cloudinaryRes.data.secure_url);

    } catch (error) {
      console.error("Cloudinary upload error:", error);
    }
  }

  async function createNewPost(event) {
    event.preventDefault();
    
    try {
      const response = await axios.post("https://blog-app-backend-wiia.onrender.com/post", {category, title, content, imgUrl}, {
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

        <input type="file" accept='image/*' onChange={(e) => uploadToCloudinary(e.target.files[0], "image")} required />

        <Editor className="ql-container" value={content} onChange={setContent} />

        <button style={{marginTop: "10px"}}>Create Post</button>
    </form>
  )
}

export default CreatePost