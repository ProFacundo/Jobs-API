const Job = require("../models/Job");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const userId = req.user.userId;
  const jobs = await Job.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await Job.find({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id pf ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJobs = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJobs = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;

  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) {
    throw new NotFoundError(`No job with id pf ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJobs = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id pf ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJobs, deleteJobs, updateJobs };
