const defaultConfig = {
  yearLength: 120, // 120px per year
  hideAge: false, // Hide age from year axis
  customStylesheetURL: null, // Custom stylesheet
};

export async function getConfig(fileName: string) {
  const fileConfig = await (await fetch(fileName)).json();
  return Object.assign(defaultConfig, fileConfig);
}
