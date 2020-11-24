/* eslint-disable no-console */
/*
Sprints API routes
*/
const express = require("express");
const request = require("superagent");
const { Repo, Sprint } = require("../models.js");

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
          title: task.title,
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

function createWebhook(token, repo, event, url) {
  return request
    .post(`https://api.github.com/repos/${repo}/hooks`)
    .set("Accept", "application/vnd.github.v3+json")
    .set("Authorization", `token ${token}`)
    .set("User-Agent", "CodeOfDuty")
    .send({
      name: "web",
      config: {
        url,
        content_type: "json",
        insecure_ssl: 0,
      },
      events: [event],
    })
    .then((result) => result)
    .catch((err) => err);
}

router.route("/create").post(async (req, res) => {
  const token = req.header("authorization");
  const { user, repo, milestone, victoryThreshold } = req.body;

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

  // Create new Sprint
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
    due_date: milestone.dueDate,
  });

  // Add new sprint to repo (if exists, else create a new repo)
  Repo.findOne({ _id: repo }, (err, doc) => {
    if (doc === null) {
      /* If repo doesn't exist */
      const newRepo = new Repo({
        _id: repo,
        maintainer: user,
        past_sprints: [],
        active_sprints: [newSprint],
        contributors: [],
        due_date: milestone.dueDate,
      });
      newRepo.save().then(() => {
        console.log(`Repo ${repo} added to the db`);
        Promise.resolve(this);
      });
    } else {
      /* Add sprint to active sprints if repo is present in db */
      Repo.findOneAndUpdate(
        { _id: repo },
        {
          $push: {
            active_sprints: newSprint,
          },
        },
        { new: true, upsert: false },
        (error) => {
          if (error) {
            res.status(500).send(error);
          } else {
            console.log(`Sprint ${newSprint.name} added to Repo ${repo}`);
            Promise.resolve(this);
          }
        },
      );
    }
  });

  // Save the sprint to db
  newSprint
    .save()
    .then(() => console.log(`Sprint ${newSprint.name} added to the db`))
    .catch((err) => res.status(500).send(err));

  // Attach webhooks to sprint
  const issueWebhook = await createWebhook(
    token,
    repo,
    "issues",
    process.env.ISSUE_WEBHOOK_URL,
  );
  const prWebhook = await createWebhook(
    token,
    repo,
    "pull_request",
    process.env.PR_WEBHOOK_URL,
  );
  const milestoneWebhook = await createWebhook(
    token,
    repo,
    "milestone",
    process.env.MILESTONE_WEBHOOK_URL,
  );

  if (
    issueWebhook.status !== 201 ||
    prWebhook.status !== 201 ||
    milestoneWebhook !== 201
  ) {
    res.status(500).send({ message: "Error creating webhooks" });
  } else {
    console.log("Webhooks added successfully");
    res.status(200).send({ message: "Sprint created successfully" });
  }
});

module.exports = router;
