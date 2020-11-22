## Route: GET "/fetchUserSprints"

Fetch created sprints a user from the database

### Request:
| Name	| Type 	    | In  	| Description  	                       |
|---	|---	    |---	|---	                               |
| user	| string   	|query 	|username of user to fetch sprints for |

### Response:
```
[
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
]
```

### Example:

Request: GET 'https://codeofduty.com/fetchUserSprints?user={username}'

Response object:
```
[
    {
        repo: 'CodeOfDuty',
        name: 'COD',
        sprint_perm_id: '5474108b48',
        milestone_url: 'https://github.com/MLHFellowship/Code-of-Duty/milestone/1',
        contributors: [{
                user: 'vrushti-mody',
                points_claimed: 12,
                points_at_stake: 23,
        }],
        tasks:[{
                issue_url: 'https://github.com/MLHFellowship/Code-of-Duty/issues/1',
                pr_url: 'https://github.com/MLHFellowship/Code-of-Duty/pulls/5',
                task_status: 'Under Review',
                contributor: 'vrushti-mody',
                reviewer: 'ajwad-shaikh',
                contributor_points: 12,
                reviewer_points: 10,
        }],
        boss_hp: 99,
        boss_hp_max: 120,
        victory_threshold: 12,
        due_date: 2121323234344,
    },
    ...
]
```
---

## Route: GET "/fetchGlobalSprints"

Fetch top 10 sprints from the database, sorted by due dates

### Response:
```
[
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
] // max array length = 10
```

### Example:

Request: GET 'https://codeofduty.com/fetchGlobalSprints'

Response object:
```
[
    {
        repo: 'CodeOfDuty',
        name: 'COD',
        sprint_perm_id: '5474108b48',
        milestone_url: 'https://github.com/MLHFellowship/Code-of-Duty/milestone/1',
        contributors: [{
                user: 'vrushti-mody',
                points_claimed: 12,
                points_at_stake: 23,
        }],
        tasks:[{
                issue_url: 'https://github.com/MLHFellowship/Code-of-Duty/issues/1',
                pr_url: 'https://github.com/MLHFellowship/Code-of-Duty/pulls/5',
                task_status: 'Under Review',
                contributor: 'vrushti-mody',
                reviewer: 'ajwad-shaikh',
                contributor_points: 12,
                reviewer_points: 10,
        }],
        boss_hp: 99,
        boss_hp_max: 120,
        victory_threshold: 12,
        due_date: 2121323234344,
    },
    ...
]
```

---

## Route: GET "/fetchUserRepos"

Fetch all repos from the authenticated user, including repos as a collaborator or organization member (if organization access is granted)

### Request:
| Name	| Type 	    | In  	                | Description  	                         |
|---	|---	    |---	                |---	                                 |
| token	| string   	|header (Authorization)	| access token of authenticated user     |

### Response:
```
["{owner}/{repo}"]
```

### Example:

Request: GET "https://codeofduty.com/fetchUserRepos"

Response object:
```
[
    "MLH-Fellowship/CodeOfDuty",
    "MLH-Fellowship/AmongUps",
    "MLH-Fellowship/JamSpam",
    "cqvu/Transcribio",
    ...
]
```

---

## Route: GET "/fetchRepoMilestones"

Fetch all repos from the authenticated user, including repos as a collaborator or organization member (if organization access is granted)

### Request:
| Name	| Type 	    | In  	                | Description  	                         |
|---	|---	    |---	                |---	                                 |
| token	| string   	|header (Authorization)	| access token of authenticated user     |
| repo  | string    | query                 | repo to fetch milestones for           |

### Response:
```
[
    {
        "url": String,
        "number": Number,
        "name": String,
        "id": Number,
        "dueDate": ISODate String
    }
] // valid open milestones with a valid due date
```

### Example:

Request: GET "https://codeofduty.com/fetchRepoMilestones"

Response object:
```
[
    {
        "url": "https://github.com/cqvu-test/codeofduty-test/milestone/1",
        "number": 1,
        "name": "First Demo",
        "id": 6132894,
        "dueDate": "2020-11-22T08:00:00Z"
    }
]
```

---

## Route: POST "/sprints/create"

Create a new sprint based on a milestone

### Request:
| Name	| Type 	    | In  	                | Description  	                         |
|---	|---	    |---	                |---	                                 |
| token	| string   	|header (Authorization)	| access token of authenticated user     |
| repo  | string    | body                  | repo where the milestone was created   |
| milestone | milestone json (see below) | body | milestone to create sprint for     |
| victoryThreshold | float (between 0 and 1) | body | percentage of tasks completed to declare victory |

milestone json:
```
{
    "url": String,
    "number": Number,
    "name": String,
    "id": Number,
    "dueDate": ISODate String
}
```

### Response:
```
{
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
}
```

### Example:

Request: POST "https://codeofduty.com/sprints/create"

Body
```
{
    "repo": "cqvu-test/codeofduty-test",
    "milestone": {
        "url": "https://github.com/cqvu-test/codeofduty-test/milestone/1",
        "number": 1,
        "name": "First Demo",
        "id": 6132894,
        "dueDate": "2020-11-22T08:00:00Z"
    },
    "victoryThreshold": 0.8
}
```

Response object:
```
{
    "_id": "5fb8d7d61c4c0a23808e4319",
    "repo": "cqvu-test/codeofduty-test",
    "name": "First Demo",
    "sprint_perm_id": "6132894",
    "milestone_url": "https://github.com/cqvu-test/codeofduty-test/milestone/1",
    "contributors": [
        {
            "_id": "5fb8d7d61c4c0a23808e431a",
            "user": "cqvu",
            "points_claimed": 0,
            "points_at_stake": 9
        }
    ],
    "tasks": [
        {
            "_id": "5fb8d7d61c4c0a23808e431b",
            "issue_url": "https://github.com/cqvu-test/codeofduty-test/issues/3",
            "pr_url": null,
            "task_status": "open",
            "contributor": null,
            "reviewer": null,
            "contributor_points": 17,
            "reviewer_points": 3
        },
        {
            "_id": "5fb8d7d61c4c0a23808e431c",
            "issue_url": "https://github.com/cqvu-test/codeofduty-test/issues/1",
            "pr_url": null,
            "task_status": "open",
            "contributor": "cqvu",
            "reviewer": null,
            "contributor_points": 9,
            "reviewer_points": 1
        }
    ],
    "boss_hp": 30,
    "boss_hp_max": 30,
    "victory_threshold": 0.8
}
```