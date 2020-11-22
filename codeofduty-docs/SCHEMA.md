# CodeOfDuty Database Schema

> ### Database Service - MongoDB
> ### Database Type - NoSQL

## Models

### Repository 

- repositories (Collection)
    - `_id` - Repository ID
        - Type: String `"{owner}/{repo}"`
        - Example: `"MLH-Fellowship/CodeOfDuty"`
    - `maintainer` - Maintainer for a repo
        - Type: String `github-username`
        - Example: "cqvu"
    - `past_sprints` - Tracked Past Sprints for a repo
        - Type: Array[Sprint Overview]
        - Example:
            ```
            [
                {
                    "_id": "542c2b97bac0595474108b48",    // Sprint Object Id  
                    "name": "Sprint 5 | v1.2.2",             // Name of the Sprint
                    "sprint_perm_id": "5474108b48",                 // Sprint perm id
                    "repo: "owner/repo"                      // Repo of the sprint
                }
            ]
            ```
    - `active_sprints` - Tracks Active Sprints for a repo
        - Type: Array[Sprint Overview]
        - Example:
            ```
            [
                {
                    "_id": "542c2b97bac0595474108b48",                // Sprint Object Id  
                    "name": "Sprint 5 | v1.2.2",                         // Name of the Sprint
                    "sprint_perm_id": "5474108b48",                             // Sprint perm id
                    "repo: "owner/repo"                                  // Repo of the sprint
                }
            ]
            ```
    - `contributors` - Contributors Leaderboard in the repo
        - Type: Array[Contributor]
        - Example:
            ```
            [
                {
                    "user": "cqvu",         // github username,
                    "points_claimed": 20,   // contributor points claimed all-time
                },
                {
                    "user": "ajwad-shaikh",
                    "points_claimed": 10,
                }
            ]
            ```


### Sprint

- sprints (Collection)
    - `_id` - Unique Object Id for Sprint
        - Type: ObjectId
        - Example: `ObjectId("542c2b97bac0595474108b48")`
    - `repo` - [Repository](#repository) Id (key in repositories collection)
        - Type: String
        - Example: `"MLH-Fellowship/CodeOfDuty"`
    - `name` - Name of the Sprint (GitHub Milestone)
        - Type: String
        - Example: `"Sprint 5 | v1.2.2"`
    - `sprint_perm_id` - Unique Id to the Sprint (Last 10 characters of the _id)
        - Type: String
        - Example: `"5474108b48"`
    - `milestone_url` - Link to the GitHub Milestone that the Sprint Tracks
        - Type: String
        - Example: `"https://github.com/MLH-Fellowship/CodeOfDuty/milestone/1"`
    - `contributors` - Contributors participating in the Sprint
        - Type: Array[Contributor]
        - Example:
            ```
            [
                {
                    "user": "cqvu",         // github username,
                    "points_claimed": 20,   // contributor points claimed for the sprint
                    "points_at_stake": 50   // contributor points at stake (for assigned & open issues)
                },
                {
                    "user": "ajwad-shaikh",
                    "points_claimed": 10,
                    "points_at_stake": 40
                }
            ]
            ```
    - `tasks` - Tasks taken up in the Sprint
        - Type: Array[Task]
        - Example:
            ```
            [
                {
                    "issue_url": "https://github.com/MLH-Fellowship/CodeOfDuty/issues/1",   // link to the issue on GitHub
                    "pr_url": "https://github.com/MLH-Fellowship/CodeOfDuty/pull/4",        // link to the PR that closes the issue on GitHub
                    "task_status": "under-review",  // one of ['unassigned', 'assigned', 'under-review', 'completed']
                    "contributor": "ajwad-shaikh",  // contributor assigned
                    "reviewer": "vrusti-mody",      // reviewer assigned       
                    "task_points": "50",            // total points at stake on the task
                    "contributor_points": "40",
                    "reviewer_points": "10"
                }
            ]
            ```
    - `boss_hp` - Remaining Health Points (HP) of the BOSS enemy
        - Type: Number
        - Example: `250`
    - `boss_hp_max` - Maximum HP of the BOSS Enemy
        - Type: Number
        - Example: `550`
    - `victory_threshold` - Constant in [0,1] that is multiplied to max health to determine the victory threshold for the team
        - Type: Number
        - Example: `0.9` implies that the team would win if 90% of BOSS HP is claimed by the players
    - `due_date` - Sprint Due Date
        - Type: Date `ISO String`
        - Example: `Date("2021-03-25T12:00:00Z")`
