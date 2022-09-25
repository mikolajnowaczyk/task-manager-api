export const REDIRECT = "REDIRECT";

export const redirect = link => {

  console.log("=== REDIRECT ACTION DISPATCHED ===");
  
  return { type: REDIRECT, payload: link };

};