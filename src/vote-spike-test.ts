import { check, sleep } from "k6";
import http from "k6/http";
import { Options } from "k6/options";

const SITE_BASE = "https://yelb-ui-fauh45.cloud.okteto.net/";
const API_SUFFIX = "/api/";
const VOTE_CHOICE = ["ihop", "chipotle", "outback", "bucadibeppo"];

const chooseRandomChoice = () => {
  return VOTE_CHOICE[Math.floor(VOTE_CHOICE.length * Math.random())];
};

export const options: Options = {
  stages: [
    { duration: "2m", target: 25 },
    { duration: "2m", target: 50 },
    { duration: "5m", target: 2000 },
    { duration: "5m", target: 2500 },
    { duration: "10m", target: 0 },
  ],
};

const isNumeric = (str: string) => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
};

const isJSONObject = (str: string) => {
  try {
    const parsedObject = JSON.parse(str);

    if (parsedObject && typeof parsedObject === "object") {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
};

export default () => {
  const baseSiteResponse = http.get(SITE_BASE);
  check(baseSiteResponse, {
    "base site status is 200": (r) => r.status === 200,
    "base site is a valid HTML": (r) =>
      r.html().find("head title").text() === "Yelb",
  });

  sleep(1);

  const voteResponse = http.get(SITE_BASE + API_SUFFIX + chooseRandomChoice());
  check(voteResponse, {
    "vote response is 200": (r) => r.status === 200,
    "vote result is a valid number": (r) => isNumeric(r.body?.toString() || ""),
  });

  const voteSummaryResponse = http.get(SITE_BASE + API_SUFFIX + "getvotes");
  check(voteSummaryResponse, {
    "vote summary response is 200": (r) => r.status === 200,
    "vote summary is a valid JSON": (r) =>
      isJSONObject(r.body?.toString() || ""),
  });
  sleep(3);
};

export const handleSummary = (data: any) => {
  console.log("Preparing the end-of-test summary...");
  return {
    "./report/vote-spike-test.json": JSON.stringify(data),
  };
};
