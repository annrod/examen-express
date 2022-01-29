const express = require('express');
const { restart } = require('nodemon');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
//const posts = [];
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests

server.post('/posts',(req,res)=>{
  const {author,title,contents}=req.body;
    if(author && title && contents){
      const newPost={
        id:newId(),
        author,
        title,
        contents,
      };
      posts.push(newPost);
      return res.json(newPost);
      
    }else{
      return res.status(STATUS_USER_ERROR).json({
        error: 'No se recibieron los parametros necesarios para crear el Post',
      });
    }  
});

server.post('/posts/author/:author',(req,res)=>{
  const {title,contents}=req.body;
  const author = req.params.author;
    if(author && contents && title){
      const newPost={
        id:newId(),
        author,
        title,
        contents,
      };
      posts.push(newPost);
      return res.json(newPost);
      
    }else{
      return res.status(STATUS_USER_ERROR).json({
        error: 'No se recibieron los parametros necesarios para crear el Post',
      });
    }  
});

server.get('/posts',(req,res)=>{
  const termfilter = req.query.term;
  
  if(termfilter){
    const filter = posts.filter( post => post.title.includes(termfilter) || post.contents.includes(termfilter));
    return res.json(filter);
  }else{
    return res.json(posts);
  }
});


server.get('/posts/:author',(req,res)=>{
  const author = req.params.author;
  if(author){
    const filter = posts.filter(post => post.author === author);
    if(filter.length > 0){
      return res.json(filter);
    }else{
      return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"});  
    }
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"});
  };
  
});

server.get('/posts/:author/:title',(req,res)=>{
  const author = req.params.author;
  const title = req.params.title;

  const filter = posts.filter(post => {
    if (post.author == author && post.title == title){
      return post
    }
  });

  if (filter.length>0){
    return res.json(filter);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado"
    });
  }
});

server.put('/posts',(req,res)=>{
const {id,title,contents} = req.body;

  if(id && title && contents){
    const newPost = posts.find(post => post.id === id);
    if(newPost){
      newPost.title=title;
      newPost.contents=contents;
      res.json(newPost);
    }else{
      res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con el id indicado"});
    }
  }else{
    res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"});
  }
});

server.delete('/posts',(req,res)=>{
  const {id} = req.body;

  if (id) {
    if (posts.find((auxpost) => auxpost.id === id)) {
      posts.splice(posts.findIndex((auxpost) => auxpost.id === id),1);
      return res.json({ success: true });
    } else {
      return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
});

server.delete('/author',(req,res)=>{
  const {author} = req.body;
  const findpost = posts.find(auxp => auxp.author === author);

  if(author){
    if(findpost){
      posts = posts.filter(auxp => auxp.author === author);
      res.json(posts);
    }else{
      res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"});  
    }
  }else{
    res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
  } 
});

module.exports = { posts, server };
