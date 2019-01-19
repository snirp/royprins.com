import React from "react"
import Layout from "../components/Layout"

export default () => (
  <Layout>
    <h1>This is hi</h1>
    <p>Welcome to my website</p>
    <button>Contact me</button>

    <segment id="about">
      <h2>About me</h2>
      <p>Lorem ipsum and such</p>
      
    </segment>

    <segment id="projects">
      <h2>Projects</h2>
      <ul>
        <li>Project 1</li>
        <li>Project 2</li>
        <li>Project 3</li>
        <li>Project 4</li>
      </ul>
      <a href="#">MORE</a>
    </segment>

    <segment id="libaries">
      <h2>Libraries</h2>
      <p>Open source stuff for the general good.</p>
      <ul>
        <li>Lib 1</li>
        <li>Lib 2</li>
        <li>Lib 3</li>
      </ul>
    </segment>

    <segment id="blog">
      <h2>Blog posts</h2>
      <ul>
        <li>Post 1</li>
        <li>Post 2</li>
        <li>Post 3</li>
      </ul>
      <a href="#">MORE</a>
    </segment>

  </Layout>
)
