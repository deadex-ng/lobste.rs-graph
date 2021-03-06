import dynamic from 'next/dynamic';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { useState } from 'react';
import _ from "lodash";

const NoSSRForceGraph = dynamic(() => import('../lib/NoSSRForceGraph'), {
  ssr: false
});

const mostRecentQuery = gql`
{
  articles(options: {limit: 40, sort: {created: DESC}}){
   __typename
   title
   created
    url
   tags{
    __typename
    name
  }
    user{
      __typename
      username
      avatar
    }
  }
}
`;

const moreArticlesQuery = gql`
query articlesByTag($tag:String){
  articles(where:{tags: {name:$tag}}
    options: {limit: 10,sort: {created:DESC}})
  {
    __typename
    id
    title
    created
    url
    tags{
      __typename
      name
    }
    user{
      __typename
      username
      avatar
    }
  }
} 
`;

const formatData = (data) => {
  // this could be generalized but let's leave that for another time

  const nodes = [];
  const links = [];

  if (!data.articles) {
    return;
  }

  data.articles.forEach((a) => {
    nodes.push({
      id: a.id,
      url: a.url,
      __typename: a.__typename,
      title: a.title
    });

    links.push({
      source: a.user.username,
      target: a.id
    });

    a.tags.forEach((t) => {
      nodes.push({
        id: t.name,
        __typename: t.__typename
      });
      links.push({
        source: a.id,
        target: t.name
      });
    });

    nodes.push({
      id: a.user.username,
      avatar: a.user.avatar,
      __typename: a.user.__typename
    });
  });

  return {
    // nodes may be duplicated so use lodash's uniqBy to filter out duplicates
    nodes: _.uniqBy(nodes, "id"),
    links
  };
};

export default function Home() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const { data } = useQuery(mostRecentQuery, {
    onCompleted: (data) => setGraphData(formatData(data))
  });

  const [loadMoreArticles, {called, loading, data: newData}] = useLazyQuery(
    moreArticlesQuery,
    {
      onCompleted: (data) => {
        const newSubGraph = formatData(data)
        setGraphData({
          nodes:_.uniqBy([...graphData.nodes, ...newSubGraph.nodes],'id'),
          links: [...graphData.links, ...newSubGraph.links]
        })
      }
    }
  )
  return (
    <NoSSRForceGraph 
    nodeAutoColorBy={"__typename"} 
    nodeLabel={"id"} 
    graphData={graphData}
    onNodeClick={(node,event) => {
      console.log(node)
      if (node.__typename === "Tag"){
        loadMoreArticles({variales: {tag: node.id}})
      }
    }}
    />
  );
}
// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="Generated by create next app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//         <div className={styles.grid}>
//           <a href="https://nextjs.org/docs" className={styles.card}>
//             <h2>Documentation &rarr;</h2>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className={styles.card}>
//             <h2>Learn &rarr;</h2>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/canary/examples"
//             className={styles.card}
//           >
//             <h2>Examples &rarr;</h2>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//           >
//             <h2>Deploy &rarr;</h2>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <span className={styles.logo}>
//             <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
//           </span>
//         </a>
//       </footer>
//     </div>
//   )
// }
