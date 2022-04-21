import { sleep } from "k6";
import http from "k6/http";

export default () => {
  http.get("https://yelb-ui-fauh45.cloud.okteto.net/");

  sleep(1);
};
