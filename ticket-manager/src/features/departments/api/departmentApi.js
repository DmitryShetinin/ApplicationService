const API_URL="http://localhost:5353/api/departments";


export async function getDepartments(){

    const response = await fetch(API_URL);

    if(!response.ok)
        throw new Error(
            "Failed loading departments"
        );


    return await response.json();
}