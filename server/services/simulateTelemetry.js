function generateTelemetry() {

  // Random operation mode
  const mode = Math.floor(Math.random() * 4);

  let air_temp;
  let process_temp;
  let rpm;
  let torque;
  let tool_wear;

  switch(mode){

    // Normal operation
    case 0:

      air_temp = 295 + Math.random() * 5;
      process_temp = 305 + Math.random() * 5;
      rpm = 1200 + Math.random() * 200;
      torque = 40 + Math.random() * 5;
      tool_wear = Math.random() * 50;

      break;


    // Moderate load
    case 1:

      air_temp = 300 + Math.random() * 10;
      process_temp = 310 + Math.random() * 10;
      rpm = 1400 + Math.random() * 300;
      torque = 45 + Math.random() * 10;
      tool_wear = 50 + Math.random() * 80;

      break;


    // High stress condition
    case 2:

      air_temp = 310 + Math.random() * 10;
      process_temp = 320 + Math.random() * 10;
      rpm = 1600 + Math.random() * 400;
      torque = 50 + Math.random() * 15;
      tool_wear = 100 + Math.random() * 80;

      break;


    // Critical failure state
    case 3:

      air_temp = 320 + Math.random() * 15;
      process_temp = 330 + Math.random() * 15;
      rpm = 1800 + Math.random() * 500;
      torque = 60 + Math.random() * 20;
      tool_wear = 150 + Math.random() * 100;

      break;

  }

  return {

    air_temp,
    process_temp,
    rpm,
    torque,
    tool_wear

  };

}

module.exports = generateTelemetry;