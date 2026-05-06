module.exports = {
  ci: {
    collect: {
      staticDistDir: ".next",
      startServerCommand: "npm run start",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/projects",
        "http://localhost:3000/contact",
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1.0 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        // Per-page byte weight gate: ~120KB initial + headroom for HTML/CSS/fonts.
        "total-byte-weight": ["error", { maxNumericValue: 350000 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
