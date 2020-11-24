const express = require("express");
const GithubGraphQLApi = require("node-github-graphql");
const models = require("../models.js");
require("dotenv").config();

const router = express.Router();
const github = new GithubGraphQLApi({
  token: process.env.GITHUB_API_TOKEN,
});
const CONTRIBUTOR_PERCENTAGE = 0.85;
// const DEFAULT_THRESHOLD = 0.8;

router.route("/issue").post(async (req, res) => {
  // Check if issue is milestoned and has an assignee and labels
  if (
    req.body.action === "milestoned" &&
    req.body.issue.assignee &&
    req.body.issue.labels
  ) {
    const pointsLabel = req.body.issue.labels.find((label) =>
      label.name.includes("points:"),
    );
    // check if the issue has a points label
    if (pointsLabel) {
      const points = pointsLabel.name.split(": ")[1];
      // Check if a task has already been created
      const taskExists = await models.Sprint.findOne({
        milestone_url: req.body.milestone.html_url,
        "tasks.issue_url": req.body.issue.html_url,
        "tasks.contributor": req.body.issue.assignee.login,
      });
      // Do the job if its not done
      if (!taskExists) {
        // Create a task
        const task = {
          title: req.body.issue.title,
          issue_url: req.body.issue.html_url,
          pr_url: null,
          task_status: "in-progress",
          contributor: req.body.issue.assignee.login,
          reviewer: null,
          contributor_points: Math.round(CONTRIBUTOR_PERCENTAGE * points),
          reviewer_points: points - Math.round(CONTRIBUTOR_PERCENTAGE * points),
        };
        // Push the task and change the boss points
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          {
            $inc: { boss_hp: points, boss_hp_max: points },
            $push: { tasks: task },
          },
        );
        // Check if user is in the contributor list
        const contributors = await models.Sprint.findOne({
          milestone_url: req.body.milestone.html_url,
          "contributors.user": req.body.issue.assignee.login,
        });
        // If the user is in the contributor list, pdate the points
        if (contributors) {
          await models.Sprint.findOneAndUpdate(
            {
              milestone_url: req.body.milestone.html_url,
              "contributors.user": req.body.issue.assignee.login,
            },
            {
              $inc: {
                "contributors.$.points_at_stake": Math.round(
                  CONTRIBUTOR_PERCENTAGE * points,
                ),
              },
            },
          );
        }
        // If the user is a first time contributor, push the new contributor to the contributors list
        else {
          const contributor = {
            user: req.body.issue.assignee.login,
            points_claimed: 0,
            points_at_stake: Math.round(CONTRIBUTOR_PERCENTAGE * points),
          };
          await models.Sprint.findOneAndUpdate(
            { milestone_url: req.body.milestone.html_url },
            { $push: { contributors: contributor } },
          );
        }
      }
    }
  }
  // Check if issue is milestoned and has an assignee and labels
  else if (
    req.body.action === "assigned" &&
    req.body.issue.milestone &&
    req.body.issue.labels
  ) {
    const pointsLabel = req.body.issue.labels.find((label) =>
      label.name.includes("points:"),
    );
    // check if the issue has a points label
    if (pointsLabel) {
      // (pointsLabel);
      const points = Number(pointsLabel.name.split(": ")[1]);
      // Check if a task has already been created
      const taskExists = await models.Sprint.findOne({
        milestone_url: req.body.issue.milestone.html_url,
        "tasks.issue_url": req.body.issue.html_url,
        "tasks.contributor": req.body.issue.assignee.login,
      });
      // Do the job if its not done
      if (!taskExists) {
        // Create a task
        const task = {
          title: req.body.issue.title,
          issue_url: req.body.issue.html_url,
          pr_url: null,
          task_status: "in-progress",
          contributor: req.body.issue.assignee.login,
          reviewer: null,
          contributor_points: Math.round(CONTRIBUTOR_PERCENTAGE * points),
          reviewer_points: points - Math.round(CONTRIBUTOR_PERCENTAGE * points),
        };
        // Push the task and change the boss points
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.issue.milestone.html_url },
          {
            $inc: { boss_hp: points, boss_hp_max: points },
            $push: { tasks: task },
          },
        );
        // Check if user is in the contributor list
        const contributors = await models.Sprint.findOne({
          milestone_url: req.body.issue.milestone.html_url,
          "contributors.user": req.body.issue.assignee.login,
        });
        // If the user is in the contributor list, update the points
        if (contributors) {
          await models.Sprint.findOneAndUpdate(
            {
              milestone_url: req.body.issue.milestone.html_url,
              "contributors.user": req.body.issue.assignee.login,
            },
            {
              $inc: {
                "contributors.$.points_at_stake":
                  CONTRIBUTOR_PERCENTAGE * points,
              },
            },
          );
        }
        // If the user is a first time contributor, push the new contributor to the contributors list
        else {
          const contributor = {
            user: req.body.issue.assignee.login,
            points_claimed: 0,
            points_at_stake: CONTRIBUTOR_PERCENTAGE * points,
          };
          await models.Sprint.findOneAndUpdate(
            { milestone_url: req.body.issue.milestone.html_url },
            { $push: { contributors: contributor } },
          );
        }
      }
    }
  } else if (
    req.body.action === "labeled" &&
    req.body.issue.milestone &&
    req.body.issue.assignee
  ) {
    const pointsLabel = req.body.issue.labels.find((label) =>
      label.name.includes("points:"),
    );
    // check if the issue has a points label
    if (pointsLabel) {
      const points = Number(pointsLabel.name.split(": ")[1]);
      // Check if a task has already been created
      const taskExists = await models.Sprint.findOne({
        milestone_url: req.body.issue.milestone.html_url,
        "tasks.issue_url": req.body.issue.html_url,
        "tasks.contributor": req.body.issue.assignee.login,
      });
      // Do the job if its not done
      if (!taskExists) {
        // Create a task
        const task = {
          title: req.body.issue.title,
          issue_url: req.body.issue.html_url,
          pr_url: null,
          task_status: "in-progress",
          contributor: req.body.issue.assignee.login,
          reviewer: null,
          contributor_points: Math.round(CONTRIBUTOR_PERCENTAGE * points),
          reviewer_points: points - Math.round(CONTRIBUTOR_PERCENTAGE * points),
        };
        // Push the task and change the boss points
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.issue.milestone.html_url },
          {
            $inc: { boss_hp: points, boss_hp_max: points },
            $push: { tasks: task },
          },
        );
        // Check if user is in the contributor list
        const contributors = await models.Sprint.findOne({
          milestone_url: req.body.issue.milestone.html_url,
          "contributors.user": req.body.issue.assignee.login,
        });
        // If the user is in the contributor list, pdate the points
        if (contributors) {
          await models.Sprint.findOneAndUpdate(
            {
              milestone_url: req.body.issue.milestone.html_url,
              "contributors.user": req.body.issue.assignee.login,
            },
            {
              $inc: {
                "contributors.$.points_at_stake":
                  CONTRIBUTOR_PERCENTAGE * points,
              },
            },
          );
        }
        // If the user is a first time contributor, push the new contributor to the contributors list
        else {
          const contributor = {
            user: req.body.issue.assignee.login,
            points_claimed: 0,
            points_at_stake: CONTRIBUTOR_PERCENTAGE * points,
          };
          await models.Sprint.findOneAndUpdate(
            { milestone_url: req.body.issue.milestone.html_url },
            { $push: { contributors: contributor } },
          );
        }
      }
    }
  }

  res.send({
    statusCode: 200,
    message: "Done",
  });
});

router.route("/pullrequest").post(async (req, res) => {
  if (req.body.action === "closed" && req.body.pull_request.merged === true) {
    await github.query(
      `
      {
        resource(url: "${req.body.pull_request.html_url}") {
          ... on PullRequest {
            timelineItems(itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT], first: 100) {
              nodes {
                ... on ConnectedEvent {
                  id
                  subject {
                    ... on Issue {
                      number
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
      null,
      // eslint-disable-next-line no-unused-vars
      async (result, err) => {
        if (result.data.resource.timelineItems.nodes[0]) {
          const issueNumber = result.data.resource.timelineItems.nodes[
            result.data.resource.timelineItems.nodes.length - 1
          ].subject.number.toString();
          // Fetch Issue URL
          const issueUrl = `${req.body.repository.html_url}/issues/${issueNumber}`;
          // Check if Reviewer Exists in DB
          const reviewerExists = await models.Sprint.findOne({
            "tasks.reviewer":
              req.body.pull_request.requested_reviewers[0].login,
            "tasks.issue_url": issueUrl,
          });
          // If Reviewer exists, subtract reviewer points at stake, add points claimed
          if (reviewerExists) {
            // Check if the PR is associated with a milestoned issue
            const details = await models.Sprint.findOne({
              "tasks.issue_url": issueUrl,
            });
            // If PR is associated to a milestoned issue, do the job
            if (details) {
              const prLink = req.body.pull_request.html_url;
              let contributorPoints = 0;
              let reviewerPoints = 0;
              const contributor = req.body.pull_request.assignee.login;
              const reviewer =
                req.body.pull_request.requested_reviewers[0].login;
              // eslint-disable-next-line camelcase
              const { milestone_url } = details;
              details.tasks.forEach(async (task) => {
                if (
                  task.issue_url === issueUrl &&
                  task.contributor === contributor
                ) {
                  contributorPoints = task.contributor_points;
                  reviewerPoints = task.reviewer_points;
                }
              });
              // Decrease boss health
              await models.Sprint.findOneAndUpdate(
                {
                  "tasks.issue_url": issueUrl,
                },
                {
                  "tasks.$.pr_url": prLink,
                  "tasks.$.task_status": "Done",
                  $inc: { boss_hp: -(contributorPoints + reviewerPoints) },
                },
              );
              // Add points claimed andsubtract points at stake for contributor
              await models.Sprint.findOneAndUpdate(
                {
                  milestone_url,
                  "contributors.user": contributor,
                },
                {
                  $inc: {
                    "contributors.$.points_claimed": contributorPoints,
                    "contributors.$.points_at_stake": -contributorPoints,
                  },
                },
              );
              // Add points claimed andsubtract points at stake for reviewer
              await models.Sprint.findOneAndUpdate(
                {
                  milestone_url,
                  "contributors.user": reviewer,
                },
                {
                  $inc: {
                    "contributors.$.points_claimed": reviewerPoints,
                    "contributors.$.points_at_stake": -reviewerPoints,
                  },
                },
              );
              // Add points to repo
              const repoName = details.repo;
              const contributorExists = await models.Repo.findOne({
                _id: repoName,
                "contributors.user": contributor,
              }).exec();
              if (contributorExists) {
                await models.Repo.findOneAndUpdate(
                  {
                    _id: repoName,
                    "contributors.user": contributor,
                  },
                  {
                    $inc: {
                      "contributors.$.points_claimed": contributorPoints,
                    },
                  },
                );
              } else {
                const contributorObject = {
                  user: contributor,
                  points_claimed: contributorPoints,
                };
                await models.Repo.findOneAndUpdate(
                  { _id: repoName },
                  { $push: { contributors: contributorObject } },
                );
              }
              const checkReviewer = await models.Repo.findOne({
                _id: repoName,
                "contributors.user": reviewer,
              });
              if (checkReviewer) {
                await models.Repo.findOneAndUpdate(
                  {
                    repo_name: repoName,
                    "contributors.user": reviewer,
                  },
                  { $inc: { "contributors.$.points_claimed": reviewerPoints } },
                );
              } else {
                const reviewerObject = {
                  user: reviewer,
                  points_claimed: reviewerPoints,
                };
                await models.Repo.findOneAndUpdate(
                  { _id: repoName },
                  { $push: { contributors: reviewerObject } },
                );
              }
            }
          } else {
            const details = await models.Sprint.findOne({
              "tasks.issue_url": issueUrl,
            });
            if (details) {
              const prLink = req.body.pull_request.html_url;
              let contributorPoints = 0;
              let reviewerPoints = 0;
              const contributor = req.body.pull_request.assignee.login;
              const reviewer =
                req.body.pull_request.requested_reviewers[0].login;
              details.tasks.forEach(async (task) => {
                if (task.issue_url === issueUrl) {
                  contributorPoints = task.contributor_points;
                  reviewerPoints = task.reviewer_points;
                }
              });
              await models.Sprint.findOneAndUpdate(
                {
                  "tasks.issue_url": issueUrl,
                },
                {
                  "tasks.$.pr_url": prLink,
                  "tasks.$.task_status": "Done",
                  "tasks.$.reviewer": reviewer,
                  $inc: { boss_hp: -(contributorPoints + reviewerPoints) },
                },
              );
              await models.Sprint.findOneAndUpdate(
                {
                  "tasks.issue_url": issueUrl,
                  "contributors.user": contributor,
                },
                {
                  $inc: {
                    "contributors.$.points_claimed": contributorPoints,
                    "contributors.$.points_at_stake": -contributorPoints,
                  },
                },
              );
              const reviewercheck = await models.Sprint.findOne({
                "tasks.issue_url": issueUrl,
                "contributors.user": reviewer,
              });
              if (reviewercheck) {
                await models.Sprint.findOneAndUpdate(
                  {
                    "tasks.issue_url": issueUrl,
                    "contributors.user": reviewer,
                  },
                  { $inc: { "contributors.$.points_claimed": reviewerPoints } },
                );
              } else {
                const reviewee = {
                  user: reviewer,
                  points_claimed: reviewerPoints,
                  points_at_stake: 0,
                };
                await models.Sprint.findOneAndUpdate(
                  { "tasks.issue_url": issueUrl },
                  { $push: { contributors: reviewee } },
                );
              }
              const repoName = details.repo;
              const checkAssignee = await models.Repo.findOne({
                _id: repoName,
                "contributors.user": contributor,
              });
              if (checkAssignee) {
                await models.Repo.findOneAndUpdate(
                  {
                    _id: repoName,
                    "contributors.user": contributor,
                  },
                  {
                    $inc: {
                      "contributors.$.points_claimed": contributorPoints,
                    },
                  },
                );
              } else {
                const checkAssignee1 = {
                  user: contributor,
                  points_claimed: contributorPoints,
                };
                await models.Repo.findOneAndUpdate(
                  { _id: repoName },
                  { $push: { contributors: checkAssignee1 } },
                );
              }
              const checkReviewer = await models.Repo.findOne({
                _id: repoName,
                "contributors.user": reviewer,
              });
              if (checkReviewer) {
                await models.Repo.findOneAndUpdate(
                  {
                    _id: repoName,
                    "contributors.user": reviewer,
                  },
                  { $inc: { "contributors.$.points_claimed": reviewerPoints } },
                );
              } else {
                const checkReviewer1 = {
                  user: reviewer,
                  points_claimed: reviewerPoints,
                };
                await models.Repo.findOneAndUpdate(
                  { _id: repoName },
                  { $push: { contributors: checkReviewer1 } },
                );
              }
            }
          }
          res.send({
            statusCode: 200,
            message: "Done",
          });
        }
      },
    );
  } else if (req.body.action === "review_requested") {
    await github.query(
      `
      {
        resource(url: "${req.body.pull_request.html_url}") {
          ... on PullRequest {
            timelineItems(itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT], first: 100) {
              nodes {
                ... on ConnectedEvent {
                  id
                  subject {
                    ... on Issue {
                      number
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
      null,
      // eslint-disable-next-line no-unused-vars
      async (result, err) => {
        if (
          result.data.resource.timelineItems.nodes[
            result.data.resource.timelineItems.nodes.length - 1
          ]
        ) {
          const issueNumber = result.data.resource.timelineItems.nodes[
            result.data.resource.timelineItems.nodes.length - 1
          ].subject.number.toString();
          // Fetch Issue URL
          const issueUrl = `${req.body.repository.html_url}/issues/${issueNumber}`;
          const details = await models.Sprint.findOne({
            "tasks.issue_url": issueUrl,
          });
          // If PR is associated to a milestoned issue, do the job
          if (details) {
            // eslint-disable-next-line camelcase
            const { milestone_url } = details;
            let reviewerPoints = 0;
            const reviewer = req.body.pull_request.requested_reviewers[0].login;
            details.tasks.forEach(async (task) => {
              if (task.issue_url === issueUrl) {
                reviewerPoints = task.reviewer_points;
              }
            });
            // Check if user is in the contributor list
            const contributors = await models.Sprint.findOne({
              milestone_url,
              "contributors.user": reviewer,
            });
            // If the user is in the contributor list, update the points
            if (contributors) {
              await models.Sprint.findOneAndUpdate(
                {
                  milestone_url,
                  "contributors.user": reviewer,
                },
                {
                  $inc: {
                    "contributors.$.points_at_stake": reviewerPoints,
                  },
                },
              );
            }
            // If the user is a first time contributor, push the new contributor to the contributors list
            else {
              const reviewObject = {
                user: reviewer,
                points_claimed: 0,
                points_at_stake: reviewerPoints,
              };
              await models.Sprint.findOneAndUpdate(
                { "tasks.issue_url": issueUrl },
                { $push: { contributors: reviewObject } },
              );
            }
            // Add the reviewer to the task object
            await models.Sprint.findOneAndUpdate(
              {
                "tasks.issue_url": issueUrl,
              },
              {
                "tasks.$.reviewer": reviewer,
              },
            );
          }
        }
      },
    );
  }
});
module.exports = router;
