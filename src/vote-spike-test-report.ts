import { generateSummaryReport } from "k6-html-reporter";

generateSummaryReport({
  jsonFile: "./report/vote-spike-test.json",
  output: "./report",
});
