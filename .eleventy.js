const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const {URL} = require("url");
const {DateTime} = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = (elly) => {
  elly.addPassthroughCopy("assets/img");

  elly.addPlugin(pluginRss);

  elly.addPlugin(pluginSyntaxHighlight);

  elly.addFilter("head", (arr, n) => {
    return n < 0 ? arr.slice(n) : arr.slice(0, n);
  });

  elly.addFilter("lastWord", (words) => {
    return words.split(" ").splice(-1);
  });

  elly.addFilter("readableDate", (date) => {
    return DateTime.fromJSDate(date, {zone: "utc"}).toFormat("LLLL dd, yyyy");
  });

  elly.addFilter("htmlDateString", (date) => {
    return DateTime.fromJSDate(date).toFormat("yyyy-LL-dd");
  });

  elly.addFilter("getHostnameFromUrl", (url) => {
    return new URL(url).hostname;
  });

  elly.addCollection("posts", (all) => {
    return all.getFilteredByGlob("./article/*").sort((a, b) => {
      return a.date - b.date;
    });
  });

  elly.addCollection("tagList", require("./modules/comps/get-tag-list.ety"));

  elly.addCollection("projects", (all) => {
    return all.getFilteredByGlob("./projects/*").sort((a, b) => {
      return a.date - b.date;
    });
  });

  elly.addShortcode("codeheader", (context = "Title", title) => {
    return `<div class="codeheader"><span>${context}: </span>${title}</div>`;
  });

  elly.addTransform("htmlmin", (content, outputPath) => {
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

  elly.setLibrary(
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
