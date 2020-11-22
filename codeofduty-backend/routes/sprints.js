/*
Sprints API routes
*/
const express = require("express");
const request = require("superagent");
const { Sprint } = require("../models.js");

const router = express.Router();

const CONTRIBUTOR_PERCENTAGE = 0.85;
const DEFAULT_THRESHOLD = 0.8;

function getTaskPoints(task) {
  const { labels } = task;
  if (labels && labels.length) {
    const pointsLabel = labels.find((label) => label.name.includes("points:"));
    const points = pointsLabel.name.split(": ")[1];
    return Number(points);
  }
  return 0;
}

function getContributors(tasks) {
  return tasks.reduce((contributors, task) => {
    const { contributor } = task;
    if (contributor) {
      contributors.push({
        user: contributor,
        points_claimed: 0,
        points_at_stake: task.contributor_points,
      });
    }
    return contributors;
  }, []);
}

function getSprintTasks(token, repo, milestone) {
  return request
    .get(
      `https://api.github.com/repos/${repo}/issues?milestone=${milestone.number}`,
    )
    .set("Authorization", `token ${token}`)
    .set("User-Agent", "CodeOfDuty")
    .set("Accept", "application/vnd.github.v3+json")
    .then((result) => {
      const tasksList = result.body;
      const tasks = tasksList.map((task) => {
        const taskPoints = getTaskPoints(task);
        const contributorPoints = Math.round(
          CONTRIBUTOR_PERCENTAGE * taskPoints,
        );
        return {
          issue_url: task.html_url,
          pr_url: null,
          task_status: task.state,
          contributor: task.assignee && task.assignee.login,
          reviewer: null,
          contributor_points: contributorPoints,
          reviewer_points: taskPoints - contributorPoints,
        };
      });
      return tasks;
    })
    .catch((err) => {
      throw err;
    });
}

function calculateBossHealth(tasks) {
  const totalPoints = tasks.reduce(
    (sum, task) => sum + task.contributor_points + task.reviewer_points,
    0,
  );
  return totalPoints;
}

router.route("/create").post(async (req, res) => {
  const token = req.header("authorization");
  const { repo, milestone, victoryThreshold } = req.body;

  if (!repo || !milestone) {
    res.status(400).send({ message: "Missing parameters" });
    return;
  }

  if (!token) {
    res.status(401).send({ message: "Not authorized" });
    return;
  }

  const tasks = await getSprintTasks(token, repo, milestone);
  const bossMaxHealth = calculateBossHealth(tasks);
  const contributors = getContributors(tasks);
  const newSprint = new Sprint({
    repo,
    name: milestone.name,
    sprint_perm_id: milestone.id,
    milestone_url: `https://github.com/${repo}/milestone/${milestone.number}`,
    contributors,
    tasks,
    boss_hp: bossMaxHealth,
    boss_hp_max: bossMaxHealth,
    victory_threshold: victoryThreshold || DEFAULT_THRESHOLD,
    due_date: Date(milestone.due_date),
  });

  newSprint
    .save()
    .then(() => res.json(newSprint))
    .catch((err) => err.status(500).send(err));
});

module.exports = router;