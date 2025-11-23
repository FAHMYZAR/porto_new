// tina/config.js
import { defineConfig } from "tinacms";
var branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
var config_default = defineConfig({
  branch,
  clientId: null,
  // Get this from tina.io
  token: null,
  // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "assets/images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/blog",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image (Upload)"
          },
          {
            type: "string",
            name: "image_url",
            label: "Cover Image (URL)",
            description: "Use this if you want to use an external image URL instead of uploading."
          },
          {
            type: "boolean",
            name: "is_popular",
            label: "Is Popular?",
            description: "Check this to feature this post in the 'Popular' section."
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: [
              "Teknologi",
              "Tutorial",
              "Review",
              "Tips & Trik",
              "Programming",
              "Design",
              "Lifestyle",
              "Other"
            ]
          },
          {
            type: "string",
            name: "tags",
            label: "Tags (Comma Separated)",
            description: "e.g. Flutter, Mobile, Tech"
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      },
      {
        name: "gallery",
        label: "Gallery",
        path: "src/content/gallery",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "image",
            label: "Image"
          },
          {
            type: "string",
            name: "tags",
            label: "Tags (Comma Separated)",
            description: "e.g. Web, Design, App"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
