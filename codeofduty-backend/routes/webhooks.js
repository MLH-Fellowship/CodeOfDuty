const express = require("express");
const GithubGraphQLApi = require("node-github-graphql");
const models = require("../models.js");
require("dotenv").config();

const router = express.Router();
const github = new GithubGraphQLApi({
  token: process.env.GITHUB_API_TOKEN,
});

router.route("/issue").post(async (req, res) => {
  if (req.body.action === "milestoned") {
    let points = 0;
    req.body.issue.labels.forEach(async (label) => {
      if (!label.name.NaN) {
        points = parseInt(label.name, 10);
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $inc: { boss_hp: points, boss_hp_max: points } },
        );
      }
    });

    if (req.body.issue.assignee) {
      const assignee = req.body.issue.assignee.login;
      const contributors = await models.Sprint.findOne({
        milestone_url: req.body.milestone.html_url,
        "contributors.user": assignee,
      });
      if (contributors) {
        await models.Sprint.findOneAndUpdate(
          {
            milestone_url: req.body.milestone.html_url,
            "contributors.user": assignee,
          },
          { $inc: { "contributors.$.points_at_stake": 0.8 * points } },
        );
      } else {
        const contributor = {
          user: assignee,
          points_claimed: 0,
          points_at_stake: 0.8 * points,
        };
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $push: { contributors: contributor } },
        );
      }
      const task = {
        issue_url: req.body.issue.html_url,
        pr_url: null,
        task_status: "in-progress",
        contributor: assignee,
        reviewer: null,
        contributor_points: 0.8 * points,
        reviewer_points: 0.2 * points,
      };
      await models.Sprint.findOneAndUpdate(
        { milestone_url: req.body.milestone.html_url },
        { $push: { tasks: task } },
      );
    } else {
      const task = {
        issue_url: req.body.issue.html_url,
        pr_url: null,
        task_status: "in-progress",
        contributor: null,
        reviewer: null,
        contributor_points: 0.8 * points,
        reviewer_points: 0.2 * points,
      };
      await models.Sprint.findOneAndUpdate(
        { milestone_url: req.body.milestone.html_url },
        { $push: { tasks: task } },
      );
    }
  } else if (req.body.action === "demilestoned") {
    let points = 0;
    req.body.issue.labels.forEach(async (label) => {
      if (!label.name.NaN) {
        points = parseInt(label.name, 10);
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $inc: { boss_hp: -points, boss_hp_max: -points } },
        );
      }
    });
    if (req.body.issue.assignee) {
      const assignee = req.body.issue.assignee.login;
      const contributors = await models.Sprint.findOne({
        milestone_url: req.body.milestone.html_url,
        "contributors.user": assignee,
      });
      if (contributors) {
        await models.Sprint.findOneAndUpdate(
          {
            milestone_url: req.body.milestone.html_url,
            "contributors.user": assignee,
          },
          { $inc: { "contributors.$.points_at_stake": -0.8 * points } },
        );
      } else {
        const contributor = {
          user: assignee,
          points_claimed: 0,
          points_at_stake: -0.8 * points,
        };
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $push: { contributors: contributor } },
        );
      }
    }
  }
  if (req.body.action === "assigned") {
    if (req.body.issue.milestone) {
      let points = 0;
      req.body.issue.labels.forEach(async (label) => {
        if (!label.name.NaN) {
          points = parseInt(label.name, 10);
        }
      });
      const assignee = req.body.assignee.login;
      const contributors = await models.Sprint.findOne({
        milestone_url: req.body.issue.milestone.html_url,
        "contributors.user": assignee,
      });
      if (contributors) {
        await models.Sprint.findOneAndUpdate(
          {
            milestone_url: req.body.issue.milestone.html_url,
            "contributors.user": assignee,
          },
          { $inc: { "contributors.$.points_at_stake": 0.8 * points } },
        );
      } else {
        const contributor = {
          user: assignee,
          points_claimed: 0,
          points_at_stake: 0.8 * points,
        };
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.issue.milestone.html_url },
          { $push: { contributors: contributor } },
        );
      }
      await models.Sprint.findOneAndUpdate(
        {
          milestone_url: req.body.issue.milestone.html_url,
          "tasks.issue_url": req.body.issue.html_url,
        },
        { "tasks.$.contributor": assignee },
      );
    }
  } else if (req.body.action === "labeled") {
    if (req.body.issue.milestone && req.body.issue.assignee) {
      let points = 0;
      req.body.issue.labels.forEach(async (label) => {
        if (!label.name.NaN) {
          points = parseInt(label.name, 10);
        }
      });
      await models.Sprint.findOneAndUpdate(
        { milestone_url: req.body.issue.milestone.html_url },
        { $inc: { boss_hp: points, boss_hp_max: points } },
      );
      await models.Sprint.findOneAndUpdate(
        {
          milestone_url: req.body.issue.milestone.html_url,
          "tasks.issue_url": req.body.issue.html_url,
        },
        {
          "tasks.$.contributor_points": 0.8 * points,
          "tasks.$.reviewer_points": 0.2 * points,
        },
      );
      await models.Sprint.findOneAndUpdate(
        {
          milestone_url: req.body.issue.milestone.html_url,
          "contributors.user": req.body.issue.assignee.login,
        },
        { $inc: { "contributors.$.points_at_stake": 0.8 * points } },
      );
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
        const issueNumber = result.data.resource.timelineItems.nodes[
          result.data.resource.timelineItems.nodes.length - 1
        ].subject.number.toString();
        const issueUrl = `${req.body.repository.html_url}/issues/${issueNumber}`;
        const details = await models.Sprint.findOne({
          "tasks.issue_url": issueUrl,
        });
        if (details) {
          const prLink = req.body.pull_request.html_url;
          let contributorPoints = 0;
          let reviewerPoints = 0;
          const contributor = req.body.pull_request.assignee.login;
          const reviewer = req.body.pull_request.requested_reviewers[0].login;
          details.tasks.forEach(async (task) => {
            if (
              task.issue_url === issueUrl &&
              task.contributor === contributor
            ) {
              contributorPoints = task.contributor_points;
              reviewerPoints = task.reviewer_points;
            }
          });
          console.log(contributorPoints, reviewerPoints);
          await models.Sprint.findOneAndUpdate(
            {
              "tasks.issue_url": issueUrl,
              "tasks.contributor": contributor,
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
              "contributors.$.points_claimed": contributorPoints,
              $inc: { "contributors.$.points_at_stake": -contributorPoints },
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
          const checkAssignee = models.Repo.findOne({
            repo_name: repoName,
            "contributors.user": contributor,
          });
          if (checkAssignee) {
            await models.Repo.findOneAndUpdate(
              {
                repo_name: repoName,
                "contributors.user": contributor,
              },
              { $inc: { "contributors.$.points_claimed": contributorPoints } },
            );
          } else {
            const checkAssignee1 = {
              user: contributor,
              points_claimed: contributorPoints,
            };
            await models.Repo.findOneAndUpdate(
              { repo_name: repoName },
              { $push: { contributors: checkAssignee1 } },
            );
          }
          const checkReviewer = models.Repo.findOne({
            repo_name: repoName,
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
            const checkReviewer1 = {
              user: reviewer,
              points_claimed: reviewerPoints,
            };
            await models.Repo.findOneAndUpdate(
              { repo_name: repoName },
              { $push: { contributors: checkReviewer1 } },
            );
          }
        }
        res.send({
          statusCode: 200,
          message: "Done",
        });
      },
    );
  }
});
module.exports = router;
