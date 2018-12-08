const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const {URL} = require("url");
const {DateTime} = require("luxon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection(
    "tagList",
    require("./modules/comps/get-tag-list.ety")
  );
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addFilter("lastWord", words => {
    return words.split(" ").splice(-1);
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat(
      "LLLL dd, yyyy"
    );
  });

  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("getHostnameFromUrl", base => {
    return new URL(base).hostname;
  });

  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("./article/*").sort(function(a, b) {
      return a.date - b.date;
    });
  });

  eleventyConfig.addCollection("projects", function(collection) {
    return collection.getFilteredByGlob("./projects/*").sort(function(a, b) {
      return a.date - b.date;
    });
  });

  eleventyConfig.addShortcode("codeheader", function(context = "Title", title) {
    return `<div class="codeheader"><span>${context}: </span>${title}</div>`;
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (
      outputPath &&
      outputPath.endsWith(".html") &&
      !outputPath.includes("/feed/")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true
      });
      return minified;
    }
    return content;
  });

  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: true,
      linkify: true
    }).use(markdownItAnchor, {
      permalink: true,
      permalinkClass: "direct-link",
      permalinkSymbol: "#",
      permalinkBefore: false
    })
  );

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "modules",
      data: "manifest",
      output: "build"
    }
  };
};
