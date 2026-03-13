async function predictFailure(data, vehicleType = "L") {

  const encodedType = {
    type_H: 0,
    type_L: 0,
    type_M: 0
  };

  if (vehicleType === "H") encodedType.type_H = 1;
  if (vehicleType === "L") encodedType.type_L = 1;
  if (vehicleType === "M") encodedType.type_M = 1;

  const payload = {
    ...data,
    ...encodedType
  };

  const response = await fetch(
  `${process.env.ML_API_URL}/predict`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);

  const result = await response.json();

  return result.failure_probability;
}

module.exports = predictFailure;