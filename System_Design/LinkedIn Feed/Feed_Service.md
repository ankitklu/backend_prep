# Feed Service (Like LinkedIn, Instagram Feed)

# Functional Requirements
- Create post
- See post (Generated Feed)
    - Reverse Chronological Order

# Non-Functional Requirement
- Create Posts and Feed Generation process should be pretty fast (<500ms)

# Entities
- User entity
- Post Entity

# APIs
- create a post 
    - POST: /api/post
    - req: {
        content:
      }
    - res: {
                postId:
           }

- Get Posts/Feed
    - GET /api/feed
    - res: {
            JSON
        }

- See Feeds
    - Get the list of all friends
    - get al the posts of those friends
    - REturn the psts in the desierd order to the user.

# Graph DB to store Feed data
- Reason being GraphDB are optimized to store relationship (Neo4J) 
- OPtimized query lanuuages to get the follower's list and all.

# Post DB Schema
{
      user_id,
      contents,
      metadata,
      time_stamps,
}

# Feed Publishing
- Bottlenexks: For people with many followers, so the feed of the followers to be updated!!
- We can create "PRE-NEWS FEED" which is pre-generated and get it stored in the cache.

- PUSH MODEL (For General People)
    - FanOut Write Approach

- PULL MODEL (For Celebrities)
    - (Pull Content On Demand)

## PRE-NEWS FEED
userId: [ <post_id ,user_id >,..., <post_idn, user_idn> ]
Cursor Pagination to fetch next n feeds: /api/postlimit=100&cursor<timestamp>

# Feed Generation 
- 





