"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// 1. Remove 'dataset' and 'projectId' from this import
import { apiVersion } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
    basePath: "/studio",
    // 2. Hardcode these strings directly here:
    projectId: "1hkynqya",
    dataset: "production",

    schema,
    plugins: [
        structureTool({ structure }),
        visionTool({ defaultApiVersion: apiVersion }),
    ],
});
