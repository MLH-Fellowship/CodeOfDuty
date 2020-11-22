const mongoose = require("mongoose");

const sprintOverviewSchema = new mongoose.Schema({
  _id: String,
  name: String,
  sprint_perm_id: String,
  due_date: Date,
});

const repoLevelContributorSchema = new mongoose.Schema({
  user: String,
  points_claimed: Number,
});

const sprintLevelContributorSchema = new mongoose.Schema({
  user: String,
  points_claimed: Number,
  points_at_stake: Number,
});

const taskSchema = new mongoose.Schema({
  title: String,
  issue_url: String,
  pr_url: String,
  task_status: String,
  contributor: String,
  reviewer: String,
  contributor_points: Number,
  reviewer_points: Number,
});

const repoSchema = new mongoose.Schema({
  _id: String, // repo_name
  maintainer: String,
  past_sprints: [sprintOverviewSchema],
  active_sprints: [sprintOverviewSchema],
  contributors: [repoLevelContributorSchema],
});

const sprintSchema = new mongoose.Schema({
  repo: String,
  name: String,
  sprint_perm_id: String,
  milestone_url: String,
  contributors: [sprintLevelContributorSchema],
  tasks: [taskSchema],
  boss_hp: Number,
  boss_hp_max: Number,
  victory_threshold: Number,
  due_date: Date,
});

const Repo = mongoose.model("Repo", repoSchema);
const Sprint = mongoose.model("Sprint", sprintSchema);

module.exports = {
  Repo,
  Sprint,
};
