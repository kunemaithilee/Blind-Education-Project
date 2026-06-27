import { apiGet } from "./api";

export function getCourses() {
  return apiGet("/courses", []);
}
