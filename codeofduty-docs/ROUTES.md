### Route: "/fetchUserSprints/:user"

Request object: Username 
Response object: Array of sprints

Example:

Request url: 'https://codeofduty.com/fetchUserSprints'

Response object:
```
[
    {
        repo: 'CodeOfDuty',
        name: 'COD',
        sprint_url: 'https://github.com/MLHFellowship/Code-of-Duty',
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
            }
]
}

```