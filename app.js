const express = require("express");
const { randomUUID } = require("crypto");
const { response } = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

let albums = [];

fs.readFile("albums.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    albums = JSON.parse(data);
  }
});

app.post("/new-album", (req, res) => {
  const { name, price } = req.body;
  const album = {
    name,
    price,
    id: randomUUID(),
  };
  albums.push(album);

  createAlbumFile();
  return res.json(album);
});

app.get("/albums", (req, res) => {
  return res.json(albums);
});

app.get("/albums/:id", (req, res) => {
  const { id } = req.params;
  const album = albums.find((album) => album.id === id);
  return res.json(album);
});

app.put("/albums/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const albumIndex = albums.findIndex((album) => album.id === id);
  albums[albumIndex] = {
    ...albums[albumIndex],
    name,
    price,
  };

  createAlbumFile();

  return res.json({ message: "Album changed successfully" });
});

app.delete("/albums/:id", (req, res) => {
  const { id } = req.params;
  const albumIndex = albums.findIndex((album) => album.id === id);
  albums.splice(albumIndex, 1);
  createAlbumFile();
  return res.json({ message: "Album deleted successfully" });
});

function createAlbumFile() {
  fs.writeFile("albums.json", JSON.stringify(albums), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Album added to file");
    }
  });
}

app.listen(4002, () => console.log("Server is online on port 4002"));
