const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");
const Student = require("../models/Student");
const Course = require("../models/Course");

// ===== USER CRUD =====
router.post("/user", async (req,res)=>{
  res.send(await User.create(req.body));
});

router.get("/user", async (req,res)=>{
  res.send(await User.find());
});

router.put("/user/:id", async (req,res)=>{
  res.send(await User.findByIdAndUpdate(req.params.id, req.body, {new:true}));
});

router.delete("/user/:id", async (req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// ===== ONE TO MANY =====
router.post("/post", async (req,res)=>{
  res.send(await Post.create(req.body));
});

router.get("/post", async (req,res)=>{
  res.send(await Post.find().populate("userId"));
});

// ===== MANY TO MANY =====
router.post("/student", async (req,res)=>{
  res.send(await Student.create(req.body));
});

router.post("/course", async (req,res)=>{
  res.send(await Course.create(req.body));
});

router.post("/enroll", async (req,res)=>{
  const {studentId, courseId} = req.body;

  await Student.findByIdAndUpdate(studentId, {
    $addToSet: { courses: courseId }
  });

  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { students: studentId }
  });

  res.send("Enrolled");
});

router.get("/student", async (req,res)=>{
  res.send(await Student.find().populate("courses"));
});

router.get("/course", async (req,res)=>{
  res.send(await Course.find().populate("students"));
});

module.exports = router;