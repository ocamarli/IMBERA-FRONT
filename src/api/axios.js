

export async function postData(url = "", data = {}, token = undefined) {
  const response = await fetch(url, {
    method: "POST", 
    mode: "cors",
    headers: new Headers({
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(data).length,
      "Access-Control-Allow-Origin": "*",
      Authorization: token !== undefined ? "Bearer " + token : "0",
    }),
    
    body: JSON.stringify(data),
    
  });

  return response;
}
export async function getData(url = "", token = undefined) {
  const response = await fetch(url, {
    method: "GET", 
    mode: "cors",
    headers: new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: token !== undefined ? "Bearer " + token : "0",
    }),


  });

  return response;
}
