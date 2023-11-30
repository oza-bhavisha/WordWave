import React, { useRef, useState } from "react";
import "./CreatePost.css";
import "./NavBar";
import "./HomePage";
import "./BlogPost";
import NavBar from "./NavBar";
import axiosInstance from "../axios";
import { Alert } from "react-bootstrap";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState();
  const [loading, setLoading] = useState();

  const inputRef = useRef(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleimage = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("title", title);
    formData.append("content", content);
    axiosInstance
      .post("/blog/add", formData)
      .then(({ data }) => {
        console.log(data);
        setMessage(data.message);
        setContent("");
        setImage();

        setTitle("");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setImage();
      });
  };

  return (
    <>
      <NavBar />
      <div className="create-post-container">
        {message && <Alert variant="success">{message}</Alert>}
        <h2 className="form-title">Create a New Blog Post</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              rows="5"
            />
          </div>
          {image ? (
            <div>
              <p
                variant="body1"
                sx={{ marginTop: "10px", marginBottom: "10px" }}
              >
                Uploaded Image
              </p>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                style={{ maxWidth: "100%" }}
              />
            </div>
          ) : (
            <input ref={inputRef} type="file" onChange={handleimage} />
          )}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
