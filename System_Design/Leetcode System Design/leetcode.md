# Design Leetode

# Functional Requirements
* what the system should do — the features, behaviors, and functions of the system.

- users should be able to list the set of problems
- users should be able to submit the code solution in some preferred language
- users should be able to see their evaluated submission (old submissions - good to have)
- support multiple test cases
- leaderboard aspect (good to have)

# Non functional Requirements
* quality attributes or constraints of the system.

- The availability of the system shoud be high 
- Security and fault tolerance is important aspect since we take the user's submitted code
- Scalabilty


# Back of the Envelope Calculation
- 1M Monthly Active Users -> 0.5 M daily active users
- If each user submits 2 problems a day, then there are 1M submissions a day
- qps -> 1M/10^5 -> 10 queries per second
- peak -> 25x -> 250 qps
- SLA(Serice Level Agreement) -> 10s delay (not during competitions) -> Peak Hours -> 20 to 30sec.


# Create Submission
/api/v1/submissions - POST
{
    language: "",
    code: "",
    problemId: 
}

# Get a submission
/api/v1/submission/:id - GET

# Get all submissions
/api/v1/submissions - GET

# SubmissionDB
{
      id,
      problem_id,
      status,
      code,
      score,
      testcase_passed,
      testcase_failed 
}

- Docker containers are spinned 
- We can intriducce Wb socket connection between the client and submission servers for real time data fetches

# Leaderboard
- redis sorted sets -> sorts data
- constest_id : [ { score, user_id, timestamp } ]

