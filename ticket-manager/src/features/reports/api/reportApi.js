const API_URL="http://localhost:5353/api/report";

export async function getReport(){

    const response=await fetch(API_URL);

    if(!response.ok)
        throw new Error("Failed loading report");

    return await response.json();

}