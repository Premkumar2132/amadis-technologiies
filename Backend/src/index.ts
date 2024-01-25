//import the neccessary imports 
require('dotenv').config();

import express from 'express'
import cors from 'cors'
import * as RecipeApi from './recipeApi'
// import { Prisma, PrismaClient } from '@prisma/client/edge'
import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();


const app = express(); //create a new express app for us 


app.use(express.json()) //convert the body of requests and responses that we make to json
app.use(cors());

//add end points
app.get("/api/recipes/search", async (req,res)=>{
    //the url might be like this GET https://localhost/api/recipes/search?searchTerm&page=1
    const searchTerm = req.query.searchTerm as string; //so to take the  query we use this
    const page = parseInt(req.query.page as string);
    const results = await RecipeApi.searchRecipes(searchTerm,page)

    return res.json(results);
});

app.get('/api/recipes/:recipeId/summary', async (req,res)=>{
    const recipeId = req.params.recipeId;
    const  results = await RecipeApi.getRecipeSummary(recipeId);
    return res.json(results);
})

app.post("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;
  
    try {
      const favouriteRecipe = await prismaClient.favouriteRecipes.create({
        data: {
          recipeId: recipeId,
        },
      });
      return res.status(201).json(favouriteRecipe);
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: "Oops!, something went wrong."});
    }
  });

  app.get("/api/recipes/favourite", async (req,res)=>{
    try {
      const recipes = await prismaClient.favouriteRecipes.findMany();
      const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());

      const favourites = await RecipeApi.getFavouriteRecipesByIDs(recipeIds);
      return res.json(favourites);
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: "Oops!, something went wrong."})
    }
  })

  app.delete("/api/recipes/favourite", async (req,res)=>{
    const  recipeId = req.body.recipeId
    try {
      await prismaClient.favouriteRecipes.delete({
        where:{
          recipeId
        }
      })
      return res.status(201).send()
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: "Oops!, something went wrong."})
    }
  })

app.listen(5000, ()=>{
    console.log("Server running on localhost:5000");
    
}) //first paramter is port, second is a fucnction 