# lobste.rs-graph
display an interactive graph data explorer
## Achievements/Tasks
- set up a serverless data scraping workflow to fetch all new articles submitted to Lobsters and import into Neo4j Aura using GitHub Actions
- build a GraphQL API and deploy it on Vercel
- vizualize data with GraphQL and react-force-graph

## Accessing the API
Navigate to [/api/graphql](https://lobste-rs-graph-git-main-deadex-ng.vercel.app/api/graphql) to access the API.

Copy and paste this query in graphql to get the first 10 latest articles sorted by date in descending order.

```
{
  articles(options:
  {limit: 10, sort: {created: DESC}}) {
    title
    created
    tags{
      name
    }
  }
}
```
