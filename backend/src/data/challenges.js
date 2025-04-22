// Define challenge data
const challengeData = [
  {
    id: 'web_security',
    title: "Web Security Fundamentals",
    description: "Learn and implement basic web security principles including XSS prevention, CSRF protection, and secure authentication.",
    requirements: [
      "Implement XSS prevention",
      "Add CSRF protection",
      "Set up secure authentication"
    ],
    points: 100,
    isActive: true,
    dependencies: [],
    tag: "security"
  },
  {
    id: 'db_optimization',
    title: "Database Optimization",
    description: "Optimize database queries and structure for better performance using indexing and query optimization techniques.",
    requirements: [
      "Create proper indexes",
      "Optimize complex queries",
      "Implement caching"
    ],
    points: 150,
    isActive: true,
    dependencies: ['web_security'],
    tag: "database"
  },
  {
    id: 'api_development',
    title: "API Development",
    description: "Build a secure and efficient API with proper authentication, rate limiting, and error handling.",
    requirements: [
      "Implement API authentication",
      "Handle rate limiting",
      "Add error handling"
    ],
    points: 200,
    isActive: true,
    dependencies: ['web_security', 'db_optimization'],
    tag: "api"
  },
  {
    id: 'scalability',
    title: "Scalability Solutions",
    description: "Design and implement scalable architecture using load balancing and microservices patterns.",
    requirements: [
      "Set up load balancing",
      "Design microservices",
      "Implement service discovery"
    ],
    points: 250,
    isActive: true,
    dependencies: ['api_development'],
    tag: "architecture"
  }
];

// This will be populated when inserting challenges
const challengeIds = {};

module.exports = { challengeData, challengeIds };
