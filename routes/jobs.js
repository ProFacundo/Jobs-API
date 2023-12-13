const express = require("express");
const {
  createJobs,
  getAllJobs,
  getJob,
  updateJobs,
  deleteJobs,
} = require("../controllers/jobs");
const router = express.Router();

router.route("/").post(createJobs).get(getAllJobs);
router.route("/:id").get(getJob).patch(updateJobs).delete(deleteJobs);

module.exports = router;
