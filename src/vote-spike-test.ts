import { sleep } from "k6";
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

export default () => {
  http.get(SITE_BASE);
  sleep(1);

  http.get(SITE_BASE + API_SUFFIX + chooseRandomChoice());
  http.get(SITE_BASE + API_SUFFIX + "getvotes");
  sleep(3);
};
