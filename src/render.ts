import { DocEvent, TimeSpan, Time } from "./parse";

function injectStylesheet(url: string): void {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.body.appendChild(link);
}

export function render(config: any, title: string, docEvents: DocEvent[]) {
  const firstYear = Math.min(...docEvents.map((doc) => doc.time.start.year));
  const lastYear = Math.max(...docEvents.map((doc) => doc.time.end.year));
  const html = `
  <div id="life-events">
    <div id="life-years" class="comment_">
      ${renderYears(firstYear, lastYear, config).join("")}
    </div>
    ${docEvents
      .map((doc) =>
        renderEvent(doc, {
          yearLength: config.yearLength,
          originYear: firstYear,
        })
      )
      .join("")}
  </div>`;
  const $life = document.querySelector("#life");
  if ($life) $life.innerHTML = html;
  const $title = document.querySelector("#title");
  if ($title) $title.innerHTML = title;

  if (config.customStylesheetURL) {
    injectStylesheet(config.customStylesheetURL);
  }

  return [$title, $life];
}

function renderYears(
  begin: number,
  end: number,
  {
    yearLength: yearLength,
    hideAge: hideAge,
  }: { yearLength: number; hideAge: boolean }
): string[] {
  const years = Array.from(range(begin, end)).map(([year, age]) => {
    return `
    <div class="year" style="width: ${yearLength}px">
      <span>
        ${year}${hideAge ? "" : ` <i>(${age})</i>`}
      </span>
    </div>`;
  });

  return years;
  function* range(start: number, end: number) {
    for (let i = start, age = 0; i <= end + 1; i++, age++) {
      yield [i, age];
    }
  }
}

function renderEvent(
  docEvent: DocEvent,
  { yearLength, originYear }: { yearLength: number; originYear: number }
): string {
  const monthLength = yearLength / 12;
  const dayLength = monthLength / 30;

  return `
  <div class="event" style="margin-left: ${calcOffset(
    dayLength,
    originYear,
    docEvent.time.start
  ).toFixed(2)}px">
    <div class="time" style="width: ${calcWidth(
      dayLength,
      docEvent.time
    ).toFixed(2)}px"></div>
    <b>${docEvent.time.text}</b>
    ${parseMarkdownLinks(docEvent.text)}
  </div>`;

  function calcWidth(dayLength: number, time: TimeSpan): number {
    const startDate = new Date(
      time.start.year,
      time.start.month,
      time.start.day
    );
    const endDate = new Date(time.end.year, time.end.month, time.end.day);
    const daysDiff =
      (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
    return daysDiff * dayLength;
  }

  function calcOffset(
    dayLength: number,
    originYear: number,
    start: Time
  ): number {
    const startDate = new Date(originYear, 0, 1);
    const endDate = new Date(start.year, start.month, start.day);
    const daysDiff =
      (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
    return daysDiff * dayLength;
  }
}

function parseMarkdownLinks(text: string): string {
  // Parse Markdown links in the text
  // credit: http://stackoverflow.com/a/9268827
  const linkPattern = /\[([^\]]+)\]\(([^)"]+)(?: \"([^\"]+)\")?\)/g;
  const transLink = (
    _: string,
    title: string,
    url: string,
    titleAttr: string
  ) =>
    `<a href="${url}" ${titleAttr ? `title="${titleAttr}"` : ""}>${title}</a>`;
  return text.replace(linkPattern, transLink);
}
