// Simple pages (studio, guides, privacy, terms, 404): menu, contact links, booking, analytics,
// plus live previews for any work cards on the page
import { initPage, mountWorkMinis } from "./shared.js";

initPage();
const work = document.querySelector("[data-work]");
if (work) mountWorkMinis(work);
