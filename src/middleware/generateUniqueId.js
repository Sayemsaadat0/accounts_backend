const generateUniqueId = () => {
  // Get current timestamp (milliseconds since Unix epoch)
  const timestamp = new Date().getTime().toString();

  // Generate a random number with 4 digits
  const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();

  // Calculate the remaining length needed to make the ID 12 digits
  let remainingLength = 12 - (timestamp.length + randomNumber.length);
  remainingLength = Math.max(0, remainingLength); // Ensure non-negative

  // Generate additional random numbers to fill the remaining length
  const additionalRandom = Array.from({ length: remainingLength })
    .map(() => Math.floor(10 * Math.random()))
    .join("");

  // Concatenate timestamp, random numbers, and additional random numbers
  let uniqueId = timestamp + randomNumber + additionalRandom;

  // If the unique ID is longer than 12 digits, truncate it
  if (uniqueId.length > 12) {
    uniqueId = uniqueId.slice(0, 12);
  }
  // If the unique ID is shorter than 12 digits, pad it with zeros
  else if (uniqueId.length < 12) {
    const paddingLength = 12 - uniqueId.length;
    uniqueId = "0".repeat(paddingLength) + uniqueId;
  }

  console.log(uniqueId);

  return uniqueId;
};

module.exports = generateUniqueId;
