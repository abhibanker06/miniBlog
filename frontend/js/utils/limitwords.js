export function limitWords(text, limit) {
  const words = text.split(" ");
  return words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "");
}