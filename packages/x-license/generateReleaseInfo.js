module.exports = function generateReleaseInfo() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Buffer.from(today.getTime().toString()).toString('base64');
};
