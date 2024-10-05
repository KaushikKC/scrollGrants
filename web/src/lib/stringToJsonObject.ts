export function stringToJsonObject(input: string): Record<string, any> {
  // Replace single quotes with double quotes to conform to JSON standards
  const jsonString = input.replace(/'/g, '"');

  // Parse the modified string into a JSON object
  try {
    const jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    console.error("Invalid JSON string", error);
    return {};
  }
}
