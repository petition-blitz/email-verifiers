module.exports = {
  datavalidation: require('./datavalidation')({
    apiKey: process.env.DATAVALIDATION_API_KEY,
    acceptableGrades: ['A+', 'A', 'B']
  }),
  neverbounce: require('./neverbounce')({
    apiKey: process.env.NEVERBOUNCE_API_KEY,
    acceptableCodes: [0, 3, 4]
  })
};
