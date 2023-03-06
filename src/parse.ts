export interface Time {
  year: number;
  month: number;
  day: number;
}

export interface TimeSpan {
  start: Time;
  end: Time;
}

export interface TimeStamp extends TimeSpan {
  text: string;
}

export interface DocEvent {
  time: TimeStamp;
  text: string;
}

export function parse(rawFile: string): DocEvent[] {
  const list = rawFile.match(/\-\s+[^\n\r]+/gi);
  if (list == null) {
    return [];
  }
  const data = list.map((str) => {
    const matches = str.match(/\-\s+([\d\/\-\~]+)\s(.*)/i);
    const time = matches?.[1] ?? "";
    const text = matches?.[2] ?? "";
    return {
      time: parseTime(time),
      text: text,
    };
  });
  return data;
}

export function parseTitle(rawFile: string) {
  return rawFile.match(/[^\r\n]+/i)?.[0] ?? "";
}

function parseTime(time: string): TimeStamp {
  const rules = [
    {
      format: /^\~\d+$/, // ~YYYY
      parse(str: string): TimeSpan {
        const start = {
          year: parseInt(str.slice(1), 10),
          month: 0,
          day: 1,
        };
        const end = {
          year: start.year + 1,
          month: 0,
          day: 1,
        };
        return {
          start: start,
          end: end,
        };
      },
    },
    {
      format: /^\d+$/, // YYYY
      parse(str: string): TimeSpan {
        const start = {
          year: parseInt(str, 10),
          month: 0,
          day: 1,
        };
        const end = {
          year: start.year + 1,
          month: 0,
          day: 1,
        };
        return {
          start: start,
          end: end,
        };
      },
    },
    {
      format: /^\d+\/\d+$/, // MM/YYYY
      parse(str: string): TimeSpan {
        const [month, year] = str.split("/");
        const start = {
          year: parseInt(year, 10),
          month: parseInt(month, 10) - 1,
          day: 1,
        };
        const end = { ...getNextMonth(), day: 1 };
        return {
          start: start,
          end: end,
        };
        function getNextMonth() {
          if (start.month === 11) {
            return { year: start.year + 1, month: 0 };
          } else {
            return { year: start.year, month: start.month + 1 };
          }
        }
      },
    },
    {
      format: /^\d+\/\d+\/\d+$/, // DD/MM/YYYY
      parse(str: string): TimeSpan {
        const [day, month, year] = str.split("/");
        const start = {
          year: parseInt(year, 10),
          month: parseInt(month, 10),
          day: parseInt(day, 10),
        };
        return {
          start: start,
          end: start,
        };
      },
    },
    {
      format: /\d\-/, // TIME-TIME
      parse(str: string): TimeSpan {
        const [start, end] = str.split("-");
        return {
          start: parseTime(start).start,
          end: parseTime(end).start,
        };
      },
    },
  ];
  const defaultTime = getDefaultTime();

  const matchRule = rules.find((rule) => rule.format.test(time));
  const timeMsg = matchRule?.parse(time) ?? {
    start: defaultTime,
    end: defaultTime,
  };

  return { text: time, ...timeMsg };
  function getDefaultTime() {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  }
}
