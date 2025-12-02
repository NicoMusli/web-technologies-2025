const sanitizeHtml = require('sanitize-html');

/**
 * Recursively sanitizes input data using sanitize-html.
 * Handles strings, objects, and arrays.
 * @param {any} input - The input to sanitize.
 * @returns {any} - The sanitized input.
 */
const sanitize = (input) => {
    if (typeof input === 'string') {
        return sanitizeHtml(input, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt']
            }
        });
    }
    if (Array.isArray(input)) {
        return input.map(item => sanitize(item));
    }
    if (typeof input === 'object' && input !== null) {
        const sanitizedObject = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                sanitizedObject[key] = sanitize(input[key]);
            }
        }
        return sanitizedObject;
    }
    return input;
};

module.exports = sanitize;
