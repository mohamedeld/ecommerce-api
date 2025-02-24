const express = require("express");

const router = express.Router();

const {protect,authorize} = require("../controllers/userController");
const {createReview,updateReview,deleteReview,getAllReviews,getSingleReview} = require("../controllers/reviewController");


router.route("/").get(getAllReviews).post(protect,authorize("user"),createReview);

router.route("/:id").get(getSingleReview).put(protect,authorize("user","admin"),updateReview).delete(protect,authorize("user","admin"),deleteReview);

module.exports = router;