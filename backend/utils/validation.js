const validateGithubUrl = (url) => {
  const githubRegex = /^https:\/\/github\.com\/[\w\-_]+\/[\w\-_]+$/;
  return githubRegex.test(url);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeHtml = (html) => {
  // Basic HTML sanitization - you might want to use a library like DOMPurify for production
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

module.exports = {
  validateGithubUrl,
  validateEmail,
  sanitizeHtml,
  generateSlug
};