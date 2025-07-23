import { AxiosInstance } from "axios";
import util from "util";
const log = util.debuglog("axios");

/**
 * Axios request interceptor to log request url if NODE_DEBIG=axios specified
 */
export default (client: AxiosInstance) => {
  client.interceptors.request.use((request) => {
    log("Request", request.url);
    return request;
  });
  client.interceptors.response.use((response) => {
    log("Response", response.data);
    return response;
  });
};
