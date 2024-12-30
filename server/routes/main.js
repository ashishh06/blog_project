const express=require('express');
const router=express.Router();
const Post =require('../models/Post')
router.get('/',async (req,res)=>{
    try{
      const locals={
        title:"blog",
        discription:"simple blog"
    }
    let perPage = 6;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });
    }catch(err){
      console.log(err);
    }
})

router.get('/post/:id', async (req, res) => {

  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    let slug=req.params.id;


    const data = await Post.findById({_id:slug});
    res.render('post', { locals, data ,
      currentRoute:`/post/${slug}`});
  } catch (error) {
    console.log(error);
  }
});



router.post('/search', async (req, res) => {

  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    let searchTerm=req.body.searchTerm;
    const searchNoSpecialChar=searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        {title:{$regex: new RegExp(searchNoSpecialChar,'i')}},
        {body:{$regex: new RegExp(searchNoSpecialChar,'i')}}
      ]
    });
    res.render('search',{
      data,
      locals
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/about',(req,res)=>{
  res.render('/about',{currentRoute:'/about'}
)
})


// function insertPostData() {
//   Post.insertMany([
//     {
//       title: "The Magic of Morning Coffee",
//       body: "Explore why coffee lovers swear by their morning brew and its impact on starting the day."
//     },
//     {
//       title: "A Beginner's Guide to Indoor Plants",
//       body: "Learn how to care for low-maintenance plants to brighten your living space."
//     },
//     {
//       title: "Top 5 Travel Destinations for 2024",
//       body: "Discover breathtaking places to add to your travel bucket list this year."
//     },
//     {
//       title: "Why Reading Fiction is Good for Your Brain",
//       body: "Dive into the cognitive benefits of losing yourself in a good story."
//     },
//     {
//       title: "Simple Recipes for Busy Weeknights",
//       body: "Quick and easy meal ideas to make after a long day at work."
//     },
//     {
//       title: "The Basics of Personal Finance",
//       body: "Understand budgeting and saving to take control of your finances."
//     },
//     {
//       title: "Workout Tips for Beginners",
//       body: "Start your fitness journey with these easy-to-follow exercise tips."
//     },
//     {
//       title: "Understanding the Latest Tech Trends",
//       body: "Get a brief overview of emerging technologies shaping the future."
//     },
//     {
//       title: "How to Build a Minimalist Wardrobe",
//       body: "Tips for decluttering and creating a versatile collection of clothes."
//     },
//     {
//       title: "Exploring the Art of Minimalism",
//       body: "Learn the philosophy behind 'less is more' and its benefits for a simple life."
//     }
//   ]);
// }
// insertPostData();



module.exports=router