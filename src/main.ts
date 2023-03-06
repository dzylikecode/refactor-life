import { getConfig } from "./config";
import { parse, parseTitle } from "./parse";
import { render } from "./render";
import { attatchSliderToElement } from "./interact";

export async function main() {
  const config = await getConfig("./config.json");
  const rawFile = await (await fetch("./life.md")).text();
  const title = parseTitle(rawFile);
  const data = parse(rawFile);
  const [_, $life] = render(config, title, data);
  if ($life) attatchSliderToElement($life);
}

main();
