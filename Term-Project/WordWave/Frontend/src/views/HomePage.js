import React, { useState, useEffect } from "react";
import "./HomePage.css";
import "./NavBar";
import NavBar from "./NavBar";
import axiosInstance from "../axios";
import { Col, Row } from "react-bootstrap";

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search) {
      getPost(search);
    }
  };

  const getPost = (query) => {
    console.log(query);
    axiosInstance
      .get(
        query
          ? `blog?search=${query}`
          : "/blog"
      )
      .then(({ data }) => {
        setPosts(data);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <NavBar />
      <div className="p-5">
        <h1 className="page-title text-center mb-3">Blog Posts</h1>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            aria-describedby="basic-addon2"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                handleSearch();
              }}
            >
              Search
            </button>
          </div>
        </div>
        <Row>
          {posts.length > 0 ? (
            posts.map((post, key) => (
              <Col xs={6}>
                <BlogCard
                  title={post.title}
                  content={post.content}
                  imageUrl={post.imgUrl}
                  key={key}
                />
              </Col>
            ))
          ) : (
            <p className="no-posts">No posts available.</p>
          )}
        </Row>
      </div>
    </>
  );
};

const BlogCard = ({ title, content, imageUrl }) => {
  return (
    <div className="card shadow mb-4">
      <img
        src={imageUrl}
        className="card-img-top"
        alt="Blog"
        style={{ height: "300px" }}
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
};
export default HomePage;
