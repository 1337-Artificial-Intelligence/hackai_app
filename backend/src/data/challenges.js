const challenges = [
  {
    title: "Web Security Fundamentals",
    description: "Learn and implement basic web security principles including XSS prevention, CSRF protection, and secure authentication.",
    requirements: [
      "Implement XSS prevention",
      "Add CSRF protection",
      "Set up secure authentication"
    ],
    order: 1,
    points: 100,
    isActive: true
  },
  {
    title: "Database Optimization",
    description: "Optimize database queries and structure for better performance using indexing and query optimization techniques.",
    requirements: [
      "Create proper indexes",
      "Optimize complex queries",
      "Implement caching"
    ],
    order: 2,
    points: 150,
    isActive: true
  },
  {
    title: "API Integration Challenge",
    description: "Connect and integrate with external APIs securely while handling rate limits and errors gracefully.",
    requirements: [
      "Implement API authentication",
      "Handle rate limiting",
      "Add error handling"
    ],
    order: 3,
    points: 200,
    isActive: true
  },
  {
    title: "Scalability Solutions",
    description: "Design and implement scalable architecture using load balancing and microservices patterns.",
    requirements: [
      "Set up load balancing",
      "Design microservices",
      "Implement service discovery"
    ],
    order: 4,
    points: 250,
    isActive: true
  }
];

module.exports = challenges;
