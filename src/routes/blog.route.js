import {
     addComment,
    getCommentsOfPost,
    deleteComment,
    updateComment,
    likeComment,
} from '../controllers/blog/comments.js'

import {
    addpost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost
} from '../controllers/blog/post.js'

import { Authenticate } from '../middlewares/authmiddleware.js'
import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { blogFiles } from '../middlewares/multermiddleware.js'

const router= Router()

router.post("/posts",Authenticate,blogFiles.array("files"),asyncHandler(addpost))
router.get("/posts",asyncHandler(getPosts))
router.get("/posts/:postId",asyncHandler(getPostById))
router.put("/posts/:postId",blogFiles.array("files"),Authenticate,asyncHandler(updatePost))
router.delete("/posts/:postId",Authenticate,asyncHandler(deletePost))
router.patch("/posts/:postId/like",asyncHandler(likePost))


router.get("/posts/:postId/comments",asyncHandler(getCommentsOfPost))
router.post("/posts/:postId/comments",asyncHandler(addComment))
router.put("/comments/:commentId",asyncHandler(updateComment))
router.delete("/comments/:commentId",asyncHandler(deleteComment))
router.patch("/comments/:commentId/like",asyncHandler(likeComment))

export {router as blog}